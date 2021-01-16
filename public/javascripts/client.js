
var url = 'ws://localhost:8080';
const connection = new WebSocket(url);

let clientID = {};
let gameID = {};
let clientColor = null;



connection.onopen = () => {
  msg = {
    type: "CLIENT_CONNECTED",
    data: null
  }
  connection.send(JSON.stringify(msg));
}

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
}

connection.onmessage = (e) => {
  console.log(e.data);
  //console.log(`message recieved: ${e.data}`);
  x = JSON.parse(e.data);

  if(x instanceof Array){
    renderBoard(x);
  }
}

var map = {0:'a', 1:'b', 2:'c', 3:'d', 4:'e', 5:'f',6:'g',7:'h'};

var map3 = {
  "w": {
    "r": '♖',
    "n": '♘',
    "b": '♗',
    "q": '♕',
    "k": '♔',
    "p": '♙'
  },
  "b": {
      "r": '♜',
      "n": '♞',
      "b": '♝',
      "q": '♛',
      "k": '♚',
      "p": '♟︎'
  }
}
renderBoard = (board) => {
  console.log(board);
  for(i=0; i<8;i++){
    for(j=0; j<8; j++){
      id = map[j] + (8-i);
      if(board[i][j] != null){
        x = board[i][j];
        //console.log(x.color, x.type);
        //console.log(map3[board[i][j].color][board[i][j].type]);
        document.getElementById(id).textContent = map3[board[i][j].color][board[i][j].type];
      }
      if(board[i][j] == null){
        document.getElementById(id).textContent = "";
      }
    }
  }
}



function move(from, to){
    // console.log(`${from} : ${to}`);
    pieceName = document.getElementById(from).textContent;
    msg = {
      type: "MOVE",
      data: moveParser(pieceName, from, to)
    };
    console.log(msg);
    connection.send(JSON.stringify(msg));
    // document.getElementById(from).textContent = '';
    // document.getElementById(to).textContent = pieceName;
}

function moveParser(piece, from, to){
    var chessNotation;
    if(piece === '♟︎' || piece === '♙'){
      chessNotation = `${to}`;
    }
    else{
      chessNotation = `${translate(piece)}${to}`;
    }
  
  
  console.log(chessNotation);
  return chessNotation;
}

var piece1
var piece2
var counter = 0;



document.querySelectorAll('.cell').forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        
        if(counter == 0){
          piece1 = item.id;
          // var nextPiece = document.getElementById('d3');
          // nextPiece.style = 'background_color: #00ff00';
          counter++;
        }else{
          // var nextPiece = document.getElementById('d3');
          // nextPiece.style = 'background-color: #eab676';
          piece2 = item.id
          counter = 0;
          move(piece1, piece2);
        }
    })
})