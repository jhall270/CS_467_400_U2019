const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var mysql = require('../dbaccess.js');

var dotenv = require('dotenv');

dotenv.config();

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
    var context = {};
    var userName = "user1@user.com";
    mysql.pool.query("INSERT INTO Award (`TypeOfAward`, `NameOfAwardee`, `EmailAddress`, `DateTimeAward`, `Department`, `UserName`) VALUES (?, ?, ?, ?, ?, ?)", [req.body.award, req.body.name, req.body.email, req.body.awardDate, req.body.department, userName], function(err, result) {
        if(err) {
            console.log(err);
            next(err);
            return;
        }
        context.awardee = req.body.name;
        context.email= req.body.email;
        console.log(context);
        // Must add award creation function call at a later time
        res.render('userAwardMade', context);
    });
});

router.get('/view', (req, res, next) => {
    res.render('userViewAwards');
});

router.get('/update', (req, res, next) => {
    res.render('userUpdate');
});

module.exports = router; 