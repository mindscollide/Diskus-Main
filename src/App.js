import React, {  useEffect, useState } from "react";
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
import axios from "axios";
import UpdateVersionNotifyModal from "./components/elements/updatedVersionNotifyModal/updateVersionNotifyModal";
import { useSelector } from "react-redux";
import { mobileAppPopModal } from "./store/actions/UserMangementModalActions";
import { useDispatch } from "react-redux";
import { showMessage } from "./components/elements/snack_bar/utill";
import { useAuthContext } from "./context/AuthContext";

const POLLING_INTERVAL = 60000; // 1 minute
const App = () => {
  const dispatch = useDispatch();
  const { signOut } = useAuthContext();
  const { SessionExpireResponseMessage } = useSelector((state) => state.auth);
  const auth = useSelector((state) => state.auth);
  const assignees = useSelector((state) => state.assignees);
  const CommitteeReducer = useSelector((state) => state.CommitteeReducer);
  const toDoListReducer = useSelector((state) => state.toDoListReducer);
  const getTodosStatus = useSelector((state) => state.getTodosStatus);
  const downloadReducer = useSelector((state) => state.downloadReducer);
  const todoStatus = useSelector((state) => state.todoStatus);
  const uploadReducer = useSelector((state) => state.uploadReducer);
  const settingReducer = useSelector((state) => state.settingReducer);
  const fAQsReducer = useSelector((state) => state.fAQsReducer);
  const meetingIdReducer = useSelector((state) => state.meetingIdReducer);
  const calendarReducer = useSelector((state) => state.calendarReducer);
  const postAssigneeComments = useSelector(
    (state) => state.postAssigneeComments
  );
  const VideoChatReducer = useSelector((state) => state.VideoChatReducer);
  const minuteofMeetingReducer = useSelector(
    (state) => state.minuteofMeetingReducer
  );
  const countryNamesReducer = useSelector((state) => state.countryNamesReducer);
  const GetSubscriptionPackage = useSelector(
    (state) => state.GetSubscriptionPackage
  );
  const Authreducer = useSelector((state) => state.Authreducer);
  const roleListReducer = useSelector((state) => state.roleListReducer);
  const NotesReducer = useSelector((state) => state.NotesReducer);
  const GroupsReducer = useSelector((state) => state.GroupsReducer);
  const ResolutionReducer = useSelector((state) => state.ResolutionReducer);
  const RealtimeNotification = useSelector(
    (state) => state.RealtimeNotification
  );
  const OrganizationBillingReducer = useSelector(
    (state) => state.OrganizationBillingReducer
  );
  const PollsReducer = useSelector((state) => state.PollsReducer);
  const NewMeetingreducer = useSelector((state) => state.NewMeetingreducer);
  const LanguageReducer = useSelector((state) => state.LanguageReducer);
  const webViewer = useSelector((state) => state.webViewer);
  const MeetingOrganizersReducer = useSelector(
    (state) => state.MeetingOrganizersReducer
  );
  const MeetingAgendaReducer = useSelector(
    (state) => state.MeetingAgendaReducer
  );
  const attendanceMeetingReducer = useSelector(
    (state) => state.attendanceMeetingReducer
  );
  const actionMeetingReducer = useSelector(
    (state) => state.actionMeetingReducer
  );
  const AgendaWiseAgendaListReducer = useSelector(
    (state) => state.AgendaWiseAgendaListReducer
  );
  const DataRoomReducer = useSelector((state) => state.DataRoomReducer);
  const DataRoomFileAndFoldersDetailsReducer = useSelector(
    (state) => state.DataRoomFileAndFoldersDetailsReducer
  );
  const SignatureWorkFlowReducer = useSelector(
    (state) => state.SignatureWorkFlowReducer
  );
  const UserMangementReducer = useSelector(
    (state) => state.UserMangementReducer
  );
  const adminReducer = useSelector((state) => state.adminReducer);
  const UserReportReducer = useSelector((state) => state.UserReportReducer);
  const MinutesReducer = useSelector((state) => state.MinutesReducer);

  const UserManagementModals = useSelector(
    (state) => state.UserManagementModals
  );

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
  const isLoading = [
    NewMeetingreducer?.Loading,
    auth?.Loading,
    assignees?.Loading,
    MeetingOrganizersReducer?.LoadingMeetingOrganizer,
    MeetingOrganizersReducer?.Loading,
    PollsReducer?.Loading,
    CommitteeReducer?.Loading,
    toDoListReducer?.Loading,
    todoStatus?.Loading,
    getTodosStatus?.Loading,
    MeetingAgendaReducer?.Loading,
    actionMeetingReducer?.Loading,
    AgendaWiseAgendaListReducer?.loading,
    downloadReducer?.Loading,
    attendanceMeetingReducer?.Loading,
    webViewer?.Loading,
    LanguageReducer?.Loading,
    uploadReducer?.Loading,
    settingReducer?.Loading,
    fAQsReducer?.Loading,
    meetingIdReducer?.Loading,
    calendarReducer?.Loading,
    postAssigneeComments?.Loading,
    VideoChatReducer?.Loading,
    minuteofMeetingReducer?.Loading,
    countryNamesReducer?.Loading,
    GetSubscriptionPackage?.Loading,
    Authreducer?.Loading,
    roleListReducer?.Loading,
    NotesReducer?.Loading,
    GroupsReducer?.Loading,
    GroupsReducer?.getAllLoading,
    ResolutionReducer?.Loading,
    RealtimeNotification?.Loading,
    OrganizationBillingReducer?.Loading,
    DataRoomReducer?.Loading,
    MinutesReducer?.Loading,
    UserManagementModals?.Loading,
    DataRoomFileAndFoldersDetailsReducer?.Loading,
    SignatureWorkFlowReducer?.Loading,
    adminReducer?.Loading,
    UserReportReducer?.Loading,
    UserMangementReducer?.Loading,
  ].some((loading) => loading);

  const [showLoader, setShowLoader] = useState(false);

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let progressInterval;

    if (isLoading) {
      setShowLoader(true); // Show loader
      setProgress(0); // Start progress from 0%

      // Increment progress gradually
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            return prev + 2; // Gradually increase (up to 90%)
          } else {
            return prev; // Pause near 90% while still loading
          }
        });
      }, 100); // Adjust speed of increment
    } else {
      // When loading completes, animate from current progress to 100%
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            return prev + 2; // Gradually increase from 90% to 100%
          } else {
            clearInterval(progressInterval); // Clear interval at 100%
            const timeout = setTimeout(() => {
              setShowLoader(false); // Hide loader after reaching 100%
            }, 300); // Optional delay to display full progress
            return () => clearTimeout(timeout);
          }
        });
      }, 50); // Faster increment for the remaining 10%
    }
    // Cleanup interval when `isLoading` changes or component unmounts
    return () => clearInterval(progressInterval);
  }, [isLoading]);

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
