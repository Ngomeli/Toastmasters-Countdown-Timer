// script.js
document.addEventListener('DOMContentLoaded', () => {
  // ============================
  // State
  // ============================
  let timer = null;
  let elapsedSeconds = 0;
  let isRunning = false;
  let allocatedSeconds = 0;

  // Thresholds (in seconds)
  let greenThreshold = 0;
  let yellowThreshold = 0;
  let redThreshold = 0;

  // DOM refs
  const timeDisplay = document.getElementById("timeDisplay");
  const allocatedDisplay = document.getElementById("allocatedDisplay");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resumeBtn = document.getElementById("resumeBtn");
  const stopBtn = document.getElementById("stopBtn");
  const resetBtn = document.getElementById("resetBtn");
  const demoBtn = document.getElementById("demoBtn");
  const customBtn = document.getElementById("customBtn");
  const speechButtons = document.querySelectorAll(".speech-btn");

  // Modal
  const customModal = document.getElementById("customModal");
  const modalCancel = document.getElementById("modalCancel");
  const modalSet = document.getElementById("modalSet");
  const customMinutes = document.getElementById("customMinutes");
  const customSeconds = document.getElementById("customSeconds");

  // Safe event helper
  function safeOn(el, evt, fn) {
    if (el) el.addEventListener(evt, fn);
  }

  // Format seconds → MM:SS or HH:MM:SS
  function formatSeconds(sec) {
    sec = Math.max(0, Math.floor(sec));
    const s = sec % 60;
    const m = Math.floor(sec / 60);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  // ============================
  // Toastmasters Threshold Rules
  // ============================
  function setThresholds(type) {
    switch (type) {
      case "2-3": // Table Topics / Evaluation
        greenThreshold = 2 * 60;
        yellowThreshold = 2 * 60 + 30;
        redThreshold = 3 * 60;
        break;

      case "5-7": // Prepared Speech
        greenThreshold = 5 * 60;
        yellowThreshold = 6 * 60;
        redThreshold = 7 * 60;
        break;

      case "4-6": // Ice Breaker Speech
        greenThreshold = 4 * 60;
        yellowThreshold = 5 * 60;
        redThreshold = 6 * 60;
        break;

      case "custom": // Custom uses percentages
        greenThreshold = Math.round(allocatedSeconds * 0.75);
        yellowThreshold = Math.round(allocatedSeconds * 0.90);
        redThreshold = allocatedSeconds;
        break;

      default:
        greenThreshold = yellowThreshold = redThreshold = 0;
    }
  }

  // ============================
  // Rendering
  // ============================
  function render() {
    timeDisplay.textContent = formatSeconds(elapsedSeconds);

    if (!allocatedSeconds) {
      allocatedDisplay.textContent = "Allocated: —";
      document.body.style.backgroundImage = "url('images/toastmasters-zoom-virtual-logo.jpg')";
      return;
    }

    allocatedDisplay.textContent = `Allocated: ${formatSeconds(allocatedSeconds)}`;

    if (elapsedSeconds >= redThreshold) {
      document.body.style.backgroundImage = "url('images/red.jpg')";
    } else if (elapsedSeconds >= yellowThreshold) {
      document.body.style.backgroundImage = "url('images/yellow.jpg')";
    } else if (elapsedSeconds >= greenThreshold) {
      document.body.style.backgroundImage = "url('images/green.jpg')";
    } else {
      document.body.style.backgroundImage = "url('images/toastmasters-zoom-virtual-logo.jpg')";
    }
  }

  // ============================
  // Timer Functions
  // ============================
  function tick() {
    elapsedSeconds++;
    render();
  }

  function startTimer() {
    if (isRunning) return;
    if (!allocatedSeconds) {
      alert("Please choose a preset or set a custom time.");
      return;
    }
    isRunning = true;
    timer = setInterval(tick, 1000);
    render();
  }

  function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timer);
    timer = null;
    isRunning = false;
  }

  function resumeTimer() {
    if (isRunning || !allocatedSeconds) return;
    isRunning = true;
    timer = setInterval(tick, 1000);
  }

  function stopTimer() {
  pauseTimer();              // fully stop timer
  elapsedSeconds = 0;        // reset elapsed
  document.body.style.backgroundImage = "url('images/toastmasters-zoom-virtual-logo.jpg')";
  render();                  // update screen
}


  function resetTimer() {
    pauseTimer();
    elapsedSeconds = 0;
    render();
  }

  // ============================
  // Preset Selection
  // ============================
  function selectPreset(type) {
    switch (type) {
      case "2-3":
        allocatedSeconds = 3 * 60; // Max time
        break;

      case "5-7":
        allocatedSeconds = 7 * 60; // Max time
        break;

      case "4-6":
        allocatedSeconds = 6 * 60; // Max time
        break;

      default:
        allocatedSeconds = 0;
    }

    setThresholds(type);
    elapsedSeconds = 0;
    pauseTimer();
    render();
  }

  // ============================
  // Demo Mode
  // ============================
  function runDemo() {
    allocatedSeconds = 20;
    greenThreshold = 5;
    yellowThreshold = 10;
    redThreshold = 15;

    elapsedSeconds = 0;
    pauseTimer();
    render();
    startTimer();
  }

  // ============================
  // Custom Modal
  // ============================
  function openCustomModal() {
    customMinutes.value = "";
    customSeconds.value = "";
    customModal.classList.remove("hidden");
    customMinutes.focus();
  }

  function closeCustomModal() {
    customModal.classList.add("hidden");
  }

  function setCustomDuration() {
    const mins = parseInt(customMinutes.value || "0");
    const secs = parseInt(customSeconds.value || "0");

    if (isNaN(mins) || isNaN(secs) || mins < 0 || secs < 0 || secs > 59) {
      alert("Enter a valid time.");
      return;
    }

    allocatedSeconds = mins * 60 + secs;
    if (allocatedSeconds <= 0) {
      alert("Duration must be greater than zero.");
      return;
    }

    setThresholds("custom");
    elapsedSeconds = 0;
    pauseTimer();
    closeCustomModal();
    render();
  }

  // ============================
  // Event Listeners
  // ============================
  safeOn(startBtn, "click", startTimer);
  safeOn(pauseBtn, "click", pauseTimer);
  safeOn(resumeBtn, "click", resumeTimer);
  safeOn(stopBtn, "click", stopTimer);
  safeOn(resetBtn, "click", resetTimer);
  safeOn(demoBtn, "click", runDemo);
  safeOn(customBtn, "click", openCustomModal);

  // Speech type buttons
  speechButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      speechButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectPreset(btn.dataset.type);
    });
  });

  // Modal actions
  safeOn(modalCancel, "click", closeCustomModal);
  safeOn(modalSet, "click", setCustomDuration);

  // Enter key inside modal
  customModal.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      setCustomDuration();
    } else if (e.key === "Escape") {
      closeCustomModal();
    }
  });

  // Default load preset
  selectPreset("2-3");
});


// ============================
// Fullscreen Toggle (unchanged)
// ============================
const fullscreenBtn = document.getElementById("fullscreenBtn");

fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenBtn.textContent = "Exit Fullscreen";
  } else {
    document.exitFullscreen();
    fullscreenBtn.textContent = "Fullscreen";
  }
});

document.addEventListener("fullscreenchange", () => {
  fullscreenBtn.textContent =
    document.fullscreenElement ? "Exit Fullscreen" : "Fullscreen";
});
