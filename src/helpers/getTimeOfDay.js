export function getTimeOfDay(tz) {
   const now = new Date().getTime() + tz * 1000;
   const hour = new Date(now).getUTCHours();
   const timeOfDay = hour > 18 || hour < 7 ? "night" : "day";
   return timeOfDay;
}