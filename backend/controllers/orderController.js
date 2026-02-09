import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { validationResult } from 'express-validator';
import { sendOrderSuccessWhatsApp, sendOrderCancelledWhatsApp } from '../services/whatsappService.js';

/**
 * @route   POST /api/orders
 * @desc    Create new order (cart → order, before payment)
 */
export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msg = errors.array().map((e) => e.msg).join('. ');
      return res.status(400).json({ success: false, message: msg, errors: errors.array() });
    }
    const { orderItems, shippingAddress } = req.body;
    let itemsPrice = 0;
    const orderItemsWithDetails = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
      const lineTotal = product.price * item.quantity;
      itemsPrice += lineTotal;
      orderItemsWithDetails.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.image,
      });
    }
    const shippingPrice = itemsPrice > 500 ? 0 : 40;
    const taxPrice = Math.round(itemsPrice * 0.05);
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    const order = await Order.create({
      user: req.user._id,
      orderItems: orderItemsWithDetails,
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders
 * @desc    Get logged-in user's orders
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('orderItems.product');
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID (own order only)
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order.' });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order (only if not paid or pending)
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    if (order.isPaid) {
      return res.status(400).json({ success: false, message: 'Paid orders cannot be cancelled here. Contact support.' });
    }
    order.status = 'cancelled';
    await order.save();
    // WhatsApp: order cancelled
    const userPhone = order.shippingAddress?.phone || req.user.phone;
    if (userPhone) {
      await sendOrderCancelledWhatsApp(userPhone, order._id.toString()).catch(() => {});
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
