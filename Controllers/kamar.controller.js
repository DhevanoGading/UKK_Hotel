"use strict";

//import
const db = require('../db');

//endpoints
module.exports = {
    //menampilkan semua kamar beserta tipe kamar
    getAll: (req, res) => {
        db.query(`SELECT * FROM kamar JOIN tipe_kamar ON kamar.id_tipe_kamar = tipe_kamar.id_tipe_kamar`, (err, result) => {
            if (err) throw err
            res.json({
                count: result.length,
                message: "Berhasil menampikan semua data kamar",
                kamar: result
            });
        });
    },

    //menampilkan kamar berdasarkan id
    getId: (req, res) => {
        const id = req.params.id;

        db.query(`SELECT * FROM kamar WHERE id_kamar = ${id}`, (err, result) => {
            if (err) throw err
            res.json({
                count: result.length,
                message: `Berhasil menampikan data kamar dengan id ${id}`,
                kamar: result
            });
        });
    },

    //menambahkan kamar
    add: (req, res) => {
        let kamar = {
            nomor_kamar: req.body.nomor_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar
        };
        if (!kamar.nomor_kamar || !kamar.id_tipe_kamar) {
            res.json({
                message: "Nama Kamar, id_tipe_kamar harus diisi!",
            });
        } else {
            db.query(`INSERT INTO kamar SET ?`, kamar, (err, result) => {
                if (err) throw err;
                res.json({
                    message: "Berhasil menambahkan kamar",
                    kamar: kamar
                });
            });
        };
    },

    //mengubah kamar
    update: (req, res) => {
        const id = req.params.id;
        let kamar = {
            nomor_kamar: req.body.nomor_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar
        };
        if (!kamar.nomor_kamar || !kamar.id_tipe_kamar) {
            res.json({
                message: "Nama kamar, dan id_tipe_kamar harus diisi!",
            });
        } else {
            db.query(`UPDATE kamar SET ? WHERE id_kamar = '${id}'`, kamar, (err, result) => {
                if (err) throw err;
                res.json({
                    count: result.length,
                    message: "Berhasil mengubah kamar",
                    kamar: kamar,
                });
            });
        };
    },

    //menghapus data kamar
    delete: (req, res) => {
        const id = req.params.id;

        db.query(`DELETE FROM kamar WHERE id_kamar = '${id}'`, (err, result) => {
            if(null, err) throw err;
            res.json({
                count: result.length,
                message: "Berhasil menghapus data kamar",
                kamar: result
            });
        });
    },

    //search kamar
    find: (req, res) => {
        let keyword = req.body.keyword;
        
        let sql = "SELECT * FROM kamar INNER JOIN tipe_kamar ON kamar.id_tipe_kamar = tipe_kamar.id_tipe_kamar WHERE nomor_kamar like '%" + keyword + "%' or id_kamar like '%" + keyword + "%'";

        db.query(sql, (err, result) => {
            if (err) {
                throw err;
            } else {
                res.json({
                    count: result.length,
                    result
                });
            }
        });
    },

    //mencari kamar tersedia
    kamarTersedia : (req, res) => {
        let tgl_check_in = req.body.tgl_check_in;
        let tgl_check_out = req.body.tgl_check_out;

        let queryKamar = `
            SELECT kamar.*, tipe_kamar.id_tipe_kamar, tipe_kamar.nama_tipe_kamar
            FROM kamar
            INNER JOIN tipe_kamar ON kamar.id_tipe_kamar = tipe_kamar.id_tipe_kamar
        `;

        let queryKamarDipesan = `
            SELECT kamar.*, tipe_kamar.id_tipe_kamar, tipe_kamar.nama_tipe_kamar
            FROM kamar
            INNER JOIN tipe_kamar ON kamar.id_tipe_kamar = tipe_kamar.id_tipe_kamar
            INNER JOIN detail_pemesanan ON kamar.id_kamar = detail_pemesanan.id_kamar
            WHERE detail_pemesanan.tgl_akses BETWEEN "${tgl_check_in}" AND "${tgl_check_out}"
        `;

        db.query(queryKamar, (error, dataKamar) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Database error.' });
        }

            db.query(queryKamarDipesan, (error, dataKamarDipesan) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Database error.' });
                }

                let kamarTersedia = [];
                let kamarTersediaBerdasarkanTipeKamar = [];

                for (let i = 0; i < dataKamar.length; i++) {
                    let isBooked = false;

                    for (let j = 0; j < dataKamarDipesan.length; j++) {
                        if (dataKamar[i].id_kamar === dataKamarDipesan[j].id_kamar) {
                            isBooked = true;
                            break;
                        }
                    }

                    if (!isBooked) {
                        kamarTersedia.push(dataKamar[i]);
                    }
                }

                for (let i = 0; i < dataKamar.length; i++) {
                    let tipe_kamar = {};
                    tipe_kamar.id_tipe_kamar = dataKamar[i].id_tipe_kamar;
                    tipe_kamar.nama_tipe_kamar = dataKamar[i].nama_tipe_kamar;
                    tipe_kamar.kamar = [];

                    for (let j = 0; j < kamarTersedia.length; j++) {
                        if (kamarTersedia[j].id_tipe_kamar === dataKamar[i].id_tipe_kamar) {
                            tipe_kamar.kamar.push(kamarTersedia[j]);
                        }
                    }

                    let tipe_kamar_exists = kamarTersediaBerdasarkanTipeKamar.some((item) => item.id_tipe_kamar === tipe_kamar.id_tipe_kamar);

                    if (!tipe_kamar_exists && tipe_kamar.kamar.length > 0) {
                        kamarTersediaBerdasarkanTipeKamar.push(tipe_kamar);
                    }
                }

                return res.json({ 
                    countKamarTersedia: kamarTersedia.length,
                    kamarTersedia: kamarTersedia, 
                    kamar: kamarTersediaBerdasarkanTipeKamar 
                });
            });
        });
    },

    kamarDipesan: (req, res) => {

        const tglHariIni = req.body.tgl_hari_ini;

        const query = `
            SELECT 
            tipe_kamar.id_tipe_kamar, 
            tipe_kamar.nama_tipe_kamar, 
            COUNT(kamar.id_kamar) AS jumlah_kamar 
            FROM 
            tipe_kamar
            JOIN kamar ON kamar.id_tipe_kamar = tipe_kamar.id_tipe_kamar 
            JOIN detail_pemesanan ON detail_pemesanan.id_kamar = kamar.id_kamar 
            WHERE 
            detail_pemesanan.tgl_akses >= '${tglHariIni}' 
            AND detail_pemesanan.tgl_akses < DATE_ADD('${tglHariIni}', INTERVAL 1 DAY) 
            GROUP BY 
            tipe_kamar.id_tipe_kamar, 
            tipe_kamar.nama_tipe_kamar
        `;

        db.query(query, (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });

            } else {
                let kamarDipesanBerdasarkanTipeKamar = [];
                let totalKamarDipesan = 0;

                for (let i = 0; i < results.length; i++) {
                    let tipeKamar = {};
                    tipeKamar.id_tipe_kamar = results[i].id_tipe_kamar;
                    tipeKamar.nama_tipe_kamar = results[i].nama_tipe_kamar;
                    tipeKamar.jumlah_kamar = results[i].jumlah_kamar;
                    totalKamarDipesan += results[i].jumlah_kamar;
                    kamarDipesanBerdasarkanTipeKamar.push(tipeKamar);
                }

                res.json({
                    totalKamarDipesan: totalKamarDipesan,
                    kamarDipesanBerdasarkanTipeKamar: kamarDipesanBerdasarkanTipeKamar
                });
            }
        });
    }
}