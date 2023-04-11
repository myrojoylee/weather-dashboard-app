// weather variables

const WeatherAPIKey = "021e75b0e3380e236b4ff6031ae2dde4";

let userCity = document.querySelector("#city-search-box");
let search = document.querySelector(".search");
let currentCity = document.querySelector(".current-city");
let currentTemp = document.querySelector(".current-temp");
let currentWindSpeed = document.querySelector(".current-wind-speed");
let currentHumidity = document.querySelector(".current-humidity");
let todaysDate = document.querySelector(".current-date");

// date

// =================================================
// Time and date variables
// =================================================
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
// let twoDigitYear = Number(currentYear.toString().slice(2, 4));
let currentMonth = currentDate.getMonth() + 1;
let currentDayOfMonth = currentDate.getDate();
let currentHour = currentDate.getHours();
let currentMinutes = currentDate.getMinutes();

let weatherEmoji = [{ sun: "☀", cloud: "☁" }];
// =================================================
//          ------------ Code -----------
// =================================================
search.addEventListener("click", function () {
  let queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userCity.value +
    "&appid=" +
    WeatherAPIKey;
  fetch(queryURL)
    .then((response) => response.json())
    .then(cityData);
});

function cityData(weather) {
  console.log(weather);
  let degK = weather.main.temp;
  let degF = ((degK - 273.15) * (9 / 5) + 32).toFixed(1);
  let windSpeedMetric = weather.wind.speed;
  let windSpeedImperial = (windSpeedMetric * 2.237).toFixed(1);
  currentCity.textContent = userCity.value;
  todaysDate.textContent = ` ${currentMonth}/${currentDayOfMonth}/${currentYear}`;
  currentTemp.textContent = `${degF}`;
  currentWindSpeed.textContent = `${windSpeedImperial}`;
  currentHumidity.textContent = `${weather.main.humidity}`;
}

function quickFetch() {
  //quick search from recent search history
}
