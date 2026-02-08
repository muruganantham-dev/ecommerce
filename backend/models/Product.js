import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, default: null, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    image: { type: String, default: '' },
    category: { type: String, trim: true, index: true },
    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
