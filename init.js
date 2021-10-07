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

const start = async () => {

    let testRes = await connect(test);
    if(testRes) {
        console.log('БД подключена');
        console.log()
    } else {
        console.log('Ошибка подключения к БД')
    }

    const query1 = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        photo VARCHAR(50) NOT NULL,
        login VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        status ENUM ('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    `;

    testRes = await connect(query1);

    const query2 = 'SELECT * FROM users;';

    testRes = await connect(query2);

}

start();



