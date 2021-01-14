const code = ['r', 'n', 'b', 'q', 'k', 'p', 'r', 'n', 'b', 'q', 'k', 'p'];
const pieceNum = ['&#9814', '&#9816', '&#9815', '&#9813', '&#9812', '&#9817', '&#9820', '&#9822', '&#9821', '&#9819', '&#9818', '&#9823'];

function translate(pieceCode){
    var i = 0;
    for(i = 0; i<piecenum.length; i++){
        if(piecenum[i] === pieceCode){
            break;
        }
    }

    return code[i];
}

module.exports.translate = translate;