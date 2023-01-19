"use strict";

const express = require('express');
const kamarController = require("../Controllers/kamar.controller");
const route = new express.Router();

route.get("/", kamarController.getAll);
route.get("/:id", kamarController.getId);
route.post("/", kamarController.add);
route.put("/:id", kamarController.update);
route.delete("/:id", kamarController.delete);

module.exports = route;