function updateTime() {
        const now = new Date();

        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');

        document.getElementById('time').innerHTML = `${hours}:${minutes}`;
}

updateTime();
setInterval(updateTime, 1000);

document.querySelector('.home').addEventListener('click', ()=>{
        window.open('focus.html');
})