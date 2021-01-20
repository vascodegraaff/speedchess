var express = require('express');
var router = express.Router();
var fs = require('fs');

var json;
fs.readFile('public/data/data.JSON', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    console.log('File data:', jsonString)
    var gamesPlayed = JSON.parse(jsonString).gamesPlayed;
    var whiteWins = JSON.parse(jsonString).whiteWins;
    var blackWins = JSON.parse(jsonString).blackWins;
    var draws = JSON.parse(jsonString).draws;
    console.log(gamesPlayed);
    json = JSON.parse(jsonString);
})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('splash', json);
});

module.exports = router;
