const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;

const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("gameover-screen");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");
const replayBtn = document.getElementById("replay-btn");
const scoreDisplay = document.getElementById("score");
const highDisplay = document.getElementById("highscore");
const finalScore = document.getElementById("final-score");

let snake, direction, food, score, game, speed;

const highscoreKey = "snakeHighScore";
let highscore = localStorage.getItem(highscoreKey) || 0;
highDisplay.textContent = highscore;

function init() {
  snake = [{ x: 10 * box, y: 10 * box }];
  direction = "RIGHT";
  food = randomFood();
  score = 0;
  speed = 150;
  scoreDisplay.textContent = score;
  clearInterval(game);
  game = setInterval(draw, speed);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  init();
});

replayBtn.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  init();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#00ff99" : "#00cc77";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "#ff0066";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  if (headX === food.x && headY === food.y) {
    score++;
    scoreDisplay.textContent = score;
    food = randomFood();

    if (score % 5 === 0 && speed > 70) {
      clearInterval(game);
      speed -= 10;
      game = setInterval(draw, speed);
    }
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  if (
    headX < 0 ||
    headX >= canvas.width ||
    headY < 0 ||
    headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    gameOver();
    return;
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  return array.some((part) => part.x === head.x && part.y === head.y);
}

function gameOver() {
  gameContainer.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  finalScore.textContent = score;

  if (score > highscore) {
    highscore = score;
    localStorage.setItem(highscoreKey, score);
    highDisplay.textContent = highscore;
  }
}
