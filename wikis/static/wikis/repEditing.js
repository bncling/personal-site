import whiteRep from './white-rep.json' assert { type: 'json' };
import blackRep from './black-rep.json' assert { type: 'json' };
import testJSON from './test.json' assert { type: 'json' };

const variationArea = document.querySelector(".variation-label");
const pgnArea = document.querySelector(".pgn-viewer");
const savedArea = document.querySelector(".known-moves-here");
const addedArea = document.querySelector(".added-moves-here");
const jsonArea = document.getElementById("json-data-here");
const deleteBtn = document.querySelector(".delete-from");
const saveBtn = document.querySelector(".save-var");
const resetBtn = document.querySelector(".reset-button");
const boardArea = document.getElementById("testBoard");
const probArea = document.querySelector(".probabilities-here");
const fromPosArea = document.querySelector(".from-this-pos");

var moveStack = [];
var displayPGN = '';
var variationProbability = 1.0;

var myRep = whiteRep;

if (playingColor == "b") {
  myRep = blackRep;
}

var newRep = structuredClone(myRep);
var deletedMoves = [];

var currentSquare = '';
var squaresClicked = [];

var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

function saveRep() {
  deleteMovesFromRep(newRep);
  jsonArea.value = JSON.stringify({"color": playingColor, "rep": newRep});
}

function getStatistics (position, rep, plyNum, depth) {
  var weightedSum = 0;
  if (rep[position].length == 0) {
    return 0.0;
  } else if (plyNum == depth) {
    for (let neighbor of rep[position]) {
      if (neighbor.length == 3) {
        weightedSum += (neighbor[2] / 100);
      } else { 
        return 1.0;
      }
    } 
  } else {
    for (let neighbor of rep[position]) {
      var likelihood = 100
      if (neighbor.length == 3) {
        likelihood = neighbor[2]
      }
      const weight = getStatistics(neighbor[1], rep, plyNum + 1, depth);
      weightedSum += (likelihood / 100) * weight;
    }
  }

  return weightedSum;
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
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  })

  // illegal move
  if (move === null) return 'snapback'

  squaresClicked = [];

  updateStatus()
}

