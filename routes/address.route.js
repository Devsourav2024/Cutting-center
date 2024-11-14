const express = require("express");
const router = express.Router();
const address = require("../controllers/address.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/add", auth.authenticateUser, address.addAddress);
router.post("/contact-us", address.contactUs);
router.get("/get-cities", address.getCities);
router.get("/get-district/:city_id", address.getDistricts);
router.put("/update", auth.authenticateUser, address.updateAddress);
router.delete("/delete/:id", auth.authenticateUser, address.deleteAddress);

module.exports = router;
