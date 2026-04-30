// ─── Constants & state ───────────────────────────────────────────────────────
const FOCUS_DURATION = 25 * 60;

const slogans = [
    "Focus on the work, not the results.",
    "Small steps lead to big destinations.",
    "Your future self will thank you.",
    "Discipline over motivation.",
];

let currentState   = { isRunning: false, pausedTimeLeft: FOCUS_DURATION };
let displayLoop    = null;
let exitAttempted  = false;

// ─── DOM refs ────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const introScreen      = $('intro-screen');
const mainContent      = $('main-content');
const timerDisplay     = $('timer-display');
const activeView       = $('active-session');
const interventionView = $('intervention-view');
const startBtn         = $('start-btn');
const exitBtn          = $('exit-btn');
const resetBtn         = $('reset-btn');
const stayBtn          = $('stay-btn');
const sloganText       = $('slogan-text');
const navClock         = $('nav-clock');

// ─── Utilities ───────────────────────────────────────────────────────────────
function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/** Calculate live time-left from the state object. */
function calcTimeLeft(state) {
    if (!state.isRunning) return state.pausedTimeLeft;
    const elapsed = (Date.now() - state.startTime) / 1000;
    return Math.max(0, state.pausedTimeLeft - elapsed);
}

function sendToBackground(action) {
    return new Promise(res =>
        chrome.runtime.sendMessage({ action }, res)
    );
}

// ─── Display loop (UI only — runs while tab is open) ─────────────────────────
function startDisplayLoop() {
    clearInterval(displayLoop);
    displayLoop = setInterval(() => {
        const tl = calcTimeLeft(currentState);
        timerDisplay.innerText = formatTime(tl);
        if (tl <= 0) onSessionComplete();
    }, 500);
}

function stopDisplayLoop() {
    clearInterval(displayLoop);
    displayLoop = null;
}

// ─── Apply state to UI ───────────────────────────────────────────────────────
function applyState(state) {
    currentState = state;
    const tl = calcTimeLeft(state);

    timerDisplay.innerText = formatTime(tl);

    if (state.isRunning) {
        startBtn.innerText = 'PAUSE';
        startDisplayLoop();
    } else {
        stopDisplayLoop();
        startBtn.innerText = tl < FOCUS_DURATION ? 'RESUME WORK' : 'START WORK';
    }
}

// ─── Session complete (called from display loop OR background message) ────────
function onSessionComplete() {
    stopDisplayLoop();
    currentState = { isRunning: false, pausedTimeLeft: FOCUS_DURATION };
    timerDisplay.innerText = formatTime(FOCUS_DURATION);
    startBtn.innerText = 'START WORK';
    alert('✅ Session Complete! Great work — 25 minutes logged.');
}

// ─── Live clock in nav ───────────────────────────────────────────────────────
function tickNavClock() {
    navClock.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    sloganText.innerText = `"${slogans[Math.floor(Math.random() * slogans.length)]}"`;

    tickNavClock();
    setInterval(tickNavClock, 1000);

    setTimeout(() => {
        introScreen.style.opacity = '0';
        setTimeout(() => {
            introScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
        }, 800);
    }, 3000);

    const state = await sendToBackground('GET_STATE');
    if (state) applyState(state);
});

// ─── Background → UI messages ────────────────────────────────────────────────
chrome.runtime.onMessage.addListener(msg => {
    if (msg.action === 'SESSION_COMPLETE') onSessionComplete();
});

// ─── Controls ────────────────────────────────────────────────────────────────
startBtn.addEventListener('click', async () => {
    const action = currentState.isRunning ? 'PAUSE' : 'START';
    const state  = await sendToBackground(action);
    applyState(state);
});

resetBtn.addEventListener('click', async () => {
    const state = await sendToBackground('RESET');
    applyState(state);
    exitAttempted = false;
    document.body.classList.remove('warning-mode');
    activeView.classList.remove('hidden');
    interventionView.classList.add('hidden');
    exitBtn.innerText = 'EXIT FOCUS';
});

exitBtn.addEventListener('click', function () {
    if (!exitAttempted) {
        document.body.classList.add('warning-mode');
        activeView.classList.add('hidden');
        interventionView.classList.remove('hidden');
        this.innerText = 'YES, I AM QUITTING';
        exitAttempted = true;
    } else {
        window.location.href = '../homepage/index.html';
    }
});

stayBtn.addEventListener('click', () => {
    document.body.classList.remove('warning-mode');
    activeView.classList.remove('hidden');
    interventionView.classList.add('hidden');
    exitBtn.innerText = 'EXIT FOCUS';
    exitAttempted = false;
});
