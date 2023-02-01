import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoutes = () => {
  let currentUserID = localStorage.getItem("userID");
  const [currentUser, setCurrentUser] = useState(
    currentUserID !== "187" ? true : null
  );
  const token = JSON.parse(localStorage.getItem("token"));

  return currentUser && token ? <Outlet /> : <Navigate to="*" />;
};
export default PrivateRoutes;
