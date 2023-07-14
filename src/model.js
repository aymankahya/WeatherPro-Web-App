export default class WeatherData {
  constructor(weatherDataJSON) {
    this.localTime = new Date(
      weatherDataJSON.location.localtime
    ).toLocaleTimeString("en-US", {
      hourCycle: "h23",
      hour: "2-digit",
      minute: "numeric",
    });
    this.location =
      weatherDataJSON.location.name + ", " + weatherDataJSON.location.country;
    this.condition = weatherDataJSON.current.condition.text;
    this.warning = (function () {
      if (weatherDataJSON.alerts.alert.length == 0) {
        return "";
      } else {
        return weatherDataJSON.alerts.alert[0].event;
      }
    })();
    this.iconCode = weatherDataJSON.current.condition.icon.split("/").pop();
    this.feelsLike = {
      celsius: Math.round(weatherDataJSON.current.feelslike_c),
      fahrenheit: Math.round(weatherDataJSON.current.feelslike_f),
    };
    this.temp = {
      celsius: Math.round(weatherDataJSON.current.temp_c),
      fahrenheit: Math.round(weatherDataJSON.current.temp_f),
    };
    this.uv = weatherDataJSON.current.uv;
    this.windSpeed = weatherDataJSON.current.wind_kph;
    this.windDirection = weatherDataJSON.current.wind_dir;
    this.humidity = weatherDataJSON.current.humidity;
    this.dewPoint = {
      celsius: Math.round(
        weatherDataJSON.forecast.forecastday[0].hour[
          Number(this.localTime.slice(0, 2))
        ].dewpoint_c
      ),
      fahrenheit: Math.round(
        weatherDataJSON.forecast.forecastday[0].hour[
          Number(this.localTime.slice(0, 2))
        ].dewpoint_f
      ),
    };
    this.visibility = weatherDataJSON.current.vis_km;
    this.aqi = weatherDataJSON.current.air_quality["us-epa-index"];
    this.rain_chance =
      weatherDataJSON.forecast.forecastday[0].day.daily_chance_of_rain;
    this.sunset = weatherDataJSON.forecast.forecastday[0].astro.sunset;
    this.sunrise = weatherDataJSON.forecast.forecastday[0].astro.sunrise;
    this.threeDayForecast = weatherDataJSON.forecast;
    this.hourlyTempForecast = (function () {
      let returnDataC = [];
      let returnDataF = [];
      weatherDataJSON.forecast.forecastday[0].hour.forEach((data) => {
        returnDataC.push(Math.round(data.temp_c));
        returnDataF.push(Math.round(data.temp_f));
      });
      return {
        c: returnDataC,
        f: returnDataF,
      };
    })();

    this.hourlyRainForecast = (function () {
      let returnData = [];
      weatherDataJSON.forecast.forecastday[0].hour.forEach((data) => {
        returnData.push(Math.round(data.chance_of_rain));
      });
      return returnData;
    })();
  }
}
