const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  email: String,
  otp: Number,
});

module.exports = mongoose.model('otp', otpSchema);
