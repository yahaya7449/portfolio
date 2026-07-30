
//  State 
const STORAGE_KEY = 'azimuth.planner.tasks';
let tasks = loadTasks();   // array of { id, text, done }

//  Element references 
const input      = document.getElementById('task-input');
const addBtn     = document.getElementById('add-btn');
const listEl     = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const statTotal  = document.getElementById('stat-total');
const statDone   = document.getElementById('stat-done');
const statLeft   = document.getElementById('stat-left');

// Persistence helpers
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return []; // if storage is unavailable, just start empty
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    /* storage might be full or blocked — ignore, app still works */
  }
}

//  Actions (each one updates the array, saves, then re-renders)
function addTask(text) {
  const clean = text.trim();
  if (clean === '') return;               // ignore empty input

  tasks.push({
    id: Date.now(),                        // simple unique id
    text: clean,
    done: false
  });
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(function (task) {
    return task.id === id ? { ...task, done: !task.done } : task;
  });
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  render();
}

// ebuild the UI from the tasks array 
function render() {
  // clear current list
  listEl.innerHTML = '';

  // show/hide the empty state
  emptyState.style.display = tasks.length === 0 ? 'block' : 'none';

  // build one <li> per task
  tasks.forEach(function (task) {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' done' : '');

    // checkbox to mark complete
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task__check';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', 'Mark "' + task.text + '" as done');
    checkbox.addEventListener('change', function () {
      toggleTask(task.id);
    });

    // the task text
    const span = document.createElement('span');
    span.className = 'task__text';
    span.textContent = task.text;

    // status label
    const meta = document.createElement('span');
    meta.className = 'task__meta';
    meta.textContent = task.done ? 'DONE' : 'PENDING';

    // delete button
    const del = document.createElement('button');
    del.className = 'btn btn--sm btn--danger';
    del.type = 'button';
    del.textContent = 'Delete';
    del.setAttribute('aria-label', 'Delete "' + task.text + '"');
    del.addEventListener('click', function () {
      deleteTask(task.id);
    });

    li.append(checkbox, span, meta, del);
    listEl.appendChild(li);
  });

  // update the live stats
  const total = tasks.length;
  const done  = tasks.filter(function (t) { return t.done; }).length;
  statTotal.textContent = total;
  statDone.textContent  = done;
  statLeft.textContent  = total - done;
}

// Event wiring 
addBtn.addEventListener('click', function () {
  addTask(input.value);
  input.value = '';
  input.focus();
});

// let Enter add a task too
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    addTask(input.value);
    input.value = '';
  }
});

// First paint
render();
