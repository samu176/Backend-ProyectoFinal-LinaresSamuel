const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return Math.random().toString(36).substr(2, 9); // Genera un código único
    }
  },
  purchase_datetime: {
    type: Date,
    default: Date.now, // Guarda la fecha y hora actual
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
    match: /.+\@.+\..+/, // Asegura que el campo es un correo electrónico
  },
});

module.exports = mongoose.model('Ticket', ticketSchema);