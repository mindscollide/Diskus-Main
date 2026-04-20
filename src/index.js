/**
 * @file index.js
 * @description Application entry point.  Creates the React root and mounts the
 * full context-provider tree around `<App />`.
 *
 * Provider nesting order (outermost → innermost):
 *  1. `GoogleOAuthProvider`  – Google OAuth client ID from env vars.
 *  2. `Provider` (Redux)     – Global Redux store.
 *  3. `AuthProvider`         – Authentication state & `signOut` helper.
 *  4. `TalkProvider`         – Rocket.Chat / Talk messaging context.
 *  5. `MeetingProvider`      – Active meeting state.
 *  6. `GroupsProvider`       – Groups list and selected group state.
 *  7. `CommitteeProvider`    – Committee list and selected committee state.
 *  8. `DataroomProvider`     – Data Room navigation state.
 *  9. `PollsProvider`        – Polls feature state.
 * 10. `NotesProvider`        – Notes feature state.
 * 11. `ResolutionProvider`   – Resolutions feature state.
 * 12. `ComlianceProvider`    – Compliance feature state.
 * 13. `App`                  – Root component.
 *
 * A secondary React root (`#mainSpinner`) is also created and renders
 * `<SpinComponent>` (a full-screen loading indicator) that is independent of
 * the main app tree so it can overlay even during initial bundle evaluation.
 *
 * `onCaughtError` is registered on the root to log errors that are caught by
 * an `<ErrorBoundary>` but not re-thrown.
 */
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
import { ComlianceProvider } from "./context/ComplianceContext";

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
// if (process.env.REACT_APP_ENV === "prod") {
//   console.log = () => {};
//   console.error = () => {};
//   console.debug = () => {};
//   console.warn = () => {};
// }

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
                        <ComlianceProvider>
                          <App />
                        </ComlianceProvider>
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
