import { create } from "lodash";

var projectsList = JSON.parse(localStorage.getItem('projects')) || [];

const div = document.createElement("div");

const projectsContainer = div.cloneNode(false);
projectsContainer.classList.add("sidebarprojectscontainer");

const projectsTitleButtonContainer = div.cloneNode(false);
projectsTitleButtonContainer.classList.add("projects-title-button-container");
projectsContainer.appendChild(projectsTitleButtonContainer);

const projectsContainerTitle = document.createElement("h2");
projectsContainerTitle.innerText = "Projects";
projectsTitleButtonContainer.appendChild(projectsContainerTitle);

const newProjectButton = document.createElement("button");
newProjectButton.classList.add("sidebar-new-project-button");
newProjectButton.innerText = "Add New Project";
projectsTitleButtonContainer.appendChild(newProjectButton);

const addNewProjectsContainer = div.cloneNode(false);
addNewProjectsContainer.classList.add("add-new-projects-container");
projectsContainer.appendChild(addNewProjectsContainer);

const newProjectContainerHeading = document.createElement("h2");
newProjectContainerHeading.innerText = "Add new project";
addNewProjectsContainer.appendChild(newProjectContainerHeading);

const newProjectTitle = document.createElement("input");
newProjectTitle.setAttribute("required","");
newProjectTitle.setAttribute('type', "text");
newProjectTitle.setAttribute('task', 'title');
newProjectTitle.classList.add("newProjectTitlefield");
newProjectTitle.placeholder = "New project title"
addNewProjectsContainer.appendChild(newProjectTitle);

const errorMessage = document.createElement("p");
errorMessage.classList.add("project-title-error-message");
errorMessage.innerText = "Please enter a valid title";
addNewProjectsContainer.appendChild(errorMessage);

const existingProrjectErrorMessage = document.createElement("p");
existingProrjectErrorMessage.classList.add("existing-project-error-message");
existingProrjectErrorMessage.innerText = "This project already exists, please use a different name";
addNewProjectsContainer.appendChild(existingProrjectErrorMessage);

const submitNewProjectButton = document.createElement("button")
submitNewProjectButton.classList.add("submit-new-project");
submitNewProjectButton.innerText = "Add";
addNewProjectsContainer.appendChild(submitNewProjectButton);

const projectsListContainer = div.cloneNode(false);
projectsListContainer.classList.add("projects-list-container");
projectsContainer.appendChild(projectsListContainer);


export function projects(){
    return {projectsContainer}
}

function createProject(projectTitle){
  const project = {
    title: projectTitle,
    id: projectTitle.replace(/\s+/g, '-').toLowerCase()
  }
  projectsList.push(project);
  localStorage.setItem("projects", JSON.stringify(projectsList));
  projectsList = JSON.parse(localStorage.getItem('projects')) || [];
  renderProjects();
  return false;
}


export function addNewProjects(){
    const addNewProjectsButton = document.querySelector("button.sidebar-new-project-button")
    const addNewProjectsContainer = document.querySelector(".add-new-projects-container")
    const submitNewProjectButton = document.querySelector("button.submit-new-project");
    const errorMessage = document.querySelector(".project-title-error-message");
    const existingProjectError = document.querySelector(".existing-project-error-message")
    const projectTitle = document.querySelector("input.newProjectTitlefield");

    addNewProjectsButton.addEventListener("click", function() {
        addNewProjectsContainer.classList.add("show");
    });

    submitNewProjectButton.addEventListener("click", function() {
        let projectTitleValue = projectTitle.value;
        if(!(projectTitleValue).length > 0){
          errorMessage.classList.add('show');
          existingProjectError.classList.remove('show');
        }
        else{
          if (!projectsList.includes(projectTitleValue)){
            existingProjectError.classList.remove('show');
            errorMessage.classList.remove('show');
            createProject(projectTitleValue);
            projectTitle.value = '';
            addNewProjectsContainer.classList.remove('show');
          }
          else{
            existingProjectError.classList.add('show');
          }
        }
    });

    window.addEventListener('click', function(e){
      if (!document.querySelector('.add-new-projects-container').contains(e.target) && e.target != addNewProjectsButton) {
        addNewProjectsContainer.classList.remove('show');
      }
      else{
        addNewProjectsContainer.classList.add('show');
      }
    });
    
    addNewProjectsButton.addEventListener('click', () => {
      addNewProjectsContainer.classList.add('show');
    }); 


}

export function renderProjects(){
  let projectsList = JSON.parse(localStorage.getItem('projects')) || [];
  let projectsListContainer = document.querySelector(".projects-list-container");
  projectsListContainer.innerHTML = projectsList.map((project) => {
    return `
    <div class="project-item" id="project-${project.id}">
    <h3 class="project-title">${project.title}</h3>
    <span class="project-counter-${project.id} projects-span"></span>
    </div>
    `;
  }).join('');
  
  // Map to new tasks container if projects exist
  if (projectsList.length > 0){
    let newTasksWindowSelectProject = document.querySelector("select#new-tasks-projects");
    let newTasksWindowProjectsContainer = document.querySelector(".new-task-projects-container");
    newTasksWindowProjectsContainer.classList.add("show");
    newTasksWindowSelectProject.innerHTML = '<option value="No Project Assigned"></option>'
    newTasksWindowSelectProject.innerHTML += projectsList.map((project) => {
      return `
      <option value="${project.id}">${project.title}</option>
      `;
    }).join('');
  }

  // Map existing tasks assigned a project to counters in projects sidebar
  let tasksList = JSON.parse(localStorage.getItem('tasks')) || [];
  projectsList.forEach(project => {
    let numTasksProject = 0;
    let projectId = project.id;
    let projectCounter = document.querySelector(`span.project-counter-${project.id}`)
    tasksList.map((task) => {
      if(task.project != "No Project Assigned"){
        const taskProjectId = task.project;
        if (taskProjectId == projectId){
          numTasksProject++
        }
      }
      projectCounter.innerText = numTasksProject;
    })
  });
  
}

