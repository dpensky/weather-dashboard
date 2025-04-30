window.addEventListener('DOMContentLoaded', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
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
  const city = document.getElementById('cityInput').value;
  fetch(`/api/weather?city=${city}`)
    .then(res => res.json())
    .then(data => displayWeather(data))
    .catch(() => {
      document.getElementById('weatherResult').textContent = 'Error retrieving data.';
    });
});

function displayWeather(data) {
  if (data.main) {
    document.getElementById('weatherResult').innerHTML = `
      <h2>${data.name}</h2>
      <p>Temp: ${data.main.temp}°C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Weather: ${data.weather[0].description}</p>
    `;
  } else {
    document.getElementById('weatherResult').textContent = 'Weather data not found.';
  }
}
