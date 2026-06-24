const express = require('express');
const Shelter = require('../models/Shelter');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// @route   GET /api/shelters
// @desc    Get all shelters with optional filters
// @access  Public
router.get('/', async (req, res) => {
  const { status, food, medical, search } = req.query;
  const filter = {};

  if (status) {
    filter.status = status;
  }
  if (food === 'true') {
    filter.foodAvailable = true;
  }
  if (medical === 'true') {
    filter.medicalAvailable = true;
  }
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const shelters = await Shelter.find(filter).populate('createdBy', 'name email');
  res.json(shelters);
});

// @route   GET /api/shelters/nearby/:lng/:lat
// @desc    Find shelters near given coordinates (within 50km)
// @access  Public
router.get('/nearby/:lng/:lat', async (req, res) => {
  const { lng, lat } = req.params;

  const shelters = await Shelter.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: 50000, // 50km in meters
      },
    },
  });

  res.json(shelters);
});

// @route   GET /api/shelters/:id
// @desc    Get single shelter by ID
// @access  Public
router.get('/:id', async (req, res) => {
  const shelter = await Shelter.findById(req.params.id).populate('createdBy', 'name email');

  if (!shelter) {
    return res.status(404).json({ message: 'Shelter not found' });
  }

  res.json(shelter);
});

// @route   POST /api/shelters
// @desc    Create a new shelter
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  req.body.createdBy = req.user._id;
  const shelter = await Shelter.create(req.body);
  res.status(201).json(shelter);
});

// @route   PUT /api/shelters/:id
// @desc    Update a shelter
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  const shelter = await Shelter.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!shelter) {
    return res.status(404).json({ message: 'Shelter not found' });
  }

  res.json(shelter);
});

// @route   DELETE /api/shelters/:id
// @desc    Delete a shelter
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  const shelter = await Shelter.findByIdAndDelete(req.params.id);

  if (!shelter) {
    return res.status(404).json({ message: 'Shelter not found' });
  }

  res.json({ message: 'Shelter removed' });
});

module.exports = router;
