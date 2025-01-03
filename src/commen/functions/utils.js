import { getPackageExpiryDetail } from "../../store/actions/GetPackageExpirtyDetails";
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
          { name: "PaymentFormUserManagement", id: 222 }
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

// XOR Encrypt/Decrypt Function
export const xorEncryptDecrypt = (input, key) => {
  let out = "";
  for (let i = 0; i < input.length; i++) {
    out += String.fromCharCode(
      input.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return out;
};

// Encrypt Function
export const encrypt = (data, key) => {
  try {
    xorEncryptDecrypt(JSON.stringify(data), key);
  } catch (e) {
    console.log("ErrorError", e);
  }
};

// Decrypt Function
export const decrypt = (data, key) => {
  try {
    return JSON.parse(xorEncryptDecrypt(data, key));
  } catch (e) {
    return xorEncryptDecrypt(data, key);
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
      `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(jsonData)}`,
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
