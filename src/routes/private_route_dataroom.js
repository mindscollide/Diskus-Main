/**
 * @file private_route_dataroom.js
 * @description Specialised route guard for the Data Room deep-link flow.
 *
 * When a user clicks a Data Room share link in an email, `private_routes.js`
 * stores the full URL under `localStorage.DataRoomEmail`.  This guard then
 * verifies three conditions before allowing the Data Room page to render:
 *  1. `DataRoomEmail` is present in localStorage (came from a valid share link).
 *  2. `roleID === "3"` (participant) with `blur === null` (active account).
 *  3. A valid `token` is present.
 *
 * If any condition fails the user is redirected to `/Diskus/` (dashboard).
 */
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Route guard that allows access to the Data Room only when all three
 * preconditions (share-link token, role, and auth token) are met.
 *
 * @returns {JSX.Element} `<Outlet />` when authorised, or
 *   `<Navigate to="/Diskus/" />`.
 */
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
  console.log(
    DataRoomEmailValue && currentUser && token,
    {
      DataRoomEmailValue,
      currentUser,
      token,
    },
    "PrivateRouteDataroomPrivateRouteDataroom"
  );
  return DataRoomEmailValue && currentUser && token ? (
    <Outlet />
  ) : (
    <Navigate to={"/Diskus/"} />
  );
};
export default PrivateRouteDataroom;
