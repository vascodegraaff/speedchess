//var url = 'wss://speedchezz.herokuapp.com:8080'
var url = 'ws://localhost:8080';
const socket = new WebSocket(url);

let gameID = {};
let clientColor;
let moveCounter = 0;
let currentColor;
let captures = [];
let possibleMoves = [];
let gameStart = false;


let whiteTime = 180;
let blackTime = 180;
let timeElapsed = 0;


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
		case "CLIENT_DATA":
			clientColor = message.color;
			gameID = message.game;
			if(clientColor=="BLACK"){
				document.body.classList += "blackBoard"
			}
			break;
		case "BOARD_STATE":
			renderBoard(message.data);
			moveCounter = message.moveCount;
			possibleMoves = message.possibleMoves;
			currentColor = possibleMoves[0].color=='w'?"WHITE":"BLACK";
			blackTime = message.blackTime;
			whiteTime = message.whiteTime;
			gameStart = message.gameStart;
			//game start is true after white moves
			//console.log(currentColor, clientColor);
			break;

		case "CAPTURES":
			renderCaptures(message.data);
			break;
		case "WHITE_WIN_ON_TIME":
			alert("white wins on time");
			break;
		case "BLACK_WIN_ON_TIME":
			alert("black wins on time");
			break;
		case "GAME_OVER":
			if(message.data=="STALEMATE"){
				alert("Stalemate reached");
			}
			if(message.data=="WIN"){
				alert(message.winner + "wins");
			}
			break;
		default:
			break;
	}
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
function renderBoard(board){
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
function renderCaptures(captures){
	console.log(captures.w);
	for(var piece in captures.w){
		var whiteCap = document.getElementById("whiteCaptures");
		for(var i = 1; i<= captures.w[piece]; i++){
			//some problemo here
			var newDiv = document.createElement('h5');
			newDiv.className = 'captured piece';
			whiteCap.appendChild(newDiv);
		}
	}
	for(i=0; i<5;i++){
		console.log(captures[0][i]);
	}
	for(i=0; i<5;i++){
		console.log(captures[1][i]);
	}
}



function move(from, to) {
	//console.log(`${from} : ${to}`);
	var piece1 = document.getElementById(from).textContent;
	var piece2 = document.getElementById(to).textContent;
	if(piece1!=null){
		var msg = {
			type: "MOVE",
			data: moveParser(piece1, piece2, from, to),
			color: clientColor
		};
		console.log(msg);
		socket.send(JSON.stringify(msg));
	}
	// document.getElementById(from).textContent = '';
	// document.getElementById(to).textContent = pieceName;
}

function moveParser(piece1,piece2, from, to) {
	var chessNotation;
	//console.log(piece2);
	chessNotation = {
		from: from,
		to: to,
	}
	//deals with pawn promotions
	if (piece1 === '♟︎' || piece1 === '♙') {
		if(to[1]==8 || to[1]==1){
			chessNotation.promotion = "q"
		}
	}
	//console.log(chessNotation);
	return chessNotation;
}


function waitForMove(){
	//console.log(clientColor,currentColor);
	var clickCounter = 0;
	var piece1;
	var piece2;
	document.querySelectorAll('.cell').forEach(item => {
		item.addEventListener('click', event => {
			//only listens for moves when the currentColor is the same as clientColor
				//checks if two pieces are clicked
			if(currentColor==clientColor&&clientColor!=undefined&&currentColor!=undefined){
				if(clickCounter == 0) {
					piece1 = item.id;
					document.getElementById(piece1).style.boxShadow = "inset 0px 0px 400px 110px rgba(0, 0, 0, .7)";
					clickCounter++;
				}else{
					piece2 = item.id
					clickCounter = 0;
					move(piece1, piece2);
					document.getElementById(piece1).style.boxShadow = "none";
				}
			}
		})
	})
}

window.setInterval(() => {
	if(gameStart){
		timeElapsed++;
		if(currentColor=="WHITE"){
			if(whiteTime>=0){
				whiteTime--;
			}
		}
		if(currentColor=="BLACK"){
			if(blackTime>=0){
				blackTime--;
			}
		}
		document.getElementById("whiteTime").textContent = whiteTime;
		document.getElementById("blackTime").textContent = blackTime;
		document.getElementById("timeElapsed").textContent = timeElapsed;
	}
}, 1000);
waitForMove();