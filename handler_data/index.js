var express = require('express');
var router = express.Router();
var user = require('./users');
var game = require('./games');


// middleware specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// define the home page route
router.get('/', function(req, res) {
    res.send('Birds home page');
});

// define the about route
router.get('/about', function(req, res) {
    res.send('About birds');
});

router.get('/user', function(req, res) {
    user.run(req, res);
});
router.get('/game', function(req, res) {
    game.run(req, res);
});

module.exports = router;