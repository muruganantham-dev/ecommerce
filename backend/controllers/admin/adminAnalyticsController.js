import Order from '../../models/Order.js';

/**
 * GET /api/admin/analytics/sales
 * Monthly sales for chart (last 12 months)
 */
export const getSalesAnalytics = async (req, res, next) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const result = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          totalSales: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics/top-products
 */
export const getTopProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const result = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          totalQty: { $sum: '$orderItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: Number(limit) },
    ]);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics/revenue
 * Total revenue + by period if needed
 */
export const getRevenueSummary = async (req, res, next) => {
  try {
    const [total, thisMonth] = await Promise.all([
      Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]).then((r) => r[0]?.total ?? 0),
      Order.aggregate([
        {
          $match: {
            isPaid: true,
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]).then((r) => r[0]?.total ?? 0),
    ]);
    res.json({ success: true, totalRevenue: total, thisMonthRevenue: thisMonth });
  } catch (error) {
    next(error);
  }
};
