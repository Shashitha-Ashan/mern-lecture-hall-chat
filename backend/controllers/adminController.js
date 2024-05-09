const User = require("../models/userModel");
const Report = require("../models/reportsModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({
        path: "reporterid",
        select: "username",
      })
      .populate({
        path: "messageid",
        select: ["sender", "content"],
        populate: { path: "sender", select: "username" },
      });

    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllUsers, getAllReports };
