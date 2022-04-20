// Init

const divUsers = document.querySelector('.div_users');
const divUser = document.querySelector('.div_user');
const divRooms = document.querySelector('.div_rooms');
const divChat = document.querySelector('.div_chat');
const host = ('http://127.0.0.1:8000/api/');

let userID;
let roomID = '';

// Sockets
let sn =  'sn' + Math.floor(Math.random() * 10000 + 1);
const socket = new WebSocket('ws://127.0.0.1:8000/ws/instructions/' + sn);
const chatSocket = new WebSocket('ws://127.0.0.1:8000/ws/chat/' + sn);
socket.onclose = async (event) => {
    window.alert('Unable to establish connection with Django server.');    
};

socket.onerror = (evt) => document.querySelector('#message').innerText = evt[key];
chatSocket.onerror = (evt) => document.querySelector('#message').innerText = evt[key];

socket.onopen = () => load_users();
function load_users() {
    socket.send(JSON.stringify({'load': 'users'}));
};

socket.onmessage = function(event) {
    let data = JSON.parse(event.data);
    if ('message' in data) { document.querySelector('#message').innerText = data.message };
    if ('UserList' in data) { if (userID) { viewUserCard(userID) } else { printUsers(data) } };
    if ('RoomList' in data) { if (userID) { printRooms(data) } };
    if ('MessageList' in data) { if (userID) { printChat(data) } };
};

// Print User List
function printUsers(data) {
    delete data.UserList;
    let list = '';
    for (let key in data) {
        const newString = `<tr><td>${data[key]}</td>
        <td><button onclick="userLogged(${key})">select</button></td>
        <td><button onclick="deleteUser(${key})">delete</button></td>`;
        list = list + newString;
    };
    divUsers.innerHTML = `<table> ${list}</table><br>`;
};

// Create New User
document.querySelector('.btn_create_user').addEventListener('click', () => {
    let name = document.getElementById("input_user");
    if (name.value !== "") {
        socket.send(JSON.stringify({'create_user': name.value}));
        name.value = "";
    };
});

// Delete User
function deleteUser(id) {
    socket.send(JSON.stringify({'delete_user': id}))
};

function userLogged(id) {
    if (userID == undefined) document.querySelector('.div_main').removeChild(document.querySelector('.div_start'));
    userID = id;
    viewUserCard(id);
};

function viewUserCard(userId) {
    fetch(host + 'users/' + userId +'/')
        .catch()
        .then(response => response.json())
        .then(result => printUserCard(result))
    socket.send(JSON.stringify({'load': 'rooms'}));
};

function printUserCard(item) {
    if (item.room == null) {
        room = "not selected" }
    else {
        let idRoom = item.room[item.room.length-2];
        room = listrooms[idRoom];
    };

    divUser.innerHTML = `
    <div class="div">
        <p>ID: ${item.id}</p>
        <p>Name: ${item.name} <button onclick="changeUserName(${item.id})">Change</button></p>
        <p>Room: ${room}</p>
        <h4 class="message" id="message"></h4>
    </div>
    `;
};

function changeUserName(userId) {
    let name = prompt('Enter new name:');
    socket.send(JSON.stringify({'order': 'changeUserName', 'id': userId, 'name': name }));
};

function printRooms(data) {
    delete data.RoomList;
    let list = '';
    for (let key in data) {
        const newString = `<tr><td><b>${data[key]}</b></td>
        <td><button onclick="deleteRoom(${key})">Delete</button></td>
        <td><button onclick="editRoom(${key})">Change</button></td>
        <td><button onclick="selectRoom(${key})">Connect</button></td></tr>`;
        list = list + newString;
    };
    list = '<table>' + list + '</table><br>'
    list = list + `<input type="text" id="input_room" name="name_new_room" size="22" placeholder="Enter new room name:"><br>`
    list = list + `<button class="btn btn_new_room">Creare room</button>`
    divRooms.innerHTML = list;

    document.querySelector('.btn_new_room').addEventListener('click', () => {
        let name = document.getElementById("input_room");
        if (name.value !== "") {
            socket.send(JSON.stringify({'create_room': name.value}));
            console.log({'create_room': name.value});
            name.value = "";
        };
    });
};

function deleteRoom(id) {
    socket.send(JSON.stringify({'delete_room': id}));
}

function editRoom(id) {
    let name = prompt('Enter new room name:');
    socket.send(JSON.stringify({'order': 'changeRoomName', 'id': id, 'name': name }));
};

function printChat(data) {
    divChat.innerHTML = `<h3 style="text-align: center;">Room: ${data['MessageList']}</h3>
    <textarea class="textarea" name="textarea"></textarea><br>
    <input class="message" type="text" id="input_message" name="input_message" size="22" placeholder="Enter message:"><br>
    <button class="btn btn_message">Send</button>`;
    delete data.MessageList;
    let textarea = document.querySelector('.textarea');

    for (let messageElement in data) {
        for (let key in data[messageElement]) {
            let newString = `${key}: ${data[messageElement][key]}\n`;
            textarea.value += newString;
        };
    };

    document.querySelector('.btn_message').addEventListener('click', () => {
        let message = document.getElementById("input_message");
        if (message.value !== "") {
            chatSocket.send(JSON.stringify({'usersendcommandroom': 'message', 'room_id': roomID, 'userid': userID, 'message': message.value}));
            console.log({'usersendcommandroom': 'message', 'room_id': roomID, 'user': userID, 'message': message.value});
            message.value = "";
        };
    });

    chatSocket.onmessage = function(event) {
        let data = JSON.parse(event.data);
        console.log(data);
        textarea.value += `${data['name']}: ${data['message']}\n`;
    };
};

    function selectRoom(id) {
        socket.send(JSON.stringify({'load': 'messageList', 'newroom_id': id}));
        console.log({'load': 'messageList', 'newroom_id': id});
        chatSocket.send(JSON.stringify({'usersendcommandroom': 'roomselect', 'newroom_id': id, 'oldroom_id': roomID}));
        roomID = id;
    };
