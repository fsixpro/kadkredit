const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  msg: String,
  joined: Date,
});

module.exports = notification = mongoose.model(
  'notification',
  notificationSchema
);
