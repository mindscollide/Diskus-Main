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
import {
  cleareMessage,
  validateStringOTPEmail_Api,
} from "../../../store/actions/Auth2_actions";
import { Notification } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import { cleareChangePasswordMessage } from "../../../store/actions/Auth_Forgot_Password";
import { LoginFlowRoutes } from "../../../store/actions/UserManagementActions";
import VerificationCodeThree from "../organizationRegister/2FA/VerficationCodeThree/VerificationCodeThree";
import Helper from "../../../commen/functions/history_logout";
import { mqttConnection } from "../../../commen/functions/mqttconnection";
import { useLocation, useNavigate } from "react-router-dom";
import VerificationIphone from "../organizationRegister/2FA/VerificationIphone/VerificationIphone";

const UserManagementProcess = () => {
  // Define setCurrentStep function
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUrl = window.location.href.split("?verifyOTPaction=")[1];
  console.log(currentUrl, "currentUrlcurrentUrlcurrentUrl");
  let userManagementRoute = Number(localStorage.getItem("LoginFlowPageRoute"));

  const { UserMangementReducer, Authreducer } = useSelector((state) => state);

  //state to show snackbar
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [storedStep, setStoredStep] = useState(
    Number(localStorage.getItem("LoginFlowPageRoute"))
  );

  // Retrieve currentStep value from localStorage, default to 1 if not found
  // let storedStep = Number(localStorage.getItem("LoginFlowPageRoute"));
  useEffect(() => {
    if (currentUrl === undefined) {
      // Retrieve current step from local storage
      if (performance.navigation.type === PerformanceNavigation.TYPE_RELOAD) {
        if (storedStep) {
          dispatch(LoginFlowRoutes(storedStep));
        }
      } else {
        console.log("LoginFlowPageRoute");
        localStorage.setItem("LoginFlowPageRoute", 1);
        setStoredStep(1);
        dispatch(LoginFlowRoutes(1));
      }
    }
  }, []);

  useEffect(() => {
    if (currentUrl !== undefined) {
      let Data = { EncryptedString: currentUrl };
      dispatch(validateStringOTPEmail_Api(Data, navigate, t, setStoredStep));
    }
  }, [currentUrl]);

  useEffect(() => {
    if (UserMangementReducer.defaultRoutingValue) {
      // Update local storage with the current step
      // localStorage.setItem(
      //   "LoginFlowPageRoute",
      //   UserMangementReducer.defaultRoutingValue
      // );
    }
  }, [UserMangementReducer.defaultRoutingValue]);

  useEffect(() => {
    if (userManagementRoute !== null) {
      setStoredStep(userManagementRoute);
    } else {
      setStoredStep(1);
      localStorage.setItem("LoginFlowPageRoute", 1);
    }
  }, [userManagementRoute]);

  useEffect(() => {
    if (
      Authreducer.EmailValidationResponseMessage != "" &&
      Authreducer.EmailValidationResponseMessage !=
        t("Users-password-is-created")
    ) {
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
      Authreducer.EnterPasswordResponseMessage !=
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

  //MQTT
  const onMessageArrived = (msg) => {
    let data = JSON.parse(msg.payloadString);
    let roleID = parseInt(localStorage.getItem("roleID"));
    let isFirstLogin = localStorage.getItem("isFirstLogin");

    console.log("message arrived", data);
    if (
      data.payload.message
        .toLowerCase()
        .includes("2FA_VERIFIED_FROM_DEVICE".toLowerCase())
    ) {
      localStorage.setItem("TowApproval", true);

      if (roleID === 1 || roleID === 2) {
        navigate("/Admin/");
      } else {
        console.log("message arrived");
        if (isFirstLogin != undefined) {
          if (isFirstLogin === true) {
            navigate("/onboard");
          } else {
            let RSVP = localStorage.getItem("RSVP");
            if (RSVP !== undefined && RSVP !== null) {
              navigate("/DisKus/Meeting/Useravailabilityformeeting");
            } else {
              if (
                localStorage.getItem("RSVP") !== null &&
                localStorage.getItem("RSVP") !== undefined
              ) {
                navigate("/Diskus/Meeting/Useravailabilityformeeting");
              } else {
                navigate("/Diskus/");
              }
            }
          }
        }
      }
    } else if (
      data.payload.message.toLowerCase() ===
      "2FA_VERIFIED_NOT_FROM_DEVICE".toLowerCase()
    ) {
      localStorage.setItem("TowApproval", false);
      console.log("TowApproval");
      dispatch(LoginFlowRoutes(7));
    }
  };

  let newClient = Helper.socket;

  useEffect(() => {
    if (newClient != null && newClient != "" && newClient != undefined) {
      newClient.onMessageArrived = onMessageArrived;
    } else {
      let userID = localStorage.getItem("userID");
      if (userID !== null) {
        mqttConnection(userID, dispatch);
      }
    }
  }, [Helper.socket]);

  // console.log(Authreducer, "AuthreducerAuthreducerAuthreducer");
  //USer Password Verification After forget password
  useEffect(() => {
    if (
      Authreducer?.VerifyOTPEmailResponseMessage !== "" &&
      Authreducer?.VerifyOTPEmailResponseMessage !== undefined
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer?.VerifyOTPEmailResponseMessage,
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
  }, [Authreducer?.VerifyOTPEmailResponseMessage]);

  useEffect(() => {
    if (
      Authreducer?.AuthenticateAFAResponseMessage != "" &&
      Authreducer?.AuthenticateAFAResponseMessage != undefined
    ) {
      console.log(
        Authreducer.AuthenticateAFAResponseMessage,
        "AuthreducerAuthreducerAuthreducer"
      );

      setOpen({
        ...open,
        open: true,
        message: Authreducer?.AuthenticateAFAResponseMessage,
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
  }, [Authreducer?.AuthenticateAFAResponseMessage]);

  let componentToRender;
  console.log(
    UserMangementReducer.defaultRoutingValue,
    { storedStep, userManagementRoute },
    "storedStepstoredStep"
  );

  if (UserMangementReducer.defaultRoutingValue === 1 && storedStep === 1) {
    componentToRender = <SignInComponent />;
  } else if (UserMangementReducer.defaultRoutingValue === 2) {
    componentToRender = <PasswordVerification />;
  } else if (UserMangementReducer.defaultRoutingValue === 3) {
    componentToRender = <VerifyOTPUM />;
  } else if (UserMangementReducer.defaultRoutingValue === 4) {
    componentToRender = <TwoFactorVerifyUM />;
  } else if (UserMangementReducer.defaultRoutingValue === 5) {
    componentToRender = <TapOptions />;
  } else if (UserMangementReducer.defaultRoutingValue === 6) {
    componentToRender = <VerificationEmailAndNumber />;
  } else if (UserMangementReducer.defaultRoutingValue === 7) {
    componentToRender = <VerifyDeniedUM />;
  } else if (UserMangementReducer.defaultRoutingValue === 8) {
    componentToRender = <DeviceFor2FAVerify />;
  } else if (UserMangementReducer.defaultRoutingValue === 9) {
    componentToRender = <SignUpOrganizationUM />;
  } else if (UserMangementReducer.defaultRoutingValue === 10) {
    componentToRender = <ForgotPasswordUM />;
  } else if (UserMangementReducer.defaultRoutingValue === 11) {
    componentToRender = <PasswordCreationUM />;
  } else if (UserMangementReducer.defaultRoutingValue === 12) {
    componentToRender = <ForgotPasswordVerificationUM />;
  } else if (UserMangementReducer.defaultRoutingValue === 13) {
    componentToRender = <TwoFactorMultipleDevices />;
  } else if (UserMangementReducer.defaultRoutingValue === 14) {
    componentToRender = <VerificationCodeThree />;
  } else if (UserMangementReducer.defaultRoutingValue === 15) {
    componentToRender = <VerificationIphone />;
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
