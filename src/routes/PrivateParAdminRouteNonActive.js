import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateParAdminRouteNonActive = () => {
  let Blur = localStorage.getItem("blur");

  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");
  const token = JSON.parse(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    RoleID === "2" && (Blur != undefined || Blur != null) ? true : null
  );
  console.log("PrivateAdmin", RoleID === "1", Blur != undefined);
  return currentUser && token ? <Outlet /> : <Navigate to="*" />;
};

export default PrivateParAdminRouteNonActive;
