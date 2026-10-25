const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startButton = document.getElementById("start-btn");
const feedback = document.getElementById("feedback");

const winningMessages = [
  "Amazing! You helped collect clean water.",
  "Great catch! Every drop counts.",
  "Water hero! You reached 20 points."
];

const losingMessages = [
  "So close! Try again and collect 20 points.",
  "Keep practicing. Clean water is worth the effort!",
  "Round complete. Give it another splash!"
];

let score = 0;
let timeLeft = 30;
let gameRunning = false;
let dropMaker;
let countdown;

startButton.addEventListener("click", startGame);

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  startButton.disabled = true;
  startButton.textContent = "Game in progress";
  feedback.textContent = "Catch the blue drops!";
  feedback.className = "";
  gameContainer.querySelectorAll(".water-drop").forEach(drop => drop.remove());

  createDrop();
  dropMaker = setInterval(createDrop, 800);
  countdown = setInterval(() => {
    timeLeft -= 1;
    timeDisplay.textContent = timeLeft;

    if (timeLeft === 0) endGame();
  }, 1000);
}

function createDrop() {
  if (!gameRunning) return;

  const drop = document.createElement("button");
  const isBadDrop = Math.random() < 0.25;
  const size = Math.floor(Math.random() * 24) + 48;
  const maxLeft = Math.max(0, gameContainer.clientWidth - size);

  drop.type = "button";
  drop.className = isBadDrop ? "water-drop bad-drop" : "water-drop clean-drop";
  drop.setAttribute("aria-label", isBadDrop ? "Dirty water drop" : "Clean water drop");
  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;
  drop.style.left = `${Math.random() * maxLeft}px`;
  drop.style.setProperty("--fall-distance", `${gameContainer.clientHeight + 72}px`);
  drop.style.animationDuration = `${Math.random() * 1.5 + 3}s`;

  drop.addEventListener("click", () => collectDrop(drop, isBadDrop));
  drop.addEventListener("animationend", () => drop.remove());
  gameContainer.appendChild(drop);
}

function collectDrop(drop, isBadDrop) {
  if (!gameRunning || drop.classList.contains("collected")) return;

  drop.classList.add("collected");
  score += isBadDrop ? -2 : 1;
  score = Math.max(0, score);
  scoreDisplay.textContent = score;
  feedback.textContent = isBadDrop ? "Dirty water! -2 points" : "Clean water! +1 point";
  feedback.className = isBadDrop ? "negative" : "positive";
  drop.remove();
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(countdown);
  gameContainer.querySelectorAll(".water-drop").forEach(drop => drop.remove());

  const messages = score >= 20 ? winningMessages : losingMessages;
  feedback.textContent = messages[Math.floor(Math.random() * messages.length)];
  feedback.className = score >= 20 ? "positive" : "negative";
  startButton.disabled = false;
  startButton.textContent = "Play Again";
}
