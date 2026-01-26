

// Object to keep track of current levels
let currentSettings = {
    brightness: 100,
    contrast: 100,
    sepia: 0,
    grayscale: 0,
    darkMode: false
};

function applyAllFilters() {
    let filterString = "";

    // Dark Mode Logic
    if (currentSettings.darkMode) {
        filterString += "invert(1) hue-rotate(180deg) ";
    }

    // Slider Logic
    filterString += `brightness(${currentSettings.brightness}%) `;
    filterString += `contrast(${currentSettings.contrast}%) `;
    filterString += `sepia(${currentSettings.sepia}%) `;
    filterString += `grayscale(${currentSettings.grayscale}%) `;

    document.documentElement.style.filter = filterString;

    // Correct images/videos if Dark Mode is on
    document.querySelectorAll('img, video').forEach(el => {
        el.style.filter = currentSettings.darkMode ? "invert(1) hue-rotate(180deg)" : "none";
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "toggleDarkMode") {
        currentSettings.darkMode = request.enabled;
    } else if (request.action === "updateFilters") {
        currentSettings[request.type] = request.value;
    }
    applyAllFilters();
});