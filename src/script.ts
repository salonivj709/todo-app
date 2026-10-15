
interface Task {
  id: number;
  name: string;
  dueDate: string;
  completed: boolean;
}

const form = document.getElementById("task-form") as HTMLFormElement;
const nameInput = document.getElementById("task-name") as HTMLInputElement;
const dateInput = document.getElementById("task-date") as HTMLInputElement;
const taskList = document.getElementById("task-list") as HTMLUListElement;
const taskCount = document.getElementById("task-count") as HTMLParagraphElement;

let tasks: Task[] = loadTasks();

function loadTasks(): Task[] {
  try {
    const savedTasks = localStorage.getItem("typescript-todo-tasks");
    return savedTasks ? JSON.parse(savedTasks) as Task[] : [];
  } catch {
    return [];
  }
}

function saveTasks(): void {
  localStorage.setItem("typescript-todo-tasks", JSON.stringify(tasks));
}

function renderTasks(): void {
  taskList.replaceChildren();

  tasks.forEach((task: Task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.name}`);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const details = document.createElement("div");
    details.className = "task-details";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.name;

    const dueDate = document.createElement("small");
    dueDate.textContent = `Due: ${task.dueDate}`;

    details.append(title, dueDate);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.name}`);

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((item: Task) => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, details, deleteButton);
    taskList.appendChild(li);
  });

  const pending = tasks.filter((task: Task) => !task.completed).length;
  taskCount.textContent =
    `${tasks.length} total tasks · ${pending} pending · ${tasks.length - pending} completed`;
}

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const dueDate = dateInput.value;

  if (!name || !dueDate) return;

  tasks.push({
    id: Date.now(),
    name,
    dueDate,
    completed: false
  });

  saveTasks();
  renderTasks();
  form.reset();
});

renderTasks();
