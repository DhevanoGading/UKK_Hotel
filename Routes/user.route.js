"use strict";

const express = require('express');
const userController = require("../Controllers/user.controller");
const route = new express.Router();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../Images/user")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
});

let upload = multer({ storage: storage })

route.get("/", userController.getAll);
route.get("/:id", userController.getId);
route.post("/", upload.single("foto_user"), userController.add);
route.put("/:id", upload.single("foto_user"), userController.update);
route.delete("/:id", userController.delete);
route.post("/login", userController.login);
// route.post("/:id", userController.find);

module.exports = route;