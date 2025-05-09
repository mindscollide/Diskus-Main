import {
  GetUsersAuditActions,
  GetUsersAuditListing,
  IsOrganizationEmailExsists,
  IsOrganizationExsists,
} from "../../commen/apis/Api_config";
import * as actions from "../action_types";
import axios from "axios";
import { AuditAPi, getAdminURLs } from "../../commen/apis/Api_ends_points";
import { setLoader } from "./Auth2_actions";
import { RefreshToken } from "./Auth_action";

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

//********************************************************AUDIT APIS */
// Get Audit listing
const GetAuditListingInit = () => {
  return {
    type: actions.GET_USER_AUDIT_LISTING_INIT,
  };
};

const GetAuditListingSuccess = (response, message) => {
  return {
    type: actions.GET_USER_AUDIT_LISTING_SUCCESS,
    response: response,
    message: message,
  };
};

const GetAuditListingFail = (message) => {
  return {
    type: actions.GET_USER_AUDIT_LISTING_FAIL,
    message: message,
  };
};

const GetAuditListingAPI = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(GetAuditListingInit());
    let form = new FormData();
    form.append("RequestMethod", GetUsersAuditListing.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: AuditAPi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAuditListingAPI(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Audit_AuditServiceManager_GetUsersAuditListing_01".toLowerCase()
            ) {
              dispatch(
                GetAuditListingSuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Audit_AuditServiceManager_GetUsersAuditListing_02".toLowerCase()
            ) {
              dispatch(GetAuditListingFail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Audit_AuditServiceManager_GetUsersAuditListing_03".toLowerCase()
            ) {
              dispatch(GetAuditListingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(GetAuditListingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(GetAuditListingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(GetAuditListingFail(t("Something-went-wrong")));
      });
  };
};

const GetAuditActionsInit = () => {
  return {
    type: actions.GET_USER_AUDIT_ACTIONS_INIT,
  };
};

const GetAuditActionsSuccess = (response, message) => {
  return {
    type: actions.GET_USER_AUDIT_ACTIONS_SUCCESS,
    response: response,
    message: message,
  };
};

const GetAuditActionsFail = (message) => {
  return {
    type: actions.GET_USER_AUDIT_ACTIONS_FAIL,
    message: message,
  };
};

const GetAuditActionsAPI = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(GetAuditActionsInit());
    let form = new FormData();
    form.append("RequestMethod", GetUsersAuditActions.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: AuditAPi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAuditActionsAPI(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Audit_AuditServiceManager_GetUserAuditActions_01".toLowerCase()
            ) {
              dispatch(
                GetAuditActionsSuccess(response.data.responseResult, "")
              );
              dispatch(AuditTrialViewActionModal(true));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Audit_AuditServiceManager_GetUserAuditActions_02".toLowerCase()
            ) {
              dispatch(AuditTrialViewActionModal(true));
              dispatch(GetAuditActionsFail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Audit_AuditServiceManager_GetUserAuditActions_03".toLowerCase()
            ) {
              dispatch(GetAuditActionsFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(GetAuditActionsFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(GetAuditActionsFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(GetAuditActionsFail(t("Something-went-wrong")));
      });
  };
};
export {
  checkOraganisation,
  checkEmailExsist,
  AuditTrialViewActionModal,
  GetAuditListingAPI,
  GetAuditActionsAPI,
};
