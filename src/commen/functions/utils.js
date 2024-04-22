// export const updateLocalUserRoutes=(userFeatures,LocalUserRoutes)=> {
//     userFeatures.forEach(feature => {
//         // Check if the packageFeatureID exists in the routes array
//         const matchingRoute = routes.find(route => route.id === feature.packageFeatureID);
//         if (matchingRoute) {
//             // If a matching route is found, push it to LocalUserRoutes if it's not already included
//             if (!LocalUserRoutes.some(route => route.id === matchingRoute.id)) {
//                return LocalUserRoutes.push(matchingRoute);
//             }
//         }
//     });
// }

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
    { id: 19, name: "signatureviewer" },
    { id: 20, name: "documentViewer" },
    { id: 21, name: "signatureviewer" },
    { id: 2, name: "dataroom" },
    { id: 19, name: "dataroom" },
    { id: 20, name: "dataroom" },
    { id: 21, name: "dataroom" },
    { id: 6, name: "notes" },
    { id: 7, name: "calendar" },
    { id: 14, name: "todolist" },
    { id: 15, name: "polling" },
    { id: 17, name: "groups" },
    { id: 17, name: "committee" },
    { id: 18, name: "resolution" },
    { id: 1, name: "Meeting" },
    { id: 4, name: "Meeting" },
    { id: 5, name: "Meeting" },
    { id: 9, name: "Meeting" },
    { id: 10, name: "Meeting" },
    { id: 11, name: "Meeting" },
    { id: 12, name: "Meeting" },
    { id: 1, name: "Meeting/Useravailabilityformeeting" },
    { id: 4, name: "Meeting/Useravailabilityformeeting" },
    { id: 5, name: "Meeting/Useravailabilityformeeting" },
    { id: 9, name: "Meeting/Useravailabilityformeeting" },
    { id: 10, name: "Meeting/Useravailabilityformeeting" },
    { id: 11, name: "Meeting/Useravailabilityformeeting" },
    { id: 12, name: "Meeting/Useravailabilityformeeting" },
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
    console.log(error, "errorerror");
  }
}

// for enter posword state management and routes management
// Export the handleLoginResponse function
export async function handleLoginResponse(response) {
  try {
    if (response.organizationID) {
      localStorage.setItem("organizationID", response.organizationID);
    }

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
      localStorage.setItem("activeCall", false);
      localStorage.setItem("initiateVideoCall", false);
      localStorage.setItem("activeRoomID", 0);
      localStorage.setItem("isMeeting", false);
      localStorage.setItem("newCallerID", 0);
      const emptyArray = [];
      localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
      localStorage.setItem("meetingTitle", "");
    }

    localStorage.setItem("isTrial", response.isTrial);

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
        ]
      : [];
    let LocalAdminRoutes = response.hasAdminRights
      ? [
          { name: "Admin", id: 200 },
          { name: "Admin", id: 201 },
          { name: "faq's", id: 207 },
          { name: "", id: 202 },
          { name: "ManageUsers", id: 203 },
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
          { name: "groups", id: 16 },
          { name: "committee", id: 17 },
          { name: "resolution", id: 18 },
          { name: "signatureviewer", id: 19 },
          { name: "documentViewer", id: 20 }
        );
      }
      if (response.hasAdminRights) {
        LocalAdminRoutes.push(
          { name: "changePassword", id: 204 },
          { name: "OrganizationlevelConfigUM", id: 205 },
          { name: "PakageDetailsUserManagement", id: 206 },
          { name: "CustomerInformation", id: 208 },
          { name: "AddUsers", id: 26 },
          { name: "loginreport", id: 35 }
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
        LocalAdminRoutes.push(
          { name: "Admin", id: 200 },
          { name: "Admin", id: 201 },
          { name: "", id: 202 },
          { name: "ManageUsers", id: 203 },
          { name: "changePassword", id: 204 },
          { name: "OrganizationlevelConfigUM", id: 205 },
          { name: "PakageDetailsUserManagement", id: 206 },
          { name: "faq's", id: 207 },
          { name: "CustomerInformation", id: 208 },

          { name: "AddUsersUsermanagement", id: 26 },
          { name: "PackageDetailsUserManagement", id: 28 },
          { name: "CancelSubscriptionUserManagement", id: 29 },
          { name: "deleteorganizationUserMangement", id: 30 },
          { name: "Summary", id: 34 },
          { name: "PayOutstanding", id: 34 },
          { name: "PaymentHistory", id: 36 },
          { name: "PaymentHistoryusermanagement", id: 37 },
          { name: "loginreport", id: 35 }
        );
      }
    }

    localStorage.setItem("LocalUserRoutes", JSON.stringify(LocalUserRoutes));
    localStorage.setItem("LocalAdminRoutes", JSON.stringify(LocalAdminRoutes));
  } catch (error) {
    console.error("Error processing login response:", error);
  }
}

// Features IDs Check Fucntion
export function checkFeatureIDAvailability(id) {
  console.log(id, "ididid");
  let packageID = localStorage.getItem("packageFeatureIDs");

  if (packageID) {
    packageID = packageID.replace(/,\s*\.\.\.\]$/, "]");

    let idsArray;
    try {
      idsArray = JSON.parse(packageID);
    } catch (e) {
      console.error("Error parsing packageFeatureIDs from localStorage:", e);
      return false;
    }
    console.log(idsArray.includes(id), "ididid");

    return idsArray.includes(id);
  } else {
    return false;
  }
}
