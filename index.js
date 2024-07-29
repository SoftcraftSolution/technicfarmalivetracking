const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

// Import the necessary models

const Salesman=require('./src/model/salesman.model')

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware to parse JSON bodies
app.use(express.json());


// Function to find the nearest active driver




// Connect to Monmongodb+srv://Rahul:myuser@rahul.fack9.mongodb.net/Databaserahul?authSource=admin&replicaSet=atlas-117kuv-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=truegoDB
mongoose.connect("mongodb+srv://Rahul:myuser@rahul.fack9.mongodb.net/Databaserahul?authSource=admin&replicaSet=atlas-117kuv-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true")
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Socket.io connection event handler





let salesmanSockets=new Map();
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Existing code...

  // Handle registering a salesman
  socket.on('registerSalesman', (email) => {
    console.log(email);
    salesmanSockets.set(email, socket);
    console.log('Salesman registered:', salesmanSockets);
  });

  // Handle location updates from salesmen
  

  // Handle salesman disconnection
  socket.on('disconnect', () => {
    for (const [userId, salesmanSocket] of salesmanSockets.entries()) {
      if (salesmanSocket.id === socket.id) {
        salesmanSockets.delete(userId);
        console.log('Salesman disconnected:', userId);
        break;
      }
    }

    // Clean up the driver and client maps
    driverSockets.forEach((s, phoneNumber) => {
      if (s.id === socket.id) {
        driverSockets.delete(phoneNumber);
      }
    });

    clientSockets.forEach((s, phoneNumber) => {
      if (s.id === socket.id) {
        clientSockets.delete(phoneNumber);
      }
    });
  });

  // Additional existing code...
});




const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});