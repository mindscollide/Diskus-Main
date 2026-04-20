/**
 * @file PrivateNonActive.js
 * @description Route guard for user pages when the account is in a
 * "non-active" (blurred/restricted) state.
 *
 * Complement to `PrivateRoutes`: where `PrivateRoutes` accepts users whose
 * `blur` value is `null` (fully active), this guard accepts users whose `blur`
 * value is **defined and non-null** — i.e. accounts that exist but are
 * restricted/suspended.
 *
 * Auth logic:
 *  - `roleID` must be `"3"` (participant) or `"4"` (admin).
 *  - `blur` must be defined (non-null) to indicate the non-active state.
 *  - `token` must be truthy.
 *  - Optional 2-FA gate identical to `PrivateAdminRoute`.
 */
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Route guard for non-active (restricted) user accounts.
 *
 * @returns {JSX.Element} `<Outlet />` when conditions pass, or
 *   `<Navigate to="*" />`.
 */
const PrivateNonActive = () => {
  let Blur = localStorage.getItem("blur");
  let RoleID = localStorage.getItem("roleID");
  const token = JSON.parse(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    (RoleID === "3" || RoleID === "4") && (Blur != undefined || Blur != null) ? true : null
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

export default PrivateNonActive;
