const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },
  joined: {
    type: Date,
    default: Date.now,
  },
  status: Number,
});

module.exports = users = mongoose.model('users', userSchema);
