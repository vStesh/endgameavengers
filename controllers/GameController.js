"use strict"

const SiteController = require('./SiteController');
const config = require('./../config/config')();
const User = require('./../models/user');
const Cards = require('./../models/card');
const Game = require('./../models/game');


class GameController extends SiteController {

    constructor() {
        super();
    }

    async joingame(request, response) {
        console.log(request.query);
        let [id, token] = request.query.token.split(':');
        console.log("id, token");
        console.log(id, token);
        // response.cookie('joinGame', request.query.token);
        response.render(config.tmpl.game, this._getProperties({user: request.session.user, add: {join: 1, game: {id: id, token: token}, class_body: 'game'}}));
    }


    // async _init() {
    //     let cards = this._shuffleDeck(await (new Cards()).getList());
    //     console.log(cards);
    //     return {
    //         deck: cards.slice(0, -6),
    //         hand1: cards.slice(-3),
    //         hand2: cards.slice(-6, -3)
    //     };
    // }
    // _shuffleDeck(cards) {
    //     let j, temp;
    //     for (let i = cards.length - 1; i > 0; i--) {
    //         j = Math.floor(Math.random() * (i + 1));
    //         temp = cards[j];
    //         cards[j] = cards[i];
    //         cards[i] = temp;
    //     }
    //     return cards;
    // }
    _getCard(count = 1) {

        return
    }
}

module.exports = GameController;