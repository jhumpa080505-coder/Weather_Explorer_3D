let weatherData = null;

const params =
  new URLSearchParams(window.location.search);

const lat  = params.get("lat");
const lng  = params.get("lng");
const city = params.get("city");

document.getElementById("cityName")
.innerText = city;

function goBack(){

  window.location.href = "index.html";

}

const canvas =
  document.createElement("canvas");

canvas.id = "weatherCanvas";

document.body.appendChild(canvas);

const ctx =
  canvas.getContext("2d");

resizeCanvas();

window.addEventListener(
  "resize",
  resizeCanvas
);

function resizeCanvas(){

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

}

let particles = [];

let currentAnimation = null;

function setWeatherBackground(condition){

  condition = condition.toLowerCase();

  document.body.className = "";

  particles = [];

  currentAnimation = null;

  // SUNNY
  if(condition.includes("clear")){

    document.body.classList.add("sunny");

    createSunParticles();

    animateSun();

  }

  // RAIN
  else if(condition.includes("rain")){

    document.body.classList.add("rainy");

    createRain();

    animateRain();

  }

  // CLOUD
  else if(condition.includes("cloud")){

    document.body.classList.add("cloudy");

    createClouds();

    animateClouds();

  }

  // SNOW
  else if(condition.includes("snow")){

    document.body.classList.add("snowy");

    createSnow();

    animateSnow();

  }

  // THUNDERSTORM
  else if(condition.includes("storm")){

    document.body.classList.add("stormy");

    createRain();

    animateRain();

    lightningEffect();

  }

}

function createRain(){

  for(let i=0; i<250; i++){

    particles.push({

      x:
        Math.random() * canvas.width,

      y:
        Math.random() * canvas.height,

      len:
        10 + Math.random() * 20,

      speed:
        4 + Math.random() * 10

    });

  }

}

function animateRain(){

  currentAnimation = requestAnimationFrame(animateRain);

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.5)";

  ctx.lineWidth = 1;

  particles.forEach(p=>{

    ctx.beginPath();

    ctx.moveTo(p.x,p.y);

    ctx.lineTo(
      p.x - 2,
      p.y + p.len
    );

    ctx.stroke();

    p.y += p.speed;

    if(p.y > canvas.height){

      p.y = -20;

      p.x =
        Math.random() * canvas.width;

    }

  });

}

function createSnow(){

  for(let i=0; i<180; i++){

    particles.push({

      x:
        Math.random() * canvas.width,

      y:
        Math.random() * canvas.height,

      r:
        1 + Math.random() * 4,

      speed:
        0.5 + Math.random() * 2

    });

  }

}

function animateSnow(){

  currentAnimation =
    requestAnimationFrame(animateSnow);

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.8)";

  particles.forEach(p=>{

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.r,
      0,
      Math.PI * 2
    );

    ctx.fill();

    p.y += p.speed;

    if(p.y > canvas.height){

      p.y = -10;

      p.x =
        Math.random() * canvas.width;

    }

  });

}

function createClouds(){

  for(let i=0; i<25; i++){

    particles.push({

      x:
        Math.random() * canvas.width,

      y:
        Math.random() * 250,

      size:
        80 + Math.random() * 150,

      speed:
        0.2 + Math.random()

    });

  }

}

function animateClouds(){

  currentAnimation =
    requestAnimationFrame(animateClouds);

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  particles.forEach(c=>{

    ctx.fillStyle =
      "rgba(255,255,255,0.15)";

    ctx.beginPath();

    ctx.arc(
      c.x,
      c.y,
      c.size,
      0,
      Math.PI * 2
    );

    ctx.fill();

    c.x += c.speed;

    if(c.x > canvas.width + 200){

      c.x = -200;

    }

  });

}

function createSunParticles(){

  for(let i=0; i<100; i++){

    particles.push({

      x:
        Math.random() * canvas.width,

      y:
        Math.random() * canvas.height,

      r:
        Math.random() * 2,

      speed:
        0.3 + Math.random()

    });

  }

}

