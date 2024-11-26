require('dotenv').config({path: './config.env'});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const authRoutes = require('./Routes/authRoutes.js');
const taskRoutes = require('./Routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/users', authRoutes);
// app.use('/api', taskRoutes);
app.use('/api/tasks', taskRoutes);

// Test Route
app.get('/', (req, res) => res.send('TaskMaster API is running'));


// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));