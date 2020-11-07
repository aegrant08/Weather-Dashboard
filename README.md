# Weather-Dashboard

#Technologies Used

This is an application built using Bootstrap for responsive layout and JavaScript, jQuery, and AJAX for page to display information dynamically and to call information from OpenWeather for user's input information. An API key from OpenWeather was used to call the appropriate information based on user's input. Application displays current weather and five day forecast for city searched.

#Functionality
When the user inputs a city in the search box, the current weather is displayed in the container to the right, showing the current date, temperature, humidity, wind speed, and UV index. UV Index is color coded to show low, moderate, or high depending on the UV Index in the city.

Below the current weather container, a five day forecast is displayed with the temperature and humidity.

After the city has been searched, the city and its weather information is stored in local storage, so when the user navigates back to the Weather Dashboard, the names of the cities they recently searched are displayed in the sidebar, with the most recent city searched displaying in the current weather container and five day forecast shown. The user can clear their search history and local storage by clicking on the "clear history" button.

#Deployed Link

https://aegrant08.github.io/Weather-Dashboard/
