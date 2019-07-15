const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
var sqlite3 = require('sqlite3').verbose();

const app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('PORT', 8800);

app.use(express.static('public'));

//Connecting to database
var db = new sqlite3.Database('./database/empRec.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the empRec database.');
});

//Testing the database connection

var testSql = "Select * from user";

db.all(testSql, [], function(err, rows){
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});

/*

// Point to user location
app.use('/users', require('./users/main.js'));

// Point to admin location
app.use('/admin', require('./admin/main.js'));

*/

// Load login page
app.get('/', (req, res) => {
    res.render('login');
});

app.use((req, res) => {
    res.status(400).send('Not Found');
});

app.use((err, req, res) => {
    console.log(err);
    res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
    const server = app.listen(app.get('PORT'), () => {
        const port = server.address().port;
        console.log(`App listening on port ${port}`);
    });
}

module.exports = app;