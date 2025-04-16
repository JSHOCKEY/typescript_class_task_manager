document.addEventListener("DOMContentLoaded", () => {
  class Task {
    constructor(id, title, dueDate, completed = false) {
      this.id = id;
      this.title = title;
      this.dueDate = dueDate;
      this.completed = completed;
    }

    toggleComplete() {
      this.completed = !this.completed;
    }
  }

  class TaskManager {
    constructor() {
      this.tasks = [];
    }

    addTask(task) {
      this.tasks.push(task);
    }

    getTasks() {
      return this.tasks;
    }

    getCompletedTasks() {
      return this.tasks.filter(task => task.completed);
    }

    getPendingTasks() {
      return this.tasks.filter(task => !task.completed);
    }

    deleteTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id);
    }
  }

  const manager = new TaskManager();

  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
      <h1 class="text-2xl font-bold mb-4 text-center">Task Manager</h1>
      <form id="taskForm" class="flex flex-col gap-3 mb-6">
        <input type="text" id="title" placeholder="Title" required class="border rounded px-3 py-2" />
        <input type="date" id="dueDate" required class="border rounded px-3 py-2" />
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Task</button>
      </form>

      <div id="filters" class="flex justify-center gap-2 mb-4">
        <button type="button" data-filter="all" class="filter-btn bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">All</button>
        <button type="button" data-filter="pending" class="filter-btn bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Pending</button>
        <button type="button" data-filter="completed" class="filter-btn bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Completed</button>
      </div>

      <ul id="taskList" class="space-y-2"></ul>
    </div>
  `;

  const form = document.getElementById("taskForm");
  const titleInput = document.getElementById("title");
  const dueDateInput = document.getElementById("dueDate");
  const taskList = document.getElementById("taskList");
  const filters = document.getElementById("filters");
  const filterButtons = filters.querySelectorAll("button");

  let currentFilter = "all";

  form.addEventListener("submit", e => {
    e.preventDefault();
    const task = new Task(
      Date.now(),
      titleInput.value,
      new Date(dueDateInput.value)
    );
    manager.addTask(task);
    renderTasks();
    form.reset();
  });

  filters.addEventListener("click", e => {
    const btn = e.target;
    const filter = btn.getAttribute("data-filter");
    if (filter) {
      currentFilter = filter;
      updateActiveButton(filter);
      renderTasks();
    }
  });

  function updateActiveButton(activeFilter) {
    filterButtons.forEach(btn => {
      if (btn.getAttribute("data-filter") === activeFilter) {
        btn.classList.add("bg-blue-500", "text-white");
        btn.classList.remove("bg-gray-200", "text-gray-800");
      } else {
        btn.classList.remove("bg-blue-500", "text-white");
        btn.classList.add("bg-gray-200", "text-gray-800");
      }
    });
  }

  function getFilteredTasks() {
    if (currentFilter === "completed") return manager.getCompletedTasks();
    if (currentFilter === "pending") return manager.getPendingTasks();
    return manager.getTasks();
  }

  function renderTasks() {
    taskList.innerHTML = "";
    for (const task of getFilteredTasks()) {
      const li = document.createElement("li");
      li.className = "flex items-center justify-between bg-gray-100 px-4 py-2 rounded";

      const left = document.createElement("div");
      left.className = "flex items-center gap-2";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => {
        task.toggleComplete();
        renderTasks();
      });

      const text = document.createElement("span");
      text.textContent = `${task.title} – ${task.dueDate.toDateString()}`;
      if (task.completed) text.classList.add("line-through");

      left.appendChild(checkbox);
      left.appendChild(text);

      const delButton = document.createElement("button");
      delButton.textContent = "Delete";
      delButton.className = "text-red-600 hover:underline text-sm";
      delButton.addEventListener("click", () => {
        manager.deleteTask(task.id);
        renderTasks();
      });

      li.appendChild(left);
      li.appendChild(delButton);
      taskList.appendChild(li);
    }
  }

  updateActiveButton(currentFilter);
  renderTasks();
});
