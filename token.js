'use strict'
const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';


module.exports = function(max = 25) {
    let token = '';
    for(let i=0; i < max; i++) {
        token += abc[getRandomInt()];
    }
    return token;
}

function getRandomInt() {
    return Math.floor(Math.random() * 52);
}