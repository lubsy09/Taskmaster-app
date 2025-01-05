const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./Routes/authRoutes.js');
const taskRoutes = require('./Routes/taskRoutes.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/tasks', taskRoutes);

// Test Route
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'public/home.html'));
});

module.exports = app; 