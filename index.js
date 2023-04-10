import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const app = express();
import dotenv from "dotenv";
import { createConnection } from "./dbconnect.js";
import { userRouter } from "./Routes/User.js";
import { MsgRouter } from "./Routes/Messages.js";
import { Server } from "socket.io";
dotenv.config();
const PORT = process.env.PORT;

//middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/messages/", MsgRouter);

//callback of dbconnection:
createConnection();

//server listening on port
const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const io = new Server(server, {
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
    console.log("send-msg", { data });
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
      console.log(data.message);
    }
  });
});