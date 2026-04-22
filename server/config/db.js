const mongoose = require('mongoose');

let dbConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/unc-restrooms');
    dbConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Running in memory mode - data will not persist');
    dbConnected = false;
  }
};

const isDBConnected = () => dbConnected;

module.exports = connectDB;
module.exports.isDBConnected = isDBConnected;
