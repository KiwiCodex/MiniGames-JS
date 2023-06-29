var currentPlayer = 'X';
var boxes = document.querySelectorAll(".box");
var player = document.getElementById("player");
var winner = document.getElementById("winner");
var reset = document.getElementById('reset');

const winnerPos = ['012', '345', '678', '036', '147', '258', '048', '246'];

boxes.forEach(box => box.addEventListener("click", playerClick));

function isWinner() {
  for (let pos of winnerPos) {

    let pos1 = boxes[pos[0]].innerText;
    let pos2 = boxes[pos[1]].innerText;
    let pos3 = boxes[pos[2]].innerText;

    if (pos1 == currentPlayer && pos2 == currentPlayer && pos3 == currentPlayer) {
      return true;
    }
  }
  return false;
}


function playerClick(event) {
  if (event.target.innerText != '' || winner.innerText != '') {
    return;
  }
  event.target.innerText = currentPlayer;

  if (isWinner()) {
    winner.innerText = 'Player: ' + currentPlayer + ' Wins!!!';
  }
  else {
    currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
    player.innerText = 'Current Player: ' + currentPlayer;
  }
  if(isDraw()){
    winner.innerText = "DRAW!"
  }
}

function isDraw() {
    let draw = true;
    for (let box of boxes) {
        draw = draw && box.innerText != '';
    }
    return draw;
}

reset.addEventListener("click", clear);

function clear() {
    winner.innerText = "";
    currentPlayer = 'X';
    player.innerText = "Current Player: " + currentPlayer;
    boxes.forEach(box => box.innerText = "");
}