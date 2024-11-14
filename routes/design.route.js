const express = require("express");
const router = express.Router();
const order = require("../controllers/design.controller");

router.get("/:id", order.design);

module.exports = router;