function animateSun(){

  currentAnimation =
    requestAnimationFrame(animateSun);

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  particles.forEach(p=>{

    ctx.fillStyle =
      "rgba(255,255,150,0.5)";

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.r,
      0,
      Math.PI * 2
    );

    ctx.fill();

    p.y -= p.speed;

    if(p.y < 0){

      p.y = canvas.height;

    }

  });

}

function lightningEffect(){

  setInterval(()=>{

    document.body.style.filter =
      "brightness(2)";

    setTimeout(()=>{

      document.body.style.filter =
        "brightness(1)";

    },100);

  },5000);

}

function setDayCycle(hour){

  if(hour >= 6 && hour < 12){

    document.body.style.background =
      "linear-gradient(to bottom,#ffcc70,#87ceeb)";

  }

  else if(hour >= 12 && hour < 17){

    document.body.style.background =
      "linear-gradient(to bottom,#4facfe,#00f2fe)";

  }

  else if(hour >= 17 && hour < 20){

    document.body.style.background =
      "linear-gradient(to bottom,#ff9966,#ff5e62)";

  }

  else{

    document.body.style.background =
      "linear-gradient(to bottom,#0f2027,#203a43,#2c5364)";

  }

}

function showAQI(){

  const aqi =
    Math.floor(
      20 + Math.random() * 200
    );

  let level = "";

  if(aqi < 50){
    level = "Good";
  }

  else if(aqi < 100){
    level = "Moderate";
  }

  else{
    level = "Unhealthy";
  }

  document.getElementById("aqiValue")
  .innerText = aqi;

  document.getElementById("aqiLevel")
  .innerText = level;

}

function setWeatherVideo(condition){

  const video =
    document.getElementById("bgVideo");

  if(!video) return;

  condition = condition.toLowerCase();

  if(condition.includes("rain")){

    video.src =
      "videos/rain.mp4";

  }

  else if(condition.includes("snow")){

    video.src =
      "videos/snow.mp4";

  }

  else if(condition.includes("cloud")){

    video.src =
      "videos/clouds.mp4";

  }

  else{

    video.src =
      "videos/sunny.mp4";

  }

}

async function getWeather(){

  const url = `/api/weather?lat=${lat}&lng=${lng}`;
  console.log("URL:", url);
  try{

    const response =
      await fetch(url);

    

const text = await response.text();

console.log("RAW RESPONSE:", text);

if (!response.ok) {
  throw new Error(text);
}

const data = JSON.parse(text);

    console.log(data);
    console.log(response.status);

   if (data.error) {
    alert(data.error.message);
    return;
  }
    showCurrentWeather(data);

    showTodayHourly(
      data.forecast.forecastday[0].hour
    );

    showForecast(
      data.forecast.forecastday
    );
  }

  catch(error){
    console.log(error);

    alert(
      "Weather data not found"
    );
  }
}

function getWeatherIcon(condition){

  condition =
    condition.toLowerCase();

  if(condition.includes("cloud"))
    return "☁";

  if(condition.includes("rain"))
    return "🌧";

  if(condition.includes("clear"))
    return "☀";

  if(condition.includes("snow"))
    return "❄";

  if(condition.includes("storm"))
    return "⛈";

  return "🌍";

}

function showCurrentWeather(data){

  const current =
    data.current;

  const condition =
    current.condition.text;

  const icon =
    getWeatherIcon(condition);

  setWeatherBackground(condition);

  setWeatherVideo(condition);

  setDayCycle(
    new Date().getHours()
  );

  showAQI();

  document.getElementById(
    "currentWeather"
  ).innerHTML = `

    <div class="current-top">

      <div class="weather-icon">
        ${icon}
      </div>

      <div>

        <div class="current-temp">
          ${Math.round(current.temp_c)}°C
        </div>

        <div class="weather-desc">
          ${current.condition.text}
        </div>

      </div>

    </div>

    <div class="weather-details">

      <div class="detail-card">
        <h3>Humidity</h3>
        <p>${current.humidity}%</p>
      </div>

      <div class="detail-card">
        <h3>Wind Speed</h3>
        <p>${current.wind_kph} km/h</p>
      </div>

      <div class="detail-card">
        <h3>Pressure</h3>
        <p>${current.pressure_mb} mb</p>
      </div>

      <div class="detail-card">
        <h3>Feels Like</h3>
        <p>${Math.round(current.feelslike_c)}°C</p>
      </div>

    </div>

  `;

}

