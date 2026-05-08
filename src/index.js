import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./store/store";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import SpinComponent from "./components/elements/mainLoader/loader";

// Render the app with all providers
// Root for Spinner or secondary element
const spinnerContainer = document.getElementById("mainSpinner");
if (spinnerContainer) {
  const spinnerRoot = ReactDOM.createRoot(spinnerContainer);
  spinnerRoot.render(
    <Provider store={store}>
      <SpinComponent />
    </Provider>
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
