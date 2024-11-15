import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateAdminRoute = () => {
  let Blur = localStorage.getItem("blur");
  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");
  const token = JSON.parse(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    (RoleID === "4" || RoleID === "1") && Blur === null ? true : null
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
console.log("twoFaAproval",TwoFA)
console.log("twoFaAproval",typeof TwoFA)
console.log("twoFaAproval",TowApproval)
console.log("twoFaAproval",typeof TowApproval)
console.log("twoFaAproval",twoFaAproval)
console.log("twoFaAproval",typeof twoFaAproval)
console.log("twoFaAproval",currentUser)
console.log("twoFaAproval",typeof currentUser)
  return currentUser && token && twoFaAproval ? (
    <Outlet />
  ) : (
    <Navigate to="*" />
  );
};

export default PrivateAdminRoute;
