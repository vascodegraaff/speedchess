var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var WebSocket = require('ws');


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


const wss = new WebSocket.Server({ port: 8080})
var connectionID = 0;
var gameID = 0;
var games = {};
var waitingPlayers = [];

var gameID = 0;

wss.on('connection', ws=> {
  let connection = ws;
  connectionID++;
  connection.id = connectionID;
  let playerType = waitingPlayers.length%2 == 1? 'white' : 'black';

  newConnection(connection);

  connection.send(playerType == 'white' ? "you are white": "you are black")
  
  ws.on('message', message=>{
    console.log(`Message: ${message}`);
  });
  ws.send("Hello from server");
});

function newConnection(socket, gameID){
  waitingPlayers.push(socket);

  socket.onclose = () => {
    //removes connection when socket gets closed
    waitingPlayers = waitingPlayers.filter(function(ele){
      return ele != socket;
    });
  };
  if(waitingPlayers.length >= 2) {
    gameID++;
    createGame(waitingPlayers[0], waitingPlayers[1], gameID);
    waitingPlayers = waitingPlayers.splice(2);
  }
}
function createGame(player1, player2, gameID){
  var game = new Game(player1, player2, gameID);
  console.log("game created");
}

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
