import styles from "@/styles/Forecast.module.css";
import Day from "./Day";

export function Forecast({ forecast }) {
   return (
      <div className={styles.container}>
         {forecast.map((item, i) => (
            <Day key={item.weekday} data={item} index={i} />
         ))}
      </div>
   );
}
