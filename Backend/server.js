const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ ROUTES
const designerRoutes = require('./routes/designerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/designers', designerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

// ✅ DATABASE
mongoose.connect('mongodb://127.0.0.1:27017/interior_app')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});