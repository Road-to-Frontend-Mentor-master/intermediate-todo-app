const todoListDOMEl = document.getElementById('todo-list');
const todoListFormDOMEl = document.getElementById('todo-list-form');
const newTodoFormDOMEl = document.getElementById('new-todo-form');
const addNewTodoInputDOMEl = document.getElementById('add-new-todo');

const todoList = [];

// Todo list functions

function createTodoItem(newTodo, todoList) {
  todoList.push(newTodo);

  return todoList;
}

function drawTodoList(todoList) {
  // Se encarga de pintar en el dom la lista
}

function deleteTodoItem(todoId, todoList) {
  // Dado un id de todo, se filtra la lista de todos
  // y se devuelve sin el elemento.
}

function updateTodoItem(todoItem, todoList) {
  // Actualizar el todo que se pasa por parámetro
}

newTodoFormDOMEl.addEventListener('submit', (e) => {
  e.preventDefault();
});


// LocalStorage functions

function saveTodoListToLocalStorage(todoList, todoListKey) {
  // Guardará la lista recibida por parámetro en el localStorage
  // y utilizará todoListKey para poder referenciarla más adelante
}

function getTodoListFromLocalStorage(todoListKey) {
  // Obtiene la todo list con el id pasado por parámetro
}


// Eventos de escucha.

todoListFormDOMEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('form__cross')) {
    
  }
});
