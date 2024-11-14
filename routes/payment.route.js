const express = require("express");
const payment = require('../controllers/payment.controller');
const auth = require("../middlewares/auth.middleware");

const router = express.Router();
router.post("/create-order",auth.authenticateUser, payment.createOrder, async (req, res) => {
});
router.get("/access-token",auth.authenticateUser, payment.accessToken, async (req, res) => {
});
router.post("/addPayment",auth.authenticateUser, payment.addPayments);
router.get("/check/:ref",auth.authenticateUser, payment.paymentStatusCheck);
module.exports = router;
