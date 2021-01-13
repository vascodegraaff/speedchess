var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
res.render('chessboard', {title:'play'});
});

module.exports = router;
