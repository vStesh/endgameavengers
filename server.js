'use strict'

const express = require('express');
const app = express();
const session = require('express-session');
const apiRouter = require('./routes/api');
const httpRouter = require('./routes/http');
const adminRouter = require('./routes/admin');
const gameRouter = require('./routes/game');
const config = require('./config/config')();
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const WsController = require('./controllers/WsController');

app.engine("hbs", expressHbs(
    {
        layoutsDir: "views/layouts",
        defaultLayout: "layout",
        extname: "hbs"
    }
))
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
console.log(config);

app.use(session({secret: 'jfhHJ76I8HhfjdkUt5DFfJK(8_*%yb7', saveUninitialized: true, resave: true, user: {}}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', express.static(__dirname + '/public'));

app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use('/game', gameRouter);
app.use('', httpRouter);

server.listen(3000, "localhost",function(){
    console.log("Open http://127.0.0.1:3000/ \n Click Ctrl+C for stop server");
});


const wsgame = io.of('/game');


wsgame.on('connection', (socket) => {
    let newGame = {};
    let joinGame = {};
    socket.on('startgame', async (message) => {
            let ws = new WsController(socket);
            newGame = await ws.newGame(message);
        if(newGame.status) {
            let room = newGame.game.id + ':' + newGame.game.token;
            socket.join(room + '1');
            wsgame.to(room + '1').emit('startgame', newGame);
        } else {
            wsgame.emit('startgame', {
                status: 0,
                error: "Возникла ошибка. Невозможно запустить игру!"
            });
        }

    });
    socket.on('joinGame', async (message) => {
        let ws = new WsController(socket);
        joinGame = await ws.joinGame(message);
        if(joinGame.status) {
            let room = joinGame.game.id + ':' + joinGame.game.token;
            socket.join(room + '2');
            wsgame.to(room + '2').emit('joinGame', {status: joinGame.status, gameToken: joinGame.game.id + '-' + joinGame.game.token});
            wsgame.to(room + '1').emit('joinGame', {status: joinGame.status, gameToken: joinGame.game.id + '-' + joinGame.game.token});
            console.log('Join second player');
        } else {
            wsgame.emit('joinGame', {
                status: 0,
                error: "Возникла ошибка. Невозможно подключиться к игре!"
            });
        }

    });
    socket.on('getStatus', async (message) => {
        console.log(socket.id);
        console.log(message);
        let cookie = {}
        message.split('; ').forEach(item => {
            cookie[item.split('=')[0]] = item.split('=')[1];
        });
        let [id, token] = cookie.token.split('-');
        if(cookie.gameToken) {
            let [gameId, gameToken] = cookie.gameToken.split('-');
           let currentGame = await (new WsController()).sendState(id, token, {id: gameId, token: gameToken});
            if(currentGame.status) {
                socket.join(currentGame.room + id);
                if(currentGame.game.user1_id === +id) {
                    wsgame.to(currentGame.room + id).emit('getStatus', {status: currentGame.status, game: currentGame.user1, room: currentGame.room + id});
                } else {
                    wsgame.to(currentGame.room + id).emit('getStatus', {status: currentGame.status, game: currentGame.user2, room: currentGame.room + id});
                }

                //wsgame.to(currentGame.room + '2').emit('getStatus', {status: currentGame.status, game: currentGame.user2});
            } else {
                // wsgame.to(currentGame.room + '1').emit('getStatus', {status: currentGame.status, game: currentGame.user1});
                // wsgame.to(currentGame.room + '2').emit('getStatus', {status: currentGame.status, game: currentGame.user2});
            }
            console.log(cookie);

            console.log('getStatus');
            //console.log(id, token);
        }

    });
    socket.on('firstTurn', async (message) => {
        let room = message.game.id + ':' + message.game.token;
        console.log(room);
        console.log(room + message.game.iam.id);
        console.log(room + message.game.enemy.id);
        wsgame.to(room + message.game.iam.id).emit('firstTurn', {turn: (message.turn === message.game.iam.id) ? 1 : 0});
        wsgame.to(room + message.game.enemy.id).emit('firstTurn', {turn: (message.turn === message.game.enemy.id) ? 1 : 0});
    });
    socket.on('turn', async (message) => {
        let game = message;
        let ws = new WsController();
        let currentGame = await ws.turn(game);

        // console.log('currentGame');
        // console.log(currentGame);

        let room = game.id + ':' + game.token;
        wsgame.to(room + currentGame.game.user1_id).emit('turn', {
            status: currentGame.status,
            game: currentGame.user1,
            room: room + currentGame.game.user1_id,
            myTurn: currentGame.user1.myTurn});
        wsgame.to(room + currentGame.game.user2_id).emit('turn', {
            status: currentGame.status,
            game: currentGame.user2,
            room: room + currentGame.game.user2_id,
            myTurn: currentGame.user2.myTurn});
    });
    socket.on('stopGame', async (message) => {


    });
});