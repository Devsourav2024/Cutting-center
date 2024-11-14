const express = require("express");
const cart = require("../controllers/cart.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add", auth.authenticateUser, cart.addToCart);
router.get("/all", auth.authenticateUser, cart.getAllCartItems);
router.put("/update", auth.authenticateUser, cart.updateCartItemsQuantity);
router.delete("/delete/:id", auth.authenticateUser, cart.deleteCartItem);

module.exports = router;
