var url = 'ws://localhost:8080';
const connection = new WebSocket(url);

connection.onopen = () => {
  connection.send('Client connected');
}

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
}

connection.onmessage = (e) => {
  //console.log(`message recieved: ${e.data}`);
  // console.log(e.date instanceof Blob);
  x = JSON.parse(e.data);

  if(x instanceof Array){
    renderBoard(x);
  }
}

renderBoard = (board) => {
  for(i=0; i<8;i++){
    for(j=0; j<8; j++){
      console.log(board[i][j]);
      if(board[i][j] != null){
        
      }
    }
  }
}


function moveValidate(from, to, piece){
  connection.send(`Validate(${piece}-${from}:${to})`);
}

function move(from, to){
    console.log(`${from} : ${to}`);
    pieceName = document.getElementById(from).textContent;
    moveValidate(from,to,pieceName);
    document.getElementById(from).textContent = '';
    document.getElementById(to).textContent = pieceName;
}

var piece1
var piece2
var counter = 0;



document.querySelectorAll('.cell').forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        
        if(counter == 0){
          piece1 = item.id;
          var nextPiece = document.getElementById('d3');
          nextPiece.style = 'background_color: #00ff00';
          counter++;
        }else{
          var nextPiece = document.getElementById('d3');
          nextPiece.style = 'background-color: #eab676';
          piece2 = item.id
          counter = 0;
          move(piece1, piece2);
        }
    })
})