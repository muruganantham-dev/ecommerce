import Category from '../models/Category.js';

/**
 * @route   GET /api/categories
 * @desc    List active categories (public, for filter & display)
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .select('name slug')
      .lean();
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};
