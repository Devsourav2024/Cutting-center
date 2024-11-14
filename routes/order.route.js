const express = require("express");
const router = express.Router();
const order = require("../controllers/order.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload_one.middleware");

router.post("/create", auth.authenticateUser, order.createOrder);
router.put("/updateOrderItems", auth.authenticateUser, order.updateOrderItems);
router.get("/items", auth.authenticateUser, order.orderItems);
router.get("/item/:id", auth.authenticateUser, order.orderItemDetails);
router.put("/cancel/:id", auth.authenticateUser, order.cancel);
router.post("/manual", auth.authenticateUser, upload, order.createManualOrder);
router.get("/manual-orders", auth.authenticateUser, order.manualOrders);
router.post("/item/review", auth.authenticateUser, order.review);
router.post(
  "/confirm/email/:id",
  auth.authenticateUser,
  order.confirmationEmail
);
router.get("/items/:id", auth.authenticateUser, order.getItemsByOrderId);

module.exports = router;
