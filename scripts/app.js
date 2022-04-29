const tempSwitch = document.querySelector("#temp-switch");
const magnifier = document.querySelector("#search");
const cityForm = document.querySelector("form");
const details = document.querySelector(".details");
const currentContainer = document.querySelector(".container");
const container12Hours = document.querySelector(".hours12-container");
const container5Days = document.querySelector(".days5-container");
const forecastBox = document.getElementById("forecast-box");
const forecastButton = document.getElementById("forecast-buttons");
const errorBox = document.querySelector('.error-box');
const forecast = new Forecast();
const fahToCel = fah => Math.round((fah - 32) * (5 / 9));
let data1 = [];
let uiUpdateCounter = 0;

// Sample display data if an API error occurs

sample = () => {
  fetch("toronto.json")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      updateUI(data)
    })
    .catch(err => alert(err));
}

// UI updater

const updateUI = data => {
  document.getElementById('loading-box').classList.add('d-none');
  const { cityDetails, weather, forecast5Days, day12Hours } = data;
  data1 = data;
  if(uiUpdateCounter === 0){
    document.getElementById('forecast-div').classList.remove('d-none');
    document.getElementById('temp-switch').classList.remove('d-none');
    document.getElementById('search').classList.remove('d-none');
    uiUpdateCounter += 1;
  }
  checkDayNight(weather);
  fillCurrentConditions(cityDetails, weather);
  fill12Hours(day12Hours);
  fill5Days(forecast5Days, weather);
  tempScale(weather, forecast5Days, day12Hours);
  localStorage.setItem("recentInfo", JSON.stringify(data));
};

// Search box handler

cityForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityForm.city.value.trim();
  cityForm.reset();
  document.getElementById('launch-icon').classList.add('d-none');
  document.getElementById('loading-box').classList.remove('d-none');
  forecast.updateCity(city)
    .then(data => updateUI(data))
    .catch(err => {
      errorBox.classList.remove("d-none");
      errorBox.innerHTML = `
      Sorry, no information for that location, or the daily limit of 50 API requests has been reached.`;
      setTimeout(() => {
        errorBox.classList.add("d-none");
        document.getElementById('loading-box').classList.add('d-none');
      }, 5500);
      console.log(err);
    });
  localStorage.setItem("city", city);
});

// Search box toggler

magnifier.addEventListener("click", (e) => {
  e.preventDefault();
  cityForm.classList.toggle("d-none");
});

// Temperature scale changer

tempSwitch.addEventListener("click", e => {
  tempSwitch.innerHTML = tempSwitch.innerHTML == "°C" ? `&deg;F` : `&deg;C`;
  let tempPreference = tempSwitch.innerHTML;
  localStorage.setItem("tempPreference", tempPreference);
  const { weather, forecast5Days, day12Hours } = data1;
  tempScale(weather, forecast5Days, day12Hours);
});

// Forcast buttons div listener

forecastButton.addEventListener('click', e => {
  let title = document.getElementById('forecast-title');
  if(e.target.innerText === "Show Forecasts"){
    e.target.innerText = "Hide Forecasts";
    forecastBox.classList.toggle('d-none');
    document.getElementById('days5-btn').classList.toggle('d-none');
    document.getElementById('hours12-btn').classList.toggle('d-none');
  }
  else if(e.target.innerText === "Hide Forecasts"){
    e.target.innerText = "Show Forecasts";
    forecastBox.classList.toggle('d-none');
    document.getElementById('days5-btn').classList.toggle('d-none');
    document.getElementById('hours12-btn').classList.toggle('d-none');
  }
  else if (e.target.innerText === "12-Hours") {
    title.innerText = e.target.innerText;
    container12Hours.classList.remove("d-none");
    container5Days.classList.add("d-none");
  } 
  else if(e.target.innerText === "5-Days"){
    title.innerText = e.target.innerText;
    container12Hours.classList.add("d-none");
    container5Days.classList.remove("d-none");
  }
})

windowCheck =_=>{
  if(window.innerWidth > 1023){
    container12Hours.classList.contains('d-none') && 
      container5Days.classList.remove('d-none');
    }
}

window.innerWidth > 1023 && container5Days.classList.toggle('d-none');

// Check for temperature scale preferecnce

if (localStorage.getItem("tempPreference")) {
  let scale = localStorage.getItem("tempPreference");
  tempSwitch.innerHTML = scale;
};

// Get data for the last location queried

if (localStorage.getItem('city')) {
  document.getElementById('launch-icon').classList.add('d-none');
  forecast.updateCity(localStorage.getItem('city'))
    .then(data => updateUI(data))
    .catch(err => console.log(err));
}