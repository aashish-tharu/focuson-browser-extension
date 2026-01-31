//firstly i will handle browser customize shrink and collapse
// 1. Target the Header to trigger the collapse, not the whole panel
const customizeHeader = document.querySelector('.customize-header');
const customizeContent = document.querySelector('.customize-content');

customizeHeader.addEventListener('click', () => {
    customizeContent.classList.toggle('expanded');
    
    const arrow = customizeHeader.querySelector('.customize-arrow');
    arrow.style.transform = customizeContent.classList.contains('expanded') 
        ? 'rotate(180deg)' 
        : 'rotate(0deg)';
});


// 2. Dark Mode Toggle
const switchBtn = document.querySelector('.switch');

// I will get the state of my extension mode
chrome.storage.local.get(['displayMode'], (result)=>{
    if (result.displayMode == 'on') {
        switchBtn.classList.add('on');
        document.body.classList.add('dark');
    }
})

switchBtn.addEventListener('click', async (e)=>{
    //i was having event bubbling issue so i have solved 
    //using stop propagation
    e.stopPropagation();

    //grabing the state
    const isNowOn = switchBtn.classList.toggle('on');

    const modeState = isNowOn ? 'off' : 'on';
    //updating new state to chrome store
    chrome.storage.local.set({displayMode : modeState});
    document.body.classList.toggle('dark');

    //send the new state to chrome storage
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab) {
        chrome.tabs.sendMessage(tab.id, { 
            action: "toggleDarkMode", 
            enabled: isNowOn 
        });
    }
})

// 2. Click Handler
// switchBtn.addEventListener('click', async (e) => {
//     e.stopPropagation(); 

//     // Toggle visual state in the popup
//     const isNowOn = switchBtn.classList.toggle('on');
//     document.body.classList.toggle('dark');

//     // Save the new state to chrome storage
//     const modeStatus = isNowOn ? 'off' : 'on';
//     chrome.storage.local.set({ displayMode: modeStatus });

//     // Send the message to theme.js in the active tab
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
//     if (tab) {
//         chrome.tabs.sendMessage(tab.id, { 
//             action: "toggleDarkMode", 
//             enabled: isNowOn 
//         });
//     }

//     chrome.storage.local.set({ displayMode: modeStatus });
// });

// Handle Sliders
const sliders = document.querySelectorAll('.slider');

sliders.forEach(slider => {
    slider.addEventListener('input', async (e) => {
        const value = e.target.value;
        // The "label" is the text in the H2 (Brightness, Contrast, etc.)
        const label = e.target.closest('.setting-row').querySelector('.setting-label').innerText.toLowerCase();

        // 1. Save the value so it stays the same when the popup is reopened
        chrome.storage.local.set({ [label]: value });

        // 2. Send the update to theme.js
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
            chrome.tabs.sendMessage(tab.id, { 
                action: "updateFilters", 
                type: label, 
                value: value 
            });
        }
    });
});