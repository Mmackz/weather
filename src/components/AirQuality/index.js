import { useState, useEffect } from "react";
import styles from "@/styles/AirQuality.module.css";
import Location from "public/images/icons/location";
import Wind from "@/../public/images/icons/wind";

export function AirQuality(props) {
   const [data, setData] = useState(props.data);
   const { location } = props;
   const { lat, lon } = location;

   const { color, quote, text } = getAQValues(data.index);

   const refreshData = async () => {
      const URL = getURL();
      const data = await fetch(`${URL}/api/get_weather?lat=${lat}&lon=${lon}`).then((res) =>
         res.json()
      );
      setData(data.airQuality);
   };

   return (
      <section className={styles.container}>
         <div className={styles.titlebar}>
            <h3 className={styles.title}>Air Quality Index</h3>
            <div className={styles.locationContainer}>
               <Location color={"#5c92fe"} size={21} />
               <p onClick={refreshData}>{location.city}</p>
            </div>
         </div>
         <div className={styles.readingContainer}>
            <div className={styles.reading}>
               <Wind color={color} size={48} />
               <div className={styles.textContainer}>
                  <p style={{ color }}>{text}</p>
                  <p>{quote}</p>
               </div>
            </div>
            <button className={styles.button} onClick={refreshData}>Refresh</button>
         </div>
         <div className={styles.components}>
            {Object.keys(data.components).map((key) => {
               return (
                  <div key={key} className={styles.component}>
                     <div className={styles.bg} style={{ background: color }}></div>
                     <p style={{ color }}>{data.components[key]}</p>
                     <p style={{ color }}>{addSubscript(key)}</p>
                  </div>
               );
            })}
         </div>
      </section>
   );
}

function addSubscript(key) {
   let letters = "";
   let numbers = "";
   for (let i = 0; i < key.length; i++) {
      if (isNaN(key[i])) {
         letters += key[i];
      } else {
         numbers += key[i];
      }
   }
   return (
      <>
         {letters}
         <sub>{numbers}</sub>
      </>
   );
}

function getAQValues(index) {
   switch (index) {
      case 1:
         return { text: "Excellent", color: "#87C1FF", quote: "Fresh air all around!" };
      case 2:
         return { text: "Good", color: "lime", quote: "A perfect day for a walk!" };
      case 3:
         return { text: "Moderate", color: "yellow", quote: "Air quality is average" };
      case 4:
         return { text: "Unhealthy", color: "orange", quote: "Air quality is poor" };
      case 5:
         return { text: "Dangerous", color: "red", quote: "Stay indoors" };
   }
}

function getURL() {
   return process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_URL
      : "http://localhost:3000";
}
