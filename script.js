// FULL ADVANCED script.js FOR MEMORY GAME

let cardsArray = [
  { name: "apple", img: "apple.png" },
  { name: "mango", img: "mango.png" },
  { name: "watermelon", img: "watermelon.png" },
  { name: "grapes", img: "grapes.png" },
  { name: "pineapple", img: "pineapple.png" },
  { name: "strawberry", img: "strawberry.png" },
];

let firstCard = "";
let secondCard = "";
let clickCount = 0;
let moves = 0;
let timerInterval;
let seconds = 0;
let totalPairs = 6;

const parentDiv = document.querySelector("#card-section");
const movesDisplay = document.querySelector("#moves");
const timerDisplay = document.querySelector("#timer");
const modal = document.getElementById("win-modal");
const finalTime = document.getElementById("final-time");
const finalMoves = document.getElementById("final-moves");
const finalStars = document.getElementById("final-stars");

// --- Sound Effects ---
const clickSound = new Audio("click.wav");
const matchSound = new Audio("match.wav");
const wrongSound = new Audio("wrong.wav");

function playSound(type) {
  if (type === "click") clickSound.play();
  else if (type === "match") matchSound.play();
  else wrongSound.play();
}

// --- High Score ---
function saveHighScore() {
  const best = JSON.parse(localStorage.getItem("memoryHighScore"));
  const newScore = { moves, time: seconds };

  if (
    !best ||
    newScore.moves < best.moves ||
    (newScore.moves === best.moves && newScore.time < best.time)
  ) {
    localStorage.setItem("memoryHighScore", JSON.stringify(newScore));
  }
}

function showHighScore() {
  const best = JSON.parse(localStorage.getItem("memoryHighScore"));
  if (best) {
    const hs = document.createElement("p");
    hs.textContent = `\u{1F3C6} Best: ${best.moves} moves in ${best.time}s`;
    document.querySelector(".stats").appendChild(hs);
  }
}

// --- Timer Functions ---
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    timerDisplay.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateMoves() {
  moves++;
  movesDisplay.textContent = moves;
}

function resetCards() {
  firstCard = "";
  secondCard = "";
  clickCount = 0;
  const selected = document.querySelectorAll(".card_selected");
  selected.forEach((el) => el.classList.remove("card_selected"));
}

function markAsMatched() {
  const selected = document.querySelectorAll(".card_selected");
  selected.forEach((el) => el.classList.add("card_match"));
}

function checkWin() {
  const matched = document.querySelectorAll(".card_match");
  if (matched.length === totalPairs * 2) {
    stopTimer();
    saveHighScore();
    setTimeout(() => {
      showWinModal();
    }, 500);
  }
}

function showWinModal() {
  modal.classList.remove("hidden");
  finalTime.textContent = timerDisplay.textContent;
  finalMoves.textContent = moves;
  finalStars.textContent =
    moves <= totalPairs * 2
      ? "\u2B50\u2B50\u2B50"
      : moves <= totalPairs * 3
      ? "\u2B50\u2B50"
      : "\u2B50";
}

function restartGame() {
  location.reload();
}

// --- Shuffle ---
const shuffle = (array) => array.sort(() => 0.5 - Math.random());

// --- Difficulty ---
const difficultyButtons = document.querySelectorAll(
  ".difficulty-selector button"
);
difficultyButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const level = e.target.dataset.difficulty;
    if (level === "easy") totalPairs = 6;
    if (level === "medium") totalPairs = 8;
    if (level === "hard") totalPairs = 12;
    startGame();
  });
});

// --- Dark Mode ---
document.getElementById("darkToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

// --- Card Click Logic ---
parentDiv.addEventListener("click", (event) => {
  const curCard = event.target.closest(".card");
  if (
    !curCard ||
    curCard.classList.contains("card_match") ||
    curCard.classList.contains("card_selected")
  )
    return;

  playSound("click");
  if (moves === 0 && seconds === 0) startTimer();

  clickCount++;
  curCard.classList.add("card_selected");

  if (clickCount === 1) {
    firstCard = curCard.dataset.name;
  } else if (clickCount === 2) {
    secondCard = curCard.dataset.name;
    updateMoves();

    if (firstCard === secondCard) {
      setTimeout(() => {
        markAsMatched();
        playSound("match");
        resetCards();
        checkWin();
      }, 600);
    } else {
      setTimeout(() => {
        playSound("wrong");
        resetCards();
      }, 700);
    }
  }
});

// --- Start Game ---
function startGame() {
  parentDiv.innerHTML = "";
  firstCard = "";
  secondCard = "";
  clickCount = 0;
  moves = 0;
  seconds = 0;
  movesDisplay.textContent = "0";
  timerDisplay.textContent = "00:00";
  clearInterval(timerInterval);

  let gameSet = shuffle(cardsArray).slice(0, totalPairs);
  const gameCards = shuffle([...gameSet, ...gameSet]);

  if (totalPairs === 6 || totalPairs === 8)
    parentDiv.style.gridTemplateColumns = "repeat(4, 1fr)";
  if (totalPairs === 12) parentDiv.style.gridTemplateColumns = "repeat(6, 1fr)";

  gameCards.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.dataset.name = card.name;

    const front = document.createElement("div");
    front.classList.add("front-card");

    const back = document.createElement("div");
    back.classList.add("back-card");
    back.style.backgroundImage = `url(${card.img})`;

    cardDiv.appendChild(front);
    cardDiv.appendChild(back);
    parentDiv.appendChild(cardDiv);
  });

  showHighScore();
}

// --- Restart Button ---
document.getElementById("restartBtn").addEventListener("click", restartGame);

// --- Load Game ---
startGame();
