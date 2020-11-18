const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  amount: {
    type: Number,
  },
  repay_amount: {
    type: Number,
  },
  repay_date: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
  },
  joined: {
    type: Date,
    default: Date.now,
  },
});
module.exports = loan = mongoose.model('loan', loanSchema);
