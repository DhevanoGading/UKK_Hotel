"use strict";

//import
const db = require('../db');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

//endpoints
module.exports = {
    //menampilkan semua user
    getAll: (req, res) => {
        db.query(`SELECT * FROM user`, (err, result) => {
            if (err) throw err
            res.json({
                count: result.length,
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
                count: result.length,
                message: `Berhasil menampikan data user dengan id ${id}`,
                user: result
            });
        });
    },

    //menambahkan user
    add: (req, res) => {
        let user = {
            nama_user: req.body.nama_user,
            email: req.body.email,
            password: md5(req.body.password),
            role: req.body.role,
        };

        if (!user.nama_user || !user.email || !user.password || !user.role) {
            res.json({
                message: "Nama, Email, Foto, dan Password harus diisi!",
            });

        } else if (req.file){
            user.foto_user = req.file.filename,
            db.query(`INSERT INTO user SET ?`, user, (err, result) => {
                if (err) throw err;
                res.json({
                    message: "Berhasil menambahkan user",
                    user: user,
                });
            });

        } else {
            res.json({
                message: "Foto user harus diisi!",
            });
        };
    },

    //mengubah data user
    update: (req, res) => {
        const id = req.params.id;
        let user = {
            nama_user: req.body.nama_user,
            email: req.body.email,
            role: req.body.role,
        };
        
        if (!user.nama_user || !user.email || !user.role) {
            res.json({
                message: "Nama, Email, dan Password harus diisi!",
            });

        } else if (req.body.password){
            user.password = md5(req.body.password);

            db.query(`UPDATE user SET ? WHERE id_user = '${id}'`, user, (err, result) => {
                if (err) throw err;
                res.json({
                    message: "Berhasil mengubah user",
                    user: user,
                });
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

    //update foto profile
    updateFotoProfile: (req, res) => {
        let id = req.params.id;

        //mengambil data foto lama user
        db.query(`SELECT foto_user FROM user WHERE id_user = '${id}'`, (err, rows) => {
            const fotoLamaUser = rows[0].foto_user

            if (req.file){
                let foto_user = req.file.filename;
    
                db.query(`UPDATE user SET foto_user = '${foto_user}' WHERE id_user = '${id}'`, (err, result) => {
                    if (err) throw err;
                    res.json({
                        message: "Berhasil mengubah foto profile",
                        deleted: fotoLamaUser,
                        updated: foto_user
                    });
    
                    //menghapus foto lama
                    if (fotoLamaUser) {
                        const filePath = path.join(__dirname, "../Images/user", fotoLamaUser);
                        fs.unlink(filePath, (err) => {
                            if (err) throw err;
                            console.log('Deleted file:', filePath);
                        });
                    }
                });
            }
        })
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
                    res.status(401).json({ message: "User tidak ditemukan" });

                } else {
                    if (user.password === md5(password)) {
                        if (user.role === "admin") {
                            const KEY_ADMIN = "UKKHOTELADMIN";

                            const token = jwt.sign({ user: user }, KEY_ADMIN);
                            res.json({
                                logged: true,
                                message: 'Admin login success. Please use the token below to access other private endpoints',
                                token: token,
                                data: user
                            });

                        } else if (user.role === "resepsionis") {
                            const KEY_RESEPSIONIS = "UKKHOTELRESEPSIONIS";

                            const token = jwt.sign({ user: user }, KEY_RESEPSIONIS);
                            res.json({
                                logged: true,
                                message: 'Receptionist login success. Please use the token below to access other private endpoints',
                                token: token,
                                data: user
                            });

                        } else {
                            res.json({
                                logged: false,
                                message: "role tidak terdaftar"
                            });
                        }

                    } else {
                        res.json({
                            logged: false,
                            message: "Invalid password"
                        });
                    }
                }
            });
        }
    },

    //Register user
    register: (req, res) => {
        let user = {
            nama_user: req.body.nama_user,
            email: req.body.email,
            password: md5(req.body.password),
            role: req.body.role,
        };

        let confirmPassword = md5(req.body.confirmPassword);

        if (user.password !== confirmPassword) {
            res.json({
                message: "password dan confirm password tidak cocok"
            });

        } else if (!user.nama_user || !user.email || !user.password || !user.role) {
            res.json({
                message: "Nama, Email, dan Password harus diisi!",
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

    //menghapus data user
    delete: (req, res) => {
        const id = req.params.id;

        db.query(`SELECT foto_user FROM user WHERE id_user = '${id}'`, (err, rows) => {
            const fotoLamaUser = rows[0].foto_user
            
            //menghapus data user
            db.query(`DELETE FROM user WHERE id_user = '${id}'`, (err, result) => {
                if(null, err){
                    throw err
                }else{
                    //menghapus foto lama user
                    if (fotoLamaUser) {
                        const filePath = path.join(__dirname, "../Images/user", fotoLamaUser);
                        fs.unlink(filePath, (err) => {
                            if (err) throw err;
                            console.log('Deleted file:', filePath);
                        });
                    }

                    res.json({
                        message: "Berhasil menghapus data user",
                        user: result
                    });
                }
            });
        })
    },
    
    //search user
    find: (req, res) => {
        let keyword = req.body.keyword;
        let sql = "SELECT * FROM user WHERE nama_user like '%" + keyword + "%' or id_user like '%" + keyword + "%' or email like '%" + keyword + "%' or role like '%" + keyword + "%'";

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