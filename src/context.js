import { createContext, useState } from "react";

const { Provider, Consumer } = createContext();

function ContextProvider(props) {

   const [data, setData] = useState(1);

   const print = () => alert(data);
   const increment = () => setData((state) => state + 1);

   return (
      <Provider value={{data, print, increment}}>
         {props.children}
      </Provider>
   )
}

export { ContextProvider, Consumer as ContextConsumer };