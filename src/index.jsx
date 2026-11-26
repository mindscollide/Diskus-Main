import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./store/store";
import App from "./App";
import "./index.css";
// i18n (also keeps moment's global locale in sync with the app language) must be loaded at startup,
// not only when some component happens to import it
import "./i18n";
import { AuthProvider } from "./context/AuthContext";
import SpinComponent from "./components/elements/mainLoader/loader";

import disableConsole from "./commen/disableConsole";
disableConsole();

// After logout the browser Back button can restore the previous private page
// straight from its back/forward cache (a frozen copy of the page, so none of
// the route guards run again). When that happens with no session left, send the
// user to the login page instead of showing the stale private screen.
window.addEventListener("pageshow", (event) => {
  try {
    if (
      event.persisted &&
      !localStorage.getItem("token") &&
      window.location.pathname.toLowerCase().startsWith("/diskus")
    ) {
      window.location.replace("/");
    }
  } catch (e) {
    /* storage unavailable: nothing to check */
  }
});

// Render the app with all providers
// Root for Spinner or secondary element
const spinnerContainer = document.getElementById("mainSpinner");
if (spinnerContainer) {
  const spinnerRoot = ReactDOM.createRoot(spinnerContainer);
  spinnerRoot.render(
    <Provider store={store}>
      <SpinComponent />
    </Provider>,
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </GoogleOAuthProvider>,
);
