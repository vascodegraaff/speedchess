const { Chess } = require('./chess.js');


class Game {
    constructor(player1, player2, gameID) {
        this.player1 = player1;
        this.player2 = player2;
        this.chess = new Chess();
        this.currentColor = 'white';
        this.counter = 0;
        this.gameID = gameID;
        console.log(this.gameID);

        this.createGame();
    }

    createGame(player1, player2){
        this.makeMove('e4');
        console.log(this.chess.ascii());
        console.log(this.chess.board());
        this.makeMove('e5');
        console.log(this.chess.ascii());
        connection.send(this.chess.board());
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
    makeMove(move){
        this.chess.move(move);
        this.currentColor = this.currentColor=='white'? 'black' : 'white';
        this.counter++;
    }

    convertMove(){

    }

}
module.exports = Game;