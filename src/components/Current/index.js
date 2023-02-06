import styles from "@/styles/Current.module.css";

export function Current({ data }) {
   return (
      <div className={styles.container}>
         <div className={styles.sun}></div>
         <span className={styles.dot}></span>
         <span className={styles.dot}></span>

      </div>
   )
}