import whiteRep from './white-rep.json' assert { type: 'json' };
import blackRep from './black-rep.json' assert { type: 'json' };
import testJSON from './test.json' assert { type: 'json' };

const pgnArea = document.querySelector(".pgn-viewer");
const moveArea = document.querySelector(".known-moves-here");
const resetBtn = document.querySelector(".reset-button");

var moveStack = [];
var displayPGN = '';

var myRep = whiteRep;

if (playingColor == "b") {
  myRep = blackRep;
}

var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
}

function pgnHighlight (pgn) {
  const moveNum = game.history().length;
  var highlighted = '<p>';
  const divided = pgn.split(". ");
  const numTurns = Math.ceil(moveStack.length / 2);
  const turnNum = Math.ceil(moveNum / 2);
  for (var i = 1; i <= numTurns; i++) {
    highlighted += String(i) + '. '
    var dividedAgain = divided[i].split(" ");
    var steps = Math.floor(dividedAgain.length / 2) + 1;
    if (i == turnNum) {
      for (var j = 0; j < steps; j++) {
        if ((moveNum - j) % 2 == 1) {
          highlighted += '<b>' + dividedAgain[j] + '</b> ';
        } else {
          highlighted += dividedAgain[j] + ' ';
        }
      }
    }
    else {
      for (var j = 0; j < steps; j++) {
        highlighted += dividedAgain[j] + ' ';
      }
    }
  }

  return highlighted;
}

function getRepMoves (rep) {
  var candidates = []

  if (game.fen() in rep) {
    candidates = rep[game.fen()]
  }

  return candidates;
}

function displayKnownMoves() {
  const turnNum = Math.floor(game.history().length / 2) + 1;
  const knownMoves = getRepMoves(myRep);
  var modifier = ".";
  if (game.turn() == "b") {
    modifier += "..";
  }
  var movesToShow = '<p>';
  for (var i = 0; i < knownMoves.length; i++) {
    movesToShow += turnNum + modifier + ' ' + knownMoves[i][0] + '<br>';
  }
  moveArea.innerHTML = movesToShow;
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
  displayPGN = game.pgn()
  pgnArea.innerHTML = pgnHighlight(game.pgn());
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

function onChange (oldPos, newPos) {
	displayKnownMoves();
}

function tempBack () {
  for (var i = 0; i < moveStack.length; i++) {
    if (moveStack.at(i)[1] == game.fen()) {
      game.undo();
      board.position(game.fen());
      pgnArea.innerHTML = pgnHighlight(displayPGN);
    }
  }
}

function tempForward () {
  if (game.fen() == "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    game.move(moveStack.at(0)[0]);
    board.position(game.fen());
    pgnArea.innerHTML = pgnHighlight(displayPGN);
  } else {
    for (var i = 0; i < moveStack.length; i++) {
      if (moveStack.at(i)[1] === game.fen()) {
        const toMake = String(moveStack.at(i + 1)[0]);
        game.move(toMake);
        board.position(game.fen());
        pgnArea.innerHTML = pgnHighlight(displayPGN);
        break;
      }
    }
  }
}

function customReset() {
  game.reset();
  board.position(game.fen())
  moveArea.innerHTML = "";
  moveStack = [];
  displayPGN = '';
  pgnArea.innerHTML = "";
}

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 9:
            if (playingColor == "w") {
              window.location.href = '/chess/black_repertoire_editing'
            } else {
              window.location.href = '/chess/white_repertoire_editing'
            }
            break;
        case 37:
            tempBack();
            console.log(game.fen());
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
  onChange: onChange
}
board = Chessboard('testBoard', config)

updateStatus()

if (playingColor == "b") {
  board.orientation("black")
}

displayKnownMoves();

resetBtn.addEventListener("click", evt => {
  customReset();
});



