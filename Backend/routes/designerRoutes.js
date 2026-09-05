const express = require('express');
const router = express.Router();
const Designer = require('../models/designer');

// ✅ CREATE DESIGNER
router.post('/', async (req, res) => {
  try {
    const designer = new Designer(req.body);
    await designer.save();
    res.status(201).json(designer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL DESIGNERS
router.get('/', async (req, res) => {
  try {
    const designers = await Designer.find();
    res.json(designers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE ALL DESIGNERS
router.delete('/', async (req, res) => {
  try {
    await Designer.deleteMany({});
    res.json({ message: "All designers deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE ONE DESIGNER BY ID
router.delete('/:id', async (req, res) => {
  try {
    await Designer.findByIdAndDelete(req.params.id);
    res.json({ message: "Designer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;