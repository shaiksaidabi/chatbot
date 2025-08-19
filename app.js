const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (optional, if you have frontend files like HTML, CSS, etc.)
app.use(express.static('public'));

// Set up a simple route for testing
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

let totalClients = 0;

// Handle socket connections
io.on('connection', (socket) => {
  totalClients++;
  io.emit('clients-total', totalClients);  // Broadcast total clients to all clients
  console.log('A user connected');

  // When a message is received from the client, send it to all other clients except the sender
  socket.on('message', (data) => {
    // Send the message to all clients except the sender
    socket.broadcast.emit('chat-message', data);
    // Also send the message to the sender
    socket.emit('chat-message', data);
  });

  // When a user starts typing (feedback), broadcast it to others except the sender
  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data);  // Send feedback to everyone except the sender
  });

  // When a user starts typing (first feedback), broadcast it to others except the sender
  socket.on('fffeedback', (data) => {
    socket.broadcast.emit('feedback', data);  // Send feedback to everyone except the sender
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    totalClients--;
    io.emit('clients-total', totalClients);  // Update total clients when someone disconnects
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
