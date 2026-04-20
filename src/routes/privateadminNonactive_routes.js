/**
 * @file privateadminNonactive_routes.js
 * @description Route guard for **admin** pages when the account is in a
 * "non-active" (blurred/restricted) state.
 *
 * Accepts users with `roleID === "4"` (organisation admin) or `"1"`
 * (super-admin) whose `blur` value is defined (non-null).  Identical 2-FA gate
 * logic to `PrivateNonActive`.
 */
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Route guard for non-active admin accounts (roleID 1 or 4).
 *
 * @returns {JSX.Element} `<Outlet />` when conditions pass, or
 *   `<Navigate to="*" />`.
 */
const PrivateAdminRouteNonActive = () => {
  let Blur = localStorage.getItem("blur");

  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");
  const token = JSON.parse(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    (RoleID === "4" || RoleID === "1") && (Blur != undefined || Blur != null)
      ? true
      : null
  );
  let TwoFA = JSON.parse(localStorage.getItem("2fa"));
  let TowApproval = JSON.parse(localStorage.getItem("TowApproval"));
  const [twoFaAproval, setTwoFaAproval] = useState(
    TwoFA != undefined &&
      TwoFA != null &&
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

  return currentUser && token && twoFaAproval ? (
    <Outlet />
  ) : (
    <Navigate to="*" />
  );
};

export default PrivateAdminRouteNonActive;
