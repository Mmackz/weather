import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { Ubuntu } from "@next/font/google";
import { DateInfo, Forecast } from "@/components";

const font = Ubuntu({
   subsets: ["latin"],
   weight: ["300", "400", "500", "700"]
});

export default function Home({ weatherData }) {
   return (
      <>
         <Head>
            <title>TOP: Weather App</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <main className={font.className}>
            <DateInfo />
            <Forecast forecast={weatherData.forecast} />
         </main>
      </>
   );
}

export async function getServerSideProps(context) {
   const response = await fetch("http://localhost:3000/api/get_weather");
   const data = await response.json();
   return {
      props: {
         weatherData: data
      }
   };
}
