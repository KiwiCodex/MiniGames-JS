let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

const ballRadius = 10;

let ballColour = "#0095DD";

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

const interval = setInterval(draw, 10);

let brickRowCount = 4;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
};

let score = 0;

let endGame = document.getElementById('endGame');
let reset = document.getElementById('reset');
const resetContainer = document.querySelector(".reset-container");  


function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};


function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          changeBallColour()
          score++;
          document.getElementById('score').innerHTML = score;

        }
      }
    }
  }
};

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};


function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColour;
  ctx.fill();
}

function changeBallColour() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  ballColour = `rgb(${r}, ${g}, ${b})`;
};

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
};

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
};


function ballSpeed() {
  dx *= 1.01;
  dy *= 1.01;
  shuffleBricks();
}

function shuffleBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 0;
    }
  }

  var maxBricks = Math.min(brickColumnCount * brickRowCount, 5); // Número máximo de ladrillos (5x5)
  var count = 0;

  while (count < maxBricks) {
    var c = Math.floor(Math.random() * brickColumnCount);
    var r = Math.floor(Math.random() * brickRowCount);
    if (bricks[c][r].status == 0) {
      bricks[c][r].status = 1;
      count++;
    }
  }
}



function draw() {
  resetContainer.style.display = "none";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection()

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    changeBallColour();
  }

  if (y + dy < ballRadius) {
    dy = -dy;
    changeBallColour();
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      changeBallColour();
      ballSpeed();
    } else {
      showResetButton();
      endGame.innerText = "Game Over, restart?";      
      clearInterval(interval);
    }
  }


  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  }
  else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }


  x += dx;
  y += dy;
}

function showResetButton() {
  resetContainer.style.display = "block";
}

reset.addEventListener("click", clear);

function clear() {
  endGame.innerText = "";
  score = 0;
  document.getElementById('score').innerHTML = score;
  document.location.reload();
  draw();
}