const api_key = '4a017501be99653a108f5c3aa5267ba6'
const searchBtn = document.querySelector(".search-btn")
let cityInput = document.querySelector('.city-input')
const weatherInfo = document.querySelector('.weather-info')

cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if(city){
            getWeather(city);
        }
        else{
            alert("Please enter a city!");
        }
    }
});

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if(city) {
        getWeather(city);
    } else {
        alert("Please enter a city!");
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const lastCity = localStorage.getItem('lastCity');

    if(lastCity){
        getWeather(lastCity)
        cityInput.value = lastCity
    }
})

async function getWeather(city){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;
    console.log("URL:", url);

    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error('City not found!');
        }

        const data = await response.json();
        showWeather(data);

        localStorage.setItem('lastCity', city);

    } catch (error) {
        showError(error.message);
    }
}

function showWeather(data) {
    const { name, sys, main, weather } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    weatherInfo.innerHTML = `
        <div class="weather-card">
            <h2>${name}, ${sys.country}</h2>
            <img src="${iconUrl}" alt="${weather[0].description}">
            <h3>${Math.round(main.temp)}°C</h3>
            <p>${weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}</p>
        </div>
    `;

    weatherInfo.style.display = 'block';
}

function showError(message) {
    weatherInfo.innerHTML =
        `<p style="color:red;">
            ${message}
        </p>
    `;

    weatherInfo.style.display = 'block';
}


