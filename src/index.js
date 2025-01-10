import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MeetingProvider } from "./context/MeetingContext";
import { DataroomProvider } from "./context/DataroomContext";
import { GroupsProvider } from "./context/GroupsContext";
import { CommitteeProvider } from "./context/CommitteeContext";
import { PollsProvider } from "./context/PollsContext";
import { NotesProvider } from "./context/NotesContext";
const root = ReactDOM.createRoot(document.getElementById("root")); // Assuming you're using BrowserRouter

// Disable console.* in production
// if (process.env.NODE_ENV === "production") {
//   console.log = () => {};
//   console.error = () => {};
//   console.debug = () => {};
//   console.warn = () => {};
// }

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <MeetingProvider>
        <GroupsProvider>
          <CommitteeProvider>
            <DataroomProvider>
              <PollsProvider>
                <NotesProvider>
                  <App />
                </NotesProvider>
              </PollsProvider>
            </DataroomProvider>
          </CommitteeProvider>
        </GroupsProvider>
      </MeetingProvider>
    </Provider>
  </GoogleOAuthProvider>
);
