//here i am listening any tabs and 
//check if it is a youtube page

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status !== "complete") return;
//     if (!tab.url) return;

//     if (tab.url.includes("youtube.com/watch")) {
//         const queryParameters = tab.url.split("?")[1];
//         const urlParameters = new URLSearchParams(queryParameters);
//         const videoId = urlParameters.get("v");

//         if (!videoId) return;
//         console.log(urlParameters);

//         chrome.tabs.sendMessage(tabId, {
//             type: "NEW",
//             videoId: videoId
//         });
//     }
// });


chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("page.html")
    });
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("onUpdated fired");

    if (changeInfo.status !== "complete") {
        console.log("Page not loaded yet");
        return;
    }

    if (!tab.url) {
        console.log("No URL found");
        return;
    }

    console.log("URL detected:", tab.url);

    if (tab.url.includes("youtube.com/watch")) {
        console.log("YouTube watch page detected");

        const queryParameters = tab.url.split("?")[1];
        console.log("Query string:", queryParameters);

        const urlParameters = new URLSearchParams(queryParameters);
        const videoId = urlParameters.get("v");

        console.log("Video ID:", videoId);

        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId
        });
    } else {
        console.log("Not a YouTube watch URL");
    }
});
