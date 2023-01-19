"use strict";

const express = require('express');
const pemesananController = require("../Controllers/pemesanan.controller");
const route = new express.Router();

route.get("/", pemesananController.getAll);
route.get("/:id", pemesananController.getId);
route.post("/", pemesananController.add);
route.put("/:id", pemesananController.update);
route.delete("/:id", pemesananController.delete);

module.exports = route;