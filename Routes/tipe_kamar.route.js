"use strict";

const express = require('express');
const tipeKamarController = require("../Controllers/tipe_kamar.controller");
const route = new express.Router();

route.get("/", tipeKamarController.getAll);
route.get("/:id", tipeKamarController.getId);
route.post("/", tipeKamarController.add);
route.put("/:id", tipeKamarController.update);
route.delete("/:id", tipeKamarController.delete);

module.exports = route;