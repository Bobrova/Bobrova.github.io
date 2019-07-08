let isList = false;
window.addEventListener('load', first_setting);
let counterTasks = 0;
const bookMar = document.getElementsByClassName('js-bookmarks');
const footer = document.getElementsByClassName('js-list-footer');
let isActive = 0;
let isStorage = false;
let todoList = [];
let isEdit = false;
let ENTER_KEY_CODE = 13;

function first_setting() {
  document.getElementsByClassName('js-main__header')[0].addEventListener('mousedown', stopClick);
  window.addEventListener('mousedown', actionForClick);
  window.addEventListener("keydown", actionForEnter);
  for (let i = 0; i < bookMar.length; i++) {
    bookMar[i].addEventListener("click", changeTab);
  }
  bookMar[0].addEventListener("click", showAll);
  bookMar[1].addEventListener("click", showActive);
  bookMar[2].addEventListener("click", showCompleted);
  if (localStorage['todoApp']) createFromStorage();
}

function create_item() {
  let text = document.getElementsByClassName('js-input-text')[0].value;
  if (!validateText(text)) return;
  	counterTasks += 1;
    idCounter = counterTasks;
  	let clForCheck = 'cb' + counterTasks;
    let li = document.createElement('li');
    li.setAttribute('data-id', idCounter);
    li.className = "list-item";
    li.innerHTML =  '<input type="checkbox" id="' + clForCheck + '" class="list-checkbox"> <label for="' + clForCheck + '"></label>' + '<span class="task-list_text">' + text.trim() + '</span> <div class="btnDel"></div>';
    listTask.insertBefore(li, listTask.firstChild);
    document.getElementsByClassName('js-input-text')[0].value = '';
    
    activationOfAdditionalFunctions();
    document.getElementsByClassName('btnDel')[0].addEventListener('click', delItem);
    document.getElementsByClassName('list-checkbox')[0].addEventListener('click', control_check);
    document.getElementsByClassName('task-list_text')[0].addEventListener('dblclick', textEditingFunction);
    ShowCounterActiveTask();
    saveToObject(idCounter,text.trim(),false);
    saveToStorage(todoList);
    tabContent();
    document.getElementsByClassName('checked-items')[0].classList.remove('active');
}

function saveToObject(ID, text, check) {
  todoList.push({id:ID, title: text, completed: check});
}

function saveToStorage(arrayValue) {
  localStorage.setItem('todoApp', JSON.stringify(arrayValue));
}

function createFromStorage() {
  isStorage = true;
  let data = JSON.parse(localStorage['todoApp']);
  createItemFromStorage(data);
  todoList = data;
  counterTasks = data[data.length-1].id;
  isStorage = false;
}

function createItemFromStorage(arrayValue) {
  let counterChecked = 0;
  for (let i = 0; i < arrayValue.length; i++) {
    let li = document.createElement('li');
    li.setAttribute('data-id', arrayValue[i].id);
    li.className = "list-item";
    let clForCheck = 'cb' + arrayValue[i].id;
    li.innerHTML =  '<input type="checkbox" id="' + clForCheck + '" class="list-checkbox"> <label for="' + clForCheck + '"></label>' + '<span class="task-list_text">' + arrayValue[i].title + '</span> <div class="btnDel"></div>';
    listTask.insertBefore(li, listTask.firstChild);

    activationOfAdditionalFunctions();
    document.getElementsByClassName('btnDel')[0].addEventListener('click', delItem);
    document.getElementsByClassName('list-checkbox')[0].addEventListener('click', control_check);
    document.getElementsByClassName('task-list_text')[0].addEventListener('dblclick', textEditingFunction);
    if (arrayValue[i].completed) document.getElementsByClassName('list-checkbox')[0].click();
    if (arrayValue[i].completed) counterChecked += 1;
    if (counterChecked === arrayValue.length) {
      document.getElementsByClassName('checked-items')[0].classList.add('active');
    }
  }
  
  ShowCounterActiveTask();
}

function activationOfAdditionalFunctions() {
  footer[0].classList.add('active');
  document.getElementsByClassName('checked-items')[0].style.display = "block";

  document.getElementsByClassName('delete-completed')[0].addEventListener('click', deleteCompleted);
  document.getElementsByClassName('checked-items')[0].addEventListener('click', selectAll);
}

function showCompleted() {
  let checkElement = document.getElementsByClassName('list-checkbox');
  isActive = 3;
  for (let i = 0; i < checkElement.length; i++) {
    if (checkElement[i].checked) {
      checkElement[i].parentNode.style.display = "flex";
    }
    else {
      checkElement[i].parentNode.style.display = "none";
    }
  }
}

function showActive() {
  let checkElement = document.getElementsByClassName('list-checkbox');
  isActive = 2;
  for (let i = 0; i< checkElement.length; i++) {
    if (checkElement[i].checked) {
      checkElement[i].parentNode.style.display = 'none';
    }
    else {
      checkElement[i].parentNode.style.display = 'flex';
    }
  }
}

function showAll() {
  let checkElement = document.getElementsByClassName('list-checkbox');
  isActive = 1;
  for (let i = 0; i< checkElement.length; i++) {
    checkElement[i].parentNode.style.display = 'flex';
  }
}

function actionForEnter(e) {
  if (isEdit) {
    if (e.keyCode === ENTER_KEY_CODE) {
    e.preventDefault();
    addTextAfterEditing();
  }
  }
  else if (e.keyCode === 13) {
    e.preventDefault();
    create_item();
  }
}

