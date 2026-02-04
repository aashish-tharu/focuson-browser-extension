//greeting msg
let hours;
let greeting = "";
let currentTask = "";

function timeFunction() {
    let t = new Date();
    hours = String(t.getHours()).padStart(2, '0');
    // console.log(typeof(hours));
    let minutes = String(t.getMinutes()).padStart(2, '0');
    document.querySelector('.clock').textContent = `${hours}:${minutes}`;
    if (Number(hours) >= 0 && Number(hours) <= 11) greeting = "Good Morning";
    else if (Number(hours) > 11 && Number(hours) <= 16) greeting = "Good Afternoon";
    else greeting = "Good evening";
}

timeFunction();
//this portion is for greeting
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

//slogan of the day
const slogalURL = "https://zenquotes.io/api/random";
fetch(slogalURL).then((response)=>{
    return response.json();
}).then((obj)=>{
    document.querySelector('.quote').textContent = obj[0].q;
}) 

//here i'm selecting inputNode 
//i will fetch userMainTask data if 
const inputNode = document.querySelector('.task-input');
// console.log("working....")
chrome.storage.local.get(['userMainTask'], (result) =>{
    // console.log(task);
    if (result.userMainTask) {
        currentTask = result.userMainTask;
        inputNode.value = currentTask;
    }
})

//if there is any changes then i will save
inputNode.addEventListener('input', ()=>{
    currentTask = inputNode.value;
    // console.log(userInput);
    chrome.storage.local.set({userMainTask : currentTask}, ()=>{
        if (chrome.runtime.lastError) {
            console.log("Error saving.");
        } else {
            console.log("saved successfully.");
        }
    });
})