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
const path = require("path");

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// Set EJS as the templating engine
app.set("view engine", "ejs");
// Set the directory where the EJS templates are located
app.set("views", path.join(__dirname, "views"));

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
    io.to(roomId).emit("receiveMessage", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {});
});

server.listen(3000, () => {
  console.log("server started");
});
