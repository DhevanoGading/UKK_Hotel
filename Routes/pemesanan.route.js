"use strict";

const express = require('express');
const pemesananController = require("../Controllers/pemesanan.controller");
const route = new express.Router();

const { verifyResepsionis } = require("../Auth/verify");

//akses resepsionis
route.get("/", verifyResepsionis, pemesananController.getAll);
route.get("/filter", verifyResepsionis, pemesananController.getPemesanan);
route.put("/status/:id", verifyResepsionis, pemesananController.updateStatus);
route.delete("/:id", verifyResepsionis, pemesananController.delete);

//akses resepsionis dan tamu
route.post("/find", pemesananController.find);
route.post("/", pemesananController.add);

module.exports = route;