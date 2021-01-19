const { Chess } = require('./chess.js');
const fs = require('fs');


class Game {
    constructor(socket1, socket2, gameID) {
        this.socket1 = socket1;
        this.socket2 = socket2;
        this.socket2.color = "WHITE";
        this.socket1.color = "BLACK";
        this.currentColor = "WHITE";
        this.gameStart = false;
        this.chess = new Chess();
        this.whiteTime = 180;
        this.blackTime = 180;
        this.timeElapsed = 0;
        this.updateTime = this.updateTime.bind(this)
        this.interval = setInterval(this.updateTime, 1000);
        //testing with different game states
        //this.chess = new Chess("rnb1kbnr/pppP1ppp/5q2/8/8/8/PPP1PPPP/RNBQKBNR b KQkq - 0 4");
        //checkmate
        //this.chess = new Chess("rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3")
        this.moveCounter = 0;
        this.gameID = gameID;
        
        //this binds the function to this.onMessage and when a message is recieved, the function gets called
        this.onMessageWhite = this.onMessageWhite.bind(this);
        this.onMessageBlack = this.onMessageBlack.bind(this);
    
        this.socket2.on('message', this.onMessageWhite)
        this.socket1.on('message', this.onMessageBlack)

        this.startGame();
    }

    startGame(){
        let msg1 = {
            type: "CLIENT_DATA",
            color: "BLACK",
            game: this.gameID
        }
        let msg2 = {
            type: "CLIENT_DATA",
            color: "WHITE",
            game: this.gameID
        }
        this.socket1.send(JSON.stringify(msg1));
        this.socket2.send(JSON.stringify(msg2));
        this.updataeBoard();
    }

    updataeBoard(){
        console.log(this.chess.ascii());

        this.currentColor = this.chess.turn() == "w" ? "WHITE": "BLACK";
        //check first if game is over before sending new game state
        if(this.chess.game_over()){

            if(this.chess.in_checkmate()){
                var winner = this.chess.turn() == "w" ? "BLACK": "WHITE";
                let msg = {
                    type: "GAMEOVER",
                    data: "WIN",
                    winner: winner,
                }
                this.socket1.send(JSON.stringify(msg));
                this.socket2.send(JSON.stringify(msg));
            }
            if(this.chess.in_stalemate()){
                let msg = {
                    type: "GAMEOVER",
                    data: "STALEMATE",
                }
                this.socket1.send(JSON.stringify(msg));
                this.socket2.send(JSON.stringify(msg));
            }
        }

        let msg = {
            type: "BOARD_STATE",
            data: this.chess.board(),
            possibleMoves: this.chess.moves({ verbose: true }),
            moveCount: this.moveCounter,
            gameOver: this.chess.game_over(),
            inCheck: this.chess.in_check(),
            inCheckmate: this.chess.in_checkmate(),
            turn: this.chess.turn(),
            time: this.timeElipsed,
            whiteTime: this.whiteTime,
            blackTime: this.blackTime,
            gameStart: this.gameStart,
        }
        this.socket1.send(JSON.stringify(msg));
        this.socket2.send(JSON.stringify(msg));

        this.captures();
    }

    makeMove(move){
        this.chess.move(move);
        //increase the move counter
        this.moveCounter++
        console.log(this.chess.ascii());
        console.log(this.chess.moves({verbose:true}));
        console.log(this.chess.fen());
        this.updataeBoard();
    }

    onMessageWhite(message){
        var parsed = JSON.parse(message);
        console.log(parsed.type);
        if(parsed.type=="MOVE"){
            this.gameStart = true;
            this.makeMove(parsed.data);
        }
    }

    onMessageBlack(message){
        var parsed = JSON.parse(message);
        console.log(parsed);
        if(parsed.type=="MOVE"){
            this.makeMove(parsed.data);
        }

    }

    moveValidate(move){
        console.log(this.chess.board());
        const possibleMoves = this.chess.moves();
        console.log(possibleMoves);
        if(possibleMoves.includes(move)){
            return true;
        }else{
            return false;
        }
    }

    captures(){
        var history = this.chess.history({verbose: true});
        var initial = {w: {p: 0, n: 0, b: 0, r: 0, q: 0},
                    b: {p: 0, n: 0, b: 0, r: 0, q: 0}};

        var captured = history.reduce(function(acc, move) {
        if ('captured' in move) {
            var piece = move.captured;
            // switch colors since the history stores the color of the player doing the
            // capturing, not the color of the captured piece
            var color = move.color == 'w' ? 'b' : 'w';
            acc[color][piece] += 1;
            return acc;
        } else {
            return acc;
        }
        }, initial);
        let msg = {
            type: "CAPTURES",
            data: captured,

        }
        this.socket1.send(JSON.stringify(msg));
        this.socket2.send(JSON.stringify(msg));
    }
    whiteWinOnTime(){
        let msg = {
            type: "WHITE_WIN_ON_TIME",
        }
        this.socket1.send(JSON.stringify(msg));
        this.socket2.send(JSON.stringify(msg));
    }
    blackWinOnTime(){
        let msg = {
            type: "BLACK_WIN_ON_TIME",
        }
        this.socket1.send(JSON.stringify(msg));
        this.socket2.send(JSON.stringify(msg));
    }

    updateTime(){
        if(this.gameStart){
            this.timeElapsed++;
            if(this.currentColor=="WHITE"){
                this.whiteTime--;
            }
            if(this.currentColor=="BLACK"){
                this.blackTime--;
            }
        }
        if(this.whiteTime<=0){
            this.blackWinOnTime();
            clearInterval()
        }
        if(this.blackTime<=0){
            this.whiteWinOnTime();
            clearInterval();
        }
    }


    writeToJSON(){
        
    }
}





module.exports = Game;