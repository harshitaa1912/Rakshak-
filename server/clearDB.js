require('dotenv').config();
const mongoose = require('mongoose');
const Shelter = require('./models/Shelter');
const SOSRequest = require('./models/SOSRequest');
const Report = require('./models/Report');
const Alert = require('./models/Alert');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Cleanup...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const clearData = async () => {
  await connectDB();
  
  try {
    await Shelter.deleteMany();
    await SOSRequest.deleteMany();
    await Report.deleteMany();
    await Alert.deleteMany();
    
    console.log('Successfully wiped all previous data! Database is now clean.');
    process.exit();
  } catch (error) {
    console.error(`Error wiping data: ${error.message}`);
    process.exit(1);
  }
};

clearData();
