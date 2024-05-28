const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  githubId: Number, // guardar el ID de GitHub
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['usuario', 'admin', 'premium'], // Agregado 'premium' como una opción válida
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

module.exports = mongoose.model('User', UserSchema);