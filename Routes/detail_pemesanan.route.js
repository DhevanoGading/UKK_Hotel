"use strict";

const express = require('express');
const detailPemesananController = require("../Controllers/detail_pemesanan.controller");
const route = new express.Router();

route.get("/", detailPemesananController.getAll);
route.get("/:id", detailPemesananController.getId);
route.post("/", detailPemesananController.add);
route.put("/:id", detailPemesananController.update);
route.delete("/:id", detailPemesananController.delete);

module.exports = route;