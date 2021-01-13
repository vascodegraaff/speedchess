var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var http = require('http');
var websocket = require('ws');
var port = '3000';


var indexRouter = require('./routes/index');
var playRouter = require('./routes/play');

var Game = require('./game/game')

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/play', playRouter);

//websocket code


var server = http.createServer(app);
const wss = new websocket.Server({ server });

var activeGames = {};

setInterval(function() {
  for( let i in activeGames){
    if(Object.prototype.hasOwnProperty.call(activeGames,i)){
      let gameObj = activeGames[i];

      if(gameObj.finalStatus !=null){
        delete activeGames[i];
      }
    }
  }
});

var currentGame = new Game();
var connectionID = 0;

wss.on("connection", function connection(ws){
  let connection = ws;
  connection.id = connectionID++;
  let playerType = currentGame.addPlayer(connection);
  activeGames[connection.id] = currentGame;

  console.log("player %s is now in game: %s as %s", connection.id, currentGame.id, playerType);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
