import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import axios from "axios";
import connectDB from "./config/MongoDB.js";
import UserRoutes from "./Routes/UserRoutes.js";
import EmployerRoutes from "./Routes/EmployerRoutes.js";
import CompanyRoutes from "./Routes/CompanyRoutes.js";
import ProfileRoute from "./Routes/ProfileRoute.js";
import JobRoute from "./Routes/JobRoute.js";
import { Server } from "socket.io";
import MessageRoute from "./Routes/MessagesRoute.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const app = express();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
connectDB();

app.use("/api/user", UserRoutes);
app.use("/api/company", CompanyRoutes);
app.use("/api/employer", EmployerRoutes);
app.use("/api/profile", ProfileRoute);
app.use("/api/job", JobRoute);
app.use("/api/message", MessageRoute);

app.get("/", (req, res) => {
  res.send("api running");
});

app.post("/job", async (req, res) => {
  const response = axios
    .post("http://127.0.0.1:5000/getJob", req.body)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});
const server = app.listen(5000, console.log("app running...."));
const socket = require("socket.io");
const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(onlineUsers);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.broadcast.emit("msg-recieve", {
        from: data.from,
        to: data.to,
        message: data.msg,
      });
    }
  });
});
