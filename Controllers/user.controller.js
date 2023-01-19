"use strict";

//import
const db = require('../db');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const KEY = "UKKHOTEL";

//endpoints
module.exports = {
    //menampilkan semua user
    getAll: (req, res) => {
        db.query(`SELECT * FROM user`, (err, result) => {
            if (err) throw err
            res.json({
                message: "Berhasil menampikan semua data user",
                user: result
            });
        });
    },

    //menampilkan user berdasarkan id
    getId: (req, res) => {
        const id = req.params.id;

        db.query(`SELECT * FROM user WHERE id_user = ${id}`, (err, result) => {
            if (err) throw err
            res.json({
                message: `Berhasil menampikan data user dengan id ${id}`,
                user: result
            });
        });
    },

    //menambahkan user
    add: (req, res) => {
        let user = {
            nama_user: req.body.nama_user,
            foto_user: req.body.filename,
            email: req.body.email,
            password: md5(req.body.password),
            role: req.body.role,
        };
        if (!user.nama_user || !user.email || !user.foto_user || !user.password || !user.role) {
            res.json({
                message: "Nama, Foto, Email, Foto, dan Password harus diisi!",
            });
        } else {
            db.query(`INSERT INTO user SET ?`, user, (err, result) => {
                if (err) throw err;
                res.json({
                    message: "Berhasil menambahkan user",
                    user: user,
                });
            });
        };
    },

    //mengubah user
    update: (req, res) => {
        const id = req.params.id;
        let user = {
            nama_user: req.body.nama_user,
            foto_user: req.body.filename,
            email: req.body.email,
            password: md5(req.body.password),
            role: req.body.role,
        };
        if (!user.nama_user || !user.email || !user.foto_user || !user.password || !user.role) {
            res.json({
                message: "Nama, Foto, Email, dan Password harus diisi!",
            });
        } else {
            db.query(`UPDATE user SET ? WHERE id_user = '${id}'`, user, (err, result) => {
                if (err) throw err;
                res.json({
                    message: "Berhasil mengubah user",
                    user: user,
                });
            });
        };
    },

    //menghapus data user
    delete: (req, res) => {
        const id = req.params.id;

        db.query(`DELETE FROM user WHERE id_user = '${id}'`, (err, result) => {
            if(null, err) throw err;
            res.json({
                message: "Berhasil menghapus data user",
                user: result
            });
        });
    },

    //login user
    login: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password){
            res.json({
                message: "Email dan Password harus diisi!"
            });
        } else {
            db.query(`SELECT * FROM user WHERE email = '${email}'`, (err, result) => {
                const user = result[0];
    
                if (typeof user === "undefined") {
                    res.status(401).json({ message: "User not found" });
                } else {
                    if (user.password === md5(password)) {
                        const token = jwt.sign({ user: user }, KEY);
                        res.json({
                            logged: true,
                            user: user,
                            token: token
                        });
                    } else {
                        res.json({
                            message: "Invalid password"
                        });
                    }
                }
            });
        }
    },

    //search user
    // find: (req, res) => {
    //     let find = req.body.find;
    //     let sql = "SELECT * FROM user WHERE nama_user like '%" + find + "%' or id_user like '%" + find + "%' or email like '%" + find + "%'";

    //     db.query(sql, (err, result) => {
    //         if (err) {
    //             throw err;
    //         } else {
    //             res.json({
    //                 result
    //             });
    //         }
    //     });
    // },
}