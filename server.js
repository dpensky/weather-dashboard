require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const { city, lat, lon, lang = 'en' } = req.query;

  let url = '';

  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=${lang}&appid=${apiKey}`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${apiKey}`;
  } else {
    return res.status(400).json({ error: 'City or coordinates required.' });
  }
  // console.log(`url is: ${url}`);
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api/forecast', async (req, res) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const { city, lat, lon, lang = 'en' } = req.query;

  let url = '';

  if (city) {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=${lang}&appid=${apiKey}`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${apiKey}`;
  } else {
    return res.status(400).json({ error: 'City or coordinates required.' });
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forecast data.' });
  }
});
