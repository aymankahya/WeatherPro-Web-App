# WeatherPro Web Application

## Overview

WeatherPro is a comprehensive weather web application developed as part of the JavaScript learning journey in The Odin Project. This application provides users with location based weather forecasts, and detailed weather information for locations worldwide. It features a user-friendly interface that allows users to search for weather data by city or region, view current weather conditions, and access detailed forecasts.

## Features

- **Latest Weather Information**: Get the latest weather information for any city or region.
- **Detailed Forecasts**: Access hourly and 3-day weather forecasts.
- **Weather Highlights**: View key weather metrics such as UV index, wind status, humidity, visibility, and air quality.
- **Interactive Charts**: Visualize hourly temperature and rain probability with interactive charts.
- **Location-Based Services**: Automatically retrieve weather data based on the user's current location.
- **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit units.
- **Responsive Design**: Optimized for various screen sizes and devices.

## Tech Stack

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
- **Libraries and Frameworks**:
  - Chart.js: For creating interactive weather charts
  - Date-fns: For date manipulation and formatting
- **Build Tools and Development**:
  - Webpack: Module bundler
  - Babel: JavaScript compiler
  - npm: Package manager
- **APIs**:
  - Weather API (not specified in the code, but used for fetching weather data)
  - Google Maps API (for reverse geocoding)

## Project Structure

- `/src`: Contains the source code for the application
  - `index.html`: Main HTML file
  - `app.js`: Entry point of the application
  - `controller.js`: Contains the Controller class for managing application logic
  - `model.js`: Defines the WeatherData class for handling weather data
  - `service.js`: Contains functions for API calls and data processing
  - `view.js`: Defines the UserInterface class for rendering and user interactions
  - `/style`: CSS files for styling the application
  - `/icons`: Weather icons for different conditions

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/aymankahya/weatherpro-web-app.git
```
2. Navigate to the project directory :
```bash
cd weatherpro-web-app
```
3. Install dependencies :
```bash
npm install
```
4. Create a `.env` file in the root directory and add your API keys :
```bash
WEATHER_API_KEY= your_weather_api_key
GOOGLE_API_KEY= your_google_api_key
```
5. Start de development server :
```bash
npm start
````

## Learning Outcomes
- Working with APIs and asynchronous JavaScript
- Implementing Object-Oriented Programming principles
- Using modern JavaScript features and ES6+ syntax
- Building responsive user interfaces
- Working with third party libraries (Chart.js/date-fns)
- Implementing modular code structure
- Using build tools like Webpack for modern web development
