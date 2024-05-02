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
import SignupProcessUserManagement from "../SignUpProcessUserManagement/SignupProcessUserManagement";
import ForgotPasswordUM from "../UserMangement/ForgotPassword/ForgotPasswordUM";
import PasswordCreationUM from "../UserMangement/PasswordCreationUM/PasswordCreationUM";
import ForgotPasswordVerificationUM from "../UserMangement/ForgotPasswordVerification/ForgotPasswordVerificationUM";
import TwoFactorMultipleDevices from "../UserMangement/2FA Verification/TwoFactorMultipleDevices/TwoFactorMultipleDevices";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { cleareMessage } from "../../../store/actions/Auth2_actions";
import { Notification } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import { cleareChangePasswordMessage } from "../../../store/actions/Auth_Forgot_Password";

const UserManagementProcess = () => {
  // Define setCurrentStep function
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { UserMangementReducer, Authreducer, auth } = useSelector(
    (state) => state
  );

  //state to show snackbar
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  // Retrieve currentStep value from localStorage, default to 1 if not found
  const initialStep = Number(localStorage.getItem("LoginFlowPageRoute"));
  const validInitialStep =
    !isNaN(initialStep) && initialStep >= 1 && initialStep <= 13
      ? initialStep
      : 1;
  const [currentStep, setCurrentStepValue] = useState(validInitialStep);
  useEffect(() => {
    try {
      localStorage.removeItem("signupCurrentPage");
      if (UserMangementReducer.defaultRoutingValue) {
        setCurrentStepValue(UserMangementReducer.defaultRoutingValue);
      }
    } catch {}
  }, [UserMangementReducer.defaultRoutingValue]);

  useEffect(() => {
    if (Authreducer.EmailValidationResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.EmailValidationResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (
      Authreducer.EnterPasswordResponseMessage != "" &&
      Authreducer.EnterPasswordResponseMessage != t("2fa-enabled") &&
      Authreducer.EnterPasswordResponseMessage != undefined &&
      Authreducer.EnterPasswordResponseMessage !==
        t("The-user-is-not-an-admin-user")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.EnterPasswordResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);
      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [
    Authreducer.EmailValidationResponseMessage,
    Authreducer.EnterPasswordResponseMessage,
  ]);

  //USer Password Verification After forget password
  useEffect(() => {
    if (Authreducer.VerifyOTPEmailResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.VerifyOTPEmailResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [Authreducer.VerifyOTPEmailResponseMessage]);

  //For Response messeges
  useEffect(() => {
    if (auth.ResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: auth.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareChangePasswordMessage());
    } else {
      dispatch(cleareChangePasswordMessage());
    }
  }, [auth.ResponseMessage]);

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
  } else if (currentStep === 9) {
    componentToRender = <SignUpOrganizationUM />;
  } else if (currentStep === 10) {
    componentToRender = <ForgotPasswordUM />;
  } else if (currentStep === 11) {
    componentToRender = <PasswordCreationUM />;
  } else if (currentStep === 12) {
    componentToRender = <ForgotPasswordVerificationUM />;
  } else if (currentStep === 13) {
    componentToRender = <TwoFactorMultipleDevices />;
  } else {
    componentToRender = null;
    console.log("Errorr in route");
  }

  return (
    <>
      {componentToRender}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default UserManagementProcess;
