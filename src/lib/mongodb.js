// src/lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Add these options to help with TLS issues
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      // Set to the latest TLS version
      tlsCAFile: undefined, // Only set if you have a custom CA
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      heartbeatFrequencyMS: 10000, // Check server status every 10 seconds
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully!');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

// Add a function to check connection status
async function checkConnection() {
  try {
    const conn = await dbConnect();
    return { 
      connected: conn.connection.readyState === 1,
      status: getConnectionStatus(conn.connection.readyState)
    };
  } catch (error) {
    return { 
      connected: false, 
      status: 'Error',
      error: error.message 
    };
  }
}

function getConnectionStatus(readyState) {
  switch (readyState) {
    case 0: return 'Disconnected';
    case 1: return 'Connected';
    case 2: return 'Connecting';
    case 3: return 'Disconnecting';
    default: return 'Unknown';
  }
}

export { dbConnect as default, checkConnection };
