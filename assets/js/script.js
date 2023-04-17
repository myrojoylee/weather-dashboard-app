// =================================================
// DOM element selector variables
// =================================================

const WeatherAPIKey = "021e75b0e3380e236b4ff6031ae2dde4";
const userCity = document.querySelector("#city-search-box");
const search = document.querySelector(".search");
const clear = document.querySelector(".clear");
const currentCity = document.querySelector(".current-city");
const currentTemp = document.querySelector(".current-temp");
const currentWindSpeed = document.querySelector(".current-wind-speed");
const currentHumidity = document.querySelector(".current-humidity");
const currentWeatherIcon = document.querySelector(".current-weather-icon");
const todaysDate = document.querySelector(".current-date");
const citySearchHistory = document.querySelector(".city-search-history");
const tempFiveDay = document.querySelectorAll(".temp");
const windSpeedFiveDay = document.querySelectorAll(".wind");
const humidFiveDay = document.querySelectorAll(".humid");
const dateFiveDay = document.querySelectorAll(".date");
const iconFiveDay = document.querySelectorAll(".icon");

// =================================================
// Time and date variables
// =================================================
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth() + 1;
let currentDayOfMonth = currentDate.getDate();
let currentUnixTime = Date.now();

let buttonCount = 0;
let buttonId = [];
let searchHistory = [];
let temporaryStorage = [];
let fiveWeatherLines;
let fiveDayLines;
let city, temp, windspeed, humidity;
let listOfTimeStamps, timeStamp, dayOfTimeStamp;

let recentlySearched;
let cityClicked;
let cityToSearch, weatherIcon, fiveDayWeatherIcon;
let latitude, longitude, cityCoordinate, fiveDayData, focusedFiveDayData;
let timeStampDays = [];
let dayChange = [];
let newSearch = false;
let removeIndex, numberOfButtons;

// =================================================
//          ------------ Code -----------
// =================================================

// clear search history

clear.addEventListener("click", function () {
  numberOfButtons = buttonId.length;
  for (let i = 0; i < numberOfButtons; i++) {
    removeIndex = buttonId[0];
    document.getElementById(removeIndex).remove();
    buttonId.shift();
    searchHistory.shift();
  }
  newSearch = true;
});

// get weather from search
search.addEventListener("click", function () {
  let dailyForecastURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userCity.value +
    "&appid=" +
    WeatherAPIKey +
    "&units=imperial";
  fetch(dailyForecastURL)
    .then((response) => response.json())
    .then(obtainCurrentWeather);
  if (searchHistory.length > 0) {
    if (searchHistory.includes(userCity.value) === false) {
      if (buttonCount > 7) {
        searchHistory.shift();
        searchHistory.push(userCity.value);
        document.getElementById(buttonId[0]).remove();
        buttonId.shift();
      } else {
        searchHistory.push(userCity.value);
        buttonCount++;
        // console.log(buttonCount);
      }
      newSearch = true;
    } else {
      newSearch = false;
    }
  } else {
    searchHistory.push(userCity.value);
    newSearch = true;
    buttonCount++;
  }
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
  if (newSearch === true) {
    cityName = userCity.value;
    cityToSearch = userCity.value;
    currentCity.textContent = cityName;
  } else {
    cityClicked === userCity.value;
    currentCity.textContent = cityClicked;
    cityToSearch = cityClicked;
  }

  weatherIcon = weather.weather[0].icon;
  todaysDate.textContent = ` ${currentMonth}/${currentDayOfMonth}/${currentYear}`;
  currentTemp.textContent = `${weather.main.temp}`;
  currentWindSpeed.textContent = `${weather.wind.speed}`;
  currentHumidity.textContent = `${weather.main.humidity}`;
  currentWeatherIcon.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

  getCoordinatesFromLocation(cityToSearch);

  if (newSearch === true) {
    createSearchHistory();
  }
}
// function storeSearchHistory() {
//   temporaryStorage = {
//     city: currentCity.textContent,
//     temp: `${currentTemp.textContent}`,
//     windspeed: `${currentWindSpeed.textContent}`,
//     humidity: `${currentHumidity.textContent}`,
//   };
//   createSearchHistory();
// }
function createSearchHistory() {
  // renders search history buttons
  // if they are not duplicates
  if (newSearch === true) {
    let idButton = searchHistory[searchHistory.length - 1];
    let tempId = idButton.toLowerCase();
    buttonId.push(tempId);
    // console.log(buttonId);
    recentlySearched = document.createElement("button");
    recentlySearched.textContent = `${searchHistory[searchHistory.length - 1]}`;
    citySearchHistory.appendChild(recentlySearched);
    recentlySearched.display = "flex";
    recentlySearched.style.backgroundColor = "rgb(174, 174, 175)";
    recentlySearched.style.width = "100%";
    recentlySearched.style.padding = "0.5em";
    recentlySearched.style.borderRadius = "0.25em";
    recentlySearched.style.marginTop = "0.5em";
    recentlySearched.style.cursor = "pointer";
    recentlySearched.setAttribute("id", tempId);
    // citySearchHistory.appendChild(recentlySearched);
  }
  // adding event listeners to the newly created button elements
  recentlySearched.addEventListener("click", function (e) {
    cityClicked = e.target.textContent;
    // console.log(searchHistory);
    checkCity();
  });
}

// function storageHandling() {
//   if (localStorage !== null) {
//     searchHistory = JSON.parse(localStorage.getItem("city-info"));
//   }
// }

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
  focusedFiveDayData = fiveDayData.list;

  // converting unix time to get name of day
  timeStampDays = [];
  for (let i = 0; i < fiveDayData.list.length; i++) {
    listOfTimeStamps = focusedFiveDayData[i].dt;
    timeStamp = new Date(listOfTimeStamps * 1000);
    dayOfTimeStamp = timeStamp.toLocaleString("en-us", { weekday: "long" });
    timeStampDays.push(dayOfTimeStamp);
  }

  renderFiveDayForecast();
}

function renderFiveDayForecast() {
  // cleared to not keep the previous city search data
  fiveWeatherLines = [];
  fiveDayLines = [];

  // next we take our array of 40 days and simplify it
  // by removing duplicate entries to signal change of day
  for (let i = 0; i < timeStampDays.length - 1; i++) {
    if (timeStampDays[i] !== timeStampDays[i + 1]) {
      fiveWeatherLines.push(focusedFiveDayData[i + 1]);
      fiveDayLines.push(timeStampDays[i + 1]);
    }
  }

  // out of our simplified array of 5 days, we can now
  // get the values we need and render them on the page
  for (let i = 0; i < fiveWeatherLines.length; i++) {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    fiveDayWeatherIcon = fiveWeatherLines[i].weather[0].icon;
    dateFiveDay[i].textContent = `${new Date(
      fiveWeatherLines[i].dt * 1000
    ).toLocaleString("en-US", options)}`;
    tempFiveDay[i].textContent = `Temp: ${fiveWeatherLines[i].main.temp} ℉`;
    windSpeedFiveDay[
      i
    ].textContent = `Wind: ${fiveWeatherLines[i].wind.speed} MPH`;
    humidFiveDay[
      i
    ].textContent = `Humidity: ${fiveWeatherLines[i].main.humidity} %`;
    iconFiveDay[
      i
    ].src = `https://openweathermap.org/img/wn/${fiveDayWeatherIcon}.png`;
  }
}
