import Controller from "./controller";
import format from "date-fns/format";
import { Chart } from "chart.js/auto";

export default class UserInterface {
  // Instantiate all user interface elements
  constructor() {
    // Top bar (Search bar + Temperature unit toggle)
    this.locationInput = document.querySelector(".search-side > input");
    this.getUserLocation = document.querySelector(".get-location > span");
    this.searchBtn = document.querySelector(".search-btn");
    this.celsiusToggle = document.querySelector(".celsius");
    this.fahrenheitToggle = document.querySelector(".fahrenheit");
    this.unitSlider = document.querySelector(".slider");

    // Day time and date
    this.currentTime = document.querySelector(".date h1");
    this.currentTimerSmallSize = document.querySelector(".date-smaller h1");
    this.currentDate = document.querySelector(".date p");
    this.currentDateSmallSize = document.querySelector(".date-smaller p");

    //Weather info display
    this.uvIndexValue = document.querySelector(".uv-index-value");
    this.uvIndexStatus = document.querySelector(".info-message.uv-index");
    this.uvIndexCurve = document.querySelector("#uv-actual");

    this.windSpeedValue = document.querySelector("#wind-speed");
    this.windStatus = document.querySelector(".info-message.wind");

    this.humidityValue = document.querySelector("#humidity-percentage");
    this.humidityStatus = document.querySelector(".info-message.humidity");

    this.visibilityValue = document.querySelector("#visibility-distance");
    this.visibilityStatus = document.querySelector(".info-message.visibility");

    this.airQualityValue = document.querySelector("#air-quality-score");
    this.airQualityStatus = document.querySelector(".info-message.air-quality");

    this.todayWeatherIcon = document.querySelector(".weather-condition img");
    this.todayWeatherDescription = document.querySelector(
      ".weather-description h1"
    );
    this.todayWeatherWarning = document.querySelector(".weather-description p");

    this.todayTemperature = document.querySelector(".today-temperature h1");
    this.todayTempUnit = document.querySelector(".today-temperature p");

    this.activeLocation = document.querySelector(".location p");

    this.feelsLikeValue = document.querySelector(
      ".feels-like span:first-of-type"
    );

    this.feelsLikeUnit = document.querySelector(
      ".feels-like span:not(:first-of-type)"
    );

    this.todayChanceRain = document.querySelector(
      ".chance-rain span:first-of-type"
    );

    this.todaySunrise = document.querySelector(".sunrise span");
    this.todaySunset = document.querySelector(".sunset span");

    this.sunArc = document.querySelector("#full-arc");
    this.sunIcon = document.querySelector("#sunset-rise-curve svg");
    this.threeDayForecastSlide = document.querySelector(".slide");

    this.rainChartToggle = document.querySelector(
      ".charts-menu > h2:first-of-type"
    );
    this.tempChartToggle = document.querySelector(
      ".charts-menu > h2:nth-of-type(2) "
    );
    this.currentRainChart = "";
    this.currentTempChart = "";
    this.rainChart = document.querySelector("#rain-chart");
    this.tempChart = document.querySelector("#temp-chart");
    this.dayWeatherIcon = [];
    this.nightWeatherIcon = [];

    //Control variable for other functions
    this.activeTemperatureUnit = "celsius";
    this.arrayRandomCities = [
      "Tokyo",
      "New York City",
      "London",
      "Paris",
      "Sydney",
      "Moscow",
      "Rio de Janeiro",
      "Cairo",
      "Cape Town",
      "Mumbai",
      "Beijing",
      "Buenos Aires",
      "Rome",
      "Istanbul",
      "Toronto",
      "Dubai",
      "Berlin",
      "Seoul",
      "Mexico City",
      "Bangkok",
    ];
    this.uvIndexStatusMessage = {
      1: "Low",
      2: "Low",
      3: "Moderate",
      4: "Moderate",
      5: "Moderate",
      6: "High",
      7: "High",
      8: "Very High",
      9: "Very High",
      10: "Very High",
      11: "Extreme",
    };

    this.aqiStatusMessage = {
      1: "Good",
      2: "Moderate",
      3: "Unhealthy for sensitive group",
      4: "Unhealthy",
      5: "Very Unhealthy",
      6: "Hazardous",
    };
  }

