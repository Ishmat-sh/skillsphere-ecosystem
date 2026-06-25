const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Base Test Route
app.get('/', (req, res) => {
  res.send('SkillSphere Backend API running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("Database connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});