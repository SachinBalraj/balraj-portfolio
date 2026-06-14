const mongoose = require('mongoose');

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected');
    return conn;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.error(`MongoDB connection failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1}): ${error.message}`);
      console.log(`Retrying in ${RETRY_DELAY / 1000}s...`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
      return connectDB(retryCount + 1);
    }
    console.error(`MongoDB connection failed after ${MAX_RETRIES + 1} attempts: ${error.message}`);
    console.error('Server will continue without MongoDB. Some features may be unavailable.');
  }
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

module.exports = connectDB;
