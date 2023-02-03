import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateAdminRoute = () => {
  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");
  const token = JSON.parse(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    RoleID === "1" || RoleID === "2" ? true : null
  );
  return currentUser && token ? <Outlet /> : <Navigate to="*" />;
};

export default PrivateAdminRoute;
