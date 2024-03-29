import React, { useEffect, useState } from "react";
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
  const [page, setPage] = useState(Number(localStorage.getItem("page")) || 1);

  console.log(page, "pagepagepagepage");

  let componentToRender;

  if (page === 1) {
    componentToRender = <SignInComponent />;
  } else if (page === 2) {
    componentToRender = <PasswordVerification />;
  } else if (page === 3) {
    componentToRender = <VerifyOTPUM />;
  } else if (page === 4) {
    componentToRender = <TwoFactorVerifyUM />;
  } else if (page === 5) {
    componentToRender = <TapOptions />;
  } else if (page === 6) {
    componentToRender = <VerificationEmailAndNumber />;
  } else if (page === 7) {
    componentToRender = <VerifyDeniedUM />;
  } else if (page === 8) {
    componentToRender = <DeviceFor2FAVerify />;
  } else if (page === 10) {
    componentToRender = <ForgotPasswordUM />;
  } else if (page === 11) {
    componentToRender = <PasswordCreationUM />;
  } else if (page === 12) {
    componentToRender = <ForgotPasswordVerificationUM />;
  } else if (page === 13) {
    componentToRender = <TwoFactorMultipleDevices />;
  } else {
    componentToRender = null;
  }

  return componentToRender;
};

export default UserManagementProcess;
