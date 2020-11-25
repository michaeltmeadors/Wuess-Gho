const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $messages = document.querySelector('#messages');
const $player1DisplayName = document.querySelector('#player1-name');
const $player2DisplayName = document.querySelector('#player2-name');

const displayName = document.querySelector('#displayName').value;
const code = document.querySelector('#code').value;

// Sending a message in the chat emits the message to the other player
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', { displayName, code, message }, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});

// Autoscroll functionality for the chat
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeightt = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeightt;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}


// When a message is recieved, display it
socket.on('message', ({ displayName, message }) => {
    const html = '<div class="message"><p><span class="message__name">' + displayName + '</span></p><p>' + message + '</p></div>';
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

// Fill out the name fields with the player display names
socket.on('sendNames', ({ player1Name, player2Name }) => {
    console.log($player1DisplayName.innerHTML);
    $player1DisplayName.innerHTML = player1Name;
    $player2DisplayName.innerHTML = player2Name;
})

// Go to home page if a game is canceled
socket.on('cancelGame', () => {
    alert('Player 1 has left. The game is canceled.');
    location.href = "/";
});

// Join a game when the page is loaded
socket.emit('join', { displayName, code }, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }
});