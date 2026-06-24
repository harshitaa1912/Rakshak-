const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an alert title'],
    },
    message: {
      type: String,
      required: [true, 'Please provide an alert message'],
    },
    disasterType: {
      type: String,
      enum: [
        'earthquake',
        'flood',
        'tsunami',
        'cyclone',
        'landslide',
        'fire',
        'storm',
        'other',
      ],
      required: [true, 'Please specify disaster type'],
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: [true, 'Please specify severity level'],
    },
    area: {
      type: String,
      required: [true, 'Please specify the affected area'],
    },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: [Number],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Alert', alertSchema);
