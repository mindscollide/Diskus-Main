import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateNonActive = () => {
  let Blur = localStorage.getItem("blur");
  let RoleID = localStorage.getItem("roleID");
  const token = JSON.parse(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    RoleID === "3" && (Blur != undefined || Blur != null) ? true : null
  );
  console.log("PrivateAdmin", currentUser && token);
  return currentUser && token ? <Outlet /> : <Navigate to="*" />;
};

export default PrivateNonActive;
