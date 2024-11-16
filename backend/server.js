const passport = require("passport");
const db = require("./db");
require("dotenv").config();
const bodyParser = require("body-parser");
const Message = require("./models/Message");
const User = require("./models/Person");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const _ = require("lodash");
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const personAuthroutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const aiChatRoute = require("./routes/aiChatRoute");
const { mongoose } = require("mongoose");

app.use("/auth", personAuthroutes);
app.use("/user", userRoutes);
app.use("/chat", messageRoute);
app.use("/ai-chat", aiChatRoute);

let onlineUsers = new Map(); // Store online users and their socket IDs

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Add user to online users
  socket.on("userOnline", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online`);
    console.log("Received userId:", userId);
    io.emit("onlineUser", { userId: userId, status: "online" });
  });

  socket.on("checkOnlineStatus", (recipientId) => {
    const status = onlineUsers.has(recipientId) ? "online" : "offline";
    socket.emit("onlineUser", { userId: recipientId, status });
  });

  socket.on("privateMessage", async ({ recipientId, message, userId }) => {
    try {
      recipientId = new mongoose.Types.ObjectId(recipientId);
      userId = new mongoose.Types.ObjectId(userId);
      const newMessage = new Message({
        room: null,
        sender: userId,
        receiver: recipientId,
        content: message,
        type: "private",
      });

      await newMessage.save();
      recipientId = _.toString(recipientId);
      userId = _.toString(userId);

      if (onlineUsers.has(recipientId)) {
        io.to(onlineUsers.get(recipientId)).emit("privateMessage", {
          message,
          senderId: userId, // Use the actual user ID
        });
        console.log("message has sent to receipient");
      }
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Find the userId associated with the disconnected socket
    const userId = Array.from(onlineUsers.entries()).find(
      ([key, value]) => value === socket.id
    )?.[0];
    if (userId) {
      // Remove user from onlineUsers map
      onlineUsers.delete(userId);

      // Broadcast offline status to all other clients
      io.emit("onlineUser", { userId: userId, status: "offline" });
    }
  });
});

server.listen(4000, () => {
  console.log("Listening on port 4000");
});
