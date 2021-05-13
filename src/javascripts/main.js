function main() {
  const todoListDOMEl = document.getElementById('todo-list')
  const todoListFormDOMEl = document.getElementById('todo-list-form')
  const newTodoFormDOMEl = document.getElementById('new-todo-form')
  const addNewTodoInputDOMEl = document.getElementById('add-new-todo')
  const newTodoCheckboxDOMEl = document.getElementById('add-new-todo-checkbox')

  function createFieldDOMEl() {
    const field = document.createElement('div')
    field.classList.add('form__field')

    return field
  }

  function createHtmlElement({ tag, attributes = [], classes }) {
    const element = document.createElement(tag)

    attributes.forEach(attribute => {
      element.setAttribute(attribute.key, attribute.value)
    })

    element.classList = classes

    return element
  }

  function createList(newList = [], containerDOMElId) {
    let list = [...newList]
    
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

    function buildField() {
      return createHtmlElement({
        tag: 'div',
        classes: 'form__field'
      })
    }

    function buildCheckbox(checked, text, now) {
      let checkboxAttributes = [
        { key: 'type', value: 'checkbox' },
        { key: 'name', value: 'todos' },
        { key: 'id', value: `todo-checkbox-${now}` },
        { key: 'value', value: text }
      ]

      if (checked) {
        checkboxAttributes = [
          ...checkboxAttributes,
          { key: 'checked', value: "checked" }
        ]
      }

      return createHtmlElement({
        tag: 'input',
        attributes: checkboxAttributes,
        classes: 'form__checkbox'
      })
    }

    function buildLabel(now) {
      return createHtmlElement({
        tag: 'label',
        attributes: [
          { key: 'for', value: `todo-checkbox-${now}`}
        ],
        classes: 'form__checkbox-label'
      })
    }

    function buildCrossButtonContainer() {
      return createHtmlElement({
        tag: 'button',
        classes: 'form__delete-button'
      })
    }

    function buildCrossIcon() {
      return createHtmlElement({
        tag: 'img',
        attributes: [
          { key: 'src', value: 'images/icon-cross.svg' },
          { key: 'alt', value: 'Delete todo icon' }
        ]
      })
    }

    function buildTextInput(text) {
      return createHtmlElement({
        tag: 'input',
        attributes: [
          { key: 'type', value: 'text' },
          { key: 'name', value: 'todo-input-${now}' },
          { key: 'placeholder', value: 'Task name' },
          { key: 'value', value: text },
          { key: 'id', value: 'todo-input-${now}' },
        ],
        classes: 'form__input'
      })
    }

    function buildFieldInput(item) {
      const now = `${Date.now()}${Math.floor((Math.random() + 1) * 100)}`
      const { text, checked } = item
      
      const field = buildField()
      const checkbox = buildCheckbox(checked, text, now)
      const label = buildLabel(now)
      const crossButtonContainer = buildCrossButtonContainer()
      const crossIcon = buildCrossIcon()
      const textInput = buildTextInput(text)

      crossButtonContainer.appendChild(crossIcon)

      field.appendChild(checkbox)
      field.appendChild(label)
      field.appendChild(textInput)
      field.appendChild(crossButtonContainer)

      return field
    }

    function drawList() {
      const documentFragment = document.createDocumentFragment()

      list.forEach(item => {
        documentFragment.appendChild(buildFieldInput(item))
      })

      document.getElementById(containerDOMElId).innerHTML = ""
      document.getElementById(containerDOMElId).appendChild(documentFragment)
    }

    function getList() {
      return list
    }

    return {
      addItem,
      deleteItem,
      updateItem,
      drawList,
      getList
    }
  }

  function saveToLocalStorage(element, key) {
    // Save the given element in the local storage
  }

  function getFromLocalStorage(key) {
    // Get the element from the local storage
  }

  function handleTodoListClick(e, list) {
    if (e.target.classList.contains('form__cross')) {
      
    } else if (e.target.classList.contains('form__checkbox-label')) {

    }
  }

  function handleTodoFormSubmit(e, list) {
    e.preventDefault()
  }
  
  const todoList = createList([], 'todo-list')

  todoList.addItem({
    text: 'Learn Next.js',
    checked: false,
    id: 1
  })

  todoList.addItem({
    text: 'Learn Vue',
    checked: true,
    id: 2
  })

  todoList.addItem({
    text: 'Use UUID in the MERN application',
    checked: false,
    id: 3
  })

  todoList.drawList()

  todoListFormDOMEl.addEventListener('click', (e) => handleTodoListClick(e, todoList))
  newTodoFormDOMEl.addEventListener('submit', (e) => handleTodoFormSubmit(e, todoList))
}

main()
