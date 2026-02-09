import express from 'express';
import { body } from 'express-validator';
import { createPaymentOrder, verifyPayment, notifyPaymentFailure } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post(
  '/create-order',
  [body('orderId').notEmpty().withMessage('Order ID is required').isMongoId().withMessage('Invalid order ID')],
  createPaymentOrder
);

router.post(
  '/verify',
  [
    body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID required'),
    body('razorpay_payment_id').notEmpty().withMessage('Razorpay payment ID required'),
    body('razorpay_signature').notEmpty().withMessage('Razorpay signature required'),
  ],
  verifyPayment
);

router.post(
  '/notify-failure',
  [body('orderId').notEmpty().withMessage('Order ID is required').isMongoId().withMessage('Invalid order ID')],
  notifyPaymentFailure
);

export default router;
