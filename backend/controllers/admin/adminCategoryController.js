import Category from '../../models/Category.js';
import { body, validationResult } from 'express-validator';

/**
 * GET /api/admin/categories
 * List all categories (for admin product form & category management)
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .sort({ order: 1, name: 1 })
      .lean();
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/categories/:id
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/categories
 */
export const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, slug, description, isActive, order } = req.body;
    const slugValue = (slug && slug.trim()) || name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const category = await Category.create({
      name: name.trim(),
      slug: slugValue || undefined,
      description: description || '',
      isActive: isActive !== 'false',
      order: Number(order) || 0,
    });
    res.status(201).json({ success: true, category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category name or slug already exists.' });
    }
    next(error);
  }
};

/**
 * PUT /api/admin/categories/:id
 */
export const updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, slug, description, isActive, order } = req.body;
    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (slug !== undefined) update.slug = slug.trim() || undefined;
    if (description !== undefined) update.description = description;
    if (isActive !== undefined) update.isActive = isActive !== 'false';
    if (order !== undefined) update.order = Number(order) || 0;

    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category name or slug already exists.' });
    }
    next(error);
  }
};

/**
 * DELETE /api/admin/categories/:id
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    next(error);
  }
};
