const { Chess } = require('./chess.js');


class Game {
    constructor(socket1, socket2, gameID) {
        this.socket1 = socket1;
        this.socket2 = socket2;
        this.socket2.color = "WHITE";
        this.socket1.color = "BLACK";
        this.chess = new Chess();
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
        this.updataeBoard();
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
    }

    updataeBoard(){
        console.log(this.chess.ascii());
        let msg = {
            type: "BOARD_STATE",
            data: this.chess.board(),
            possibleMoves: this.chess.moves({ verbose: true }),
            moveCount: this.moveCounter,
            gameOver: this.chess.game_over(),
            inCheck: this.chess.in_check(),
            inCheckmate: this.chess.in_checkmate(),
            inDraw: this.chess.in_draw(),
            inStalemate: this.chess.in_stalemate(),
            inThreeFold: this.chess.in_threefold_repetition(),

        }
        this.socket1.send(JSON.stringify(msg));
        this.socket2.send(JSON.stringify(msg));
    }

    makeMove(move){
        this.chess.move(move);
        //increase the move counter
        this.moveCounter++
        console.log(this.chess.ascii());
        console.log(this.chess.moves())
        this.updataeBoard();
    }

    onMessageWhite(message){
        var parsed = JSON.parse(message);
        console.log('onMessageWhite')
        console.log(parsed.type);
        if(parsed.type=="MOVE"){
            this.makeMove(parsed.data);
        }
    }

    onMessageBlack(message){
        var parsed = JSON.parse(message);
        console.log('onMessageBlack')
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

    convertMove(){

    }

}
module.exports = Game;