const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userController = require('../controllers/userController');
const router = express.Router();

// Register(single user)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body; // Ensure password is destructured
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Log the JWT_SECRET for debugging
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    // Sign and return the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);
router.post('/login', userController.loginUser);


module.exports = router;