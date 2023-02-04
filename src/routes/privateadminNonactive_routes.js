import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateAdminRouteNonActive = () => {
  let Blur = localStorage.getItem("blur");

  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");
  const token = JSON.parse(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    RoleID === "1" && (Blur != undefined || Blur != null) ? true : null
  );
  console.log("PrivateAdmin", currentUser && token);
  return currentUser && token ? <Outlet /> : <Navigate to="*" />;
};

export default PrivateAdminRouteNonActive;
