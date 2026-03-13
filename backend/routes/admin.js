const express = require('express');
const User = require('../models/User');
const CreditScore = require('../models/CreditScore');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/stats
// @desc    Get application statistics
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalChecks = await CreditScore.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true, role: 'user' });

    const scoreDistribution = await CreditScore.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      }
    ]);

    const recentSignups = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt currentScore');

    const avgScore = await CreditScore.aggregate([
      { $group: { _id: null, avg: { $avg: '$score' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalChecks,
        activeUsers,
        averageScore: avgScore.length > 0 ? Math.round(avgScore[0].avg) : 0,
        scoreDistribution,
        recentSignups
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching admin stats' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    const total = await User.countDocuments({ role: 'user' });

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// @route   PUT /api/admin/users/:id/toggle
// @desc    Toggle user active status
// @access  Admin
router.put('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user status' });
  }
});

module.exports = router;
