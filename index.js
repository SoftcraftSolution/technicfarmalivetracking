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
mongoose.connect('mongodb+srv://Rahul:myuser@rahul.fack9.mongodb.net/TechnicFarma?authSource=admin&replicaSet=atlas-117kuv-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Socket.io connection event handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('watchDocument', async (email) => {
    console.log('Watching document for email:', email);

    // Set up a change stream to watch changes in the User collection
    const changeStream = User.watch();

    changeStream.on('change', async (change) => {
      console.log('Change occurred:', change);

      if (change.operationType === 'update' || change.operationType === 'replace') {
        // Fetch the updated document
        const updatedDocument = await User.findById(change.documentKey._id);

        // Check if the email field in the updated document matches the provided email
        if (updatedDocument && updatedDocument.email === email) {
          console.log('Updated Document:', updatedDocument);

          // Emit the updated document fields to the specific client's socket
          socket.emit('documentUpdated', updatedDocument.location);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      changeStream.close();
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
