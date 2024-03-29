import React, { useState, useEffect } from "react";
import SignUpOrganizationUM from "../UserMangement/SignUpOrganizationUM/SignUpOrganizationUM";
import VerifyOTPUM from "../UserMangement/VerifyOTPUM/VerifyOTPUM";
import PakageDetailsUserManagement from "../UserMangement/PakageDetailsUserManagement/PakageDetailsUserManagement";
import BillingMethodUsermanagement from "../UserMangement/BillingMethodUserManagement/BillingMethodUsermanagement";
import PasswordCreationUM from "../UserMangement/PasswordCreationUM/PasswordCreationUM";
import { useLocation } from "react-router-dom";

const SignupProcessUserManagement = () => {
  const location = useLocation();
  console.log("location", location.state);
  console.log("location", location.state !== null?.freeTrail);
  console.log("location", location.state !== null ? 2 : 1);
  const [signupStep, setSignupStep] = useState(
    location.state && location.state?.freeTrail ? 2 : 1
  );

  let SignupComponent;
  if (signupStep === 1) {
    SignupComponent = (
      <PakageDetailsUserManagement setSignupStep={setSignupStep} />
    );
  } else if (signupStep === 2) {
    SignupComponent = <SignUpOrganizationUM setSignupStep={setSignupStep} />;
  } else if (signupStep === 3) {
    SignupComponent = <VerifyOTPUM setSignupStep={setSignupStep} />;
  } else if (signupStep === 4) {
    SignupComponent = (
      <PasswordCreationUM
        setSignupStep={setSignupStep}
        signupStep={signupStep}
      />
    );
  } else if (signupStep === 5) {
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
  console.lod(setSignupStep, "setSignupStepsetSignupStep");
};
