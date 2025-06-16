import { useMeetingContext } from "../../context/MeetingContext";
import {
  createCommitteePageFlag,
  updateCommitteePageFlag,
  viewCommitteePageFlag,
} from "../../store/actions/Committee_actions";
import {
  DataRoomFileSharingPermissionAPI,
  getFolderDocumentsApi,
} from "../../store/actions/DataRoom_actions";
import { ViewMeeting } from "../../store/actions/Get_List_Of_Assignees";
import { getPackageExpiryDetail } from "../../store/actions/GetPackageExpirtyDetails";
import {
  createGroupPageFlag,
  updateGroupPageFlag,
  viewGroupPageFlag,
} from "../../store/actions/Groups_actions";
import { MinutesWorkFlowActorStatusNotificationAPI } from "../../store/actions/Minutes_action";
import {
  actionsGlobalFlag,
  agendaContributorsGlobalFlag,
  agendaGlobalFlag,
  attendanceGlobalFlag,
  GetMeetingStatusDataAPI,
  meetingDetailsGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  organizersGlobalFlag,
  participantsGlobalFlag,
  pollsGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  proposeNewMeetingPageFlag,
  scheduleMeetingPageFlag,
  searchNewUserMeeting,
  showCancelModalmeetingDeitals,
  showEndMeetingModal,
  showSceduleProposedMeeting,
  uploadGlobalFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewMeetingFlag,
  viewProposeDateMeetingPageFlag,
  viewProposeOrganizerMeetingPageFlag,
} from "../../store/actions/NewMeetingActions";
import { getPollsByPollIdApi } from "../../store/actions/Polls_actions";
import {
  createResolutionModal,
  getResolutionbyResolutionID,
  getResolutionResult,
  resultResolutionFlag,
  viewAttachmentFlag,
  viewResolutionModal,
  voteResolutionFlag,
} from "../../store/actions/Resolution_actions";
import { LoginFlowRoutes } from "../../store/actions/UserManagementActions";
import { getAnnotationsOfDataroomAttachement } from "../../store/actions/webVieverApi_actions";
import { validateExtensionsforHTMLPage } from "./validations";

// this is function save avalable feature for current user implementation its save all data in local storage
export function savePackageFeatureIDs(userFeatures) {
  // Fetch existing data from local storage
  const storedData = localStorage.getItem("packageFeatureIDs");
  const existingIDs = storedData ? JSON.parse(storedData) : [];

  // Create a new array to store packageFeatureIDs from userFeatures
  const newIDs = userFeatures.map((feature) => feature.packageFeatureID);

  // Combine existing IDs with new IDs (avoid duplicates using a Set)
  const combinedIDs = Array.from(new Set([...existingIDs, ...newIDs]));

  // Store the combined array back in local storage
  localStorage.setItem("packageFeatureIDs", JSON.stringify(combinedIDs));
}

// this is function match data if id is exsit in deatures
export function checkFeatureID(id) {
  // Retrieve the packageFeatureIDs string from local storage and parse it into an array
  const storedIDs = localStorage.getItem("packageFeatureIDs");
  const packageFeatureIDs = storedIDs ? JSON.parse(storedIDs) : [];

  // Check if the provided ID is in the array of packageFeatureIDs
  return packageFeatureIDs.includes(id);
}

//Export function userFeatures from the Response
export function updateLocalUserRoutes(userFeatures, LocalUserRoutes) {
  let user = [
    { id: 1, name: "Meeting" },
    { id: 12, name: "Meeting" },
    { id: 9, name: "Meeting" },
    { id: 1, name: "Meeting/Useravailabilityformeeting" },
    { id: 9, name: "Meeting/Useravailabilityformeeting" },
    { id: 12, name: "Meeting/Useravailabilityformeeting" },
    { id: 13, name: "dataroom" },
    { id: 19, name: "signatureviewer" },
    { id: 21, name: "signatureviewer" },
    { id: 20, name: "documentViewer" },
    { id: 6, name: "notes" },
    { id: 7, name: "calendar" },
    { id: 14, name: "todolist" },
    { id: 15, name: "polling" },
    { id: 17, name: "groups" },
    { id: 48, name: "committee" },
    { id: 18, name: "resolution" },
  ];
  try {
    // Iterate through each feature from the API response
    userFeatures.forEach((feature) => {
      // Find matching route by packageFeatureID
      const matchingRoute = user.find(
        (route) => route.id === feature.packageFeatureID
      );
      if (matchingRoute) {
        // Check if LocalUserRoutes already contains an entry with this name
        if (
          !LocalUserRoutes.some((route) => route.name === matchingRoute.name)
        ) {
          // If not, push the new route into LocalUserRoutes
          LocalUserRoutes.push({
            name: matchingRoute.name,
            id: feature.packageFeatureID, // Using a unique identifier from API
          });
        }
      }
    });
    return LocalUserRoutes;
  } catch (error) {
    console.log(error);
  }
}

export function updateAdminRoutes(adminFeatures, LocalAdminRoutes) {
  let Admin = [
    { id: 26, name: "AddUsersUsermanagement" },
    { id: 26, name: "ManageUsers" },
    { id: 27, name: "ManageUsers" },
    { id: 31, name: "ManageUsers" },
    { id: 28, name: "PackageDetailsUserManagement" },
    { id: 28, name: "PakageDetailsUserManagement" },
    { id: 29, name: "CancelSubscriptionUserManagement" },
    { id: 30, name: "deleteorganizationUserMangement" },
    { id: 45, name: "CustomerInformation" },
    { id: 33, name: "PayOutstanding" },
    { id: 34, name: "Summary" },
    { id: 35, name: "loginreport" },
    { id: 36, name: "OrganizationlevelConfigUM" },
    { id: 37, name: "OrganizationlevelConfigUM" },
    { id: 38, name: "OrganizationlevelConfigUM" },
    { id: 39, name: "OrganizationlevelConfigUM" },
    { id: 40, name: "OrganizationlevelConfigUM" },
    { id: 41, name: "OrganizationlevelConfigUM" },
    { id: 42, name: "OrganizationlevelConfigUM" },
    { id: 43, name: "OrganizationlevelConfigUM" },
    { id: 45, name: "subscriptionDetailsUserManagement" },
    { id: 45, name: "downgradeSubscription" },
    { id: 46, name: "updatedCancelSubscription" },
  ];
  try {
    // Iterate through each feature from the API response
    adminFeatures.forEach((feature) => {
      // Find matching route by packageFeatureID
      const matchingRoute = Admin.find(
        (route) => route.id === feature.packageFeatureID
      );
      if (matchingRoute) {
        // Check if LocalUserRoutes already contains an entry with this name
        if (
          !LocalAdminRoutes.some((route) => route.name === matchingRoute.name)
        ) {
          // If not, push the new route into LocalUserRoutes
          LocalAdminRoutes.push({
            name: matchingRoute.name,
            id: feature.packageFeatureID, // Using a unique identifier from API
          });
        }
      }
    });

    return LocalAdminRoutes;
  } catch (error) {
    console.log(error);
  }
}