function actionForClick() {
  if (isEdit) {
    addTextAfterEditing();
  }
  else {
    create_item();
  }
}

function stopClick() {
  event.stopPropagation();
}

function delItem() {
  let idStorageItem = this.parentNode.getAttribute('data-id');
  delFromStorage(idStorageItem);
  listTask.removeChild(this.parentNode);
  if (listTask.children.length === 1) {
    footer[0].classList.remove('active');
    localStorage.removeItem("todoApp");
    document.getElementsByClassName('checked-items')[0].style.display = "none";   
    document.getElementsByClassName('checked-items')[0].classList.remove('active');      
  }
  ShowCounterActiveTask();
}

function delFromStorage(key) {
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].id == key) {
      todoList.splice(i, 1);
    }
  }
  saveToStorage(todoList);
}

function control_check() {
  let counterChecked = 0;
  if (isStorage) {
  this.parentNode.classList.toggle('completed');
  }
  else {
    this.parentNode.classList.toggle('completed');
    let idStorageItem = this.parentNode.getAttribute('data-id');
    for (let i = 0; i < todoList.length; i++) {
      if (todoList[i].id == idStorageItem && !todoList[i].completed) {
        todoList[i].completed = true;
      }
      else if (todoList[i].id == idStorageItem && todoList[i].completed) {
        todoList[i].completed = false;
      }
    }
    
    for (let i = 0; i < todoList.length; i++) {
      if (todoList[i].completed) counterChecked += 1;
    }

    if (counterChecked === todoList.length) {
      document.getElementsByClassName('checked-items')[0].classList.add('active');
    }
    else {
      document.getElementsByClassName('checked-items')[0].classList.remove('active');
    }
    saveToStorage(todoList);
  }
  tabContent();
  if (document.getElementsByClassName('completed').length !== 0) {
    document.getElementsByClassName('delete-completed')[0].style.display = 'block';
  }
  else {
    document.getElementsByClassName('delete-completed')[0].style.display = 'none';
  }
  ShowCounterActiveTask();
}

function tabContent() {
if (isActive === 1) {
      showAll();
    }
    else if (isActive === 2) {
      showActive();
    }
    else if (isActive === 3) {
      showCompleted();
    }
}

function changeTab() {
  for (let i = 0; i < bookMar.length; i++) {
    bookMar[i].classList.remove('activeBord');
  }
  this.classList.add('activeBord');
}

function ShowCounterActiveTask() {
  let counterAll = document.getElementsByClassName('list-item').length;
  let counterCompleted = document.getElementsByClassName('completed').length;
  document.getElementsByClassName('active-task')[0].innerHTML = (counterAll - counterCompleted) !== 1 ? (counterAll - counterCompleted) + ' items left': (counterAll - counterCompleted) + ' item left';
}

function deleteCompleted() {
  let el = document.getElementsByClassName('completed');
  while (el.length > 0) {
    let idStorageItem = el[0].getAttribute('data-id');
    delFromStorage(idStorageItem);
    listTask.removeChild(el[0]);
  }
  if (listTask.children.length === 1) {
      footer[0].classList.remove('active');
      localStorage.removeItem("todoApp");
      document.getElementsByClassName('checked-items')[0].style.display = "none";
    }

  ShowCounterActiveTask();
  document.getElementsByClassName('delete-completed')[0].style.display = 'none';
  document.getElementsByClassName('checked-items')[0].classList.remove('active');
}

function selectAll() {
  const elList = document.getElementsByClassName('list-checkbox');
  let isAllChecked = true;
  for (let i = 0; i < elList.length; i++) {
    if (!elList[i].checked) {
      elList[i].click();
      isAllChecked = false;
    }
    
  }
  if (isAllChecked) {
    for (let i = 0; i < elList.length; i++) {
      elList[i].click();
    }
  } 
}

function textEditingFunction () {
  isEdit = true;
  let liElement = this.parentNode;
  liElement.classList.add('edit');
  for (let i = 0; i < liElement.children.length; i++) {
    liElement.children[i].style.display = 'none';
  }
  let input = document.createElement('input');
  input.type = "text";
  input.autofocus = true;
  input.className = "text-editing";
  input.value = liElement.getElementsByClassName('task-list_text')[0].innerHTML;
  liElement.appendChild(input);
  input.addEventListener('mousedown', stopClick);
}

function addTextAfterEditing() {
  isEdit = false;
  let input = document.getElementsByClassName('text-editing')[0];
  input.autofocus = false;
  let liEdit = document.getElementsByClassName('edit')[0];
  let text = input.value;
  if(!validateText(text)) {
    delItem.bind(input)();
    return;
  }
  else {
    liEdit.removeChild(input);
    for (let i = 0; i < liEdit.children.length; i++) {
      liEdit.children[i].style.display = 'block';
    }
    liEdit.getElementsByClassName('task-list_text')[0].innerHTML = text.trim();
    liEdit.classList.remove('edit');
    liEdit.removeEventListener('mousedown', stopClick);
    let idStorageItem = liEdit.getAttribute('data-id');
    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == idStorageItem) {
          todoList[i].title = text;
        }
      }
      saveToStorage(todoList);
    }
}

function validateText(text) {
  if (text !== '' && /\S/.test(text)) return true;
  return false;
}