const express = require('express');
const SOSRequest = require('../models/SOSRequest');
const { protect } = require('../middleware/auth');

module.exports = (io) => {
  const router = express.Router();

  // @route   GET /api/sos
  // @desc    Get all SOS requests (admin/volunteer see all, users see own)
  // @access  Private
  router.get('/', protect, async (req, res) => {
    let filter = {};

    // Regular users only see their own SOS requests
    if (req.user.role === 'user') {
      filter.userId = req.user._id;
    }

    const sosRequests = await SOSRequest.find(filter)
      .populate('userId', 'name email phone')
      .populate('assignedVolunteer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(sosRequests);
  });

  // @route   GET /api/sos/my
  // @desc    Get current user's SOS requests
  // @access  Private
  router.get('/my', protect, async (req, res) => {
    const sosRequests = await SOSRequest.find({ userId: req.user._id })
      .populate('userId', 'name email phone')
      .populate('assignedVolunteer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(sosRequests);
  });

  // @route   POST /api/sos
  // @desc    Create a new SOS request
  // @access  Private
  router.post('/', protect, async (req, res) => {
    req.body.userId = req.user._id;

    const sosRequest = await SOSRequest.create(req.body);

    // Populate the created request for the socket event
    const populatedSOS = await SOSRequest.findById(sosRequest._id)
      .populate('userId', 'name email phone');

    // Emit socket event for real-time updates
    io.emit('new-sos', populatedSOS);

    res.status(201).json(populatedSOS);
  });

  // @route   PUT /api/sos/:id
  // @desc    Update SOS request (status, assigned volunteer)
  // @access  Private
  router.put('/:id', protect, async (req, res) => {
    let sosRequest = await SOSRequest.findById(req.params.id);

    if (!sosRequest) {
      return res.status(404).json({ message: 'SOS request not found' });
    }

    // Volunteer can assign themselves
    if (req.user.role === 'volunteer' && req.body.assignedVolunteer === undefined) {
      req.body.assignedVolunteer = req.user._id;
      if (!req.body.status) {
        req.body.status = 'assigned';
      }
    }

    // Set resolvedAt timestamp when status is resolved
    if (req.body.status === 'resolved') {
      req.body.resolvedAt = new Date();
    }

    sosRequest = await SOSRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('userId', 'name email phone')
      .populate('assignedVolunteer', 'name email phone');

    // Emit socket event for real-time updates
    io.emit('sos-updated', sosRequest);

    res.json(sosRequest);
  });

  return router;
};
