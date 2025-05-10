
let taskInput = document.querySelector('#taskInput');
let addTaskBtn = document.querySelector('#addTaskBtn');
let inputWarning = document.querySelector('#inputWarning');
let ulList = document.querySelector('#ulList'); 
let clearList =document.querySelector("#clearList")

let counter ;
let taskList ;
let intervalId = null;


const myToast = Toastify({
    text: "All tasks done!",
    position: "center",
    style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
});


//get Tasks and counter(id) from local Storage
function getDataFromStorage(){
    let data=JSON.parse(localStorage.getItem("taskList"))
    if(data){
        counter=data.length
        taskList=data
        displayTasks(data)
        clearList.classList.remove("hidden")
    }else{
        taskList = [];
        counter=0;
    }
}
getDataFromStorage()

// Start interval on page load
startInterval();

// Add task button listener
addTaskBtn.addEventListener('click', () => {
    addTask();
});

// Add new task to taskList array
function addTask() {
    if (validateTaskName()) {
        let task = {
            id: counter,
            name: taskInput.value,
            done: false,
        };
        taskList.push(task);
        taskInput.value = "";
        setCounter(counter)
        counter++;
        displayTasks(taskList);
        setTaskToStorage(taskList);
        startInterval(); 
        clearList.classList.remove("hidden")
    }
}

// Display tasks
function displayTasks(tasks) {
    let li = "";
    tasks.map((task, index) => {
        li += `
       <li class="bg-[rgba(255,255,255,0.778)] p-5 flex justify-between rounded-xl my-2">
            <div class="flex items-center ">
                 <input id="check-${index}" onclick="toggle('${index}')" ${task.done ? 'checked' : ''} type="checkbox" class="w-6 h-6 bg-white border-red-300 rounded-sm accent-red-500 checked:bg-red-500 duration-0"/>
                 <label for="check-${index}" class="ms-2 text-lg font-medium ${task.done ? 'line-through text-gray-500' : 'text-gray-900'}"> ${task.name}</label>
             </div>                  
           <div onclick="deleteTask('${index}')" class="delete cursor-pointer"><i class="fa-solid fa-trash-can text-red-500 text-xl"></i></div>
       </li>`;    
    });
    ulList.innerHTML = li;
}

// Validate task name
function validateTaskName() {
    let regex = /[a-zA-Z0-9]{3,}/;
    if (regex.test(taskInput.value)) {
        inputWarning.classList.add("hidden");
        return true;
    } else {
        inputWarning.classList.remove("hidden");
        inputWarning.innerHTML = 'Write the task more clearly';
        return false;
    }
}

// Delete task from array
function deleteTask(id) {
    console.log(taskList.length)
    if(taskList.length-1 == 0){
        clearList.classList.add("hidden")
    }                      
    taskList.splice(id, 1);
    displayTasks(taskList);
    setTaskToStorage(taskList)
    startInterval();
    
}

// Toggle task status
function toggle(index) {
    taskList[index].done = !taskList[index].done;
    displayTasks(taskList);
    setTaskToStorage(taskList)
    startInterval();
}

// Manage interval
function startInterval() {
    if (!intervalId) {
        intervalId = setInterval(() => {
            if (taskList.length > 0 && taskList.every(task => task.done)) {
                myToast.showToast();
                clearInterval(intervalId);
                intervalId = null; // Reset interval
            }
        }, 10000); 
    }
}

// Delete All task List 

clearList.addEventListener('click',()=>{
    clearAllList()
})

function clearAllList(){
    counter=0;
    taskList=[];
    ulList.innerHTML=""
    localStorage.clear()
    clearList.classList.add("hidden")
}

function setTaskToStorage(taskList){
    localStorage.setItem("taskList",JSON.stringify(taskList))
}

function setCounter(){
     localStorage.setItem("counter",JSON.stringify(counter))
}