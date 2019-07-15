const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');	//setting up an in-memory database

const app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('PORT', 8800);

app.use(express.static('public'));

//Setting up database



// Point to user location
app.use('/users', require('./users/main.js'));

// Point to admin location
app.use('/admin', require('./admin/main.js'));

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