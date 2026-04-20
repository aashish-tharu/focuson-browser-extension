
function getLocalWeather() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const current = data.current_weather;
                    const daily = data.daily;
                    document.querySelector('.temp').textContent =
                        Math.round(current.temperature) + "°";
                    const weatherMap = {
                        0: "Clear",
                        1: "Mainly Clear",
                        2: "Partly Cloudy",
                        3: "Cloudy",
                        45: "Fog",
                        48: "Fog",
                        51: "Drizzle",
                        61: "Rain",
                        71: "Snow",
                        80: "Rain Showers"
                    };
                    document.querySelector('.weather-desc').textContent =
                        weatherMap[current.weathercode] || "Unknown";
                    document.querySelector('.windspeed').textContent =
                        `H: ${Math.round(daily.temperature_2m_max[0])}° | L: ${Math.round(daily.temperature_2m_min[0])}°`;
                    //city part:
                    function getCity(lat, lon) {
                        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
                        fetch(url)
                            .then(res => res.json())
                            .then(data => {
                                const city = data.city || data.locality;
                                document.querySelector('.region').textContent = city;
                            })
                            .catch(err => console.log(err));
                    }
                    getCity(lat, lon)
                })
                .catch(err => console.log("Weather fetch failed:", err));
        },
        (error) => {
            console.warn("Location access denied:", error.message);
        }
    );
}
getLocalWeather();

const STORAGE_KEY = 'focus_history';
chrome.storage.local.get([STORAGE_KEY], (result) => {
    let history = result[STORAGE_KEY] || [];
    console.log(history);

    const today = new Date().toISOString().split('T')[0];

    history.forEach((value) => {
        if (value.date === today) {
            let time = value.totalTime;

            let sec = time % 60;
            let min = Math.floor(time / 60) % 60;
            let hour = Math.floor(time / 3600);

            let finalTime = `${hour}:${min}:${sec}`;
            document.querySelector('.stats-val').textContent = finalTime;
        }
    })
})


document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');

    loadTasks();

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && todoInput.value.trim() !== "") {
            const taskText = todoInput.value.trim();
            saveTask(taskText);
            todoInput.value = ''; // Clear input
        }
    });

    function saveTask(taskText) {
        chrome.storage.local.get({ tasks: [] }, (result) => {
            const tasks = result.tasks;
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            tasks.push(newTask);

            chrome.storage.local.set({ tasks: tasks }, () => {
                renderTask(newTask);
            });
        });
    }

    function loadTasks() {
        chrome.storage.local.get({ tasks: [] }, (result) => {
            todoList.innerHTML = ''; // Clear current UI
            result.tasks.forEach(task => {
                renderTask(task);
            });
        });
    }

    function renderTask(task) {
        const taskItem = document.createElement('div');
        taskItem.className = `todo-item ${task.completed ? 'completed' : ''}`;
        taskItem.setAttribute('data-id', task.id);

        taskItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span style="flex: 1; text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.text}</span>
                <button class="delete-btn" style="background:none; border:none; cursor:pointer; color:#ff4d4d;">✕</button>
            </div>
        `;

        const checkbox = taskItem.querySelector('input');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const delBtn = taskItem.querySelector('.delete-btn');
        delBtn.addEventListener('click', () => deleteTask(task.id));

        todoList.appendChild(taskItem);
    }

    function toggleTask(id) {
        chrome.storage.local.get({ tasks: [] }, (result) => {
            const tasks = result.tasks.map(t => {
                if (t.id === id) t.completed = !t.completed;
                return t;
            });
            chrome.storage.local.set({ tasks: tasks }, loadTasks);
        });
    }

    function deleteTask(id) {
        chrome.storage.local.get({ tasks: [] }, (result) => {
            const tasks = result.tasks.filter(t => t.id !== id);
            chrome.storage.local.set({ tasks: tasks }, loadTasks);
        });
    }
});