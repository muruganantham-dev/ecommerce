import crypto from 'crypto';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/razorpayService.js';
import { sendOrderSuccessWhatsApp } from '../services/whatsappService.js';

/**
 * @route   POST /api/payments/create-order
 * @desc    Create Razorpay order (amount in paise)
 */
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }
    const order = await Order.findById(orderId).populate('user');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    const orderUserId = order.user?._id?.toString?.() || order.user?.toString?.();
    if (orderUserId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    if (order.isPaid) {
      return res.status(400).json({ success: false, message: 'Order already paid.' });
    }
    const amountInPaise = Math.round(order.totalPrice * 100);
    // Razorpay minimum is 100 paise (₹1)
    if (amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: 'Order total must be at least ₹1 to pay online. Current total is too low.',
      });
    }
    let razorpayOrder;
    try {
      razorpayOrder = await createRazorpayOrder(amountInPaise, orderId);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('not configured') || !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return res.status(503).json({
          success: false,
          message: 'Payment gateway is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server .env.',
        });
      }
      // Razorpay SDK may put description in err.error.description or err.response?.data?.error?.description
      const description =
        err.description ||
        err.error?.description ||
        err.response?.data?.error?.description ||
        err.response?.data?.error?.reason ||
        msg;
      return res.status(400).json({
        success: false,
        message: description || 'Could not create payment order. Check Razorpay keys and amount (min ₹1).',
      });
    }
    await Payment.create({
      order: order._id,
      user: req.user._id,
      razorpay_order_id: razorpayOrder.id,
      amount: order.totalPrice,
      status: 'created',
    });
    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/payments/verify
 * @desc    Verify Razorpay signature and capture payment
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details.' });
    }
    const isValid = verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }
    const payment = await Payment.findOne({ razorpay_order_id }).populate('order');
    if (!payment || !payment.order) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }
    const order = await Order.findById(payment.order._id).populate('user');
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'confirmed';
    order.paymentResult = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    };
    await order.save();
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    payment.status = 'captured';
    await payment.save();
    // Reduce stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    // WhatsApp: order success
    const userPhone = order.shippingAddress?.phone || order.user?.phone;
    if (userPhone) {
      await sendOrderSuccessWhatsApp(userPhone, order).catch(() => {});
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
