const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const request = require('request');

const router = express.Router();

const forecast = require('./src/main');

const WEATHER_API = {
    url: 'http://api.openweathermap.org/data/2.5/forecast?q=',
    ending: '&APPID=5aa54741590ecf3bdd72cfb0b762cf43&units=metric',
};

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

router.get('/', (req, res) => {
    res.render('index', { weather: null, error: null });
});

router.post('/', (req, res) => {
    const { city } = req.body;
    if (city) {
        const url = WEATHER_API.url + city + WEATHER_API.ending;

        request(url, (err, response, body) => {
            if (err) {
                return res.render('index', { weather: null, error: 'City not found' });
            }
            const weather = JSON.parse(body);
            if (weather.cod === 404) {
                return res.render('index', { weather: null, error: 'City not found ' });
            }
            const report = forecast(weather);
            return res.render('index', { weather: report, error: null });
        });
    }
});

app.use('/', router);
app.listen(process.env.port || 3000);
