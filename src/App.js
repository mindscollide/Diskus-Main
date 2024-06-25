import React, { Suspense, useEffect } from "react";
import "./App.css";
import "./fr.css";
import "./ar.css";
import "./assets/font-icons/font-icons.css";
import "@fontsource/montserrat"; // Defaults to weight 400
import "@fontsource/montserrat/100.css";
import "@fontsource/montserrat/200.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/ibm-plex-sans-arabic"; // Defaults to weight 400
import "@fontsource/ibm-plex-sans-arabic/100.css";
import "@fontsource/ibm-plex-sans-arabic/200.css";
import "@fontsource/ibm-plex-sans-arabic/300.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import OpenPaymentForm from "./container/pages/UserMangement/ModalsUserManagement/OpenPaymentForm/OpenPaymentForm";
import { Loader, Notification } from "./components/elements";
import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import ResponseMessagesCom from "./hooks/responseMessages/ResponseMessagesCom";

const App = () => {
  // const state = useSelector((state) => state);
  // useEffect(() => {} ,[])
  // console.log(state, "stateAppComponent");

  return (
    <>
      <Suspense fallback={<Loader />}>
        {/* Define your routes here */}
        <RouterProvider router={router} />

        {/* Calling a component or modal in which Iframe calling through their SourceLink  */}
        <OpenPaymentForm />
      </Suspense>
      {/* <Notification /> */}
    </>
  );
};

export default App;
