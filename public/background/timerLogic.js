// ─── Constants ───────────────────────────────────────────────────────────────
const FOCUS_DURATION = 25 * 60; // seconds
const STORAGE_KEY1    = 'focus_history';
const STATE_KEY      = 'timer_state';
const ALARM_NAME     = 'focusComplete';
const DEFAULT_STATE = { isRunning: false, pausedTimeLeft: FOCUS_DURATION };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Compute live seconds remaining from a state object. */
function calcTimeLeft(state) {
    if (!state.isRunning) return state.pausedTimeLeft;
    const elapsed = (Date.now() - state.startTime) / 1000;
    return Math.max(0, state.pausedTimeLeft - elapsed);
}

function getState() {
    return new Promise(res =>
        chrome.storage.local.get(STATE_KEY, r => res(r[STATE_KEY] || DEFAULT_STATE))
    );
}

function setState(state) {
    return new Promise(res =>
        chrome.storage.local.set({ [STATE_KEY]: state }, res)
    );
}

function broadcastToFocusPages(msg) {
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
            if (tab.url?.includes('focus')) {
                chrome.tabs.sendMessage(tab.id, msg).catch(() => {});
            }
        });
    });
}

// ─── Session completion ───────────────────────────────────────────────────────
async function completeSession() {
    chrome.alarms.clear(ALARM_NAME);
    const today = getTodayKey();

    await new Promise(res => {
        chrome.storage.local.get(STORAGE_KEY1, result => {
            const history   = result[STORAGE_KEY1] || [];
            const todayIdx  = history.findIndex(e => e.date === today);

            if (todayIdx !== -1) history[todayIdx].totalTime += FOCUS_DURATION;
            else history.push({ date: today, totalTime: FOCUS_DURATION });

            chrome.storage.local.set({ [STORAGE_KEY1]: history }, res);
        });
    });

    await setState(DEFAULT_STATE);

    broadcastToFocusPages({ action: 'SESSION_COMPLETE' });

    chrome.notifications.create({
        type:    'basic',
        iconUrl: '../icons/icon48.png',
        title:   '✅ Focus Session Complete',
        message: 'Great work! Your 25-minute session has been logged.',
    });
}

// ─── Alarm listener ──────────────────────────────────────────────────────────
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === ALARM_NAME) completeSession();
});

// ─── Message handler ─────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    (async () => {
        const state = await getState();

        switch (msg.action) {

            case 'GET_STATE': {
                sendResponse(state);
                break;
            }

            case 'START': {
                if (state.isRunning) { sendResponse(state); break; }

                const newState = {
                    isRunning:      true,
                    startTime:      Date.now(),
                    pausedTimeLeft: state.pausedTimeLeft ?? FOCUS_DURATION,
                };
                await setState(newState);

                const delayMs = newState.pausedTimeLeft * 1000;
                chrome.alarms.create(ALARM_NAME, { when: Date.now() + delayMs });

                sendResponse(newState);
                break;
            }

            case 'PAUSE': {
                if (!state.isRunning) { sendResponse(state); break; }

                chrome.alarms.clear(ALARM_NAME);
                const newState = {
                    isRunning:      false,
                    startTime:      null,
                    pausedTimeLeft: calcTimeLeft(state),
                };
                await setState(newState);
                sendResponse(newState);
                break;
            }

            case 'RESET': {
                chrome.alarms.clear(ALARM_NAME);
                await setState(DEFAULT_STATE);
                sendResponse(DEFAULT_STATE);
                break;
            }

            default:
                sendResponse(state);
        }
    })();

    return true; 
});

// ─── On install: seed default state ──────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(STATE_KEY, r => {
        if (!r[STATE_KEY]) setState(DEFAULT_STATE);
    });
});
