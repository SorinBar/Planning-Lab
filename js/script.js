// Communication
const socket = new WebSocket('ws://localhost:5000');

socket.addEventListener('open', function (event) {
    console.log('WebSocket connection established');
    socket.send(JSON.stringify({type: "GET"}));
});

socket.addEventListener('message', function (event) {
    //console.log('Message from server:', event.data);
});

socket.addEventListener('error', function (event) {
    console.error('WebSocket error:', event);
});

// Model
let goals = [ {
        title: "Workout",
        tasks: []
    }, {
        title: "Education",
        tasks: []
    }, {
        title: "Money",
        tasks: []
    }];


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
function renderMain(index) {
    const mainDiv = document.getElementById('main-div');
    mainDiv.innerHTML = '';

    // Title area
    const titleDiv = document.createElement('div');
    titleDiv.id = 'goal-title-div';

    const title = document.createElement('div');
    title.id = 'goal-title';
    title.innerText = goals[index].title;

    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-goal-button';
    deleteButton.innerText = 'Delete Goal';
    deleteButton.dataset.goalId = index;
    deleteButton.addEventListener('click', deleteGoalClick);

    titleDiv.appendChild(title);
    titleDiv.appendChild(deleteButton);

    // Tasks area

    const tasksDiv = document.createElement('div');
    tasksDiv.id = 'tasks-div';
        // fill tasks

    // Button
    const addButton = document.createElement('button');
    addButton.id = 'add-task-button';
    addButton.innerText = 'Add Task';
    addButton.dataset.goalId = index;  

    mainDiv.appendChild(titleDiv);
    mainDiv.appendChild(tasksDiv);
    mainDiv.appendChild(addButton);
};

function renderEmptyMain() {
    const mainDiv = document.getElementById('main-div');
    mainDiv.innerHTML = '';
}
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
    }
};
function cancelGoalClick(event) {
    renderSidebar();
};
function deleteGoalClick(event){
    const deleteButton = event.target;
    const goalId = deleteButton.dataset.goalId;
    goals.splice(goalId, 1);
    renderSidebar();
    renderEmptyMain();
}

function isValid(str) {
    return str.match(/^[a-zA-Z0-9]+$/) !== null && str.length < 16;
}
// Run
renderSidebar();
renderEmptyMain();
