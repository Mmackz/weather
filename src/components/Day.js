import Image from "next/image";
import styles from "@/styles/Day.module.css";

function Day({ data }) {
   return (
      <div className={styles.container}>
         <Image src={`/images/${data.condition}.png`} alt="Weather Icon" height={60} width={60}/>
         <p>{data.weekday_text}</p>
         <p>{data.temp.metric}°</p>
      </div>
   )
}

export default Day;