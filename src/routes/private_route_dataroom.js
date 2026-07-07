import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteDataroom = () => {
  let DataRoomEmailValue = localStorage.getItem("DataRoomEmail");
  let Blur = localStorage.getItem("blur");

  let RoleID = localStorage.getItem("roleID");
  const [currentUser, setCurrentUser] = useState(
    RoleID === "3" && (Blur === undefined || Blur === null) ? true : null
  );
  const token =
    localStorage.getItem("token") !== undefined &&
    localStorage.getItem("token") !== null
      ? JSON.parse(localStorage.getItem("token"))
      : "";
  
  return DataRoomEmailValue && currentUser && token ? (
    <Outlet />
  ) : (
    <Navigate to={"/Diskus/"} />
  );
};
export default PrivateRouteDataroom;
