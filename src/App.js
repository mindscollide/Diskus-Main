// App.js
import React, { Suspense, useEffect } from "react";
import { Routes, Route, RouterProvider } from "react-router-dom"; // Import necessary routing components
import "./App.css";
import "./Fonts.css";
import "./fr.css";
import "./ar.css";
import { logoutAllTabs } from "./store/actions/Auth_Sign_Out";
import moment from "moment";
import "moment-timezone"; // Ensure moment-timezone is imported if you're using it
import "./assets/font-icons/font-icons.css";
import { Loader } from "./components/elements"; // Assuming you have a Loader component for suspense fallback
import { router } from "./routes/routes";
import { manageTabs } from "./commen/functions/validations";
import OpenPaymentForm from "./container/pages/UserMangement/ModalsUserManagement/OpenPaymentForm/OpenPaymentForm";

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      {/* Define your routes here */}
      <RouterProvider router={router} />

      {/* Calling a component or modal in which Iframe calling through their SourceLink  */}
      <OpenPaymentForm />
    </Suspense>
  );
};

export default App;

// Assume HomePage is a component you've defined elsewhere
