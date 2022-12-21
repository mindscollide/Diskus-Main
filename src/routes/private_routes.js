// import React from "react";
// import { Outlet, Route, Navigate } from "react-router-dom";

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const token = JSON.parse(localStorage.getItem("token"));
//   return (
//     <Route
//       {...rest}
//       render={(props) => {
//         return token ? <Outlet {...props} /> : <Navigate to="/" />;
//       }}
//     />
//   );
// };

import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoutes = () => {
  let currentUserID = localStorage.getItem("UserID");
  const [currentUser, setCurrentUser] = useState(currentUserID !== "187" ? true : null)
  const token = JSON.parse(localStorage.getItem("token"));

  return currentUser && token ? <Outlet /> : <Navigate to="*" />;
};
export default PrivateRoutes;
