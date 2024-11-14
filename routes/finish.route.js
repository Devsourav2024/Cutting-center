const express = require('express');
const router = express.Router();
const table = require("../controllers/finish.controller");


router.get("/", table.getFinishByMaterialId);

module.exports = router;