import Image from "next/image";
import styles from "@/styles/Current.module.css";
import Location from "@/../public/images/icons/location"
import Wind from "@/../public/images/icons/wind";
import Humidity from "@/../public/images/icons/humidity";
import { useDate } from "@/hooks";
import { getTimeOfDay } from "@/helpers/getTimeOfDay";

export function Current(props) {
   const { data, location, tz } = props;
   const timeOfDay = getTimeOfDay(tz);
   const { now } = useDate();

   console.log(data);

   return (
      <div className={styles.container}>
         <div className={styles.sun}></div>
         <span className={styles.dot}></span>
         <span className={styles.dot}></span>
         <div className={styles.location}>
            <Location color={"#fff"} size={32} />
            <p>{location.city}</p>
         </div>
         <div>
            <Image
               src={`/images/${timeOfDay}/${data.condition}` + ".svg"}
               alt="Weather Icon"
               height={200}
               width={200}
            />
         </div>
         <div className={styles.info}>
            <p>Today, {now}</p>
            <p className={styles.temp}>{data.temp.metric}°</p>
            <p className={styles.conditionText}>{data.condition}</p>
         </div>
         <div className={styles.conditions}>
            <div className={styles.condition}>
               <Wind color={"#ffffff"}size={24} />
               <p>Wind</p>
               <div className={styles.divider}></div>
               <p>{data.wind.metric} km/h</p>
            </div>
            <div className={styles.condition}>
               <Humidity color={"#ffffff"}size={24} />
               <p>Hum</p>
               <div className={styles.divider}></div>
               <p>{data.humidity} %</p>
            </div>
         </div>
      </div>
   );
}
