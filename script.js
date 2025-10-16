"use strict"

// VARIABLES
const inputField = document.querySelector('.add-task-input');
const addBtn = document.querySelector('.add-task-btn');
let taskList = document.querySelector('.task-list');
let taskArray = [];

const storedArr = (arr) => JSON.parse(localStorage.getItem(arr));
const sendArr = (arr) => localStorage.setItem('taskArray', JSON.stringify(arr));

// FUNCTIONS
const saveTask = function(newTask, checked) {
taskArray = storedArr('taskArray');
if(!taskArray) taskArray = [];
taskArray.unshift({description: newTask, checked: checked});
sendArr(taskArray);
};


const renderTask = function(input, checked) {
  const html = `
  <div class="task-item  ${!checked ? '' : 'checked'}">
    <ion-icon name="${!checked ? 'ellipse-outline' : 'checkmark-circle'}" class="task-list-icon task-checkbox-btn btn"></ion-icon>
    <p class="task-description">${input}</p>
    <ion-icon name="trash-outline" class="task-list-icon task-delete-btn btn"></ion-icon>
  </div>
  `
  taskList.insertAdjacentHTML('afterbegin', html)
};

const updateNewTask = function() {
  const input = inputField.value.trim();
  const checked = false;
  saveTask(input, checked);
  renderTask(input, checked);
  inputField.blur();
  inputField.value = '';
}

// EVENT LISTENERS
window.addEventListener('load', function() {
  const savedArray = storedArr('taskArray');
  if(!savedArray) return;
  savedArray.toReversed().forEach(task => {
    renderTask(task.description, task.checked)
  });
});

addBtn.addEventListener('click', function() {
  updateNewTask();
});

inputField.addEventListener('keypress', function(e) {
if(e.key === 'Enter') {
  updateNewTask();
}
});

taskList.addEventListener('click', function (e){
  if(e.target.matches('.task-checkbox-btn') || e.target.matches('.task-description')) {
    const item = e.target.closest('.task-item');
    item.classList.toggle('checked');
    item.querySelector('.task-checkbox-btn').setAttribute('name', item.querySelector('.task-checkbox-btn').getAttribute('name') === 'ellipse-outline' ?'checkmark-circle' : 'ellipse-outline');
    const descriptionText = item.querySelector('.task-description').textContent;

    const replacedCheckArr = storedArr('taskArray').map(task => {
      if(task.description === descriptionText) {
        if(!task.checked) {
          return {
            ...task,
            checked: true
          }
        } else {
          return {
            ...task,
            checked: false
          }
        };
      };
      return task;
    });
    sendArr(replacedCheckArr);
}});

taskList.addEventListener('click', function(e) {
    if(e.target.matches('.task-delete-btn')) {
      const taskToDelete = e.target.closest('.task-item').querySelector('.task-description').textContent;
      const deletedArr = storedArr('taskArray').filter(task => task.description !== taskToDelete);
      taskArray = deletedArr;
      sendArr(taskArray);
      taskList.innerHTML = '';
      storedArr('taskArray').toReversed().forEach(task => renderTask(task.description, task.checked));
    }
  });

