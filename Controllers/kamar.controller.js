"use strict";

//import
const db = require('../db');

//endpoints
module.exports = {
    //menampilkan semua kamar
    getAll: (req, res) => {
        db.query(`SELECT * FROM kamar`, (err, result) => {
            if (err) throw err
            res.json({
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
            db.query(`UPDATE kamar SET ?`, kamar, (err, result) => {
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
            db.query(`INSERT INTO kamar SET ? WHERE id_kamar = '${id}'`, kamar, (err, result) => {
                if (err) throw err;
                res.json({
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
                message: "Berhasil menghapus data kamar",
                kamar: result
            });
        });
    }
}