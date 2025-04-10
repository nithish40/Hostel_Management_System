require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  roomNumber: String,
  hostelBlock: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Create User model
    const User = mongoose.model('User', UserSchema);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@hostel.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      mongoose.connection.close();
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@hostel.com',
      password: hashedPassword,
      role: 'admin',
      roomNumber: 'N/A',
      hostelBlock: 'N/A',
    });
    
    await admin.save();
    console.log('Admin user created successfully');
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
