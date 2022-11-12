const div = document.createElement("div");

const sidebarContainer = div.cloneNode(false);
sidebarContainer.classList.add("sidebar");

const logo = document.createElement("p");
logo.innerHTML = "Remindoer";
logo.classList.add("logo");
sidebarContainer.appendChild(logo);

const userNameContainer = div.cloneNode(false);
userNameContainer.classList.add("usernamecontainer");
sidebarContainer.appendChild(userNameContainer);

const newTaskButton = document.createElement("button");
newTaskButton.classList.add("newtaskbutton");
newTaskButton.innerText = "New Task"
sidebarContainer.appendChild(newTaskButton);

const tasksContainer = div.cloneNode(false);
tasksContainer.classList.add("taskscontainer");
const tasksTitle = document.createElement("h2");
tasksTitle.innerText = "Tasks";
tasksContainer.appendChild(tasksTitle);
const todayTitle = document.createElement("h3");
todayTitle.innerText = "Today";
todayTitle.id = "today"
tasksContainer.appendChild(todayTitle);
const nextSevenDaysTitle = document.createElement("h3");
nextSevenDaysTitle.innerText = "Next 7 Days";
nextSevenDaysTitle.id = "sevendays";
tasksContainer.appendChild(nextSevenDaysTitle);
const thisMonthTitle = document.createElement("h3");
thisMonthTitle.innerText = "This Month";
thisMonthTitle.id = "thismonth"
tasksContainer.appendChild(thisMonthTitle);

const allTasksTitle = document.createElement("h3");
allTasksTitle.innerText = "All Tasks";
allTasksTitle.id = "alltasks"
tasksContainer.appendChild(allTasksTitle);

const completedTasksTitle = document.createElement("h3");
completedTasksTitle.innerText = "Completed Tasks";
completedTasksTitle.id = "completedtasks"
tasksContainer.appendChild(completedTasksTitle);

const tasksContainerInner = div.cloneNode(false);
tasksContainerInner.classList.add("taskscontainerinner");
tasksContainer.appendChild(tasksContainerInner);
sidebarContainer.appendChild(tasksContainer);



export function sideBar(){
    return {sidebarContainer};
 
}