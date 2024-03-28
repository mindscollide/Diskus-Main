import React, { useState, useEffect } from "react";
import SignUpOrganizationUM from "../UserMangement/SignUpOrganizationUM/SignUpOrganizationUM";
import VerifyOTPUM from "../UserMangement/VerifyOTPUM/VerifyOTPUM";
import PakageDetailsUserManagement from "../UserMangement/PakageDetailsUserManagement/PakageDetailsUserManagement";
import BillingMethodUsermanagement from "../UserMangement/BillingMethodUserManagement/BillingMethodUsermanagement";
import PasswordCreationUM from "../UserMangement/PasswordCreationUM/PasswordCreationUM";

const SignupProcessUserManagement = () => {
  const [signupStep, setSignupStep] = useState(1);

  let SignupComponent;

  if (signupStep === 1) {
    SignupComponent = <SignUpOrganizationUM />;
  } else if (signupStep === 2) {
    SignupComponent = <VerifyOTPUM />;
  } else if (signupStep === 3) {
    SignupComponent = <PasswordCreationUM />;
  } else if (signupStep === 4) {
    SignupComponent = <BillingMethodUsermanagement />;
  } else {
    SignupComponent = null;
  }

  return SignupComponent;
};

export default SignupProcessUserManagement;
