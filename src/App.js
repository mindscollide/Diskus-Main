import React, { Suspense, useEffect } from "react";
import "./App.css";
import "./fr.css";
import "./ar.css";
import { logoutAllTabs } from "./store/actions/Auth_Sign_Out";
import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";
import { Loader } from "./components/elements";

const App = () => {
  useEffect(() => {
    logoutAllTabs();
  }, []);

  return (
    <>
      {/* <RouterProvider router={router} /> */}
    </>
  );
};

export default App;
