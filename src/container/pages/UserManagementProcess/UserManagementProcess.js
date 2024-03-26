import React, { useState } from "react";
import SignInComponent from "../UserMangement/SignInUserManagement/SignInUserManagement";
import PasswordVerification from "../UserMangement/PasswordVerification/PasswordVerification";
import VerifyOTPUM from "../UserMangement/VerifyOTPUM/VerifyOTPUM";
import TwoFactorVerifyUM from "../UserMangement/2FA Verification/TwoFactorVerifyUM";
import TapOptions from "../UserMangement/2FA Verification/2FA Tap Options/TapOptions";
import VerificationEmailAndNumber from "../UserMangement/2FA Verification/VerificationEmailAndNumber/VerificationEmailAndNumber";

const UserManagementProcess = () => {
  const [currentStep, setCurrentStep] = useState(6); // Start from step 1

  let componentToRender;

  if (currentStep === 1) {
    componentToRender = <SignInComponent />;
  } else if (currentStep === 2) {
    componentToRender = <PasswordVerification />;
  } else if (currentStep === 3) {
    componentToRender = <VerifyOTPUM />;
  } else if (currentStep === 4) {
    componentToRender = <TwoFactorVerifyUM />;
  } else if (currentStep === 5) {
    componentToRender = <TapOptions />;
  } else if (currentStep === 6) {
    componentToRender = <VerificationEmailAndNumber />;
  } else {
    componentToRender = null;
  }

  return componentToRender;
};

export default UserManagementProcess;
