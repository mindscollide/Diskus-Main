// import React, { Suspense } from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import { RouterProvider } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store/store";
// import { Loader } from "./components/elements";
// import { router } from "./routes/routes";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { setupTabTracking } from "./commen/functions/validations";
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_LOGIN_URL}>
//     <Provider store={store}>
//       <Suspense>
//         <RouterProvider router={router} />
//       </Suspense>
//     </Provider>
//   </GoogleOAuthProvider>
// );
// index.js
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import { Loader } from "./components/elements";
import { GoogleOAuthProvider } from "@react-oauth/google";
const root = ReactDOM.createRoot(document.getElementById("root")); // Assuming you're using BrowserRouter

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    {" "}
    {/* Ensure the environment variable name is correct */}
    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    </Provider>
  </GoogleOAuthProvider>
);
