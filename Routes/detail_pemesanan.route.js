"use strict";

const express = require('express');
const detailPemesananController = require("../Controllers/detail_pemesanan.controller");
const route = new express.Router();

const { verifyResepsionis } = require("../Auth/verify");

//akses resepsionis
route.get("/", verifyResepsionis, detailPemesananController.getAll);
route.post("/sisa-kamar", verifyResepsionis, detailPemesananController.sisaKamar);
route.delete("/:id", verifyResepsionis, detailPemesananController.delete);
route.post("/find", verifyResepsionis, detailPemesananController.find);

module.exports = route;