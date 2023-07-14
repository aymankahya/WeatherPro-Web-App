export async function getPositionInfo() {
  const promiseUserPosition = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  const userPosition = await promiseUserPosition;

  return reverseGeolocate(
    userPosition.coords.latitude,
    userPosition.coords.longitude
  );
}

export async function reverseGeolocate(latitudePos, longitudePos) {
  const googleAPIresponse = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitudePos},${longitudePos}&key=${process.env.GOOGLE_API_KEY}`
  );

  const JSONresponse = await googleAPIresponse.json();

  return {
    city: JSONresponse.plus_code.compound_code.split(" ")[1].replace(",", ""),
    country: JSONresponse.plus_code.compound_code.split(" ")[2],
  };
}

export async function getWeatherData(regionInput) {
  const forecastAPIresponse = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${regionInput}&days=14&alerts=yes&aqi=yes`
  );

  const weatherDataJSON = await forecastAPIresponse.json();
  console.log(weatherDataJSON);
  return weatherDataJSON;
}

export function importWeatherIcons(importedIcon, type) {
  let weatherIcons = {};
  importedIcon.keys().map((item) => {
    if (type == "day") {
      weatherIcons[item.replace("./", "day")] = importedIcon(item);
    } else {
      weatherIcons[item.replace("./", "night")] = importedIcon(item);
    }
  });
  return weatherIcons;
}

export function stringToDate(inputTime) {
  if (inputTime.slice(-2) == "PM") {
    return {
      hour: Number(inputTime.slice(0, 2)) + 12,
      minute: Number(inputTime.slice(3, 5)),
    };
  } else {
    return {
      hour: Number(inputTime.slice(0, 2)),
      minute: Number(inputTime.slice(3, 5)),
    };
  }
}

export function getDuration(startTime, endTime) {
  return (
    (endTime.hour - startTime.hour) * 60 + (endTime.minute - startTime.minute)
  );
}
