const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const verifyToken = require("../middleware/userMiddleware");

router.use(verifyToken);
// Create a new message
router.post("/", messageController.createMessage);

// Get all messages
router.get("/", messageController.getAllMessages);

// Get message by ID
// router.get("/:id", messageController.getMessageById);

// Update message by ID
router.put("/:id", messageController.updateMessageById);

// Delete message by ID
router.delete("/:id", messageController.deleteMessageById);
router.get("/vote", messageController.voteMessage);

module.exports = router;
