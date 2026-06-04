
module.exports = async (req, res) =&gt; {
  const { lat, lng } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: { message: 'API key not configured' } });
  }

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&amp;q=${lat},${lng}&amp;days=7&amp;aqi=yes&amp;alerts=no`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch weather data' } });
  }
};
