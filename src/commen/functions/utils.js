/**
 * @file utils.js
 * @description Central utility module for the Diskus application.
 *
 * Provides helpers covering the following concerns:
 *
 *  **Feature / Route Permissions**
 *  - `savePackageFeatureIDs`      – Persists available feature IDs to localStorage.
 *  - `checkFeatureID`             – Checks whether a feature ID is active.
 *  - `checkFeatureIDAvailability` – Numeric-safe variant of checkFeatureID.
 *  - `updateLocalUserRoutes`      – Builds the allowed user route list from API features.
 *  - `updateAdminRoutes`          – Builds the allowed admin route list from API features.
 *
 *  **Authentication / Session**
 *  - `handleLoginResponse`             – Full post-login setup: localStorage, routes, trial flags.
 *  - `clearLocalStorageAtloginresponce`– Cleans up login/signup flow state on various error codes.
 *  - `getLocalStorageItemNonActiveCheck` – Safe localStorage read (returns `false` when missing).
 *  - `handleNavigation`                – Decides post-login redirect target based on deep-link keys.
 *
 *  **API Helpers**
 *  - `getFormData` – Wraps request data in a `FormData` object for multipart API calls.
 *
 *  **URL / Browser**
 *  - `clearPaymentActionFromUrl` – Strips query params and hash from the current URL.
 *  - `extractActionFromUrl`      – Extracts the `validateguest_action` param from a URL string.
 *  - `getActionValue`            – Splits a URL on a key and returns the trailing segment.
 *
 *  **Config**
 *  - `findAndSetConfigValue` – Looks up an object in a config array by `configKey`.
 *
 *  **String / Text**
 *  - `truncateText`               – Truncates a string at `maxLength` with an ellipsis.
 *  - `removeHTMLTags`             – Strips all HTML tags from a string.
 *  - `removeHTMLTagsAndTruncate`  – Strips HTML then truncates at `maxLength`.
 *  - `getFileName`                – Returns the stem (no extension) of a filename.
 *
 *  **Encryption (XOR + Base64)**
 *  - `xorEncryptDecrypt` – Symmetric XOR cipher over a repeating key.
 *  - `encrypt`           – Serialises, XOR-encrypts, and Base64-encodes a value.
 *  - `decrypt`           – Base64-decodes, XOR-decrypts, and deserialises a value.
 *  - `setData`           – Saves encrypted data to localStorage.
 *  - `getData`           – Retrieves and decrypts data from localStorage.
 *
 *  **File Helpers**
 *  - `fileFormatforSignatureFlow`    – Supported file extensions for the Apryse signature viewer.
 *  - `NewfileFormatforSignatureFlow` – Extended list (includes `.txt`).
 *  - `maxFileSize`                   – Maximum upload size (1.5 GiB).
 *  - `openDocumentViewer`            – Opens a document in the in-app viewer or data-room viewer.
 *
 *  **Miscellaneous**
 *  - `isFunction`                – Checks whether a value is a function.
 *  - `generateRandomNegativeAuto`– Returns a random integer in [-1000, -10].
 *  - `generateRandomPositiveId`  – Returns a random integer in [1, 1000].
 *
 *  **Notification Routing**
 *  - `WebNotificationExportRoutFunc` – Master dispatcher that handles `notificationActionID`
 *    values 1–50+, routing the user to the correct page / modal when a real-time
 *    notification is clicked.
 *
 *  **Sidebar Navigation**
 *  - `SideBarGlobalNavigationFunction` – Guards sidebar navigation while an advance
 *    meeting or schedule-meeting modal is open.
 */
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

// ─── Feature / Route Permissions ──────────────────────────────────────────────

/**
 * Persists available package feature IDs for the current user to localStorage.
 *
 * Reads any previously stored IDs, merges them with the IDs derived from the
 * provided `userFeatures` array, de-duplicates via a `Set`, and writes the
 * combined array back under the key `"packageFeatureIDs"`.
 *
 * @param {Array<{packageFeatureID: number}>} userFeatures - Feature objects
 *   returned by the login / session API.
 * @returns {void}
 */
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

/**
 * Checks whether a given feature ID exists in the user's stored package features.
 *
 * @param {number} id - The `packageFeatureID` to look up.
 * @returns {boolean} `true` if the feature is available for the current user.
 */
export function checkFeatureID(id) {
  // Retrieve the packageFeatureIDs string from local storage and parse it into an array
  const storedIDs = localStorage.getItem("packageFeatureIDs");
  const packageFeatureIDs = storedIDs ? JSON.parse(storedIDs) : [];

  // Check if the provided ID is in the array of packageFeatureIDs
  return packageFeatureIDs.includes(id);
}

/**
 * Populates `LocalUserRoutes` by matching API-returned user features against a
 * static feature-ID → route-name mapping table.
 *
 * Only routes whose `packageFeatureID` appears in `userFeatures` and that are
 * not already present in `LocalUserRoutes` are appended, preventing duplicates.
 *
 * @param {Array<{packageFeatureID: number}>} userFeatures   - Features from the API.
 * @param {Array<{name: string, id: number}>} LocalUserRoutes - Accumulator array
 *   that is mutated in-place and returned.
 * @returns {Array<{name: string, id: number}>} The updated `LocalUserRoutes` array.
 */
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
        (route) => route.id === feature.packageFeatureID,
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

/**
 * Populates `LocalAdminRoutes` by matching API-returned admin features against a
 * static feature-ID → route-name mapping table.
 *
 * Mirrors `updateLocalUserRoutes` but operates on the admin feature set and
 * admin-specific route names (e.g. `"ManageUsers"`, `"OrganizationlevelConfigUM"`).
 *
 * @param {Array<{packageFeatureID: number}>} adminFeatures   - Admin features from the API.
 * @param {Array<{name: string, id: number}>} LocalAdminRoutes - Accumulator array
 *   that is mutated in-place and returned.
 * @returns {Array<{name: string, id: number}>} The updated `LocalAdminRoutes` array.
 */
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
        (route) => route.id === feature.packageFeatureID,
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

// ─── Authentication / Session ──────────────────────────────────────────────────

