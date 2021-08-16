function checkNewNick(pseudo, usersList){
    console.log("Hello there, "+pseudo);
    check = 0;
    usersList.forEach(element => {
        if(pseudo == element[0]){
            check = 1;
        }
    });
    return check;
}
module.exports = { checkNewNick };