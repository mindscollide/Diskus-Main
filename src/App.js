import React, { useEffect, useState } from "react";
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
import { Notification } from "./components/elements";
import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";
import UpdateVersionNotifyModal from "./components/elements/updatedVersionNotifyModal/updateVersionNotifyModal";
import { useSelector } from "react-redux";
import { mobileAppPopModal } from "./store/actions/UserMangementModalActions";
import { useDispatch } from "react-redux";
import { showMessage } from "./components/elements/snack_bar/utill";
import { useAuthContext } from "./context/AuthContext";

import axios from "axios";
const POLLING_INTERVAL = 60000; // 1 minute

const App = () => {
  const dispatch = useDispatch();
  const { signOut } = useAuthContext();

  useEffect(() => {
    const syncSessionAndRedirect = () => {
      const localToken = localStorage.getItem("token");
      const localUser = localStorage.getItem("userID");
      const sessionToken = sessionStorage.getItem("token");
      const sessionUser = sessionStorage.getItem("userID");
      const isAlreadyInDashboard =
        window.location.pathname.startsWith("/Diskus/");

      // Step 1: Sync sessionStorage if different from localStorage
      if (localToken && localUser) {
        if (
          (sessionToken !== localToken || sessionUser !== localUser) &&
          isAlreadyInDashboard
        ) {
          sessionStorage.setItem("token", localToken);
          sessionStorage.setItem("userID", localUser);
          window.location.reload(); // reload to reflect new user session
          return;
        }
      }

      // Step 2: Redirect to dashboard if token exists but not on dashboard
      if (!isAlreadyInDashboard && localToken && localUser) {
        window.location.replace("/Diskus/");
      }
    };

    // Run on initial load
    syncSessionAndRedirect();

    // Listen for tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncSessionAndRedirect();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const { SessionExpireResponseMessage } = useSelector((state) => state.auth);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [updateVersion, setUpdateVersion] = useState(false);
  const [currentVersion, setCurrentVersion] = useState("");
  const { paymentProcessModal } = useSelector(
    (state) => state.UserManagementModals
  );

  // Detect mobile device function

  const isMobileDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    return isAndroid || isIOS;
  };

  let RSVPRouteforApp = localStorage.getItem("mobilePopUpAppRoute");
  useEffect(() => {
    const channel = new BroadcastChannel("auth");

    channel.onmessage = (event) => {
      if (event.data === "logout") {
        signOut(dispatch);
        // signOut(navigate, "", dispatch);
      }
    };

    return () => channel.close();
  }, [dispatch]);

  useEffect(() => {
    if (isMobileDevice()) {
      const fallbackDelay = 2000; // Adjust as needed

      const start = Date.now();
      if (RSVPRouteforApp !== null) {
        const appLink = `thediskus://thediskus.com?${RSVPRouteforApp}`; // Append it to the appLink
        // Attempt to open the app
        window.location.href = appLink;
      }
      // Set a timeout to detect failure and show modal
      setTimeout(() => {
        const elapsed = Date.now() - start;

        // If user stays on the browser page, show the modal
        if (elapsed < fallbackDelay + 500) {
          dispatch(mobileAppPopModal(true));
        }
      }, fallbackDelay);
    }

    return () => {
      localStorage.removeItem("mobilePopUpAppRoute");
    };
  }, [RSVPRouteforApp]);

  useEffect(() => {
    // Function to fetch the current version from version.json
    const fetchVersion = async () => {
      try {
        const response = await axios.get("/version.json", {
          cache: "no-store",
        });

        console.log(response, "responseresponse");
        return response.data.version;
      } catch (error) {
        console.error("Error fetching version:", error);
        return null;
      }
    };

    // Function to check the version and refresh if needed
    const checkVersion = async () => {
      const latestVersion = await fetchVersion();
      if (
        latestVersion &&
        currentVersion &&
        currentVersion !== latestVersion &&
        currentVersion !== null
      ) {
        setUpdateVersion(true);
      } else if (!currentVersion) {
        // Set the initial version if it's not set
        setCurrentVersion(latestVersion);
      }
    };

    // Initial version check on component mount
    checkVersion();

    // Set up polling interval to check for version updates
    const intervalId = setInterval(checkVersion, POLLING_INTERVAL);
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentVersion]);

  useEffect(() => {
    if (
      SessionExpireResponseMessage !== null &&
      SessionExpireResponseMessage !== undefined &&
      SessionExpireResponseMessage !== ""
    ) {
      try {
        showMessage(SessionExpireResponseMessage, "error", setOpen);
      } catch (error) {}
    }
  }, [SessionExpireResponseMessage]);

  return (
    <>
      {/* Define your routes here */}
      <RouterProvider
        router={router}
        future={{ v7_startTransition: true, v7_fetcherPersist: true }}
      />
      {/* Calling a component or modal in which Iframe calling through their SourceLink  */}
      {paymentProcessModal && <OpenPaymentForm />}
      {updateVersion && (
        <UpdateVersionNotifyModal
          setUpdateVersion={setUpdateVersion}
          updateVersion={updateVersion}
        />
      )}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default App;
