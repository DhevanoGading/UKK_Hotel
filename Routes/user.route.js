"use strict";

const express = require('express');
const userController = require("../Controllers/user.controller");

const { verifyAdmin, verifyBoth } = require("../Auth/verify");

const route = new express.Router();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./Images/user")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
});

let upload = multer({ storage: storage })

//akses admin
route.get("/", verifyAdmin, userController.getAll);
route.get("/:id", verifyAdmin, userController.getId);
route.post("/", verifyAdmin, upload.single("foto_user"), userController.add);
route.delete("/:id", verifyAdmin, userController.delete);
route.post("/find", verifyAdmin, userController.find);

//akses admin dan resepsionis
route.put("/:id", verifyBoth, userController.update);
route.put("/update-foto/:id", verifyBoth, upload.single("foto_user"), userController.updateFotoProfile);

//free akses
route.post("/login", userController.login);
route.post("/register", userController.register);

module.exports = route;