const express = require('express');
const Alert = require('../models/Alert');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

module.exports = (io) => {
  const router = express.Router();

  // @route   GET /api/alerts
  // @desc    Get all alerts, optionally filter by active status
  // @access  Public
  router.get('/', async (req, res) => {
    const filter = {};

    if (req.query.active === 'true') {
      filter.isActive = true;
    }

    const alerts = await Alert.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(alerts);
  });

  // @route   POST /api/alerts
  // @desc    Create a new alert
  // @access  Private/Admin
  router.post('/', protect, authorize('admin'), async (req, res) => {
    req.body.createdBy = req.user._id;

    const alert = await Alert.create(req.body);

    const populatedAlert = await Alert.findById(alert._id)
      .populate('createdBy', 'name');

    // Emit socket event for real-time updates
    io.emit('new-alert', populatedAlert);

    res.status(201).json(populatedAlert);
  });

  // @route   PUT /api/alerts/:id
  // @desc    Update an alert
  // @access  Private/Admin
  router.put('/:id', protect, authorize('admin'), async (req, res) => {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name');

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  });

  // @route   DELETE /api/alerts/:id
  // @desc    Deactivate/delete an alert
  // @access  Private/Admin
  router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ message: 'Alert deactivated', alert });
  });

  return router;
};
