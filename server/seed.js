require('dotenv').config();
const mongoose = require('mongoose');
const Shelter = require('./models/Shelter');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const mockShelters = [
  {
    name: 'Central City Evacuation Center',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    address: '123 Main St, Central City',
    capacity: 500,
    currentOccupancy: 120,
    waterAvailable: true,
    foodAvailable: true,
    medicalAvailable: true,
    contact: '+91 9876543210',
    description: 'Main evacuation center managed by John Doe.',
    status: 'open'
  },
  {
    name: 'Northwood High School Relief Camp',
    location: { type: 'Point', coordinates: [77.5806, 13.0068] },
    address: '45 Northwood Ave',
    capacity: 300,
    currentOccupancy: 250,
    waterAvailable: true,
    foodAvailable: true,
    medicalAvailable: false,
    contact: '+91 9876543211',
    description: 'School relief camp managed by Jane Smith.',
    status: 'open'
  },
  {
    name: 'Southside Community Hall',
    location: { type: 'Point', coordinates: [77.6044, 12.9304] },
    address: '78 South Blvd',
    capacity: 200,
    currentOccupancy: 195,
    waterAvailable: true,
    foodAvailable: false,
    medicalAvailable: true,
    contact: '+91 9876543212',
    description: 'Community hall managed by Mike Johnson.',
    status: 'full'
  }
];

const seedData = async () => {
  await connectDB();
  
  try {
    // Clear existing shelters
    await Shelter.deleteMany();
    console.log('Cleared existing shelters...');

    // Insert mock shelters
    await Shelter.insertMany(mockShelters);
    console.log('Successfully seeded database with mock shelters!');

    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
