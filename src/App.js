import React, { Suspense, useEffect, useState } from "react";
import "./App.css";
import "./fr.css";
import "./ar.css";
import "./assets/font-icons/font-icons.css";
import "@fontsource/montserrat"; // Defaults to weight 400
import "@fontsource/montserrat/100.css";
import "@fontsource/montserrat/200.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/ibm-plex-sans-arabic"; // Defaults to weight 400
import "@fontsource/ibm-plex-sans-arabic/100.css";
import "@fontsource/ibm-plex-sans-arabic/200.css";
import "@fontsource/ibm-plex-sans-arabic/300.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import OpenPaymentForm from "./container/pages/UserMangement/ModalsUserManagement/OpenPaymentForm/OpenPaymentForm";
import { Loader, Modal, Button } from "./components/elements";
import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";
import axios from "axios";
import UpdateVersionNotifyModal from "./components/elements/updatedVersionNotifyModal/updateVersionNotifyModal";

const POLLING_INTERVAL = 60000; // 1 minute
const App = () => {
  const [updateVersion, setUpdateVersion] = useState(false);
  const [currentVersion, setCurrentVersion] = useState("");

  useEffect(() => {
    // Function to fetch the current version from version.json
    const fetchVersion = async () => {
      try {
        const response = await axios.get("/version.json", {
          cache: "no-store",
        });
        return response.data.version;
      } catch (error) {
        console.error("Error fetching version:", error);
        return null;
      }
    };

    // Function to check the version and refresh if needed
    const checkVersion = async () => {
      const latestVersion = await fetchVersion();
      if (latestVersion && currentVersion && currentVersion !== latestVersion) {
        setUpdateVersion(true);
        // If versions differ, prompt user to refresh or auto-refresh
        // if (
        //   window.confirm(
        //     "A new version of the application is available. Refresh now?"
        //   )
        // ) {
        //   window.location.reload();
        // }
      } else if (!currentVersion) {
        // Set the initial version if it's not set
        setCurrentVersion(latestVersion);
      }
    };

    // Initial version check on component mount
    checkVersion();

    // Set up polling interval to check for version updates
    const intervalId = setInterval(checkVersion, POLLING_INTERVAL);
    console.log("versionversionversion", intervalId);
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentVersion]);
  return (
    <>
      <Suspense fallback={<Loader />}>
        {/* Define your routes here */}
        <RouterProvider router={router} />
        {/* Calling a component or modal in which Iframe calling through their SourceLink  */}
        <OpenPaymentForm />
        {updateVersion && (
          <UpdateVersionNotifyModal
            setUpdateVersion={setUpdateVersion}
            updateVersion={updateVersion}
          />
        )}
      </Suspense>
      {/* <Notification /> */}
    </>
  );
};

export default App;
