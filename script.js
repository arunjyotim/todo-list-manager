const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const taskCounter = document.getElementById("task-counter");
const filterButtons = document.querySelectorAll(".filter-btn");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let draggedItemIndex = null;
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTasks() {
  todoList.innerHTML = "";
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });
  filteredTasks.forEach((task, index) => {
    const originalIndex = tasks.indexOf(task);
    const li = document.createElement("li");
    li.className = "todo-item";
    if (task.completed) {
      li.classList.add("completed");
    }
    li.setAttribute("draggable", "true");
    li.dataset.index = originalIndex;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      tasks[originalIndex].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = task.text;
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      tasks.splice(originalIndex, 1);
      saveTasks();
      renderTasks();
    });
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.addEventListener("dragstart", e => {
      draggedItemIndex = originalIndex;
      e.dataTransfer.effectAllowed = "move";
      li.classList.add("dragging");
    });
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      document.querySelectorAll(".todo-item").forEach(item => {
        item.classList.remove("drag-over");
      });
    });
    li.addEventListener("dragover", e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      li.classList.add("drag-over");
    });
    li.addEventListener("dragleave", () => {
      li.classList.remove("drag-over");
    });
    li.addEventListener("drop", e => {
      e.preventDefault();
      li.classList.remove("drag-over");
      if (draggedItemIndex === null || draggedItemIndex === originalIndex) return;
      const movedTask = tasks.splice(draggedItemIndex, 1)[0];
      tasks.splice(originalIndex, 0, movedTask);
      draggedItemIndex = null;
      saveTasks();
      renderTasks();
    });
    todoList.appendChild(li);
  });
  const activeCount = tasks.filter(task => !task.completed).length;
  taskCounter.textContent = `${activeCount} tasks left`;
}
todoForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  tasks.push({ text: text, completed: false });
  todoInput.value = "";
  saveTasks();
  renderTasks();
});
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.index || btn.dataset.filter;
    renderTasks();
  });
});
renderTasks();
