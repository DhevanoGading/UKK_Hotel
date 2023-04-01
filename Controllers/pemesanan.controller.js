"use strict";

//import
const db = require('../db');
const moment = require("moment");

//endpoints
module.exports = {
    //menampilkan semua data pemesanan
    getAll: (req, res) => {
        let sql = `
            SELECT pemesanan.*, tipe_kamar.*, user.* 
            FROM pemesanan 
            LEFT JOIN tipe_kamar ON tipe_kamar.id_tipe_kamar = pemesanan.id_tipe_kamar 
            LEFT JOIN user ON user.id_user = pemesanan.id_user
        `;

        db.query(sql, (err, result) => {
            if (err) throw err;
            res.json({
                count: result.length,
                message: "Berhasil menampikan semua data pemesanan",
                pemesanan: result
            });
        });
    },

    //menampilkan data pemesanan berdasarkan kondisi
    getPemesanan: (req, res) => {
        const nama_pemesanan = req.body.nama_pemesanan;
        const tgl_check_in = req.body.tgl_check_in;
        
        let kondisi = '';

        if (nama_pemesanan && tgl_check_in) {
            kondisi = `
            WHERE nama_pemesanan LIKE '%${nama_pemesanan}%'
            AND pemesanan.tgl_check_in >= '${tgl_check_in}'
            AND pemesanan.tgl_check_in < DATE_ADD('${tgl_check_in}', INTERVAL 1 DAY)
            `;
        } else if (nama_pemesanan) {
            kondisi = `
            WHERE nama_pemesanan LIKE '%${nama_pemesanan}%'
            `;
        } else if (tgl_check_in) {
            kondisi = `
            WHERE pemesanan.tgl_check_in >= '${tgl_check_in}'
            AND pemesanan.tgl_check_in < DATE_ADD('${tgl_check_in}', INTERVAL 1 DAY)
            `;
        }
        
        const sql = `
            SELECT pemesanan.*, tipe_kamar.*, user.*
            FROM pemesanan
            LEFT JOIN tipe_kamar ON pemesanan.id_tipe_kamar = tipe_kamar.id_tipe_kamar
            LEFT JOIN user ON pemesanan.id_user = user.id_user
            ${kondisi}
        `;

        db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query', error);
            return res.json({ message: error.message });
        }
    
        return res.json({ count: result.length, data: result });
        });
    },

    //mencari data pemesanan
    find: (req, res) => {
        let keyword = req.body.keyword;

        let sql = `
            SELECT * FROM pemesanan
            INNER JOIN tipe_kamar ON pemesanan.id_tipe_kamar = tipe_kamar.id_tipe_kamar
            INNER JOIN user ON pemesanan.id_user = user.id_user
            WHERE 
                nomor_pemesanan LIKE '%${keyword}%' OR
                nama_pemesanan LIKE '%${keyword}%' OR
                email_pemesanan LIKE '%${keyword}%' OR
                nama_tamu LIKE '%${keyword}%'
        `;

        db.query(sql, (err, result) => {
            if(err) throw err;
            res.json({
                count: result.length,
                message: "Berhasil mengambil data pemesanan",
                data: result
            });
        });
    },

    //menambahkan pemesanan
    add: (req, res) => {
        let pemesanan = {
            nomor_pemesanan: req.body.nomor_pemesanan,
            nama_pemesanan: req.body.nama_pemesanan,
            email_pemesanan: req.body.email_pemesanan,
            tgl_check_in: req.body.tgl_check_in,
            tgl_check_out: req.body.tgl_check_out,
            nama_tamu: req.body.nama_tamu,
            jumlah_kamar: req.body.jumlah_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar,
            status_pemesanan: "baru",
            id_user: req.body.id_user
        }
        db.query(`INSERT INTO pemesanan SET ?`, pemesanan, (err, result) => {
            if (err) throw err;

            let id_tipe_kamar = req.body.id_tipe_kamar;

            db.query(`SELECT harga FROM tipe_kamar WHERE id_tipe_kamar = ${id_tipe_kamar}`, (err, rows) => {

                let tgl_check_in = new Date(req.body.tgl_check_in);
                let tgl_check_out = new Date(req.body.tgl_check_out);
                let jumlah_hari = (tgl_check_out.getTime() - tgl_check_in.getTime()) / (1000 * 3600 * 24);

                console.log(jumlah_hari);

                let id_pemesanan = result.insertId;
                let harga = rows[0].harga;
                let id_kamar = req.body.id_kamar;

                let detail = [];

                for (let i = 0; i < id_kamar.length; i++) {
                    let tgl_akses = tgl_check_in;
                    
                    for (let j = 0; j < jumlah_hari; j++) {

                        let detail_pemesanan = {
                            id_pemesanan: id_pemesanan,
                            id_kamar: id_kamar[i],
                            tgl_akses: tgl_akses,
                            harga: harga
                        }

                        detail.push({
                            id_pemesanan: id_pemesanan,
                            id_kamar: id_kamar[i],
                            tgl_akses: tgl_akses,
                            harga: harga

                        })

                        db.query(`INSERT INTO detail_pemesanan SET ?`, detail_pemesanan, (err, result) => {
                            if (err) throw err;
                        });

                        tgl_akses = new Date(tgl_akses.getTime() + 86400000)
                    }
                }

                
                console.log('detail_pemesanan', detail);
                
                res.json({
                    message: "Berhasil melakukan pemesanan",
                    pemesanan: pemesanan,
                    detail_pemesanan: detail
                });
            });
        });
    },
    
    //menghapus data pemesanan
    delete: (req, res) => {
        //mengambil id pemesanan
        const id = req.params.id;

        let queryMenghapusDetailPemesanan = `
            DELETE FROM detail_pemesanan WHERE id_pemesanan = ${id}
        `;
        
        let queryMenghapusPemesanan = `
            DELETE FROM pemesanan WHERE id_pemesanan = ${id}
        `;
        db.query(queryMenghapusDetailPemesanan, (err, result) => {
            if(err) throw err;
        });

        db.query(queryMenghapusPemesanan, (err, result) => {
            if(null, err) throw err;
            res.json({
                count: result.length,
                message: "berhasil menghapus pemesanan",
                result
            })
        });
    },

    //update status pemesanan
    updateStatus: (req, res) => {
        const id = req.params.id;
        let status_pemesanan = req.body.status_pemesanan;

        let queryMenghapusDetailPemesanan = `
            DELETE FROM detail_pemesanan WHERE id_pemesanan = ${id}
        `;

        console.log('status_pemesanan', status_pemesanan);
        
        if (status_pemesanan === "check_out") {
            db.query(queryMenghapusDetailPemesanan, (err, result) => {
                if(null, err) throw err;

                db.query(`UPDATE pemesanan SET status_pemesanan = '${status_pemesanan}' WHERE id_pemesanan = ${id}`, (err, result) => {
                    if (null) throw err;
                    res.json({
                        message: "berhasil mengubah status pemesanan dan menghapus detail pemesanan",
                        status: status_pemesanan,
                        result
                    });
                });
            });

        } else {
            db.query(`UPDATE pemesanan SET status_pemesanan = '${status_pemesanan}' WHERE id_pemesanan = ${id}`, (err, result) => {
                if (null) throw err;
                res.json({
                    message: "Berhasil mengubah status pemesanan",
                    status: status_pemesanan,
                    result
                });
            });
        }
    }
}