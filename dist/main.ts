class Task {
  id: number;
  title: string;
  dueDate: Date;
  completed: boolean;

  constructor(id: number, title: string, dueDate: string | Date, completed = false) {
    this.id = id;
    this.title = title;
    this.dueDate = new Date(dueDate);
    this.completed = completed;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }
}

class TaskManager {
  private tasks: Task[] = [];

  add(task: Task) {
    this.tasks.push(task);
  }

  delete(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  getAll(): Task[] {
    return this.tasks;
  }

  getCompleted(): Task[] {
    return this.tasks.filter(task => task.completed);
  }

  getPending(): Task[] {
    return this.tasks.filter(task => !task.completed);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const manager = new TaskManager();

  const form = document.getElementById("taskForm") as HTMLFormElement;
  const title = document.getElementById("title") as HTMLInputElement;
  const dueDate = document.getElementById("dueDate") as HTMLInputElement;
  const taskList = document.getElementById("taskList") as HTMLUListElement;
  const filters = document.getElementById("filters") as HTMLElement;
  const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-btn");

  let currentFilter: "all" | "completed" | "pending" = "all";

  form.addEventListener("submit", e => {
    e.preventDefault();
    const task = new Task(Date.now(), title.value, dueDate.value);
    manager.add(task);
    form.reset();
    render();
  });

  filters.addEventListener("click", e => {
    const target = e.target as HTMLElement;
    const filter = target.getAttribute("data-filter");
    if (filter === "all" || filter === "completed" || filter === "pending") {
      currentFilter = filter;
      updateActiveFilter();
      render();
    }
  });

  function updateActiveFilter() {
    filterButtons.forEach(btn => {
      const isActive = btn.dataset.filter === currentFilter;
      btn.classList.toggle("bg-blue-500", isActive);
      btn.classList.toggle("text-white", isActive);
      btn.classList.toggle("bg-gray-200", !isActive);
      btn.classList.toggle("text-gray-800", !isActive);
    });
  }

  function getFilteredTasks(): Task[] {
    switch (currentFilter) {
      case "completed": return manager.getCompleted();
      case "pending": return manager.getPending();
      default: return manager.getAll();
    }
  }

  function render() {
    taskList.innerHTML = "";
    getFilteredTasks().forEach(task => {
      const li = document.createElement("li");
      li.className = "flex items-center justify-between bg-gray-100 px-4 py-2 rounded";

      const left = document.createElement("div");
      left.className = "flex items-center gap-2";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => {
        task.toggleComplete();
        render();
      });

      const label = document.createElement("span");
      label.textContent = `${task.title} – ${task.dueDate.toDateString()}`;
      if (task.completed) label.classList.add("line-through");

      const del = document.createElement("button");
      del.textContent = "Delete";
      del.className = "text-red-600 hover:underline text-sm";
      del.addEventListener("click", () => {
        manager.delete(task.id);
        render();
      });

      left.append(checkbox, label);
      li.append(left, del);
      taskList.appendChild(li);
    });
  }

  updateActiveFilter();
  render();
});
