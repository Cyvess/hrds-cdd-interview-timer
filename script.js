(() => {
  const form = document.querySelector("#timer-form");
  const controls = document.querySelector("#controls");
  const minutesInput = document.querySelector("#minutes");
  const decreaseButton = document.querySelector("#decrease");
  const increaseButton = document.querySelector("#increase");
  const presets = [...controls.querySelectorAll("[data-minutes]")];
  const startLabel = document.querySelector("#start-label");
  const resetButton = document.querySelector("#reset-button");
  const playIcon = document.querySelector("#play-icon");
  const pauseIcon = document.querySelector("#pause-icon");
  const clockMinutes = document.querySelector("#clock-minutes");
  const clockSeconds = document.querySelector("#clock-seconds");
  const stage = document.querySelector("#timer-stage");
  const displayPlayButton = document.querySelector("#display-play-button");
  const displayPlayIcon = document.querySelector("#display-play-icon");
  const displayPauseIcon = document.querySelector("#display-pause-icon");
  const statusText = document.querySelector("#status-text");
  const durationError = document.querySelector("#duration-error");
  const soundButton = document.querySelector("#sound-button");
  const soundOnIcon = document.querySelector("#sound-on");
  const soundOffIcon = document.querySelector("#sound-off");
  const tickingSound = document.querySelector("#ticking-sound");
  const alarmSound = document.querySelector("#alarm-sound");
  const fullscreenButton = document.querySelector("#fullscreen-button");
  const expandIcon = document.querySelector("#expand-icon");
  const collapseIcon = document.querySelector("#collapse-icon");
  const fullscreenSupported = document.fullscreenEnabled && typeof stage.requestFullscreen === "function";

  const millisecondsPerMinute = 60_000;
  const tickingWindow = 5_000;
  // Playback offsets skip silence around the ticking and before the alarm.
  const tickingStart = 1.1;
  const tickingEnd = 4.3;
  const alarmStart = 1.72;
  const minMinutes = Number(minutesInput.min);
  const maxMinutes = Number(minutesInput.max);
  const statusLabels = {
    ready: "Ready",
    running: "Running",
    paused: "Paused",
    finished: "Time’s up",
  };

  let duration = minutesInput.valueAsNumber;
  let remaining = duration * millisecondsPerMinute;
  let state = "ready";
  let deadline = 0;
  let frame = 0;
  let cueTimeout = 0;
  let displayedSeconds;
  let soundEnabled = true;
  let ticking = false;

  function readDuration() {
    const value = minutesInput.valueAsNumber;
    return Number.isInteger(value) && value >= minMinutes && value <= maxMinutes
      ? value
      : null;
  }

  function showDurationError(show) {
    durationError.hidden = !show;
    if (show) minutesInput.setAttribute("aria-invalid", "true");
    else minutesInput.removeAttribute("aria-invalid");
  }

  function renderTime() {
    const seconds = Math.ceil(remaining / 1000);
    if (seconds !== displayedSeconds) {
      const minutes = Math.floor(seconds / 60);
      clockMinutes.textContent = String(minutes).padStart(2, "0");
      clockMinutes.toggleAttribute("data-three-digits", minutes >= 100);
      clockSeconds.textContent = String(seconds % 60).padStart(2, "0");
      displayedSeconds = seconds;
    }
    stage.style.setProperty("--progress", remaining / (duration * millisecondsPerMinute));
  }

  function renderControls() {
    const running = state === "running";
    const locked = running || state === "paused";
    const selected = readDuration();

    stage.dataset.state = state;
    controls.dataset.locked = String(locked);
    if (statusText.textContent !== statusLabels[state]) {
      statusText.textContent = statusLabels[state];
    }

    const action = running ? "Pause" : state === "paused" ? "Resume" : "Start";
    const actionLabel = `${action} timer`;
    startLabel.textContent = locked ? action : actionLabel;
    playIcon.toggleAttribute("hidden", running);
    pauseIcon.toggleAttribute("hidden", !running);
    displayPlayButton.setAttribute("aria-label", actionLabel);
    displayPlayButton.title = actionLabel;
    displayPlayIcon.toggleAttribute("hidden", running);
    displayPauseIcon.toggleAttribute("hidden", !running);
    minutesInput.disabled = locked;
    decreaseButton.disabled = locked || selected === minMinutes;
    increaseButton.disabled = locked || selected === maxMinutes;
    for (const preset of presets) {
      preset.disabled = locked;
      preset.setAttribute("aria-pressed", String(Number(preset.dataset.minutes) === selected));
    }
  }

  function cancelUpdates() {
    cancelAnimationFrame(frame);
    window.clearTimeout(cueTimeout);
  }

  function playSound(sound) {
    sound.play().catch(() => {
      // The countdown still works if the browser blocks sound.
    });
  }

  function syncTicking() {
    const shouldTick = soundEnabled && state === "running" && remaining > 0 && remaining <= tickingWindow;
    if (shouldTick && tickingSound.currentTime >= tickingEnd) tickingSound.currentTime = tickingStart;
    if (shouldTick === ticking) return;
    ticking = shouldTick;
    if (ticking) playSound(tickingSound);
    else tickingSound.pause();
  }

  function resetSounds() {
    syncTicking();
    tickingSound.currentTime = tickingStart;
    alarmSound.pause();
    alarmSound.currentTime = alarmStart;
  }

  function updateRunningTime() {
    if (state !== "running") return;

    remaining = Math.max(0, Math.min(remaining, deadline - Date.now()));
    renderTime();
    if (remaining === 0) {
      cancelUpdates();
      state = "finished";
      renderControls();
    }
    syncTicking();
    if (state === "finished" && soundEnabled) playSound(alarmSound);
  }

  function animate() {
    updateRunningTime();
    if (state === "running") frame = requestAnimationFrame(animate);
  }

  function scheduleNextCue() {
    const delay = remaining > tickingWindow ? remaining - tickingWindow : remaining;
    cueTimeout = window.setTimeout(() => {
      updateRunningTime();
      if (state === "running") scheduleNextCue();
    }, Math.max(delay, 1));
  }

  function reset() {
    cancelUpdates();
    const selected = readDuration();
    if (selected !== null) duration = selected;
    remaining = duration * millisecondsPerMinute;
    minutesInput.value = duration;
    state = "ready";
    resetSounds();
    showDurationError(false);
    renderTime();
    renderControls();
  }

  async function startOrPause(openFullscreen = false) {
    if (state === "running") {
      updateRunningTime();
      if (state === "running") {
        cancelUpdates();
        state = "paused";
        syncTicking();
        renderControls();
      }
      return;
    }

    const selected = readDuration();
    if (selected === null) {
      showDurationError(true);
      if (document.fullscreenElement === stage) await setFullscreen(false);
      minutesInput.focus();
      return;
    }
    if (state !== "paused") reset();

    deadline = Date.now() + remaining;
    state = "running";
    renderControls();
    if (openFullscreen && fullscreenSupported && document.fullscreenElement !== stage) setFullscreen(true);
    syncTicking();
    frame = requestAnimationFrame(animate);
    scheduleNextCue();
  }

  function setDuration(value) {
    minutesInput.value = value;
    reset();
  }

  function stepDuration(change) {
    const selected = readDuration() ?? duration;
    setDuration(Math.min(maxMinutes, Math.max(minMinutes, selected + change)));
  }

  function renderSound() {
    soundButton.setAttribute("aria-pressed", String(soundEnabled));
    soundButton.title = soundEnabled ? "Mute timer sounds" : "Unmute timer sounds";
    soundOnIcon.toggleAttribute("hidden", !soundEnabled);
    soundOffIcon.toggleAttribute("hidden", soundEnabled);
  }

  function renderFullscreen() {
    const expanded = document.fullscreenElement === stage;
    const label = expanded ? "Exit fullscreen" : "Show timer fullscreen";
    fullscreenButton.setAttribute("aria-label", label);
    fullscreenButton.title = label;
    expandIcon.toggleAttribute("hidden", expanded);
    collapseIcon.toggleAttribute("hidden", !expanded);
  }

  async function setFullscreen(expanded) {
    try {
      if (expanded) await stage.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      renderFullscreen();
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    startOrPause(true);
  });
  displayPlayButton.addEventListener("click", () => startOrPause(true));

  minutesInput.addEventListener("input", () => {
    const selected = readDuration();
    if (selected !== null) {
      duration = selected;
      remaining = duration * millisecondsPerMinute;
      state = "ready";
      resetSounds();
      showDurationError(false);
      renderTime();
    }
    renderControls();
  });

  decreaseButton.addEventListener("click", () => stepDuration(-1));
  increaseButton.addEventListener("click", () => stepDuration(1));
  for (const preset of presets) {
    preset.addEventListener("click", () => setDuration(Number(preset.dataset.minutes)));
  }
  resetButton.addEventListener("click", reset);

  soundButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    syncTicking();
    if (!soundEnabled) alarmSound.pause();
    renderSound();
  });

  tickingSound.addEventListener("timeupdate", syncTicking);
  tickingSound.addEventListener("ended", () => {
    tickingSound.currentTime = tickingStart;
    if (ticking) playSound(tickingSound);
  });

  fullscreenButton.hidden = !fullscreenSupported;
  fullscreenButton.addEventListener("click", () => {
    setFullscreen(document.fullscreenElement !== stage);
  });
  document.addEventListener("fullscreenchange", renderFullscreen);

  document.addEventListener("visibilitychange", updateRunningTime);
  document.addEventListener("keydown", event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (event.target.closest?.("button, input, select, textarea, a[href], [contenteditable]")) return;

    if (event.key === " ") {
      event.preventDefault();
      startOrPause();
    } else if (event.key.toLowerCase() === "r") {
      reset();
    }
  });

  renderTime();
  renderControls();
  renderSound();
  renderFullscreen();
})();
