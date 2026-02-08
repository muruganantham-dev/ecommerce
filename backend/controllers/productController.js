import Product from '../models/Product.js';

/**
 * @route   GET /api/products
 * @desc    Get all products (search, filter, paginate)
 */
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (search && search.trim()) {
      query.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { description: new RegExp(search.trim(), 'i') },
      ];
    }
    if (category) query.category = category;
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ]);
    res.json({
      success: true,
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/categories
 * @desc    Get distinct categories (for filters)
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json({ success: true, categories: categories.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};
