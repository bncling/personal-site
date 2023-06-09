import whiteRep from './white-rep.json' assert { type: 'json' };
import blackRep from './black-rep.json' assert { type: 'json' };

const boardArea = document.getElementById("startBoard");
const resetBtn = document.querySelector(".reset-button");
const alertArea = document.querySelector(".alert-goes-here");

var myRep = whiteRep;
var moveStack = [];

var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

var currentSquare = '';
var squaresClicked = [];

var goalPosition = '';

function onMouseoverSquare (square, piece) {
  currentSquare = square;
}

function getRandomPosition (rep) {
  const randomNum = Object.keys(rep).length * Math.random();
  var count = 0;
  for (var pos in rep) {
    count += 1; 
    if (count > randomNum) {
      return pos;
    }
  }
}

function getRepMoves (rep) {
  var candidates = []

  if (game.fen() in rep) {
    candidates = rep[game.fen()]
  }

  return candidates;
}

function existsPath(rep, fen1, fen2) {
  if (fen1 == fen2) {
    return true;
  } else {
    for (let neighbor of rep[fen1]) {
      if (existsPath(rep, neighbor[1], fen2)) {
        return true
      }
    }
  }
  return false
}


function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }

  squaresClicked.push(source);
}

function onDrop (source, target) {
  const repMoves = getRepMoves(myRep);
  var suggestedMoves = [];
  if (game.fen() in myRep) {
    for (var i = 0; i < repMoves.length; i++) {
      if (existsPath(myRep, repMoves[i][1], goalPosition)) {
        suggestedMoves.push(repMoves[i][0]);
      }
    }
  }

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  })

  // illegal move
  if (move === null) return 'snapback'

  if (!(suggestedMoves.includes(move.san)) && (suggestedMoves != [])) {
    if (game.history({verbose: true}).at(-1).promotion == 'q') {
      console.log("promotion exceptions made...")
    } else {
      game.undo();
      alertArea.innerHTML = '<div class="alert alert-danger mt-2" role="alert">Expected a move other than ' + move.san + '.</div>'
      return 'snapback'
    }
  }

  squaresClicked = [];
  alertArea.innerHTML = ''

  updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  const currentLength = game.history().length - 1;
  const dividedPGN = game.pgn().split(' ');
  if (currentLength == moveStack.length) {
    moveStack.push([dividedPGN.at(-1), game.fen()]);
  } else {
    moveStack.splice(currentLength, moveStack.length - currentLength, [dividedPGN.at(-1), game.fen()]);
  }

  if (game.history({verbose: true}).at(-1).promotion == 'q') {
    var promotionType = prompt("Enter q, r, n, or b for promotion type: ");
    if (!['q', 'r', 'n', 'b'].includes(promotionType)) {
      promotionType = 'q';
    }
    var attemptedMove = game.undo();
    attemptedMove.promotion = promotionType;
    game.move(attemptedMove);
  } 

  board.position(game.fen())
  if (game.fen() == goalPosition) {
    alertArea.innerHTML = '<div class="alert alert-success mt-2" role="alert">Reached the goal position!</div>'
  }
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

function customReset() {
  var playingColor = Math.floor(2 * Math.random());
  if (playingColor == 0) {
    myRep = whiteRep;
    finalBoard.orientation("white");
    board.orientation("white");
  } else {
    myRep = blackRep;
    finalBoard.orientation("black");
    board.orientation("black");
  }
  game.reset()
  goalPosition = getRandomPosition(myRep);
  board.position(game.fen());
  finalBoard.position(goalPosition);
  alertArea.innerHTML = "";
  moveStack = [];
}

function tempBack () {
  for (var i = 0; i < moveStack.length; i++) {
    if (moveStack.at(i)[1] == game.fen()) {
      game.undo();
      board.position(game.fen());
    }
  }
}

function tempForward () {
  if (game.fen() == "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    game.move(moveStack.at(0)[0]);
    board.position(game.fen());
  } else {
    for (var i = 0; i < moveStack.length; i++) {
      if (moveStack.at(i)[1] === game.fen()) {
        const toMake = String(moveStack.at(i + 1)[0]);
        game.move(toMake);
        board.position(game.fen());
        break;
      }
    }
  }
}

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
            tempBack();
            break;
        case 38:
            tempForward();
            break;
        case 39:
            tempForward();
            break;
        case 40:
            tempBack();
            break;
        case 82:
            customReset();
            break;
    }
};

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoverSquare: onMouseoverSquare
}

var board = Chessboard("startBoard", config)
var finalBoard = Chessboard("finishedBoard", "start");

updateStatus()

goalPosition = getRandomPosition(myRep);
finalBoard.position(goalPosition);

boardArea.addEventListener("click", evt => {
  squaresClicked.push(currentSquare);
});

document.addEventListener("click", evt => {
  if (squaresClicked.length == 2) {
    if (!onDrop(squaresClicked[0], squaresClicked[1])) {
        onSnapEnd();
    } else {
      squaresClicked = [];
    }
  }
});

resetBtn.addEventListener("click", evt => {
  customReset();
});
