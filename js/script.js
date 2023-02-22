// Communication
const socket = new WebSocket('ws://localhost:5000');

socket.addEventListener('open', function (event) {
    console.log('WebSocket connection established');
    socket.send(JSON.stringify({type: "GET"}));
});

socket.addEventListener('message', function (event) {
    console.log('Message from server:', event.data);
});

socket.addEventListener('error', function (event) {
    console.error('WebSocket error:', event);
});

// Model
let plans = [ {
        title: "Workout",
        goals: []
    }, {
        title: "Education",
        goals: []
    }, {
        title: "Money",
        goals: []
    }];


// View
function renderSidebar() {
    const plansDiv = document.getElementById('plans-div');
    let button;
    for (let i = 0; i < plans.length; i++) {
        button = document.createElement('button');
        button.className = 'plan-button';
        button.innerText = plans[i].title;
        button.dataset.planId = i;
        button.addEventListener('click', planClick);
        plansDiv.appendChild(button);
    }
};
function renderMain(index) {
    console.log(index);
}
function renderAddPlan() {
    const plansDiv = document.getElementById('plans-div');
    const textInput = document.createElement('input');
    textInput.type = 'text';

    plansDiv.appendChild(textInput);
}

// Controler
function planClick(event) {
    const planButton = event.target;
    renderMain(planButton.dataset.planId);
};

function addPlanClick(event) {
    renderAddPlan();
}


// Run
renderSidebar();
const addPlanButton = document.getElementById('add-plan-button');
addPlanButton.addEventListener('click', addPlanClick);
