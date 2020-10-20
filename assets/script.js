// variable to store the searched city
var city = "";

// variables
var searchCity = $("#search-city");
var searchBtn = $("#search-button");
var clearBtn = $("#clear-history");
var currentCity = $("#current-city");
var currentTemp = $("#temperature");
var currentHumidty = $("#humidity");
var currentWindSpeed = $("#wind-speed");
var currentUVIndex = $("#uv-index");
var sCity = [];

// searches city to see if it exists in the entries from the storage
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

// displays the curent and future weather to the user after grabing the city from the input text box
function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

// AJAX
function currentWeather(city) {
    // variable for server side API
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        // parse response to display the current weather including city name, date and weather icon
        console.log(response);
        // data object from server side API for icon property
        var weathericon = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
        var date = new Date(response.dt * 1000).toLocaleDateString();
        // parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");
        // parse the response to display the current temp
        // Convert the temp to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemp).html((tempF).toFixed(2) + "&#8457");
        // display the humidity
        $(currentHumidty).html(response.main.humidity + "%");
        // display wind speed and convert to MPH
        var ws = response.wind.speed;
        var windsmph = (ws * 2.237).toFixed(1);
        $(currentWindSpeed).html(windsmph + "MPH");
        // display uv index - uv query url is built inside the function using geographical coordinates
        UVIndex(response.coord.lon, response.coord.lat);
        forecast(response.id);
        if (response.cod == 200) {
            sCity = JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity == null) {
                sCity = [];
                sCity.push(city.toUpperCase()
                );
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

// function returns the UVIindex response.
function UVIndex(ln, lt) {
    // url for uv index
    var uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lt + "&lon=" + ln;
    $.ajax({
        url: uvqURL,
        method: "GET"
    }).then(function (response) {
        $(currentUVIndex).html(response.value);
    });
}

// displays UV Index warnings
function uvWarnings() {
    if (currentUVIndex < 3) {
        $("#uv-index").removeClass("moderate");
        $("#uv-index").removeClass("high");
        $("#uv-index").addClass("low");
    } else if (currentUVIndex < 6) {
        $("#uv-index").removeClass("low");
        $("#uv-index").removeClass("high");
        $("#uv-index").addClass("moderate");
    } else {
        $("#uv-index").removeClass("moderate");
        $("#uv-index").removeClass("low");
        $("#uv-index").addClass("high");
    }
}
// displays the 5 days forecast for the current city
function forecast(cityid) {
    var queryforecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIKey;
    $.ajax({
        url: queryforecastURL,
        method: "GET"
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

// dynamically adds the passed city on the search history
function addToList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}

// display the past search again when the list group item is clicked in search history
function pastSearch(event) {
    var liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        currentWeather(city);
    }

}

// render function
function loadlastCity() {
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if (sCity !== null) {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < sCity.length; i++) {
            addToList(sCity[i]);
        }
        city = sCity[i - 1];
        currentWeather(city);
    }

}

// clear the search history from page
function clearHistory(event) {
    event.preventDefault();
    sCity = [];
    localStorage.removeItem("cityname");
    document.location.reload();

}

// click handlers
$("#search-button").on("click", displayWeather);
$(document).on("click", pastSearch);
$(window).on("load", loadlastCity);
$("#clear-history").on("click", clearHistory);
