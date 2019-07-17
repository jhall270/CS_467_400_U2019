const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res, next) => {
    res.render('userLanding');
});

router.get('/create', (req, res, next) => {
    res.render('userCreateAward');
});

router.post('/create', (req, res, next) => {
    //Connecting to database
    var db = new sqlite3.Database('./db/empRec.db');
    
    // Create insert statement for database
    let data = [req.body.award, req.body.name, req.body.email, req.body.awardDate, req.body.department, 'user1@user.com'];
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

router.get('/view', (req, res, next) => {
    res.render('userViewAwards');
});

router.get('/update', (req, res, next) => {
    res.render('userUpdate');
});

module.exports = router; 