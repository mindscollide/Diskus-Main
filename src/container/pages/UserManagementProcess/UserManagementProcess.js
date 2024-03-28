import React, { useState, useEffect } from "react";
import SignInComponent from "../UserMangement/SignInUserManagement/SignInUserManagement";
import PasswordVerification from "../UserMangement/PasswordVerification/PasswordVerification";
import VerifyOTPUM from "../UserMangement/VerifyOTPUM/VerifyOTPUM";
import TwoFactorVerifyUM from "../UserMangement/2FA Verification/TwoFactorVerifyUM";
import TapOptions from "../UserMangement/2FA Verification/2FA Tap Options/TapOptions";
import VerificationEmailAndNumber from "../UserMangement/2FA Verification/VerificationEmailAndNumber/VerificationEmailAndNumber";
import VerifyDeniedUM from "../UserMangement/2FA Verification/VerifyDeniedUM/VerifyDeniedUM";
import DeviceFor2FAVerify from "../UserMangement/2FA Verification/DevicesFor2FAVerify/DeviceFor2FAVerify";
import SignUpOrganizationUM from "../UserMangement/SignUpOrganizationUM/SignUpOrganizationUM";
import ForgotPasswordUM from "../UserMangement/ForgotPassword/ForgotPasswordUM";
import PasswordCreationUM from "../UserMangement/PasswordCreationUM/PasswordCreationUM";
import ForgotPasswordVerificationUM from "../UserMangement/ForgotPasswordVerification/ForgotPasswordVerificationUM";
import TwoFactorMultipleDevices from "../UserMangement/2FA Verification/TwoFactorMultipleDevices/TwoFactorMultipleDevices";

const UserManagementProcess = () => {
  // Define setCurrentStep function
  const setCurrentStep = (step) => {
    localStorage.setItem("currentStep", step);
    setCurrentStepValue(step);
  };

  // Retrieve currentStep value from localStorage, default to 1 if not found
  const [currentStep, setCurrentStepValue] = useState(() => {
    return parseInt(localStorage.getItem("currentStep")) || 1;
  });

  let componentToRender;

  if (currentStep === 1) {
    componentToRender = <SignInComponent setCurrentStep={setCurrentStep} />;
  } else if (currentStep === 2) {
    componentToRender = (
      <PasswordVerification setCurrentStep={setCurrentStep} />
    );
  } else if (currentStep === 3) {
    componentToRender = <VerifyOTPUM />;
  } else if (currentStep === 4) {
    componentToRender = <TwoFactorVerifyUM setCurrentStep={setCurrentStep} />;
  } else if (currentStep === 5) {
    componentToRender = <TapOptions />;
  } else if (currentStep === 6) {
    componentToRender = (
      <VerificationEmailAndNumber setCurrentStep={setCurrentStep} />
    );
  } else if (currentStep === 7) {
    componentToRender = <VerifyDeniedUM />;
  } else if (currentStep === 8) {
    componentToRender = <DeviceFor2FAVerify setCurrentStep={setCurrentStep} />;
  } else if (currentStep === 9) {
    componentToRender = <SignUpOrganizationUM />;
  } else if (currentStep === 10) {
    componentToRender = <ForgotPasswordUM setCurrentStep={setCurrentStep} />;
  } else if (currentStep === 11) {
    componentToRender = <PasswordCreationUM setCurrentStep={setCurrentStep} />;
  } else if (currentStep === 12) {
    componentToRender = (
      <ForgotPasswordVerificationUM setCurrentStep={setCurrentStep} />
    );
  } else if (currentStep === 13) {
    componentToRender = (
      <TwoFactorMultipleDevices setCurrentStep={setCurrentStep} />
    );
  } else {
    componentToRender = null;
  }

  return componentToRender;
};

export default UserManagementProcess;
