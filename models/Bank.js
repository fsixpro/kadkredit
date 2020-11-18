const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bankSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  accountNumber: {
    type: Number,
    required: true,
  },
  accountName: String,
  bankCode: String,
  bankId: Number,
});

module.exports = bank = mongoose.model('banks', bankSchema);
