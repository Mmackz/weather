// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
   const { lat, lon } = req.query;
   const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`;
   const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`;

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
   const tz = weatherData.timezone;

   const airQuality = {
      index: airQualityData.main.aqi,
      components: filterComponents(airQualityData.components)
   };

   const currentWeather = {
      condition: weatherData.weather[0].main,
      humidity: weatherData.main.humidity,
      time: {
         sunrise: convertTimestampToAM_PM(weatherData.sys.sunrise, tz),
         sunset: convertTimestampToAM_PM(weatherData.sys.sunset, tz),
         timezone: tz
      },
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
      coord: {
         ...weatherData.coord,
         city: weatherData.name,
         country: weatherData.sys.country
      },
      current: currentWeather,
      forecast: days
   };
}

function convertTimestampToAM_PM(dt, tz) {
   const localTimestamp = (dt + tz) * 1000;
   const date = new Date(localTimestamp);
   return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC"
   });
}

function filterComponents(components) {
   const obj = {};
   Object.keys(components).forEach((key) => {
      if (key === "co") {
         obj[key] = +(components[key] / 1000).toFixed(1);
      } else if (key === "pm2_5") {
         obj.pm2 = +(components[key] / 10).toFixed(1);
      } else if (key !== "no" && key !== "nh3") {
         obj[key] = +(components[key] / 10).toFixed(1);
      }
   });
   return obj;
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
