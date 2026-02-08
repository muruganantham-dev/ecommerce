/**
 * Create default admin user. Run: node scripts/seedAdmin.js
 * Requires MONGODB_URI in .env
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'Admin';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log('Existing user updated to admin:', ADMIN_EMAIL);
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log('Admin user created:', ADMIN_EMAIL);
  }
  console.log('\n--- Admin Login Credentials ---');
  console.log('Email:', ADMIN_EMAIL);
  console.log('Password:', ADMIN_PASSWORD);
  console.log('URL: http://localhost:3000/admin/login\n');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
