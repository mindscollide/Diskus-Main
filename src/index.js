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
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.warn = () => {};
}

// Render the app with all providers
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
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
    </Provider>
  </GoogleOAuthProvider>
);
