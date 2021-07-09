'use strict'

const express = require("express");
const GameController = require('./../controllers/GameController');
const gameRouter = express.Router();

let game = new GameController;



let isUser = function(request, response, next) {

    console.log(request.session?.user)
    if(!request.session?.user) {
        console.log(request.session?.user);
        console.log(request);

        response.redirect('/login?joinGame=' + request.query.token);
    } else next();
}

gameRouter.use(isUser);

gameRouter.get("/join", game.joingame.bind(game));

module.exports = gameRouter;