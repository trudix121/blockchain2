const express = require("express");
const app = express();
const http = require("http").Server(app);
const { Server } = require('socket.io');
const db = require('../db/db.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const io = new Server(http, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

io.on("connection", async (socket) => {
  console.log("Un utilizator s-a conectat");

  // Load chat history on connection
  socket.on("load history", async () => {
    try {
      const data = await db.find('blockchain', 'chatDB', {});
      const messageArray = data.map((es) => es.msg);
      socket.emit('chat history', messageArray);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  });

  // Listen for chat messages from clients
  socket.on("chat message", async (msg) => {
    console.log("Mesaj primit:", msg);

    try {
      await db.insert('blockchain', 'chatDB', { msg: `${msg.usrs} : ${msg.msg}` });
    } catch (error) {
      console.error('Error inserting message into the database:', error);
    }

    // Broadcast the message to all connected clients
    io.emit("chat message", msg);
  });

  // Listen for client disconnection
  socket.on("disconnect", () => {
    console.log("Un utilizator s-a deconectat");
  });
});

const PORT = 2000;

http.listen(PORT, () => {
  console.log(`Websocket Ready on port ${PORT}`);
});
