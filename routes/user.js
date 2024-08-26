const express = require("express");
const {
  loginUser,
  changePassword,
  getUsers,
  registerUser,
  getUserRole,
  reportUser,
  confirmUser,
  forgotPassword,
  resetPasswordVerify,
  resetPassword,
} = require("../controllers/userController");
const verifyToken = require("../middleware/userMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/changepassword", verifyToken, changePassword);
router.get("/getusers", getUsers);
router.post("/register", registerUser);
router.get("/getrole", verifyToken, getUserRole);
router.post("/reportuser", verifyToken, reportUser);
router.get("/confirm/:id", confirmUser);
router.post("/forgotpassword", forgotPassword);
router.get("/resetpassword/:token", resetPasswordVerify);
router.post("/resetpassword", resetPassword);

module.exports = router;
