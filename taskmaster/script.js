document.addEventListener('DOMContentLoaded', () => {
  // ===== VARIABLES =====
  const taskForm = document.getElementById('taskForm');
  const searchBar = document.getElementById('searchBar');
  const tasksList = document.getElementById('tasks');
  const apiBaseURL = 'http://localhost:5000/api/tasks';

  // ===== FUNCTIONS =====
  
  // Fetch all tasks from the server
  async function fetchTasks() {
    try {
      const response = await fetch(apiBaseURL);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const tasks = await response.json();
      renderTasks(tasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      alert('Failed to load tasks. Please try again.');
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
    li.dataset.id = task._id;
    li.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Priority: ${task.priority}</p>
      <p>Deadline: ${new Date(task.deadline).toLocaleDateString()}</p>
      <button class="delete-btn">Delete</button>
    `;
    tasksList.appendChild(li);
  }

  // Event delegation for delete buttons
  tasksList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const taskElement = event.target.closest('li');
      const taskId = taskElement.dataset.id;
      deleteTask(taskId, taskElement);
    }
  });

  // Create a new task
  async function createTask(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const deadline = document.getElementById('deadline').value;
    const userId = "6744e87395efb0c8a750cb57"; 

    try {
      const response = await fetch(apiBaseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, deadline, userId }),
      });

      if (!response.ok) throw new Error('Failed to create task');

      const newTask = await response.json();
      addTaskToDOM(newTask);
      taskForm.reset();
      fetchTasks();
      alert('Task created successfully!');
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please try again.');
    }
  }

  // Delete a task
  async function deleteTask(taskId, taskElement) {
    try {
      const response = await fetch(`${apiBaseURL}/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');

      // Remove the task from DOM
      taskElement.remove();
      alert('Task deleted successfully!');
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  }

// Function to filter tasks based on the search input
function filterTasks(event) {
  const searchText = event.target.value.toLowerCase();

  // Loop through all tasks and display only those that match the search
  const tasks = tasksList.querySelectorAll('li');
  tasks.forEach(task => {
    const title = task.querySelector('h3').textContent.toLowerCase();
    if (title.includes(searchText)) {
      task.style.display = ''; // Show matching tasks
    } else {
      task.style.display = 'none'; // Hide non-matching tasks
    }
  });
}

  // ===== EVENT LISTENERS =====
  taskForm.addEventListener('submit', createTask);

  // Add event listener to the search bar
  searchBar.addEventListener('input', filterTasks);


  // ===== INITIAL FETCH =====
  fetchTasks(); // Load tasks when the page is loaded
});