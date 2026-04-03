const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // In production, add your specific frontend URL
    methods: ['GET', 'POST']
  }
});

const path = require('path');

app.use(express.static(path.join(__dirname, '../frontend/dist')));

// app.get('/', (req, res) => {
//   res.send('Minihompi Chat Backend is running.');
// });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins a chat
  socket.on('join', (username) => {
    socket.username = username;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Broadcast to everyone else that a user joined
    socket.broadcast.emit('message', {
      type: 'notification',
      text: `${username}님이 입장하셨습니다.`,
      time
    });
    
    // Welcome message to the user
    socket.emit('message', {
      type: 'notification',
      text: `환영합니다, ${username}님!`,
      time
    });
  });

  // User sends a chat message
  socket.on('sendMessage', (messageData) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Broadcast message to everyone including sender
    io.emit('message', {
      type: 'message',
      username: socket.username || '익명',
      text: messageData.text,
      time
    });
  });

  // User disconnects
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    if (socket.username) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      io.emit('message', {
        type: 'notification',
        text: `${socket.username}님이 퇴장하셨습니다.`,
        time
      });
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
