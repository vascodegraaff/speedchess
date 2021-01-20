var express = require('express');
var router = express.Router();
var fs = require('fs');

var json;
fs.readFile('public/data/data.JSON', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    json = JSON.parse(jsonString);
})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('splash', json);
});

module.exports = router;
