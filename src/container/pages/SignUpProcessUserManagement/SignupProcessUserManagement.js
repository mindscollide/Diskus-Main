import React, { useState, useEffect } from "react";
import SignUpOrganizationUM from "../UserMangement/SignUpOrganizationUM/SignUpOrganizationUM";
import VerifyOTPUM from "../UserMangement/VerifyOTPUM/VerifyOTPUM";
import PakageDetailsUserManagement from "../UserMangement/PakageDetailsUserManagement/PakageDetailsUserManagement";
import BillingMethodUsermanagement from "../UserMangement/BillingMethodUserManagement/BillingMethodUsermanagement";
import PasswordCreationUM from "../UserMangement/PasswordCreationUM/PasswordCreationUM";
import { useLocation } from "react-router-dom";

const SignupProcessUserManagement = () => {
  const location = useLocation();
  let currentStage = Number(localStorage.getItem("signupCurrentPage"));
  const [isFreetrail, setFreetrail] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  console.log("location", location.state);
  console.log("currentPage", currentStage);
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
    }
  }, [currentStage]);
  console.log("location", location.state !== null?.freeTrail);
  console.log("location", location.state !== null ? 2 : 1);

  let SignupComponent;
  if (currentStage === 1) {
    SignupComponent = <PakageDetailsUserManagement />;
  } else if (currentStage === 2) {
    SignupComponent = <SignUpOrganizationUM />;
  } else if (currentStage === 3) {
    SignupComponent = <VerifyOTPUM />;
  } else if (currentStage === 4) {
    SignupComponent = <PasswordCreationUM currentStage={currentStage} />;
  } else if (currentStage === 5) {
    SignupComponent = <BillingMethodUsermanagement />;
  } else {
    SignupComponent = null;
  }

  return SignupComponent;
};

export default SignupProcessUserManagement;

export const signupCurrentPageStep = (step, setSignupStep) => {
  localStorage.setItem("signupCurrentPage", step);
  setSignupStep(step);
  console.log(setSignupStep, "setSignupStepsetSignupStep");
};
