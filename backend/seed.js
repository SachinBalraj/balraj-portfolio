require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@balraj.com';
    const password = 'admin123';

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('Admin already exists');
      await mongoose.disconnect();
      return;
    }

    await Admin.create({ name: 'Balraj', email, password });
    console.log(`Admin created: ${email} / ${password}`);
    await mongoose.disconnect();
    console.log('Done');
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
