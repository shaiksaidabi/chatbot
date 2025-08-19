const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ✅ Serve static files from docs folder instead of public
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (data) => {
    io.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// ✅ Use process.env.PORT for deployment, fallback to 3000 locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
