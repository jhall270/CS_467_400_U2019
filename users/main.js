const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const router = express.Router();
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    res.render('userLanding');
});

module.exports = router; 