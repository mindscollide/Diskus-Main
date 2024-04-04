import React, { useState, useEffect } from "react";
import SignUpOrganizationUM from "../UserMangement/SignUpOrganizationUM/SignUpOrganizationUM";
import VerifyOTPUM from "../UserMangement/VerifyOTPUM/VerifyOTPUM";
import PakageDetailsUserManagement from "../UserMangement/PakageDetailsUserManagement/PakageDetailsUserManagement";
import BillingMethodUsermanagement from "../UserMangement/BillingMethodUserManagement/BillingMethodUsermanagement";
import PasswordCreationUM from "../UserMangement/PasswordCreationUM/PasswordCreationUM";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { LoginFlowRoutes } from "../../../store/actions/UserManagementActions";

const SignupProcessUserManagement = () => {
  const { UserMangementReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const location = useLocation();
  let currentStage = Number(localStorage.getItem("signupCurrentPage"))
    ? Number(localStorage.getItem("signupCurrentPage"))
    : 1;
  const [isFreetrail, setFreetrail] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);

  useEffect(() => {
    if (location.state !== null) {
      if (location.state?.freeTrail) {
        setFreetrail(true);
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (currentStage !== null) {
      setCurrentPage(currentStage);
      localStorage.setItem("signupCurrentPage", currentStage);
    }
  }, [currentStage]);

  //Updating the state of the local storage routes pages
  useEffect(() => {
    localStorage.removeItem("LoginFlowPageRoute");
    dispatch(LoginFlowRoutes(null));
    try {
      if (UserMangementReducer.defaultRoutingValue) {
        setCurrentPage(UserMangementReducer.defaultRoutingValue);
      }
    } catch {}
  }, [UserMangementReducer.defaultRoutingValue]);

  let SignupComponent;
  if (currentStage === 1) {
    SignupComponent = <PakageDetailsUserManagement />;
  } else if (currentStage === 2) {
    SignupComponent = <SignUpOrganizationUM />;
  } else if (currentStage === 3) {
    SignupComponent = <VerifyOTPUM />;
  } else if (currentStage === 4) {
    SignupComponent = <PasswordCreationUM isFreetrail={isFreetrail} />;
  } else if (currentStage === 5) {
    SignupComponent = <BillingMethodUsermanagement />;
  } else {
    SignupComponent = null;
    console.log("Errorr in route");
  }

  return SignupComponent;
};

export default SignupProcessUserManagement;
