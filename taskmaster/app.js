const express = require('express');
const cors = require('cors');

const authRoutes = require('./Routes/authRoutes.js');
const taskRoutes = require('./Routes/taskRoutes.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);
app.use('/api/tasks', taskRoutes);

// Test Route
app.get('/', (req, res) => res.send('TaskMaster API is running'));

module.exports = app; 