function showTodayHourly(list) {

  const container =
    document.getElementById("todayHourly");

  container.innerHTML = "";

  list.forEach(item => {

    const time =
      new Date(item.time)
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      });

    const temp =
      Math.round(item.temp_c);

    const icon =
      getWeatherIcon(
        item.condition.text
      );

    const row =
      document.createElement("div");

    row.className =
      "today-hour-row";

    row.innerHTML = `

      <div class="today-time">
        ${time}
      </div>

      <div class="today-icon">
        ${icon}
      </div>

      <div class="today-temp">
        ${temp}°C
      </div>

      <div class="today-humidity">
        💧 ${item.humidity}%
      </div>

      <div class="today-wind">
        🌬 ${item.wind_kph} km/h
      </div>

      <div class="today-rain">
        ☔ ${item.chance_of_rain}%
      </div>

    `;

    container.appendChild(row);

  });

}

function showForecast(days){

  const container =
    document.getElementById(
      "forecastContainer"
    );

  container.innerHTML = "";

  days.forEach(day=>{

    const date =
      new Date(day.date);

    const dayName =
      date.toLocaleDateString(
        "en-US",
        {
          weekday:"long"
        }
      );

    const icon =
      getWeatherIcon(
        day.day.condition.text
      );

    const card =
      document.createElement("div");

    card.className =
      "forecast-card glass";

    card.onclick = ()=>{

      showHourlyWeather(day);

    };

    card.innerHTML = `

      <div class="forecast-day">
        ${dayName}
      </div>

      <div class="forecast-icon">
        ${icon}
      </div>

      <div class="forecast-temp">
        ${Math.round(day.day.avgtemp_c)}°C
      </div>

      <div class="forecast-info">
        Humidity:
        ${day.day.avghumidity}%
      </div>

      <div class="forecast-info">
        Wind:
        ${day.day.maxwind_kph} km/h
      </div>

      <div class="forecast-info">
        Rain:
        ${day.day.daily_chance_of_rain}%
      </div>

      <div class="forecast-info">
        ${day.day.condition.text}
      </div>

    `;

    container.appendChild(card);

  });

}

function showHourlyWeather(day){

  const old =
    document.getElementById(
      "hourlyPopup"
    );

  if(old) old.remove();

  const popup =
    document.createElement("div");

  popup.id =
    "hourlyPopup";

  popup.className =
    "hourly-popup glass";

  let html = "";

  day.hour.forEach(hour => {

    const time =
      new Date(hour.time)
      .toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit"
        }
      );

    const icon =
      getWeatherIcon(
        hour.condition.text
      );

    html += `

      <div class="hour-card">

        <div class="hour-time">
          ${time}
        </div>

        <div class="hour-icon">
          ${icon}
        </div>

        <div class="hour-temp">
          ${Math.round(hour.temp_c)}°C
        </div>

        <div class="hour-humidity">
          💧 ${hour.humidity}%
        </div>

        <div class="hour-wind">
          🌬 ${hour.wind_kph} km/h
        </div>

        <div class="hour-rain">
          ☔ ${hour.chance_of_rain}%
        </div>

      </div>

    `;

  });

  popup.innerHTML = `

    <div class="popup-header">

      <h2>
        Hourly Weather
      </h2>

      <button
      onclick="closeHourlyPopup()">
        ✕
      </button>

    </div>

    <div class="hourly-container">

      ${html}

    </div>

  `;

  document.body.appendChild(popup);

}

function closeHourlyPopup(){

  const popup =
    document.getElementById(
      "hourlyPopup"
    );

  if(popup){
    popup.remove();
  }
}
getWeather();