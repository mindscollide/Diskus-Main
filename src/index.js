import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Redux store
import { Provider } from "react-redux";
import store from "./store/store";

// Context providers
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MeetingProvider } from "./context/MeetingContext";
import { DataroomProvider } from "./context/DataroomContext";
import { GroupsProvider } from "./context/GroupsContext";
import { CommitteeProvider } from "./context/CommitteeContext";
import { PollsProvider } from "./context/PollsContext";
import { NotesProvider } from "./context/NotesContext";
import { ResolutionProvider } from "./context/ResolutionContext";
import { AuthProvider } from "./context/AuthContext";
import SpinComponent from "./components/elements/mainLoader/loader";
import { TalkProvider } from "./context/TalkContext";

// Root container
const container = document.getElementById("root");

// Create the root with error handling (if applicable)
const root = ReactDOM.createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      console.error("Caught error:", error);
      console.error("Component stack:", errorInfo.componentStack);
    }
  },
});

// Disable console methods in production for better security and performance
if (process.env.REACT_APP_ENV === "prod") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.warn = () => {};
}

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
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <AuthProvider>
        <TalkProvider>
          <MeetingProvider>
            <GroupsProvider>
              <CommitteeProvider>
                <DataroomProvider>
                  <PollsProvider>
                    <NotesProvider>
                      <ResolutionProvider>
                        <App />
                      </ResolutionProvider>
                    </NotesProvider>
                  </PollsProvider>
                </DataroomProvider>
              </CommitteeProvider>
            </GroupsProvider>
          </MeetingProvider>
        </TalkProvider>
      </AuthProvider>
    </Provider>
  </GoogleOAuthProvider>
);
