// ============================
// Toastmasters Countdown Timer – FINAL
// ============================

document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // State
  // ============================
  let timer = null;
  let elapsedSeconds = 0;
  let isRunning = false;
  let allocatedSeconds = 0;
  let currentCategory = "";
  let currentColour = "Green";

  const timerLog = [];

  // Thresholds
  let greenThreshold = 0;
  let yellowThreshold = 0;
  let redThreshold = 0;

  // ============================
  // DOM Elements
  // ============================
  const timeDisplay = document.getElementById("timeDisplay");
  const allocatedDisplay = document.getElementById("allocatedDisplay");

  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resumeBtn = document.getElementById("resumeBtn");
  const stopBtn = document.getElementById("stopBtn");
  const resetBtn = document.getElementById("resetBtn");
  const demoBtn = document.getElementById("demoBtn");
  const customBtn = document.getElementById("customBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const reportBtn = document.getElementById("reportBtn");

  const speechButtons = document.querySelectorAll(".speech-btn");

  // Modal
  const customModal = document.getElementById("customModal");
  const modalCancel = document.getElementById("modalCancel");
  const modalSet = document.getElementById("modalSet");
  const customMinutes = document.getElementById("customMinutes");
  const customSeconds = document.getElementById("customSeconds");

  // Speaker input
  const speakerNameInput = document.getElementById("speakerName");

  // ============================
  // Helpers
  // ============================
  const safeOn = (el, evt, fn) => el && el.addEventListener(evt, fn);

  function formatSeconds(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  // ============================
  // Threshold Rules
  // ============================
  function setThresholds(type) {
    currentCategory = type;

    if (type === "2-3") {
      greenThreshold = 120;
      yellowThreshold = 150;
      redThreshold = 180;
      allocatedSeconds = 180;
    }
    else if (type === "5-7") {
      greenThreshold = 300;
      yellowThreshold = 360;
      redThreshold = 420;
      allocatedSeconds = 420;
    }
    else if (type === "4-6") {
      greenThreshold = 240;
      yellowThreshold = 300;
      redThreshold = 360;
      allocatedSeconds = 360;
    }
    else if (type === "custom") {
      greenThreshold = Math.round(allocatedSeconds * 0.75);
      yellowThreshold = Math.round(allocatedSeconds * 0.9);
      redThreshold = allocatedSeconds;
    }
  }

  // ============================
  // Rendering
  // ============================
  function render() {
    timeDisplay.textContent = formatSeconds(elapsedSeconds);
    allocatedDisplay.textContent = allocatedSeconds
      ? `Allocated: ${formatSeconds(allocatedSeconds)}`
      : "Allocated: —";

    if (elapsedSeconds >= redThreshold) {
      document.body.style.backgroundImage = "url('images/red.jpg')";
      currentColour = "Red";
    } else if (elapsedSeconds >= yellowThreshold) {
      document.body.style.backgroundImage = "url('images/yellow.jpg')";
      currentColour = "Yellow";
    } else if (elapsedSeconds >= greenThreshold) {
      document.body.style.backgroundImage = "url('images/green.jpg')";
      currentColour = "Green";
    } else {
      document.body.style.backgroundImage =
        "url('images/toastmasters-zoom-virtual-logo.jpg')";
      currentColour = "Green";
    }
  }

  // ============================
  // Timer Core
  // ============================
  function tick() {
    elapsedSeconds++;
    render();
  }

  function startTimer() {
    if (isRunning || !allocatedSeconds) return;
    isRunning = true;
    timer = setInterval(tick, 1000);
  }

  function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timer);
    isRunning = false;
  }

  function resumeTimer() {
    if (isRunning || !allocatedSeconds) return;
    isRunning = true;
    timer = setInterval(tick, 1000);
  }

  function stopTimer() {
    pauseTimer();

    const name = speakerNameInput.value.trim() || "Unknown Speaker";

    timerLog.push({
      name,
      category: resolveCategoryName(),
      actualSeconds: elapsedSeconds,
      colour: currentColour
    });

    elapsedSeconds = 0;
    render();
  }

  function resetTimer() {
    pauseTimer();
    elapsedSeconds = 0;
    render();
  }

  // ============================
  // Category Name Mapping
  // ============================
  function resolveCategoryName() {
    if (currentCategory === "2-3") return "Evaluators / Table Topics (2–3 min)";
    if (currentCategory === "5-7") return "Prepared Speech (5–7 min)";
    if (currentCategory === "4-6") return "Ice Breaker Speech (4–6 min)";
    return "Custom Speech";
  }

  // ============================
  // Custom Modal
  // ============================
  function openCustomModal() {
    customModal.classList.remove("hidden");
    customMinutes.focus();
  }

  function closeCustomModal() {
    customModal.classList.add("hidden");
  }

  function setCustomDuration() {
    const mins = parseInt(customMinutes.value || 0);
    const secs = parseInt(customSeconds.value || 0);

    allocatedSeconds = mins * 60 + secs;
    if (allocatedSeconds <= 0) return alert("Invalid time");

    setThresholds("custom");
    elapsedSeconds = 0;
    closeCustomModal();
    render();
  }

  // ============================
  // PDF REPORT
  // ============================
  function generatePDF() {
    if (!window.jspdf) return alert("jsPDF not loaded");

    if (!timerLog.length) {
      alert("No timer data to export");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(0, 91, 170);
    doc.rect(0, 0, 210, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("Toastmasters Timers Report", 14, 12);

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`Meeting Date: ${new Date().toLocaleDateString()}`, 14, 26);

    let y = 36;
    const grouped = {};

    timerLog.forEach(e => {
      grouped[e.category] = grouped[e.category] || [];
      grouped[e.category].push(e);
    });

    Object.keys(grouped).forEach(cat => {
      doc.setFontSize(13);
      doc.text(cat, 14, y);
      y += 6;

      grouped[cat].forEach(e => {
        doc.setFontSize(11);
        doc.text(
          `${e.name} — ${formatSeconds(e.actualSeconds)} (${e.colour})`,
          18,
          y
        );
        y += 6;
      });

      y += 6;
    });

    doc.save("Toastmasters_Timer_Report.pdf");
  }

  // ============================
  // Events
  // ============================
  safeOn(startBtn, "click", startTimer);
  safeOn(pauseBtn, "click", pauseTimer);
  safeOn(resumeBtn, "click", resumeTimer);
  safeOn(stopBtn, "click", stopTimer);
  safeOn(resetBtn, "click", resetTimer);
  safeOn(demoBtn, "click", () => {
    allocatedSeconds = 20;
    greenThreshold = 5;
    yellowThreshold = 10;
    redThreshold = 15;
    elapsedSeconds = 0;
    startTimer();
  });
  safeOn(customBtn, "click", openCustomModal);
  safeOn(modalCancel, "click", closeCustomModal);
  safeOn(modalSet, "click", setCustomDuration);
  safeOn(reportBtn, "click", generatePDF);

  speechButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      speechButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setThresholds(btn.dataset.type);
      elapsedSeconds = 0;
      pauseTimer();
      render();
    });
  });

});

// ============================
// Fullscreen (outside DOMContentLoaded)
// ============================
const fullscreenBtn = document.getElementById("fullscreenBtn");

fullscreenBtn?.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullscreenBtn.textContent = "Exit Fullscreen";
  } else {
    document.exitFullscreen();
    fullscreenBtn.textContent = "Fullscreen";
  }
});
