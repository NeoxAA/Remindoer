import {  addDays, isBefore, isThisMonth, isToday, isValid, isWithinInterval, parseISO } from 'date-fns';
import { editTaskListener } from './taskadjuster';

export function checkInterval(tasks = [], intervalID){
  let todaysDate = new Date();
  let sevenDaysFromToday = addDays(todaysDate, 7);
  let requestedTasks = [];

  if (intervalID == "today"){
    tasks.filter((task) => {
      let taskFullDate = parseISO(task.fullDate);
      if (isToday(taskFullDate) || isBefore(taskFullDate, todaysDate)){
        if(!task.completed){
          requestedTasks.push(task);
        }
      }})
  }

  if (intervalID == "sevendays"){
    tasks.filter((task) => {
      let taskFullDate = parseISO(task.fullDate);
      if (isWithinInterval(taskFullDate, { start: todaysDate, end: sevenDaysFromToday}) || isToday(taskFullDate)){
        if(!task.completed){
          requestedTasks.push(task);
        }
      }})
  }

  if (intervalID == "thismonth"){
    tasks.filter((task) => {
      let taskFullDate = parseISO(task.fullDate);
      if (isThisMonth(taskFullDate)){
        if(!task.completed){
          requestedTasks.push(task);
        }
      }})
  }

  if (intervalID == "alltasks"){
    tasks.filter((task) => {
      if(!task.completed){
      requestedTasks.push(task);
      }
    })
  }

  if (intervalID == "completedtasks"){
    tasks.filter((task) => {
      if(task.completed){
      requestedTasks.push(task);
      }
    })
  }


  return requestedTasks;
}

export function checkProjectTasks(tasks = [], projectID){
  let requestedTasks = [];
  let projectCheckTasksList = tasks;
  const tasksCheckProjectID = projectID;

  projectCheckTasksList.filter((task) => {
    if (tasksCheckProjectID == "project-"+task.project){
      requestedTasks.push(task);
    }})
  return requestedTasks;
}

export function populateTasks(tasks = [], tasksContainer, title){
  let titleContainer = document.querySelector("h2.taskareaintervaltitle");
  titleContainer.innerText = title;
    tasks = tasks;
    tasks = tasks.sort(function(firstDate,secondDate){
      return new Date(firstDate.fullDate) - new Date(secondDate.fullDate) ;
    });
    if (title != "Completed Tasks"){
      tasksContainer.innerHTML = tasks.map((task) => {
        return `
        <div class="taskitem" id="${task.id}">
        <div class="taskinfoholder">
        <p class="tasktitle">${task.title}</p>
        <p class="taskdate">${task.monthName}<span> ${task.day},</span><span class="task-year-span"> ${task.year}</span>
        <span><button id="${task.id}" class="edit-task-button">edit</button><button id="${task.id}" class="delete-task-button">delete</button></span>
        </p>
        </div>
        <input type="checkbox" class="completed-box" name="completed-box" data-index=${task.id} id="task${task.id}" ${task.completed ? 'checked' : ''}>
        <label for="task${task.id}"></label></input></td>
        </div>
        `;
      }).join('');
    }
    else{
      tasksContainer.innerHTML = tasks.map((task) => {
        if(task.completed)
        return `
        <div class="taskitem" id="${task.id}">
        <div class="taskinfoholder">
        <p class="tasktitle">${task.title}</p>
        <p class="taskdate">${task.monthName}<span> ${task.day},</span><span class="task-year-span"> ${task.year}</span>
        <span><button id="${task.id}" class="edit-task-button">edit</button><button id="${task.id}" class="delete-task-button">delete</button></span>
        </p>
        </div>
        <input type="checkbox" class="completed-box" name="completed-box" data-index=${task.id} id="task${task.id}" ${task.completed ? 'checked' : ''}>
        <label for="task${task.id}"></label></input></td>
        </div>
        `;
      }).join('');
    }
    editTaskListener();

}

