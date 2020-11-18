const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  lastFour: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    require: true,
    max: 15,
  },
  authCode: {
    type: String,
    max: 25,
  },
  bin: {
    type: Number,
  },
  bank: {
    type: String,
  },
  reusable: {
    type: String,
  },
  signature: {
    type: String,
  },
  channel: {
    type: String,
  },
  brand: {
    type: String,
  },
  exp_year: {
    type: Number,
  },
});

module.exports = card = mongoose.model('cards', cardSchema);