// for enter posword state management and routes management
// Export the handleLoginResponse function
export async function handleLoginResponse(response, dispatch, navigate, t) {
  try {
    if (response.organizationID) {
      localStorage.setItem("organizationID", response.organizationID);
    }

    localStorage.setItem("MicOff", true);
    localStorage.setItem("VidOff", true);

    localStorage.setItem(
      "organizationSubscriptionID",
      response.organizationSubscriptionID
    );

    if (response.organizationName) {
      localStorage.setItem("organizatioName", response.organizationName);
    }

    if (parseInt(response.organizationSubscriptionStatusID) === parseInt(5)) {
      localStorage.setItem("revokeCancellation", true);
    } else {
      localStorage.setItem("revokeCancellation", false);
    }

    localStorage.setItem("roleID", response.roleId);
    if (response.authToken) {
      localStorage.setItem("name", response.authToken.name);
      localStorage.setItem("userEmail", response.authToken.userName);
      localStorage.setItem("token", JSON.stringify(response.authToken.token));
      localStorage.setItem(
        "refreshToken",
        JSON.stringify(response.authToken.refreshToken)
      );
      localStorage.setItem(
        "organizationRoleID",
        response.authToken.organizationRoleID
      );

      localStorage.setItem("isFirstLogin", response.authToken.isFirstLogIn);
      localStorage.setItem("activeOtoChatID", 0);
      console.log("busyCall");
      localStorage.setItem("activeCall", false);
      localStorage.setItem("initiateVideoCall", false);
      localStorage.setItem("activeRoomID", 0);
      console.log("mqtt");
      localStorage.setItem("isMeeting", false);
      localStorage.setItem("meetingVideoID", 0);
      localStorage.setItem("newCallerID", 0);
      const emptyArray = [];
      localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
      localStorage.setItem("meetingTitle", "");
    }

    localStorage.setItem("isTrial", response.isTrial);
    if (response.isTrial) {
      await dispatch(
        getPackageExpiryDetail(navigate, response.organizationID, t)
      );
    }

    localStorage.setItem(
      "organizationSelectedUserPackageID",
      response.organizationSelectedUserPackageID
    );

    localStorage.setItem("hasUserRights", response.hasUserRights);

    localStorage.setItem("hasAdminRights", response.hasAdminRights);

    if (response.hasUserRights) {
      await savePackageFeatureIDs(response.userFeatures);
    }

    if (response.hasAdminRights) {
      await savePackageFeatureIDs(response.adminFeatures);
    }

    let LocalUserRoutes = response.hasUserRights
      ? [
          { name: "Diskus", id: 100 },
          { name: "home", id: 101 },
          { name: "", id: 102 },
          { name: "changePassword", id: 103 },
          { name: "faq's", id: 104 },
          { name: "setting", id: 105 },
          { name: "onboard", id: 106 },
          { name: "Minutes", id: 115 },
        ]
      : [];
    let LocalAdminRoutes = response.hasAdminRights
      ? [
          { name: "Admin", id: 200 },
          { name: "Admin", id: 201 },
          { name: "faq's", id: 207 },
          { name: "", id: 202 },
          { name: "ManageUsers", id: 203 },
          { name: "PackageDetailUMupgrade", id: 28 },
          { name: "PaymentHistory", id: 218 },
          { name: "changePassword", id: 220 },
          { name: "PaymentFormUserManagement", id: 222 },
          { name: "subscriptionDetailsUserManagement", id: 288 },
          { name: "downgradeSubscription", id: 289 },
          { name: "updatedCancelSubscription", id: 290 },
          { name: "AuditTrial", id: 219 },
        ]
      : [];
    if (response.isTrial) {
      if (response.hasUserRights) {
        LocalUserRoutes.push(
          { name: "Meeting", id: 106 },
          { name: "Meeting/Useravailabilityformeeting", id: 107 },
          { name: "notes", id: 6 },
          { name: "calendar", id: 7 },
          { name: "dataroom", id: 13 },
          { name: "todolist", id: 14 },
          { name: "polling", id: 15 },
          { name: "groups", id: 17 },
          { name: "committee", id: 17 },
          { name: "resolution", id: 18 },
          { name: "signatureviewer", id: 19 },
          { name: "documentViewer", id: 20 },
          { name: "Payment", id: 109 },
          { name: "Minutes", id: 115 }
        );
      }
      if (response.hasAdminRights) {
        LocalAdminRoutes.push(
          { name: "changePassword", id: 204 },
          { name: "OrganizationlevelConfigUM", id: 205 },
          { name: "PakageDetailsUserManagement", id: 206 },
          { name: "CustomerInformation", id: 208 },
          { name: "AddUsers", id: 26 },
          { name: "loginreport", id: 35 },
          { name: "PaymentFormUserManagement", id: 222 },
          { name: "AuditTrial", id: 219 }
        );
      }
    } else {
      //yaha pai kam karna hy user ka kam
      if (response.hasUserRights) {
        const dynamicUserFeatures = await updateLocalUserRoutes(
          response.userFeatures,
          LocalUserRoutes
        ); // get dynamic features
        LocalUserRoutes = dynamicUserFeatures;
      }
      //yaha pai kam karna hy Admin ka kam
      if (response.hasAdminRights) {
        const dynamicUserFeatures = await updateAdminRoutes(
          response.adminFeatures,
          LocalAdminRoutes
        ); // get dynamic features
        LocalAdminRoutes = dynamicUserFeatures;
      }
    }

    localStorage.setItem("LocalUserRoutes", JSON.stringify(LocalUserRoutes));
    localStorage.setItem("LocalAdminRoutes", JSON.stringify(LocalAdminRoutes));
    if (Number(localStorage.getItem("LoginFlowPageRoute")) !== 1) {
      localStorage.setItem("LoginFlowPageRoute", 1);
    }
  } catch (error) {
    console.error(error);
  }
}

// Features IDs Check Fucntion
export function checkFeatureIDAvailability(id) {
  let packageID = JSON.parse(localStorage.getItem("packageFeatureIDs"));
  if (Array.isArray(packageID)) {
    let getFeaturesIDs = packageID;
    return getFeaturesIDs.includes(Number(id));
  } else {
    return false;
  }
}

// this is use for api request data
export function getFormData(data, RequestMethodData) {
  let form = new FormData();
  form.append("RequestData", JSON.stringify(data));
  form.append("RequestMethod", RequestMethodData.RequestMethod);
  return form;
}

// this is for non active organisation check only
export function getLocalStorageItemNonActiveCheck(key) {
  const item = localStorage.getItem(key);
  return item !== null ? item : false;
}

// this is for non active organisation check only
export function clearLocalStorageAtloginresponce(dispatch, value, navigate) {
  if (value === 1) {
    localStorage.removeItem("SignupFlowPageRoute");
    localStorage.removeItem("LoginFlowPageRoute");
  } else if (value === 2) {
    localStorage.removeItem("SignupFlowPageRoute");
    localStorage.setItem("LoginFlowPageRoute", 1);
    navigate("/");
  } else if (value === 3) {
    // Set for Wrong Password
    dispatch(LoginFlowRoutes(2));
    localStorage.setItem("LoginFlowPageRoute", 2);

    // localStorage.removeItem("SignupFlowPageRoute");
  } else if (Number(value) === 4) {
    // for User is in Active and Account is Blocked
    dispatch(LoginFlowRoutes(1));
    localStorage.setItem("LoginFlowPageRoute", 1);
    navigate("/");
  }
}

//Clearing URL function
export const clearPaymentActionFromUrl = () => {
  const currentUrl = new URL(window.location.href);
  console.log(currentUrl, "currentUrlcurrentUrl");
  // Create the new URL without query parameters and hash
  const newUrl = currentUrl.origin + currentUrl.pathname;

  // Update the browser's URL without reloading the page
  window.history.replaceState({}, document.title, newUrl);
};

