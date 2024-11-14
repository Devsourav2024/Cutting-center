const express = require('express');
const router = express.Router();
const table = require("../controllers/material.controller");

router.get("/all", table.getAllMaterials);

module.exports = router;