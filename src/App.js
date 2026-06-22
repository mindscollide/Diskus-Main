/**
 * @file App.js
 * @description Root application component.
 *
 * Responsibilities:
 *  - Renders the router via <RouterProvider>
 *  - Session sync: on tab focus, syncs localStorage ↔ sessionStorage and
 *    redirects to dashboard if a token exists but user is on the login page
 *  - Cross-tab logout: listens on BroadcastChannel("auth") — a "logout" message
 *    from another tab triggers signOut in this tab
 *  - Version polling: polls /version.json every 60s and shows
 *    <UpdateVersionNotifyModal> when the deployed version changes
 *  - Mobile deep-link: on mobile devices, attempts to open the native app via
 *    the `thediskus://` URI scheme; falls back to showing the app-install modal
 *  - Payment modal: conditionally renders <OpenPaymentForm> iframe based on
 *    Redux `paymentProcessModal` state
 *  - Session expiry notification: watches `SessionExpireResponseMessage` in
 *    Redux and shows an error snackbar when it is set
 */
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
import GlobalSnackbar from "./components/elements/snack_bar/GlobalSnackbar";
import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";
import UpdateVersionNotifyModal from "./components/elements/updatedVersionNotifyModal/updateVersionNotifyModal";
import { useSelector } from "react-redux";
import { mobileAppPopModal } from "./store/actions/UserMangementModalActions";
import { useDispatch } from "react-redux";
import useSnackbar from "./components/elements/snack_bar/useSnackbar";
import { useAuthContext } from "./context/AuthContext";

import axios from "axios";
const POLLING_INTERVAL = 60000; // 1 minute

const App = () => {
  const dispatch = useDispatch();
  const { signOut } = useAuthContext();

  useEffect(() => {
    // 🔥 Check if this is a redirect-induced reload
    const isRedirectReload = sessionStorage.getItem("redirecting") === "true";

    // 🔥 If this is a redirect reload, clear the flag and stop
    if (isRedirectReload) {
      console.log("Clearing redirect flag after reload");
      sessionStorage.removeItem("redirecting");
      return; // Don't run any more logic
    }

    // 🔥 Check if we've already handled redirect in this session
    if (sessionStorage.getItem("redirectHandled") === "true") {
      console.log("Redirect already handled in this session - skipping");
      return;
    }

    const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password"];
    const DASHBOARD_PATH = "/Diskus/";

    const isPublicPath = (pathname) => {
      return PUBLIC_PATHS.some(
        (path) =>
          pathname.toLowerCase() === path ||
          pathname.toLowerCase().startsWith(path),
      );
    };

    const isDashboardPath = (pathname) => {
      return (
        pathname.toLowerCase().includes("diskus") ||
        pathname.toLowerCase().includes("admin")
      );
    };

    const shouldRedirect = () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userID");
        const is2FaEnabled = localStorage.getItem("is2FAEnabled");
        const currentPath = window.location.pathname;

        const isAuthenticated = token && userId && userId !== "";

        // If on dashboard, no redirect needed
        if (isDashboardPath(currentPath)) {
          sessionStorage.setItem("redirectHandled", "true");
          return false;
        }

        // Only redirect if authenticated AND on public page
        return isAuthenticated && isPublicPath(currentPath);
      } catch (error) {
        console.error("Error checking redirect:", error);
        return false;
      }
    };

    // 🔥 Perform redirect with loop protection
    const performRedirect = () => {
      if (shouldRedirect()) {
        console.log("Redirecting to dashboard");

        // 🔥 Set flags to prevent loop
        sessionStorage.setItem("redirectHandled", "true");
        sessionStorage.setItem("redirecting", "true"); // Flag for the reload

        window.location.replace(DASHBOARD_PATH);
        return true;
      }
      return false;
    };

    // 🔥 Run initial redirect check
    const redirected = performRedirect();

    // 🔥 If redirect happened, no need for listeners
    if (redirected) {
      return;
    }

    // 🔥 Mark as handled if no redirect needed
    sessionStorage.setItem("redirectHandled", "true");

    // 🔥 Silent sync function (NO reload)
    const syncSessionStorage = () => {
      try {
        const localToken = localStorage.getItem("token");
        const localUser = localStorage.getItem("userID");

        if (localToken && localUser) {
          if (sessionStorage.getItem("token") !== localToken) {
            sessionStorage.setItem("token", localToken);
          }
          if (sessionStorage.getItem("userID") !== localUser) {
            sessionStorage.setItem("userID", localUser);
          }
        }
      } catch (error) {
        console.error("Error syncing session:", error);
      }
    };

    // 🔥 Listen for tab visibility - ONLY sync, NO redirect
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncSessionStorage();
      }
    };

    // 🔥 Listen for cross-tab login
    const handleStorageChange = (event) => {
      if (
        event.key === "token" ||
        event.key === "userID" ||
        event.key === "is2FAEnabled"
      ) {
        // Check if we should redirect (user logged in on another tab)
        if (shouldRedirect()) {
          console.log("User logged in on another tab - redirecting");
          sessionStorage.setItem("redirectHandled", "true");
          sessionStorage.setItem("redirecting", "true");
          window.location.replace(DASHBOARD_PATH);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const { SessionExpireResponseMessage } = useSelector((state) => state.auth);

  const [show, SnackBar] = useSnackbar();
  const [updateVersion, setUpdateVersion] = useState(false);
  const [currentVersion, setCurrentVersion] = useState("");
  const { paymentProcessModal } = useSelector(
    (state) => state.UserManagementModals,
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
      <GlobalSnackbar />
      {SnackBar}
    </>
  );
};

export default App;
