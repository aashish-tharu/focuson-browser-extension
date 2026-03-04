// const slogans = [
//     "Focus on the work, not the results.",
//     "Small steps lead to big destinations.",
//     "Your future self will thank you.",
//     "Discipline over motivation."
// ];

// let timeLeft = 25 * 60;
// let timer = null;
// let isRunning = false;
// let exitAttempted = false;

// const intro = document.getElementById('intro-screen');
// const main = document.getElementById('main-content');
// const timerDisplay = document.getElementById('timer-display');
// const activeView = document.getElementById('active-session');
// const interventionView = document.getElementById('intervention-view');

// window.onload = () => {
//     document.getElementById('slogan-text').innerText = `"${slogans[Math.floor(Math.random() * slogans.length)]}"`;
    
//     setTimeout(() => {
//         intro.style.opacity = '0';
//         setTimeout(() => {
//             intro.classList.add('hidden');
//             main.classList.remove('hidden');
//         }, 800);
//     }, 3000);

//     updateNavClock();
// };

// function updateTimerUI() {
//     const mins = Math.floor(timeLeft / 60);
//     const secs = timeLeft % 60;
//     timerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
// }

// document.getElementById('start-btn').onclick = function() {
//     if (isRunning) {
//         clearInterval(timer);
//         this.innerText = "RESUME WORK";
//     } else {
//         this.innerText = "PAUSE";
//         timer = setInterval(() => {
//             timeLeft--;
//             updateTimerUI();
//             if (timeLeft <= 0) {
//                 completeSession();
//             }
//         }, 1000);
//     }
//     isRunning = !isRunning;
// };

// document.getElementById('reset-btn').onclick = () => {
//     clearInterval(timer);
//     timeLeft = 25 * 60;
//     isRunning = false;
//     document.getElementById('start-btn').innerText = "START WORK";
//     updateTimerUI();
// };

// function completeSession() {
//     clearInterval(timer);
//     const sessions = JSON.parse(localStorage.getItem('focusData') || '[]');
//     sessions.push({
//         timestamp: new Date().toISOString(),
//         type: 'Pomodoro',
//         completed: true
//     });
//     localStorage.setItem('focusData', JSON.stringify(sessions));
//     chrome.local.
//     alert("Session Complete! Data Saved.");
//     location.reload();
// }

// document.getElementById('exit-btn').onclick = function() {
//     if (!exitAttempted) {
//         document.body.classList.add('warning-mode');
//         activeView.classList.add('hidden');
//         interventionView.classList.remove('hidden');
//         this.innerText = "YES, I AM QUITTING";
//         exitAttempted = true;
//     } else {
//         window.location.href = "foucs.html";
//     }
// };

// document.getElementById('stay-btn').onclick = () => {
//     document.body.classList.remove('warning-mode');
//     activeView.classList.remove('hidden');
//     interventionView.classList.add('hidden');
//     document.getElementById('exit-btn').innerText = "EXIT FOCUS";
//     exitAttempted = false;
// };

// function updateNavClock() {
//     setInterval(() => {
//         const now = new Date();
//         document.getElementById('nav-clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }, 1000);
// }


// //getting data of that day
// function getTodayKey() {
//     const now = new Date();
//     // Formats date as YYYY-MM-DD (e.g., "2026-02-11")
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
// }

// console.log(getTodayKey());





//reattampt 
const FOCUS_DURATION = 25 * 60; //total 25 min
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

//accessing all dom element
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

//starting page
document.addEventListener('DOMContentLoaded', () => {
    //setting random value while starting
    sloganText.innerText = `"${slogans[Math.floor(Math.random() * slogans.length)]}"`;
    
    //this will show for 3 sec
    setTimeout(() => {
        intro.style.opacity = '0';
        setTimeout(() => {
            intro.classList.add('hidden');
            main.classList.remove('hidden');
        }, 800);
    }, 3000);

    //start clock
    updateNavClock();
    
    //initialize timer display
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

    // //extracting the value of focus history
    chrome.storage.local.get([STORAGE_KEY], (result) => {
        
        // reteriving the result or if undefined then null array
        let history = result[STORAGE_KEY] || [];

        // Search: Do we already have an entry for TODAY?
        // We look for an object where obj.date equals todayDate
        let todayEntryIndex = history.findIndex(entry => entry.date === todayDate);

        if (todayEntryIndex !== -1) {
            // if obj.data is available then i will add on that 
            history[todayEntryIndex].totalTime += FOCUS_DURATION;
        } else {
            // if not available then i will add on the array

            //formate : date: and then totalTime
            history.push({
                date: todayDate,
                totalTime: FOCUS_DURATION
            });
        }

        // save to the local storage
        chrome.storage.local.set({ [STORAGE_KEY]: history }, () => {
            console.log('Data saved:', history);
            alert("Session Complete! Daily progress updated.");
            
            // Reset UI logic
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

//handling exit function
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