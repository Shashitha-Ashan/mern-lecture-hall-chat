const Message = require("../models/messageModel");
const User = require("../models/userModel");

// Create a new message
const createMessage = async (req, res) => {
  try {
    const { sender, content, chatRoom } = req.body;
    const user = await User.findById(sender);

    if (user.role === "lecturer") {
      return res.status(400).json({
        error: "You cannot message as a Lecturer",
      });
    }
    if (req.user._id) {
    }
    const newMessage = new Message({ sender, content, chatRoom });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all messages
const getAllMessages = async (req, res) => {
  const id = req.query.id;
  try {
    const messages = await Message.find({ chatRoom: id }).populate({
      path: "sender",
      select: "username",
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// this mess IDK
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update message by ID
const updateMessageById = async (req, res) => {
  try {
    const { content } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json(updatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete message by ID
const deleteMessageById = async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const voteMessage = async (req, res) => {
  const { userId, messageId } = req.query;

  try {
    const message = await Message.findById(messageId);
    const senderId = message.sender.toString();
    console.log(senderId, " ", req.user._id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    if (senderId === req.user._id) {
      return res.status(400).json({
        error: "You cannot vote your own message",
      });
    }
    if (message.votes.includes(req.user._id)) {
      return res.status(400).json({
        error: "You are already voted for this message",
        voteCount: message.votes.length,
      });
    }
    message.votes.push(req.user._id);
    await message.save();
    return res.status(200).json({
      message: "Vote added successfully",
      voteCount: message.votes.length,
    });
  } catch (error) {
    console.error("Error adding vote:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageById,
  deleteMessageById,
  voteMessage,
};
