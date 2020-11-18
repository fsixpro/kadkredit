const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceShema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  gcim: String,
  joined: Date,
});
