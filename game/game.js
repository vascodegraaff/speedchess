
const WebSocket = require('ws');






const { Chess } = require('./chess.js');


class Game {
    constructor() {
        this.game = {}
        this.waitingPlayer = [];
        this.chess = new Chess();
        this.currentColor = 'white';
        this.counter = 0;


        this.createGame();
    }
    newConnection(ws){

    }
    createGame(player1, player2){
        console.log(this.chess.pgn())
        console.log(this.moveValidate('e4'));
        this.makeMove('e4');
        console.log(this.chess.ascii());
        this.makeMove('e5');
        console.log(this.chess.ascii())
    }

    moveValidate(move){
        const possibleMoves = this.chess.moves();
        console.log(possibleMoves)
        if(possibleMoves.includes(move)){
            return true;
        }else{
            return false;
        }
    }
    makeMove(move){
        this.chess.move(move);
        this.currentColor = this.currentColor=='white'? 'black' : 'white';
        this.counter++;
    }

    convertMove(){

    }

}
module.exports = Game;