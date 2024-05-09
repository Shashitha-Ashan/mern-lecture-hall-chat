const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const verifyToken = require("./middleware/userMiddleware");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("database connected");
  })
  .catch(() => {
    console.log("database error occured");
  });

// routes
const userRoutes = require("./routes/user");
const messagesRoutes = require("./routes/messages");
const chatroomsRoutes = require("./routes/chatRooms");
const adminRoutes = require("./routes/adminRoutes");
// user routes
app.use("/api/user", userRoutes);
app.use("/api/c", messagesRoutes);
app.use("/api/rooms", chatroomsRoutes);
app.use("/api/admin", adminRoutes);

// main routes
app.get("/", verifyToken, (req, res) => {
  res.send("hari");
});

// 404 page

app.use((req, res) => {
  res.status(404).send("Page not found");
});

io.on("connection", (socket) => {
  // Join a room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  // Handle new message
  socket.on("sendMessage", async (data) => {
    const { roomId, content, sender } = data;
    // const message = new Message({ content, sender, roomId });
    // await message.save();
    io.to(roomId).emit("receiveMessage", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("server started");
});
