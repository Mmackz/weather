import styles from "@/styles/Sunrise.module.css";
import Location from "public/images/icons/location";
import Sun from "public/images/icons/sunrise";
import Moon from "public/images/icons/sunset";

export function Sunrise(props) {
   const { location, time } = props;

   return (
      <div className={styles.container}>
         <h3 className={styles.title}>Sunrise & Sunset</h3>
         <div className={styles.dataContainer}>
            <div className={styles.location}>
               <Location />
               <p>{location.city}</p>
            </div>
            <div className={styles.data}>
               <div className={styles.dataItem}>
                  <Sun />
                  <div className={styles.timeContainer}>
                     <p>Sunrise</p>
                     <p className={styles.time}>{time.sunrise}</p>
                  </div>
               </div>
               <div className={styles.dataItem}>
                  <Moon />
                  <div className={styles.timeContainer}>
                     <p>Sunset</p>
                     <p className={styles.time}>{time.sunset}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
