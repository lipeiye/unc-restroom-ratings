const mongoose = require('mongoose');
const { initSQLite } = require('./sqlite');

let dbConnected = false;
let sqliteConnected = false;

const connectDB = async () => {
  // 1. Try MongoDB first
  if (process.env.MONGODB_URI) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      dbConnected = true;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
    }
  } else {
    console.log('ℹ️  No MONGODB_URI set, skipping MongoDB connection');
  }

  // 2. Fallback to SQLite
  try {
    await initSQLite();
    sqliteConnected = true;
    console.log('✅ SQLite fallback active — data persists to local file');
  } catch (error) {
    console.error('❌ SQLite initialization error:', error.message);
    console.log('⚠️  Running in pure memory mode — data will not persist');
  }
};

const isDBConnected = () => dbConnected;
const isSQLiteConnected = () => sqliteConnected;

module.exports = connectDB;
module.exports.isDBConnected = isDBConnected;
module.exports.isSQLiteConnected = isSQLiteConnected;
