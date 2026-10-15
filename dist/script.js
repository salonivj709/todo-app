"use strict";
const form = document.getElementById("task-form");
const nameInput = document.getElementById("task-name");
const dateInput = document.getElementById("task-date");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
let tasks = loadTasks();
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem("typescript-todo-tasks");
        return savedTasks ? JSON.parse(savedTasks) : [];
    }
    catch {
        return [];
    }
}
function saveTasks() {
    localStorage.setItem("typescript-todo-tasks", JSON.stringify(tasks));
}
function renderTasks() {
    taskList.replaceChildren();
    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = "task-item";
        if (task.completed)
            li.classList.add("completed");
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
            tasks = tasks.filter((item) => item.id !== task.id);
            saveTasks();
            renderTasks();
        });
        li.append(checkbox, details, deleteButton);
        taskList.appendChild(li);
    });
    const pending = tasks.filter((task) => !task.completed).length;
    taskCount.textContent =
        `${tasks.length} total tasks · ${pending} pending · ${tasks.length - pending} completed`;
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const dueDate = dateInput.value;
    if (!name || !dueDate)
        return;
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
