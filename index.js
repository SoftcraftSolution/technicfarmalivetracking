const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
// Import the necessary models
const Salesman = require('./src/model/salesman.model');
const User = require('./src/model/user.model');
// Load environment variables from .env file
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Socket.io connection event handler
let salesmanSockets = new Map();
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  let changeStream;

  // Handle email event
  socket.on('email', (email) => {
    console.log('Received email:', email);

    // Store the socket connection with email
    salesmanSockets.set(email, socket);

    // Close previous change stream if it exists
    if (changeStream) {
      changeStream.close();
    }

    // Set up a change stream to listen for changes in the User collection
    changeStream = User.watch([
      { $match: { $and: [{ 'fullDocument.email': email }] } }
    ]);

    changeStream.on('change', async (change) => {
      console.log('Change occurred:', change);

      // Extract the updated document from the change event
      const updatedDocument = await User.findById(change.documentKey._id);
      console.log('Updated Document:', updatedDocument);

      // Emit the updated document to the specific client's socket
      if (updatedDocument) {
        // Emit updated location if the document is found
        socket.emit('salesmanLocation', {
          latitude: updatedDocument.location.lat,
          longitude: updatedDocument.location.log
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      // Remove socket from salesmanSockets map when disconnected
      salesmanSockets.forEach((value, key) => {
        if (value === socket) {
          salesmanSockets.delete(key);
        }
      });
      // Close the change stream when the socket disconnects
      if (changeStream) {
        changeStream.close();
      }
    });
  });

  // Handle salesman disconnection
  socket.on('disconnect', () => {
    for (const [email, salesmanSocket] of salesmanSockets.entries()) {
      if (salesmanSocket.id === socket.id) {
        salesmanSockets.delete(email);
        console.log('Salesman disconnected:', email);
        break;
      }
    }
  });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
