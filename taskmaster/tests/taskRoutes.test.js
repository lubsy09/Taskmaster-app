require('dotenv').config()
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const taskData = {
  title: 'Test Task',
  description: 'This is a test task.',
  priority: 'medium',
  deadline: '2024-12-01',
  userId: '67482abb2e9ef50d288a7c00',
};

const databaseUri = process.env.TEST_DATABASE || 'mongodb://localhost:5000/testdb';

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(databaseUri);
});

afterAll(async () => {
  // Close the database connection
  await mongoose.connection.close();
});

describe('Task API Endpoints', () => {
  it('should create a new task', async () => {
    const res = await request(app).post('/api/tasks').send(taskData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('task');
    expect(res.body.task).toHaveProperty('_id');
    expect(res.body.task.title).toBe(taskData.title);
  });

  it('should not create a task with invalid data', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: '',
      priority: 'invalid',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should delete a task', async () => {
    const task = await Task.create(taskData); // Create a task directly in the DB
    const res = await request(app).delete(`/api/tasks/${task._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Task deleted');
  });
});