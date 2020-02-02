const forecastModule = function(result) {
    const ICON = 'http://openweathermap.org/img/wn/__img__@2x.png';

    function getForecast(result) {
        const name = result.city.name;
        return `<div class='col-12 city_name mb-2'>${name}</div>`+ createResponse(getWeatherInfo(result));
    }

    /* returns forecast consists of current weather results
    and 5 days-forecast  for 9.00am
    */
    function getWeatherInfo(forecast) {
        const current = new Date(forecast.list[0].dt_txt);
        let info = [forecast.list[0]];
        for(let i = 1; i < forecast.list.length; i++) {
            if(selectWeather(forecast.list[i].dt_txt, current)) {
                info.push(forecast.list[i]);
            }
        }
        return info;
    }

    const createResponse = info => {
        let res = '';
        info.forEach(item => {
            res += responseBlock(item);
        });
        return res;
    }

    // forecast text
    const responseBlock = item => {
        const date = item.dt_txt.split(' '); // y-m-d and time
        const normalDate = date[0].split('-').reverse().join('.');
        const icon = ICON.replace('__img__', item.weather[0].icon);
        const weather = `<div class='col mr-2 mb-2 result'>
        <p>${normalDate}</p>
        <img src=${icon} alt='img'>
        temperature: ${parseInt(item.main.temp)}C <br>
        pressure: ${item.main.pressure}hPa <br>
        humidity: ${item.main.humidity}% <br>
        wind: ${item.wind.speed}m/s</div>`;
        return weather;
    }

    // returns true for 9.00am forecast
    function selectWeather(item, currentDate) {
        const date = new Date(item);
        if(date.getMonth() === currentDate.getMonth()) {
            return currentDate.getDate() < date.getDate() && date.getHours() === 9;
        } else { // next month
            return date.getHours() === 9;
        }
    }
    return getForecast(result);
}
module.exports = forecastModule;
