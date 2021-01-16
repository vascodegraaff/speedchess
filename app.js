var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var WebSocket = require('ws');


var indexRouter = require('./routes/index');
var playRouter = require('./routes/play');

var Game = require('./game/game');
const { GAME_STATE } = require('./game/messages');

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

this.game = null;

var gameID = 0;

wss.on('connection', ws=> {
  let socket = ws;
  connectionID++;
  socket.id = connectionID;
  let playerType = waitingPlayers.length%2 == 1? 'white' : 'black';

  newConnection(socket,gameID);

  socket.send(playerType == 'white' ? "color: white": "color: black");
  
  console.log("client connected");
  // ws.on('message', message=>{
  //   var parsed = JSON.parse(message);
  //   console.log(parsed);
  //   if(parsed.type=="CLIENT_CONNECTED"){
  //     console.log(parsed.type);
  //   }
    
  //     //let parseMessage = JSON.parse(message.data);
  //     // console.log(parseMessage);
  //     // if(parseMessage.type == 'MOVE'){
  //     //   console.log(JSON.parse(parseMessage.data))
  //       // this.chess.move(parseMessage.data);
  //     // }

  // });
});

function newConnection(socket, gameID){
  //connects to server
  socket.send('Server connected to client');
  //pushed player to the array of players waiting for a game
  waitingPlayers.push(socket);

  socket.onclose = () => {
    //removes connection when socket gets closed
    waitingPlayers = waitingPlayers.filter(function(ele){
      return ele != socket;
    });
  };
  //when there are 2 or more players waiting for a game, we the two players and initialize a game.
  if(waitingPlayers.length >= 2) {
    gameID++;
    createGame(waitingPlayers[0], waitingPlayers[1], gameID, socket);
    socket.send(`gameID: ${gameID}`);
    waitingPlayers = waitingPlayers.splice(2);
  }
}
function createGame(player1, player2, gameID){
  player1.send(`player 1 connected to game: ${gameID} as white`);
  player2.send(`player 2 connected to game: ${gameID} as black`);
  this.game = new Game(player1, player2, gameID);
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
