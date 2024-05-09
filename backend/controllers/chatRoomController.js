const ChatRoom = require("../models/chatRoomsModel");
const User = require("../models/userModel");

// Create a new chat room
const createChatRoom = async (req, res) => {
  try {
    const { name, passcode, year } = req.body;
    const creator = req.user._id;
    const newChatRoom = new ChatRoom({
      name,
      passcode,
      creator,
      subject: name,
      year,
    });
    await newChatRoom.save();
    res.status(201).json(newChatRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all chat rooms
const getAllChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find().populate({
      path: "creator",
      select: "username",
    });
    res.json(chatRooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get chat room by user ID
const getAllChatRoomByUserId = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role === "lecturer") {
      const chatRooms = await ChatRoom.find({ creator: user._id });
      if (!chatRooms) {
        return res.status(404).json({ error: "Chat room not found" });
      }

      res.json(chatRooms);
    } else {
      const chatRooms = await ChatRoom.find({ year: user.year }).populate({
        path: "creator",
        select: "username",
      });
      if (!chatRooms) {
        return res.status(404).json({ error: "Chat room not found" });
      }
      res.json(chatRooms);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update chat room by ID
const updateChatRoomById = async (req, res) => {
  try {
    const { name, passcode, subject, year } = req.body;
    const updatedChatRoom = await ChatRoom.findByIdAndUpdate(
      req.params.id,
      { name, passcode, subject, year },
      { new: true }
    );
    if (!updatedChatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }
    res.json(updatedChatRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete chat room by ID
const deleteChatRoomById = async (req, res) => {
  try {
    const deletedChatRoom = await ChatRoom.findByIdAndDelete(req.params.id);
    if (!deletedChatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }
    res.json({ message: "Chat room deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createChatRoom,
  getAllChatRooms,
  getAllChatRoomByUserId,
  updateChatRoomById,
  deleteChatRoomById,
};
