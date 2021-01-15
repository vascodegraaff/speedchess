const code = ['R', 'N', 'B', 'Q', 'K', 'P', 'R', 'N', 'B', 'Q', 'K', 'P'];
const pieceNum = ['♖', '♘', '♗', '♕', '♔', '♙', '♜', '♞', '♝', '♛', '♚', '♟︎'];

function translate(pieceCode){
    var i = 0;
    for(i = 0; i<pieceNum.length; i++){
        if(pieceNum[i] === pieceCode){
            break;
        }
    }

    return code[i];
}
