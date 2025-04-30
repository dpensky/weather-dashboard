const lang = getBrowserLang();

window.addEventListener('DOMContentLoaded', () => {
  setLanguage();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(`/api/weather?lat=${latitude}&lon=${longitude}&lang=${lang}`)
          .then(res => res.json())
          .then(data => {
            displayWeather(data)
            fetchForecast(null, latitude, longitude, lang);
          })
          .catch(() => {
            document.getElementById('weatherResult').textContent = 'Error retrieving location-based data.';
          });
      },
      () => {
        document.getElementById('weatherResult').textContent = 'Location permission denied.';
      }
    );
  } else {
    document.getElementById('weatherResult').textContent = 'Geolocation not supported.';
  }
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  fetch(`/api/weather?city=${city}&lang=${lang}`)
    .then(res => res.json())
    .then(data => {
      displayWeather(data);
      fetchForecast(city, null, null, lang);
    })
    .catch(() => {
      document.getElementById('weatherResult').textContent = 'Error retrieving data.';
    });
});

function displayWeather(data) {
  // console.log(data)
  if (data.main) {
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weatherResult').innerHTML = `
      <h2 class="text-2xl font-semibold mb-2">${data.name}</h2>
      <img src="${iconUrl}" alt="${data.weather[0].description}" class="mx-auto mb-2" />
      <p class="text-lg">🌡️ ${data.main.temp}°C</p>
      <p class="text-lg">💧 ${data.main.humidity}%</p>
      <p class="text-lg">🌤️ ${data.weather[0].description}</p>
    `;
  } else {
    document.getElementById('weatherResult').textContent = 'Weather data not found.';
  }
}

function setLanguage() {
  const title = document.getElementById('pageTitle');
  const button = document.getElementById('searchBtn');
  const edit = document.getElementById('cityInput');

  switch (lang) {
    case 'pt':
      title.textContent = 'Painel do Clima';
      button.textContent = 'Buscar Clima';
      edit.placeholder = "Digite a cidade";
      break;
    case 'es':
      title.textContent = 'Panel del Clima';
      button.textContent = 'Buscar Clima';
      edit.placeholder = "Introduzca la ciudad";
      break;
    default:
      title.textContent = 'Weather Dashboard';
      button.textContent = 'Get Weather';
      edit.placeholder = "Enter city name";
  }
}

function getBrowserLang() {
  const lang = navigator.language.slice(0, 2);
  return ['pt', 'es'].includes(lang) ? lang : 'en';
}


function fetchForecast(city = null, lat = null, lon = null, lang = 'en') {
  let url = '/api/forecast?lang=' + lang;
  if (city) url += `&city=${city}`;
  if (lat && lon) url += `&lat=${lat}&lon=${lon}`;

  fetch(url)
    .then(res => res.json())
    .then(data => displayForecast(data));
}

function displayForecast(data) {
  const forecastDiv = document.createElement('div');
  forecastDiv.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6';

  const days = {};

  for (let item of data.list) {
    const date = item.dt_txt.split(' ')[0];
    const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);

    // Pick midday forecast (~12:00)
    if (!days[date] && hour >= 11 && hour <= 13) {
      days[date] = item;
    }
  }

  Object.values(days).slice(0, 5).forEach(day => {
    const icon = day.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow p-3 text-center';

    card.innerHTML = `
      <h3 class="font-semibold text-sm">
        ${new Date(day.dt_txt).toLocaleDateString(lang, { weekday: 'long' })}
      </h3>
      <img src="${iconUrl}" class="mx-auto my-2" />
      <p>${day.main.temp.toFixed(1)}°C</p>
      <p class="text-sm">${day.weather[0].description}</p>
    `;

    forecastDiv.appendChild(card);
  });

  document.getElementById('weatherResult').appendChild(forecastDiv);
}
