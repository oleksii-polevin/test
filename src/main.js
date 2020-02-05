const forecastModule = (result) => {
    const ICON = 'http://openweathermap.org/img/wn/__img__@2x.png';
    const FORECAST_TIME = 9;

    // returns true for 9.00am forecast
    const selectWeather = (item, currentDate) => {
        const date = new Date(item);
        if (date.getMonth() === currentDate.getMonth()) {
            return currentDate.getDate() < date.getDate() && date.getHours() === FORECAST_TIME;
        }
        return date.getHours() === FORECAST_TIME;
    };

    /* returns forecast consists of current weather results
    and 5 days-forecast  for 9.00am
    */
    const getWeatherInfo = (forecast) => {
        const current = new Date(forecast.list[0].dt_txt);
        const info = [forecast.list[0]];
        for (let i = 1; i < forecast.list.length; i += 1) {
            if (selectWeather(forecast.list[i].dt_txt, current)) {
                info.push(forecast.list[i]);
            }
        }
        return info;
    };

    // forecast text
    const responseBlock = (item) => {
        const date = item.dt_txt.split(' '); // y-m-d and time
        const normalDate = date[0].split('-').reverse().join('.');
        const icon = ICON.replace('__img__', item.weather[0].icon);
        const weather = `<div class='col mr-2 mb-2 result'>
        <p>${normalDate}</p>
        <img src=${icon} alt='img'>
        temperature: ${parseInt(item.main.temp, 10)}C&deg<br>
        pressure: ${item.main.pressure}hPa <br>
        humidity: ${item.main.humidity}% <br>
        wind: ${item.wind.speed}m/s</div>`;
        return weather;
    };

    const createResponse = (info) => {
        let res = '';
        info.forEach((item) => {
            res += responseBlock(item);
        });
        return res;
    };

    const getForecast = (res) => {
        const { name } = res.city;
        const forecastInfo = getWeatherInfo(res);
        const report = createResponse(forecastInfo);
        return `<div class='col-12 city_name mb-2'>${name}</div>${report}`;
    };
    return getForecast(result);
};

module.exports = forecastModule;
