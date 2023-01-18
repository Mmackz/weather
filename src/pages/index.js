import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { Ubuntu } from "@next/font/google";
import { ContextProvider } from "@/context";
import { DateInfo } from "@/components";

const font = Ubuntu({
   subsets: ["latin"],
   weight: ["300", "400", "500", "700"]
});

export default function Home() {
   return (
      <>
         <Head>
            <title>TOP: Weather App</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <ContextProvider>
            <main className={font.className}>
               <DateInfo />
            </main>
         </ContextProvider>
      </>
   );
}
