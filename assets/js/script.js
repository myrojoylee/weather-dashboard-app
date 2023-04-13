// weather variables

const WeatherAPIKey = "021e75b0e3380e236b4ff6031ae2dde4";

const userCity = document.querySelector("#city-search-box");
const search = document.querySelector(".search");
const currentCity = document.querySelector(".current-city");
const currentTemp = document.querySelector(".current-temp");
const currentWindSpeed = document.querySelector(".current-wind-speed");
const currentHumidity = document.querySelector(".current-humidity");
const todaysDate = document.querySelector(".current-date");
const citySearchHistory = document.querySelector(".city-search-history");
// date

// =================================================
// Time and date variables
// =================================================
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
// let twoDigitYear = Number(currentYear.toString().slice(2, 4));
let currentMonth = currentDate.getMonth() + 1;
let currentDayOfMonth = currentDate.getDate();
// let currentHour = currentDate.getHours();
// let currentMinutes = currentDate.getMinutes();
let currentUnixTime = Date.now();
let diffInUnixTime;

let weatherEmoji = [{ sun: "☀", cloud: "☁" }];
let buttonCount = 0;
let searchHistory = [];
let temporaryStorage = [];
let city, temp, windspeed, humidity;

let recentlySearched;
let cityClicked;
let cityToSearch;
let latitude, longitude, cityCoordinate, fiveDayData;
let timeStampDays = [];
let newSearch = false;
// =================================================
//          ------------ Code -----------
// =================================================

// get weather from search
search.addEventListener("click", function () {
  newSearch = true;
  let dailyForecastURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userCity.value +
    "&appid=" +
    WeatherAPIKey +
    "&units=imperial";
  fetch(dailyForecastURL)
    .then((response) => response.json())
    .then(obtainCurrentWeather);
});

// get weather from search history
function fetchWeather(cityName) {
  let queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    WeatherAPIKey +
    "&units=imperial";
  fetch(queryURL)
    .then((response) => response.json())
    .then(obtainCurrentWeather);
}

// get weather data off of api
function obtainCurrentWeather(weather) {
  console.log(weather);
  if (newSearch === true) {
    cityName = userCity.value;
    cityToSearch = userCity.value;
  }
  currentCity.textContent = cityName;
  todaysDate.textContent = ` ${currentMonth}/${currentDayOfMonth}/${currentYear}`;
  currentTemp.textContent = `${weather.main.temp}`;
  currentWindSpeed.textContent = `${weather.wind.speed}`;
  currentHumidity.textContent = `${weather.main.humidity}`;

  getCoordinatesFromLocation(cityToSearch);

  if (newSearch === true) {
    storeSearchHistory();
  }
}

function storeSearchHistory() {
  temporaryStorage = {
    city: currentCity.textContent,
    temp: `${currentTemp.textContent}`,
    windspeed: `${currentWindSpeed.textContent}`,
    humidity: `${currentHumidity.textContent}`,
  };

  searchHistory.push(temporaryStorage);
  // storageHandling();
  createSearchHistory();
}

function createSearchHistory() {
  //quick search from recent search history
  recentlySearched = document.createElement("button");
  recentlySearched.textContent = `${cityName}`;
  citySearchHistory.appendChild(recentlySearched);
  recentlySearched.display = "flex";
  recentlySearched.style.backgroundColor = "rgb(174, 174, 175)";
  recentlySearched.style.width = "100%";
  recentlySearched.style.padding = "0.5em";
  recentlySearched.style.borderRadius = "0.25em";
  recentlySearched.style.marginTop = "0.5em";
  recentlySearched.style.cursor = "pointer";
  citySearchHistory.appendChild(recentlySearched);
  buttonCount++;
  recentlySearched.addEventListener("click", function (e) {
    cityClicked = e.target.textContent;
    checkCity();
  });
}

function storageHandling() {
  if (localStorage !== null) {
    searchHistory = JSON.parse(localStorage.getItem("city-info"));
  }
}

// reading weather from cities in recent history
function checkCity() {
  newSearch = false;
  cityName = cityClicked;
  fetchWeather(cityName);
  currentCity.textContent = cityName;
}

function getCoordinatesFromLocation(cityToSearch) {
  let geocodeURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityToSearch +
    "&appid=" +
    WeatherAPIKey;

  fetch(geocodeURL)
    .then((response) => response.json())
    .then(function (e) {
      latitude = e[0].lat;
      longitude = e[0].lon;
    })
    .then(fetchFiveDayForecast);
}

function fetchFiveDayForecast() {
  let fiveDayForecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    WeatherAPIKey +
    "&units=imperial";

  fetch(fiveDayForecastURL)
    .then((response) => response.json())
    .then(function (e) {
      fiveDayData = e;
    })
    .then(unixTimeConversions);
}

function unixTimeConversions() {
  // console.log(fiveDayData);

  for (let i = 0; i < fiveDayData.list.length; i++) {
    let listOfTimeStamps = fiveDayData.list[i].dt;
    let timeStamp = new Date(listOfTimeStamps * 1000);
    let dayOfTimeStamp = timeStamp.toLocaleString("en-us", { weekday: "long" });
    timeStampDays.push(dayOfTimeStamp);
  }
  renderFiveDayForecast();
}

function renderFiveDayForecast() {
  for (let i = 0; i < timeStampDays.length - 1; i++) {
    if (timeStampDays[i] !== timeStampDays[i + 1]) {
      console.log(`${timeStampDays[i]} is on index ${i}`);
      console.log(`${timeStampDays[i + 1]} is on index ${i + 1}`);
    }
  }
}
