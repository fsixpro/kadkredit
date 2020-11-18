const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    refCode: {
        type: String,
        max: 12
    },
    amount: {
        type: Number,
    },
    status: {
        type: Number,
        max: 2
    }
});

module.exports = transaction = mongoose.model('transactions', transactionSchema);