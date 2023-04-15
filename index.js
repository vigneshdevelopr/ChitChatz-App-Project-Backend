// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// const app = express();
// import dotenv from "dotenv";
// import { createConnection } from "./dbconnect.js";
// import { userRouter } from "./Routes/User.js";
// import { MsgRouter } from "./Routes/Messages.js";
// import { Server } from "socket.io";
// dotenv.config();
// const PORT = process.env.PORT;

// //middleware
// app.use(cors());
// app.use(express.json());
// app.use("/api/auth", userRouter);
// app.use("/api/messages/", MsgRouter);




// //callback of dbconnection:
// createConnection();

// //server listening on port
// const server = app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });
// //socket listening on port

// const io = new Server(server, {
//   pingTimeout:60000,
//     cors:{
//         origin: "http://localhost:3000",
//         credentials: true

//     },
// });

// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });
//   socket.on("send-msg", (data) => {
//     console.log("send-msg", { data });
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-receive", data.msg);
//       console.log(data.msg);
//     }
//   });
// });


import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createConnection } from "./dbconnect.js";
import { userRouter } from "./Routes/User.js";
import { MsgRouter } from "./Routes/Messages.js";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/messages/", MsgRouter);

// Callback of dbconnection:
createConnection();

app.get("/", (req,res)=>{
  res.status(200).send("ChitChatz Application Ready to Use 📩")
})

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Create WebSocket server
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
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
