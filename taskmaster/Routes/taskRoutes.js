const express = require('express');
const Task = require('../models/Task');
const taskController = require('../controllers/taskController');
const router = express.Router();

//Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, deadline, userId } = req.body;
    const task = await Task.create({ title, description, priority, deadline, userId });
    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
});

// Filtering tasks route
router.get('/filter', async (req, res) => {
  try {
    // console.log(req.query)
    const { priority, deadline, userId } = req.query;
    
    const filter = {};
    if (priority) filter.priority = priority;
    if (deadline) filter.deadline = { $lte: new Date(deadline) };
    if (userId) filter.userId = userId;

    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// Search tasks by title
router.get('/search', async (req, res) => {
  try {
    // console.log(req.query);
    const { keyword } = req.query;

    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ message: "Search keyword is required and must be a string" });
    }

    const tasks = await Task.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    });

    res.status(200).json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});
    

// Get all tasks for a user
router.get('/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id; // Extracts task ID from the URL
    const task = await Task.findById(taskId); // Finds the task by its ID
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task', error: err.message });
  }
});

// Update a task
router.put('tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; 
    
    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task updated successfully', updatedTask });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
});


router.delete('tasks/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the task ID from the route parameter
    
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully', deletedTask });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
});


router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:taskId', taskController.getTask);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);
router.get('/filter', taskController.filterTasks);
router.get('/search', taskController.searchTasks);



module.exports = router;