const STORAGE_KEY = 'focus_history';

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("dailyFocusReport", {
        periodInMinutes: 1440 
    });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "dailyFocusReport") {
        chrome.storage.local.get(["notificationToggle"], (result) => {
            const isEnabled = result.notificationToggle !== undefined ? result.notificationToggle : true;
            
            if (isEnabled) {
                sendYesterdayNotification();
            }
        });
    }
});

function sendYesterdayNotification() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayString = `${year}-${month}-${day}`;

    // Fetch the data
    chrome.storage.local.get([STORAGE_KEY], (result) => {
        const history = result[STORAGE_KEY] || [];
        const yesterdayEntry = history.find(entry => entry.date === yesterdayString);

        let message = "You didn't record any focus sessions yesterday. Let's crush it today!";

        if (yesterdayEntry && yesterdayEntry.totalTime > 0) {
            const totalSeconds = yesterdayEntry.totalTime;

            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            let timeString = "";
            if (hours > 0) {
                timeString = `${hours}h ${minutes}m`;
            } else if (minutes > 0) {
                timeString = `${minutes}m ${seconds}s`;
            } else {
                timeString = `${seconds}s`; 
            }

            message = `Great job! You focused for ${timeString} yesterday.`;
        }

        chrome.notifications.create({
            type: 'basic',
            iconUrl: '../assets/ext-icon.png',
            title: 'Daily Focus Report',
            message: message,
            priority: 2
        });
    });
}


//This is for testing purpose. 
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.alarms.create("dailyFocusReport", {
//         delayInMinutes: 0.5,
//         periodInMinutes: 0.5 
//     });
// });