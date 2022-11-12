import { renderProjects } from "./projects";
import { isValid } from 'date-fns';
import { populateTasks, checkInterval, checkProjectTasks } from './rendertasks';
import { watchCompleted } from "./taskcompleted";


const div = document.createElement("div");

const adjustTaskContainer = div.cloneNode(false);
adjustTaskContainer.classList.add("adjust-task-container");

const adjustTaskContainerTitle = document.createElement("h2");
adjustTaskContainerTitle.innerText = "ADJUST TASK";
adjustTaskContainer.appendChild(adjustTaskContainerTitle);

const taskTitle = document.createElement("h3");
taskTitle.innerText = "PLACEHOLDER TEXT"
adjustTaskContainer.appendChild(taskTitle);

const taskControlsHolder = div.cloneNode(false);
taskControlsHolder.classList.add("task-controls-holder");
adjustTaskContainer.appendChild(taskControlsHolder);

const deleteTaskConfirmation = div.cloneNode(false);
deleteTaskConfirmation.classList.add("delete-task-container");

const deleteTaskConfirmationMessage = document.createElement("p");
deleteTaskConfirmationMessage.classList.add("delete-task-confirmation-message");
deleteTaskConfirmationMessage.innerText = "Are you sure you want to delete this task?";
deleteTaskConfirmation.appendChild(deleteTaskConfirmationMessage);

const confirmationButtonsContainer = div.cloneNode(false);
confirmationButtonsContainer.classList.add("delete-confirmation-buttons-container");
deleteTaskConfirmation.appendChild(confirmationButtonsContainer);

const deleteConfirmYesButton = document.createElement("button");
deleteConfirmYesButton.classList.add("delete-confirm-yes");
deleteConfirmYesButton.innerText = "YES";
confirmationButtonsContainer.appendChild(deleteConfirmYesButton);

const deleteConfirmNoButton = document.createElement("button");
deleteConfirmNoButton.classList.add("delete-confirm-no");
deleteConfirmNoButton.innerText = "NO";
confirmationButtonsContainer.appendChild(deleteConfirmNoButton);


export function deleteTaskWindow(){
    return {deleteTaskConfirmation}
}


export function adjustTaskWindow(){
    return {adjustTaskContainer}
}

export function editTaskListener(){
    let editTaskButtons = document.querySelectorAll("button.edit-task-button");
    editTaskButtons.forEach(button =>{
        button.addEventListener("click", (e) =>{
            const adjustTaskContainerSwitch = document.querySelector(".adjust-task-container");
            adjustTaskContainer.classList.add("show")
            let taskID = e.target.id;
            taskFindAndRender(taskID);
        })
    })
}

function taskFindAndRender(taskId){
    let taskAdjustId = taskId;
    const taskControlsContainer = document.querySelector(".task-controls-holder");
    let tasksList = JSON.parse(localStorage.getItem('tasks')) || [];
    tasksList.map(task => {
        if (task.id == taskAdjustId){
            const taskTitle = document.querySelector(".adjust-task-container h3");
            taskTitle.innerText = task.title;
            taskControlsContainer.innerHTML = `
            <div class="adjust-item">
                <label for="title">Update task title</label>
                <input name="title" class="adjust-task-title" placeholder="${task.title}"></input>
                <p class="adjust-task-title-error">Please enter a valid title</p>
            </div>
            <div class="adjust-item">
                <label for="calendar">Update task date</label>
                <input class="adjust-task-date" type="datetime-local" name="calendar">
                <p class="adjust-task-date-error">Please select a valid date</p>
            </div>
            <div class="adjust-item">
                <label for="projects-adjust">Update project</label>
                <select name="projects-adjust" id="adjust-tasks-projects"><option value="No Project Assigned"></option></select>
            </div>
            <div class="adjust-item">
                <button class="adjust-task-submit">UPDATE TASK</button>
            </div>
            `
            
            let adjustTaskProjectSelection = document.querySelector("select#adjust-tasks-projects");
            let projectsList = JSON.parse(localStorage.getItem('projects')) || [];
            adjustTaskProjectSelection.innerHTML += projectsList.map((project) => {
                return `
                <option value="${project.id}">${project.title}</option>
                `;
              }).join('');
            adjustTaskProjectSelection.value = task.project;
            taskAdjuster(taskId)
        }
    })
}

function taskAdjuster(taskId){
    let taskAdjustId = taskId;
    const submitButton = document.querySelector("button.adjust-task-submit");
    submitButton.addEventListener("click", () =>{
        let tasksList = JSON.parse(localStorage.getItem('tasks')) || [];

        const newTaskTitle = document.querySelector("input.adjust-task-title");
        if(!(newTaskTitle.value).length > 0){
            newTaskTitle.value = taskTitle.getAttribute("placeholder");
          }
        var dateControl = document.querySelector('input.adjust-task-date');
        const date = new Date(dateControl.value);
        const newProject = document.querySelector("select#adjust-tasks-projects").value;

        tasksList.map(task => {
            if (task.id == taskAdjustId){
                if (newTaskTitle.value != task.title && (newTaskTitle.value).length > 0){
                    task.title = newTaskTitle.value;
                    const taskTitle = document.querySelector(".adjust-task-container h3");
                    taskTitle.innerText = newTaskTitle.value;
                }

                if (isValid(date)) {
                    task.day = date.getDate();
                    task.month = date.getMonth()+1;
                    task.year = date.getFullYear();
                    task.hours = date.getHours(),
                    task.minutes = date.getMinutes();
                    task.fullDate = date;
                    task.monthName = date.toLocaleString("default", { month: "long" });
                }

                if (task.project != newProject){
                    task.project = newProject;
                }
                let taskListContainer = document.querySelector(".tasklistcontainer");
                localStorage.setItem("tasks", JSON.stringify(tasksList));
                let newTaskTasksList = JSON.parse(localStorage.getItem('tasks')) || [];
                let requestedTasks = ((checkInterval(newTaskTasksList, "alltasks")));
                populateTasks(requestedTasks, taskListContainer, "All Tasks");
                renderProjects();
                refreshProjects();
                watchCompleted();
            }
        })
        
    })
}

export function deleteTaskListener(taskID){
    let deleteTaskID = taskID;
    let deleteTasksContainer = document.querySelector(".delete-confirmation-buttons-container");
    deleteTasksContainer.innerHTML = `
    <button id="${taskID}" class="delete-confirm-yes">YES</button>
    <button class="delete-confirm-no">NO</button>
    `
    let deleteTaskButtonYes = document.querySelector("button.delete-confirm-yes");
    deleteTaskButtonYes.addEventListener("click", () => {
        taskDelete(deleteTaskID);
    })
}

function taskDelete(taskID){
    let taskDeletetaskID = taskID;
    console.log(taskID)
    let tasksList = JSON.parse(localStorage.getItem('tasks')) || [];
    tasksList = tasksList.filter(task =>  task.id != taskDeletetaskID);
    localStorage.setItem("tasks", JSON.stringify(tasksList));
    let requestedTasks = ((checkInterval(tasksList, "alltasks")));
    let taskListContainer = document.querySelector(".tasklistcontainer");
    populateTasks(requestedTasks, taskListContainer, "All Tasks");
    renderProjects();
    refreshProjects();
    watchCompleted();
}

function refreshProjects(){
    let projectItems = document.querySelectorAll(".project-item");
    let taskListContainer = document.querySelector(".tasklistcontainer");
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
  