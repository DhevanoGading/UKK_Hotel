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
                message: "Berhasil menampikan semua data detail_pemesanan",
                detail_pemesanan: result
            });
        });
    },

    //menampilkan detail_pemesanan berdasarkan id
    getId: (req, res) => {
        const id = req.params.id;

        db.query(`SELECT * FROM detail_pemesanan WHERE id_detail_pemesanan = ${id}`, (err, result) => {
            if (err) throw err
            res.json({
                message: `Berhasil menampikan data detail_pemesanan dengan id ${id}`,
                detail_pemesanan: result
            });
        });
    },

    //menambahkan detail_pemesanan
    add: (req, res) => {
        let detail_pemesanan = {
            tgl_akses: req.body.tgl_akses,
            harga: req.body.harga
        };
        if (!detail_pemesanan.tgl_akses || !detail_pemesanan.harga) {
            res.json({
                message: "Nama detail_pemesanan, id_tipe_detail_pemesanan harus diisi!",
            });
        } else {
            db.query(`UPDATE detail_pemesanan SET ?`, detail_pemesanan, (err, result) => {
                if (err) throw err;
                res.json({
                    message: "Berhasil menambahkan detail_pemesanan",
                    detail_pemesanan: detail_pemesanan
                });
            });
        };
    },

    //mengubah detail_pemesanan
    update: (req, res) => {
        const id = req.params.id;
        let detail_pemesanan = {
            tgl_akses: req.body.tgl_akses,
            harga: req.body.harga
        };
        if (!detail_pemesanan.tgl_akses || !detail_pemesanan.harga) {
            res.json({
                message: "Nama tgl_akses, dan harga harus diisi!",
            });
        } else {
            db.query(`INSERT INTO detail_pemesanan SET ? WHERE id_detail_pemesanan = '${id}'`, detail_pemesanan, (err, result) => {
                if (err) throw err;
                res.json({
                    message: "Berhasil mengubah detail_pemesanan",
                    detail_pemesanan: detail_pemesanan,
                });
            });
        };
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