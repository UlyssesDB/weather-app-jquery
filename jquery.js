(function() {
  var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  var DARKSKY_API_KEY = 'baa65f32ef962af56f5ca63c60bd8d1d';
  var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  var GOOGLE_MAPS_API_KEY = 'AIzaSyAFvMwd8d-YI-3x-wS64O6XzHL62fqysI4';
  var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
  
  var icons = new Skycons({"color": "black"});

  function getCoordinatesForCity(cityName) {
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      $.getJSON(url)
      .then(data => data.results[0].geometry.location)
    );
  }

  function getCurrentWeather(coords) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

    return (
      $.getJSON(url)
      .then(data => data.currently)
    );
  }

  var app = $('#app')
  var cityForm = app.find('.city-form');
  var cityInput = cityForm.find('.city-input');
  var getWeatherButton = cityForm.find('.get-weather-button');
  var cityWeather = app.find('.city-weather');

  var cloud;
  var sky;

  cityForm.on('submit', function(event) {
    cityWeather.innerText = 'Loading...';   
    event.preventDefault();

    var city = cityInput.val();

    getCoordinatesForCity(city)
    .then(getCurrentWeather)
    .then(function(weather) {
      sky = weather.icon.replace('-', '_').toUpperCase();
      icons.set(weather.icon, Skycons[sky]);
      cityWeather.text('Current temperature: ' + Math.round(weather.temperature) + 
      '\nFeels like: ' + Math.round(weather.apparentTemperature) + 
      '\nSummary: ' + weather.summary + 
      '\nChance of rain: ' + (weather.precipProbability * 100) + '%');
/*      
      sky = weather.icon.replace('-', '_').toUpperCase();
      icons.set(weather.icon, Skycons[sky]);
        cityWeather.innerText = 
        'Current temperature: ' + Math.round(weather.temperature) + 
        '\nFeels like: ' + Math.round(weather.apparentTemperature) + 
        '\nSummary: ' + weather.summary + 
        '\nChance of rain: ' + (weather.precipProbability * 100) + '%';      
        */
    });
  });
  icons.play();
})();