export const findAndSetConfigValue = (data, key) => {
  const foundObject = data.find((obj) => obj.configKey === key);
  return foundObject;
};
export const truncateText = (text, maxLength) => {
  console.log(
    text.length,
    maxLength,
    text.length > maxLength,
    "truncateTexttruncateText"
  );
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength - 3)}...`;
  }
  return text;
};

export const removeHTMLTags = (htmlString) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
};

export const removeHTMLTagsAndTruncate = (String, maxLength = 500) => {
  // Truncate the content to the specified length
  if (String.length > maxLength) {
    return String.substring(0, maxLength);
  }

  return String;
};

// utils/crypto.js
export const xorEncryptDecrypt = (input, key) => {
  let out = "";
  for (let i = 0; i < input.length; i++) {
    out += String.fromCharCode(
      input.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return out;
};

export const encrypt = (data, key) => {
  try {
    const encrypted = xorEncryptDecrypt(JSON.stringify(data), key);
    return btoa(encrypted); // base64 encode
  } catch (e) {
    console.log("Encrypt Error:", e);
    return null;
  }
};

export const decrypt = (data, key) => {
  try {
    const decoded = atob(data); // base64 decode
    return JSON.parse(xorEncryptDecrypt(decoded, key));
  } catch (e) {
    console.log("Decrypt Error:", e);
    return null;
  }
};

// Save Encrypted Data to localStorage
export const setData = (key, data) =>
  localStorage.setItem(key, encrypt(data, process.env.REACT_APP_SECERETKEY));

// Retrieve and Decrypt Data from localStorage
export const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? decrypt(data, process.env.REACT_APP_SECERETKEY) : null;
};

export const fileFormatforSignatureFlow = [
  // PDF Formats
  "pdf",
  "fdf",
  "xfdf",

  // Microsoft Office Formats
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "pub",

  // CAD Formats
  "dwg",
  "dxf",
  "dgn",
  "rvt",
  "dwf",

  // Document Formats
  "rtf",
  "odt",
  "ods",
  "odp",
  "wpf",

  // Image Formats
  "bmp",
  "wmf",
  "emf",
  "gif",
  "hdp",
  "jpg",
  "jp2",
  "jpc",
  "png",
  "tif",
  "tiff",
  "jpeg",

  // Web Formats
  "svg",
];

export const extractActionFromUrl = (url) => {
  const params = new URLSearchParams(url.split("?")[1]); // Extract query params
  let actionString = params.get("validateguest_action"); // Get 'validateguest_action' param

  if (actionString) {
    // Replace spaces with '+' to restore the original value
    actionString = actionString.replace(/ /g, "+");
    return decodeURIComponent(actionString.replace(/$/, "")); // Decode the value and remove trailing '='
  }

  return ""; // Return empty if no valid 'validateguest_action' is found
};

const NewfileFormatforSignatureFlow = [
  // PDF Formats
  "pdf",
  "fdf",
  "xfdf",

  // Microsoft Office Formats
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "pub",

  // CAD Formats
  "dwg",
  "dxf",
  "dgn",
  "rvt",
  "dwf",

  // Document Formats
  "rtf",
  "odt",
  "ods",
  "odp",
  "wpf",
  "txt",
  // Image Formats
  "bmp",
  "wmf",
  "emf",
  "gif",
  "hdp",
  "jpg",
  "jp2",
  "jpc",
  "png",
  "tif",
  "tiff",
  "jpeg",

  // Web Formats
  "svg",
];

export const openDocumentViewer = (
  ext,
  jsonData,
  dispatch,
  navigate,
  t,
  record
) => {
  if (NewfileFormatforSignatureFlow.includes(ext)) {
    window.open(
      `/Diskus/documentViewer?pdfData=${encodeURIComponent(jsonData)}`,
      "_blank",
      "noopener noreferrer"
    );
  } else if (validateExtensionsforHTMLPage(ext)) {
    let dataRoomData = {
      FileID: record.id,
    };
    dispatch(
      getAnnotationsOfDataroomAttachement(navigate, t, dataRoomData, true)
    );
  }
};

export const maxFileSize = 1.5 * 1024 * 1024 * 1024;

export const isFunction = (value) => {
  return typeof value === "function";
};

export const getActionValue = (url, key) => {
  return url.split(key)[1];
};

// Web Notification Export function
export const WebNotificationExportRoutFunc = (
  currentURL,
  dispatch,
  t,
  location,
  navigate,
  NotificationData,
  setViewFlag,
  setEditorRole,
  setViewAdvanceMeetingModal,
  setViewProposeDatePoll,
  setViewGroupPage,
  setShowModal,
  setVideoTalk,
  setAdvanceMeetingModalID,
  setResultresolution,
  isMeeting,
  setPolls
) => {
  console.log("webNotifactionDataRoutecheckFlag");
  console.log("webNotifactionDataRoutecheckFlag", NotificationData);
  localStorage.setItem("webNotifactionDataRoutecheckFlag", false);
  let PayLoadData = JSON.parse(NotificationData.payloadData);
  console.log("webNotifactionDataRoutecheckFlag", PayLoadData);
  if (NotificationData.notificationActionID === 1) {
    if (currentURL.includes("/Diskus/Meeting")) {
      //If you already on the Meeting Page
      if (PayLoadData.IsQuickMeeting === true) {
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(ViewMeeting(navigate, Data, t, setViewFlag, false, false, 6));
      } else {
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
            1
          )
        );
      }
    } else {
      //Notification For Meeting Updated And Published For Participant (Create Update Both scenarios are same A/c SRS)
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      } else {
        //Advance Meeting
        navigate("/Diskus/Meeting");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
            1
          )
        );
      }
    }
  } else if (NotificationData.notificationActionID === 2) {
    // Check if the current URL contains the target path
    if (currentURL.includes("/Diskus/Meeting")) {
      //If you already on the Meeting Page
      if (PayLoadData.IsQuickMeeting === true) {
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(ViewMeeting(navigate, Data, t, setViewFlag, false, false, 6));
      } else {
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal
          )
        );
      }
    } else {
      //Notification For Meeting Updated And Published For Participant (Create Update Both scenarios are same A/c SRS)
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      } else {
        navigate("/Diskus/Meeting");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(GetMeetingStatusDataAPI(navigate, t, Data, setEditorRole));
      }
    }
  } else if (NotificationData.notificationActionID === 3) {
    //If you already on the Meeting Page
    // Check if the current URL contains the target path
    if (currentURL.includes("/Diskus/Meeting")) {
      if (PayLoadData.IsQuickMeeting === true) {
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(ViewMeeting(navigate, Data, t, setViewFlag, false, false, 6));
      } else {
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
            1,
            setVideoTalk
          )
        );
      }
    } else {
      //Notification For Meeting Started For Participant (Create Update Started scenarios are same A/c SRS)
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem(
          "QuickMeetingCheckNotification",
          PayLoadData.IsQuickMeeting
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            false,
            false,
            1,
            setVideoTalk
          )
        );
      }
    }
  } else if (NotificationData.notificationActionID === 4) {
    if (currentURL.includes("/Diskus/Meeting")) {
      if (PayLoadData.IsQuickMeeting === true) {
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(ViewMeeting(navigate, Data, t, setViewFlag, false, false, 6));
      } else {
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal
          )
        );
      }
    } else {
      if (PayLoadData.IsQuickMeeting === true) {
        //Notification For Meeting Ended For Participant (Create Update Started scenarios are same A/c SRS)
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      } else {
        navigate("/Diskus/Meeting");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(GetMeetingStatusDataAPI(navigate, t, Data, setEditorRole));
      }
    }
  } else if (NotificationData.notificationActionID === 5) {
    if (currentURL.includes("/Diskus/Meeting")) {
      return; // Perform no action if the URL matches
    } else {
      //Notification if the Meeting is cancelled and is only applicable for Quick meet not advanced
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      }
    }
  } else if (NotificationData.notificationActionID === 6) {
    if (currentURL.includes("/Diskus/Meeting")) {
      return; // Perform no action if the URL matches
    } else {
      //Notification For being removed from  Meeting
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
      } else {
        navigate("/Diskus/Meeting");
      }
    }
  } else if (NotificationData.notificationActionID === 7) {
    if (currentURL.includes("/Diskus/Minutes")) {
      localStorage.setItem("MinutesOperations", true);
      localStorage.setItem(
        "NotificationClickMinutesMeetingID",
        PayLoadData.MeetingID
      );
      //Notification for being added as a minute reviewer
      let Data = {
        MeetingID: Number(PayLoadData.MeetingID),
      };
      dispatch(MinutesWorkFlowActorStatusNotificationAPI(Data, navigate, t));
    } else {
      //Notification for being added as a minute reviewer
      navigate("/Diskus/Minutes");

      localStorage.setItem("MinutesOperations", true);
      localStorage.setItem(
        "NotificationClickMinutesMeetingID",
        PayLoadData.MeetingID
      );
      //Notification for being added as a minute reviewer
      let Data = {
        MeetingID: Number(PayLoadData.MeetingID),
      };
      dispatch(MinutesWorkFlowActorStatusNotificationAPI(Data, navigate, t));
    }
  } else if (NotificationData.notificationActionID === 8) {
    if (currentURL.includes("/Diskus/Minutes")) {
      return; // Perform no action if the URL matches
    } else {
      //Notification for Being Removed As a reviwer in Minutes review
      navigate("/Diskus/Minutes");
    }
  } else if (NotificationData.notificationActionID === 9) {
    if (currentURL.includes("/Diskus/Meeting")) {
      if (PayLoadData.IsQuickMeeting === true) {
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(ViewMeeting(navigate, Data, t, setViewFlag, false, false, 6));
      } else {
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
            1
          )
        );
      }
    } else {
      //Notification For Added as An Participant
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
            1
          )
        );
      }
    }
  } else if (NotificationData.notificationActionID === 10) {
    if (currentURL.includes("/Diskus/Meeting")) {
      if (PayLoadData.IsQuickMeeting === true) {
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(ViewMeeting(navigate, Data, t, setViewFlag, false, false, 6));
      } else {
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
            1
          )
        );
      }
    } else {
      //Notification For Added as An Organizer
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
            1
          )
        );
      }
    }
  } else if (NotificationData.notificationActionID === 11) {
    if (currentURL.includes("/Diskus/Meeting")) {
      if (PayLoadData.IsQuickMeeting === true) {
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(ViewMeeting(navigate, Data, t, setViewFlag, false, false, 6));
      } else {
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        setAdvanceMeetingModalID(PayLoadData.MeetingID);
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
            1
          )
        );
      }
    } else {
      //Notification For Added as An Agenda Contributor
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        setAdvanceMeetingModalID(PayLoadData.MeetingID);
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
            1
          )
        );
      }
    }
  } else if (NotificationData.notificationActionID === 12) {
    //Notification for POlls Created from the Meeting
    if (currentURL.includes("/Diskus/Meeting")) {
      localStorage.setItem("AdvanceMeetingOperations", true);
      localStorage.setItem(
        "NotificationAdvanceMeetingID",
        PayLoadData.MeetingID
      );
      localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
      localStorage.setItem("NotificationClickPollID", PayLoadData.PollID);
      //set Local storage flag for identification for polls
      localStorage.setItem("viewadvanceMeetingPolls", true);
      setAdvanceMeetingModalID(PayLoadData.MeetingID);
      let Data = { MeetingID: Number(PayLoadData.MeetingID) };
      dispatch(
        GetMeetingStatusDataAPI(
          navigate,
          t,
          Data,
          setEditorRole,
          true,
          setViewAdvanceMeetingModal,
          1,
          setVideoTalk
        )
      );
    } else {
      navigate("/Diskus/Meeting");
      localStorage.setItem("NotificationClickPollID", PayLoadData.PollID);
      localStorage.setItem("AdvanceMeetingOperations", true);
      localStorage.setItem(
        "NotificationAdvanceMeetingID",
        PayLoadData.MeetingID
      );
      localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
      //set Local storage flag for identification for polls
      localStorage.setItem("viewadvanceMeetingPolls", true);
      setAdvanceMeetingModalID(PayLoadData.MeetingID);
      let Data = { MeetingID: Number(PayLoadData.MeetingID) };
      dispatch(
        GetMeetingStatusDataAPI(
          navigate,
          t,
          Data,
          setEditorRole,
          false,
          false,
          1,
          setVideoTalk
        )
      );
    }
  } else if (NotificationData.notificationActionID === 13) {
    if (currentURL.includes("/Diskus/Meeting")) {
      let Data = { MeetingID: Number(PayLoadData.MeetingID) };
      dispatch(GetMeetingStatusDataAPI(navigate, t, Data));
      localStorage.setItem("ProposedMeetingOperations", true);
      //Before Date Selection Check
      localStorage.setItem("BeforeProposedDateSelectedCheck", true);
      localStorage.setItem("NotificationClickMeetingID", PayLoadData.MeetingID);
      dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
      setViewProposeDatePoll(true);
      dispatch(proposedMeetingDatesGlobalFlag(true));
      dispatch(viewProposeDateMeetingPageFlag(true));
      dispatch(viewAdvanceMeetingPublishPageFlag(false));
    } else {
      let Data = { MeetingID: Number(PayLoadData.MeetingID) };
      dispatch(GetMeetingStatusDataAPI(navigate, t, Data));
      //Notification For Proposed Meeting Request
      navigate("/Diskus/Meeting");
      localStorage.setItem("ProposedMeetingOperations", true);
      //Before Date Selection Check
      localStorage.setItem("BeforeProposedDateSelectedCheck", true);
      localStorage.setItem("NotificationClickMeetingID", PayLoadData.MeetingID);
    }
  } else if (NotificationData.notificationActionID === 14) {
    if (currentURL.includes("/Diskus/Meeting")) {
      localStorage.setItem("ProposedMeetingOperations", true);
      localStorage.setItem("NotificationClickMeetingID", PayLoadData.MeetingID);
      //Here i will apply that if polls are not expired i will redirect it to the voting page
      // Get the current date in "YYYYMMDD" format
      const currentDate = new Date();
      const formattedCurrentDate = `${currentDate.getFullYear()}${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}${String(currentDate.getDate()).padStart(2, "0")}`;

      // Compare stored date with the current date
      if (PayLoadData.DeadlineDate <= formattedCurrentDate) {
        dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
        setViewProposeDatePoll(true);
        dispatch(proposedMeetingDatesGlobalFlag(true));
        dispatch(viewProposeDateMeetingPageFlag(true));
        dispatch(viewAdvanceMeetingPublishPageFlag(false));
      } else {
        //Other wise Move to Proposed meeting listing page
        dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
        setViewProposeDatePoll(false);
        dispatch(proposedMeetingDatesGlobalFlag(false));
        dispatch(viewProposeDateMeetingPageFlag(false));
        //here After Navigating if the polls has been expired remove the date of the Proposed meeting from Local storage
        localStorage.removeItem(
          "ProposedMeetOperationsDateSelectedSendResponseByDate"
        );
      }
    } else {
      //Notification When slot is selected by the participant. date wala kam bh yahe ho ga
      navigate("/Diskus/Meeting");
      localStorage.setItem("ProposedMeetingOperations", true);
      localStorage.setItem("NotificationClickMeetingID", PayLoadData.MeetingID);
      localStorage.setItem(
        "ProposedMeetOperationsDateSelectedSendResponseByDate",
        PayLoadData.DeadlineDate
      );
    }
  } else if (NotificationData.notificationActionID === 15) {
    //Notification that Proposed Meeting Date Organizer work
    if (currentURL.includes("/Diskus/Meeting")) {
      localStorage.setItem("ProposedMeetingOrganizer", true);
      localStorage.setItem(
        "ProposedMeetingOrganizerMeetingID",
        PayLoadData.MeetingID
      );
      let Data = { MeetingID: Number(PayLoadData.MeetingID) };
      dispatch(
        GetMeetingStatusDataAPI(
          navigate,
          t,
          Data,
          setEditorRole,
          false,
          false,
          2,
          setVideoTalk
        )
      );
    } else {
      //Call Status API to see what is the status of the meeting eighter proposed or published
      navigate("/Diskus/Meeting");
      localStorage.setItem("ProposedMeetingOrganizer", true);
      localStorage.setItem(
        "ProposedMeetingOrganizerMeetingID",
        PayLoadData.MeetingID
      );
      let Data = { MeetingID: Number(PayLoadData.MeetingID) };
      dispatch(GetMeetingStatusDataAPI(navigate, t, Data));
    }
  } else if (NotificationData.notificationActionID === 16) {
    if (currentURL.includes("/Diskus/groups")) {
      localStorage.setItem("NotificationClickAddedIntoGroup", true);
      localStorage.setItem("NotifcationClickViewGroupID", PayLoadData.GroupID);
      // For Notification Added in the Group
      setViewGroupPage(true);
      dispatch(viewGroupPageFlag(true));
    } else {
      //Notificaiton For Added in Group
      navigate("/Diskus/groups");
      //open ViewMode Modal Also in this
      localStorage.setItem("NotificationClickAddedIntoGroup", true);
      localStorage.setItem("NotifcationClickViewGroupID", PayLoadData.GroupID);
    }
  } else if (NotificationData.notificationActionID === 17) {
    if (currentURL.includes("/Diskus/groups")) {
      return; // Perform no action if the URL matches
    } else {
      //Notificaiton For Removed From Group
      navigate("/Diskus/groups");
    }
  } else if (NotificationData.notificationActionID === 18) {
    if (currentURL.includes("/Diskus/groups")) {
      localStorage.setItem("NotificationClickArchivedGroup", true);
      setShowModal(true);
    } else {
      //Notificaiton For Groups Archived
      navigate("/Diskus/groups");
      //open Archinved Modal Also in this
      localStorage.setItem("NotificationClickArchivedGroup", true);
    }
  } else if (NotificationData.notificationActionID === 19) {
    if (currentURL.includes("/Diskus/groups")) {
      localStorage.setItem("NotificationClickAddedIntoGroup", true);
      localStorage.setItem("NotifcationClickViewGroupID", PayLoadData.GroupID);
      // For Notification Added in the Group
      setViewGroupPage(true);
      dispatch(viewGroupPageFlag(true));
    } else {
      //Notificaiton For Groups InActivated
      navigate("/Diskus/groups");
      //using the same logic here Srs say it will function same as Notificaiton ID 16 (Added in Group)
      localStorage.setItem("NotificationClickAddedIntoGroup", true);
      localStorage.setItem("NotifcationClickViewGroupID", PayLoadData.GroupID);
    }
  } else if (NotificationData.notificationActionID === 20) {
    if (currentURL.includes("/Diskus/groups")) {
      localStorage.setItem("NotificationClickAddedIntoGroup", true);
      localStorage.setItem("NotifcationClickViewGroupID", PayLoadData.GroupID);
      // For Notification Added in the Group
      setViewGroupPage(true);
      dispatch(viewGroupPageFlag(true));
    } else {
      //Notificaiton For Groups Activated
      navigate("/Diskus/groups");
      //using the same logic here Srs say it will function same as Notificaiton ID 16 (Added in Group)
      localStorage.setItem("NotificationClickAddedIntoGroup", true);
      localStorage.setItem("NotifcationClickViewGroupID", PayLoadData.GroupID);
    }
  } else if (NotificationData.notificationActionID === 21) {
    if (currentURL.includes("/Diskus/committee")) {
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID
      );
      setViewGroupPage(true);
      dispatch(viewCommitteePageFlag(true));
    } else {
      //Notification for being Added in the Committee
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID
      );
    }
  } else if (NotificationData.notificationActionID === 22) {
    if (currentURL.includes("/Diskus/committee")) {
      return; // Perform no action if the URL matches
    } else {
      //Notificaiton For Removed From Committee
      navigate("/Diskus/committee");
    }
  } else if (NotificationData.notificationActionID === 23) {
    if (currentURL.includes("/Diskus/committee")) {
      localStorage.setItem("NotificationClickCommitteeArchived", true);
      setShowModal(true);
    } else {
      //Notificaiton For  Committee Archived
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeArchived", true);
    }
  } else if (NotificationData.notificationActionID === 24) {
    if (currentURL.includes("/Diskus/committee")) {
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID
      );
      setViewGroupPage(true);
      dispatch(viewCommitteePageFlag(true));
    } else {
      //Notificaiton For Committee InActive
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID
      );
    }
  } else if (NotificationData.notificationActionID === 25) {
    if (currentURL.includes("/Diskus/committee")) {
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID
      );
      setViewGroupPage(true);
      dispatch(viewCommitteePageFlag(true));
    } else {
      //Notificaiton For Committee Active using the same above 24 logic as the operation End result is same
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID
      );
    }
  } else if (NotificationData.notificationActionID === 26) {
    if (currentURL.includes("/Diskus/resolution")) {
      localStorage.setItem("ResolutionAccessDenied", true);
      dispatch(
        getResolutionbyResolutionID(
          navigate,
          Number(PayLoadData.ResolutionID),
          t,
          2
        )
      );
    } else {
      //Notification for Added as Voter in the resolution
      navigate("/Diskus/resolution");
      localStorage.setItem("ResolutionAccessDenied", true);
      dispatch(
        getResolutionbyResolutionID(
          navigate,
          Number(PayLoadData.ResolutionID),
          t,
          2
        )
      );
    }
  } else if (NotificationData.notificationActionID === 27) {
    if (currentURL.includes("/Diskus/resolution")) {
      localStorage.setItem("ResolutionAccessDenied", true);
      dispatch(
        getResolutionbyResolutionID(
          navigate,
          Number(PayLoadData.ResolutionID),
          t,
          2
        )
      );
    } else {
      //Notification for Added as Non-Voter in the resolution
      navigate("/Diskus/resolution");
      localStorage.setItem("ResolutionAccessDenied", true);
      dispatch(
        getResolutionbyResolutionID(
          navigate,
          Number(PayLoadData.ResolutionID),
          t,
          2
        )
      );
    }
  } else if (NotificationData.notificationActionID === 28) {
    //Resolution Descision Announced
    if (currentURL.includes("/Diskus/resolution")) {
      return; // Perform no action if the URL matches
    } else {
      //Notification for Added as Voter in the resolution
      navigate("/Diskus/resolution");
      localStorage.setItem("ResolutionDecisionDateAnnounced", true);
    }
  } else if (NotificationData.notificationActionID === 29) {
    if (currentURL.includes("/Diskus/polling")) {
      let userID = localStorage.getItem("userID");
      let data = {
        PollID: Number(PayLoadData.PollID),
        UserID: parseInt(userID),
      };
      dispatch(getPollsByPollIdApi(navigate, data, 3, t));
    } else {
      //Notification for Poll has been Created submit your response
      navigate("/Diskus/polling");
      let userID = localStorage.getItem("userID");
      let data = {
        PollID: Number(PayLoadData.PollID),
        UserID: parseInt(userID),
      };
      dispatch(getPollsByPollIdApi(navigate, data, 3, t));
    }
  } else if (NotificationData.notificationActionID === 30) {
    if (currentURL.includes("/Diskus/polling")) {
      return; // Perform no action if the URL matches
    } else {
      //Notification for Poll has been Updated submit your response
      navigate("/Diskus/polling");
    }
  } else if (NotificationData.notificationActionID === 31) {
  } else if (NotificationData.notificationActionID === 32) {
  } else if (NotificationData.notificationActionID === 33) {
    if (
      location.pathname.toLowerCase().includes("/Diskus/dataroom".toLowerCase())
    ) {
      // Api Call For Extracting the Permission ID
      let Data = {
        FileFolderID: Number(PayLoadData.FileID),
        IsFolder: false,
      };
      dispatch(
        DataRoomFileSharingPermissionAPI(
          navigate,
          t,
          Data,
          Number(PayLoadData.FileID),
          PayLoadData.FileName
        )
      );
    } else {
      //Notification For Being File shared to you as viewer
      // Api Call For Extracting the Permission ID
      let Data = {
        FileFolderID: Number(PayLoadData.FileID),
        IsFolder: false,
      };
      dispatch(
        DataRoomFileSharingPermissionAPI(
          navigate,
          t,
          Data,
          Number(PayLoadData.FileID),
          PayLoadData.FileName
        )
      );
    }
  } else if (NotificationData.notificationActionID === 34) {
    if (
      location.pathname.toLowerCase().includes("/Diskus/dataroom".toLowerCase())
    ) {
      let Data = {
        FileFolderID: Number(PayLoadData.FileID),
        IsFolder: false,
      };
      dispatch(
        DataRoomFileSharingPermissionAPI(
          navigate,
          t,
          Data,
          Number(PayLoadData.FileID),
          PayLoadData.FileName
        )
      );
    } else {
      //Notification For Being File shared to you as Editor
      let Data = {
        FileFolderID: Number(PayLoadData.FileID),
        IsFolder: false,
      };
      dispatch(
        DataRoomFileSharingPermissionAPI(
          navigate,
          t,
          Data,
          Number(PayLoadData.FileID),
          PayLoadData.FileName
        )
      );
    }
  } else if (NotificationData.notificationActionID === 35) {
    if (
      location.pathname.toLowerCase().includes("/Diskus/dataroom".toLowerCase())
    ) {
      dispatch(
        getFolderDocumentsApi(navigate, Number(PayLoadData.FolderID), t)
      );
    } else {
      //Notification for sharing folder as a viewer
      navigate("/Diskus/dataroom");
      localStorage.setItem("DataRoomOperationsForFolderViewerRights", true);
      localStorage.setItem("NotificationClickFolderID", PayLoadData.FolderID);
    }
  } else if (NotificationData.notificationActionID === 36) {
    if (
      location.pathname.toLowerCase().includes("/Diskus/dataroom".toLowerCase())
    ) {
      dispatch(
        getFolderDocumentsApi(navigate, Number(PayLoadData.FolderID), t)
      );
    } else {
      //Notification for sharing folder as a Editor
      navigate("/Diskus/dataroom");
      localStorage.setItem("DataRoomOperationsForFolderViewerRights", true);
      localStorage.setItem("NotificationClickFolderID", PayLoadData.FolderID);
    }
  } else if (NotificationData.notificationActionID === 37) {
    if (currentURL.includes("/Diskus/dataroom")) {
      return; // Perform no action if the URL matches
    } else {
      // Notification For Deleted a Folder as Editor
      navigate("/Diskus/dataroom");
    }
  } else if (NotificationData.notificationActionID === 38) {
    if (currentURL.includes("/Diskus/dataroom")) {
      return; // Perform no action if the URL matches
    } else {
      // Notification For Deleted a File as Editor
      navigate("/Diskus/dataroom");
    }
  } else if (NotificationData.notificationActionID === 39) {
    if (currentURL.includes("/Diskus/dataroom")) {
      return; // Perform no action if the URL matches
    } else {
      // Notification For Deleted a Folder as viewer
      navigate("/Diskus/dataroom");
    }
  } else if (NotificationData.notificationActionID === 40) {
    if (currentURL.includes("/Diskus/dataroom")) {
      return; // Perform no action if the URL matches
    } else {
      // Notification For Deleted a file as viewer
      navigate("/Diskus/dataroom");
    }
  } else if (NotificationData.notificationActionID === 41) {
    if (currentURL.includes("/Diskus/Minutes")) {
      localStorage.setItem("MinutesOperations", true);
      localStorage.setItem(
        "NotificationClickMinutesMeetingID",
        PayLoadData.MeetingID
      );
      //Notification for being added as a minute reviewer
      let Data = {
        MeetingID: Number(PayLoadData.MeetingID),
      };
      dispatch(MinutesWorkFlowActorStatusNotificationAPI(Data, navigate, t));
    } else {
      //Notification for being added as a minute reviewer
      navigate("/Diskus/Minutes");

      localStorage.setItem("MinutesOperations", true);
      localStorage.setItem(
        "NotificationClickMinutesMeetingID",
        PayLoadData.MeetingID
      );
      //Notification for being added as a minute reviewer
      let Data = {
        MeetingID: Number(PayLoadData.MeetingID),
      };
      dispatch(MinutesWorkFlowActorStatusNotificationAPI(Data, navigate, t));
    }
  } else if (NotificationData.notificationActionID === 42) {
    //if the Users role has been changed in the Groups
    if (currentURL.includes("/Diskus/groups")) {
      localStorage.setItem("NotificationClickAddedIntoGroup", true);
      localStorage.setItem("NotifcationClickViewGroupID", PayLoadData.GroupID);
      // For Notification Added in the Group
      setViewGroupPage(true);
      dispatch(viewGroupPageFlag(true));
    } else {
      //Notificaiton For Added in Group
      navigate("/Diskus/groups");
      //open ViewMode Modal Also in this
      localStorage.setItem("NotificationClickAddedIntoGroup", true);
      localStorage.setItem("NotifcationClickViewGroupID", PayLoadData.GroupID);
    }
  } else if (NotificationData.notificationActionID === 43) {
    //if the user role has been changed in the committee
    if (currentURL.includes("/Diskus/committee")) {
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID
      );
      setViewGroupPage(true);
      dispatch(viewCommitteePageFlag(true));
    } else {
      //Notification for being Added in the Committee
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID
      );
    }
  } else if (NotificationData.notificationActionID === 44) {
    // if the resolution has been deleted
    navigate("/Diskus/resolution");
  } else if (NotificationData.notificationActionID === 45) {
    // if the poll has been deleted
    navigate("/Diskus/polling");
  } else if (NotificationData.notificationActionID === 46) {
    //For Voter Voted on His POll
    if (isMeeting && setPolls) {
      return;
    } else {
      if (currentURL.includes("/Diskus/Meeting")) {
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        localStorage.setItem("NotificationClickPollID", PayLoadData.PollID);
        //set Local storage flag for identification for polls
        localStorage.setItem("viewadvanceMeetingPolls", true);
        setAdvanceMeetingModalID(PayLoadData.MeetingID);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
            1,
            setVideoTalk
          )
        );
      } else {
        navigate("/Diskus/Meeting");
        localStorage.setItem("NotificationClickPollID", PayLoadData.PollID);
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        //set Local storage flag for identification for polls
        localStorage.setItem("viewadvanceMeetingPolls", true);
        setAdvanceMeetingModalID(PayLoadData.MeetingID);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            false,
            false,
            1,
            setVideoTalk
          )
        );
      }
    }
  } else if (NotificationData.notificationActionID === 47) {
    //For participant has Give Vote on a Poll inside advance meeting
    if (isMeeting && setPolls) {
      return;
    } else {
      if (currentURL.includes("/Diskus/Meeting")) {
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        localStorage.setItem("NotificationClickPollID", PayLoadData.PollID);
        //set Local storage flag for identification for polls
        localStorage.setItem("viewadvanceMeetingPolls", true);
        setAdvanceMeetingModalID(PayLoadData.MeetingID);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
            1,
            setVideoTalk
          )
        );
      } else {
        navigate("/Diskus/Meeting");
        localStorage.setItem("NotificationClickPollID", PayLoadData.PollID);
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID
        );
        localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
        //set Local storage flag for identification for polls
        localStorage.setItem("viewadvanceMeetingPolls", true);
        setAdvanceMeetingModalID(PayLoadData.MeetingID);
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            false,
            false,
            1,
            setVideoTalk
          )
        );
      }
    }
  } else if (NotificationData.notificationActionID === 48) {
    //Send Response Date Has been Passed

    //Notification that Proposed Meeting Date Organizer work
    if (currentURL.includes("/Diskus/Meeting")) {
      localStorage.setItem("ProposedMeetingOrganizer", true);
      localStorage.setItem(
        "ProposedMeetingOrganizerMeetingID",
        PayLoadData.MeetingID
      );
      let Data = { MeetingID: Number(PayLoadData.MeetingID) };
      dispatch(
        GetMeetingStatusDataAPI(
          navigate,
          t,
          Data,
          setEditorRole,
          false,
          false,
          2,
          setVideoTalk
        )
      );
    } else {
      //Call Status API to see what is the status of the meeting eighter proposed or published
      navigate("/Diskus/Meeting");
      localStorage.setItem("ProposedMeetingOrganizer", true);
      localStorage.setItem(
        "ProposedMeetingOrganizerMeetingID",
        PayLoadData.MeetingID
      );
      let Data = { MeetingID: Number(PayLoadData.MeetingID) };
      dispatch(GetMeetingStatusDataAPI(navigate, t, Data));
    }
  } else if (NotificationData.notificationActionID === 49) {
    //Assigned You a Task in the Meeting
    if (currentURL.includes("/Diskus/Meeting")) {
      localStorage.setItem("AdvanceMeetingOperations", true);
      localStorage.setItem(
        "NotificationAdvanceMeetingID",
        PayLoadData.MeetingID
      );
      localStorage.setItem("viewadvanceMeetingTask", true);
      localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
      localStorage.setItem("NotificationClickTaskID", PayLoadData.TaskID);
      setAdvanceMeetingModalID(PayLoadData.MeetingID);
      let Data = { MeetingID: Number(PayLoadData.MeetingID) };
      dispatch(
        GetMeetingStatusDataAPI(
          navigate,
          t,
          Data,
          setEditorRole,
          true,
          setViewAdvanceMeetingModal,
          1,
          setVideoTalk
        )
      );
    } else {
      navigate("/Diskus/Meeting");
      localStorage.setItem("AdvanceMeetingOperations", true);
      localStorage.setItem(
        "NotificationAdvanceMeetingID",
        PayLoadData.MeetingID
      );
      localStorage.setItem("viewadvanceMeetingTask", true);
      localStorage.setItem("meetingTitle", PayLoadData.MeetingTitle);
      localStorage.setItem("NotificationClickTaskID", PayLoadData.TaskID);
      setAdvanceMeetingModalID(PayLoadData.MeetingID);
      let Data = { MeetingID: Number(PayLoadData.MeetingID) };
      dispatch(
        GetMeetingStatusDataAPI(
          navigate,
          t,
          Data,
          setEditorRole,
          false,
          false,
          1,
          setVideoTalk
        )
      );
    }
  } else if (NotificationData.notificationActionID === 50) {
    // Voter Changes His Vote
    if (currentURL.includes("/Diskus/resolution")) {
      dispatch(
        getResolutionResult(
          navigate,
          Number(PayLoadData.Resolution_ID),
          t,
          setResultresolution
        )
      );
    } else {
      //Notification for Added as Voter in the resolution
      navigate("/Diskus/resolution");
      dispatch(
        getResolutionResult(
          navigate,
          Number(PayLoadData.Resolution_ID),
          t,
          setResultresolution
        )
      );
    }
  } else {
  }
};

export const generateRandomNegativeAuto = () => {
  // Define default range for negative numbers
  const min = -1000; // More negative
  const max = -10; // Closer to zero

  // Generate a random negative integer in the range [min, max]
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateRandomPositiveId = () => {
  // Define the range for positive IDs
  const min = 1; // Smallest positive ID
  const max = 1000; // Largest positive ID

  // Generate a random positive integer in the range [min, max]
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const handleNavigation = (
  navigate,
  isFirstLogin,
  // userRights,
  // adminRights,
  dispatch
) => {
  const RSVP = localStorage.getItem("RSVP");
  const dataroomValue = localStorage.getItem("DataRoomEmail");
  const AgCont = localStorage.getItem("AgCont");
  const AdOrg = localStorage.getItem("AdOrg");
  const MeetingStr = localStorage.getItem("meetingStr");
  const MeetinUpd = localStorage.getItem("meetingUpd");
  const MeetingMin = localStorage.getItem("meetingMin");
  const Meetingprop = localStorage.getItem("meetingprop");
  const meetingCanc = localStorage.getItem("meetingCanc");
  const mtAgUpdate = localStorage.getItem("mtAgUpdate");
  const UserMeetPropoDatPoll = localStorage.getItem("UserMeetPropoDatPoll");
  const pollExpire = localStorage.getItem("pollExpire");
  const PollUpd = localStorage.getItem("poUpda");
  const PollPublish = localStorage.getItem("poPub");
  const documentViewer = localStorage.getItem("documentViewer");
  const viewFolderLink = localStorage.getItem("viewFolderLink");
  const committeeView_Id = localStorage.getItem("committeeView_Id");
  const committeeList = localStorage.getItem("committeeList");
  const groupView_Id = localStorage.getItem("groupView_Id");
  const groupList = localStorage.getItem("groupList");
  const taskListView_Id = localStorage.getItem("taskListView_Id");
  const taskListView = localStorage.getItem("taskListView");
  const reviewSubmittedMinutesLink = localStorage.getItem(
    "reviewSubmittedMinutesLink"
  );
  const reviewMinutesLink = localStorage.getItem("reviewMinutesLink");
  const viewPublishMinutesLink = localStorage.getItem("viewPublishMinutesLink");
  const viewMeetingLink = localStorage.getItem("viewMeetingLink");
  const docSignAction = localStorage.getItem("docSignAction");
  const docSignedAction = localStorage.getItem("docSignedAction");
  const docSignedCrAction = localStorage.getItem("docSignedCrAction");
  if (isFirstLogin) {
    // if (adminRights) {
    //   navigate("/Admin/ManageUsers");
    // } else if (userRights) {
    navigate("/onboard");
    // }
  } else if (!isFirstLogin) {
    // if (adminRights) {
    //   navigate("/Admin/ManageUsers");
    // } else if (userRights) {
    if (RSVP !== null) {
      navigate("/Diskus/Meeting/Useravailabilityformeeting");
    } else if (
      dataroomValue !== null ||
      documentViewer !== null ||
      viewFolderLink !== null ||
      docSignedCrAction !== null
    ) {
      navigate("/Diskus/dataroom");
    } else if (
      MeetingStr !== null ||
      MeetinUpd !== null ||
      MeetingMin !== null ||
      Meetingprop !== null ||
      AgCont !== null ||
      AdOrg !== null ||
      mtAgUpdate !== null ||
      UserMeetPropoDatPoll !== null ||
      meetingCanc !== null ||
      reviewSubmittedMinutesLink !== null ||
      viewPublishMinutesLink !== null ||
      viewMeetingLink !== null
    ) {
      navigate("/Diskus/Meeting");
    } else if (
      PollPublish !== null ||
      PollUpd !== null ||
      pollExpire !== null
    ) {
      navigate("/Diskus/polling");
    } else if (committeeView_Id !== null || committeeList !== null) {
      navigate("/Diskus/committee");
    } else if (groupView_Id !== null || groupList !== null) {
      navigate("/Diskus/groups");
    } else if (taskListView_Id !== null || taskListView !== null) {
      navigate("/Diskus/todolist");
    } else if (
      reviewMinutesLink !== null ||
      docSignAction !== null ||
      docSignedAction !== null
    ) {
      navigate("/Diskus/Minutes");
    } else {
      navigate("/Diskus/");
    }
    // }
  } else {
    // dispatch(enterPasswordFail(t("User-not-authorised-contact-admin")));
    clearLocalStorageAtloginresponce(dispatch, 2, navigate);
    dispatch(LoginFlowRoutes(1));
  }
};

export const getFileName = (fileName) => {
  return fileName.split(".")[0];
};

//Side Bar Functions Clicks Global Function
export const SideBarGlobalNavigationFunction = async (
  viewAdvanceMeetingModal,
  editorRole,
  minutes,
  actionsPage,
  polls,
  navigate,
  dispatch,
  setCancelConfirmationModal,
  setViewAdvanceMeetingModal,
  navigateValue,
  t,
  sceduleMeeting,
  setSceduleMeeting,
  setGoBackCancelModal
) => {
  let userID = localStorage.getItem("userID");
  let currentView = localStorage.getItem("MeetingCurrentView");
  console.log(
    { viewAdvanceMeetingModal, sceduleMeeting, editorRole, currentView },
    "Checking"
  );
  if (viewAdvanceMeetingModal) {
    console.log("Checking");
    console.log(Number(editorRole?.status) === 10, "Checking");
    if (Number(editorRole?.status) === 10) {
      console.log("Checking");

      dispatch(showEndMeetingModal(true));
    } else if (minutes || actionsPage || polls) {
      console.log("Checking");
      if (Number(editorRole.status) === 9 && polls) {
        setViewAdvanceMeetingModal(false);
        let searchData = {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber: 1,
          Length: 30,
          PublishedMeetings:
            currentView && Number(currentView) === 1 ? true : false,
        };
        localStorage.setItem("MeetingPageRows", 30);
        localStorage.setItem("MeetingPageCurrent", 1);
        console.log("chek search meeting");
        await dispatch(searchNewUserMeeting(navigate, searchData, t));
      } else {
        setCancelConfirmationModal(true);
      }
    } else {
      console.log("Checking");
      setViewAdvanceMeetingModal(false);
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber: 1,
        Length: 30,
        PublishedMeetings:
          currentView && Number(currentView) === 1 ? true : false,
      };
      localStorage.setItem("MeetingPageRows", 30);
      localStorage.setItem("MeetingPageCurrent", 1);
      console.log("chek search meeting");
      await dispatch(searchNewUserMeeting(navigate, searchData, t));
      localStorage.removeItem("NotificationAdvanceMeetingID");
      localStorage.removeItem("QuickMeetingCheckNotification");
      localStorage.removeItem("viewadvanceMeetingPolls");
      localStorage.removeItem("NotificationClickPollID");
      localStorage.removeItem("AdvanceMeetingOperations");
      localStorage.removeItem("NotificationClickTaskID");
      localStorage.removeItem("viewadvanceMeetingTask");
    }
  } else if (sceduleMeeting) {
    setGoBackCancelModal(true);
  } else {
    console.log("Checking");
    navigate(navigateValue);
  }
};

// Sorting function
export const sortTasksByDeadline = (tasks) => {
  return tasks.sort((taskA, taskB) => {
    const deadlineA = taskA?.deadlineDateTime;
    const deadlineB = taskB?.deadlineDateTime;
    return parseInt(deadlineA, 10) - parseInt(deadlineB, 10);
  });
};

//Whole Navigating scenairo convered for particpant joined video

// navigationUtils.js

// Common function to check if any meeting page flag is active
export const isAnyMeetingPageActive = async (flags) => {
  const {
    scheduleMeetingPageFlag,
    viewProposeDateMeetingPageFlag,
    viewAdvanceMeetingPublishPageFlag,
    viewAdvanceMeetingUnpublishPageFlag,
    viewProposeOrganizerMeetingPageFlag,
    proposeNewMeetingPageFlag,
    viewMeetingFlag,
  } = flags;

  return (
    (((await isFunction(scheduleMeetingPageFlag)) &&
      scheduleMeetingPageFlag === true) ||
      ((await isFunction(viewProposeDateMeetingPageFlag)) &&
        viewProposeDateMeetingPageFlag === true) ||
      ((await isFunction(viewAdvanceMeetingPublishPageFlag)) &&
        viewAdvanceMeetingPublishPageFlag === true) ||
      ((await isFunction(viewAdvanceMeetingUnpublishPageFlag)) &&
        viewAdvanceMeetingUnpublishPageFlag === true) ||
      ((await isFunction(viewProposeOrganizerMeetingPageFlag)) &&
        viewProposeOrganizerMeetingPageFlag === true) ||
      ((await isFunction(proposeNewMeetingPageFlag)) &&
        proposeNewMeetingPageFlag === true)) &&
    (await isFunction(viewMeetingFlag)) &&
    viewMeetingFlag === false
  );
};

// Common function to handle meeting navigation
export const handleMeetingNavigation = (navigate, dispatch) => {
  navigate("/Diskus/Meeting");
  const isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  const isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));

  if (isMeeting && !isMeetingVideo) {
    dispatch(showCancelModalmeetingDeitals(true));
  }
  dispatch(uploadGlobalFlag(false));
};

// Common function to reset all meeting flags
export const resetMeetingFlags = (dispatch) => {
  dispatch(showCancelModalmeetingDeitals(false));
  dispatch(scheduleMeetingPageFlag(false));
  dispatch(viewProposeDateMeetingPageFlag(false));
  dispatch(viewAdvanceMeetingPublishPageFlag(false));
  dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
  dispatch(viewProposeOrganizerMeetingPageFlag(false));
  dispatch(proposeNewMeetingPageFlag(false));
  dispatch(viewMeetingFlag(false));
};

// Function to handle specific navigation cases
export const handleNavigationforParticipantVideoFlow = async ({
  NavigationLocation,
  navigate,
  dispatch,
  location,
  flags,
  t,
}) => {
  const meetingFlags = {
    scheduleMeetingPageFlag:
      flags.scheduleMeetingPageFlagReducer || flags.scheduleMeetingsPageFlag,
    viewProposeDateMeetingPageFlag:
      flags.viewProposeDateMeetingPageFlagReducer ||
      flags.viewProposeDateMeetingsPageFlag,
    viewAdvanceMeetingPublishPageFlag:
      flags.viewAdvanceMeetingPublishPageFlagReducer ||
      flags.viewAdvanceMeetingsPublishPageFlag,
    viewAdvanceMeetingUnpublishPageFlag:
      flags.viewAdvanceMeetingUnpublishPageFlagReducer ||
      flags.viewAdvanceMeetingsUnpublishPageFlag,
    viewProposeOrganizerMeetingPageFlag:
      flags.viewProposeOrganizerMeetingPageFlagReducer ||
      flags.viewProposeOrganizerMeetingsPageFlag,
    proposeNewMeetingPageFlag:
      flags.proposeNewMeetingPageFlagReducer ||
      flags.proposeNewMeetingsPageFlag,
    viewMeetingFlag: flags.viewMeetingFlagReducer || flags.viewMeetingsFlag,
  };

  const shouldNavigateToMeeting = await isAnyMeetingPageActive(meetingFlags);

  try {
    if (shouldNavigateToMeeting) {
      handleMeetingNavigation(navigate, dispatch);
      return;
    }

    switch (NavigationLocation) {
      case "dataroom":
        navigate("/Diskus/dataroom");
        resetMeetingFlags(dispatch);
        break;

      case "resolution":
        navigate("/Diskus/resolution");
        resetMeetingFlags(dispatch);
        dispatch(resultResolutionFlag(false));
        dispatch(voteResolutionFlag(false));
        dispatch(viewAttachmentFlag(false));
        dispatch(createResolutionModal(false));
        dispatch(viewResolutionModal(false));
        break;

      case "committee":
        navigate("/Diskus/committee");
        resetMeetingFlags(dispatch);
        dispatch(createCommitteePageFlag(false));
        dispatch(updateCommitteePageFlag(false));
        dispatch(viewCommitteePageFlag(false));
        break;

      case "Meeting":
        handleMeetingCase(navigate, dispatch, t);
        break;

      case "groups":
        navigate("/Diskus/groups");
        resetMeetingFlags(dispatch);
        dispatch(createGroupPageFlag(false));
        dispatch(updateGroupPageFlag(false));
        dispatch(viewGroupPageFlag(false));
        break;

      case "todolist":
        navigate("/Diskus/todolist");
        resetMeetingFlags(dispatch);
        break;

      case "calendar":
        navigate("/Diskus/calendar");
        resetMeetingFlags(dispatch);
        break;

      case "Notes":
        navigate("/Diskus/Notes");
        resetMeetingFlags(dispatch);
        break;

      case "polling":
        navigate("/Diskus/polling");
        resetMeetingFlags(dispatch);
        break;

      case "home":
        if (!location.pathname.includes("/Admin")) {
          navigate("/Diskus/");
          resetMeetingFlags(dispatch);
        }
        break;

      case "dataroomRecentAddedFiles":
        localStorage.setItem("setTableView", 4);
        navigate("/Diskus/dataroom");
        resetMeetingFlags(dispatch);
        break;

      case "setting":
        if (!location.pathname.includes("/Admin")) {
          navigate("/Diskus/setting");
          resetMeetingFlags(dispatch);
        }
        break;

      case "Minutes":
        if (!location.pathname.includes("/Admin")) {
          navigate("/Diskus/Minutes");
          resetMeetingFlags(dispatch);
        }
        break;

      case "faq's":
        if (!location.pathname.includes("/Admin")) {
          navigate("/Diskus/faq's");
          resetMeetingFlags(dispatch);
        }
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error, "Navigation error");
  }
};

// Special handling for Meeting case
const handleMeetingCase = (navigate, dispatch, t) => {
  const currentView = localStorage.getItem("MeetingCurrentView");
  const meetingpageRow = localStorage.getItem("MeetingPageRows");
  const meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  const userID = localStorage.getItem("userID");

  if (meetingpageRow !== null && meetingPageCurrent !== null) {
    const searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: Number(meetingPageCurrent),
      Length: Number(meetingpageRow),
      PublishedMeetings: Number(currentView) === 1 ? true : false,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
  } else {
    const searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 50,
      PublishedMeetings: Number(currentView) === 1 ? true : false,
    };
    localStorage.setItem("MeetingPageRows", 30);
    localStorage.setItem("MeetingPageCurrent", 1);
    dispatch(searchNewUserMeeting(navigate, searchData, t));
  }

  dispatch(viewMeetingFlag(false));
  dispatch(meetingDetailsGlobalFlag(false));
  dispatch(organizersGlobalFlag(false));
  dispatch(agendaContributorsGlobalFlag(false));
  dispatch(participantsGlobalFlag(false));
  dispatch(agendaGlobalFlag(false));
  dispatch(meetingMaterialGlobalFlag(false));
  dispatch(minutesGlobalFlag(false));
  dispatch(proposedMeetingDatesGlobalFlag(false));
  dispatch(actionsGlobalFlag(false));
  dispatch(pollsGlobalFlag(false));
  dispatch(attendanceGlobalFlag(false));
  dispatch(uploadGlobalFlag(false));
  resetMeetingFlags(dispatch);
};
