
module.exports = async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: { message: 'API key not configured' } });
  }

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lng}&days=7&aqi=yes&alerts=no`;
    const response = await fetch(url);
    const data = await response.json();
    

    if (!response.ok) {
      console.error(data);
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  }catch (error) {
  console.error("Weather API Error:", error);

  return res.status(500).json({
    error: {
      message: error.message,
      stack: error.stack
    }
  });
}
};
