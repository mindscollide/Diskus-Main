import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
const PrivateRoutes = () => {
  const currentUrl = window.location.href;
  const location = useLocation();
  const allowedRoutes = JSON.parse(localStorage.getItem("LocalRoutes") || "[]");
  const currentPath = location.pathname;
  console.log("allowedRoutes",allowedRoutes)
  useEffect(() => {
    if (
      currentUrl.includes("DisKus/Meeting/Useravailabilityformeeting?action=")
    ) {
      const parts = currentUrl.split("?action=");
      // Save something in local storage if the condition is true
      if (parts.length === 2) {
        const remainingString = parts[1];

        // Save it to state or local storage as needed
        localStorage.setItem("RSVP", remainingString);
      } else {
        localStorage.clear("RSVP");
      }
    }
    if (currentUrl.includes("DisKus/dataroom?action=")) {
      // localStorage.setItem("DataRoomEmail", currentUrl);

      const parts = currentUrl.split("?action=");
      // Save something in local storage if the condition is true
      if (parts.length === 2) {
        const remainingString = parts[1];

        // Save it to state or local storage as needed
        localStorage.setItem("DataRoomEmail", currentUrl);
      } else {
        localStorage.clear("DataRoomEmail");
      }
    }
  }, [currentUrl]);
  let Blur = localStorage.getItem("blur");
  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");
  const token =
    localStorage.getItem("token") !== undefined &&
    localStorage.getItem("token") !== null
      ? localStorage.getItem("token")
      : "";
  let TwoFA = JSON.parse(localStorage.getItem("2fa"));
  let TowApproval = JSON.parse(localStorage.getItem("TowApproval"));
  // const [twoFaAproval, setTwoFaAproval] = useState(
  //   TwoFA === true &&
  //     TowApproval !== undefined &&
  //     TowApproval !== null &&
  //     TowApproval === true
  //     ? true
  //     : (TwoFA === undefined || TwoFA === null) &&
  //       (TowApproval === undefined || TowApproval === null)
  //     ? true
  //     : false
  // );
  const [currentUser, setCurrentUser] = useState(
    RoleID === "4" && (Blur === undefined || Blur === null) ? true : null
  );

  return currentUser && token ? (
    <Outlet />
  ) : (
    <Navigate
      to={
        currentUrl !== "" &&
        (currentUrl.includes(
          "DisKus/Meeting/Useravailabilityformeeting?action="
        ) ||
          currentUrl.includes("DisKus/dataroom?action="))
          ? "/"
          : "*"
      }
    />
  );
};
export default PrivateRoutes;
