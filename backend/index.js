import http from "http";
import express from "express";
import path from "path";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:5173", // Allow frontend URL
  methods: ["GET", "POST"]
}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

//Socket io
io.on('connection', (socket) => {
  console.log("new user connected", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("code-update", ({ roomId, code }) => {
    socket.to(roomId).emit("receive-code", code); // Broadcast code to others
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const _dirname = path.resolve();

app.use(express.static(path.join(_dirname, "/frontend/dist")));

app.get('*', (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});