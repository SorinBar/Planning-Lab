const socket = new WebSocket('ws://localhost:8000');

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
