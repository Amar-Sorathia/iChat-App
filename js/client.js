const socket = io("http://localhost:8000", { transports: ["websocket"] });

// Get DOM elements in respective JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('message-box')
const messageContainer = document.querySelector('.container')

// audio that will play on receiving messages
var audio = new Audio('incoming-message.mp3');

// Function which will append event info in container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(position);
    messageElement.classList.add('message');
     // Split the message into parts before and after the colon
     const parts = message.split(':');
     if (parts.length == 2) {
         // If there are two parts, bold the first part (presumed to be the name)
         messageElement.innerHTML = `<strong>${parts[0]}:</strong> ${parts[1]}`;
     } else {
         // If there's only one part, simply display it
         messageElement.innerText = message;
     }

    messageContainer.append(messageElement);
    if(position == 'left')
        audio.play();
    if(message == 'left')
        audio.play();
};

// ask new User for his/her name and let the server know
const userName = prompt("Enter your Name");
socket.emit('new-user-joined', userName);

// if a new user joins, receive his/her name from the server
socket.on('user-joined', userName => {
    append(`${userName} joined the chat`, `left`);
});

// if a user sends a message, receive it.
socket.on('recieve', data => {
    append(`${data.name}: ${data.message}`, 'left');
})

// If a user leaves the chat, append the info to the container
socket.on('left', userName=>{
    append(`${userName} left the chat`, 'right');
});

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right')
    socket.emit(`send`, message)
    messageInput.value = ''
});