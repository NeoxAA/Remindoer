import { isValid } from "date-fns";

const div = document.createElement("div");

const overlay = div.cloneNode(false);
overlay.classList.add("overlay");

const newTaskContainer = div.cloneNode(false);
newTaskContainer.classList.add("newtaskscontainer");

const newTaskHeading = document.createElement("h2");
newTaskHeading.innerHTML = "ADD NEW TASK";
newTaskHeading.classList.add("newTaskHeading");
newTaskContainer.appendChild(newTaskHeading);

const newTaskFormContainer = div.cloneNode(false);
newTaskFormContainer.classList.add("new-task-form");
newTaskContainer.appendChild(newTaskFormContainer);

const taskForm = document.createElement("form");
taskForm.setAttribute('id', 'taskform');
newTaskFormContainer.appendChild(taskForm);

const taskTitleContainer = div.cloneNode(false)
taskTitleContainer.classList.add("tasktitlecontainer");
taskForm.appendChild(taskTitleContainer);

const taskTitle = document.createElement("input");
taskTitle.setAttribute("required","");
taskTitle.setAttribute('type', "text");
taskTitle.setAttribute('task', 'title');
taskTitle.classList.add("tasktitlefield");
taskTitle.placeholder = "I have to.."
taskTitleContainer.appendChild(taskTitle);

const dateContainer = div.cloneNode(false);
dateContainer.classList.add("datecontainer")
taskForm.appendChild(dateContainer);

const datePicker = document.createElement("input");
datePicker.setAttribute('type', 'datetime-local');
datePicker.setAttribute('name', 'calendar');
dateContainer.appendChild(datePicker);

const dateErrorMessage = document.createElement("p");
dateErrorMessage.classList.add("errordate");
dateErrorMessage.innerText = "Please select a valid date";
dateContainer.appendChild(dateErrorMessage);

const titleErrorMessage = document.createElement("p");
titleErrorMessage.classList.add("errortitle");
titleErrorMessage.innerText = "Please enter a title for this task";
taskTitleContainer.appendChild(titleErrorMessage);

const newTaskWindowProjectsContainer = div.cloneNode(false);
newTaskWindowProjectsContainer.classList.add("new-task-projects-container");
taskForm.appendChild(newTaskWindowProjectsContainer);

const addToProjectTitle = document.createElement("p");
addToProjectTitle.classList.add("add-to-project");
addToProjectTitle.innerText = "Add to project: "
newTaskWindowProjectsContainer.appendChild(addToProjectTitle);

const selectProject = document.createElement("select");
selectProject.name = "projects";
selectProject.id = "new-tasks-projects";
newTaskWindowProjectsContainer.appendChild(selectProject);

const taskSubmitButton = document.createElement("button");
taskSubmitButton.innerText = "Add Task";
taskSubmitButton.classList.add("tasksubmitbutton")
taskForm.appendChild(taskSubmitButton);

export function newTasks(){
    
    return {newTaskContainer};
 
}