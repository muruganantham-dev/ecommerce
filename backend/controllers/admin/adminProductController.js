import Product from '../../models/Product.js';
import { body, validationResult } from 'express-validator';

/**
 * GET /api/admin/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category, isActive } = req.query;
    const query = {};
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
    if (category) query.category = category;
    if (isActive !== undefined && isActive !== '') query.isActive = isActive === 'true';
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ]);
    res.json({ success: true, products, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { name, description, price, mrp, discount, category, stock, isActive } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const priceNum = Number(price);
    const mrpNum = mrp !== undefined && mrp !== '' ? Number(mrp) : null;
    const product = await Product.create({
      name,
      description: description || '',
      price: priceNum,
      mrp: mrpNum,
      discount: Number(discount) || 0,
      category: category || '',
      stock: Number(stock) || 0,
      isActive: isActive !== 'false',
      image,
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { name, description, price, mrp, discount, category, stock, isActive } = req.body;
    const update = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(mrp !== undefined && { mrp: mrp === '' ? null : Number(mrp) }),
      ...(discount !== undefined && { discount: Number(discount) }),
      ...(category !== undefined && { category }),
      ...(stock !== undefined && { stock: Number(stock) }),
      ...(isActive !== undefined && { isActive: isActive !== 'false' }),
    };
    if (req.file) update.image = `/uploads/${req.file.filename}`;
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/products/:id/toggle-active
 */
export const toggleProductActive = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    product.isActive = !product.isActive;
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    next(error);
  }
};
