let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.getElementById("taskInput").value.trim();
  const dueDate = document.getElementById("dueDateInput").value;
  const priority = document.getElementById("priorityInput").value;
  const status = document.getElementById("statusInput").value;

  if (taskInput === "") return alert("Task cannot be empty!");

  tasks.push({
    text: taskInput,
    dueDate,
    priority,
    status,
    createdAt: new Date().toISOString(),
  });

  saveTasks();
  clearForm();
  renderTasks();
}

function clearForm() {
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDateInput").value = "";
  document.getElementById("priorityInput").value = "Medium";
  document.getElementById("statusInput").value = "Pending";
}

function renderTasks() {
  const list = document.getElementById("taskList");
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const filterStatus = document.getElementById("filterStatus").value;
  const sortBy = document.getElementById("sortBy").value;

  let filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchText) &&
    (filterStatus === "All" || task.status === filterStatus)
  );

  if (sortBy === "dueDate") {
    filteredTasks.sort((a, b) => new Date(a.dueDate || "") - new Date(b.dueDate || ""));
  } else if (sortBy === "priority") {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else {
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  list.innerHTML = "";
  filteredTasks.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = "task-item";
    item.innerHTML = `
      <strong>${task.text}</strong>
      <div class="task-meta">
        <span>📅 Due: ${task.dueDate || "None"}</span>
        <span>⭐ Priority: ${task.priority}</span>
        <span>🔁 Status: ${task.status}</span>
      </div>
      <div class="task-actions">
        <button class="edit" onclick="editTask(${index})">Edit</button>
        <button class="delete" onclick="deleteTask(${index})">Delete</button>
        <button class="status" onclick="cycleStatus(${index})">Next Status</button>
      </div>
    `;
    list.appendChild(item);
  });
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function cycleStatus(index) {
  const statuses = ["Pending", "In Progress", "Completed"];
  const current = statuses.indexOf(tasks[index].status);
  tasks[index].status = statuses[(current + 1) % statuses.length];
  saveTasks();
  renderTasks();
}

function searchTask() {
  renderTasks();
}

// Initial render
renderTasks();
