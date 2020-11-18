const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bvnSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  bvnNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = bvn = mongoose.model('bvn', bvnSchema);
