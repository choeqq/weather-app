const iconEl = document.querySelector("[data-icon");
const weatherDescripctionEl = document.querySelector(
  "[data-weather-description]"
);
const dateEl = document.querySelector("[data-date]");
const temperatureEl = document.querySelector("[data-temperature]");
const windEl = document.querySelector("[data-wind]");
const feelsLikeEl = document.querySelector("[data-feels-like]");
const pressureEl = document.querySelector("[data-pressure]");
const humidityEl = document.querySelector("[data-humidity]");
const search = document.querySelector("[data-input]");
const form = document.getElementById("form");
const cityNameEl = document.querySelector("[data-city-name]");
const countryNameEl = document.querySelector("[data-country-name]");

const options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
const today = new Date();
dateEl.textContent = today.toLocaleDateString("en-US", options);

const API_KEY = "1b36d0465f5de3f0a2cd5204297ae737";
const API_URL = (location) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;

async function getWeathetByLocation(location) {
  const resp = await fetch(API_URL(location), { origin: "cors" });
  const respData = await resp.json();

  addWeather(respData);
}

window.addEventListener("load", () => {
  let long;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const API = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`;

      fetch(API)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          addWeather(data);
        });
    });
  }
});

function KtoC(K) {
  return K - 273.15;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = search.value;

  if (city) {
    getWeathetByLocation(city);
  }

  search.value = "";
});

function addWeather(data) {
  const temperature = Math.floor(KtoC(data.main.temp));
  const wind = data.wind.speed + " km/h";
  const feelsLike = Math.floor(KtoC(data.main.feels_like));
  const pressure = Math.floor(data.main.pressure);
  const humidity = Math.floor(data.main.humidity);
  const cityName = data.name;
  const countryName = data.sys.country;
  const weatherDescripction = data.weather[0].description.toUpperCase();
  const icon = data.weather[0].icon;

  weatherDescripctionEl.textContent = weatherDescripction;
  temperatureEl.textContent = temperature + "°";
  windEl.textContent = wind;
  feelsLikeEl.textContent = feelsLike + "°";
  pressureEl.textContent = pressure + " hPa";
  humidityEl.textContent = humidity + "%";
  cityNameEl.textContent = cityName;
  countryNameEl.textContent = ", " + countryName;
  iconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" />`;
}
