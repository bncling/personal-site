import whiteRep from './white-rep.json' assert { type: 'json' };
import blackRep from './black-rep.json' assert { type: 'json' };

const pgnArea = document.querySelector(".pgn-viewer");
const alertArea = document.querySelector(".alert-goes-here")

var gameMode = "random";

var myRep = whiteRep;

if (playingColor == "b") {
  myRep = blackRep;
}

var moveStack = [];
var displayPGN = '';

var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((playingColor === 'w' && piece.search(/^b/) !== -1) ||
      (playingColor === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function getRepMoves (rep) {
  var candidates = []

  if (game.fen() in rep) {
    candidates = rep[game.fen()]
  }

  return candidates;
}

function onDrop (source, target) {
  var suggestedMove = "";
  if (game.fen() in myRep) {
    suggestedMove = myRep[game.fen()][0][0];
  }
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  })

  // illegal move
  if (move === null) return 'snapback'

  // move outside of repertoire
  if (move.san != suggestedMove && suggestedMove != "") {
    game.undo();
    alertArea.innerHTML = '<div class="alert alert-danger mt-2" role="alert">Expected a move other than ' + move.san + '.</div>'
    return 'snapback'
  }

  alertArea.innerHTML = ''

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

  var candidates = getRepMoves(myRep);
  if (candidates.length != 0) {

    var toMake = "";

    if (gameMode == "random") {

      var randomIdx = Math.floor(Math.random() * candidates.length)
      toMake = candidates[randomIdx][0];

    }

    game.move(toMake);

    // add to move log
    const newDividedPGN = game.pgn().split(' ');
    moveStack.push([newDividedPGN.at(-1), game.fen()]);
    board.position(game.fen());
    displayPGN = game.pgn()
    pgnArea.innerHTML = pgnHighlight(game.pgn());
  } else {
    alertArea.innerHTML = '<div class="alert alert-success mt-2" role="alert">Reached end of variation!</div>'
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

function onChange () {
  console.log(game.fen())
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
    }
};

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  // onChange: onChange
}
board = Chessboard('testBoard', config)

if (playingColor == "b") {
  board.orientation("black");

  var firstMoves = blackRep["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]
  var randomIdx = Math.floor(Math.random() * firstMoves.length);
  var firstMove = firstMoves[randomIdx][0];
  game.move(firstMove)
  board.position(game.fen())
  displayPGN = game.pgn()
  moveStack.push(firstMoves[randomIdx]);
  pgnArea.innerHTML = pgnHighlight(game.pgn());
}



updateStatus()