const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('mongo db connected');
  } catch (error) {
    console.log(error);
  }
};

module.exports = db;
