const mongoose = require("mongoose");

const ChatRoomsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  passcode: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  subject: { type: String, required: true },
  year: {
    type: String,
    enum: ["19/20", "20/21", "21/22", "22/23"],
    required: true,
  },
});

const ChatRooms = mongoose.model("chatrooms", ChatRoomsSchema);

module.exports = ChatRooms;
