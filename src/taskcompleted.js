export function watchCompleted(){
  let checkBoxes = document.querySelectorAll(".completed-box");
  checkBoxes.forEach(checkbox => {
    checkbox.addEventListener('click', e => {
      let tasksList = JSON.parse(localStorage.getItem('tasks')) || [];
      tasksList.map((task) => {
        if (task.id == e.target.dataset.index ){
          if (task.completed == false){
            task.completed = true;
          }
          else{
            task.completed = false; 
          }
        }
        localStorage.setItem("tasks", JSON.stringify(tasksList));
      })
    }) 
  })
}

