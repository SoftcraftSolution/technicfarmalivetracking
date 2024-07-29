const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  phonenumber: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  resetCode: {
    type: String
  },
  isAdminApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  location: {
    lat: {
      type: Number,
      default: 0 // Default latitude
    },
    log: {
      type: Number,
      default: 0 // Default longitude
    }
  }
});

module.exports = mongoose.model('User', userSchema);
