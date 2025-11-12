let timer;
let elapsedTime = 0;
let isRunning = false;
let greenTime, yellowTime, redTime;

// Get elements
const timeDisplay = document.getElementById("timeDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const demoBtn = document.getElementById("demoBtn");
const guestBtn = document.getElementById("guestBtn");
const speechButtons = document.querySelectorAll(".speech-btn");

let selectedType = "2-3-eval"; // default type

// Handle button clicks for speech type selection
speechButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active class from all, then set active on clicked one
    speechButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    selectedType = btn.getAttribute("data-type");
    resetTimer();
  });
});

function getSelectedSpeechType() {
  return selectedType;
}

// Set color change times
function setTimes() {
  const type = getSelectedSpeechType();

  switch (type) {
    case "2-3-eval": // Evaluation (2–3 min)
      greenTime = 2 * 60;
      yellowTime = 2.5 * 60;
      redTime = 3 * 60;
      break;

    case "2-3-table": // Table Topic (2–3 min)
      greenTime = 2 * 60;
      yellowTime = 2.5 * 60;
      redTime = 3 * 60;
      break;

    case "5-7-prep": // Prepared Speech (5–7 min)
      greenTime = 5 * 60;
      yellowTime = 6 * 60;
      redTime = 7 * 60;
      break;

    case "5-7-ge": // General Evaluator (5–7 min)
      greenTime = 5 * 60;
      yellowTime = 6 * 60;
      redTime = 7 * 60;
      break;

    default:
      greenTime = 0;
      yellowTime = 0;
      redTime = 0;
  }

  elapsedTime = 0;
  updateDisplay();
  document.body.style.backgroundImage = "url('images/default.png')";
}

// Update time display
function updateDisplay() {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Start timer function
function startTimer(customTimes = null) {
  if (isRunning) return;
  isRunning = true;

  const { gTime, yTime, rTime } = customTimes || {
    gTime: greenTime,
    yTime: yellowTime,
    rTime: redTime,
  };

  timer = setInterval(() => {
    elapsedTime++;
    updateDisplay();

    if (elapsedTime >= rTime) {
      document.body.style.backgroundImage = "url('images/red.jpg')";
    } else if (elapsedTime >= yTime) {
      document.body.style.backgroundImage = "url('images/yellow.jpg')";
    } else if (elapsedTime >= gTime) {
      document.body.style.backgroundImage = "url('images/green.jpg')";
    } else {
      document.body.style.backgroundImage = "url('images/default.png')";
    }

    // Auto-reset after demo ends
    if (customTimes && elapsedTime >= rTime) {
      setTimeout(() => resetTimer(), 2000);
    }
  }, 1000);
}

// Pause the timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

// Reset timer
function resetTimer() {
  pauseTimer();
  setTimes();
}

// Demo button (20 seconds)
function runDemo() {
  resetTimer();
  elapsedTime = 0;

  const demoTimes = {
    gTime: 10,
    yTime: 15,
    rTime: 20,
  };

  startTimer(demoTimes);
}

// Special Guest button (15–17 minutes)
function runGuestTimer() {
  resetTimer();
  elapsedTime = 0;

  const guestTimes = {
    gTime: 15 * 60,
    yTime: 16 * 60,
    rTime: 17 * 60,
  };

  startTimer(guestTimes);
}

// Event listeners
startBtn.addEventListener("click", () => startTimer());
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
demoBtn.addEventListener("click", runDemo);
guestBtn.addEventListener("click", runGuestTimer);

// Initialize
setTimes();
