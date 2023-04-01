"use strict";

const express = require('express');
const kamarController = require("../Controllers/kamar.controller");

const { verifyAdmin, verifyResepsionis, verifyBoth } = require("../Auth/verify");

const route = new express.Router();

//akses admin
route.post("/", verifyAdmin, kamarController.add);
route.put("/:id", verifyAdmin, kamarController.update);
route.delete("/:id", verifyAdmin, kamarController.delete);

//akses admin dan resepsionis
route.get("/", verifyBoth, kamarController.getAll);
route.get("/:id", verifyBoth, kamarController.getId);
route.post("/find", verifyBoth, kamarController.find);

//akses resepsionis
route.post("/kamar-dipesan", verifyResepsionis, kamarController.kamarDipesan);

//akses pemesan
route.post("/kamar-tersedia", kamarController.kamarTersedia);

module.exports = route;