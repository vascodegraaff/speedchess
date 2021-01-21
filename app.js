var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var WebSocket = require('ws');


var indexRouter = require('./routes/index');
var playRouter = require('./routes/play');

var Game = require('./game/game');

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
var gameID = 0;
var games = {};
var waitingPlayers = [];

this.game = null;


wss.on('connection', ws=> {
let socket = ws;
newConnection(socket,gameID);
});

function newConnection(socket, gameID){
//connects to server
let msg = {
    type: "SERVER_CONNECTED"
}
socket.send(JSON.stringify(msg));
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
    console.log(waitingPlayers)
    gameID++;
    createGame(waitingPlayers[0], waitingPlayers[1], gameID, socket);
    waitingPlayers = waitingPlayers.splice(2);
}else if (waitingPlayers.length ==1){
    console.log(waitingPlayers)
    let msg = {
    type: "WAITING_FOR_OPPONENT"
    }
    waitingPlayers[0].send(JSON.stringify(msg));
}
}
function createGame(player1, player2, gameID){
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
