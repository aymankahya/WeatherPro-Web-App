import {
  getPositionInfo,
  getWeatherData,
  importWeatherIcons,
  stringToDate,
  getDuration,
} from "./service";
import WeatherData from "./model";
import { format } from "date-fns";

export default class Controller {
  constructor() {}

  static activeLocation = "";

  static async getUserLocation() {
    this.activeLocation = await getPositionInfo();
    return this.activeLocation;
  }

  static async getWeatherData(input) {
    return new WeatherData(await getWeatherData(input));
  }

  static getTodayDate() {
    return {
      time: format(new Date(), "hh:mm b"),
      date: format(new Date(), "iiii, ii LLLL yyyy"),
    };
  }

  static importWeatherIcons() {
    const dayWeatherIcon = importWeatherIcons(
      require.context("../src/icons/weather/64x64/day", false, /\.png$/),
      "day"
    );

    const nightWeatherIcon = importWeatherIcons(
      require.context("../src/icons/weather/64x64/night", false, /\.png$/),
      "night"
    );

    return [dayWeatherIcon, nightWeatherIcon];
  }

  static getSunCurveLength(sunriseTime, sunsetTime, localTime) {
    // Calculate day duration until sunset
    const dayDuration = Controller.getDurationMinutes(sunriseTime, sunsetTime);
    const remainingDayDuration = Controller.getDurationMinutes(
      localTime,
      sunsetTime
    );

    // Calculate current sun position percentage relative to remaining time
    if (remainingDayDuration > 0 && remainingDayDuration < dayDuration) {
      return remainingDayDuration / dayDuration;
    } else if (remainingDayDuration > dayDuration) {
      return 1;
    } else {
      return 0;
    }
  }

  static getDurationMinutes(startTime, endTime) {
    return getDuration(stringToDate(startTime), stringToDate(endTime));
  }
}
