import Order from '../../models/Order.js';
import { sendOrderStatusWhatsApp } from '../../services/whatsappService.js';

/**
 * GET /api/admin/orders
 */
export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('user', 'name email phone').lean(),
      Order.countDocuments(query),
    ]);
    res.json({ success: true, orders, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone').populate('orderItems.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/orders/:id/status
 * Body: { status: 'pending'|'confirmed'|'shipped'|'delivered'|'cancelled' }
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status required: ' + allowed.join(', ') });
    }
    const order = await Order.findById(req.params.id).populate('user', 'phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    const previousStatus = order.status;
    order.status = status;
    order.updatedByAdmin = req.user._id;
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({ status, at: new Date(), updatedBy: req.user._id });
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
    await order.save();
    const phone = order.shippingAddress?.phone || order.user?.phone;
    if (phone) {
      await sendOrderStatusWhatsApp(phone, order._id.toString(), status).catch(() => {});
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
