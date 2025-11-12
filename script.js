let timer;
let elapsedTime = 0;
let isRunning = false;
let greenTime, yellowTime, redTime;

const timeDisplay = document.getElementById("timeDisplay");
const speechOptions = document.getElementsByName("speechType");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const demoBtn = document.getElementById("demoBtn"); // 👈 new demo button

function getSelectedSpeechType() {
  for (const option of speechOptions) {
    if (option.checked) return option.value;
  }
}

function setTimes() {
  const type = getSelectedSpeechType();

  switch (type) {
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

    case "5": // General Evaluator Report (5 min)
      greenTime = 4 * 60;
      yellowTime = 4.5 * 60;
      redTime = 5 * 60;
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

function updateDisplay() {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function startTimer(customTimes = null) {
  if (isRunning) return;
  isRunning = true;

  // Use custom times if provided (for demo)
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

    // Stop demo after 20s
    if (customTimes && elapsedTime >= rTime) {
      setTimeout(() => resetTimer(), 2000); // resets 2s after demo ends
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

// 🔹 Demo button function
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

// Listeners
speechOptions.forEach(option => option.addEventListener("click", resetTimer));
startBtn.addEventListener("click", () => startTimer());
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
demoBtn.addEventListener("click", runDemo); // 👈 demo button click

setTimes();
