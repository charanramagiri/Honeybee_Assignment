// Simple To-Do App with localStorage persistence and filtering

// DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const filters = document.querySelectorAll('.filter');
const clearCompletedBtn = document.getElementById('clear-completed');

let tasks = [];           // { id, text, completed, createdAt }
let currentFilter = 'all';

// --- Helpers ---
const saveTasks = () => localStorage.setItem('tasks_v1', JSON.stringify(tasks));
const loadTasks = () => JSON.parse(localStorage.getItem('tasks_v1') || '[]');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);

// --- Render ---
function render() {
  taskList.innerHTML = '';

  const filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No tasks yet. Add your first task!';
    p.style.color = '#6b7280';
    taskList.appendChild(p);
  } else {
    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.dataset.id = task.id;

      // left side: checkbox + title
      const left = document.createElement('div');
      left.className = 'task-left';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = task.completed;
      cb.setAttribute('aria-label', 'Mark task complete');

      const span = document.createElement('div');
      span.className = 'task-title' + (task.completed ? ' completed' : '');
      span.textContent = task.text;

      left.appendChild(cb);
      left.appendChild(span);

      // right side: actions
      const actions = document.createElement('div');
      actions.className = 'task-actions';

      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.textContent = 'Delete';
      del.setAttribute('aria-label', 'Delete task');

      actions.appendChild(del);

      li.appendChild(left);
      li.appendChild(actions);

      taskList.appendChild(li);
    });
  }

  // Update count
  taskCount.textContent = `Total: ${tasks.length}`;

  // Save
  saveTasks();
}

// --- CRUD operations ---
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const newTask = { id: uid(), text: trimmed, completed: false, createdAt: Date.now() };
  tasks.unshift(newTask); // newest at top
  render();
}

function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.completed = !t.completed;
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(x => x.id !== id);
  render();
}

function clearCompleted() {
  tasks = tasks.filter(x => !x.completed);
  render();
}

// --- Event Listeners ---
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = '';
  taskInput.focus();
});

// event delegation for task actions (checkbox + delete)
taskList.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const id = li.dataset.id;
  if (e.target.matches('input[type="checkbox"]')) {
    toggleTask(id);
  } else if (e.target.matches('.delete-btn')) {
    deleteTask(id);
  }
});

// filter buttons
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// clear completed
clearCompletedBtn.addEventListener('click', () => {
  clearCompleted();
});

// load on start
function init() {
  tasks = loadTasks();
  render();
}

init();
