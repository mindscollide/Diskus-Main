/**
 * @file PrivateParAdminRouteNonActive.js
 * @description Route guard for **partial-admin** pages when the account is in
 * a "non-active" (blurred/restricted) state.
 *
 * Accepts users with `roleID === "2"` (partial admin) whose `blur` value is
 * defined (non-null), indicating a restricted-but-existent account.  The
 * optional two-factor gate is identical to the other non-active guards.
 */
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Route guard for non-active partial-admin accounts (roleID 2).
 *
 * @returns {JSX.Element} `<Outlet />` when conditions pass, or
 *   `<Navigate to="*" />`.
 */
const PrivateParAdminRouteNonActive = () => {
  let Blur = localStorage.getItem("blur");

  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");
  const token = JSON.parse(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    RoleID === "2" && (Blur != undefined || Blur != null) ? true : null
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

export default PrivateParAdminRouteNonActive;
