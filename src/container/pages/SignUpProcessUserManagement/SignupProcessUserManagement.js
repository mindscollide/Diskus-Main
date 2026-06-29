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
import { getHomeRoute } from "../../../commen/functions/utils";
import { mqttConnection } from "../../../commen/functions/mqttconnection";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../../../components/elements/snack_bar/useSnackbar";

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
  const [show, SnackBar] = useSnackbar();
  let signUpUserManagementRoute = Number(
    localStorage.getItem("SignupFlowPageRoute")
  );

  // Retrieve currentStep value from localStorage, default to 1 if not found
  const [storedStep, setStoredStep] = useState(
    Number(localStorage.getItem("SignupFlowPageRoute"))
  );
  useEffect(() => {
    // Retrieve current step from local storage
    let freeTrialButton = localStorage.getItem("freeTrialButton");
    if (performance.navigation.type === PerformanceNavigation.TYPE_RELOAD) {
      if (storedStep) {
        localStorage.setItem("SignupFlowPageRoute", storedStep);
        dispatch(signUpFlowRoutes(storedStep));
      }
    } else {
      if (freeTrialButton === null) {
        if (UserMangementReducerdefaultRoutingValue) {
          localStorage.setItem(
            "SignupFlowPageRoute",
            UserMangementReducerdefaultRoutingValue
          );
          setStoredStep(UserMangementReducerdefaultRoutingValue);
          dispatch(signUpFlowRoutes(UserMangementReducerdefaultRoutingValue));
        } else {
          localStorage.setItem("SignupFlowPageRoute", 1);
          setStoredStep(1);
          dispatch(signUpFlowRoutes(1));
        }
      } else {
        dispatch(signUpFlowRoutes(storedStep));
        localStorage.setItem("SignupFlowPageRoute", storedStep);
      }
    }
  }, []);
  console.log(
    "SignupFlowPageRoute",
    signUpUserManagementRoute,
    storedStep,
    UserMangementReducerdefaultRoutingValue
  );

  //For SnakBar Messeges

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
                navigate(getHomeRoute());
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

  let SignupComponent;
  if (UserMangementReducerdefaultRoutingValue === 1 && storedStep === 1) {
    SignupComponent = <PakageDetailsUserManagement />;
  } else if (UserMangementReducerdefaultRoutingValue === 2) {
    SignupComponent = <SignUpOrganizationUM setStoredStep={setStoredStep}/>;
  } else if (UserMangementReducerdefaultRoutingValue === 3) {
    SignupComponent = <VerifyOTPUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 4) {
    SignupComponent = <PasswordCreationUM />;
  } else if (UserMangementReducerdefaultRoutingValue === 5) {
    SignupComponent = <BillingMethodUsermanagement setStoredStep={setStoredStep}/>;
  } else {
    SignupComponent = null;
    console.log("Errorr in route");
  }

  return (
    <>
      {SignupComponent}

      
    {SnackBar}
    </>
  );
};

export default SignupProcessUserManagement;
