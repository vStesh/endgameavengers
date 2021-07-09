'use strict'

const express = require("express");
const HttpController = require('./../controllers/HttpController');
const UserController = require('./../controllers/UserController');
const httpRouter = express.Router();

let http = new HttpController;
let user = new UserController;



httpRouter.post("/user/registration", user.register.bind(user));
httpRouter.post('/user/reminder', user.reminder.bind(user));
httpRouter.post('/user/login', user.login.bind(user));
httpRouter.post('/user/logout', user.logout.bind(user));
httpRouter.use('/user/home', user.home.bind(user));



httpRouter.use("/registration", http.registration.bind(http));
httpRouter.use("/login", http.login.bind(http));
httpRouter.use("/reminder", http.reminder.bind(http));
httpRouter.use("/registerDone", http.registerDone.bind(http));
httpRouter.use("/startGame", http.startGame.bind(http));
httpRouter.use("/reminder", http.reminder.bind(http));
httpRouter.use("/rules", http.rules.bind(http));
httpRouter.use("/exit", http.exit.bind(http));
httpRouter.use("/creators", http.creators.bind(http));
httpRouter.use("/menu", http.menu.bind(http));
httpRouter.use("/statistic", http.statistic.bind(http));
httpRouter.use("/", http.index.bind(http));

module.exports = httpRouter;