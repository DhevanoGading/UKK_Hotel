"use strict";

//import
const db = require('../db');

//endpoints
module.exports = {
    //menampilkan semua tipe kamar
    getAll: (req, res) => {
        db.query(`SELECT * FROM tipe_kamar`, (err, result) => {
            if (err) throw err
            res.json({
                message: "Berhasil menampikan semua data tipe kamar",
                tipe_kamar: result
            });
        });
    },

    //menampilkan tipe kamar berdasarkan id
    getId: (req, res) => {
        const id = req.params.id;

        db.query(`SELECT * FROM tipe_kamar WHERE id_tipe_kamar = ${id}`, (err, result) => {
            if (err) throw err
            res.json({
                message: `Berhasil menampikan data tipe kamar dengan id ${id}`,
                tipe_kamar: result
            });
        });
    },

    //menambahkan tipe kamar
    add: (req, res) => {
        let tipe_kamar = {
            nama_tipe_kamar: req.body.nama_tipe_kamar,
            // foto_tipe_kamar: req.body.foto_tipe_kamar,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi,
        };
        if (!tipe_kamar.nama_tipe_kamar || /*!tipe_kamar.foto_tipe_kamar,*/ !tipe_kamar.harga || !tipe_kamar.deskripsi) {
            res.json({
                message: "Nama, harga, dan deskripsi harus diisi!",
            });
        } else {
            db.query(`INSERT INTO tipe_kamar SET ?`, tipe_kamar, (err, result) => {
                if (err) throw err;
                res.json({
                    message: "Berhasil menambahkan tipe_kamar",
                    tipe_kamar: tipe_kamar
                });
            });
        };
    },

    //mengubah tipe_kamar
    update: (req, res) => {
        const id = req.params.id;
        let tipe_kamar = {
            nama_tipe_kamar: req.body.nama_tipe_kamar,
            // foto_tipe_kamar: req.body.foto_tipe_kamar,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi,
        };
        if (!tipe_kamar.nama_tipe_kamar || /*!tipe_kamar.foto_tipe_kamar ||*/ !tipe_kamar.harga || !tipe_kamar.deskripsi) {
            res.json({
                message: "Nama tipe kamar, foto, harga, dan deskripsi harus diisi!",
            });
        } else {
            db.query(`UPDATE tipe_kamar SET ? WHERE id_tipe_kamar = '${id}'`, tipe_kamar, (err, result) => {
                if (err) throw err;
                res.json({
                    message: "Berhasil mengubah tipe_kamar",
                    tipe_kamar: tipe_kamar,
                });
            });
        };
    },

    //menghapus data tipe_kamar
    delete: (req, res) => {
        const id = req.params.id;

        db.query(`DELETE FROM tipe_kamar WHERE id_tipe_kamar = '${id}'`, (err, result) => {
            if(null, err) throw err;
            res.json({
                message: "Berhasil menghapus data tipe_kamar",
                tipe_kamar: result
            });
        });
    }
}