document.querySelector('.switch').addEventListener('click', ()=>{
    console.log('hi')
    document.querySelector('.switch').classList.toggle('on');
})

//toggle on click for customize button
const box = document.getElementById('customizeBox');
box.addEventListener('click', ()=>{
    box.classList.toggle('expanded');
});