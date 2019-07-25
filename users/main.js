const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sqlite3 = require('sqlite3').verbose();
var secured = require('../lib/secured');
const fs = require('fs');
const latex = require('latex');

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

    var nameOfPresenter = req.user.name.givenName + ' ' + req.user.name.familyName;
    var pathToSig = '/public/images/signatureImage-1563481724575.png';

    //now generate the latex template to be emailed 
    var latexTemplate = `\\documentclass[landscape]{article}
        \\usepackage{lingmacros}
        \\usepackage{tree-dvips}
        \\usepackage{graphicx}
        \\begin{document}
        \\centering
        {\\Huge ${req.body.award} \\par}

        \\subsection*{Awarded to}
        ${req.body.name}

        \\subsection*{ Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. }
        \\vfill
        Name of Presenter: ${nameOfPresenter}

        \\includegraphics[width=\\linewidth]{${pathToSig}}

        Date: ${req.body.awardDate}

        \\end{document}`;
    //save the latex string to the template .tex file
    fs.writeFile("./cert.tex", latexTemplate, function (err) {
        if (err) {
            return console.log(err);
        }
        //now create the pdf from the latex .tex file
        const input = fs.createReadStream('cert.tex')
        const output = fs.createWriteStream('output.pdf')
        const pdf = latex(input)
        pdf.pipe(output)
    }); 
});

router.get('/view', secured.User(), (req, res, next) => {
    res.render('userViewAwards');
});

router.get('/update', secured.User(), (req, res, next) => {
    res.render('userUpdate');
});

module.exports = router; 