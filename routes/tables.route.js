const express = require("express");
const router = express.Router();
const table = require("../controllers/tables.controller");

// admin routes
router.post("/create/admin", table.admin);
// public routes
router.post("/create/users", table.createUsers);
router.post("/create/materials", table.createMaterials);
router.post("/create/thickness", table.createThickness);
router.post("/create/colors", table.createColors);
router.post("/create/finish", table.createFinish);
router.post("/create/machines", table.createMachines);
router.post("/create/materialThickness", table.createMaterialThickess);
router.post("/create/materialColors", table.createMaterialColors);
router.post("/create/materialFinish", table.createMaterialFinish);
router.post("/create/materialMachine", table.createMaterialMachine);
router.post("/create/createDesign", table.createDesigns);
router.post("/create/payments", table.createPayments);
router.post("/create/orders", table.createOrders);
router.post("/create/orderItems", table.createOrderItems);
router.post("/create/refunds", table.createRefunds);
router.post("/create/orderItemReview", table.createOrderItemReview);
router.post("/create/percentages", table.createPercentageTable);
router.post("/create/faqs", table.createFaqTable);
router.post("/create/manual", table.manualOrder);
router.post("/create/charges", table.charges);
router.post("/create/address", table.address);
module.exports = router;
