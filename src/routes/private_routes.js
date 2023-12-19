import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoutes = () => {
  const currentUrl = window.location.href;
  useEffect(() => {
    if (
      currentUrl.includes("DisKus/Meeting/Useravailabilityformeeting?action=")
    ) {
      const parts = currentUrl.split("?action=");
      // Save something in local storage if the condition is true
      if (parts.length === 2) {
        const remainingString = parts[1];
        console.log("Remaining String:", remainingString);
        // Save it to state or local storage as needed
        localStorage.setItem("RSVP", remainingString);
      } else {
        localStorage.clear("RSVP");
      }
    } else if (currentUrl.includes("DisKus/Dataroom/Sharing?action=")) {
      const parts = currentUrl.split("?action=");
      // Save something in local storage if the condition is true
      if (parts.length === 2) {
        const remainingString = parts[1];
        console.log("Remaining String:", remainingString);
        // Save it to state or local storage as needed
        localStorage.setItem("DataRoomEmail", remainingString);
      } else {
        localStorage.clear("DataRoomEmail");
      }
    }
  }, [currentUrl]);
  let Blur = localStorage.getItem("blur");
  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");
  const token = JSON.parse(localStorage.getItem("token"));
  let TwoFA = JSON.parse(localStorage.getItem("2fa"));
  let TowApproval = JSON.parse(localStorage.getItem("TowApproval"));
  const [twoFaAproval, setTwoFaAproval] = useState(
    TwoFA === true &&
      TowApproval != undefined &&
      TowApproval != null &&
      TowApproval === true
      ? true
      : (TwoFA === undefined || TwoFA === null) &&
        (TowApproval === undefined || TowApproval === null)
      ? true
      : false
  );
  const [currentUser, setCurrentUser] = useState(
    RoleID === "3" && (Blur === undefined || Blur === null) ? true : null
  );

  console.log("PrivateAdmin", TwoFA, TowApproval);

  return currentUser && token ? (
    <Outlet />
  ) : (
    <Navigate
      to={
        (currentUrl !== "" &&
          currentUrl.includes(
            "DisKus/Meeting/Useravailabilityformeeting?action="
          )) ||
        (currentUrl !== "" &&
          currentUrl.includes("DisKus/Dataroom/Sharing?action="))
          ? "/"
          : "*"
      }
    />
  );
};
export default PrivateRoutes;
