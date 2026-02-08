/**
 * Seed categories from existing product categories (run once after adding Category model).
 * Run: node scripts/seedCategories.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
  const names = await Product.distinct('category', {});
  const valid = names.filter(Boolean);
  let created = 0;
  for (const name of valid) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const exists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (!exists) {
      await Category.create({ name, slug, isActive: true });
      created++;
    }
  }
  console.log('Categories: ensured', valid.length, 'from products; created', created);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
