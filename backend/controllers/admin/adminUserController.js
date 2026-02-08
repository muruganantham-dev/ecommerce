import User from '../../models/User.js';
import Order from '../../models/Order.js';

/**
 * GET /api/admin/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'user' };
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(query),
    ]);
    res.json({ success: true, users, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users/:id/orders
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/users/:id/block
 */
export const blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot block admin.' });
    user.isBlocked = true;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/users/:id/unblock
 */
export const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin.' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (error) {
    next(error);
  }
};
