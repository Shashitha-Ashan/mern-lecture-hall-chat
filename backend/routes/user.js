const express = require("express");
const {
  loginUser,
  changePassword,
  getUsers,
  registerUser,
  getUserRole,
  reportUser,
  confirmUser,
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

module.exports = router;