  //Instantiate all event listeners required
  hookEventListeners() {
    //Render page with random weather data
    window.addEventListener(
      "load",
      function () {
        this.renderTime();
        this.renderDate();

        setInterval(() => {
          this.renderTime();
          this.renderDate();
        }, 1000);

        this.renderWeatherData();
      }.bind(this)
    );

    document.addEventListener(
      "keyup",
      function (event) {
        if (event.keyCode == 13) {
          if (this.locationInput.value != "") {
            this.getSearchInput();
            this.resetCharts();
            this.renderWeatherData();
          }
        }
      }.bind(this)
    );

    //Load all icon
    [this.dayWeatherIcon, this.nightWeatherIcon] =
      Controller.importWeatherIcons();

    //Search inputed location
    this.searchBtn.addEventListener(
      "click",
      function () {
        this.getSearchInput();
        this.renderWeatherData();
      }.bind(this)
    );

    //Get current user location button
    this.getUserLocation.addEventListener(
      "click",
      this.showUserLocation.bind(this)
    );

    //Animate unit selection
    this.celsiusToggle.addEventListener("click", (event) => {
      const bindedFunc = this.handleUnitSelection.bind(this);
      bindedFunc(event.target);
    });

    this.fahrenheitToggle.addEventListener("click", (event) => {
      const bindedFunc = this.handleUnitSelection.bind(this);
      bindedFunc(event.target);
    });

    this.rainChartToggle.addEventListener(
      "click",
      function (event) {
        this.animateChartSelection(event.target);
      }.bind(this)
    );

    this.tempChartToggle.addEventListener(
      "click",
      function (event) {
        this.animateChartSelection(event.target);
      }.bind(this)
    );
  }

  getSearchInput() {
    return (Controller.activeLocation = { city: this.locationInput.value });
  }

  getRandomLocation() {
    Controller.activeLocation = {
      city: this.arrayRandomCities[
        Math.floor(Math.random() * this.arrayRandomCities.length)
      ],
    };
  }

  //Load page with data
  async renderWeatherData() {
    if (this.locationInput.value == "") {
      this.getRandomLocation();
    }

    const weatherData = await Controller.getWeatherData(
      Controller.activeLocation.city
    );

    console.log(weatherData.hourlyTempForecast);

    this.renderUVindex(weatherData.uv);
    this.renderWindStatus(weatherData.windSpeed, weatherData.windDirection);
    this.renderHumidity(
      weatherData.humidity,
      weatherData.dewPoint,
      this.activeTemperatureUnit
    );
    this.renderVisibility(weatherData.visibility);
    this.renderAQI(weatherData.aqi);
    this.renderCondition(weatherData.condition, weatherData.warning);
    this.renderIcon(weatherData.iconCode);
    this.renderTodayTemp(weatherData.temp, this.activeTemperatureUnit);
    this.renderLocation(weatherData.location);
    this.renderFeelsLike(weatherData.feelsLike, this.activeTemperatureUnit);
    this.renderRain(weatherData.rain_chance);
    this.renderSunrise(weatherData.sunrise);
    this.renderSunset(weatherData.sunset);
    this.animateSunrise(
      Controller.getSunCurveLength(
        weatherData.sunrise,
        weatherData.sunset,
        weatherData.localTime
      )
    );

    this.renderWeekForcast(
      weatherData.threeDayForecast,
      this.activeTemperatureUnit
    );

    this.renderHourlyTemperatureChart(
      weatherData.hourlyTempForecast,
      this.activeTemperatureUnit
    );
    this.renderHourlyRainChart(weatherData.hourlyRainForecast);
  }

  renderTime() {
    this.currentTime.innerHTML = new Date().toLocaleTimeString("en-US", {
      hourCycle: "h23",
      hour12: true,
      hour: "2-digit",
      minute: "numeric",
    });

    this.currentTimerSmallSize.innerHTML = new Date().toLocaleTimeString(
      "en-US",
      {
        hourCycle: "h23",
        hour12: true,
        hour: "2-digit",
        minute: "numeric",
      }
    );
  }

  renderDate() {
    this.currentDate.innerHTML = format(new Date(), "iiii, dd MMMM RRRR ");
    this.currentDateSmallSize.innerHTML = format(
      new Date(),
      "iiii, dd MMMM RRRR "
    );
  }

