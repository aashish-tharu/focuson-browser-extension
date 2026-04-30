const SESSION_DOMAIN_KEY = 'activeDomain';
const SESSION_START_KEY = 'startTime';

let activeDomain = null;
let startTime = null;

function getDomain(url) {
  if (!url) return null;
  if (/^(chrome|edge|about):/.test(url)) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function todayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function persistState() {
  await chrome.storage.session.set({
    [SESSION_DOMAIN_KEY]: activeDomain,
    [SESSION_START_KEY]: startTime,
  });
}

async function restoreState() {
  const result = await chrome.storage.session.get([SESSION_DOMAIN_KEY, SESSION_START_KEY]);
  activeDomain = result[SESSION_DOMAIN_KEY] ?? null;
  startTime = result[SESSION_START_KEY] ?? null;
}

async function saveTimeSpent() {
  if (!activeDomain || !startTime) return;

  const now = Date.now();
  const elapsedMs = now - startTime;
  if (elapsedMs < 1000) return;

  const key = todayKey();
  const stored = await chrome.storage.local.get(key);
  const day = stored[key] || {};

  day[activeDomain] = (day[activeDomain] || 0) + elapsedMs;
  await chrome.storage.local.set({ [key]: day });

  startTime = now;
  await persistState();

  console.debug(`[tracker] +${elapsedMs}ms → ${activeDomain} (total today: ${day[activeDomain]}ms)`);
}

async function handleTabChange(url) {
  const newDomain = getDomain(url);
  if (newDomain === activeDomain) return;

  await saveTimeSpent();
  activeDomain = newDomain;
  startTime = newDomain ? Date.now() : null;
  await persistState();
}

async function pauseTracking() {
  await saveTimeSpent();
  activeDomain = null;
  startTime = null;
  await persistState();
}

async function resumeTracking() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) await handleTabChange(tab.url);
}

(async () => {
  await restoreState();
  if (activeDomain && startTime) {
    startTime = Date.now();
    await persistState();
  }
  console.debug('[tracker] Worker started. Active domain:', activeDomain);
})();

// ─── Event listeners ──────────────────────────────────────────────────────────

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url || tab.status !== 'complete') return;
    await handleTabChange(tab.url);
  } catch (err) {
    console.error('[tracker] onActivated error:', err);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, { url }, tab) => {
  if (url && tab.active) {
    await handleTabChange(url);
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await pauseTracking();
  } else {
    await resumeTracking();
  }
});

chrome.idle.setDetectionInterval(60);
chrome.idle.onStateChanged.addListener(async (state) => {
  if (state === 'idle' || state === 'locked') {
    await pauseTracking();
  } else if (state === 'active') {
    await resumeTracking();
  }
});

chrome.alarms.create('syncData', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(async ({ name }) => {
  if (name === 'syncData') await saveTimeSpent();
});

importScripts('siteBlocker.js');
importScripts('notification.js');
importScripts('timerLogic.js');