require('dotenv').config({path: './config.env'});
const mongoose = require('mongoose');
const app = require('./app'); // Import the app

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB for production
mongoose
  .connect(DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));