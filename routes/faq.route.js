const express = require('express');
const faqs = require('../controllers/faq.controller');
const router = express.Router();

router.get("/all", faqs.getAll);
module.exports = router;