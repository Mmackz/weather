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

export async function getServerSideProps({ req }) {
   /* Trying to get initial location */
   const forwarded = req.headers["x-forwarded-for"]
   const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
   getLocation(ip);
   

   const URL = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_URL : "http://localhost:3000";
   const response = await fetch(`${URL}/api/get_weather`);
   const data = await response.json();
   return {
      props: {
         weatherData: data
      }
   };
}

async function getLocation(ip) {
   const data = await fetch(`https://iapi.co/${ip}/json`).then((res) => res.json());
   console.log(data);
}
