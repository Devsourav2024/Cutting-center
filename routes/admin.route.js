const express = require("express");
const router = express.Router();
const material = require("../controllers/admin/material.controller");
const thickness = require("../controllers/admin/thickness.controller");
const colors = require("../controllers/admin/colors.controller");
const finish = require("../controllers/admin/finish.controller");
const machines = require("../controllers/admin/machines.controller");
const materialThickness = require("../controllers/admin/materialThickness.controller");
const materialColors = require("../controllers/admin/materialColor.controller");
const materialFinish = require("../controllers/admin/materialFinish.controller");
const materialMachines = require("../controllers/admin/materialMachine.controller");
const admin = require("../controllers/admin/admin.controller");
const user = require("../controllers/user.controller");
const orders = require("../controllers/admin/order.controller");
const adminUsers = require("../controllers/admin/user.controller");
const percentages = require("../controllers/admin/percentage.controller");
const faqs = require("../controllers/admin/faq.controller");
const design = require("../controllers/admin/design.controller");
const manual = require("../controllers/admin/manual.controller");
const cart = require("../controllers/admin/cart.controller");

// admin
router.post("/signup", admin.signup);
router.post("/login", admin.login);
router.get("/check", admin.checkIsLogin);

// users API's
router.get("/users", adminUsers.getUserCount);
router.get("/users/all", adminUsers.getAll);
router.put("/user/update/:id", adminUsers.update);
router.delete("/user/delete/:id", adminUsers.deleteUser);
router.post("/user/create", user.signup);
// materials API's
router.post("/createMaterial", material.createMaterial);
router.get("/materials", material.getAllMaterials);
router.put("/material/update", material.update);
router.delete("/material/delete/:id", material.deleteMaterial);

// thickness API's
router.post("/createThickness", thickness.createThickness);
router.get("/thickness", thickness.getAllThickness);
router.put("/thickness/update", thickness.update);
router.delete("/thickness/delete/:id", thickness.deleteThickness);

// colors API's
router.post("/createColors", colors.createColors);
router.get("/colors", colors.getAll);
router.put("/color/update", colors.update);
router.delete("/color/delete/:id", colors.deleteColor);

// finish API's
router.post("/createFinish", finish.createFinish);
router.get("/finish", finish.getAll);
router.put("/finish/update", finish.update);
router.delete("/finish/delete/:id", finish.deleteFinish);

// machines API's
router.post("/createMachines", machines.createMachine);
router.get("/machines", machines.machines);
router.put("/machine/update", machines.update);
router.delete("/machine/delete/:id", machines.deleteMachine);

// material->thickness API's
router.post(
  "/createMaterialThickness",
  materialThickness.createMaterialThickness
);
router.get("/materialThickness", materialThickness.getAll);
router.put("/materialThickness/update", materialThickness.update);
router.get(
  "/materialThickness/materialId/:id",
  materialThickness.getByMaterialId
);
router.delete(
  "/materialThickness/delete/:id",
  materialThickness.deleteMaterialThickness
);

// material -> colors API's
router.post("/createMaterialColor", materialColors.createMaterialColor);
router.get("/materialColor/materialId/:id", materialColors.getByMaterialId);
router.get("/materialColor", materialColors.getAll);
router.put("/materialColor/update", materialColors.update);
router.delete("/materialColor/delete/:id", materialColors.deleteMaterialColor);

// material -> finish API's
router.post("/createMaterialFinish", materialFinish.createMaterialFinish);
router.get("/materialFinish/materialId/:id", materialFinish.getByMaterialId);
router.get("/materialFinish", materialFinish.getAll);
router.put("/materialFinish/update", materialFinish.update);
router.delete(
  "/materialFinish/delete/:id",
  materialFinish.deleteMaterialFinish
);

// material -> machine API's
router.post("/createMaterialMachine", materialMachines.createMaterialMachine);
router.get("/materialMachine/materialId/:id", materialMachines.getByMaterialId);
router.get("/materialMachine", materialMachines.getAll);
router.put("/materialMachine/update", materialMachines.update);
router.delete(
  "/materialMachine/delete/:id",
  materialMachines.deleteMaterialMachine
);

// order -> items API's
router.get("/order/items", orders.orderItemsByOrderId);
router.get("/orders", orders.orders);
router.get("/orders/totalPrice", orders.totalSalePrice);
router.get("/orders/totalSales", orders.totalOrderItems);
router.put("/update-order-item-status", orders.updateOrderItemStatus);
router.put(
  "/update-order-payment-status/:order_id",
  orders.updatePaymentStatus
);

// percentages API's
router.get("/percentages", percentages.getAll);
router.put("/percentage/update", percentages.update);

// faqs API's
router.post("/faq/add", faqs.addFaq);
router.get("/faqs", faqs.getAll);
router.put("/faq/update", faqs.update);
router.delete("/faq/delete/:id", faqs.deleteFaq);

// design API's
router.get("/design/:id", design.design);
router.put("/design/update", design.update);

// manual API's
router.patch("/manual/update/:id", manual.update);

// cart API's
router.put("/cart/add", cart.addToCart);

module.exports = router;
