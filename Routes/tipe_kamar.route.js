"use strict";

const express = require('express');
const tipeKamarController = require("../Controllers/tipe_kamar.controller");

const { verifyAdmin } = require("../Auth/verify");

const route = new express.Router();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./Images/tipe-kamar")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
});

let upload = multer({ storage: storage })

//akses admin
route.get("/", verifyAdmin, tipeKamarController.getAll);
route.get("/:id", verifyAdmin, tipeKamarController.getId);
route.post("/", verifyAdmin, upload.single("foto_tipe_kamar"), tipeKamarController.add);
route.put("/:id", verifyAdmin, tipeKamarController.update);
route.put("/update-foto/:id", verifyAdmin, upload.single("foto_tipe_kamar"), tipeKamarController.updateFotoKamar);
route.delete("/:id", verifyAdmin, tipeKamarController.delete);
route.post("/find", verifyAdmin, tipeKamarController.find);

module.exports = route;