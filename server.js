const express = require("express");
require("dotenv").config();
const path = require("path");
const { PORT } = process.env;
const app = express();

const server = app.listen(PORT, () =>
  console.log(`server is runnig on ${PORT}`)
);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

let socketConnected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  socketConnected.add(socket.id);

  io.emit("client-total", socketConnected.size);

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
    socketConnected.delete(socket.id);
    io.emit("client-total", socketConnected.size);
  });

  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
