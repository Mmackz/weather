import styles from "@/styles/Forecast.module.css";
import Day from "./Day";

export function Forecast({ forecast }) {
   return (
      <div className={styles.container}>
         {forecast.map((item) => (
            <Day key={item.weekday} data={item} />
         ))}
      </div>
   );
}