/**
 * Processes a successful login API response and bootstraps the application
 * session.
 *
 * Responsibilities:
 *  1. Persists core identity fields (`organizationID`, `roleID`, `name`,
 *     `userEmail`, auth tokens) to `localStorage` and `sessionStorage`.
 *  2. Resets call-related flags (`activeCall`, `isMeeting`, etc.).
 *  3. Conditionally fetches package-expiry details for trial organisations.
 *  4. Constructs `LocalUserRoutes` and `LocalAdminRoutes` — either a full trial
 *     set or a dynamically computed set from `userFeatures`/`adminFeatures`.
 *  5. Writes the route arrays to `localStorage` so that `RouteWrapperUser` /
 *     `RouteWrapperAdmin` can gate access to individual pages.
 *  6. Sets `LoginFlowPageRoute` to `1` to advance the login flow state machine.
 *
 * @async
 * @param {Object}   response          - The raw login API response object.
 * @param {Function} dispatch          - Redux `dispatch` function.
 * @param {Function} navigate          - React Router `navigate` function.
 * @param {Function} t                 - i18next translation function.
 * @returns {Promise<void>}
 */
export async function handleLoginResponse(response, dispatch, navigate, t) {
  try {
    if (response.organizationID) {
      localStorage.setItem("organizationID", response.organizationID);
    }

    localStorage.setItem("MicOff", true);
    localStorage.setItem("VidOff", true);

    localStorage.setItem(
      "organizationSubscriptionID",
      response.organizationSubscriptionID,
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
      sessionStorage.setItem(
        "userID",
        JSON.stringify(response.authToken.userID),
      );
      localStorage.setItem("name", response.authToken.name);
      localStorage.setItem("userEmail", response.authToken.userName);
      localStorage.setItem("token", JSON.stringify(response.authToken.token));
      sessionStorage.setItem("token", JSON.stringify(response.authToken.token));
      localStorage.setItem(
        "refreshToken",
        JSON.stringify(response.authToken.refreshToken),
      );
      localStorage.setItem(
        "organizationRoleID",
        response.authToken.organizationRoleID,
      );

      localStorage.setItem("isFirstLogin", response.authToken.isFirstLogIn);
      localStorage.setItem("activeOtoChatID", 0);
      console.log("busyCall");
      localStorage.setItem("activeCall", false);
      sessionStorage.setItem("activeCallSessionforOtoandGroup", false);

      localStorage.setItem("initiateVideoCall", false);
      localStorage.setItem("activeRoomID", 0);
      console.log("mqtt");
      localStorage.setItem("isMeeting", false);
      sessionStorage.removeItem("isMeeting");
      sessionStorage.removeItem("isMeeting");
      localStorage.setItem("meetingVideoID", 0);
      localStorage.setItem("newCallerID", 0);
      const emptyArray = [];
      localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
      localStorage.setItem("meetingTitle", "");
    }

    localStorage.setItem("isTrial", response.isTrial);
    if (response.isTrial) {
      await dispatch(
        getPackageExpiryDetail(navigate, response.organizationID, t),
      );
    }

    localStorage.setItem(
      "organizationSelectedUserPackageID",
      response.organizationSelectedUserPackageID,
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
          { name: "Minutes", id: 115 },
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
          { name: "AuditTrial", id: 219 },
        );
      }
    } else {
      //yaha pai kam karna hy user ka kam
      if (response.hasUserRights) {
        const dynamicUserFeatures = await updateLocalUserRoutes(
          response.userFeatures,
          LocalUserRoutes,
        ); // get dynamic features
        LocalUserRoutes = dynamicUserFeatures;
      }
      //yaha pai kam karna hy Admin ka kam
      if (response.hasAdminRights) {
        const dynamicUserFeatures = await updateAdminRoutes(
          response.adminFeatures,
          LocalAdminRoutes,
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

/**
 * Checks whether a feature ID is present in the stored package feature list.
 *
 * Unlike `checkFeatureID`, this variant coerces the provided ID to a `Number`
 * before comparison, making it safe to call with string values (e.g. from DOM
 * attributes or URL params).
 *
 * @param {number|string} id - The feature ID to check.
 * @returns {boolean} `true` if the feature is licensed for the current user.
 */
export function checkFeatureIDAvailability(id) {
  let packageID = JSON.parse(localStorage.getItem("packageFeatureIDs"));
  if (Array.isArray(packageID)) {
    let getFeaturesIDs = packageID;
    return getFeaturesIDs.includes(Number(id));
  } else {
    return false;
  }
}

// ─── API Helpers ───────────────────────────────────────────────────────────────

/**
 * Wraps request data and a request-method descriptor in a `FormData` object
 * suitable for multipart API calls.
 *
 * The server expects:
 *  - `RequestData`   – JSON-serialised payload.
 *  - `RequestMethod` – String identifier that routes the call server-side.
 *
 * @param {Object} data              - The request payload (will be `JSON.stringify`-ed).
 * @param {{RequestMethod: string}} RequestMethodData - Object containing the
 *   `RequestMethod` routing key.
 * @returns {FormData} A populated `FormData` instance.
 */
export function getFormData(data, RequestMethodData) {
  let form = new FormData();
  form.append("RequestData", JSON.stringify(data));
  form.append("RequestMethod", RequestMethodData.RequestMethod);
  return form;
}

/**
 * Safely reads a value from `localStorage`, returning `false` when the key is
 * absent (rather than `null`).
 *
 * Intended for non-active-organisation checks where `false` is the correct
 * default sentinel rather than `null`.
 *
 * @param {string} key - The `localStorage` key to read.
 * @returns {string|false} The stored string, or `false` if the key does not exist.
 */
export function getLocalStorageItemNonActiveCheck(key) {
  const item = localStorage.getItem(key);
  return item !== null ? item : false;
}

/**
 * Manages login-flow cleanup in response to various server error / status codes.
 *
 * `value` codes:
 *  - `1` – Normal sign-out: removes both `SignupFlowPageRoute` and
 *           `LoginFlowPageRoute`.
 *  - `2` – Redirect to root: removes `SignupFlowPageRoute`, sets
 *           `LoginFlowPageRoute` to `1`, and navigates to `"/"`.
 *  - `3` – Wrong password: dispatches `LoginFlowRoutes(2)` and sets
 *           `LoginFlowPageRoute` to `2`.
 *  - `4` – Account blocked / inactive: dispatches `LoginFlowRoutes(1)`, sets
 *           `LoginFlowPageRoute` to `1`, and navigates to `"/"`.
 *
 * @param {Function} dispatch  - Redux `dispatch`.
 * @param {number}   value     - Status/error code from the server (1–4).
 * @param {Function} navigate  - React Router `navigate`.
 * @returns {void}
 */
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

// ─── URL / Browser ─────────────────────────────────────────────────────────────

/**
 * Removes all query parameters and the URL fragment from the browser's current
 * URL without triggering a page reload.
 *
 * Uses `window.history.replaceState` so the cleaned URL is reflected in the
 * address bar and browser history, but no navigation occurs.
 *
 * @returns {void}
 */
export const clearPaymentActionFromUrl = () => {
  const currentUrl = new URL(window.location.href);
  console.log(currentUrl, "currentUrlcurrentUrl");
  // Create the new URL without query parameters and hash
  const newUrl = currentUrl.origin + currentUrl.pathname;

  // Update the browser's URL without reloading the page
  window.history.replaceState({}, document.title, newUrl);
};

// ─── Config ────────────────────────────────────────────────────────────────────

/**
 * Finds a configuration object in an array by its `configKey` property.
 *
 * @param {Array<{configKey: string, [key: string]: any}>} data - Array of config objects.
 * @param {string} key - The `configKey` value to search for.
 * @returns {{configKey: string, [key: string]: any}|undefined} The matching
 *   config object, or `undefined` if not found.
 */
export const findAndSetConfigValue = (data, key) => {
  const foundObject = data.find((obj) => obj.configKey === key);
  return foundObject;
};
// ─── String / Text ─────────────────────────────────────────────────────────────

/**
 * Truncates a string to `maxLength` characters, appending `"..."` if the
 * original string exceeds the limit.
 *
 * @param {string} text      - The source string.
 * @param {number} maxLength - Maximum number of characters to keep (the
 *   ellipsis occupies the last three slots, so the visible content is
 *   `maxLength - 3` characters).
 * @returns {string} Truncated string with ellipsis, or the original string
 *   when it fits within `maxLength`.
 */
export const truncateText = (text, maxLength) => {
  console.log(
    text.length,
    maxLength,
    text.length > maxLength,
    "truncateTexttruncateText",
  );
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength - 3)}...`;
  }
  return text;
};

/**
 * Strips all HTML tags from a string using a regex.
 *
 * @param {string} htmlString - A string that may contain HTML markup.
 * @returns {string} Plain-text content with all tags removed.
 */
export const removeHTMLTags = (htmlString) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
};

/**
 * Truncates a string to `maxLength` characters.
 *
 * Note: despite the name, this function does **not** strip HTML tags — it only
 * truncates.  Use `removeHTMLTags` first if stripping is needed.
 *
 * @param {string} String        - The source string.
 * @param {number} [maxLength=500] - Maximum character count before truncation.
 * @returns {string} The (possibly truncated) string.
 */
export const removeHTMLTagsAndTruncate = (String, maxLength = 500) => {
  // Truncate the content to the specified length
  if (String.length > maxLength) {
    return String.substring(0, maxLength);
  }

  return String;
};

// ─── Encryption (XOR + Base64) ─────────────────────────────────────────────────

/**
 * Applies a repeating-key XOR cipher to `input`.
 *
 * Because XOR is its own inverse, the same function is used for both
 * encryption and decryption — call it twice with the same key to round-trip.
 *
 * @param {string} input - The plaintext or ciphertext string.
 * @param {string} key   - The cipher key (repeated cyclically over `input`).
 * @returns {string} The XOR-transformed string.
 */
export const xorEncryptDecrypt = (input, key) => {
  let out = "";
  for (let i = 0; i < input.length; i++) {
    out += String.fromCharCode(
      input.charCodeAt(i) ^ key.charCodeAt(i % key.length),
    );
  }
  return out;
};

/**
 * Encrypts an arbitrary value for safe storage.
 *
 * Steps: `JSON.stringify` → XOR cipher → Base64 encode.
 *
 * @param {*}      data - Any JSON-serialisable value.
 * @param {string} key  - The XOR cipher key (typically `REACT_APP_SECERETKEY`).
 * @returns {string|null} Base64-encoded ciphertext, or `null` on error.
 */
export const encrypt = (data, key) => {
  try {
    const encrypted = xorEncryptDecrypt(JSON.stringify(data), key);
    return btoa(encrypted); // base64 encode
  } catch (e) {
    console.log("Encrypt Error:", e);
    return null;
  }
};

/**
 * Decrypts a value produced by `encrypt`.
 *
 * Steps: Base64 decode → XOR cipher → `JSON.parse`.
 *
 * @param {string} data - Base64-encoded ciphertext.
 * @param {string} key  - The XOR cipher key (typically `REACT_APP_SECERETKEY`).
 * @returns {*|null} The original value, or `null` on error.
 */
export const decrypt = (data, key) => {
  try {
    const decoded = atob(data); // base64 decode
    return JSON.parse(xorEncryptDecrypt(decoded, key));
  } catch (e) {
    console.log("Decrypt Error:", e);
    return null;
  }
};

/**
 * Encrypts `data` using the application secret key and saves the result to
 * `localStorage` under `key`.
 *
 * @param {string} key  - The `localStorage` key to write.
 * @param {*}      data - Any JSON-serialisable value.
 * @returns {void}
 */
export const setData = (key, data) =>
  localStorage.setItem(key, encrypt(data, process.env.REACT_APP_SECERETKEY));

/**
 * Reads a ciphertext value from `localStorage` and decrypts it using the
 * application secret key.
 *
 * @param {string} key - The `localStorage` key to read.
 * @returns {*|null} The decrypted value, or `null` when the key is absent or
 *   decryption fails.
 */
export const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? decrypt(data, process.env.REACT_APP_SECERETKEY) : null;
};

// ─── File Helpers ──────────────────────────────────────────────────────────────

/**
 * File extensions supported by the Apryse WebViewer signature flow.
 *
 * Covers PDF, major Microsoft Office formats, CAD drawings, common document
 * formats, raster images, and SVG.  Used to decide whether a file can be
 * opened in the in-app PDF/annotation viewer.
 *
 * @type {string[]}
 */
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

/**
 * Extracts the `validateguest_action` query parameter value from a URL string.
 *
 * Handles the common issue where URL decoding turns `+` into a space by
 * first replacing spaces back to `+` before calling `decodeURIComponent`.
 *
 * @param {string} url - The full URL (or query string portion) to parse.
 * @returns {string} The decoded action string, or `""` when the parameter is
 *   absent.
 */
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

/**
 * Extended list of file extensions supported by the document viewer.
 *
 * Same as `fileFormatforSignatureFlow` but additionally includes plain-text
 * files (`"txt"`).  Used internally by `openDocumentViewer`.
 *
 * @type {string[]}
 */
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

/**
 * Opens a document in the appropriate in-app viewer based on file extension.
 *
 * - If `ext` is in `NewfileFormatforSignatureFlow` (PDF, Office, images, etc.),
 *   the document is opened in a new tab at `/Diskus/documentViewer` with the
 *   encoded JSON payload as a query parameter.
 * - If `ext` passes `validateExtensionsforHTMLPage`, the Data Room annotation
 *   API is called so the file can be displayed as an HTML page.
 *
 * @param {string}   ext      - Lowercase file extension (without the dot).
 * @param {string}   jsonData - URL-encoded JSON string describing the document.
 * @param {Function} dispatch - Redux `dispatch`.
 * @param {Function} navigate - React Router `navigate`.
 * @param {Function} t        - i18next translation function.
 * @param {{id: number}} record - The data-room file record (used for HTML page viewer).
 * @returns {void}
 */
export const openDocumentViewer = (
  ext,
  jsonData,
  dispatch,
  navigate,
  t,
  record,
) => {
  if (NewfileFormatforSignatureFlow.includes(ext)) {
    window.open(
      `/Diskus/documentViewer?pdfData=${encodeURIComponent(jsonData)}`,
      "_blank",
      "noopener noreferrer",
    );
  } else if (validateExtensionsforHTMLPage(ext)) {
    let dataRoomData = {
      FileID: record.id,
    };
    dispatch(
      getAnnotationsOfDataroomAttachement(navigate, t, dataRoomData, true),
    );
  }
};

/**
 * Maximum allowed file upload size: **1.5 GiB** (1 610 612 736 bytes).
 *
 * @type {number}
 */
export const maxFileSize = 1.5 * 1024 * 1024 * 1024;

/**
 * Checks whether a value is a function.
 *
 * @param {*} value - Any value.
 * @returns {boolean} `true` if `typeof value === "function"`.
 */
export const isFunction = (value) => {
  return typeof value === "function";
};

/**
 * Extracts the substring that follows a known `key` within a URL string.
 *
 * @example
 * getActionValue("https://example.com/path?token=abc123", "token=")
 * // Returns "abc123"
 *
 * @param {string} url - The URL or any string to parse.
 * @param {string} key - The delimiter to split on.
 * @returns {string|undefined} Everything after the first occurrence of `key`,
 *   or `undefined` if `key` is not found.
 */
export const getActionValue = (url, key) => {
  return url.split(key)[1];
};

// ─── Notification Routing ──────────────────────────────────────────────────────

/**
 * Master notification-click handler.  Reads `NotificationData.notificationActionID`
 * and routes the user to the appropriate page / modal.
 *
 * Supported action IDs and their meanings:
 *  | ID | Event |
 *  |----|-------|
 *  | 1  | Meeting published / created |
 *  | 2  | Meeting updated |
 *  | 3  | Meeting started |
 *  | 4  | Meeting ended |
 *  | 5  | Meeting cancelled (quick meetings only) |
 *  | 6  | Removed from meeting |
 *  | 7  | Added as minutes reviewer |
 *  | 8  | Removed as minutes reviewer |
 *  | 9  | Added as participant |
 *  | 10 | Added as organizer |
 *  | 11 | Added as agenda contributor |
 *  | 12 | Poll created inside meeting |
 *  | 13 | Proposed meeting request |
 *  | 14 | Proposed meeting slot selected by participant |
 *  | 15 | Organizer: all date responses received |
 *  | 16 | Added to group |
 *  | 17 | Removed from group |
 *  | 18 | Group archived |
 *  | 19 | Group inactivated |
 *  | 20 | Group activated |
 *  | 21 | Added to committee |
 *  | 22 | Removed from committee |
 *  | 23 | Committee archived |
 *  | 24 | Committee inactivated |
 *  | 25 | Committee activated |
 *  | 26 | Added as resolution voter |
 *  | 27 | Added as resolution non-voter |
 *  | 28 | Resolution decision announced |
 *  | 29 | Poll created (standalone) |
 *  | 30 | Poll updated |
 *  | 33 | Data room file shared as viewer |
 *  | 34 | Data room file shared as editor |
 *  | 35 | Data room folder shared as viewer |
 *  | 36 | Data room folder shared as editor |
 *  | 37–40 | Data room folder/file deleted |
 *  | 41 | Minutes workflow update |
 *  | 42 | Group role changed |
 *  | 43 | Committee role changed |
 *  | 44 | Resolution deleted |
 *  | 45 | Poll deleted |
 *  | 46–47 | Voter voted on meeting poll |
 *  | 48 | Proposed meeting send-response date passed |
 *  | 49 | Task assigned in meeting |
 *  | 50 | Resolution voter changes vote |
 *
 * @param {string}   currentURL                  - `window.location.href` of the current tab.
 * @param {Function} dispatch                    - Redux `dispatch`.
 * @param {Function} t                           - i18next translation function.
 * @param {Object}   location                    - React Router `location` object.
 * @param {Function} navigate                    - React Router `navigate`.
 * @param {Object}   NotificationData            - The notification object from the server.
 * @param {number}   NotificationData.notificationActionID - Determines the routing branch.
 * @param {string}   NotificationData.payloadData          - JSON string with entity IDs.
 * @param {Function} setViewFlag                 - Sets meeting view flag state.
 * @param {Function} setEditorRole               - Sets editor role state.
 * @param {Function} setViewAdvanceMeetingModal  - Opens/closes advance-meeting modal.
 * @param {Function} setViewProposeDatePoll      - Toggles propose-date poll view.
 * @param {Function} setViewGroupPage            - Toggles group page view.
 * @param {Function} setShowModal                - Shows/hides an archive/generic modal.
 * @param {Function} setVideoTalk                - Toggles video talk overlay.
 * @param {Function} setAdvanceMeetingModalID    - Sets the advance meeting modal ID.
 * @param {Function} setResultresolution         - Sets resolution result state.
 * @param {boolean}  isMeeting                   - Whether a meeting is currently active.
 * @param {Function} setPolls                    - Polls state setter (used to guard
 *   certain poll notifications when inside a live meeting).
 * @returns {void}
 */
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
  setPolls,
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
          PayLoadData.MeetingID,
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
          ),
        );
      }
    } else {
      //Notification For Meeting Updated And Published For Participant (Create Update Both scenarios are same A/c SRS)
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID,
        );
      } else {
        //Advance Meeting
        navigate("/Diskus/Meeting");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID,
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
          ),
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
          PayLoadData.MeetingID,
        );
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
          ),
        );
      }
    } else {
      //Notification For Meeting Updated And Published For Participant (Create Update Both scenarios are same A/c SRS)
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID,
        );
      } else {
        navigate("/Diskus/Meeting");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID,
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
          PayLoadData.MeetingID,
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
            setVideoTalk,
          ),
        );
      }
    } else {
      //Notification For Meeting Started For Participant (Create Update Started scenarios are same A/c SRS)
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID,
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID,
        );
        localStorage.setItem(
          "QuickMeetingCheckNotification",
          PayLoadData.IsQuickMeeting,
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
            setVideoTalk,
          ),
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
          PayLoadData.MeetingID,
        );
        let Data = { MeetingID: Number(PayLoadData.MeetingID) };
        dispatch(
          GetMeetingStatusDataAPI(
            navigate,
            t,
            Data,
            setEditorRole,
            true,
            setViewAdvanceMeetingModal,
          ),
        );
      }
    } else {
      if (PayLoadData.IsQuickMeeting === true) {
        //Notification For Meeting Ended For Participant (Create Update Started scenarios are same A/c SRS)
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID,
        );
      } else {
        navigate("/Diskus/Meeting");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID,
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
          PayLoadData.MeetingID,
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
        PayLoadData.MeetingID,
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
        PayLoadData.MeetingID,
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
          PayLoadData.MeetingID,
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
          ),
        );
      }
    } else {
      //Notification For Added as An Participant
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID,
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID,
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
          ),
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
          PayLoadData.MeetingID,
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
          ),
        );
      }
    } else {
      //Notification For Added as An Organizer
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID,
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID,
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
          ),
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
          PayLoadData.MeetingID,
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
            1,
          ),
        );
      }
    } else {
      //Notification For Added as An Agenda Contributor
      if (PayLoadData.IsQuickMeeting === true) {
        navigate("/Diskus/Meeting");
        localStorage.setItem("QuicMeetingOperations", true);
        localStorage.setItem(
          "NotificationQuickMeetingID",
          PayLoadData.MeetingID,
        );
      } else {
        navigate("/Diskus/Meeting");
        console.log(PayLoadData.IsQuickMeeting, "AdvanceOperations");
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID,
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
            1,
          ),
        );
      }
    }
  } else if (NotificationData.notificationActionID === 12) {
    //Notification for POlls Created from the Meeting
    if (currentURL.includes("/Diskus/Meeting")) {
      localStorage.setItem("AdvanceMeetingOperations", true);
      localStorage.setItem(
        "NotificationAdvanceMeetingID",
        PayLoadData.MeetingID,
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
          setVideoTalk,
        ),
      );
    } else {
      navigate("/Diskus/Meeting");
      localStorage.setItem("NotificationClickPollID", PayLoadData.PollID);
      localStorage.setItem("AdvanceMeetingOperations", true);
      localStorage.setItem(
        "NotificationAdvanceMeetingID",
        PayLoadData.MeetingID,
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
          setVideoTalk,
        ),
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
        currentDate.getMonth() + 1,
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
          "ProposedMeetOperationsDateSelectedSendResponseByDate",
        );
      }
    } else {
      //Notification When slot is selected by the participant. date wala kam bh yahe ho ga
      navigate("/Diskus/Meeting");
      localStorage.setItem("ProposedMeetingOperations", true);
      localStorage.setItem("NotificationClickMeetingID", PayLoadData.MeetingID);
      localStorage.setItem(
        "ProposedMeetOperationsDateSelectedSendResponseByDate",
        PayLoadData.DeadlineDate,
      );
    }
  } else if (NotificationData.notificationActionID === 15) {
    //Notification that Proposed Meeting Date Organizer work
    if (currentURL.includes("/Diskus/Meeting")) {
      localStorage.setItem("ProposedMeetingOrganizer", true);
      localStorage.setItem(
        "ProposedMeetingOrganizerMeetingID",
        PayLoadData.MeetingID,
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
          setVideoTalk,
        ),
      );
    } else {
      //Call Status API to see what is the status of the meeting eighter proposed or published
      navigate("/Diskus/Meeting");
      localStorage.setItem("ProposedMeetingOrganizer", true);
      localStorage.setItem(
        "ProposedMeetingOrganizerMeetingID",
        PayLoadData.MeetingID,
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
        PayLoadData.CommitteeID,
      );
      setViewGroupPage(true);
      dispatch(viewCommitteePageFlag(true));
    } else {
      //Notification for being Added in the Committee
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID,
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
        PayLoadData.CommitteeID,
      );
      setViewGroupPage(true);
      dispatch(viewCommitteePageFlag(true));
    } else {
      //Notificaiton For Committee InActive
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID,
      );
    }
  } else if (NotificationData.notificationActionID === 25) {
    if (currentURL.includes("/Diskus/committee")) {
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID,
      );
      setViewGroupPage(true);
      dispatch(viewCommitteePageFlag(true));
    } else {
      //Notificaiton For Committee Active using the same above 24 logic as the operation End result is same
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID,
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
          2,
        ),
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
          2,
        ),
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
          2,
        ),
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
          2,
        ),
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
          PayLoadData.FileName,
        ),
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
          PayLoadData.FileName,
        ),
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
          PayLoadData.FileName,
        ),
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
          PayLoadData.FileName,
        ),
      );
    }
  } else if (NotificationData.notificationActionID === 35) {
    if (
      location.pathname.toLowerCase().includes("/Diskus/dataroom".toLowerCase())
    ) {
      dispatch(
        getFolderDocumentsApi(navigate, Number(PayLoadData.FolderID), t),
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
        getFolderDocumentsApi(navigate, Number(PayLoadData.FolderID), t),
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
        PayLoadData.MeetingID,
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
        PayLoadData.MeetingID,
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
        PayLoadData.CommitteeID,
      );
      setViewGroupPage(true);
      dispatch(viewCommitteePageFlag(true));
    } else {
      //Notification for being Added in the Committee
      navigate("/Diskus/committee");
      localStorage.setItem("NotificationClickCommitteeOperations", true);
      localStorage.setItem(
        "NotifcationClickViewCommitteeID",
        PayLoadData.CommitteeID,
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
          PayLoadData.MeetingID,
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
            setVideoTalk,
          ),
        );
      } else {
        navigate("/Diskus/Meeting");
        localStorage.setItem("NotificationClickPollID", PayLoadData.PollID);
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID,
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
            setVideoTalk,
          ),
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
          PayLoadData.MeetingID,
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
            setVideoTalk,
          ),
        );
      } else {
        navigate("/Diskus/Meeting");
        localStorage.setItem("NotificationClickPollID", PayLoadData.PollID);
        localStorage.setItem("AdvanceMeetingOperations", true);
        localStorage.setItem(
          "NotificationAdvanceMeetingID",
          PayLoadData.MeetingID,
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
            setVideoTalk,
          ),
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
        PayLoadData.MeetingID,
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
          setVideoTalk,
        ),
      );
    } else {
      //Call Status API to see what is the status of the meeting eighter proposed or published
      navigate("/Diskus/Meeting");
      localStorage.setItem("ProposedMeetingOrganizer", true);
      localStorage.setItem(
        "ProposedMeetingOrganizerMeetingID",
        PayLoadData.MeetingID,
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
        PayLoadData.MeetingID,
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
          setVideoTalk,
        ),
      );
    } else {
      navigate("/Diskus/Meeting");
      localStorage.setItem("AdvanceMeetingOperations", true);
      localStorage.setItem(
        "NotificationAdvanceMeetingID",
        PayLoadData.MeetingID,
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
          setVideoTalk,
        ),
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
          setResultresolution,
        ),
      );
    } else {
      //Notification for Added as Voter in the resolution
      navigate("/Diskus/resolution");
      dispatch(
        getResolutionResult(
          navigate,
          Number(PayLoadData.Resolution_ID),
          t,
          setResultresolution,
        ),
      );
    }
  } else {
  }
};

// ─── Miscellaneous Helpers ─────────────────────────────────────────────────────

/**
 * Generates a random integer in the range **[-1000, -10]** (inclusive).
 *
 * Used to create temporary negative IDs for optimistically-created UI items
 * (e.g. new agenda entries) before the server assigns a real ID.
 *
 * @returns {number} A random negative integer.
 */
export const generateRandomNegativeAuto = () => {
  // Define default range for negative numbers
  const min = -1000; // More negative
  const max = -10; // Closer to zero

  // Generate a random negative integer in the range [min, max]
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random integer in the range **[1, 1000]** (inclusive).
 *
 * @returns {number} A random positive integer.
 */
export const generateRandomPositiveId = () => {
  // Define the range for positive IDs
  const min = 1; // Smallest positive ID
  const max = 1000; // Largest positive ID

  // Generate a random positive integer in the range [min, max]
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Determines and performs the post-login navigation based on deep-link keys
 * stored in `localStorage`.
 *
 * Priority order (highest → lowest):
 *  1. **First login** → `/onboard`
 *  2. **RSVP** → `/Diskus/Meeting/Useravailabilityformeeting`
 *  3. **Data room / document / folder / signature** → `/Diskus/dataroom`
 *  4. **Meeting-related** (start, update, minutes, proposed, agenda, etc.) → `/Diskus/Meeting`
 *  5. **Polls** → `/Diskus/polling`
 *  6. **Committee** → `/Diskus/committee`
 *  7. **Groups** → `/Diskus/groups`
 *  8. **Tasks** → `/Diskus/todolist`
 *  9. **Minutes / signatures** → `/Diskus/Minutes`
 * 10. **Default** → `/Diskus/`
 *
 * If `isFirstLogin` is neither truthy nor falsy (undefined / null),
 * `clearLocalStorageAtloginresponce` is called with code `2` to reset the flow.
 *
 * @param {Function} navigate      - React Router `navigate`.
 * @param {boolean}  isFirstLogin  - Whether this is the user's first login.
 * @param {Function} dispatch      - Redux `dispatch`.
 * @returns {void}
 */
export const handleNavigation = (
  navigate,
  isFirstLogin,
  // userRights,
  // adminRights,
  dispatch,
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
    "reviewSubmittedMinutesLink",
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

/**
 * Returns the stem of a filename (the portion before the first `.`).
 *
 * @example
 * getFileName("report.pdf") // → "report"
 *
 * @param {string} fileName - A filename string that may or may not include an extension.
 * @returns {string} The filename without its extension.
 */
export const getFileName = (fileName) => {
  return fileName.split(".")[0];
};

// ─── Sidebar Navigation ────────────────────────────────────────────────────────

/**
 * Guards sidebar link clicks when an advance meeting modal or schedule-meeting
 * form is currently open.
 *
 * When the user clicks a sidebar item while an unsaved advance-meeting flow is
 * active, this function intercepts the navigation and either:
 *  - Shows a cancel-confirmation modal, or
 *  - Shows a go-back modal (for schedule-meeting in progress), or
 *  - Allows navigation directly when the flow state is safe to leave.
 *
 * `navigateValue` carries the target route so the confirmation modals can
 * trigger the actual `navigate()` call on user confirmation.
 *
 * @async
 * @param {boolean}  viewAdvanceMeetingModal         - Whether the advance-meeting modal is open.
 * @param {Object}   editorRole                      - Current editor role / status for the meeting.
 * @param {boolean}  minutes                         - Whether the minutes tab is active.
 * @param {boolean}  actionsPage                     - Whether the actions tab is active.
 * @param {boolean}  polls                           - Whether the polls tab is active.
 * @param {Function} navigate                        - React Router `navigate`.
 * @param {Function} dispatch                        - Redux `dispatch`.
 * @param {Function} setCancelConfirmationModal      - Opens cancel-confirmation modal.
 * @param {Function} setViewAdvanceMeetingModal      - Closes the advance-meeting modal.
 * @param {string}   navigateValue                   - The route path to navigate to.
 * @param {Function} t                               - i18next translation function.
 * @param {boolean}  sceduleMeeting                  - Whether a schedule-meeting form is open.
 * @param {Function} setSceduleMeeting               - Closes the schedule-meeting form.
 * @param {Function} setGoBackCancelModal            - Opens go-back cancel modal.
 * @param {boolean}  viewAdvanceMeetingModalUnpublish  - Whether the unpublish variant is shown.
 * @param {Function} setViewAdvanceMeetingModalUnpublish - Closes the unpublish variant.
 * @returns {Promise<void>}
 */
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
  setGoBackCancelModal,
  viewAdvanceMeetingModalUnpublish,
  setViewAdvanceMeetingModalUnpublish,
) => {
  let userID = localStorage.getItem("userID");
  let currentView = localStorage.getItem("MeetingCurrentView");

  console.log(
    { viewAdvanceMeetingModal, sceduleMeeting, editorRole, currentView },
    "Checking",
  );
  if (viewAdvanceMeetingModal) {
    console.log("Checking");
    if (Number(editorRole?.status) === 10) {
      console.log("Checking");
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
            localStorage.getItem("MeetingCurrentView") &&
            Number(localStorage.getItem("MeetingCurrentView")) === 1
              ? true
              : false,
          ProposedMeetings:
            localStorage.getItem("MeetingCurrentView") &&
            Number(localStorage.getItem("MeetingCurrentView")) === 2
              ? true
              : false,
        };
        localStorage.setItem("MeetingPageRows", 30);
        localStorage.setItem("MeetingPageCurrent", 1);
        console.log("chek search meeting");
        await dispatch(searchNewUserMeeting(navigate, searchData, t));
      } else {
        setCancelConfirmationModal(true);
      }
    } else if (Number(editorRole.status) === 11) {
      console.log("Checking");
      console.log("Check Route Meeting");

      dispatch(viewMeetingFlag(false));
      setViewAdvanceMeetingModalUnpublish(false);
      setViewAdvanceMeetingModal(false);
      navigate(navigateValue);
    } else {
      console.log(navigateValue, "Checking");

      if (navigateValue === "/Diskus/") {
        console.log(navigateValue, "Checking");
        navigate("/Diskus/");
      } else {
        try {
          let searchData = {
            Date: "",
            Title: "",
            HostName: "",
            UserID: Number(userID),
            PageNumber: 1,
            Length: 30,
            PublishedMeetings:
              localStorage.getItem("MeetingCurrentView") &&
              Number(localStorage.getItem("MeetingCurrentView")) === 1
                ? true
                : false,
            ProposedMeetings:
              localStorage.getItem("MeetingCurrentView") &&
              Number(localStorage.getItem("MeetingCurrentView")) === 2
                ? true
                : false,
          };
          localStorage.setItem("MeetingPageRows", 30);
          localStorage.setItem("MeetingPageCurrent", 1);
          console.log("chek search meeting");
          await dispatch(searchNewUserMeeting(navigate, searchData, t));

          setViewAdvanceMeetingModal(false);
          console.log("Check Route Meeting");

          dispatch(viewMeetingFlag(false));
          isFunction(setViewAdvanceMeetingModalUnpublish) &&
            setViewAdvanceMeetingModalUnpublish(false);

          localStorage.removeItem("NotificationAdvanceMeetingID");
          localStorage.removeItem("QuickMeetingCheckNotification");
          localStorage.removeItem("viewadvanceMeetingPolls");
          localStorage.removeItem("NotificationClickPollID");
          localStorage.removeItem("AdvanceMeetingOperations");
          localStorage.removeItem("NotificationClickTaskID");
          localStorage.removeItem("viewadvanceMeetingTask");
        } catch (error) {
          console.log("Checking", error);
        }
      }
      console.log("Checking");
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
    console.log(
      "Check Route Meeting",
      flags,
    )(
      ((await isFunction(scheduleMeetingPageFlag)) &&
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
          proposeNewMeetingPageFlag === true),
    ) &&
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
  setViewAdvanceMeetingModal,
  flags,
  t,
}) => {
  // const meetingFlags = {
  //   scheduleMeetingPageFlag:
  //     flags.scheduleMeetingPageFlagReducer || flags.scheduleMeetingsPageFlag,
  //   viewProposeDateMeetingPageFlag:
  //     flags.viewProposeDateMeetingPageFlagReducer ||
  //     flags.viewProposeDateMeetingsPageFlag,
  //   viewAdvanceMeetingPublishPageFlag:
  //     flags.viewAdvanceMeetingPublishPageFlagReducer ||
  //     flags.viewAdvanceMeetingsPublishPageFlag,
  //   viewAdvanceMeetingUnpublishPageFlag:
  //     flags.viewAdvanceMeetingUnpublishPageFlagReducer ||
  //     flags.viewAdvanceMeetingsUnpublishPageFlag,
  //   viewProposeOrganizerMeetingPageFlag:
  //     flags.viewProposeOrganizerMeetingPageFlagReducer ||
  //     flags.viewProposeOrganizerMeetingsPageFlag,
  //   proposeNewMeetingPageFlag:
  //     flags.proposeNewMeetingPageFlagReducer ||
  //     flags.proposeNewMeetingsPageFlag,
  //   viewMeetingFlag: flags.viewMeetingFlagReducer || flags.viewMeetingsFlag,
  // };
  // console.log(meetingFlags,NavigationLocation, "MeetingFlags");
  // const shouldNavigateToMeeting = await isAnyMeetingPageActive(meetingFlags);
  // console.log(shouldNavigateToMeeting, "MeetingFlags");
  try {
    // if (shouldNavigateToMeeting) {
    //   handleMeetingNavigation(navigate, dispatch);
    //   return;
    // }

    switch (NavigationLocation) {
      case "dataroom":
        navigate("/Diskus/dataroom");
        resetMeetingFlags(dispatch);
        setViewAdvanceMeetingModal(false);
        break;

      case "resolution":
        navigate("/Diskus/resolution");
        resetMeetingFlags(dispatch);
        dispatch(resultResolutionFlag(false));
        dispatch(voteResolutionFlag(false));
        dispatch(viewAttachmentFlag(false));
        dispatch(createResolutionModal(false));
        dispatch(viewResolutionModal(false));
        setViewAdvanceMeetingModal(false);
        break;

      case "committee":
        navigate("/Diskus/committee");
        resetMeetingFlags(dispatch);
        dispatch(createCommitteePageFlag(false));
        dispatch(updateCommitteePageFlag(false));
        dispatch(viewCommitteePageFlag(false));
        setViewAdvanceMeetingModal(false);
        break;

      case "Meeting":
        handleMeetingCase(navigate, dispatch, t, setViewAdvanceMeetingModal);

        break;

      case "groups":
        navigate("/Diskus/groups");
        resetMeetingFlags(dispatch);
        dispatch(createGroupPageFlag(false));
        dispatch(updateGroupPageFlag(false));
        dispatch(viewGroupPageFlag(false));
        setViewAdvanceMeetingModal(false);
        break;

      case "todolist":
        navigate("/Diskus/todolist");
        resetMeetingFlags(dispatch);
        setViewAdvanceMeetingModal(false);
        break;

      case "calendar":
        navigate("/Diskus/calendar");
        resetMeetingFlags(dispatch);
        setViewAdvanceMeetingModal(false);
        break;

      case "Notes":
        navigate("/Diskus/Notes");
        resetMeetingFlags(dispatch);
        setViewAdvanceMeetingModal(false);
        break;

      case "polling":
        navigate("/Diskus/polling");
        resetMeetingFlags(dispatch);
        setViewAdvanceMeetingModal(false);
        break;

      case "home":
        if (!location.pathname.includes("/Admin")) {
          navigate("/Diskus/");
          resetMeetingFlags(dispatch);
          setViewAdvanceMeetingModal(false);
        }
        break;

      case "dataroomRecentAddedFiles":
        localStorage.setItem("setTableView", 4);
        navigate("/Diskus/dataroom");
        resetMeetingFlags(dispatch);
        setViewAdvanceMeetingModal(false);
        break;

      case "setting":
        if (!location.pathname.includes("/Admin")) {
          navigate("/Diskus/setting");
          resetMeetingFlags(dispatch);
          setViewAdvanceMeetingModal(false);
        }
        break;

      case "Minutes":
        if (!location.pathname.includes("/Admin")) {
          navigate("/Diskus/Minutes");
          resetMeetingFlags(dispatch);
          setViewAdvanceMeetingModal(false);
        }
        break;

      case "faq's":
        if (!location.pathname.includes("/Admin")) {
          navigate("/Diskus/faq's");
          resetMeetingFlags(dispatch);
          setViewAdvanceMeetingModal(false);
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
const handleMeetingCase = (
  navigate,
  dispatch,
  t,
  setViewAdvanceMeetingModal,
) => {
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
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
      ProposedMeetings: currentView && Number(currentView) === 3 ? true : false,
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
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
      ProposedMeetings: currentView && Number(currentView) === 3 ? true : false,
    };
    localStorage.setItem("MeetingPageRows", 30);
    localStorage.setItem("MeetingPageCurrent", 1);
    dispatch(searchNewUserMeeting(navigate, searchData, t));
  }
  console.log("Check Route Meeting");

  setViewAdvanceMeetingModal(false);
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
  dispatch(viewAdvanceMeetingPublishPageFlag(false));

  dispatch(attendanceGlobalFlag(false));
  dispatch(uploadGlobalFlag(false));
  resetMeetingFlags(dispatch);
};

// Function to read storage values
export const getMeetingValues = () => {
  const local = localStorage.getItem("isMeeting");
  const session = sessionStorage.getItem("isMeeting");
  return { local, session };
};


export const checklistStatusErrorMap = {
  Compliance_ComplianceServiceManager_ChangeChecklistStatus_01:
    "Checklist-status-changed-successfully",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_02:
    "OrganizationID-is-required",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_03:
    "ComplianceID-is-required",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_04:
    "StatusID-is-required",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_05:
    "StatusChangeBy-is-required",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_06:
    "Invalid-StatusChangeBy-user",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_07:
    "Invalid-checklist-status",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_08:
    "UpdatedDueDate-is-required",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_09:
    "Checklist-not-found",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_11:
    "Checklist-does-not-belong-to-provided-Compliance",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_12:
    "Completed-or-Cancelled-checklist-cannot-be-changed",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_13:
    "Checklist-status-transition-not-allowed",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_14:
    "Pending-to-InProgress-requires-at-least-one-task-in-the-checklist",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_15:
    "Checklist-cannot-be-marked-completed-while-tasks-are-still-pending",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_16:
    "Exception-occurred",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_17:
    "Reason-required-for-OnHold-or-Cancelled",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_18:
    "Checklist-update-failed",

  Compliance_ComplianceServiceManager_ChangeChecklistStatus_50:
    "Something-went-wrong",
};