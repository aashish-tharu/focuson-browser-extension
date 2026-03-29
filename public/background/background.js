let activeDomain = null;
let startTime = null;

//This function return URL Clean link.
function getDomain(url) {
  if (!url || url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:')) {
    return null;
  }
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return null;
  }
}

// Return today dates.
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calculate Time spent and save to local Storage.
async function saveTimeSpent() {
  if (!activeDomain || !startTime) return;
  const now = Date.now();
  const timeSpentMs = now - startTime;
  if (timeSpentMs < 1000) return;
  const todayKey = getTodayDateString();
  const result = await chrome.storage.local.get([todayKey]);
  const todayData = result[todayKey] || {};
  todayData[activeDomain] = (todayData[activeDomain] || 0) + timeSpentMs;
  await chrome.storage.local.set({ [todayKey]: todayData });
  startTime = now;
  console.log(`Saved ${timeSpentMs}ms for ${activeDomain}. Total today: ${todayData[activeDomain]}ms`);
}

// Handle change in URL
async function handleTabChange(url) {
  const newDomain = getDomain(url);
  if (newDomain !== activeDomain) {
    await saveTimeSpent();
    
    activeDomain = newDomain;
    startTime = newDomain ? Date.now() : null;
  }
}

// Event listener if user change the URL
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    handleTabChange(tab.url);
  } catch (error) {
    console.error("Error fetching tab:", error);
  }
});

// Event listener if URL is typed.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active) {
    handleTabChange(changeInfo.url);
  }
});

//handle chrome minimize.
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await saveTimeSpent();
    activeDomain = null;
    startTime = null;
  } else {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      handleTabChange(tabs[0].url);
    }
  }
});

//checking if user is idel
chrome.idle.setDetectionInterval(60);
chrome.idle.onStateChanged.addListener(async (newState) => {
  if (newState === 'idle' || newState === 'locked') {
    await saveTimeSpent();
    activeDomain = null;
    startTime = null;
  } else if (newState === 'active') {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      handleTabChange(tabs[0].url);
    }
  }
});

//updating with every 1 min.
chrome.alarms.create('syncData', { periodInMinutes: 1 });

//it was impossible to use setTimeout so using alarm
//This also help me to handle live update in react app.
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncData') {
    saveTimeSpent();
  }
});


importScripts('siteBlocker.js');
importScripts('notification.js');