  renderUVindex(uvData) {
    this.uvIndexValue.innerHTML = uvData;
    const uvDashoffset = Math.floor((1 - uvData / 11) * 223);
    this.uvIndexCurve.style.setProperty("--uv-curve-dashoffset", uvDashoffset);
    this.uvIndexStatus.innerHTML = this.uvIndexStatusMessage[uvData];
  }

  renderWindStatus(windData, windStatus) {
    this.windSpeedValue.innerHTML = windData;
    this.windStatus.innerHTML = windStatus;
  }

  renderHumidity(humidityValue, dewPoint, unit) {
    this.humidityValue.innerHTML = humidityValue;

    if (unit == "celsius") {
      this.humidityStatus.innerHTML = `Dew point at ${dewPoint.celsius}°`;
    } else {
      this.humidityStatus.innerHTML = `Dew point at ${dewPoint.fahrenheit}°`;
    }
  }

  renderVisibility(visibilityData) {
    this.visibilityValue.innerHTML = visibilityData;
    if (visibilityData >= 10) {
      this.visibilityStatus.innerHTML = "Clear Visibility";
    } else {
      this.visibilityStatus.innerHTML = "Reduced Visibility";
    }
  }

  renderAQI(aqiData) {
    this.airQualityValue.innerHTML = aqiData;
    this.airQualityStatus.innerHTML = this.aqiStatusMessage[aqiData];
  }

  renderCondition(conditionData, warningData) {
    this.todayWeatherDescription.innerHTML = conditionData;
    this.todayWeatherWarning.innerHTML = warningData;
  }

  renderIcon(iconCode) {
    if (format(new Date(), "b") == "PM") {
      this.todayWeatherIcon.src = this.nightWeatherIcon[`night${iconCode}`];
    } else {
      this.todayWeatherIcon.src = this.dayWeatherIcon[`day${iconCode}`];
    }
  }

  renderTodayTemp(todayTemp, unit) {
    if (unit == "celsius") {
      this.todayTemperature.innerHTML = todayTemp.celsius;
    } else {
      this.todayTemperature.innerHTML = todayTemp.fahrenheit;
    }
  }

  renderLocation(locationData) {
    this.activeLocation.innerHTML = locationData;
  }

  renderFeelsLike(feelslikeData, unit) {
    if (unit == "celsius") {
      this.feelsLikeValue.innerHTML = feelslikeData.celsius;
    } else {
      this.feelsLikeValue.innerHTML = feelslikeData.fahrenheit;
    }
  }

  renderRain(rainData) {
    this.todayChanceRain.innerHTML = rainData;
  }

  renderSunrise(sunriseData) {
    this.todaySunrise.innerHTML = sunriseData;
  }

  renderSunset(sunsetData) {
    this.todaySunset.innerHTML = sunsetData;
  }

  // Get the location input to search for
  getSearchLocationInput() {
    return this.locationInput.value;
  }
  // Update the target location in the search bar upon user geolocation identification
  async showUserLocation() {
    const userLocationInfo = await Controller.getUserLocation();

    this.locationInput.value =
      userLocationInfo.city + ", " + userLocationInfo.country;

    Controller.activeLocation = { city: userLocationInfo.city };
    this.threeDayForecastSlide.innerHTML = "";
    this.resetCharts();
    this.renderWeatherData();
  }

  //Handle the slider animation when selecting a unit
  animateUnitSelection(targetElement) {
    if (
      targetElement == this.celsiusToggle &&
      targetElement.getAttribute("active") == "false"
    ) {
      this.unitSlider.classList.remove("clicked");
      this.celsiusToggle.setAttribute("active", "true");
      this.fahrenheitToggle.setAttribute("active", "false");
      this.activeTemperatureUnit = "celsius";
    } else if (
      targetElement == this.fahrenheitToggle &&
      targetElement.getAttribute("active") == "false"
    ) {
      this.unitSlider.classList.add("clicked");
      this.fahrenheitToggle.setAttribute("active", "true");
      this.celsiusToggle.setAttribute("active", "false");
      this.activeTemperatureUnit = "fahrenheit";
    }
  }

