import './style.css';
import { sideBar } from './sidebar';
import { newTasks } from './newtask';
import { isValid } from 'date-fns';
import { populateTasks, checkInterval, checkProjectTasks } from './rendertasks';
import { theTasksContainer } from './taskarea';
import { projects, addNewProjects, renderProjects } from './projects'
import { watchCompleted } from './taskcompleted';
import { adjustTaskWindow, deleteTaskListener, deleteTaskWindow, editTask } from './taskadjuster';

const app = document.getElementById("content");
const div = document.createElement("div");
let userName = '';
const logo = document.createElement("p");
logo.innerHTML = "REMINDOER";
logo.classList.add("logincontainerlogo")


var tasksList = JSON.parse(localStorage.getItem('tasks')) || [];
let numberofExistingTasks;

if(!localStorage.getItem('numTasks')) {
  numberofExistingTasks = 0;
} else {
  numberofExistingTasks = localStorage.getItem('numTasks');
}

// Check if visitor has user name in local storage, if not then run getUserName function
if(!localStorage.getItem('userName')) {
    getUserName();
} else {
    userName = localStorage.getItem("userName");
}

function getUserName(){
  const loginContainer = div.cloneNode(false);
  loginContainer.classList.add("logincontainer");
  loginContainer.appendChild(logo);
  loginContainer.innerHTML += `
  <p class="margintop">Please enter your name</p>
  <input id="userName" type="text" placeholder="Name"></input>
  <button class="userNameSubmit">SUBMIT</button>
  `
  app.appendChild(loginContainer);
  const submitButton = document.querySelector('button.userNameSubmit');
  submitButton.addEventListener("click", function() {
      const nameInput = document.querySelector('input#userName').value;
      localStorage.setItem("userName", nameInput);
      loginContainer.innerHTML = `<p class="usernametext">
      Welcome ${localStorage.getItem("userName")}</p>
      `;
      setTimeout(() => {  location.reload(); }, 1250);
      return false;
    });
}

// End check if visitor has user name in local storage, if not then run getUserName function

function renderSidebar(){
  const sidebarContainer = sideBar()["sidebarContainer"];
  app.appendChild(sidebarContainer);

  const userNameContainer = document.querySelector('.usernamecontainer');
  userNameContainer.innerHTML = `<p>Hello ${userName}</p>
  <p class="local-storage-notification">Please note these tasks are saved on your
  <a href="https://blog.logrocket.com/localstorage-javascript-complete-guide/" target="_blank" rel="noopener">local storage</a> so they will be deleted if it is cleared. They are also separated from each device.`
}
if(localStorage.getItem('userName')) {
  renderSidebar();
}

function renderNewTasksContainer(){
  const newTasksContainer = newTasks()["newTaskContainer"];
  app.appendChild(newTasksContainer);
}

if(localStorage.getItem('userName')) {
  renderNewTasksContainer();
}

function renderTasksContainer(){
  const tasksWrapper = theTasksContainer()["renderedTasksWrapper"];
  app.appendChild(tasksWrapper);
}
if(localStorage.getItem('userName')) {
  renderTasksContainer()
}

const newTaskButton = document.querySelector("button.newtaskbutton");
const newTasksContainerSelector = document.querySelector('.newtaskscontainer');



const taskSubmitButton = document.querySelector("button.tasksubmitbutton");

window.addEventListener('click', function(e){   
  if (!document.querySelector('.newtaskscontainer').contains(e.target) && e.target != newTaskButton){
    newTasksContainerSelector.classList.remove('show');
  }
  else{
    newTasksContainerSelector.classList.add('show');
  }
});

newTaskButton.addEventListener('click', () => {
  newTasksContainerSelector.classList.add('show');
});

