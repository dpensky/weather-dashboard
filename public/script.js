document.getElementById('searchBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  fetch(`/api/weather?city=${city}`)
    .then(res => res.json())
    .then(data => {
        // console.log("data: " + data);
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
    })
    .catch(() => {
      document.getElementById('weatherResult').textContent = 'Error retrieving data.';
    });
});
