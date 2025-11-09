let timer;
let elapsedTime = 0;
let isRunning = false;
let greenTime, yellowTime, redTime;

const timeDisplay = document.getElementById("timeDisplay");
const speechType = document.getElementById("speechType");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

function setTimes() {
  const type = speechType.value;

  if (type === "1-2") {
    greenTime = 1 * 60;
    yellowTime = 1.5 * 60;
    redTime = 2 * 60;
  } else if (type === "2-3") {
    greenTime = 2 * 60;
    yellowTime = 2.5 * 60;
    redTime = 3 * 60;
  } else {
    greenTime = 4 * 60;
    yellowTime = 5 * 60;
    redTime = 6 * 60;
  }

  elapsedTime = 0;
  updateDisplay();
  document.body.style.backgroundImage = "url('images/default.png')";
}

function updateDisplay() {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  timer = setInterval(() => {
    elapsedTime++;
    updateDisplay();

    if (elapsedTime >= redTime) {
      document.body.style.backgroundImage = "url('images/red.jpg')";
    } else if (elapsedTime >= yellowTime) {
      document.body.style.backgroundImage = "url('images/yellow.jpg')";
    } else if (elapsedTime >= greenTime) {
      document.body.style.backgroundImage = "url('images/green.jpg')";
    } else {
      document.body.style.backgroundImage = "url('images/default.png')";
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  pauseTimer();
  setTimes();
}

speechType.addEventListener("change", resetTimer);
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

setTimes();
