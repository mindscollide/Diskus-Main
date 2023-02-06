import {
  IsOrganizationEmailExsists,
  IsOrganizationExsists,
} from "../../commen/apis/Api_config";
import * as actions from "../action_types";
import axios from "axios";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";

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
        console.log("ValidateData", response);
        if (response.data.responseResult.isExecuted === true) {
          console.log("ValidateData", response);
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
            let newError = t("This-organization-doesn’t-exists");
            try {
              // setSignUpDetails({
              //   ...signUpDetails,
              //   CompanyName: {
              //     value: signUpDetails.CompanyName.value,
              //     errorMessage: newError,
              //     errorStatus: true,
              //   },
              // });
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
              // setSignUpDetails({
              //   ...signUpDetails,
              //   CompanyName: {
              //     value: signUpDetails.CompanyName.value,
              //     errorMessage: newError,
              //     errorStatus: false,
              //   },
              // });
              await setCompanyNameValidate(false);
              await setCompanyNameValidateError(newError);
              await setCompanyNameUnique(false);
            } catch {}
            dispatch(organizationSuccess(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsOrganizationExsists_04"
          ) {
            let newError = t("Please-provide-organization-name");
            try {
              // setSignUpDetails({
              //   ...signUpDetails,
              //   CompanyName: {
              //     value: signUpDetails.CompanyName.value,
              //     errorMessage: newError,
              //     errorStatus: true,
              //   },
              // });
              await setCompanyNameValidate(true);
              await setCompanyNameValidateError(newError);
              await setCompanyNameUnique(false);
            } catch {}
            dispatch(organizationSuccess(false, newError));
          } else {
            let newError = t("This-organization-doesn’t-exists");
            setCompanyNameUnique(true);
            try {
              // setSignUpDetails({
              //   ...signUpDetails,
              //   CompanyName: {
              //     value: signUpDetails.CompanyName.value,
              //     errorMessage: newError,
              //     errorStatus: true,
              //   },
              // });
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
        console.log("ValidateData", response);
        if (response.data.responseResult.isExecuted === true) {
          console.log("ValidateData", response);
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsUserEmailExsists_01"
          ) {
            let newError = t("You-are-not-an-admin-please-contact-support");
            try {
              await setCompanyEmailValidate(true);
              await setCompanyEmailValidateError(newError);
              await setEmailUnique(false);
              await dispatch(emailVerficationSuccess(false, newError));
            } catch {}
            // return setSignUpDetails({
            //   ...signUpDetails,
            //   Email: {
            //     value: signUpDetails.Email.value,
            //     errorMessage: newError,
            //     errorStatus: true,
            //   },
            // });
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsUserEmailExsists_02"
          ) {
            let newError = t("User-email-exists");
            // dispatch(emailVerficationSuccess(false, newError));
            try {
              await setCompanyEmailValidate(true);
              await setCompanyEmailValidateError(newError);
              await setEmailUnique(false);
              await dispatch(emailVerficationSuccess(false, newError));
            } catch {}
            // return setSignUpDetails({
            //   ...signUpDetails,
            //   Email: {
            //     value: signUpDetails.Email.value,
            //     errorMessage: newError,
            //     errorStatus: true,
            //   },
            // });
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsUserEmailExsists_03"
          ) {
            let newError = t("User email doesn’t exists.");
            // dispatch(emailVerficationSuccess(true, newError));
            // setEmailUnique(true);
            // console.log("ValidateData", response);
            // return setSignUpDetails({
            //   ...signUpDetails,
            //   Email: {
            //     value: signUpDetails.Email.value,
            //     errorMessage: newError,
            //     errorStatus: true,
            //   },
            // });
            try {
              await setCompanyEmailValidate(true);
              await setCompanyEmailValidateError(newError);
              await setEmailUnique(true);
              await dispatch(emailVerficationSuccess(true, newError));
            } catch {}
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsUserEmailExsists_04"
          ) {
            let newError = t("User-email-doesn’t-exists");
            try {
              await setCompanyEmailValidate(true);
              await setCompanyEmailValidateError(newError);
              await setEmailUnique(true);
              await dispatch(emailVerficationSuccess(true, newError));
            } catch {}
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_IsUserEmailExsists_05"
          ) {
            // setEmailUnique(false);
            let newError = t("Enter-a-valid-email");
            // dispatch(emailVerficationSuccess(false, newError));
            // return setSignUpDetails({
            //   ...signUpDetails,
            //   Email: {
            //     value: signUpDetails.Email.value,
            //     errorMessage: newError,
            //     errorStatus: true,
            //   },
            // });
            try {
              await setCompanyEmailValidate(true);
              await setCompanyEmailValidateError(newError);
              await setEmailUnique(false);
              await dispatch(emailVerficationSuccess(false, newError));
            } catch {}
          } else {
            // setEmailUnique(false);
            let newError = t("Enter-a-valid-email");
            // dispatch(emailVerficationSuccess(false, newError));
            // return setSignUpDetails({
            //   ...signUpDetails,
            //   Email: {
            //     value: signUpDetails.Email.value,
            //     errorMessage: newError,
            //     errorStatus: true,
            //   },
            // });
            try {
              await setCompanyEmailValidate(true);
              await setCompanyEmailValidateError(newError);
              await setEmailUnique(false);
              await dispatch(emailVerficationSuccess(false, newError));
            } catch {}
          }
        } else {
          let newToste = t("something-went-worng");
          setEmailUnique(false);
          dispatch(emailVerficationFail(false, newToste));
        }
      })
      .catch((response) => {
        let newToste = t("something-went-worng");
        setEmailUnique(false);
        dispatch(emailVerficationFail(false, newToste));
      });
  };
};
export { checkOraganisation, checkEmailExsist };
