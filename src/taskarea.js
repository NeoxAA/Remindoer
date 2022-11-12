
const div = document.createElement("div");

const renderedTasksWrapper = div.cloneNode(false);
renderedTasksWrapper.classList.add("renderedTasksWrapper");

const currentIntervalContainer = div.cloneNode(false);
currentIntervalContainer.classList.add("currentintervalcontainer");
const taskTitle = document.createElement("h2");
taskTitle.classList.add("taskareaintervaltitle");
currentIntervalContainer.appendChild(taskTitle);
renderedTasksWrapper.appendChild(currentIntervalContainer);


const activeTasksContainer = div.cloneNode(false);
activeTasksContainer.classList.add("activetaskscontainer");
renderedTasksWrapper.appendChild(activeTasksContainer);

const taskListContainer = div.cloneNode(false);
taskListContainer.classList.add("tasklistcontainer")
activeTasksContainer.appendChild(taskListContainer);

export function theTasksContainer(){
    return {renderedTasksWrapper};
 
}