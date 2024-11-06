import React, { useState, useEffect } from "react";
import SignUpOrganizationUM from "../UserMangement/SignUpOrganizationUM/SignUpOrganizationUM";
import VerifyOTPUM from "../UserMangement/VerifyOTPUM/VerifyOTPUM";
import PakageDetailsUserManagement from "../UserMangement/PakageDetailsUserManagement/PakageDetailsUserManagement";
import BillingMethodUsermanagement from "../UserMangement/BillingMethodUserManagement/BillingMethodUsermanagement";
import PasswordCreationUM from "../UserMangement/PasswordCreationUM/PasswordCreationUM";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  LoginFlowRoutes,
  clearMessegesUserManagement,
  signUpFlowRoutes,
} from "../../../store/actions/UserManagementActions";
import { cleareMessage } from "../../../store/actions/Auth2_actions";
import { useTranslation } from "react-i18next";
import { Notification } from "../../../components/elements";
import Helper from "../../../commen/functions/history_logout";
import { mqttConnection } from "../../../commen/functions/mqttconnection";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../../components/elements/snack_bar/utill";

const SignupProcessUserManagement = () => {
  const UserMangementReducerdefaultRoutingValue = useSelector(
    (state) => state.UserMangementReducer.defaulSignUpRoute
  );

  const UserMangementReducerResponseMessage = useSelector(
    (state) => state.UserMangementReducer.ResponseMessage
  );

  const AuthreducerVerifyOTPEmailResponseMessage = useSelector(
    (state) => state.Authreducer.VerifyOTPEmailResponseMessage
  );

  const AuthreducerEnterPasswordResponseMessage = useSelector(
    (state) => state.Authreducer.EnterPasswordResponseMessage
  );

  const AuthreducerOrganizationCreateResponseMessage = useSelector(
    (state) => state.Authreducer.OrganizationCreateResponseMessage
  );

  const AuthreducerCreatePasswordResponseMessage = useSelector(
    (state) => state.Authreducer.CreatePasswordResponseMessage
  );

  const AuthreducerGetSelectedPackageResponseMessage = useSelector(
    (state) => state.Authreducer.GetSelectedPackageResponseMessage
  );

  const AuthreducerEmailValidationResponseMessage = useSelector(
    (state) => state.Authreducer.EmailValidationResponseMessage
  );

  const AuthreducerpasswordUpdateOnForgotPasswordMessege = useSelector(
    (state) => state.Authreducer.passwordUpdateOnForgotPasswordMessege
  );

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  let signUpUserManagementRoute = Number(localStorage.getItem("SignupFlowPageRoute"));

  // Retrieve currentStep value from localStorage, default to 1 if not found
  const [storedStep, setStoredStep] = useState(
    Number(localStorage.getItem("SignupFlowPageRoute"))
  );
  useEffect(() => {
    // Retrieve current step from local storage
    if (performance.navigation.type === PerformanceNavigation.TYPE_RELOAD) {
      console.log("SignupFlowPageRoute");
      if (storedStep) {
      console.log("SignupFlowPageRoute");
      dispatch(signUpFlowRoutes(storedStep));
      }
    } else {
      console.log("SignupFlowPageRoute");
      localStorage.setItem("SignupFlowPageRoute", 1);
      setStoredStep(1);
      dispatch(signUpFlowRoutes(1));
    }
  }, []);

  useEffect(() => {
    if (signUpUserManagementRoute !== null && signUpUserManagementRoute !== 0) {
        setStoredStep(signUpUserManagementRoute);
    } else {
      setStoredStep(1);
      localStorage.setItem("SignupFlowPageRoute", 1);
    }
  }, [signUpUserManagementRoute]);
        console.log("SignupFlowPageRoute",signUpUserManagementRoute,storedStep,UserMangementReducerdefaultRoutingValue);


  //For SnakBar Messeges

  //Verify OTP SignUp Process Response Messeges Controller
  useEffect(() => {
    if (
      AuthreducerVerifyOTPEmailResponseMessage !== "" &&
      AuthreducerVerifyOTPEmailResponseMessage !== undefined &&
      AuthreducerVerifyOTPEmailResponseMessage !== t("2fa-verification") &&
      AuthreducerVerifyOTPEmailResponseMessage !== t("2fa-enabled")
    ) {
      showMessage(AuthreducerVerifyOTPEmailResponseMessage, "success", setOpen);

      dispatch(cleareMessage());
    } else if (
      AuthreducerEnterPasswordResponseMessage !== "" &&
      AuthreducerEnterPasswordResponseMessage !== undefined &&
      AuthreducerEnterPasswordResponseMessage !== t("2fa-verification") &&
      AuthreducerEnterPasswordResponseMessage !== t("2fa-enabled")
    ) {
      showMessage(AuthreducerEnterPasswordResponseMessage, "success", setOpen);

      dispatch(cleareMessage());
    } else if (
      AuthreducerOrganizationCreateResponseMessage !== "" &&
      AuthreducerOrganizationCreateResponseMessage !== undefined &&
      AuthreducerOrganizationCreateResponseMessage !== t("2fa-verification") &&
      AuthreducerOrganizationCreateResponseMessage !== t("2fa-enabled")
    ) {
      showMessage(
        AuthreducerOrganizationCreateResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    } else if (
      AuthreducerCreatePasswordResponseMessage !== "" &&
      AuthreducerCreatePasswordResponseMessage !== undefined &&
      AuthreducerCreatePasswordResponseMessage !== t("2fa-verification") &&
      AuthreducerCreatePasswordResponseMessage !== t("2fa-enabled")
    ) {
      showMessage(AuthreducerCreatePasswordResponseMessage, "success", setOpen);
      dispatch(cleareMessage());
    } else if (
      AuthreducerGetSelectedPackageResponseMessage !== "" &&
      AuthreducerGetSelectedPackageResponseMessage !== undefined &&
      AuthreducerGetSelectedPackageResponseMessage !== t("2fa-verification") &&
      AuthreducerGetSelectedPackageResponseMessage !== t("2fa-enabled")
    ) {
      showMessage(
        AuthreducerGetSelectedPackageResponseMessage,
        "success",
        setOpen
      );
      dispatch(cleareMessage());
    } else if (
      AuthreducerEmailValidationResponseMessage !== "" &&
      AuthreducerEmailValidationResponseMessage !== undefined &&
      AuthreducerEmailValidationResponseMessage !== t("2fa-verification") &&
      AuthreducerEmailValidationResponseMessage !== t("2fa-enabled")
    ) {
      showMessage(
        AuthreducerEmailValidationResponseMessage,
        "success",
        setOpen
      );
      dispatch(cleareMessage());
    } else if (
      AuthreducerpasswordUpdateOnForgotPasswordMessege !== "" &&
      AuthreducerpasswordUpdateOnForgotPasswordMessege !== undefined &&
      AuthreducerpasswordUpdateOnForgotPasswordMessege !==
        t("2fa-verification") &&
      AuthreducerpasswordUpdateOnForgotPasswordMessege !== t("2fa-enabled")
    ) {
      showMessage(
        AuthreducerpasswordUpdateOnForgotPasswordMessege,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    } else {
    }
  }, [
    AuthreducerEnterPasswordResponseMessage,
    AuthreducerVerifyOTPEmailResponseMessage,
    AuthreducerOrganizationCreateResponseMessage,
    AuthreducerCreatePasswordResponseMessage,
    AuthreducerEmailValidationResponseMessage,
    AuthreducerGetSelectedPackageResponseMessage,
    AuthreducerpasswordUpdateOnForgotPasswordMessege,
  ]);

  //Password SignUp Process Response Messeges Controller
  useEffect(() => {
    if (AuthreducerVerifyOTPEmailResponseMessage !== "") {
      showMessage(AuthreducerVerifyOTPEmailResponseMessage, "success", setOpen);
      dispatch(cleareMessage());
    } else if (AuthreducerEnterPasswordResponseMessage !== "") {
      showMessage(AuthreducerEnterPasswordResponseMessage, "success", setOpen);
      dispatch(cleareMessage());
    } else if (AuthreducerOrganizationCreateResponseMessage !== "") {
      showMessage(
        AuthreducerOrganizationCreateResponseMessage,
        "success",
        setOpen
      );
      dispatch(cleareMessage());
    } else if (AuthreducerCreatePasswordResponseMessage !== "") {
      showMessage(AuthreducerCreatePasswordResponseMessage, "success", setOpen);
      dispatch(cleareMessage());
    } else if (AuthreducerGetSelectedPackageResponseMessage !== "") {
      showMessage(
        AuthreducerGetSelectedPackageResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    } else if (AuthreducerEmailValidationResponseMessage !== "") {
      console.log(
        AuthreducerEmailValidationResponseMessage,
        "EmailValidationResponseMessage"
      );
      showMessage(
        AuthreducerEmailValidationResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    } else {
    }
  }, [
    AuthreducerEnterPasswordResponseMessage,
    AuthreducerVerifyOTPEmailResponseMessage,
    AuthreducerOrganizationCreateResponseMessage,
    AuthreducerCreatePasswordResponseMessage,
    AuthreducerEmailValidationResponseMessage,
    AuthreducerGetSelectedPackageResponseMessage,
  ]);

  //Organization SignUp //SignUp Process Response Messeges Controller
  useEffect(() => {
    if (AuthreducerOrganizationCreateResponseMessage !== "") {
      showMessage(
        AuthreducerOrganizationCreateResponseMessage,
        "success",
        setOpen
      );
    }
  }, [AuthreducerOrganizationCreateResponseMessage]);

  //User Management PakageDetails Messeges SignUp Process Response Messeges Controller
  useEffect(() => {
    if (UserMangementReducerResponseMessage !== "") {
      showMessage(UserMangementReducerResponseMessage, "success", setOpen);
      dispatch(clearMessegesUserManagement());
    }
  }, [UserMangementReducerResponseMessage]);

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
    } else {
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
        mqttConnection(userID);
      }
    }
  }, [Helper.socket]);

  let SignupComponent;
  if (
    UserMangementReducerdefaultRoutingValue === 1 && storedStep === 1
  ) {
    SignupComponent = <PakageDetailsUserManagement />;
  } else if (UserMangementReducerdefaultRoutingValue === 2) {
    SignupComponent = <SignUpOrganizationUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 3) {
    SignupComponent = <VerifyOTPUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 4) {
    SignupComponent = <PasswordCreationUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 5) {
    SignupComponent = <BillingMethodUsermanagement />;
  } else {
    SignupComponent = null;
    console.log("Errorr in route");
  }

  return (
    <>
      {SignupComponent}

      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default SignupProcessUserManagement;
