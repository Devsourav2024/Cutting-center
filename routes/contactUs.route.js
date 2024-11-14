const express = require("express");
const contactUs = require("../controllers/contactUs.controller");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/", auth.authenticateUser, contactUs.contact);

module.exports = router;
