const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a shelter name'],
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
      },
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide shelter capacity'],
    },
    currentOccupancy: {
      type: Number,
      default: 0,
    },
    foodAvailable: {
      type: Boolean,
      default: false,
    },
    medicalAvailable: {
      type: Boolean,
      default: false,
    },
    waterAvailable: {
      type: Boolean,
      default: true,
    },
    contact: {
      type: String,
    },
    status: {
      type: String,
      enum: ['open', 'full', 'closed'],
      default: 'open',
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

shelterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shelter', shelterSchema);
