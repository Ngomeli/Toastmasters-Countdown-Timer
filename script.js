// script.js
document.addEventListener('DOMContentLoaded', () => {
  // State
  let timer = null;
  let elapsedSeconds = 0;
  let isRunning = false;
  let allocatedSeconds = 0; // total allocated session seconds (target)
  let greenThreshold = 0;
  let yellowThreshold = 0;
  let redThreshold = 0;

  // DOM refs
  const timeDisplay = document.getElementById("timeDisplay");
  const allocatedDisplay = document.getElementById("allocatedDisplay");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resumeBtn = document.getElementById("resumeBtn");
  const resetBtn = document.getElementById("resetBtn");
  const demoBtn = document.getElementById("demoBtn");
  const customBtn = document.getElementById("customBtn");
  const speechButtons = document.querySelectorAll(".speech-btn");

  // Modal elements
  const customModal = document.getElementById("customModal");
  const modalCancel = document.getElementById("modalCancel");
  const modalSet = document.getElementById("modalSet");
  const customMinutes = document.getElementById("customMinutes");
  const customSeconds = document.getElementById("customSeconds");

  // Safe event attach helper
  function safeOn(el, evt, handler) {
    if (!el) return;
    el.addEventListener(evt, handler);
  }

  // Format seconds -> HH:MM:SS or MM:SS
  function formatSeconds(sec) {
    sec = Math.max(0, Math.floor(sec));
    const s = sec % 60;
    const totalMinutes = Math.floor(sec / 60);
    const m = totalMinutes % 60;
    const h = Math.floor(totalMinutes / 60);
    const ss = String(s).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    if (h > 0) {
      return `${String(h).padStart(2,'0')}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  // Update allocated thresholds from allocatedSeconds
  function setThresholds() {
    greenThreshold = Math.round(allocatedSeconds * 0.75);
    yellowThreshold = Math.round(allocatedSeconds * 0.90);
    redThreshold = Math.round(allocatedSeconds * 1.00);
  }

  // Update time display & background image based on progress
  function render() {
    timeDisplay.textContent = formatSeconds(elapsedSeconds);

    // Default background if no allocation
    if (!allocatedSeconds || allocatedSeconds <= 0) {
      document.body.style.backgroundImage = "url('images/toastmasters-zoom-virtual-logo.jpg')";
      allocatedDisplay.textContent = `Allocated: —`;
      return;
    }

    // Show allocated nicely
    allocatedDisplay.textContent = `Allocated: ${formatSeconds(allocatedSeconds)}`;

    // Decide background image by thresholds (note: continues past red)
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

  // Main tick: update elapsed and render
  function tick() {
    elapsedSeconds++;
    render();
  }

  // Controls
  function startTimer() {
    if (isRunning) return;
    if (!allocatedSeconds || allocatedSeconds <= 0) {
      alert("Please choose a preset or set a custom duration first.");
      return;
    }
    isRunning = true;
    // If first start and elapsed is 0, keep it; if starting after pause uses current elapsed
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
    if (isRunning) return;
    if (!allocatedSeconds || allocatedSeconds <= 0) {
      alert("Please choose a preset or set a custom duration first.");
      return;
    }
    isRunning = true;
    timer = setInterval(tick, 1000);
  }

  function resetTimer() {
    pauseTimer();
    elapsedSeconds = 0;
    // Keep allocatedSeconds as-is (so user doesn't lose their selected duration)
    render();
  }

  // Speech preset selection
  function selectPreset(type) {
    // Defaults: allocate the "max" for that category (so 2-3 => 3min, 5-7 => 7min)
    switch (type) {
      case "2-3":
        allocatedSeconds = 3 * 60;
        break;
      case "5-7":
        allocatedSeconds = 7 * 60;
        break;
      default:
        allocatedSeconds = 0;
    }
    setThresholds();
    elapsedSeconds = 0;
    pauseTimer();
    render();
  }

  // Demo quick run (short thresholds) - continues after red so you can see overtime
  function runDemo() {
    allocatedSeconds = 20; // 20 seconds demo total
    setThresholds();
    elapsedSeconds = 0;
    pauseTimer();
    render();
    startTimer();
  }

  // Custom modal behavior
  function openCustomModal() {
    // Clear inputs to friendly defaults
    customMinutes.value = "";
    customSeconds.value = "";
    customModal.classList.remove('hidden');
    // Optional: focus minutes
    customMinutes.focus();
  }

  function closeCustomModal() {
    customModal.classList.add('hidden');
  }

  function setCustomDurationFromModal() {
    const mins = parseInt(customMinutes.value || "0", 10);
    const secs = parseInt(customSeconds.value || "0", 10);
    if (isNaN(mins) || isNaN(secs) || mins < 0 || secs < 0 || secs > 59) {
      alert("Please enter valid minutes (>=0) and seconds (0-59).");
      return;
    }
    allocatedSeconds = mins * 60 + secs;
    if (allocatedSeconds <= 0) {
      alert("Please enter a duration greater than 0.");
      return;
    }
    setThresholds();
    elapsedSeconds = 0;
    pauseTimer();
    closeCustomModal();
    render();
  }

  // Attach events safely
  safeOn(startBtn, 'click', startTimer);
  safeOn(pauseBtn, 'click', pauseTimer);
  safeOn(resumeBtn, 'click', resumeTimer);
  safeOn(resetBtn, 'click', resetTimer);
  safeOn(demoBtn, 'click', runDemo);
  safeOn(customBtn, 'click', openCustomModal);

  // Speech buttons selection wiring
  if (speechButtons && speechButtons.length) {
    speechButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        speechButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectPreset(btn.dataset.type);
      });
    });
  }

  // Modal buttons
  safeOn(modalCancel, 'click', () => closeCustomModal());
  safeOn(modalSet, 'click', setCustomDurationFromModal);

  // Keyboard: allow Enter to set when modal open
  safeOn(customModal, 'keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCustomDurationFromModal();
    } else if (e.key === 'Escape') {
      closeCustomModal();
    }
  });

  // Initialize with default preset (2-3)
  selectPreset("2-3");
});
