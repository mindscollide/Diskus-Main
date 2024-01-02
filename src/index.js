import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { Loader } from "./components/elements";
import { router } from "./routes/routes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./auth-config";
import { MsalProvider } from "@azure/msal-react";
// const msalInstance = new PublicClientApplication(msalConfig);
// if (
//   !msalInstance.getActiveAccount() &&
//   msalInstance.getAllAccounts().length > 0
// ) {
//   // Account selection logic is app dependent. Adjust as needed for different use cases.
//   msalInstance.setActiveAccount(msalInstance.getActiveAccount()[0]);
// }
// msalInstance.addEventCallback((event) => {
//   if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
//     const account = event.payload.account;
//     msalInstance.setActiveAccount(account);
//   }
// });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="509020224191-pst82a2kqjq33phenb35b0bg1i0q762o.apps.googleusercontent.com">
    <Provider store={store}>
      <Suspense
      // fallback={<Loader />}
      >
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </GoogleOAuthProvider>
);
