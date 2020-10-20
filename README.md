# Weather-Dashboard

This is an application built using Bootstrap for responsive layout and JavaScript, jQuery, and AJAX for page to display information dynamically and to call information from OpenWeather for user's input information. An API key from OpenWeather was used to call the appropriate information based on user's input. Application displays current weather and five day forecast for city searched.

*A note on the API key*
The API key has been hidden for security purposes. To fully deploy the sight and test functionality, please follow these instructions:

In the terminal, create a config.js file and open it:

touch config.js
code config.js

In the config file, enter your API key in an object like so (naming them however you like, and putting the keys in strings):

var config = {
    My_Key: "1234890"
}

In the HTML file, add a script link to the newly created config.js file BELOW your jQuery script but ABOVE your own script file links:

<script type="text/javascript" src="config.js"></script>
<script src="script.js"></script>

In your JavaScript/jQuery file (script.js), declare variables tht point your API keys in the config file:

var API = config.My_Key

Be sure to replace every instance of the API key with the new variable


