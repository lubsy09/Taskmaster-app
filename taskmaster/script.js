document.addEventListener('DOMContentLoaded', () => {
  // ===== VARIABLES =====
  const taskForm = document.getElementById('taskForm');
  const tasksList = document.getElementById('tasks');
  const searchBar = document.getElementById('searchBar');
  const filterPriority = document.getElementById('filterPriority');
  const filterDeadline = document.getElementById('filterDeadline');
  const resetFiltersButton = document.getElementById('resetFilters');
  const feedbackMessage = document.getElementById('feedbackMessage');
  const apiBaseURL = 'http://localhost:5000/api/tasks';
  let allTasks = []; // Store all tasks for filtering and searching

  // ===== FUNCTIONS =====

  // Fetch all tasks from the server
  async function fetchTasks() {
    try {
      const response = await fetch(apiBaseURL);
      if (!response.ok) throw new Error('Failed to fetch tasks');

      allTasks = await response.json();
      renderTasks(allTasks); // Render tasks in the DOM
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  // Render tasks to the DOM
  function renderTasks(tasks) {
    tasksList.innerHTML = ''; // Clear the list first
    tasks.forEach(task => addTaskToDOM(task));
  }

  // Add a single task to the DOM
  function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description || 'No description provided'}</p>
      <p>Priority: ${task.priority || 'N/A'}</p>
      <p>Deadline: ${new Date(task.deadline).toLocaleDateString() || 'N/A'}</p>
      <button class="delete-btn" data-id="${task._id}">Delete</button>
    `;
    tasksList.appendChild(li);
  }

  // Create a new task
  async function createTask(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const deadline = document.getElementById('deadline').value;
    const userId = "64cdb8914f9c4e3043e3b123"; // Example userId (replace dynamically if needed)

    try {
      const response = await fetch(apiBaseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, deadline, userId }),
      });

      if (!response.ok) throw new Error('Failed to create task');

      const newTask = await response.json();
      allTasks.push(newTask); // Add the new task to the local list
      renderTasks(allTasks); // Refresh the task list
      taskForm.reset();
      fetchTasks();
      alert('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  }

  // Delete a task
  async function deleteTask(taskId) {
    try {
      const response = await fetch(`${apiBaseURL}/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');

      // Remove the task from the local list and re-render
      allTasks = allTasks.filter(task => task._id !== taskId);
      renderTasks(allTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  }

  // Handle delete button clicks using Event Delegation
  tasksList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const taskId = event.target.getAttribute('data-id');
      deleteTask(taskId);
    }
  });

  // Search tasks by title
  function searchTasks(query) {
    const filteredTasks = allTasks.filter(task =>
      task.title.toLowerCase().includes(query.toLowerCase())
    );
    renderTasks(filteredTasks);
  }

  // Filter tasks by priority and deadline
  function filterTasks() {
    const priority = filterPriority.value;
    const deadline = filterDeadline.value;

    let filteredTasks = [...allTasks];

    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }

    if (deadline) {
      filteredTasks = filteredTasks.filter(task =>
        new Date(task.deadline).toLocaleDateString() === new Date(deadline).toLocaleDateString()
      );
    }

    renderTasks(filteredTasks);
  }

  function showFeedback(message) {
    const feedbackMessage = document.getElementById('feedbackMessage');
    feedbackMessage.textContent = message; // Set dynamic message
    feedbackMessage.classList.remove('hidden');
    feedbackMessage.classList.add('fade-in');
  
    setTimeout(() => {
      feedbackMessage.classList.remove('fade-in');
      feedbackMessage.classList.add('fade-out');
  
      setTimeout(() => {
        feedbackMessage.classList.add('hidden');
        feedbackMessage.classList.remove('fade-out');
      }, 500);
    }, 2000);
  }

  // Reset filters
  function resetFilters() {
    filterPriority.value = ''; // Clear priority filter
    filterDeadline.value = ''; // Clear deadline filter
    renderTasks(allTasks); // Render all tasks
    showFeedback('Filters have been reset!');
  }

  // ===== EVENT LISTENERS =====

  // Handle task creation
  taskForm.addEventListener('submit', createTask);

  // Handle search functionality
  searchBar.addEventListener('input', (event) => searchTasks(event.target.value));

  // Handle filtering functionality
  filterPriority.addEventListener('change', filterTasks);
  filterDeadline.addEventListener('change', filterTasks);

  // Handle reset filters button
  resetFiltersButton.addEventListener('click', resetFilters);

  // ===== INITIAL LOAD =====

  fetchTasks(); // Load tasks when the page is loaded
});