function onMouseoverSquare (square, piece) {
  currentSquare = square;
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

function addMoveToRep (newMove) {
  var attemptedMove = game.undo();
  const previousPosition = game.fen();
  game.move(attemptedMove);
  if (previousPosition in newRep) {
    newRep[previousPosition].push(newMove);
    if (!(game.fen() in newRep) || (newRep[game.fen()].length == 0)) {
      newRep[game.fen()] = [];
    }
  } else {
    newRep[previousPosition] = [newMove];
    newRep[game.fen()] = [];
  }

  displayProbabilities();
}

function deleteSubsequentMoves (rep, startFEN) {
  var stack = [ startFEN ];

  while (stack.length > 0) {
    const current = stack.pop();
    deletedMoves.push(current)
    for (let neighbor of rep[current]) {
      stack.push(neighbor[1])
    }
  }
}

function deleteMovesFromRep (rep) {
  for (let deletedMove of deletedMoves) {
    delete rep[deletedMove];
  }
  for (var position in rep) {
    var toRemove = [];
    for (var i = 0; i < rep[position].length; i++) {
      if (deletedMoves.includes(rep[position][i][1])) {
        toRemove.push(i);
      }
    }
    for (var i = 0; i < toRemove.length; i++) {
      rep[position].splice(toRemove[i], 1);
    }
  }

  displayProbabilities();
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
  const movesKnown = getRepMoves(myRep);
  var knownMoves = {};
  for (var i = 0; i < movesKnown.length; i++) {
    knownMoves[movesKnown[i][0]] = [movesKnown[i][2], (deletedMoves.includes(movesKnown[i][1]))];
  }
  const movesAdded = getRepMoves(newRep);
  movesAdded.sort(function(a, b){return b[2] - a[2]});
  var addedMoves = {};
  for (var i = 0; i < movesAdded.length; i++) {
    addedMoves[movesAdded[i][0]] = [movesAdded[i][2], (deletedMoves.includes(movesAdded[i][1]))];
  }
  var modifier = ".";
  if (game.turn() == "b") {
    modifier += "..";
  }
  var addedToShow = '<p>';
  var savedToShow = '<p>';
  for (var moveSan in addedMoves) {
    var prefix = '';
    var postfix = '';
    if (addedMoves[moveSan][1]) {
      prefix = '<span style="color: var(--danger-red);">';
      postfix = '</span>';
    }
    var moveString = '';
    if (addedMoves[moveSan][0]) {
      moveString = '<b>' + turnNum + modifier + moveSan + '</b> - (' + addedMoves[moveSan][0] + ')<br>';
    } else {
      moveString = '<b>' + turnNum + modifier + moveSan +'</b><br>';
    }
    if (moveSan in knownMoves) {
      savedToShow += prefix + moveString + postfix;
    } else {
      if (!(addedMoves[moveSan][1])) {
        addedToShow += moveString;
      }
    }
  }
  savedArea.innerHTML = savedToShow;
  addedArea.innerHTML = addedToShow;
}

function displayProbabilities () {
  var probString = ''
  for (var i = 0; i < 10; i++) {
    probString += '<small><b>Turn ' + (i + 1) + ': </b>' + Math.floor(getStatistics("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", newRep, 0, 2*i + 1) * 1000000) / 10000 + "%</small><br>";
  }
  probArea.innerHTML = probString;
  var probString2 = ''
  for (var i = 0; i < 5; i++) {
    probString2 += '<small><b>In ' + (i + 1) + ' moves: </b>' + Math.floor(getStatistics(game.fen(), newRep, 0, 2*i + 1) * 1000000) / 10000 + "%</small><br>";
  }
  fromPosArea.innerHTML = probString2;
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  var attemptedMove = game.undo();
  game.move(attemptedMove);

  if (game.history({verbose: true}).at(-1).promotion == 'q') {
    var promotionType = prompt("Enter q, r, n, or b for promotion type: ");
    if (!['q', 'r', 'n', 'b'].includes(promotionType)) {
      promotionType = 'q';
    }
    attemptedMove.promotion = promotionType;
  } 

  game.undo();
  const previousPosition = game.fen();
  game.move(attemptedMove);

  const currentLength = game.history().length - 1;
  const dividedPGN = game.pgn().split(' ');
  if (currentLength == moveStack.length) {
    moveStack.push([dividedPGN.at(-1), game.fen()]);
    displayPGN = game.pgn();
  } else {
    var followingPGN = true;
    for (var i = 0; i < currentLength + 1; i++) {
      if (game.history()[i] != moveStack[i][0]) {
        followingPGN = false
      }
    }
    if (followingPGN == false) {
      moveStack.splice(currentLength, moveStack.length - currentLength, [dividedPGN.at(-1), game.fen()]);
      displayPGN = game.pgn();
    }
  }


  const previouslySeen = newRep[previousPosition];
  var notPreviouslySeen = false
  if (previouslySeen) {
    notPreviouslySeen = true
    for (var i = 0; i < previouslySeen.length; i++) {
      if (previouslySeen[i][0] == attemptedMove.san) {
        notPreviouslySeen = false;
        break;
      }
    }
  }

  if (!(game.fen() in newRep) || (
      (game.fen() in newRep) &&
      (previousPosition in newRep) &&
      (notPreviouslySeen)
    )) {
    var newMove = [dividedPGN.at(-1), game.fen()]
    if (game.turn() == playingColor) {
      var newWeight = "weight";
      while (!(Number(newWeight) >= 0)) {
        newWeight = prompt("Add new move with weight: ");
      }
      if (newWeight > 0) {
        newMove.push(Number(newWeight));
        addMoveToRep(newMove);
      } 
    } else {
      if (confirm("Add new move: ")) {
        addMoveToRep(newMove);
      } 
    }
  }

  board.position(game.fen())
  pgnArea.innerHTML = pgnHighlight(displayPGN);
  if (previousPosition in newRep) {
    var hasMove = true;
    if (game.turn() == playingColor) {
      hasMove = false;
      for (let potentialMove of newRep[previousPosition]) {
        if (potentialMove[0] == attemptedMove.san) {
          hasMove = true;
          variationProbability *= potentialMove[2] / 100;
        }
      }
    }
    if (hasMove) {
      variationArea.innerHTML = "<b>Current variation (" + String(Math.floor(10000 * variationProbability) / 100) + "%):</b>";
    } else {
      variationArea.innerHTML = "<b>Current variation:</b>";
    }
  } else {
    variationArea.innerHTML = "<b>Current variation:</b>";
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

function onChange (oldPos, newPos) {
  displayKnownMoves();
  if (game.fen() in newRep) {
    displayProbabilities();
  }
}

function tempBack () {
  for (var i = 0; i < moveStack.length; i++) {
    if (moveStack.at(i)[1] == game.fen()) {
      var attemptedMove = game.undo();
      board.position(game.fen());
      pgnArea.innerHTML = pgnHighlight(displayPGN);
      if (game.fen() in newRep) {
        if (game.turn() != playingColor) {
          for (let potentialMove of newRep[game.fen()]) {
            if (potentialMove[0] == attemptedMove.san) {
              variationProbability /= potentialMove[2] / 100;
            }
          }
        }
        variationArea.innerHTML = "<b>Current variation (" + String(Math.floor(10000 * variationProbability) / 100) + "%):</b>";
      } else {
        variationArea.innerHTML = "<b>Current variation:</b>"
      }
    }
  }
}

function tempForward () {
  if (game.fen() == "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    const toMake = String(moveStack.at(0)[0]);
    if (game.turn() != playingColor) {
      for (let potentialMove of newRep[game.fen()]) {
        if (potentialMove[0] == toMake) {
          variationProbability *= potentialMove[2] / 100;
        }
      }
    }
    game.move(toMake);
    board.position(game.fen());
    pgnArea.innerHTML = pgnHighlight(displayPGN);
    if (game.fen() in newRep) {
      variationArea.innerHTML = "<b>Current variation (" + String(Math.floor(10000 * variationProbability) / 100) + "%):</b>";
    } else {
      variationArea.innerHTML = "<b>Current variation:</b>"
    }
  } else {
    for (var i = 0; i < moveStack.length; i++) {
      if (moveStack.at(i)[1] === game.fen()) {
        const toMake = String(moveStack.at(i + 1)[0]);
        if (game.turn() != playingColor) {
          for (let potentialMove of newRep[game.fen()]) {
            if (potentialMove[0] == toMake) {
              variationProbability *= potentialMove[2] / 100;
            }
          }
        }
        game.move(toMake);
        board.position(game.fen());
        pgnArea.innerHTML = pgnHighlight(displayPGN);
        if (game.fen() in newRep) {
          variationArea.innerHTML = "<b>Current variation (" + String(Math.floor(10000 * variationProbability) / 100) + "%):</b>";
        } else {
          variationArea.innerHTML = "<b>Current variation:</b>"
        }
        break;
      }
    }
  }
}

function customReset () {
  variationProbability = 1.0;
  game.reset();
  board.position(game.fen())
  savedArea.innerHTML = "";
  moveStack = [];
  displayPGN = '';
  pgnArea.innerHTML = "";
  variationArea.innerHTML = "<b>Current variation (" + String(Math.floor(100 * variationProbability)) + "%):</b>";
  displayKnownMoves();
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
  onChange: onChange,
  onMouseoverSquare: onMouseoverSquare
}
board = Chessboard('testBoard', config)

updateStatus()

variationArea.innerHTML = "<b>Current variation (" + String(Math.floor(100 * variationProbability)) + "%):</b>";

if (playingColor == "b") {
  board.orientation("black")
}

displayKnownMoves();

displayProbabilities();

deleteBtn.addEventListener("click", evt => {
  deleteSubsequentMoves(newRep, game.fen());
  displayKnownMoves();
});

saveBtn.addEventListener("click", evt => {
  saveRep();
});

resetBtn.addEventListener("click", evt => {
  customReset();
});

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




