
const FOCUS_DURATION = 25 * 60;
let timeLeft = FOCUS_DURATION;
let timer = null;
let isRunning = false;
let exitAttempted = false;
const STORAGE_KEY = 'focus_history';

const slogans = [
    "Focus on the work, not the results.",
    "Small steps lead to big destinations.",
    "Your future self will thank you.",
    "Discipline over motivation."
];

const intro = document.getElementById('intro-screen');
const main = document.getElementById('main-content');
const timerDisplay = document.getElementById('timer-display');
const activeView = document.getElementById('active-session');
const interventionView = document.getElementById('intervention-view');
const startBtn = document.getElementById('start-btn');
const exitBtn = document.getElementById('exit-btn');
const resetBtn = document.getElementById('reset-btn');
const stayBtn = document.getElementById('stay-btn');
const sloganText = document.getElementById('slogan-text');

document.addEventListener('DOMContentLoaded', () => {
    sloganText.innerText = `"${slogans[Math.floor(Math.random() * slogans.length)]}"`;
    setTimeout(() => {
        intro.style.opacity = '0';
        setTimeout(() => {
            intro.classList.add('hidden');
            main.classList.remove('hidden');
        }, 800);
    }, 3000);

    updateNavClock();

    updateTimerUI();
});


// Here i will get today's date (Format: YYYY-MM-DD)
function getTodayKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function updateTimerUI() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateNavClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('nav-clock').innerText = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }, 1000);
}

// after completing i will store in my chrome storage
function completeSession() {
    clearInterval(timer);
    isRunning = false;
    
    const todayDate = getTodayKey();

    chrome.storage.local.get([STORAGE_KEY], (result) => {
        let history = result[STORAGE_KEY] || [];
        let todayEntryIndex = history.findIndex(entry => entry.date === todayDate);

        if (todayEntryIndex !== -1) { 
            history[todayEntryIndex].totalTime += FOCUS_DURATION;
        } else {
            history.push({
                date: todayDate,
                totalTime: FOCUS_DURATION
            });
        }

        chrome.storage.local.set({ [STORAGE_KEY]: history }, () => {
            console.log('Data saved:', history);
            alert("Session Complete! Daily progress updated.");
            
            timeLeft = FOCUS_DURATION;
            updateTimerUI();
            document.getElementById('start-btn').innerText = "START WORK";
        });
    });
}

startBtn.onclick = function() {
    if (isRunning) {
        clearInterval(timer);
        this.innerText = "RESUME WORK";
    } else {
        this.innerText = "PAUSE";
        timer = setInterval(() => {
            timeLeft--;
            updateTimerUI();
            
            if (timeLeft <= 0) {
                completeSession();
            }
        }, 1000);
    }
    isRunning = !isRunning;
};

resetBtn.onclick = () => {
    clearInterval(timer);
    timeLeft = FOCUS_DURATION;
    isRunning = false;
    startBtn.innerText = "START WORK";
    updateTimerUI();
};

exitBtn.onclick = function() {
    if (!exitAttempted) {
        document.body.classList.add('warning-mode');
        activeView.classList.add('hidden');
        interventionView.classList.remove('hidden');
        this.innerText = "YES, I AM QUITTING";
        exitAttempted = true;
    } else {
        window.location.href = "../homepage/index.html";
    }
};

stayBtn.onclick = () => {
    document.body.classList.remove('warning-mode');
    activeView.classList.remove('hidden');
    interventionView.classList.add('hidden');
    exitBtn.innerText = "EXIT FOCUS";
    exitAttempted = false;
};