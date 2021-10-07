const mysql = require("mysql2");
const config = require('./config/config')();

const connect = (query) => {
    const connection = mysql.createConnection({
        host     : config.dbtest ? config.db_test.host : (process.env.DB_HOST || config.db.host),
        user     : config.dbtest ? config.db_test.user : (process.env.DB_USER || config.db.user),
        password : config.dbtest ? config.db_test.password : (process.env.DB_PASSWORD || config.db.password),
        database : config.dbtest ? config.db_test.name : (process.env.DB_NAME || config.db.name)
    });
    connection.connect();
    let result;
    try {
        result = connection.promise().query(query);
    } catch (err) {
        console.error(err)
    }
    connection.end();
    return result;
  }

  const test = 'SHOW TABLES;';

if(connect(test)) {
    console.log('БД подключена')
} else {
    console.log('Ошибка подключения к БД')
}


