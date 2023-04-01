"use strict";

//import
const db = require('../db');

//endpoints
module.exports = {
    //menampilkan semua detail_pemesanan
    getAll: (req, res) => {
        db.query(`SELECT * FROM detail_pemesanan`, (err, result) => {
            if (err) throw err
            res.json({
                count: result.length,
                message: "Berhasil menampikan semua data detail_pemesanan",
                detail_pemesanan: result
            });
        });
    },

    //filtering sisa kamar
    sisaKamar: (req, res) => {
        let tgl_check_in = req.body.tgl_check_in;
        let tgl_check_out = req.body.tgl_check_out;

        let sql = `
            SELECT tipe_kamar.*, 
            count(kamar.id_kamar) 
                as sisa_kamar
            FROM kamar
            LEFT JOIN 
                tipe_kamar ON kamar.id_tipe_kamar = tipe_kamar.id_tipe_kamar
            LEFT JOIN 
                detail_pemesanan ON detail_pemesanan.id_kamar = kamar.id_kamar 
            AND  
                detail_pemesanan.tgl_akses BETWEEN "${tgl_check_in}" AND "${tgl_check_out}"
            WHERE 
                detail_pemesanan.tgl_akses IS NULL
            GROUP BY 
                tipe_kamar.id_tipe_kamar
        `;

        db.query(sql, (err, result) => {
            if(err) throw err;
            res.json({
                count: result.length,
                message: "Berhasil mengambil data detail pemesanan",
                data: result
            });
        });
    },

    //mencari data detail pemesanan berdasarkan tgl akses
    find: (req, res) => {
        const tgl_check_in = req.body.tgl_check_in;
        const tgl_check_out = req.body.tgl_check_out;
        
        const sql = `
            SELECT detail_pemesanan.*, pemesanan.*, kamar.*, tipe_kamar.*
            FROM detail_pemesanan
            INNER JOIN pemesanan ON detail_pemesanan.id_pemesanan = pemesanan.id_pemesanan
            INNER JOIN kamar ON detail_pemesanan.id_kamar = kamar.id_kamar
            INNER JOIN tipe_kamar ON kamar.id_tipe_kamar = tipe_kamar.id_tipe_kamar
            WHERE tgl_akses BETWEEN "${tgl_check_in}" AND "${tgl_check_out}"
        `;
        
        db.query(sql, (error, result) => {
        if (error) {
            console.error('Error executing query', error);
            return res.json({ message: error.message });
        }
    
        return res.json({ 
                count: result.length,
                data: result 
            });
        });
    },

    //menghapus data detail_pemesanan
    delete: (req, res) => {
        const id = req.params.id;

        db.query(`DELETE FROM detail_pemesanan WHERE id_detail_pemesanan = '${id}'`, (err, result) => {
            if(null, err) throw err;
            res.json({
                message: "Berhasil menghapus data detail_pemesanan",
                detail_pemesanan: result
            });
        });
    }
}