taskSubmitButton.addEventListener('click', e => {
  e.preventDefault();
  var tasksList = JSON.parse(localStorage.getItem('tasks')) || [];
  const form = document.querySelector('form#taskform');
  var dateControl = document.querySelector('input[type="datetime-local"]');
  const date = new Date(dateControl.value);
  var taskTitle = document.querySelector('input.tasktitlefield');
  const titleErrorMessage = document.querySelector(".errortitle");
  const dateErrorMessage = document.querySelector(".errordate");
  const validDate = date => {return isValid(date)};
  let projectSelection;
  let completed = false;

  if (document.querySelector(".new-task-projects-container").classList.contains("show")) {
    projectSelection = document.querySelector("select#new-tasks-projects");
    projectSelection = projectSelection.value;
  }
  else{
    projectSelection = "No Project Assigned";
  }
  
  if(!(taskTitle.value).length > 0){
    titleErrorMessage.classList.add('show');
  }
  else{
    titleErrorMessage.classList.remove('show');
  }
  if(!validDate(date)){
    dateErrorMessage.classList.add('show');
  }
  else{
    dateErrorMessage.classList.remove('show');
  }
  if (isValid(date) && (taskTitle.value).length > 0){
    dateErrorMessage.classList.remove('show');
    numberofExistingTasks++
    const task = {
      id: numberofExistingTasks,
      title: taskTitle.value,
      day: date.getDate(),
      month: date.getMonth()+1,
      year: date.getFullYear(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      fullDate: date,
      monthName: date.toLocaleString("default", { month: "long" }),
      project: projectSelection,
      completed
    }
    tasksList.push(task);
    form.reset();
    localStorage.setItem("tasks", JSON.stringify(tasksList));
    localStorage.setItem("numTasks", numberofExistingTasks);
    let newTaskTasksList = JSON.parse(localStorage.getItem('tasks')) || [];
    let requestedTasks = ((checkInterval(newTaskTasksList, "alltasks")));
    populateTasks(requestedTasks, taskListContainer, "All Tasks");
    renderProjects();
    refreshProjects();
    watchCompleted();
    return false;
}
});

let taskListContainer = document.querySelector(".tasklistcontainer");



const tasksIntervals = document.querySelectorAll(".taskscontainer h3");

tasksIntervals.forEach(interval => {
  interval.addEventListener('click', () => {
    let tasksList = JSON.parse(localStorage.getItem('tasks')) || [];
    let requestedTasks = ((checkInterval(tasksList, interval.id)));
    if (interval.id == "today"){
      populateTasks(requestedTasks, taskListContainer, "Today");
    }
    if (interval.id == "sevendays"){
      populateTasks(requestedTasks, taskListContainer, "Next Seven Days");
    }
    if (interval.id == "thismonth"){
      populateTasks(requestedTasks, taskListContainer, "This Month");
    }
    if (interval.id == "alltasks"){
      populateTasks(requestedTasks, taskListContainer, "All Tasks");
    }

    if (interval.id == "completedtasks"){
      populateTasks(requestedTasks, taskListContainer, "Completed Tasks");
    }
    watchCompleted();
  });
 
});

const theSideBarContainer = document.querySelector(".sidebar");

theSideBarContainer.appendChild(projects()["projectsContainer"]);

addNewProjects()

renderProjects();

function refreshProjects(){
  let projectItems = document.querySelectorAll(".project-item")
  projectItems.forEach(project => {
    let tasksListProjects = JSON.parse(localStorage.getItem('tasks')) || [];
    project.addEventListener('click', () => {
      let requestedTasks = ((checkProjectTasks(tasksListProjects, project.id)));
      let projectName = project.firstChild.nextSibling.innerHTML;
      populateTasks(requestedTasks, taskListContainer, projectName);
      watchCompleted();
    });
  });
}

refreshProjects();



// Populates the tasks list with all not completed tasks on page load
let requestedTasks = ((checkInterval(tasksList, "alltasks")));
populateTasks(requestedTasks, taskListContainer, "All Tasks");
// End populate the tasks list with all not completed tasks on page load
    

watchCompleted();

function renderAdjustTaskWindow(){
  const taskAdjusterContainer = adjustTaskWindow()["adjustTaskContainer"];
  app.appendChild(taskAdjusterContainer);
}

renderAdjustTaskWindow()

window.addEventListener('click', function(e){
  let adjustTaskContainer = document.querySelector(".adjust-task-container");
  if (!document.querySelector('.adjust-task-container').contains(e.target) && e.target.classList.contains("edit-task-button") == false){
    adjustTaskContainer.classList.remove('show');
  }
  else{
    adjustTaskContainer.classList.add('show');
  }
});

function renderDeleteTaskWindow(){
  const deleteTaskContainer = deleteTaskWindow()["deleteTaskConfirmation"];
  app.appendChild(deleteTaskContainer);
}

renderDeleteTaskWindow()

window.addEventListener('click', function(e){
  let deleteTaskContainer = document.querySelector(".delete-task-container");
  if (!document.querySelector('.delete-task-container').contains(e.target) && e.target.classList.contains("delete-task-button") == false || e.target.classList.contains("delete-confirm-yes") == true){
    deleteTaskContainer.classList.remove('show');
  }
  else{
    deleteTaskContainer.classList.add('show');
    deleteTaskListener(e.target.id);
  }
});

