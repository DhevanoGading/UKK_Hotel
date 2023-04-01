"use strict";

//import
const db = require('../db');
const fs = require('fs');
const path = require('path');

//endpoints
module.exports = {
    //menampilkan semua tipe kamar
    getAll: (req, res) => {
        db.query(`SELECT * FROM tipe_kamar`, (err, result) => {
            if (err) throw err
            res.json({
                count: result.length,
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
                count: result.length,
                message: `Berhasil menampikan data tipe kamar dengan id ${id}`,
                tipe_kamar: result
            });
        });
    },

    //menambahkan tipe kamar
    add: (req, res) => {
        let tipe_kamar = {
            nama_tipe_kamar: req.body.nama_tipe_kamar,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi,
        };
        if (!tipe_kamar.nama_tipe_kamar || !tipe_kamar.harga || !tipe_kamar.deskripsi) {
            res.json({
                message: "Nama, harga, dan deskripsi harus diisi!",
            });

        } else if (req.file) {
            tipe_kamar.foto_tipe_kamar = req.file.filename,
            db.query(`INSERT INTO tipe_kamar SET ?`, tipe_kamar, (err, result) => {
                if (err) throw err;
                res.json({
                    message: "Berhasil menambahkan tipe_kamar",
                    tipe_kamar: tipe_kamar
                });
            });

        } else {
            res.json({
                message: "Foto tipe kamar harus diisi!",
            });
        };
    },

    //mengubah tipe_kamar
    update: (req, res) => {
        const id = req.params.id;
        let tipe_kamar = {
            nama_tipe_kamar: req.body.nama_tipe_kamar,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi,
        };
        if (!tipe_kamar.nama_tipe_kamar || !tipe_kamar.harga || !tipe_kamar.deskripsi) {
            res.json({
                message: "Nama tipe kamar, foto, harga, dan deskripsi harus diisi!",
            });

        } else {
            db.query(`UPDATE tipe_kamar SET ? WHERE id_tipe_kamar = '${id}'`, tipe_kamar, (err, result) => {
                if (err) throw err;
                res.json({
                    message: "Berhasil mengubah tipe kamar",
                    tipe_kamar: tipe_kamar,
                });
            });
        };
    },

    //update foto tipe kamar
    updateFotoKamar: (req, res) => {
        let id = req.params.id;

        //mengambil data foto lama kamar
        db.query(`SELECT foto_tipe_kamar FROM tipe_kamar WHERE id_tipe_kamar = '${id}'`, (err, rows) => {
            const fotoLamaTipeKamar = rows[0].foto_tipe_kamar

            if (req.file){
                let foto_tipe_kamar = req.file.filename;
    
                db.query(`UPDATE tipe_kamar SET foto_tipe_kamar = '${foto_tipe_kamar}' WHERE id_tipe_kamar = '${id}'`, (err, result) => {
                    if (err) throw err;
                    res.json({
                        message: "Berhasil mengubah foto profile",
                        deleted: fotoLamaTipeKamar,
                        updated: foto_tipe_kamar
                    });
    
                    //menghapus foto lama
                    if (fotoLamaTipeKamar) {
                        const filePath = path.join(__dirname, "../Images/tipe-kamar", fotoLamaTipeKamar);
                        fs.unlink(filePath, (err) => {
                            if (err) throw err;
                            console.log('Deleted file:', filePath);
                        });
                    }
                });
            }
        })
    },

    //menghapus data tipe_kamar
    delete: (req, res) => {
        const id = req.params.id;

        db.query(`SELECT foto_tipe_kamar FROM tipe_kamar WHERE id_tipe_kamar = '${id}'`, (err, rows) => {

            const fotoLamaTipeKamar = rows[0].foto_tipe_kamar

            //menghapus data tipe kamar
            db.query(`DELETE FROM tipe_kamar WHERE id_tipe_kamar = '${id}'`, (err, result) => {
                if(null, err){
                    throw err;

                }else{
                    //menghapus foto lama
                    if (fotoLamaTipeKamar) {
                        const filePath = path.join(__dirname, "../Images/tipe-kamar", fotoLamaTipeKamar);
                        fs.unlink(filePath, (err) => {
                            if (err) throw err;
                            console.log('Deleted file:', filePath);
                        });
                    }

                    res.json({
                        message: "Berhasil menghapus data tipe_kamar",
                        tipe_kamar: result
                    });
                }
            });
        })
    },

    //search tipe kamar
    find: (req, res) => {
        let keyword = req.body.keyword;
        let sql = "SELECT * FROM tipe_kamar WHERE nama_tipe_kamar like '%" + keyword + "%' or id_tipe_kamar like '%" + keyword + "%' or harga like '%" + keyword + "%' or deskripsi like '%" + keyword + "%'";

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
    }
}