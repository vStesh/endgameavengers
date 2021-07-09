"use strict"

const SiteController = require('./SiteController');
const config = require('./../config/config')();
// const User = require('./../models/user');
const Game = require('./../models/game');
const Rating = require('./../models/rating');

class HttpController extends SiteController {
    //title = config.title;

    constructor() {
        super();
    }

    async index(request, response) {
        // console.log(request);
        if (request.url !== '/') {
            response.render('404', this._getProperties({ title: '404 Page not found!' }));
        } else {
            if (request.session.user) {
                // let user = new User();
                let game = new Game();
                // if(await game.getOne({id: request.session.user.id, status: 'new'})) {
                //
                // }
                console.log('------> Cookie');
                console.log(request.session.cookie);
                console.log(request.session.user);
                response.render(config.tmpl.game, this._getProperties({user: request.session.user, add: {start: 1, class_body: 'game'}}));
            } else {
                console.log(this._getProperties({add: {body_class: "index"}}));
                response.render('index', this._getProperties({add: {class_body: "index"}, user: 0}));
            }
        }
    }

    registration(req, res) {
        res.render('registration', this._getProperties({title: 'Регистрация нового игрока', menu: {login: 1, register: 0}}));
    }

    async login(req, res) {
        if (req.session.user) {
            res.redirect('/');
        } else {
            if(req.query?.joinGame) {
                res.cookie('joinGame', req.query.joinGame);
            }
            res.render('login', this._getProperties({title: 'Login', menu: {login: 0, register: 1}, query: req.query}));
        }
    }

    registerDone(req, res) {
        res.render('registerDone');
    }

    startGame(req, res) {
        res.render('startGame');
    }

    reminder(req, res) {
        res.render('reminder');
    }

    rules(req, res) {
        res.render('rules')
    }
    creators(request, response){
        response.render('creators', this._getProperties({title: 'Creators'}));
    }

    exit(req, res) {
        res.render('exit')
    }

    joingame(request, response) {
        console.log(request.body.token);

    }
    menu(req, res) {
        res.render('menu')
    }
    async statistic(req, res){
        let rating = new Rating();
        let statistic = await rating.getTable();
        console.log('-----------> Current user statistic');
        console.log(req.session.user?.id);
        console.log(statistic);
        statistic = statistic.map((item, key) => {
            item.num = key +1;
            if(item.user_id === req.session?.user?.id) {
                item.my = 1;
            }

            return item;
        });

        res.render('statistic', {stat: statistic});
    }

    // _getProperties(param = {}) {
    //     let result = {
    //         title: config.title + ' - ' + (param.title ? param.title : ''),
    //     }
    //     if(param.user) {
    //         result.user = param.user;
    //         if(param.user.status === 1) {
    //             result.user.admin = true;
    //         }
    //     }
    //     return Object.assign(param.add ? param.add : {}, result) ;
    // }
}

module.exports = HttpController;