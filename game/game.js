const { Chess } = require('./chess.js');


class Game {
    constructor(socket1, socket2, gameID) {
        this.socket1 = socket1;
        this.socket2 = socket2;
        this.chess = new Chess();
        this.currentColor = 'white';
        this.counter = 0;
        this.gameID = gameID;
        
        //this binds the function to this.onMessage and when a message is recieved, the function gets called
        this.onMessageWhite = this.onMessageWhite.bind(this);
        this.onMessageBlack = this.onMessageBlack.bind(this);
    
        this.socket2.on('message', this.onMessageWhite)
        this.socket1.on('message', this.onMessageBlack)

        this.startGame();
    }

    startGame(){
        // this.makeMove('e4');
        // console.log(this.chess.ascii());
        // console.log(this.chess.board());
        // this.makeMove('e5');
        // console.log(this.chess.ascii());
        this.updataeBoard();
        // socket1.send(JSON.stringify(this.chess.board()));
        // socket2.send(JSON.stringify(this.chess.board()));
    }

    updataeBoard(){
        console.log(this.chess.ascii());
        this.socket1.send(JSON.stringify(this.chess.board()));
        this.socket2.send(JSON.stringify(this.chess.board()));
    }

    // makeMove(move){
    //     console.log(move);
    //     console.log('makeMove')
    //     this.chess.move(move);
    //     this.updataeBoard();
    // }

    onMessageWhite(message){
        var parsed = JSON.parse(message);
        console.log('onMessageWhite')
        console.log(parsed.type);
        console.log(parsed.type=="MOVE");
        if(parsed.type=="MOVE"){
            console.log(this.makeMove)
            this.chess.move(parsed.data);
            console.log(this.chess.ascii());
            console.log(this.chess.possibleMoves())
            this.updataeBoard();
        }
    }

    onMessageBlack(message){
        var parsed = JSON.parse(message);
        console.log('onMessageBlack')
        console.log(parsed);
        if(parsed.type=="MOVE"){
            this.chess.move(parsed.data);
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