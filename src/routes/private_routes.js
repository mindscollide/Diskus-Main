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
  console.log("PrivateAdmin", currentUser && token);

  return currentUser && token ? <Outlet /> : <Navigate to="*" />;
};
export default PrivateRoutes;
