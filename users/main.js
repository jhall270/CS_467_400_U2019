const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sqlite3 = require('sqlite3').verbose();
var secured = require('../lib/secured');
const fs = require('fs');
const latex = require('latex');
var latexPrinter = require('../lib/latex-pdf-printer.js');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', secured.User(), (req, res, next) => {
    res.render('userLanding');
});

router.get('/create', secured.User(), (req, res, next) => {
    res.render('userCreateAward');
});

router.post('/create', secured.User(), (req, res, next) => {
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
        console.log(this.lastID);
        context.name = req.body.name;
        context.email = req.body.email;
        res.render('userAwardMade', context);
    });
    db.close();

    latexPrinter.GeneratePdf(req.user.name, req.body);
    latexPrinter.EmailPdf(req.body.email);
});

router.get('/view', secured.User(), (req, res, next) => {
    res.render('userViewAwards');
});

router.get('/update', secured.User(), (req, res, next) => {
    res.render('userUpdate');
});

module.exports = router; 