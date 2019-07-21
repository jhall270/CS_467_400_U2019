const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sqlite3 = require('sqlite3').verbose();
var secured = require('../lib/secured');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

function restrict(req, res, next) {
    if (req.session.role == 'Users') {
        next();
    } else {
        res.redirect('/');
    }
}

router.get('/', secured(), restrict, (req, res, next) => {
    res.render('userLanding');
});

router.get('/create', secured(), restrict, (req, res, next) => {
    res.render('userCreateAward');
});

router.post('/create', secured(), restrict, (req, res, next) => {
    //Connecting to database
    var db = new sqlite3.Database('./db/empRec.db');
    
    // Create insert statement for database
    let data = [req.body.award, req.body.name, req.body.email, req.body.awardDate, req.body.department, req.user.id];
    let placeholders = '(' + data.map((data) => '?').join(', ') + ')';
    let sql = 'INSERT INTO Award (`TypeOfAward`, `NameOfAwardee`, `EmailAddress`, `DateTimeAward`, `Department`, `UserName`) VALUES ' + placeholders;

    // Insert award into database
    db.run(sql, data, function(err) {
        if (err) {
            return console.error(err.message);
        }
        var context = {};
        context.name = req.body.name;
        context.email = req.body.email;
        res.render('userAwardMade', context);
    });
    db.close();
});

router.get('/view', secured(), restrict, (req, res, next) => {
    res.render('userViewAwards');
});

router.get('/update', secured(), restrict, (req, res, next) => {
    res.render('userUpdate');
});

module.exports = router; 