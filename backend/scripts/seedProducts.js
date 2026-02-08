/**
 * Seed sample products. Run: node scripts/seedProducts.js
 * Requires MONGODB_URI in env or .env
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

dotenv.config();

const sampleProducts = [
  { name: 'Wireless Headphones', description: 'Noise cancelling over-ear headphones', price: 2999, category: 'Electronics', stock: 50 },
  { name: 'USB-C Cable Pack', description: '3-pack durable braided cables', price: 499, category: 'Accessories', stock: 100 },
  { name: 'Desk Lamp', description: 'LED adjustable desk lamp', price: 1299, category: 'Home', stock: 30 },
  { name: 'Running Shoes', description: 'Lightweight sports shoes', price: 3499, category: 'Footwear', stock: 40 },
  { name: 'Backpack', description: 'Water-resistant laptop backpack', price: 1899, category: 'Accessories', stock: 60 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log('Seeded', sampleProducts.length, 'products');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
