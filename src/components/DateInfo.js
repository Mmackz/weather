import Image from "next/image";
import { useDate } from "@/hooks";
import styles from "@/styles/DateInfo.module.css";
import Sun from "@/../public/images/sun";

export function DateInfo() {
   const date = useDate();
   return (
      <div className={styles.container}>
         <h1 className={styles.time}>{date.time}</h1>
         <p className={styles.date}>{date.date}</p>
         <div className={styles.greeting}>
            <Sun style="light" />
            <p className={styles["greeting-text"]}>{date.greeting}</p>
         </div>
      </div>
   );
}
