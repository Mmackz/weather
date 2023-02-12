import { useEffect, useState } from "react";

export const useDate = () => {
   const locale = "en";
   const [today, setDate] = useState(); 

   useEffect(() => {
      setDate(new Date());
      const timer = setInterval(() => {
         setDate(new Date());
      }, 60 * 1000);
      return () => {
         clearInterval(timer);
      };
   }, []);

   const day = today?.toLocaleDateString(locale, { weekday: "long" });
   const now = `${today?.getDate()} ${today?.toLocaleDateString(locale, {
      month: "long"
   })}`
   const date = `${day}, ${now}, ${today?.getFullYear()}\n\n`;

   const hour = today?.getHours();
   const greeting = `Good ${
      (hour < 12 && "morning") || (hour < 17 && "afternoon") || "evening"
   }!`;

   const time = today?.toLocaleTimeString(locale, {
      hour: "numeric",
      hour12: true,
      minute: "numeric"
   });

   return {
      date,
      now,
      time,
      greeting
   };
};
