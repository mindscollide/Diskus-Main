import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoutes = () => {
  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");

  const [currentUser, setCurrentUser] = useState(RoleID === "3" ? true : null);
  const token = JSON.parse(localStorage.getItem("token"));

  return currentUser && token ? <Outlet /> : <Navigate to="*" />;
};
export default PrivateRoutes;
