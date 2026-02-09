import express from 'express';
import { body } from 'express-validator';
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('orderItems')
      .isArray({ min: 1 })
      .withMessage('Order items required (at least one)'),
    body('orderItems.*.product').isMongoId().withMessage('Invalid product ID'),
    body('orderItems.*.quantity').isInt({ min: 1, max: 99 }).withMessage('Quantity must be 1-99'),
    body('shippingAddress').notEmpty().withMessage('Shipping address required'),
    body('shippingAddress.name').trim().notEmpty().withMessage('Name required'),
    body('shippingAddress.phone').trim().notEmpty().withMessage('Phone required'),
    body('shippingAddress.street').trim().notEmpty().withMessage('Street/address required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City required'),
    body('shippingAddress.pincode').trim().notEmpty().withMessage('Pincode required'),
    body('shippingAddress.state').optional().trim(),
  ],
  createOrder
);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;
