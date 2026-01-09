let todos = [];

const loadBtn = document.getElementById('btn-load');
const showIncompleteBtn = document.getElementById('btn-show-incomplete');
const showAllBtn = document.getElementById('btn-show-all');
const markAllCompletedBtn = document.getElementById('btn-mark-all-completed');
const getCompletedBtn = document.getElementById('btn-get-completed');
const tbody = document.querySelector('#todos-table tbody');

async function loadTodos() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!response.ok) throw new Error('Failed to fetch todos');
    
    todos = await response.json();
    todos = todos.slice(0, 20);
    
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos(todos);
    
    loadBtn.textContent = 'Reload Todos';
  } catch (error) {
    console.error('Error loading todos:', error);
    alert('Failed to load todos. Please try again.');
  }
}

function renderTodos(todosToRender) {
  tbody.innerHTML = '';
  
  if (todosToRender.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No todos to display</td></tr>';
    return;
  }
  
  todosToRender.forEach((todo, index) => {
    const row = document.createElement('tr');
    row.className = todo.completed ? 'completed' : '';
    
    row.innerHTML = `
      <td>${todo.id}</td>
      <td>${todo.title}</td>
      <td>
        <span class="status-badge ${todo.completed ? 'completed' : 'incomplete'}">
          ${todo.completed ? '✓ Completed' : '○ Incomplete'}
        </span>
      </td>
      <td>
        <button class="toggle-btn" onclick="toggleTodo(${index})">
          ${todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos(todos);
}

function showIncomplete() {
  const incompleteTodos = todos.filter(todo => !todo.completed);
  renderTodos(incompleteTodos);
  
  showIncompleteBtn.disabled = true;
  showAllBtn.disabled = false;
}

function showAll() {
  renderTodos(todos);
  
  showIncompleteBtn.disabled = false;
  showAllBtn.disabled = true;
}

function markAllCompleted() {
  todos = todos.map(todo => ({ ...todo, completed: true }));
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos(todos);
}

function getCompletedTasks() {
  const completedTodos = todos.filter(todo => todo.completed);
  const count = completedTodos.length;
  
  alert(`Total Completed Tasks: ${count}\n\nCompleted tasks are highlighted in green in the table.`);
  
  renderTodos(completedTodos);
  showIncompleteBtn.disabled = false;
  showAllBtn.disabled = false;
}

loadBtn.addEventListener('click', loadTodos);
showIncompleteBtn.addEventListener('click', showIncomplete);
showAllBtn.addEventListener('click', showAll);
markAllCompletedBtn.addEventListener('click', markAllCompleted);
getCompletedBtn.addEventListener('click', getCompletedTasks);

window.onload = () => {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    todos = JSON.parse(savedTodos);
    renderTodos(todos);
    loadBtn.textContent = 'Reload Todos';
  }
};