  animateChartSelection(targetElement) {
    if (
      targetElement == this.rainChartToggle &&
      targetElement.getAttribute("selected") == "false"
    ) {
      this.rainChartToggle.setAttribute("selected", "true");
      this.tempChartToggle.setAttribute("selected", "false");
      this.rainChart.style.display = "none";
      this.tempChart.style.display = "inline";
    } else if (
      targetElement == this.tempChartToggle &&
      targetElement.getAttribute("selected") == "false"
    ) {
      this.tempChartToggle.setAttribute("selected", "true");
      this.rainChartToggle.setAttribute("selected", "false");
      this.tempChart.style.display = "none";
      this.rainChart.style.display = "inline";
    }
  }

  // Update to the active temperature unit
  updateTemperatureUnit(weatherData) {
    if (this.activeTemperatureUnit == "celsius") {
      this.todayTempUnit.innerHTML = "°C";
      this.feelsLikeUnit.innerHTML = "°C";
      this.todayTemperature.childNodes[0].textContent =
        weatherData.temp.celsius;
      this.feelsLikeValue.innerHTML = weatherData.feelsLike.celsius;
      this.renderHumidity(
        weatherData.humidity,
        weatherData.dewPoint,
        "celsius"
      );
      this.threeDayForecastSlide.innerHTML = "";
      this.renderWeekForcast(weatherData.threeDayForecast, "celsius");
      this.resetCharts();
      this.renderHourlyTemperatureChart(
        weatherData.hourlyTempForecast,
        "celsius"
      );
      this.renderHourlyRainChart(weatherData.hourlyRainForecast);
    } else {
      this.todayTempUnit.innerHTML = "°F";
      this.feelsLikeUnit.innerHTML = "°F";
      this.todayTemperature.childNodes[0].textContent =
        weatherData.temp.fahrenheit;
      console.log(weatherData.feelsLike);
      this.feelsLikeValue.innerHTML = weatherData.feelsLike.fahrenheit;
      this.renderHumidity(
        weatherData.humidity,
        weatherData.dewPoint,
        "fahrenheit"
      );
      this.threeDayForecastSlide.innerHTML = "";
      this.renderWeekForcast(weatherData.threeDayForecast, "f");
      this.resetCharts();
      this.renderHourlyTemperatureChart(
        weatherData.hourlyTempForecast,
        "fahrenheit"
      );
      this.renderHourlyRainChart(weatherData.hourlyRainForecast);
    }
  }

  async handleUnitSelection(targetElement) {
    if (!(targetElement.getAttribute("active") == "true")) {
      const weatherData = await Controller.getWeatherData(
        Controller.activeLocation.city
      );
      //  Animate slider upon unit selection
      this.animateUnitSelection(targetElement);
      // Handle unit change in the whole website
      this.updateTemperatureUnit(weatherData);
    }
  }

  async animateSunrise(remainingDayPercentage) {
    const fullLength = 340;
    const targetDasharray = Math.floor(fullLength * remainingDayPercentage);

    // Dasharray offset to remove

    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    // Step of incrementation based on dasharray value
    for (let i = 0; i <= fullLength - targetDasharray; i++) {
      this.sunIcon.setAttribute(
        "x",
        `${this.sunArc.getPointAtLength(i).x - 10}px`
      );

      this.sunIcon.setAttribute(
        "y",
        `${this.sunArc.getPointAtLength(i).y - 10}px`
      );

      this.sunArc.style.setProperty("--suncurve-offset", fullLength - i);
      await timer(1);
    }
  }

