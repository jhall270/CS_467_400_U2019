var mysql = require('mysql');
var dotenv = require('dotenv');

dotenv.config();

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'https://secure.oregonstate.edu/oniddb/', //This may need to be changed
    user            : process.env.USERNAME,
    password        : process.env.PASSWORD,
    database        : process.env.DATABASE
});

module.exports.pool = pool;