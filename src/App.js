import React, { Suspense, useEffect } from "react";
import "./App.css";
import "./fr.css";
import "./ar.css";
import { logoutAllTabs } from "./store/actions/Auth_Sign_Out";
import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";
import { Loader } from "./components/elements";
import moment from 'moment'

const App = () => {
  useEffect(() => {
    logoutAllTabs();
  }, []);
  moment.tz.setDefault("America/New_York")
  return (
    <>
      {/* <RouterProvider router={router} /> */}

    </>
  );
};

export default App;
