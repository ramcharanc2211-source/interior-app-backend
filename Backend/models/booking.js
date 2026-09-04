const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Designer',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);