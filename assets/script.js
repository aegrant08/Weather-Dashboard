// variable to store city user searched for
var city = "";

// variables
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity = $("#humidity");
var currentWindSpeed = $("#wind-speed");
var currentUVIndex = $("#uv-index");
var sCity = [];

// searches local storage for previously searched cities
function find(c) {
    for (var i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}

// API key
var APIKey = config.My_Key;
// display the current and future weather to user after grabing the city from the input text box
funciton displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

// AJAX
function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        // parse response to display current weather inculding city name, date, and weather icon
        // data object from server side API for icon property
        var weatherIcon = response.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
        // setting date
        var date = new Date(response.dt * 1000).toLocaleDateString();
        // parse response for name of city and concatinate date and icon
        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconURL + ">");
        // parse response to display the current temperature
        // convert temperature to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html(response.main.humidity + "%");
        // display wind speed and convert to mph
        var ws = response.wind.speed;
        var windsmph = (ws * 2.237).toFixed(1);
        $(currentWindSpeed).html(windsmph + "MPH");
        // display UV index
        // by geographical coordinates method and using appid and coordinates as a parameter, uv query inside the function
        currentUVIndex(response.coord.lon, response.coord.lat);
        forecast(response.id);
        if (response.cod == 200) {
            sCity = JSON.parse(localStorage.getItem("cityname"));
            if (sCity == null) {
                sCity = [];
                sCity.push(city.toUpperCase());
                localStorage.setItem("cityname", JSON.stringify(sCity));
                addToList(city);
            } else {
                if (find(city) > 0) {
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }
    });
}

function UVIndex(ln, lt) {
    var uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lt + "&lon=" + ln;
    $.ajax({
        url: uvqURL,
        method: "GET",
    }).then(function (response) {
        $(currentUVIndex).html(response.value);
    });
}

// display the five day forcast for the current city
function forecast(cityid) {
    var dayover = false;
    var queryforecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIKey;
    $.ajax({
        url: queryforecastURL,
        method: "GET",
    }).then(function (response) {
        for (i = 0; i < 5; i++) {
            var date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
            var tempK = response.list[((i + 1) * 8) - 1].main.temp;
            var tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
            var humidity = response.list[((i + 1) * 8) - 1].main.humidity;

            $("#fDate" + i).html(date);
            $("#fImg" + i).html("<img src=" + iconurl + ">");
            $("#fTemp" + i).html(tempF + "&#8457");
            $("#fHumidity" + i).html(humidity + "%");
        }
    });
}

// dynamically add the passed city to the search history