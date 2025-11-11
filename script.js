let timer;
let elapsedTime = 0;
let isRunning = false;
let greenTime, yellowTime, redTime;
let selectedType = "1-2"; // default

const timeDisplay = document.getElementById("timeDisplay");
const speechButtons = document.getElementById("speechButtons");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

function setTimes() {
  switch (selectedType) {
    case "1-2": // Evaluation
      greenTime = 1 * 60;
      yellowTime = 1.5 * 60;
      redTime = 2 * 60;
      break;
    case "2-3": // Table Topic
      greenTime = 2 * 60;
      yellowTime = 2.5 * 60;
      redTime = 3 * 60;
      break;
    case "4-6": // Prepared Speech
      greenTime = 4 * 60;
      yellowTime = 5 * 60;
      redTime = 6 * 60;
      break;
    case "5": // General Evaluator Report (fixed 5 min)
      greenTime = 4 * 60;
      yellowTime = 4.5 * 60;
      redTime = 5 * 60;
      break;
    default:
      greenTime = yellowTime = redTime = 0;
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

// Handle speech-type button clicks
speechButtons.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    selectedType = e.target.dataset.type;

    // highlight selected button
    document.querySelectorAll("#speechButtons button").forEach(btn =>
      btn.classList.remove("active")
    );
    e.target.classList.add("active");

    resetTimer();
  }
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

setTimes();
