import Image from "next/image";
import styles from "@/styles/Day.module.css";

function Day({ data, index }) {
   
   // used in Image src attribute to display dynamic icon based on time of day
   const hour = new Date().getHours();
   const timeOfDay = hour > 19 || hour < 7 ? "night" : "day";

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
