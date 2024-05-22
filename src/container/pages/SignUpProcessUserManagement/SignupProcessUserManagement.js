import React, { useState, useEffect } from "react";
import SignUpOrganizationUM from "../UserMangement/SignUpOrganizationUM/SignUpOrganizationUM";
import VerifyOTPUM from "../UserMangement/VerifyOTPUM/VerifyOTPUM";
import PakageDetailsUserManagement from "../UserMangement/PakageDetailsUserManagement/PakageDetailsUserManagement";
import BillingMethodUsermanagement from "../UserMangement/BillingMethodUserManagement/BillingMethodUsermanagement";
import PasswordCreationUM from "../UserMangement/PasswordCreationUM/PasswordCreationUM";
import { useLocation } from "react-router-dom";
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

const SignupProcessUserManagement = () => {
  const { UserMangementReducer, Authreducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  let currentStage = Number(localStorage.getItem("signupCurrentPage"))
    ? Number(localStorage.getItem("signupCurrentPage"))
    : 1;
  const [isFreetrail, setFreetrail] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  // Retrieve currentStep value from localStorage, default to 1 if not found
  const storedStep = Number(localStorage.getItem("SignupFlowPageRoute"));
  useEffect(() => {
    // Retrieve current step from local storage
    if (performance.navigation.type === PerformanceNavigation.TYPE_RELOAD) {
      if (storedStep) {
        dispatch(signUpFlowRoutes(storedStep));
      }
    } else {
      localStorage.setItem("SignupFlowPageRoute", 2);
      // dispatch(signUpFlowRoutes(1));
    }
  }, []);
  useEffect(() => {
    if (UserMangementReducer.defaulSignUpRoute) {
      // Update local storage with the current step
      localStorage.setItem(
        "SignupFlowPageRoute",
        UserMangementReducer.defaulSignUpRoute
      );
    }
  }, [UserMangementReducer.defaulSignUpRoute]);

  //For SnakBar Messeges

  //Verify OTP SignUp Process Response Messeges Controller
  useEffect(() => {
    if (
      Authreducer.VerifyOTPEmailResponseMessage !== "" &&
      Authreducer.VerifyOTPEmailResponseMessage !== undefined &&
      Authreducer.VerifyOTPEmailResponseMessage !== t("2fa-verification") &&
      Authreducer.VerifyOTPEmailResponseMessage !== t("2fa-enabled")
    ) {
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
    } else if (
      Authreducer.EnterPasswordResponseMessage !== "" &&
      Authreducer.EnterPasswordResponseMessage !== undefined &&
      Authreducer.EnterPasswordResponseMessage !== t("2fa-verification") &&
      Authreducer.EnterPasswordResponseMessage !== t("2fa-enabled")
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
    } else if (
      Authreducer.OrganizationCreateResponseMessage !== "" &&
      Authreducer.OrganizationCreateResponseMessage !== undefined &&
      Authreducer.OrganizationCreateResponseMessage !== t("2fa-verification") &&
      Authreducer.OrganizationCreateResponseMessage !== t("2fa-enabled")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.OrganizationCreateResponseMessage,
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
      Authreducer.CreatePasswordResponseMessage !== "" &&
      Authreducer.CreatePasswordResponseMessage !== undefined &&
      Authreducer.CreatePasswordResponseMessage !== t("2fa-verification") &&
      Authreducer.CreatePasswordResponseMessage !== t("2fa-enabled")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.CreatePasswordResponseMessage,
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
      Authreducer.GetSelectedPackageResponseMessage !== "" &&
      Authreducer.GetSelectedPackageResponseMessage !== undefined &&
      Authreducer.GetSelectedPackageResponseMessage !== t("2fa-verification") &&
      Authreducer.GetSelectedPackageResponseMessage !== t("2fa-enabled")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.GetSelectedPackageResponseMessage,
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
      Authreducer.EmailValidationResponseMessage !== "" &&
      Authreducer.EmailValidationResponseMessage !== undefined &&
      Authreducer.EmailValidationResponseMessage !== t("2fa-verification") &&
      Authreducer.EmailValidationResponseMessage !== t("2fa-enabled")
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
      Authreducer.passwordUpdateOnForgotPasswordMessege !== "" &&
      Authreducer.passwordUpdateOnForgotPasswordMessege !== undefined &&
      Authreducer.passwordUpdateOnForgotPasswordMessege !==
        t("2fa-verification") &&
      Authreducer.passwordUpdateOnForgotPasswordMessege !== t("2fa-enabled")
    ) {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.passwordUpdateOnForgotPasswordMessege,
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
    }
  }, [
    Authreducer.EnterPasswordResponseMessage,
    Authreducer.VerifyOTPEmailResponseMessage,
    Authreducer.OrganizationCreateResponseMessage,
    Authreducer.CreatePasswordResponseMessage,
    Authreducer.EmailValidationResponseMessage,
    Authreducer.GetSelectedPackageResponseMessage,
    Authreducer.passwordUpdateOnForgotPasswordMessege,
  ]);

  //Password SignUp Process Response Messeges Controller
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
    } else if (Authreducer.EnterPasswordResponseMessage !== "") {
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
    } else if (Authreducer.OrganizationCreateResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.OrganizationCreateResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.CreatePasswordResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.CreatePasswordResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.GetSelectedPackageResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.GetSelectedPackageResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (Authreducer.EmailValidationResponseMessage !== "") {
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
    } else {
    }
  }, [
    Authreducer.EnterPasswordResponseMessage,
    Authreducer.VerifyOTPEmailResponseMessage,
    Authreducer.OrganizationCreateResponseMessage,
    Authreducer.CreatePasswordResponseMessage,
    Authreducer.EmailValidationResponseMessage,
    Authreducer.GetSelectedPackageResponseMessage,
  ]);

  //Organization SignUp //SignUp Process Response Messeges Controller
  useEffect(() => {
    if (Authreducer.OrganizationCreateResponseMessage !== "") {
      setOpen({
        ...open,
        open: true,
        message: Authreducer.OrganizationCreateResponseMessage,
      });
    } else {
      setOpen({
        ...open,
        open: false,
        message: "",
      });
    }
  }, [Authreducer.OrganizationCreateResponseMessage]);

  //User Management PakageDetails Messeges SignUp Process Response Messeges Controller
  useEffect(() => {
    if (
      UserMangementReducer.ResponseMessage !== "" &&
      UserMangementReducer.ResponseMessage !== t("Data-available")
    ) {
      setOpen({
        open: true,
        message: UserMangementReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          open: false,
          message: "",
        });
      }, 4000);
      dispatch(clearMessegesUserManagement());
    }
  }, [UserMangementReducer.ResponseMessage]);

  let SignupComponent;
  if (
    UserMangementReducer.defaulSignUpRoute === 1 ||
    UserMangementReducer.defaulSignUpRoute === null ||
    UserMangementReducer.defaulSignUpRoute === undefined
  ) {
    SignupComponent = <PakageDetailsUserManagement />;
  } else if (UserMangementReducer.defaulSignUpRoute === 2) {
    SignupComponent = <SignUpOrganizationUM />;
  } else if (UserMangementReducer.defaulSignUpRoute === 3) {
    SignupComponent = <VerifyOTPUM />;
  } else if (UserMangementReducer.defaulSignUpRoute === 4) {
    SignupComponent = <PasswordCreationUM isFreetrail={isFreetrail} />;
  } else if (UserMangementReducer.defaulSignUpRoute === 5) {
    SignupComponent = <BillingMethodUsermanagement />;
  } else {
    SignupComponent = null;
    console.log("Errorr in route");
  }

  return (
    <>
      {SignupComponent}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default SignupProcessUserManagement;
