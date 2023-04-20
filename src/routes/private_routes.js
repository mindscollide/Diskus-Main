import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoutes = () => {
  let Blur = localStorage.getItem("blur");
  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");

  const [currentUser, setCurrentUser] = useState(
    RoleID === "3" && (Blur === undefined || Blur === null) ? true : null
  );
  const token = JSON.parse(localStorage.getItem("token"));
  let TwoFA = JSON.parse(localStorage.getItem("2fa"));
  let TowApproval = JSON.parse(localStorage.getItem("TowApproval"));
  const [twoFaAproval, setTwoFaAproval] = useState(
    TwoFA != undefined &&TwoFA != null&&
      TwoFA === true &&
      TowApproval != undefined &&TowApproval != null &&
      TowApproval === true
      ? true
      : false
  );
  console.log("PrivateAdmin", currentUser && token);

  return currentUser && token &&twoFaAproval? <Outlet /> : <Navigate to="*" />;
};
export default PrivateRoutes;
