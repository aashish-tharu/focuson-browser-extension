const customizeHeader = document.querySelector('.customize-header');
const customizeContent = document.querySelector('.customize-content');

customizeHeader.addEventListener('click', () => {
    customizeContent.classList.toggle('expanded');
    
    const arrow = customizeHeader.querySelector('.customize-arrow');
    arrow.style.transform = customizeContent.classList.contains('expanded') 
        ? 'rotate(180deg)' 
        : 'rotate(0deg)';
});


const switchBtn = document.querySelector('.switch');

chrome.storage.local.get(['displayMode'], (result)=>{
    console.log(result.displayMode);
    if (result.displayMode == 'on') {
        switchBtn.classList.add('on');
        document.body.classList.add('dark');
    }
})

switchBtn.addEventListener('click', async (e)=>{
    e.stopPropagation();

    const isNowOn = switchBtn.classList.toggle('on');

    const modeState = isNowOn ? 'off' : 'on';
    chrome.storage.local.set({displayMode : modeState});
    chrome.storage.local.get(['displayMode'], (result)=>{
    console.log(result.displayMode);
})
    document.body.classList.toggle('dark');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab) {
        chrome.tabs.sendMessage(tab.id, { 
            action: "toggleDarkMode", 
            enabled: isNowOn 
        });
    }
})

const sliders = document.querySelectorAll('.slider');

sliders.forEach(slider => {
    slider.addEventListener('input', async (e) => {
        const value = e.target.value;
        const label = e.target.closest('.setting-row').querySelector('.setting-label').innerText.toLowerCase();
        chrome.storage.local.set({ [label]: value });
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