const cityInput = document.querySelector(".input");
const searchBtn = document.querySelector(".search_btn");

const searchCity = document.querySelector(".search_city");
const notFound = document.querySelector(".not_found");
const weatherInfoSection = document.querySelector(".weather_info");

const cityNameTxt = document.querySelector(".city_name_txt");
const tempCurrentTxt = document.querySelector(".temp_current_txt");
const conditionTxt = document.querySelector(".condition_txt");
const humidityTxt = document.querySelector(".humidity_txt");
const windSpeedTxt = document.querySelector(".wind_speed_txt");
const weatherSummaryImg = document.querySelector(".weather_summary_img");
const currentDataTxt = document.querySelector(".current_data_txt");
const forecastItemsContainer = document.querySelector(
  ".forecast_items_container"
);

const apiKey = "6714fdd4ec2f8b095fc56035053dda8d";

const url = `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=${apiKey}`;

function getWeahetImg(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  if (id <= 804) return "clouds.svg";
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}

searchBtn.addEventListener("click", () => {
  if (cityInput.value != "") {
    updateWeatherInfo(cityInput.value.trim());
    cityInput.value = "";
  }
});
cityInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && cityInput.value != "") {
    updateWeatherInfo(cityInput.value.trim());
    cityInput.value = "";
  }
});

async function updateWeatherInfo(city) {
  let weatherData = await getData("weather", city);
  if (weatherData.cod == 404) {
    notFound.style.display = "block";
    searchCity.style.display = "none";
    weatherInfoSection.style.display = "none";

    document.querySelector(
      ".not_found_txt"
    ).innerHTML = `Not Found "<span style="font-weight: 200">${city}</span>" City`;
  } else {
    weatherInfoSection.style.display = "block";
    notFound.style.display = "none";
    searchCity.style.display = "none";
    const {
      name: cityName,
      main: { temp, humidity },
      weather: [{ id, main }],
      wind: { speed },
    } = weatherData;
    cityNameTxt.textContent = cityName;
    tempCurrentTxt.textContent = Math.round(temp) + " °C";
    conditionTxt.textContent = main;
    humidityTxt.textContent = humidity + "%";
    windSpeedTxt.textContent = speed + " M/s";
    currentDataTxt.textContent = getCurrentDate();
    weatherSummaryImg.src = `/assets/weather/${getWeahetImg(id)}`;
    updateForecastWeather(city);
  }
}

async function updateForecastWeather(city) {
  let forecastWeather = await getData("forecast", city);
  const timeTaken = "12:00:00";
  const dateTaken = new Date();
  const dateOption = {
    month: "short",
    day: "2-digit",
  };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);

  const todayDate = new Date().toISOString().split("T")[0];
  forecastItemsContainer.innerHTML = "";
  forecastWeather.list.forEach((forecastData) => {
    if (
      forecastData.dt_txt.includes(timeTaken) &&
      !forecastData.dt_txt.includes(todayDate)
    ) {
      updateForecastItem(forecastData);
    }
  });
}

function updateForecastItem(forecastData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = forecastData;
  const dateTaken = new Date(date);
  const dateOption = {
    month: "short",
    day: "2-digit",
  };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);

  const forecastItem = `
  <div class="forecast_item">
            <p>${dateResult}</p>
            <img src="./assets/weather/${getWeahetImg(id)}" alt="" />
            <h4>${Math.round(temp)} °C</h4>
          </div>
  `;
  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}

async function getData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  let data = await fetch(apiUrl);
  return data.json();
}
