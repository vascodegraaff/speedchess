//var url = 'wss://speedchezz.herokuapp.com:8080'
// var url = 'ws://localhost:8080';
// var secure = location.origin.includes('localhost') ? 'ws' : 'wss';
// var url = location.origin.replace(/^http/, secure);
// console.log(url);

let socket; 
if (location.hostname.includes('heroku')) { 
	socket= new WebSocket('wss:/speedchezz.herokuapp.com/');
} else { 
	socket = new WebSocket("ws:/localhost:3000");
}

//const socket = new WebSocket(url);
var sound = new Audio("../audio/move.wav");

let gameID = {};
let clientColor;
let moveCounter = 0;
let currentColor;
let captures = [];
let possibleMoves = [];
let gameStart = false;
let gameOver = false;


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
socket.onclose = () => {
	msg = {
		type: "CLIENT_DISCONNECTED",
		data: gameOver,
		clientColor: clientColor,
	}
}

socket.onmessage = (e) => {
	//console.log(`message recieved: ${e.data}`);
	let message = JSON.parse(e.data);
	console.log(message);
	switch (message.type) {
		case "CLIENT_DATA":
			clientColor = message.color;
			gameID = message.game;
			if (clientColor == "BLACK") {
				document.body.classList += "blackBoard"
			}
			break;
		case "BOARD_STATE":
			renderBoard(message.data);
			moveCounter = message.moveCount;
			possibleMoves = message.possibleMoves;
			currentColor = possibleMoves[0].color == 'w' ? "WHITE" : "BLACK";
			blackTime = message.blackTime;
			whiteTime = message.whiteTime;
			gameStart = message.gameStart;
			//game start is true after white moves
			//console.log(currentColor, clientColor);
			renderStatus(currentColor);
			break;

		case "CAPTURES":
			renderCaptures(message.data);
			break;
		case "WHITE_WIN_ON_TIME":
			renderStatus("WHITE_WINS");
			gameOver = true;
			break;
		case "BLACK_WIN_ON_TIME":
			renderStatus("BLACK_WINS");
			gameOver = true;
			break;
		case "GAMEOVER":
			gameOver = true;
			if (message.data == "STALEMATE") {
				renderStatus("STALEMATE");
			}
			if (message.data == "WIN") {
				message.winner == 'WHITE' ? renderStatus('WHITE_WINS') : renderStatus("BLACK_WINS");
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
function renderBoard(board) {
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
  sound.play();
}
function renderCaptures(captures) {
	//captures = {w:{p: 8, n: 2, b: 2, r: 2, q: 1}, b:{p: 8, n: 2, b: 2, r: 2, q: 1}};
	var whiteCap = document.getElementById("whiteCaptures");
	whiteCap.innerHTML = '';
	var counterWhite = 0;
	for (var piece in captures.b) {
		for (var i = 1; i <= captures.b[piece]; i++) {
			var newDiv = document.createElement('h2');
			newDiv.className = 'capturedPiece';
			newDiv.textContent = map3['b'][piece];
			whiteCap.appendChild(newDiv);
			counterWhite++;
			if (counterWhite % 4 == 0) {
				var lineBreak = document.createElement("div");
				lineBreak.className = "break";
				whiteCap.appendChild(lineBreak);
			}
		}
	}
	var blackCap = document.getElementById("blackCaptures");
	blackCap.innerHTML = '';
	var counterBlack = 0;
	for (var piece in captures.w) {
		for (var i = 1; i <= captures.w[piece]; i++) {
			var newDiv = document.createElement('h2');
			newDiv.className = 'capturedPiece';
			newDiv.textContent = map3['w'][piece];
			blackCap.appendChild(newDiv);
			counterBlack++;
			if (counterBlack % 4 == 0) {
				var lineBreak = document.createElement("div");
				lineBreak.className = "break";
				blackCap.appendChild(lineBreak);
			}
		}
	}

}

function renderStatus(data) {
	switch (data) {
		case "WHITE":
			document.getElementById("statusText").textContent = "Whites turn to move";
			break;

		case "BLACK":
			document.getElementById("statusText").textContent = "Black turn to move";
			break;
		case "STALEMATE":
			document.getElementById("statusText").textContent = "Stalemate";
			break;
		case "WHITE_WINS":
			document.getElementById("statusText").textContent = "White Wins";
			break;
		case "BLACK_WINS":
			document.getElementById("statusText").textContent = "Black Wins";
			break;

		default:
			break;
	}

}

function move(from, to) {
	//console.log(`${from} : ${to}`);
	var piece1 = document.getElementById(from).textContent;
	var piece2 = document.getElementById(to).textContent;
	if (piece1 != null) {
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

function moveParser(piece1, piece2, from, to) {
	var chessNotation;
	//console.log(piece2);
	chessNotation = {
		from: from,
		to: to,
	}
	//deals with pawn promotions
	if (piece1 === '♟︎' || piece1 === '♙') {
		if (to[1] == 8 || to[1] == 1) {
			chessNotation.promotion = "q"
		}
	}
	//console.log(chessNotation);
	return chessNotation;
}


function waitForMove() {
	//console.log(clientColor,currentColor);
	var clickCounter = 0;
	var piece1;
	var piece2;
	document.querySelectorAll('.cell').forEach(item => {
		item.addEventListener('click', event => {
			//only listens for moves when the currentColor is the same as clientColor
			//checks if two pieces are clicked
			if (currentColor == clientColor && clientColor != undefined && currentColor != undefined) {
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
}

window.setInterval(() => {
	if (gameStart && !gameOver) {
		timeElapsed++;
		if (currentColor == "WHITE") {
			if (whiteTime >= 1) {
				whiteTime--;
			}
		}
		if (currentColor == "BLACK") {
			if (blackTime >= 1) {
				blackTime--;
			}
		}
		blackTimeMin = String(Math.floor(blackTime / 60));
		blackTimeSec = blackTime % 60;
		whiteTimeMin = String(Math.floor(whiteTime / 60));
		whiteTimeSec = whiteTime % 60;
		elapsedMin = String(Math.floor(timeElapsed / 60));
		elapsedSec = timeElapsed % 60;
		document.getElementById("whiteTime").textContent = whiteTimeMin + ":" + String(whiteTimeSec).padStart(2, "0");
		document.getElementById("blackTime").textContent = blackTimeMin + ":" + String(blackTimeSec).padStart(2, "0");
		document.getElementById("timeElapsed").textContent = elapsedMin + ":" + String(elapsedSec).padStart(2, "0");
	}
}, 1000);
waitForMove();