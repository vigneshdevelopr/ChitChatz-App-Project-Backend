import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createConnection } from "./dbconnect.js";
import { userRouter } from "./Routes/User.js";
import { MsgRouter } from "./Routes/Messages.js";
import { Server } from "socket.io";

dotenv.config();
// const corsOrigin ={
//   origin:'*',
//   credentials:true,
//   optionSuccessStatus:200,
// Headers: "Content-Type",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     transports: ["websocket", 'polling'],

// }

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(
  // cors({
  //   origin: "https://chitchatzapp.netlify.app",
  //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  //   allowedHeaders: "Content-Type",
  //   preflightContinue: false,
  //   credentials: true,
  //   optionsSuccessStatus: 200,
  // })
);
// app.use((req, res, next) => {
//    res.setHeader("Access-Control-Allow-Origin", "*");
//    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
//    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// })
app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/messages/", MsgRouter);

// Callback of dbconnection:
createConnection();

app.get("/", (req, res) => {
  res.status(200).send("ChitChatz Application Ready to Use 📩");
});

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// // Create WebSocket server
// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "https://chitchatzapp.netlify.app",

//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//     credentials: true,
//     transports: ["websocket", 'polling'],

//   },
// });
// Create WebSocket server
const io = new Server(server, {
  pingTimeout: 60000,
  allowRequest: (req, callback) => {
    const noOriginHeader = req.headers.origin === undefined;
    callback(null, noOriginHeader);
  }
  // cors: {
  //   origin: true,
  //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  //   allowedHeaders: "Content-Type",
  //   preflightContinue: false,
  //   optionsSuccessStatus: 200,
    
  //   credentials: true,
  //   transports: ["websocket", "polling"],
  // },
  
});

// Store online users in a Map
const onlineUsers = new Map();

// Event handler for new WebSocket connections
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Event handler for "add-user" event
  socket.on("add-user", (userId) => {
    console.log(`User added: ${userId}`);
    onlineUsers.set(userId, socket.id);
  });

  // Event handler for "send-msg" event
  socket.on("send-msg", (data) => {
    console.log("send-msg", { data });
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-receive", data.msg);
      console.log(data.msg);
    }
  });

  // Event handler for socket disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Remove user from onlineUsers map when socket is disconnected
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});
