
let hours;
let greeting = "";
let currentTask = "";

//This function helps to get the time and greeting portion.
function timeFunction() {
    let t = new Date();
    hours = String(t.getHours()).padStart(2, '0');
    let minutes = String(t.getMinutes()).padStart(2, '0');
    document.querySelector('.clock').textContent = `${hours}:${minutes}`;
    if (Number(hours) >= 0 && Number(hours) <= 11) greeting = "Good Morning";
    else if (Number(hours) > 11 && Number(hours) <= 16) greeting = "Good Afternoon";
    else greeting = "Good evening";
}

timeFunction();

//This portion of code helps for the store username if new
chrome.storage.local.get("extenUserName", (result) => {
    let extenusernames = result["extenUserName"] || "Guest";
    if (extenusernames == "Guest") {
        let userValue = prompt(`Username not found \nDo you want to write your name? (y/n)`);
        if (userValue == "y") {
            extenusernames = prompt("Enter your name : ");
            chrome.storage.local.set({"extenUserName": extenusernames}), ()=>{
                console.log("Username saved.");
            };
        }
    }
    document.querySelector('.greeting').textContent =
    `${greeting}, ${extenusernames}`;
});

setInterval(timeFunction, 2000);

//slogan of the day.
const slogalURL = "https://zenquotes.io/api/random";
fetch(slogalURL).then((response)=>{
    return response.json();
}).then((obj)=>{
    document.querySelector('.quote').textContent = obj[0].q;
}) 

//Handle main task of the home page.
const inputNode = document.querySelector('.task-input');
chrome.storage.local.get(['userMainTask'], (result) =>{
    if (result.userMainTask) {
        currentTask = result.userMainTask;
        inputNode.value = currentTask;
    }
})

//saving input to the local storage.
inputNode.addEventListener('input', ()=>{
    currentTask = inputNode.value;
    chrome.storage.local.set({userMainTask : currentTask}, ()=>{
        if (chrome.runtime.lastError) {
            console.log("Error saving.");
        } else {
            console.log("saved successfully.");
        }
    });
})

//handling navigation part.
document.querySelector('.menu-btn').addEventListener('click', ()=>{
    document.querySelector('.nav-content').classList.toggle('nav-show');
    console.log(document.querySelector('.nav-content'));
})

//opening react setting page.
document.addEventListener('DOMContentLoaded', () => {
  const settingsButton = document.getElementById('home-btn');
  settingsButton.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('index.html'));
    }
  });
});