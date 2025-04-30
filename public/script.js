window.addEventListener('DOMContentLoaded', () => {
  setLanguage();
  const lang = getBrowserLang();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(`/api/weather?lat=${latitude}&lon=${longitude}&lang=${lang}`)
          .then(res => res.json())
          .then(data => displayWeather(data))
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
  const lang = getBrowserLang();
  const city = document.getElementById('cityInput').value;
  fetch(`/api/weather?city=${city}&lang=${lang}`)
    .then(res => res.json())
    .then(data => displayWeather(data))
    .catch(() => {
      document.getElementById('weatherResult').textContent = 'Error retrieving data.';
    });
});

function displayWeather(data) {
  // console.log(data)
  if (data.main) {
    document.getElementById('weatherResult').innerHTML = `
      <h2>${data.name}</h2>
      <p>${data.main.temp}°C</p>
      <p>${data.weather[0].description}</p>
    `;
  } else {
    document.getElementById('weatherResult').textContent = 'Weather data not found.';
  }
}

function setLanguage() {
  const lang = getBrowserLang()
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
