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
import { Loader, Notification } from "./components/elements";
import { router } from "./routes/routes";
import { RouterProvider } from "react-router-dom";
import axios from "axios";
import UpdateVersionNotifyModal from "./components/elements/updatedVersionNotifyModal/updateVersionNotifyModal";
import { useSelector } from "react-redux";
import { mobileAppPopModal } from "./store/actions/UserMangementModalActions";
import { useDispatch } from "react-redux";
import { showMessage } from "./components/elements/snack_bar/utill";
const MIN_LOADER_DISPLAY_TIME = 500;

const POLLING_INTERVAL = 60000; // 1 minute
const App = () => {
  const dispatch = useDispatch();
  const { SessionExpireResponseMessage } = useSelector((state) => state.auth);
  const {
    auth,
    assignees,
    CommitteeReducer,
    toDoListReducer,
    getTodosStatus,
    downloadReducer,
    todoStatus,
    uploadReducer,
    settingReducer,
    fAQsReducer,
    meetingIdReducer,
    calendarReducer,
    OnBoardModal,
    postAssigneeComments,
    VideoChatReducer,
    minuteofMeetingReducer,
    countryNamesReducer,
    GetSubscriptionPackage,
    Authreducer,
    roleListReducer,
    NotesReducer,
    GroupsReducer,
    ResolutionReducer,
    RealtimeNotification,
    OrganizationBillingReducer,
    PollsReducer,
    NewMeetingreducer,
    LanguageReducer,
    webViewer,
    MeetingOrganizersReducer,
    MeetingAgendaReducer,
    attendanceMeetingReducer,
    actionMeetingReducer,
    AgendaWiseAgendaListReducer,
    DataRoomReducer,
    DataRoomFileAndFoldersDetailsReducer,
    SignatureWorkFlowReducer,
    UserMangementReducer,
    adminReducer,
    UserReportReducer,
    MinutesReducer,
    UserManagementModals,
  } = useSelector((state) => state);
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
  console.log("loader checking ");
  // Show modal if accessed on a mobile browser
  useEffect(() => {
    if (isMobileDevice()) {
      console.log("Mobile device detected. Showing modal.");
      dispatch(mobileAppPopModal(true));
    } else {
      console.log("Not a mobile device. Modal not shown.");
    }
  }, []);

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
    NewMeetingreducer.Loading,
    auth.Loading,
    assignees.Loading,
    MeetingOrganizersReducer.LoadingMeetingOrganizer,
    MeetingOrganizersReducer.Loading,
    PollsReducer.Loading,
    CommitteeReducer.Loading,
    toDoListReducer.Loading,
    todoStatus.Loading,
    getTodosStatus.Loading,
    MeetingAgendaReducer.Loading,
    actionMeetingReducer.Loading,
    AgendaWiseAgendaListReducer.loading,
    downloadReducer.Loading,
    attendanceMeetingReducer.Loading,
    webViewer.Loading,
    LanguageReducer.Loading,
    uploadReducer.Loading,
    settingReducer.Loading,
    fAQsReducer.Loading,
    meetingIdReducer.Loading,
    calendarReducer.Loading,
    OnBoardModal.Loading,
    postAssigneeComments.Loading,
    VideoChatReducer.Loading,
    minuteofMeetingReducer.Loading,
    countryNamesReducer.Loading,
    GetSubscriptionPackage.Loading,
    Authreducer.Loading,
    roleListReducer.Loading,
    NotesReducer.Loading,
    GroupsReducer.Loading,
    GroupsReducer.getAllLoading,
    ResolutionReducer.Loading,
    RealtimeNotification.Loading,
    OrganizationBillingReducer.Loading,
    DataRoomReducer.Loading,
    MinutesReducer.Loading,
    UserManagementModals.Loading,
    DataRoomFileAndFoldersDetailsReducer.Loading,
    SignatureWorkFlowReducer.Loading,
    adminReducer.Loading,
    UserReportReducer.Loading,
    UserMangementReducer.Loading,
  ].some((state) => state);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading) {
      // Show loader immediately when any state is loading
      setShowLoader(true);
    } else {
      // Set a timeout to delay hiding the loader
      timer = setTimeout(() => {
        setShowLoader(false);
      }, MIN_LOADER_DISPLAY_TIME);
    }
    // Clean up timeout on component unmount or if `isLoading` changes
    return () => clearTimeout(timer);
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
      <RouterProvider router={router} />
      {/* Calling a component or modal in which Iframe calling through their SourceLink  */}
      {paymentProcessModal && <OpenPaymentForm />}
      {updateVersion && (
        <UpdateVersionNotifyModal
          setUpdateVersion={setUpdateVersion}
          updateVersion={updateVersion}
        />
      )}
      {/* {navigator.onLine ? ( // Check for loading states to determine whether to display loader
        NewMeetingreducer.Loading ||
        auth.Loading ||
        assignees.Loading ||
        MeetingOrganizersReducer.LoadingMeetingOrganizer ||
        MeetingOrganizersReducer.Loading ||
        PollsReducer.Loading ||
        CommitteeReducer.Loading ||
        toDoListReducer.Loading ||
        todoStatus.Loading ||
        getTodosStatus.Loading ||
        MeetingAgendaReducer.Loading ||
        actionMeetingReducer.Loading ||
        AgendaWiseAgendaListReducer.loading ||
        downloadReducer.Loading ||
        attendanceMeetingReducer.Loading ||
        webViewer.Loading ||
        LanguageReducer.Loading ||
        uploadReducer.Loading ||
        settingReducer.Loading ||
        fAQsReducer.Loading ||
        meetingIdReducer.Loading ||
        calendarReducer.Loading ||
        OnBoardModal.Loading ||
        postAssigneeComments.Loading ||
        VideoChatReducer.Loading ||
        minuteofMeetingReducer.Loading ||
        countryNamesReducer.Loading ||
        GetSubscriptionPackage.Loading ||
        Authreducer.Loading ||
        roleListReducer.Loading ||
        NotesReducer.Loading ||
        GroupsReducer.Loading ||
        GroupsReducer.getAllLoading ||
        ResolutionReducer.Loading ||
        RealtimeNotification.Loading ||
        OrganizationBillingReducer.Loading ||
        DataRoomReducer.Loading ||
        MinutesReducer.Loading ||
        UserManagementModals.Loading ||
        DataRoomFileAndFoldersDetailsReducer.Loading ||
        SignatureWorkFlowReducer.Loading ||
        adminReducer.Loading ||
        UserReportReducer.Loading ||
        UserMangementReducer.Loading ? (
          <Loader />
        ) : null
      ) : null} */}
      {navigator.onLine && showLoader && <Loader />}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default App;
