/* Communication */
// Get data from server: {type: "GET"}
// Update data on server: {type: "POST", data: <updated data>}
// Stop server: {type: "STOP"}
const socket = new WebSocket('ws://localhost:5000');

socket.addEventListener('open', function (event) {
    console.log('WebSocket connection established');
    socket.send(JSON.stringify({type: "GET"}));
});

socket.addEventListener('message', function (event) {
    response = JSON.parse(event.data);
    if ("error" in response) {
        console.log(response.error);
    }
    else if ("type" in response) {
        if (response.type == "GET") {
            goals = response.data;
            renderSidebar();
            renderEmptyMain();
        }
    } 
});

socket.addEventListener('error', function (event) {
    console.error('WebSocket error:', event);
});

function updateServer() {
    socket.send(JSON.stringify({type: "POST", data: goals}));
};

// Model
let goals = [];

// View
function renderSidebar() {
    const goalsDiv = document.getElementById('goals-div');
    const buttonsDiv = document.getElementById('goals-buttons-div');

    goalsDiv.innerHTML = '';
    buttonsDiv.innerHTML = '';

    let button;
    for (let i = 0; i < goals.length; i++) {
        button = document.createElement('button');
        button.className = 'goals-button';
        button.innerText = goals[i].title;
        button.dataset.goalId = i;
        button.addEventListener('click', goalClick);
        goalsDiv.appendChild(button);
    }

    const addGoalButton = document.createElement('input');
    addGoalButton.id = 'add-goal-button';
    addGoalButton.type = 'image';
    addGoalButton.src = 'icons/plus2.png';
    addGoalButton.alt = 'Add';
    addGoalButton.addEventListener('click', addGoalClick);
    buttonsDiv.appendChild(addGoalButton);

};
function renderAddGoal() {
    const goalsDiv = document.getElementById('goals-div');
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = 'add-goal-input';
    goalsDiv.appendChild(textInput);
    textInput.focus();

    const goalsButtonDiv = document.getElementById('goals-buttons-div');
    const okButton = document.createElement('button');
    okButton.innerText = 'OK';
    okButton.addEventListener('click', okGoalClick);
    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'CANCEL';
    cancelButton.addEventListener('click', cancelGoalClick);

    goalsButtonDiv.innerHTML = '';
    goalsButtonDiv.appendChild(okButton);
    goalsButtonDiv.appendChild(cancelButton);

};
function renderEmptyMain() {
    const mainDiv = document.getElementById('main-div');
    mainDiv.innerHTML = '';
};
function renderMain(goalId) {
    const mainDiv = document.getElementById('main-div');
    mainDiv.innerHTML = '';

    // Title area
    const titleDiv = document.createElement('div');
    titleDiv.id = 'goal-title-div';

    const title = document.createElement('div');
    title.id = 'goal-title';
    title.innerText = goals[goalId].title;

    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-goal-button';
    deleteButton.innerText = 'Delete Goal';
    deleteButton.dataset.goalId = goalId;
    deleteButton.addEventListener('click', deleteGoalClick);

    titleDiv.appendChild(title);
    titleDiv.appendChild(deleteButton);

    // Tasks area
    const tasksDiv = document.createElement('div');
    tasksDiv.id = 'tasks-div';

    let oneTaskDiv;
    let taskTitle;
    let doneTaskButton;
    for(let i = 0; i < goals[goalId].tasks.length; i++) {
        oneTaskDiv = document.createElement('div');
        oneTaskDiv.className = 'task';
        taskTitle = document.createElement('div');
        taskTitle.className = 'task-title';
        taskTitle.innerText = goals[goalId].tasks[i];
        doneTaskButton = document.createElement('button');
        doneTaskButton.className = 'done-task-button';
        doneTaskButton.innerText = 'Done';
        doneTaskButton.dataset.goalId = goalId;
        doneTaskButton.dataset.taskId = i;
        doneTaskButton.addEventListener('click', doneTaskClick);
        oneTaskDiv.appendChild(taskTitle);
        oneTaskDiv.appendChild(doneTaskButton);
        tasksDiv.appendChild(oneTaskDiv);
    }

    // Buttons area
    const buttonsDiv = document.createElement('div');
    const addButton = document.createElement('button');

    buttonsDiv.id = 'tasks-buttons-div'
    
    addButton.id = 'add-task-button';
    addButton.innerText = 'Add Task';
    addButton.dataset.goalId = goalId;
    addButton.addEventListener('click', addTaskClick);

    buttonsDiv.appendChild(addButton);

    mainDiv.appendChild(titleDiv);
    mainDiv.appendChild(tasksDiv);
    mainDiv.appendChild(buttonsDiv);
};
function renderAddTask(goalId) {
    const tasksDiv = document.getElementById('tasks-div');
    const buttonsDiv = document.getElementById('tasks-buttons-div');

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = 'add-task-input';
    tasksDiv.appendChild(textInput);
    textInput.focus();

    buttonsDiv.innerHTML = '';
    const okButton = document.createElement('button');
    okButton.innerText = 'OK';
    okButton.addEventListener('click', okTaskClick);
    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'CANCEL';
    cancelButton.addEventListener('click', cancelTaskClick);
    buttonsDiv.dataset.goalId = goalId;
    buttonsDiv.appendChild(okButton);
    buttonsDiv.appendChild(cancelButton);

};

// Controler
function goalClick(event) {
    const goalButton = event.target;
    renderMain(goalButton.dataset.goalId);
};
function addGoalClick(event) {
    renderAddGoal();
};
function okGoalClick(event) {
    const textInput = document.getElementById('add-goal-input');
    if (isValid(textInput.value)) {
        goals.push({
            title: textInput.value,
            tasks: []
        });
        renderSidebar();
        updateServer();
    }
};
function cancelGoalClick(event) {
    renderSidebar();
};
function deleteGoalClick(event) {
    const deleteButton = event.target;
    const goalId = deleteButton.dataset.goalId;
    goals.splice(goalId, 1);
    renderSidebar();
    renderEmptyMain();
    updateServer();
};
function addTaskClick(event) {
    const addButton = event.target;
    const goalId = addButton.dataset.goalId;
    renderAddTask(goalId); 
};
function okTaskClick(event) {
    const okButton = event.target;
    const textInput = document.getElementById('add-task-input');
    const goalId = okButton.parentElement.dataset.goalId;

    if (isValid(textInput.value)) {
        goals[goalId].tasks.push(textInput.value);
        renderMain(goalId);
        updateServer();
    }
};
function cancelTaskClick(event) {
    const cancelButton = event.target;
    const goalId = cancelButton.parentElement.dataset.goalId;
    
    renderMain(goalId);
};
function doneTaskClick(event) {
    const doneButton = event.target;
    const goalId = doneButton.dataset.goalId;
    const taskId = doneButton.dataset.taskId;
    goals[goalId].tasks.splice(taskId, 1);
    renderMain(goalId);
    updateServer();
}


function isValid(str) {
    return str.match(/^[a-zA-Z0-9]+$/) !== null && str.length < 16;
};
// Run
//renderSidebar();
//renderEmptyMain();
