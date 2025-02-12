import React, { useState, useEffect, useRef } from "react";
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
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  cleareMessage,
  validateStringOTPEmail_Api,
} from "../../../store/actions/Auth2_actions";
import { Notification } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import { LoginFlowRoutes } from "../../../store/actions/UserManagementActions";
import VerificationCodeThree from "../organizationRegister/2FA/VerficationCodeThree/VerificationCodeThree";
import Helper from "../../../commen/functions/history_logout";
import { mqttConnection } from "../../../commen/functions/mqttconnection";
import { useNavigate } from "react-router-dom";
import VerificationIphone from "../organizationRegister/2FA/VerificationIphone/VerificationIphone";
import { showMessage } from "../../../components/elements/snack_bar/utill";

const UserManagementProcess = () => {
  // Define setCurrentStep function
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUrl = window.location.href.split("?verifyOTPaction=")[1];
  let userManagementRoute = localStorage.getItem("LoginFlowPageRoute");

  const UserMangementReducerdefaultRoutingValue = useSelector(
    (state) => state.UserMangementReducer.defaultRoutingValue
  );

  const AuthreducerEmailValidationResponseMessage = useSelector(
    (state) => state.Authreducer.EmailValidationResponseMessage
  );

  const AuthreducerEnterPasswordResponseMessage = useSelector(
    (state) => state.Authreducer.EnterPasswordResponseMessage
  );

  const AuthreducerVerifyOTPEmailResponseMessage = useSelector(
    (state) => state.Authreducer?.VerifyOTPEmailResponseMessage
  );

  const AuthreducerAuthenticateAFAResponseMessage = useSelector(
    (state) => state.Authreducer?.AuthenticateAFAResponseMessage
  );

  //state to show snackbar
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
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
        console.log("LoginFlowPageRoute");
        if (storedStep) {
          console.log("LoginFlowPageRoute");
          dispatch(LoginFlowRoutes(storedStep));
        }
      } else {
        console.log("LoginFlowPageRoute");
        let commingfromSignFlow = localStorage.getItem("commingfromSignFlow");
        if (commingfromSignFlow === null) {
          localStorage.setItem("LoginFlowPageRoute", 1);
          // setStoredStep(1);
          dispatch(LoginFlowRoutes(1));
        } else {
          dispatch(LoginFlowRoutes(storedStep));
        }
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
    if (userManagementRoute === null) {
      console.log("LoginFlowPageRoute", userManagementRoute);
      localStorage.setItem("LoginFlowPageRoute", 1);
    }
  }, [userManagementRoute]);

  useEffect(() => {
    if (
      AuthreducerEmailValidationResponseMessage !== "" &&
      AuthreducerEmailValidationResponseMessage !==
        t("Users-password-is-created")
    ) {
      showMessage(
        AuthreducerEmailValidationResponseMessage,
        "success",
        setOpen
      );
      dispatch(cleareMessage());
    } else if (
      AuthreducerEnterPasswordResponseMessage !== "" &&
      AuthreducerEnterPasswordResponseMessage !== t("2fa-enabled") &&
      AuthreducerEnterPasswordResponseMessage !== undefined &&
      AuthreducerEnterPasswordResponseMessage !==
        t("The-user-is-not-an-admin-user")
    ) {
      showMessage(AuthreducerEnterPasswordResponseMessage, "success", setOpen);
      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [
    AuthreducerEmailValidationResponseMessage,
    AuthreducerEnterPasswordResponseMessage,
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
              navigate("/Diskus/Meeting/Useravailabilityformeeting");
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
    if (newClient !== null && newClient !== "" && newClient !== undefined) {
      newClient.onMessageArrived = onMessageArrived;
    } else {
      let userID = localStorage.getItem("userID");
      if (userID !== null) {
        mqttConnection(userID, dispatch);
      }
    }
  }, [Helper.socket]);

  //User Password Verification After forget password
  useEffect(() => {
    if (
      AuthreducerVerifyOTPEmailResponseMessage !== "" &&
      AuthreducerVerifyOTPEmailResponseMessage !== undefined
    ) {
      showMessage(AuthreducerVerifyOTPEmailResponseMessage, "success", setOpen);
      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [AuthreducerVerifyOTPEmailResponseMessage]);

  useEffect(() => {
    if (
      AuthreducerAuthenticateAFAResponseMessage !== "" &&
      AuthreducerAuthenticateAFAResponseMessage !== undefined
    ) {
      showMessage(
        AuthreducerAuthenticateAFAResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [AuthreducerAuthenticateAFAResponseMessage]);

  let componentToRender;
  console.log(
    UserMangementReducerdefaultRoutingValue,
    { storedStep, userManagementRoute },
    "storedStepstoredStep"
  );

  if (UserMangementReducerdefaultRoutingValue === 1) {
    componentToRender = <SignInComponent />;
  } else if (UserMangementReducerdefaultRoutingValue === 2) {
    componentToRender = <PasswordVerification />;
  } else if (UserMangementReducerdefaultRoutingValue === 3) {
    componentToRender = <VerifyOTPUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 4) {
    componentToRender = <TwoFactorVerifyUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 5) {
    componentToRender = <TapOptions />;
  } else if (UserMangementReducerdefaultRoutingValue === 6) {
    componentToRender = <VerificationEmailAndNumber />;
  } else if (UserMangementReducerdefaultRoutingValue === 7) {
    componentToRender = <VerifyDeniedUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 8) {
    componentToRender = <DeviceFor2FAVerify />;
  } else if (UserMangementReducerdefaultRoutingValue === 9) {
    componentToRender = <SignUpOrganizationUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 10) {
    componentToRender = <ForgotPasswordUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 11) {
    componentToRender = <PasswordCreationUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 12) {
    componentToRender = <ForgotPasswordVerificationUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 13) {
    componentToRender = <TwoFactorMultipleDevices />;
  } else if (UserMangementReducerdefaultRoutingValue === 14) {
    componentToRender = <VerificationCodeThree />;
  } else if (UserMangementReducerdefaultRoutingValue === 15) {
    componentToRender = <VerificationIphone />;
  } else {
    componentToRender = null;
    console.log("Errorr in route");
  }

  return (
    <>
      {componentToRender}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default UserManagementProcess;
