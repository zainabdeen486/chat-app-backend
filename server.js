const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/chat", {})
  .then((res) => {
    console.log("ressss=>>");
  })
  .catch((err) => {
    console.log("errrr=>", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

var PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server started on ${PORT}`));

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
