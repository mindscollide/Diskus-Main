import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Loader from "./components/elements/loader/Loader";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <Suspense fallback="is Loading...">
          <App />
        </Suspense>
      </Provider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
