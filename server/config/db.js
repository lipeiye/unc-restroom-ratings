const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/unc-restrooms');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Fallback: continue without DB for demo purposes
    console.log('⚠️  Running without database - data will not persist');
  }
};

module.exports = connectDB;
