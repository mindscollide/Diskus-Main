import React, { useState } from "react";
import SignInComponent from "../UserMangement/SignInUserManagement/SignInUserManagement";
import PasswordVerification from "../UserMangement/PasswordVerification/PasswordVerification";
import VerifyOTPUM from "../UserMangement/VerifyOTPUM/VerifyOTPUM";
import TwoFactorVerifyUM from "../UserMangement/2FA Verification/TwoFactorVerifyUM";
import TapOptions from "../UserMangement/2FA Verification/2FA Tap Options/TapOptions";
import VerificationEmailAndNumber from "../UserMangement/2FA Verification/VerificationEmailAndNumber/VerificationEmailAndNumber";
import VerifyDeniedUM from "../UserMangement/2FA Verification/VerifyDeniedUM/VerifyDeniedUM";
import DeviceFor2FAVerify from "../UserMangement/2FA Verification/DevicesFor2FAVerify/DeviceFor2FAVerify";

const UserManagementProcess = () => {
  const [currentStep, setCurrentStep] = useState(8);

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
  } else if (currentStep === 7) {
    componentToRender = <VerifyDeniedUM />;
  } else if (currentStep === 8) {
    componentToRender = <DeviceFor2FAVerify />;
  } else {
    componentToRender = null;
  }

  return componentToRender;
};

export default UserManagementProcess;
