function main() {
  const LOCAL_STORAGE_KEY = 'todo-list'

  const todoListDOMEl = document.getElementById('todo-list')
  const todoListFormDOMEl = document.getElementById('todo-list-form')
  const newTodoFormDOMEl = document.getElementById('new-todo-form')
  const addNewTodoInputDOMEl = document.getElementById('add-new-todo')
  const newTodoCheckboxDOMEl = document.getElementById('add-new-todo-checkbox')
  const clearCompletedDOMEl = document.getElementById('clear-completed')
  const getAllTodosDOMEl = document.getElementById('filter-all')
  const getActiveTodosDOMEl = document.getElementById('filter-active')
  const getCompletedTodosDOMEl = document.getElementById('filter-completed')

  function generateId() {
    return uuidv4()
  }

  function saveToLocalStorage(value, key = LOCAL_STORAGE_KEY) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  function getFromLocalStorage(key = LOCAL_STORAGE_KEY) {
    return JSON.parse(localStorage.getItem(key))
  }

  const composeHtmlNode = (...htmlNodes) => initialNode => (
    htmlNodes.reduce((prevHtmlNode, currentNode) => {
      prevHtmlNode.appendChild(currentNode)

      return prevHtmlNode
    }, initialNode)
  )

  function createHtmlElement({ tag, attributes = [], classes = [] }) {
    const element = document.createElement(tag)

    attributes.forEach(attribute => {
      element.setAttribute(...attribute)
    })

    classes.forEach(cssClass => {
      element.classList.add(cssClass)
    })

    return element
  }

  function createList(newList = [], containerDOMElId) {
    let list = [...newList]
    let activeFilter = 'all'

    const LIST_STATES = {
      all: 'all',
      active: 'active',
      completed: 'completed'
    }

    function getListState() {
      return activeFilter
    }

    function setListState(newState) {
      activeFilter = newState
    }
    
    function addItem(newItem) {
      list.push(newItem)
    }

    function deleteItem(itemId) {
      list = list.filter(item => item.id !== itemId)
    }

    function updateItem(updatedItem) {
      list = list.map(item => {
        if (item.id === updatedItem.id) {
          return {
            ...item,
            ...updatedItem
          }
        }

        return item
      })
    }

    function clearCompleted() {
      list = list.filter(item => !item.checked)
    }

    function buildField() {
      return createHtmlElement({
        tag: 'li',
        classes: ['form__field']
      })
    }

    function buildCheckbox({checked, text, id}) {
      let checkboxAttributes = [
        [ 'type', 'checkbox' ],
        [ 'name', 'todos' ],
        [ 'id', `todo-checkbox-${id}` ],
        [ 'value', text ],
      ]

      if (checked) {
        checkboxAttributes = [
          ...checkboxAttributes,
          ['checked', "checked"]
        ]
      }

      return createHtmlElement({
        tag: 'input',
        attributes: checkboxAttributes,
        classes: ['form__checkbox']
      })
    }

    function buildLabel(id) {
      return createHtmlElement({
        tag: 'label',
        attributes: [
          [ 'for', `todo-checkbox-${id}` ],
          [ 'data-todo-id', id ]
        ],
        classes: ['form__checkbox-label']
      })
    }

    function buildCrossButtonContainer(id) {
      return createHtmlElement({
        tag: 'button',
        attributes: [
          [ 'data-todo-id', id ],
        ],
        classes: ['form__delete-button']
      })
    }

    function buildCrossIcon(id) {
      return createHtmlElement({
        tag: 'img',
        attributes: [
          [ 'src', 'images/icon-cross.svg' ],
          [ 'alt', 'Delete todo icon' ],
          [ 'data-todo-id', id ]
        ],
        classes: ['form__cross']
      })
    }

    function buildTextInput({ text, id }) {
      return createHtmlElement({
        tag: 'input',
        attributes: [
          [ 'type', 'text' ],
          [ 'name', `todo-input-${id}` ],
          [ 'placeholder', 'Task name' ],
          [ 'value', text ],
          [ 'id', `todo-input-${id}` ]
        ],
        classes: ['form__input']
      })
    }

    function buildFieldInput(item) {
      const { id } = item
      
      const checkbox = buildCheckbox(item)
      const label = buildLabel(id)
      const crossButtonContainer = buildCrossButtonContainer(id)
      const crossIcon = buildCrossIcon(id)
      const textInput = buildTextInput(item)

      crossButtonContainer.appendChild(crossIcon)

      const field = composeHtmlNode(
        checkbox,
        label,
        textInput,
        crossButtonContainer
      )(buildField())

      return field
    }

    function drawList(state = LIST_STATES.all) {
      const documentFragment = document.createDocumentFragment()

      const listToDraw = state === LIST_STATES.active
        ? getActiveTodos()
        : state === LIST_STATES.completed
          ? getCompletedTodos()
          : getList()

      listToDraw.forEach(item => {
        documentFragment.appendChild(buildFieldInput(item))
      })

      document.getElementById(containerDOMElId).innerHTML = ""
      document.getElementById(containerDOMElId).appendChild(documentFragment)
    }

    function getActiveTodos() {
      return list.filter(item => !item.checked)
    }

    function getCompletedTodos() {
      return list.filter(item => item.checked)
    }

    function getList() {
      return list
    }

    function save() {
      saveToLocalStorage(list)
    }

    return {
      addItem,
      deleteItem,
      updateItem,
      drawList,
      getList,
      save,
      clearCompleted,
      getActiveTodos,
      getCompletedTodos,
      getListState,
      setListState,
      LIST_STATES
    }
  }

  const listActions = {
    'delete-todo': (e, list) => {
      e.preventDefault()

      list.deleteItem(e.target.dataset.todoId)
      list.save()
      list.drawList()
    },

    'change-todo-status': (e, list) => {
      const { todoId } = e.target.dataset
      const { checked: todoStatus } = document.getElementById(`todo-checkbox-${todoId}`)

      list.updateItem({
        id: todoId,
        checked: !todoStatus
      })
      list.save()
      list.drawList(list.getListState())
    }
  }

  function handleTodoListClick(e, list) {
    if (e.target.classList.contains('form__delete-button')) {
      listActions["delete-todo"](e, list)
    } else if (e.target.classList.contains('form__checkbox-label')) {
      listActions["change-todo-status"](e, list)
    }
  }

  function handleTodoFormSubmit(e, addNewTodoInputDOMEl, newTodoCheckboxDOMEl, list) {
    e.preventDefault()

    const { value: newTodoText } = addNewTodoInputDOMEl
    const { checked: newTodoIsChecked } = newTodoCheckboxDOMEl
    const newTodo = {
      text: newTodoText,
      checked: newTodoIsChecked,
      id: generateId()
    }

    list.addItem(newTodo)
    list.drawList(list.getListState())
    list.save()

    addNewTodoInputDOMEl.value = ''
    newTodoCheckboxDOMEl.checked = false
  }

  function handleActiveTodosClick(list) {
    list.setListState(list.LIST_STATES.active)
    list.drawList(list.LIST_STATES.active)
  }

  function handleCompletedTodosClick(list) {
    list.setListState(list.LIST_STATES.completed)
    list.drawList(list.LIST_STATES.completed)
  }
  
  const todoList = createList(
    getFromLocalStorage(LOCAL_STORAGE_KEY) ?? [],
    'todo-list'
  )

  todoList.drawList()

  todoListFormDOMEl.addEventListener('click', (e) => handleTodoListClick(e, todoList))

  newTodoFormDOMEl.addEventListener('submit', (e) => handleTodoFormSubmit(
    e,
    addNewTodoInputDOMEl,
    newTodoCheckboxDOMEl,
    todoList
  ))

  clearCompletedDOMEl.addEventListener('click', () => {
    todoList.clearCompleted()
    todoList.save()
    todoList.drawList()
  })

  getActiveTodosDOMEl.addEventListener('click', () => handleActiveTodosClick(todoList))

  getCompletedTodosDOMEl.addEventListener('click', () => handleCompletedTodosClick(todoList))

  getAllTodosDOMEl.addEventListener('click', () => todoList.drawList())
}

main()
