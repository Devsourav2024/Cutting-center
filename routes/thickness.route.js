const express = require('express');
const router = express.Router();
const table = require("../controllers/thickness.controller");


router.get("/", table.getThicknessByMaterialId);

module.exports = router;