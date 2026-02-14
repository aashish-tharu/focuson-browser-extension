function getLocalWeather() {
    // 1. Ask for location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            console.log(`User location: ${lat}, ${lon}`);

            // 2. Fetch weather using these coordinates
            const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

            fetch(weatherURL)
                .then(res => res.json())
                .then(data => {
                    const temp = data.current_weather.temperature;
                    // console.log(data);
                    // console.log(data.current_weather.temperature);
                    // console.log(data.current_weather_units.temperature);
                    // console.log(data.current_weather.windspeed);
                    // console.log(data.current_weather_units.windspeed);
                    // console.log("Weather updated for user location.");
                    document.querySelector('.temp').textContent = data.current_weather.temperature + data.current_weather_units.temperature;
                    document.querySelector('.windspeed').textContent = data.current_weather.windspeed + data.current_weather_units.windspeed;
                })
                .catch(err => console.log("Weather fetch failed:", err));
        },
        (error) => {
            // Handle cases where user denies permission or location is unavailable
            console.warn("Location access denied or unavailable:", error.message);
            document.querySelector('.weather-temp').textContent = "Weather N/A";
        }
    );
}

// Call it when the extension loads
getLocalWeather();