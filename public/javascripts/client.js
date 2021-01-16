
var url = 'ws://localhost:8080';
const socket = new WebSocket(url);

let gameID = {};
let clientColor;
let moveCounter = 0;
let currentColor = "WHITE";


socket.onopen = () => {
	msg = {
		type: "CLIENT_CONNECTED",
		data: null
	}
	socket.send(JSON.stringify(msg));
}

socket.onerror = (error) => {
    console.log(`WebSocket error: ${error}`);
}

socket.onmessage = (e) => {
	//console.log(`message recieved: ${e.data}`);
	let message = JSON.parse(e.data);
	console.log(message);
	switch (message.type) {
		case "BOARD_STATE":
			renderBoard(message.data);
			moveCounter = message.moveCount;
			currentColor = moveCounter % 2 ? "BLACK" : "WHITE";
			break;

		case "CLIENT_DATA":
			clientColor = message.color;
			gameID = message.game;
			break;
		default:
			break;
	}

	// if(x instanceof Array){
	//   renderBoard(x);
	// }
}

var map = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h' };

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
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			id = map[j] + (8 - i);
			if (board[i][j] != null) {
				x = board[i][j];
				//console.log(x.color, x.type);
				//console.log(map3[board[i][j].color][board[i][j].type]);
				document.getElementById(id).textContent = map3[board[i][j].color][board[i][j].type];
			}
			if (board[i][j] == null) {
				document.getElementById(id).textContent = "";
			}
		}
	}
}



function move(from, to) {
	//console.log(`${from} : ${to}`);
	var pieceName = document.getElementById(from).textContent;
	var msg = {
		type: "MOVE",
		data: moveParser(pieceName, from, to),
		color: clientColor
	};
	console.log(msg);
	socket.send(JSON.stringify(msg));
	// document.getElementById(from).textContent = '';
	// document.getElementById(to).textContent = pieceName;
}

function moveParser(piece, from, to) {
	var chessNotation;
	if (piece === '♟︎' || piece === '♙') {
		chessNotation = `${to}`;
	}
	else {
		chessNotation = `${translate(piece)}${to}`;
	}
	return chessNotation;
}





var clickCounter = 0;
var piece1;
var piece2;
document.querySelectorAll('.cell').forEach(item => {
	item.addEventListener('click', event => {
		//only listens for moves when the currentColor is the same as clientColor
		if (clientColor == currentColor) {
            //checks if two pieces are clicked
			if (clickCounter == 0) {
                piece1 = item.id;
                document.getElementById(piece1).style.boxShadow = "inset 0px 0px 400px 110px rgba(0, 0, 0, .7)";
				clickCounter++;
			} else {
				piece2 = item.id
				clickCounter = 0;
                move(piece1, piece2);
                document.getElementById(piece1).style.boxShadow = "none";
			}

		}
	})
})