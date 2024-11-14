const express = require('express');
const router = express.Router();
const quote = require("../controllers/quote.controller");


router.post("/", quote.getQuote);

module.exports = router;