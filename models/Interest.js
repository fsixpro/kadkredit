const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interestSchema = new Schema({
  range: Number,
  rate: Number,
  joined: {
    type: Date,
  },
});

module.exports = interest = mongoose.model('interest', interestSchema);
