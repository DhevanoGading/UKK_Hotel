"use strict";

//import
const db = require('../db');
const moment = require("moment");

//endpoints
module.exports = {
    //menampilkan semua pemesanan
    getAll: (req, res) => {
        db.query(`SELECT * FROM pemesanan`, (err, result) => {
            if (err) throw err
            res.json({
                message: "Berhasil menampikan semua data pemesanan",
                pemesanan: result
            });
        });
    },

    //menampilkan pemesanan berdasarkan id
    getId: (req, res) => {
        const id = req.params.id;

        db.query(`SELECT * FROM pemesanan WHERE id_pemesanan = ${id}`, (err, result) => {
            if (err) throw err
            res.json({
                message: `Berhasil menampikan data pemesanan dengan id ${id}`,
                pemesanan: result
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
            status_pemesanan: req.body.status_pemesanan,
            id_user: req.body.id_user
        };
        db.query(`INSERT INTO pemesanan SET ?`, pemesanan, (err, result) => {
            if (err) throw err;
            res.json({
                message: "Berhasil menambahkan pemesanan",
                pemesanan: pemesanan
            });
        });
    },

    //mengubah pemesanan
    update: (req, res) => {
        const id = req.params.id;
        let pemesanan = {
            nomor_pemesanan: req.body.nomor_pemesanan,
            nama_pemesanan: req.body.nama_pemesanan,
            email_pemesanan: req.body.email_pemesanan,
            tgl_check_in: req.body.tgl_check_in,
            tgl_check_out: req.body.tgl_check_out,
            nama_tamu: req.body.nama_tamu,
            jumlah_kamar: req.body.jumlah_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar,
            status_pemesanan: req.body.status_pemesanan,
            id_user: req.body.id_user
        };
        db.query(`UPDATE pemesanan SET ? WHERE id_pemesanan = '${id}'`, pemesanan, (err, result) => {
            if (err) throw err;
            res.json({
                message: "Berhasil mengubah pemesanan",
                pemesanan: pemesanan,
            });
        });
    },

    //menghapus data pemesanan
    delete: (req, res) => {
        const id = req.params.id;

        db.query(`DELETE FROM pemesanan WHERE id_pemesanan = '${id}'`, (err, result) => {
            if(null, err) throw err;
            res.json({
                message: "Berhasil menghapus data pemesanan",
                pemesanan: result
            });
        });
    }
}