  renderWeekForcast(forecastData, tempUnit) {
    this.threeDayForecastSlide.innerHTML = "";
    const predictionCardTemplate = `<span class="prediction-day">Sun</span>
                  <img class="weather-prediction-icon" />
                  <div class="temp-prediction">
                    <span class="day-high"></span>
                    <span class="day-low"></span>`;

    forecastData.forecastday.forEach((dailyForecast, index) => {
      const predictionCard = document.createElement("div");
      predictionCard.className = "prediction-card";
      predictionCard.setAttribute("day", index);
      predictionCard.innerHTML = predictionCardTemplate;
      this.threeDayForecastSlide.append(predictionCard);
      document.querySelector(
        `div[day='${index}'] > .prediction-day`
      ).innerHTML = String(new Date(dailyForecast.date)).slice(0, 3);
      const iconCode = dailyForecast.day.condition.icon.split("/").pop();
      document.querySelector(
        `div[day='${index}'] > .weather-prediction-icon`
      ).src = this.dayWeatherIcon[`day${iconCode}`];

      if (tempUnit == "celsius") {
        document.querySelector(
          `div[day='${index}'] > .temp-prediction > .day-high`
        ).innerHTML = Math.round(dailyForecast.day.maxtemp_c) + " °";
        document.querySelector(
          `div[day='${index}'] > .temp-prediction > .day-low`
        ).innerHTML = Math.floor(dailyForecast.day.mintemp_c) + " °";
      } else {
        document.querySelector(
          `div[day='${index}'] > .temp-prediction > .day-high`
        ).innerHTML = Math.round(dailyForecast.day.maxtemp_f) + " °";
        document.querySelector(
          `div[day='${index}'] > .temp-prediction > .day-low`
        ).innerHTML = Math.floor(dailyForecast.day.mintemp_f) + " °";
      }
    });
  }

  renderHourlyTemperatureChart(data, unit) {
    this.currentTempChart = new Chart(this.tempChart, {
      type: "line",
      data: {
        labels: [
          "00:00",
          "01:00",
          "02:00",
          "03:00",
          "04:00",
          "05:00",
          "06:00",
          "07:00",
          "08:00",
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
          "21:00",
          "22:00",
          "23:00",
        ],
        datasets: [
          {
            lablel: "Temperatures",
            data: (function () {
              if (unit == "celsius") {
                console.log(data);
                return data.c;
              } else {
                return data.f;
              }
            })(),
            borderWidth: 2,
            borderColor: "rgba(94, 174, 253,0.3)",
            fill: true,
            backgroundColor: (context) => {
              if (!context.chart.chartArea) {
                return;
              }

              const {
                ctx,
                chartArea: { top, bottom },
              } = context.chart;
              const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
              gradientBg.addColorStop(0, "rgba(94, 174, 253,0.2)");
              gradientBg.addColorStop(0.5, "rgba(0, 188, 155,0.1)");
              gradientBg.addColorStop(1, "rgba(9, 18, 56, 0.1)");
              return gradientBg;
            },
            cubicInterpolationMode: "monotone",
          },
        ],
      },
      options: {
        animation: {
          duration: 1000,
        },
        responsive: true,
        plugins: {
          tooltip: {
            bodyAlign: "center",
            displayColors: false,
            callbacks: {
              label: function (context) {
                if (unit == "celsius") {
                  return `${context.parsed.y}°C`;
                } else {
                  return `${context.parsed.y}°F`;
                }
              },
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            display: false,

            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  renderHourlyRainChart(data) {
    this.currentRainChart = new Chart(this.rainChart, {
      type: "bar",
      data: {
        labels: [
          "00:00",
          "01:00",
          "02:00",
          "03:00",
          "04:00",
          "05:00",
          "06:00",
          "07:00",
          "08:00",
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
          "21:00",
          "22:00",
          "23:00",
        ],
        datasets: [
          {
            data: data,
            borderWidth: 0,
            borderRadius: 10,
            borderSkipped: false,

            backgroundColor: this.getBarChartBackgroundData,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            bodyAlign: "center",
            displayColors: false,
            callbacks: {
              title: function (context) {
                const title = context[0].label.split(":");
                return `${title[0]}:00`;
              },
              label: function (context) {
                return `${context.parsed.y}%`;
              },
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },

          y: {
            display: false,
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  resetCharts() {
    const displayRain = getComputedStyle(this.rainChart).display;
    const displayTemp = getComputedStyle(this.tempChart).display;
    this.currentRainChart.destroy();
    this.currentTempChart.destroy();
    this.rainChart.style.display = displayRain;
    this.tempChart.style.display = displayTemp;
  }

  getBarChartBackgroundData() {
    let bgData = Array(24).fill("rgba(120, 135, 188,0.1)");

    const targetIndex = Number(
      new Date().toLocaleTimeString("en-US", {
        hourCycle: "h23",
        hour: "2-digit",
      })
    );

    bgData[targetIndex] = "rgba(248,197,0,0.5)";

    return bgData;
  }
}
