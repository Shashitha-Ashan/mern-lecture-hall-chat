const express = require("express");
const router = express.Router();
const chatRoomController = require("../controllers/chatRoomController");
const verifyToken = require("../middleware/userMiddleware");

router.use(verifyToken);
// Create a new chat room
router.post("/createnew", chatRoomController.createChatRoom);

// Get all chat rooms
router.get("/my", chatRoomController.getAllChatRooms);

// Get chat room by ID
router.get("/my/all", chatRoomController.getAllChatRoomByUserId);

// Update chat room by ID
router.put("/:id", chatRoomController.updateChatRoomById);

// Delete chat room by ID
router.delete("/:id", chatRoomController.deleteChatRoomById);

module.exports = router;
