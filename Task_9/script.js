// Load existing todos
window.onload = () => loadTodos();

// Add button event
document.getElementById("add-btn").addEventListener("click", addTodo);

// Enter key support
document.getElementById("todo-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTodo();
});

function addTodo() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (text === "") return;

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    saveTodo(todo);
    renderTodo(todo);

    input.value = "";
}

function renderTodo(todo) {
    const list = document.getElementById("todo-list");

    const li = document.createElement("li");
    li.className = "todo-item";
    li.setAttribute("data-id", todo.id);

    li.innerHTML = `
        <span class="todo-text ${todo.completed ? "completed" : ""}">${todo.text}</span>
        <div class="buttons">
            <button class="btn complete">✔</button>
            <button class="btn edit">✎</button>
            <button class="btn delete">✖</button>
        </div>
    `;

    list.appendChild(li);

    // Add events
    li.querySelector(".complete").addEventListener("click", toggleComplete);
    li.querySelector(".delete").addEventListener("click", deleteTodo);
    li.querySelector(".edit").addEventListener("click", editTodo);
}

// Toggle completed
function toggleComplete(e) {
    const li = e.target.closest(".todo-item");
    const id = li.getAttribute("data-id");

    let todos = getTodos();
    todos = todos.map(t => {
        if (t.id == id) t.completed = !t.completed;
        return t;
    });

    saveAll(todos);
    li.querySelector(".todo-text").classList.toggle("completed");
}

// Delete task
function deleteTodo(e) {
    const li = e.target.closest(".todo-item");
    const id = li.getAttribute("data-id");

    let todos = getTodos().filter(t => t.id != id);
    saveAll(todos);

    li.remove();
}

// Edit task
function editTodo(e) {
    const li = e.target.closest(".todo-item");
    const textSpan = li.querySelector(".todo-text");
    const newText = prompt("Edit task:", textSpan.textContent);

    if (newText === null || newText.trim() === "") return;

    let todos = getTodos();
    todos = todos.map(t => {
        if (t.id == li.getAttribute("data-id")) t.text = newText;
        return t;
    });

    saveAll(todos);
    textSpan.textContent = newText;
}

// LocalStorage functions
function getTodos() {
    return JSON.parse(localStorage.getItem("todos")) || [];
}

function saveTodo(todo) {
    let todos = getTodos();
    todos.push(todo);
    saveAll(todos);
}

function saveAll(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Load saved todos
function loadTodos() {
    const todos = getTodos();
    todos.forEach(renderTodo);
}