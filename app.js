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
      fetch(url)
      .then(response => response.json())
      .then(data => data.results[0].geometry.location)
    );
  }

  function getCurrentWeather(coords) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;
    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data.currently)
    );
  }
  var app = document.querySelector('#app');
  var cityForm = app.querySelector('.city-form');
  var cityInput = cityForm.querySelector('.city-input');
  var cityWeather = app.querySelector('.city-weather');

  var cloud;
  var sky;

  cityForm.addEventListener('submit', function(event) {
    cityWeather.innerText = 'Loading...';    
    event.preventDefault();
    
    var city = cityInput.value;

    getCoordinatesForCity(city)
    .then(getCurrentWeather)
    .then(function(weather) {
      sky = weather.icon.replace('-', '_').toUpperCase();
      icons.set(weather.icon, Skycons[sky]);
        cityWeather.innerText = 
        'Current temperature: ' + Math.round(weather.temperature) + 
        '\nFeels like: ' + Math.round(weather.apparentTemperature) + 
        '\nSummary: ' + weather.summary + 
        '\nChance of rain: ' + (weather.precipProbability * 100) + '%';      
    });
  });
  icons.play();
})();




