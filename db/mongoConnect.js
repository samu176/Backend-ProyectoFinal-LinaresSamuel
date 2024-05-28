const config = require('../config/config');
const mongoose = require('mongoose');

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al intentar conectar a MongoDB:', error.message);
  }
};

module.exports = { connectToMongoDB };