// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
   const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=vancouver&appid=${process.env.WEATHER_API_KEY}`;
   const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=vancouver&appid=${process.env.WEATHER_API_KEY}`;

   const [res1, res2] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);

   if (res1.ok && res2.ok) {
      const weatherData = await res1.json();
      const forecastData = await res2.json();
      const lat = weatherData.coord.lat;
      const lon = weatherData.coord.lon;
      const airQualityData = await getAirQualityData({ lat, lon });
      const json = buildObject([
         { ...weatherData, ...forecastData },
         airQualityData.list[0]
      ]);
      res.status(200).json(json);
   } else {
      res.status(res.statusCode);
   }
}

function buildObject(data) {
   const [weatherData, airQualityData] = data;

   const airQuality = {
      index: airQualityData.main.aqi,
      components: airQualityData.components
   };

   const currentWeather = {
      condition: weatherData.weather[0].main,
      humidity: weatherData.main.humidity,
      sunrise: weatherData.sys.sunrise,
      sunset: weatherData.sys.sunset,
      temp: {
         metric: Math.round(weatherData.main.temp - 273.15),
         imperial: Math.round((weatherData.main.temp - 273.15) * 1.8 + 32)
      },
      wind: {
         metric: Math.round(weatherData.wind.speed * 3.6),
         imperial: Math.round(weatherData.wind.speed * 2.23694)
      }
   };

   const currentDay = {
      condition: currentWeather.condition,
      temp: currentWeather.temp,
      weekday: 7,
      weekday_text: "Now"
   };

   const tz = weatherData.timezone;

   const days = [
      currentDay,
      ...weatherData.list
         .filter((item) => getLocalAfternoon(item.dt, tz))
         .map((item) => ({
            condition: item.weather[0].main,
            temp: {
               metric: Math.round(item.main.temp - 273.15),
               imperial: Math.round((item.main.temp - 273.15) * 1.8 + 32)
            },
            weekday: new Date((item.dt + tz) * 1000).getUTCDay(),
            weekday_text: getWeekday(new Date((item.dt + tz) * 1000).getUTCDay())
         }))
   ];

   return {
      airQuality,
      coord: weatherData.coord,
      current: currentWeather,
      forecast: days
   };
}

async function getAirQualityData(coords) {
   const airQualityResult = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${coords.lat}&lon=${coords.lon}&appid=${process.env.WEATHER_API_KEY}`
   );
   const airQualityData = await airQualityResult.json();
   return airQualityData;
}

function getLocalAfternoon(dt, tz) {
   // returns true if timestamp is between 1-3 pm local time.
   const hours = new Date((dt + tz) * 1000).getUTCHours();
   return hours >= 13 && hours < 16;
}

function getWeekday(i) {
   switch (i) {
      case 0:
         return "Sun";
      case 1:
         return "Mon";
      case 2:
         return "Tue";
      case 3:
         return "Wed";
      case 4:
         return "Thu";
      case 5:
         return "Fri";
      case 6:
         return "Sat";
   }
}
