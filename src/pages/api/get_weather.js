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
      weekday: new Date().getDay(),
      weekday_text: getWeekday(new Date().getDay())
   };

   console.log(weatherData.list)

   const days = [currentDay, ...weatherData.list
      .filter((item) => item.dt_txt.includes("18:00:00"))
      .map((item) => ({
         condition: item.weather[0].main,
         temp: {
            metric: Math.round(item.main.temp - 273.15),
            imperial: Math.round((item.main.temp - 273.15) * 1.8 + 32)
         },
         weekday: new Date(item.dt * 1000).getDay(),
         weekday_text: getWeekday(new Date(item.dt * 1000).getDay())
      }))];

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
