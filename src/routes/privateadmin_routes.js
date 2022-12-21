import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom'

const PrivateAdminRoute = () => {
    let currentUserID = localStorage.getItem("UserID");
    const token = JSON.parse(localStorage.getItem("token"));
    const [currentUser, setCurrentUser] = useState(currentUserID === "187" ? true : null)
    console.log("currentUsercurrentUsercurrentUser", currentUser)
    return currentUser && token ? <Outlet /> : <Navigate to="*" />
}

export default PrivateAdminRoute