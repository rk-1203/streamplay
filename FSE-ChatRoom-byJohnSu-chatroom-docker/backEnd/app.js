import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

import colors from "colors";
import cors from "cors";

import Message from "./models/messageModel.js";
import User from "./models/userModel.js";
import userRouter from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddlewares.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

// Set up config file
import dotenv from "dotenv";
dotenv.config();

// Set up CORS
app.use(cors());

// Start Server
const PORT = process.env.PORT || 5050;
server.listen(
    PORT,
    console.log(`Backend Server start on PORT ${PORT}...`.yellow)
);

// Connect Database
import connectDB from "./config/db.js"
connectDB();

// Routing
app.use(express.static(path.join("./public")));
app.use(express.json());

// User event
app.use("/api/user", userRouter);

// Web socket connect
io.on("connection", (socket) => {
    console.log(`SocketIo connect.`.bgGreen);
    socket.on("login", async (username) => {
        socket.username = username;
        const allMsg = await Message.find();
        socket.emit("fetch all messages", allMsg);
    });
    // when the client emits 'new message', this listens and executes
    socket.on("new message", async (data) => {
        // we tell the all clients to execute 'new message'
        const username = socket.username;
        const msg = data;
        const user = await User.findOne({ username });
        const newMsg = await Message.create({
            sender: user._id,
            username: user.username,
            message: msg,
        });
        io.emit("new message", newMsg);
    });

    // when the user disconnects (Logout)
    socket.on("disconnect", () => {
        // If user disconnect -> doing things here.
    });
});

// Error Handler
app.use(notFound);
app.use(errorHandler);
