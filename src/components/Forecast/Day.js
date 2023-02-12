import Image from "next/image";
import styles from "@/styles/Day.module.css";
import { getTimeOfDay } from "@/helpers/getTimeOfDay";

function Day({ data, index, tz }) {

   const timeOfDay = getTimeOfDay(tz);

   return (
      <div className={styles.container}>
         <Image
            src={`/images/${index ? "day" : timeOfDay}/${data.condition}` + ".svg"}
            alt="Weather Icon"
            height={95}
            width={95}
         />
         <p>{data.weekday_text}</p>
         <p>{data.temp.metric}°</p>
      </div>
   );
}

export default Day;
