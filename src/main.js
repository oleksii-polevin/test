const WEATHER_API = {
    'url': 'http://api.openweathermap.org/data/2.5/forecast?',
    'ending': '&APPID=5aa54741590ecf3bdd72cfb0b762cf43&units=metric',
    'icon': 'http://openweathermap.org/img/wn/__img__@2x.png',
}

const form = document.getElementById('weather_form');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    getForecast();
});

function getForecast() {
    const city = $('#weather_form').serialize();
    clearPreviousResult();
    $.ajax({
        type: 'GET',
        url: WEATHER_API.url + city + WEATHER_API.ending,
        success: function(result) {
            $('.city_name').text(result.city.name);
            createResponse(getWeatherInfo(result));
        },
        error: function() {
            $('.error').html('city not found');
        }
    });
}

/* returns forecast consists of current weather results
 and 5 days-forecast  for 9.00am
 */
function getWeatherInfo(forecast) {
    const current = new Date();
    let info = [forecast.list[0]];
    for(let i = 1; i < forecast.list.length; i++) {
        if(selectWeather(forecast.list[i].dt_txt, current)) {
            info.push(forecast.list[i]);
        }
    }
    return info;
}

// show weather results
const createResponse = info => {
    const reportContainer = $('.weather_report');
    info.forEach(item => {
        const date = item.dt_txt.split(' '); // y-m-d and time
        const normalDate = date[0].split('-').reverse().join('.');
        const dateBlock = createDiv().text(normalDate);
        const img = $('<img />', {
            src: WEATHER_API.icon.replace('__img__', item.weather[0].icon)
        });
        const reportBlock = createDiv().append(dateBlock, img, textBlock(item));
        reportContainer.append(reportBlock);
    });
}

const createDiv = () => {
    return $('<div></div>').addClass('col mr-2 mb-2 result');
};

// forecast text
const textBlock = item => {
    const weather = `temperature: ${parseInt(item.main.temp)}C <br>
    pressure: ${item.main.pressure}hPa <br>
    humidity: ${item.main.humidity}% <br>
    wind: ${item.wind.speed}m/s`;
    return createDiv().html(weather);
}

// returns true for 9.00am forecast
function selectWeather(item, currentDate) {
    const date = new Date(item);
    return currentDate.getDate() < date.getDate() && date.getHours() === 9;
}

const clearPreviousResult = () => {
    $('.weather_report').html('');
    $('.error').html('');
    $('.city_name').html('');
    $('.input_item').val('');
}
