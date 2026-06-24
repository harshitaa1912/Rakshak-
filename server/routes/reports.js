const express = require('express');
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

module.exports = (io) => {
  const router = express.Router();

  // @route   GET /api/reports
  // @desc    Get all active reports
  // @access  Public
  router.get('/', async (req, res) => {
    const reports = await Report.find({ status: 'active' })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json(reports);
  });

  // @route   POST /api/reports
  // @desc    Create a new report
  // @access  Private
  router.post('/', protect, async (req, res) => {
    req.body.userId = req.user._id;

    const report = await Report.create(req.body);

    const populatedReport = await Report.findById(report._id)
      .populate('userId', 'name');

    // Emit socket event for real-time updates
    io.emit('new-report', populatedReport);

    res.status(201).json(populatedReport);
  });

  // @route   PUT /api/reports/:id/verify
  // @desc    Verify or reject a report
  // @access  Private/Admin
  router.put('/:id/verify', protect, authorize('admin'), async (req, res) => {
    const { verified, status } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        verified: verified !== undefined ? verified : true,
        verifiedBy: req.user._id,
        status: status || (verified === false ? 'fake' : 'active'),
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  });

  // @route   DELETE /api/reports/:id
  // @desc    Delete a report
  // @access  Private/Admin
  router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report removed' });
  });

  return router;
};
