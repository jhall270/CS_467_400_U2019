var mysql = require('mysql');
var dotenv = require('dotenv');

dotenv.config();

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'oniddb.cws.oregonstate.edu',
    user            : process.env.MYSQL_USERNAME,
    password        : process.env.MYSQL_PASSWORD,
    database        : process.env.MYSQL_DATABASE
});

module.exports.pool = pool;