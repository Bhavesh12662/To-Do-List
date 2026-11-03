// TaskFlow: task data, localStorage, rendering and event handling.
const STORAGE_KEY = "taskflow.tasks.v1";

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const priorityInput = document.querySelector("#priorityInput");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const totalCount = document.querySelector("#totalCount");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");
const remainingLabel = document.querySelector("#remainingLabel");
const clearCompletedBtn = document.querySelector("#clearCompletedBtn");
const editDialog = document.querySelector("#editDialog");
const editForm = document.querySelector("#editForm");
const editTaskInput = document.querySelector("#editTaskInput");
const editPriorityInput = document.querySelector("#editPriorityInput");
const closeDialogBtn = document.querySelector("#closeDialogBtn");
const cancelEditBtn = document.querySelector("#cancelEditBtn");
const toast = document.querySelector("#toast");

let tasks = loadTasks();
let activeFilter = "all";
let editingTaskId = null;
let toastTimer;

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch (error) {
    console.error("Could not read saved tasks:", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createId() {
  return window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  }).format(new Date(dateString));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function addTask(title, priority) {
  const newTask = {
    id: createId(),
    title: title.trim(),
    priority,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  showToast("Task added successfully");
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const taskToDelete = tasks.find(task => task.id === id);
  if (!taskToDelete) return;
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
  showToast("Task deleted");
}

function openEditDialog(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;
  editingTaskId = id;
  editTaskInput.value = task.title;
  editPriorityInput.value = task.priority;
  editDialog.showModal();
  editTaskInput.focus();
}

function updateTask(title, priority) {
  tasks = tasks.map(task =>
    task.id === editingTaskId
      ? { ...task, title: title.trim(), priority }
      : task
  );
  saveTasks();
  renderTasks();
  closeEditDialog();
  showToast("Task updated");
}

function closeEditDialog() {
  editDialog.close();
  editingTaskId = null;
}

function getVisibleTasks() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  return tasks.filter(task => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && !task.completed) ||
      (activeFilter === "completed" && task.completed);
    return matchesFilter && task.title.toLowerCase().includes(searchTerm);
  });
}

function createTaskElement(task) {
  const item = document.createElement("article");
  item.className = `task-item${task.completed ? " is-completed" : ""}`;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = `complete-toggle${task.completed ? " checked" : ""}`;
  toggle.setAttribute("aria-label", task.completed ? "Mark task active" : "Mark task complete");
  toggle.innerHTML = task.completed ? "<span>✓</span>" : "";
  toggle.addEventListener("click", () => toggleTask(task.id));

  const content = document.createElement("div");
  content.className = "task-content";

  const title = document.createElement("p");
  title.className = "task-title";
  title.textContent = task.title; // textContent prevents user input being treated as HTML.

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const priority = document.createElement("span");
  priority.className = `priority ${task.priority}`;
  priority.textContent = `${task.priority} priority`;

  const created = document.createElement("span");
  created.textContent = `Added ${formatDate(task.createdAt)}`;

  meta.append(priority, created);
  content.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "icon-btn";
  editButton.setAttribute("aria-label", `Edit ${task.title}`);
  editButton.title = "Edit task";
  editButton.textContent = "✎";
  editButton.addEventListener("click", () => openEditDialog(task.id));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "icon-btn delete";
  deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
  deleteButton.title = "Delete task";
  deleteButton.textContent = "⌫";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  actions.append(editButton, deleteButton);
  item.append(toggle, content, actions);
  return item;
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.replaceChildren(...visibleTasks.map(createTaskElement));

  const hasVisibleTasks = visibleTasks.length > 0;
  emptyState.hidden = hasVisibleTasks;
  if (!hasVisibleTasks) {
    const hasTasks = tasks.length > 0;
    emptyState.querySelector("h3").textContent = hasTasks ? "No matching tasks" : "No tasks here yet";
    emptyState.querySelector("p").textContent = hasTasks
      ? "Try another filter or search term."
      : "Add a task above and take the first step.";
  }

  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.length - completed;
  totalCount.textContent = tasks.length;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
  remainingLabel.textContent = `${pending} ${pending === 1 ? "task" : "tasks"} left`;
  clearCompletedBtn.disabled = completed === 0;
  clearCompletedBtn.style.opacity = completed === 0 ? ".45" : "1";
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) {
    taskInput.focus();
    return;
  }
  addTask(title, priorityInput.value);
  taskForm.reset();
  priorityInput.value = "medium";
  taskInput.focus();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

searchInput.addEventListener("input", renderTasks);

editForm.addEventListener("submit", event => {
  event.preventDefault();
  const title = editTaskInput.value.trim();
  if (!title || !editingTaskId) return;
  updateTask(title, editPriorityInput.value);
});

closeDialogBtn.addEventListener("click", closeEditDialog);
cancelEditBtn.addEventListener("click", closeEditDialog);
editDialog.addEventListener("click", event => {
  if (event.target === editDialog) closeEditDialog();
});

clearCompletedBtn.addEventListener("click", () => {
  const completedCountNow = tasks.filter(task => task.completed).length;
  if (completedCountNow === 0) return;
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
  showToast("Completed tasks cleared");
});

const now = new Date();
document.querySelector("#todayLabel").textContent =
  new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(now);
document.querySelector("#taskDate").textContent =
  new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(now);

renderTasks();
