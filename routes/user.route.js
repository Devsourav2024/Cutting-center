const express = require("express");

const user = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/signup", user.signup);
router.post("/login", user.login);
router.get("/check", auth.authenticateUser, user.checkIsLogin);
router.get("/profile", auth.authenticateUser, user.getUserProfile);
router.post(
  "/updateProfilePicture",
  auth.authenticateUser,
  user.updateProfilePicture
);
router.post("/uploadRigidFile", auth.authenticateUser, user.uploadRigidFile);
router.post("/uploadRigidImage", auth.authenticateUser, user.uploadRigidImage);
router.post("/update", auth.authenticateUser, user.updateUserProfile);
router.post("/update/password", auth.authenticateUser, user.updatePassword);
router.post("/forgot-password", user.forgotPassword);
// router.post("/change-password", user.changePassword);
router.post("/change-password", user.changePasswordNew);
router.post("/social-login", user.social_login);
router.post(
  "/change-password-update",

  user.changePasswordNewUpdate
);
router.put(
  "/update/billing-address",
  auth.authenticateUser,
  user.updateBillingAddress
);

module.exports = router;
