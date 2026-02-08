import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadProductImage } from '../middleware/upload.js';
import { body } from 'express-validator';
import * as dashboard from '../controllers/admin/adminDashboardController.js';
import * as products from '../controllers/admin/adminProductController.js';
import * as orders from '../controllers/admin/adminOrderController.js';
import * as users from '../controllers/admin/adminUserController.js';
import * as payments from '../controllers/admin/adminPaymentController.js';
import * as analytics from '../controllers/admin/adminAnalyticsController.js';
import * as categories from '../controllers/admin/adminCategoryController.js';

const router = express.Router();

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many admin requests.' },
});
router.use(adminLimiter);
router.use(protect);
router.use(adminOnly);

// Dashboard
router.get('/dashboard', dashboard.getDashboardStats);

// Categories (CRUD)
router.get('/categories', categories.getCategories);
router.get('/categories/:id', categories.getCategoryById);
router.post('/categories', [body('name').trim().notEmpty()], categories.createCategory);
router.put('/categories/:id', [body('name').optional().trim().notEmpty()], categories.updateCategory);
router.delete('/categories/:id', categories.deleteCategory);

// Products
router.get('/products', products.getProducts);
router.get('/products/:id', products.getProductById);
router.post(
  '/products',
  uploadProductImage,
  [
    body('name').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
  ],
  products.createProduct
);
router.put(
  '/products/:id',
  uploadProductImage,
  [
    body('name').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
  ],
  products.updateProduct
);
router.patch('/products/:id/toggle-active', products.toggleProductActive);
router.delete('/products/:id', products.deleteProduct);

// Orders
router.get('/orders', orders.getOrders);
router.get('/orders/:id', orders.getOrderById);
router.put('/orders/:id/status', body('status').notEmpty(), orders.updateOrderStatus);

// Users
router.get('/users', users.getUsers);
router.get('/users/:id', users.getUserById);
router.get('/users/:id/orders', users.getUserOrders);
router.patch('/users/:id/block', users.blockUser);
router.patch('/users/:id/unblock', users.unblockUser);
router.delete('/users/:id', users.deleteUser);

// Payments
router.get('/payments', payments.getPayments);

// Analytics
router.get('/analytics/sales', analytics.getSalesAnalytics);
router.get('/analytics/top-products', analytics.getTopProducts);
router.get('/analytics/revenue', analytics.getRevenueSummary);

export default router;
