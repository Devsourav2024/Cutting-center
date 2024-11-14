const express = require("express");
const router = express.Router();
const machine = require("../controllers/machine.controller");

router.get("/", machine.getMachineByMaterialId);

module.exports = router;
