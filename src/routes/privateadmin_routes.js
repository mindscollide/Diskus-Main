import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateAdminRoute = () => {
  let Blur = localStorage.getItem("blur");
  let currentUserID = localStorage.getItem("userID");
  let RoleID = localStorage.getItem("roleID");
  const token = JSON.parse(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    (RoleID === "1" || RoleID === "2") && Blur === undefined ? true : null
  );
  console.log("PrivateAdmin", currentUser && token);
  return currentUser && token ? <Outlet /> : <Navigate to="*" />;
};

export default PrivateAdminRoute;
