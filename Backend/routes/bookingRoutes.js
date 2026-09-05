const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/auth");

// ==========================================
// CREATE BOOKING
// POST /api/bookings
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { designerId, date, time } = req.body;

    if (!designerId || !date || !time) {
      return res.status(400).json({
        message: "Missing data",
      });
    }

    // Validate designer ID
    if (!mongoose.Types.ObjectId.isValid(designerId)) {
      return res.status(400).json({
        message: "Invalid designer ID",
      });
    }

    // Prevent duplicate booking
    const existing = await Booking.findOne({
      designer: designerId,
      date,
      time,
    });

    if (existing) {
      return res.status(400).json({
        message: "Slot already booked",
      });
    }

    // Create booking for logged-in user
    const booking = new Booking({
      user: req.user.userId,
      designer: designerId,
      date,
      time,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("Create Booking Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ==========================================
// GET ALL BOOKINGS
// GET /api/bookings
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("designer")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Get Bookings Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ==========================================
// GET MY BOOKINGS
// GET /api/bookings/my-bookings
// ==========================================
router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.userId,
    })
      .populate("designer")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Get My Bookings Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ==========================================
// GET BOOKED SLOTS BY DATE + DESIGNER
// GET /api/bookings/by-date
// ==========================================
router.get("/by-date", authMiddleware, async (req, res) => {
  try {
    const { date, designerId } = req.query;

    if (!date || !designerId) {
      return res.status(400).json({
        message: "Missing query params",
      });
    }

    // Validate designer ID
    if (!mongoose.Types.ObjectId.isValid(designerId)) {
      return res.status(400).json({
        message: "Invalid designer ID",
      });
    }

    const bookings = await Booking.find({
      date: date,
      designer: new mongoose.Types.ObjectId(designerId),
    });

    res.json(bookings);
  } catch (err) {
    console.error("Get Booked Slots Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


// ==========================================
// DELETE MY BOOKING
// DELETE /api/bookings/:id
// ==========================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    // Find booking belonging to logged-in user
    const booking = await Booking.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found or you are not authorized",
      });
    }

    await Booking.findByIdAndDelete(id);

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (err) {
    console.error("Delete Booking Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});


module.exports = router;