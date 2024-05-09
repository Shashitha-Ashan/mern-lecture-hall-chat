const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  chatRoom: { type: mongoose.Types.ObjectId, ref: "chatrooms", required: true }, // Reference to chat room
  votes: [{ type: mongoose.Types.ObjectId, ref: "user", default: 0 }],
});
const Message = mongoose.model("message", MessageSchema);

module.exports = Message;
