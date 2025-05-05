import {
  IsOrganizationEmailExsists,
  IsOrganizationExsists,
} from "../../commen/apis/Api_config";
import * as actions from "../action_types";
import axios from "axios";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import { setLoader } from "./Auth2_actions";

const organizationInit = (response, message) => {
  return {
    type: actions.ADMIN_ORGANIZATION_INIT,
    response: response,
    message: message,
  };
};

const organizationSuccess = (response, message) => {
  return {
    type: actions.ADMIN_ORGANIZATION_SUCCESS,
    response: response,
    message: message,
  };
};

const organizationFail = (response, message) => {
  return {
    type: actions.ADMIN_ORGANIZATION_FAIL,
    response: response,
    message: message,
  };
};
const emailVerficationinit = (response, message) => {
  return {
    type: actions.ADMIN_EMAILVARIFICATION_INIT,
    response: response,
    message: message,
  };
};

const emailVerficationSuccess = (response, message) => {
  return {
    type: actions.ADMIN_EMAILVARIFICATION_SUCCESS,
    response: response,
    message: message,
  };
};

const emailVerficationFail = (response, message) => {
  return {
    type: actions.ADMIN_EMAILVARIFICATION_FAIL,
    response: response,
    message: message,
  };
};
const checkOraganisation = (
  setCompanyNameValidate,
  setCompanyNameValidateError,
  signUpDetails,
  t,
  setCompanyNameUnique
) => {
  let newData = { OrganizationName: signUpDetails.CompanyName.value };
  return (dispatch) => {
    dispatch(organizationInit());
    setCompanyNameUnique(false);
    let form = new FormData();
    form.append("RequestMethod", IsOrganizationExsists.RequestMethod);
    form.append("RequestData", JSON.stringify(newData));

    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
    })
      .then(async (response) => {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsOrganizationExsists_01"
          ) {
            let newError = t("You-are-not-an-admin-please-contact-support");
            try {
              await setCompanyNameValidate(true);
              await setCompanyNameValidateError(newError);
              await setCompanyNameUnique(false);
            } catch {}
            dispatch(organizationSuccess(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsOrganizationExsists_02"
          ) {
            let newError = t("This-organization-doesnt-exists");
            try {
              await setCompanyNameValidate(true);
              await setCompanyNameValidateError(newError);
              await setCompanyNameUnique(true);
            } catch {}
            dispatch(organizationSuccess(true, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsOrganizationExsists_03"
          ) {
            let newError = t("This-organization-already-exists");
            try {
              await setCompanyNameValidate(false);
              await setCompanyNameValidateError([...newError]);
              await setCompanyNameUnique(false);
            } catch {}
            dispatch(organizationSuccess(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsOrganizationExsists_04"
          ) {
            let newError = t("Please-provide-organization-name");
            try {
              await setCompanyNameValidate(true);
              await setCompanyNameValidateError(newError);
              await setCompanyNameUnique(false);
            } catch {}
            dispatch(organizationSuccess(false, newError));
          } else {
            let newError = t("This-organization-doesnt-exists");
            try {
              await setCompanyNameValidate(true);
              await setCompanyNameValidateError(newError);
              await setCompanyNameUnique(true);
            } catch {}
            dispatch(organizationSuccess(false, newError));
          }
        } else {
          let newToste = t("somthing went worng");
          dispatch(organizationFail(false, newToste));
        }
      })
      .catch((response) => {
        let newToste = t("somthing went worng");
        dispatch(organizationFail(false, newToste));
      });
  };
};

const checkEmailExsist = (
  setCompanyEmailValidate,
  setCompanyEmailValidateError,
  signUpDetails,
  t,
  setEmailUnique
) => {
  let newData = { UserEmail: signUpDetails.Email.value };
  return (dispatch) => {
    dispatch(emailVerficationinit());
    setEmailUnique(false);
    let form = new FormData();
    form.append("RequestMethod", IsOrganizationEmailExsists.RequestMethod);
    form.append("RequestData", JSON.stringify(newData));

    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
    })
      .then(async (response) => {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsUserEmailExsists_01"
          ) {
            let newError = t("You-are-not-an-admin-please-contact-support");
            try {
              await setCompanyEmailValidate(true);
              await setCompanyEmailValidateError(newError);
              await setEmailUnique(false);
              await dispatch(emailVerficationFail(false, newError));
              await dispatch(setLoader(false));
            } catch {}
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsUserEmailExsists_02"
          ) {
            let newError = t("User-email-already-exists");
            try {
              await setCompanyEmailValidate(true);
              await setCompanyEmailValidateError([...newError]);
              await setEmailUnique(false);
              await dispatch(emailVerficationFail(false, newError));
              await dispatch(setLoader(false));
            } catch {}
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsUserEmailExsists_03"
          ) {
            let newError = t("User-email-doesnt-exists");
            try {
              await setCompanyEmailValidate(false);
              await setCompanyEmailValidateError(newError);
              await setEmailUnique(true);
              await dispatch(emailVerficationSuccess(true, newError));
              // await dispatch(setLoader(true));
            } catch {}
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsUserEmailExsists_04"
          ) {
            let newError = t("User-email-doesnt-exists");
            try {
              await setCompanyEmailValidate(false);
              await setCompanyEmailValidateError(newError);
              await setEmailUnique(true);
              await dispatch(emailVerficationSuccess(true, newError));
              // await dispatch(setLoader(true));
            } catch {}
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsUserEmailExsists_05"
          ) {
            let newError = t("Enter-a-valid-email");
            try {
              await setCompanyEmailValidate(true);
              await setCompanyEmailValidateError(newError);
              await setEmailUnique(false);
              await dispatch(emailVerficationFail(false, newError));
              await dispatch(setLoader(false));
            } catch {}
          } else {
            let newError = t("Enter-a-valid-email");
            try {
              await setCompanyEmailValidate(true);
              await setCompanyEmailValidateError(newError);
              await setEmailUnique(false);
              await dispatch(emailVerficationFail(false, newError));
              await dispatch(setLoader(false));
            } catch {}
          }
        } else {
          let newToste = t("Something-went-wrong");
          setEmailUnique(false);
          dispatch(emailVerficationFail(false, newToste));
          await dispatch(setLoader(false));
        }
      })
      .catch((response) => {
        let newToste = t("Something-went-wrong");
        setEmailUnique(false);
        dispatch(emailVerficationFail(false, newToste));
        dispatch(setLoader(false));
      });
  };
};

const AuditTrialViewActionModal = (response) => {
  return {
    type: actions.AUDITTRIAL_VIEW_ACTION_MODAL,
    response: response,
  };
};
export { checkOraganisation, checkEmailExsist, AuditTrialViewActionModal };
