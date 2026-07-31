const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/groo_erp';
    await mongoose.connect(uri);
    console.log(`[MongoDB] Connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error(`[MongoDB] Connection error: ${err.message}`);
    if (!process.env.MONGO_URI) {
      console.error('[MongoDB] No MONGO_URI configured. Start local MongoDB or set MONGO_URI in backend/.env.');
    } else {
      console.error('[MongoDB] MONGO_URI is configured. Confirm the connection string and network access.');
    }
    throw err;
  }
};

module.exports = connectDB;
