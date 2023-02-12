import styles from "@/styles/Forecast.module.css";
import Day from "./Day";

export function Forecast({ forecast, tz }) {
   return (
      <div className={styles.container}>
         {forecast.map((item, i) => (
            <Day key={item.weekday} data={item} tz={tz} index={i} />
         ))}
      </div>
   );
}
