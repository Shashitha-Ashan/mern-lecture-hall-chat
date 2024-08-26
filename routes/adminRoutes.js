const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAllReports,
} = require("../controllers/adminController");

router.get("/allusers", getAllUsers);
router.get("/allreports", getAllReports);

module.exports = router;
