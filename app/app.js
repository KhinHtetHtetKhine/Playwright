const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const error = document.getElementById('error');
const template = document.getElementById('todo-item-template');

const STORAGE_KEY = 'playwright_todos';

function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render(todos) {
  list.innerHTML = '';

  todos.forEach((todo) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const text = node.querySelector('[data-testid="todo-text"]');
    const toggle = node.querySelector('[data-testid="toggle"]');
    const deleteButton = node.querySelector('[data-testid="delete"]');

    text.textContent = todo.text;
    toggle.checked = todo.done;

    if (todo.done) {
      node.classList.add('completed');
    }

    toggle.addEventListener('change', () => {
      const next = loadTodos().map((item) =>
        item.id === todo.id ? { ...item, done: toggle.checked } : item
      );
      saveTodos(next);
      render(next);
    });

    deleteButton.addEventListener('click', () => {
      const next = loadTodos().filter((item) => item.id !== todo.id);
      saveTodos(next);
      render(next);
    });

    list.appendChild(node);
  });

  emptyState.style.display = todos.length === 0 ? 'block' : 'none';
}

function createTodo(text) {
  const todos = loadTodos();
  const next = [
    ...todos,
    {
      id: crypto.randomUUID(),
      text,
      done: false
    }
  ];

  saveTodos(next);
  render(next);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    error.textContent = 'Task cannot be empty.';
    return;
  }

  error.textContent = '';
  createTodo(text);
  form.reset();
  input.focus();
});

render(loadTodos());
