const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// ✅ CREATE BOOKING
router.post('/', async (req, res) => {
  try {
    const { designerId, date, time } = req.body;

    if (!designerId || !date || !time) {
      return res.status(400).json({ message: "Missing data" });
    }

    // ✅ prevent duplicate booking
    const existing = await Booking.findOne({
      designer: designerId,
      date,
      time
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const booking = new Booking({
      designer: designerId,
      date,
      time
    });

    await booking.save();

    res.status(201).json(booking);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL BOOKINGS
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('designer');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET BOOKED SLOTS BY DATE + DESIGNER (FIXED)
router.get('/by-date', async (req, res) => {
  try {
    const { date, designerId } = req.query;

    if (!date || !designerId) {
      return res.status(400).json({ message: "Missing query params" });
    }

    const mongoose = require('mongoose');

    const bookings = await Booking.find({
      date: date,
      designer: new mongoose.Types.ObjectId(designerId) // 🔥 FIX
    });

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE BOOKING
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;