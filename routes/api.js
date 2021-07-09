'use strict'

const express = require("express");
const ApiController = require('./../controllers/ApiController');
const apiRouter = express.Router();

let api = new ApiController;



let isUser = function(request, response, next) {
    console.log('API-start');
    console.log(request.session?.user)
    if(!request.session?.user) {
        console.log(request.session?.user)
        //response.redirect('/login');
    } else next();
}

apiRouter.use(isUser);
apiRouter.use("/game/start", api.gameStart.bind(api));

module.exports = apiRouter;