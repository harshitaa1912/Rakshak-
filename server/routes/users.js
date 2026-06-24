const express = require('express');
const User = require('../models/User');
const SOSRequest = require('../models/SOSRequest');
const Shelter = require('../models/Shelter');
const Report = require('../models/Report');
const Alert = require('../models/Alert');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (without passwords)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @route   PUT /api/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  const { role } = req.body;

  if (!['user', 'volunteer', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// @route   POST /api/users/mark-safe
// @desc    Mark current user as safe
// @access  Private
router.post('/mark-safe', protect, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      isSafe: true,
      lastSafeUpdate: new Date(),
    },
    { new: true }
  );

  res.json({ message: 'Marked as safe', user });
});

// @route   GET /api/users/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  const [
    totalUsers,
    totalVolunteers,
    activeSOS,
    resolvedSOS,
    totalShelters,
    totalReports,
    totalAlerts,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'volunteer' }),
    SOSRequest.countDocuments({ status: { $in: ['pending', 'assigned', 'in-progress'] } }),
    SOSRequest.countDocuments({ status: 'resolved' }),
    Shelter.countDocuments(),
    Report.countDocuments({ status: 'active' }),
    Alert.countDocuments({ isActive: true }),
  ]);

  res.json({
    totalUsers,
    totalVolunteers,
    activeSOS,
    resolvedSOS,
    totalShelters,
    totalReports,
    totalAlerts,
  });
});

module.exports = router;
