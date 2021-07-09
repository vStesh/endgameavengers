'use strict'

const Model = require('./model');



class Rating extends Model {
    constructor() {  
        super('rating');
    }

    async getTable() {
        let stat = [];
        let query = `SELECT 
                    r.user_id, 
                    u.login, 
                    r.score, 
                    SUM(r.score) AS sum, 
                    COUNT(r.user_id) AS count
                FROM rating AS r 
                    JOIN users AS u ON u.id=r.user_id 
                GROUP BY r.user_id
                ORDER BY sum DESC, count ASC;`;

        let [rows,fields] = await this._connect(query);

        return rows;
    }

}

module.exports = Rating;