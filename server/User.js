function user(name, usersList, io){
    console.log("hello "+name);
    // console.log(usersList);
    // console.log(Object.keys(userList));
    usersList.forEach(element => {
        console.log(element[0]);
        io.emit("user", element[0]);
    });
    
}
module.exports = { user };