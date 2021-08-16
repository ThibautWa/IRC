var readline = require('readline'),
io = require('socket.io-client')('http://localhost:4242'),
color = require("ansi-color").set;

var nick;
var channel = 'general';
var socket = io.connect('localhost', { port: 3636 });
var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt("")

io.on("debug message", function(msg){
    console.log(msg);
})

io.on("msg server", function(msg, name, msgRoom){
    if (name != nick)
        console.log("["+msgRoom+"] "+name+"> "+ msg)
    else
        console.log("["+msgRoom+"] me> "+ msg)
});

io.on("msg room", function(msg, name, msgRoom){
    if (name != nick)
        console.log("["+msgRoom+"] "+name+"> "+ msg)
    else
        console.log("["+msgRoom+"] me> "+ msg)
});

io.on("roomMessage", function(message){
    console.log(message);
});

io.on('debug')

io.on("changeName server", function(notice){
    console.log(notice);
})

io.on("channelCreate server", function(response, message){
    console.log(message);
});

rl.question("Please enter a nickname: ", function(name) {
    nick = name;
    socket.emit('newUser', nick);
});

rl.on('line', function (line) {
    if (line[0] == "/" && line.length > 1) {
        if (line.substr(1, 3) == "msg")
        {
            var receiver = line.substr(5, (line.indexOf(" ", 5) - 5));
            var privateMessage = line.substr(receiver.length + 6, line.length);
            socket.emit("message private", receiver, privateMessage)
        }
        var cmd = line.match(/[a-z]+\b/)[0];
        var arg = line.substr(cmd.length+2, line.length);
        chat_command(cmd, arg);
    } else {
        socket.emit('msg client', line, nick);
    }
});

io.on("smiley", function(smiley){
    console.log(smiley);
})

io.on("balkany", function(balkany){
    console.log(balkany);
})

io.on("lulz", function(lulz){
    console.log(lulz);
})

io.on("thom", function(thom){
    console.log(thom);
})

io.on("room", function(room){
    console.log(room);
})

io.on("user", function(user){
    console.log(user);
})

function chat_command(cmd, arg) {
    switch (cmd) {
        case 'nick':
            var notice = nick + " changed their name to " + arg;
            nick = arg; 
            socket.emit("changeName", notice);
            break;
        case 'dbg':
            socket.emit("dbg", arg);
            break;
        case 'balkany':
            socket.emit("balkany", nick);
        case 'join':
            socket.emit("channelJoin", arg);
            break;
        case 'leave':
            socket.emit("channelLeave", arg);
            break;
        case 'clientdbg':
            debug(arg);
            break;
        case 'smiley':
            socket.emit("smiley", nick);
            break;
        case 'balkany':
            socket.emit("balkany", nick);
            break;
        case 'lulz':
            socket.emit("lulz", nick);
            break;
        case 'thom':
        socket.emit("thom", nick);
            break;
        case "room":
            socket.emit("room", nick);
            break;
        case "clear":
            console.clear();
            break;
        case "user":
            socket.emit("user", nick);
            break;
        default:
            console.log(cmd+" "+arg+" is not a valid command.");
    }
}

function debug(arg)
{
    if (arg == "socket")
    {
        console.log(socket)
    }
}