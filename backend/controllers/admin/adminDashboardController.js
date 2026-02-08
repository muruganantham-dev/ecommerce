import User from '../../models/User.js';
import Order from '../../models/Order.js';
import Payment from '../../models/Payment.js';

/**
 * GET /api/admin/dashboard
 * Stats: users, orders, revenue, recent orders
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [userCount, orderCount, totalRevenue, recentOrders] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]).then((r) => r[0]?.total ?? 0),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email').lean(),
    ]);
    res.json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalOrders: orderCount,
        totalRevenue: totalRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
