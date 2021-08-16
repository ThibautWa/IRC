const app = require("express");
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
var fs = require('fs');
var connectCounter = 0;
var usersList = [];
var channelsList = [['server', 'general', []]];
const User = require("./User.js");
const checkNewNick = require("./checkNewNick.js");

console.log("server ON")

io.on('connection', function(){ connectCounter++; console.log("user login");});

io.on("connection", (socket) => {
    console.log("there is "+connectCounter+" clients logged");

    socket.on("msg client", function(msg, name){
        room = socket.rooms;
        let increment = 0;
        room.forEach(function(elem){
            console.log(elem);
            // if(increment != 0){
                msgRoom = elem
            // }
            increment++;
        })
        console.log(msgRoom+" - "+name+"> "+ msg)
        // io.emit('msg server', msg, name, msgRoom);
        io.to(getCurrentRoom()).emit('msg room', msg, name, msgRoom);
    })

    socket.on("newUser", function(pseudo){
        check = checkNewNick.checkNewNick(pseudo, usersList);
        if(check == 0){
            io.emit('newUser server', pseudo)
            socket.join("general");
            var newUser = [pseudo, socket];
            usersList.push(newUser);
        }else{
            
        }
    });

    socket.on("changeName", function(notice){
        io.emit("changeName server", notice);
    });

    socket.on("channelJoin", function(room){
        socket.leave(getCurrentRoom());
        socket.join(room)
    });

    socket.on("channelLeave", function(room){
        socket.leave(room)
        socket.to(room).emit('user left', socket.id);
    });

    socket.on('disconnect', function() {
        connectCounter--;
        console.log("user "+socket.id+" logout");
    });

    socket.on("smiley", function(name){
        smiley = name + " sourit bêtement... :D";
        console.log(smiley);
        io.emit("smiley", smiley);
    });

    socket.on("balkany", function(name){
        fs.readFile('./resources/balkany.txt', 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(data)
        io.emit("balkany", data);
        })
    });

    socket.on("lulz", function(name){
        fs.readFile('./resources/lulz.txt', 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(data)
        io.emit("lulz", data);
        })
    });

    socket.on("thom", function(name){
        fs.readFile('./resources/thom.txt', 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(data)
        io.emit("thom", data);
        })
    });

    socket.on("room", function(name){
        console.log(socket.rooms);
        // console.log(io.sockets.adapter.rooms.get(1));
        room = socket.rooms;
        let increment = 0;
        room.forEach(function(elem){
            console.log(elem);
            if(increment != 0){
                io.emit("room", elem);
            }
            increment++;
        }
            );
        console.log(room);
    });

    socket.on("user", function(name){
        User.user(name, usersList, io);
    });
    function getCurrentRoom()
    {
        var currentRoom;
        var increment = 0;
        var room = socket.rooms;
        room.forEach(function(elem){
            console.log(elem);
            if(increment != 0){
                currentRoom = elem;
            }
            increment++;
        });
        return currentRoom;
    }

    function leaveRoom(){

    }

    //DEBUG
    socket.on("dbg", function(arg){
        if (arg == "ul")
        {
            console.log("userList = ");
            console.log(usersList);
            console.log("socket = ");
            console.log(io.sockets.adapter.rooms);
            console.log("la room actuelle "+ getCurrentRoom());
        }
        else if (arg == "sendch")
        {
            io.to('debug').emit('debug message', 'IT WORK\'S');
        }
        else if (arg == "socket")
        {
            console.log(socket);
        }
    });
});
httpServer.listen(4242);