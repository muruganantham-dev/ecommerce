import Payment from '../../models/Payment.js';

/**
 * GET /api/admin/payments
 */
export const getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [payments, total] = await Promise.all([
      Payment.find(query).populate('order').populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Payment.countDocuments(query),
    ]);
    res.json({ success: true, payments, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
  } catch (error) {
    next(error);
  }
};
