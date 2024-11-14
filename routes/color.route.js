const express = require('express');
const router = express.Router();
const table = require("../controllers/color.controller");


router.get("/", table.getColorByMaterialId);

module.exports = router;