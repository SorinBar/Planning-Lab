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
    const buttonsDiv = document.getElementById('plans-buttons-div');

    plansDiv.innerHTML = '';
    buttonsDiv.innerHTML = '';

    let button;
    for (let i = 0; i < plans.length; i++) {
        button = document.createElement('button');
        button.className = 'plan-button';
        button.innerText = plans[i].title;
        button.dataset.planId = i;
        button.addEventListener('click', planClick);
        plansDiv.appendChild(button);
    }

    const addPlanButton = document.createElement('input');
    addPlanButton.id = 'add-plan-button';
    addPlanButton.type = 'image';
    addPlanButton.src = 'icons/plus2.png';
    addPlanButton.alt = 'Add';
    addPlanButton.addEventListener('click', addPlanClick);
    buttonsDiv.appendChild(addPlanButton);

};
function renderAddPlan() {
    const plansDiv = document.getElementById('plans-div');
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = 'add-plan-input';
    plansDiv.appendChild(textInput);
    textInput.focus();

    const plansButtonDiv = document.getElementById('plans-buttons-div');
    const okButton = document.createElement('button');
    okButton.innerText = 'OK';
    okButton.addEventListener('click', okPlanClick);
    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'CANCEL';
    cancelButton.addEventListener('click', cancelPlanClick);

    plansButtonDiv.innerHTML = '';
    plansButtonDiv.appendChild(okButton);
    plansButtonDiv.appendChild(cancelButton);

};
function renderMain(index) {
    console.log(index);
};
// Controler
function planClick(event) {
    const planButton = event.target;
    renderMain(planButton.dataset.planId);
};
function addPlanClick(event) {
    renderAddPlan();
};
function okPlanClick(event) {
    const textInput = document.getElementById('add-plan-input');
    if (isValid(textInput.value)) {
        plans.push({
            title: textInput.value,
            goals: []
        });
        renderSidebar();
    }
};
function cancelPlanClick(event) {
    renderSidebar();
};


function isValid(str) {
    return str.match(/^[a-zA-Z0-9]+$/) !== null && str.length < 16;
}
// Run
renderSidebar();
