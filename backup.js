// const { io } = require('socket.io-client');

var readline = require('readline'),
socketio = require('socket.io-client')('http://localhost:4242'),
color = require("ansi-color").set;

var nick;
var socket = socketio.connect('localhost', { port: 3636 });
var rl = readline.createInterface(process.stdin, process.stdout);

socketio.on("chat server", function(msg, name){
    if (name != nick)
        console.log(name+"> "+ msg)
    else
        console.log("me> "+ msg)
});

socketio.on("newUser server", function(pseudo){
    console.log("server> "+pseudo+" has joined the channel !");
});

socketio.on("changeName server", function(notice){
    console.log(notice);
})

socketio.on("smiley", function(smiley){
    console.log(smiley);
})

rl.question("Please enter a nickname: ", function(name) {
    if (name.length > 0 && name != "me"){
        nick = name;
        socket.emit('newUser', nick);
        rl.prompt(true);
    }else{
        nick = "anonymous";
        socket.emit('newUser', nick);
        rl.prompt(true);
    }
});


rl.on('line', function (line) {
    if (line[0] == "/" && line.length > 1) {
        var cmd = line.match(/[a-z]+\b/)[0];
        var arg = line.substr(cmd.length+2, line.length);
        chat_command(cmd, arg);
    } else {
        socket.emit('chat client', line, nick);
        rl.prompt(true);
    }
});

function chat_command(cmd, arg) {
    switch (cmd) {
        case 'nick':
            if (arg.length > 0 || arg == "me"){
                var notice = nick + " changed their name to " + arg;
                nick = arg; 
                socket.emit("changeName", notice);
            }else{
                error = "New username is invalid";
                socket.emit('changeName', error);
            }
            break;
        case 'smiley':
            socket.emit("smiley", nick);
            break;
        default:
            console.log("That is not a valid command.");
    }
}