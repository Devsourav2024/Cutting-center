const express = require("express");
const percentages = require("../controllers/percentages.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();
router.get("/", auth.authenticateUser, percentages.getPercentages);
router.get(
  "/shipping-charge",
  auth.authenticateUser,
  percentages.getShippingCharge
);
router.post(
  "/district-shipping-charge",
  auth.authenticateUser,
  percentages.getDistrictShippingCharge
);
module.exports = router;
