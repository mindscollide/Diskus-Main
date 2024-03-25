import {
  AddOrganizationsUser,
  GetOrganizationSubscriptionExpiryDetails,
  SaveOrganizationAndPakageSelection,
} from "../../commen/apis/Api_config";
import {
  authenticationApi,
  getAdminURLs,
} from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";

//Organization SignUp And Pakage Selection

const createOrganizationAndPakageSelectionInit = () => {
  return {
    type: actions.SAVE_ORGANIZATIONAND_SELECTEDPAKGE_USERMANAGEMENT_INIT,
  };
};

const createOrganizationAndPakageSelectionSuccess = (response, message) => {
  return {
    type: actions.SAVE_ORGANIZATIONAND_SELECTEDPAKGE_USERMANAGEMENT_SUCCESS,
    response: response,
    message: message,
  };
};

const createOrganizationAndPakageSelectionFailed = (message) => {
  return {
    type: actions.SAVE_ORGANIZATIONAND_SELECTEDPAKGE_USERMANAGEMENT_FAIL,
    message: message,
  };
};

const signUpOrganizationAndPakageSelection = (data, navigate, t) => {
  return (dispatch) => {
    dispatch(createOrganizationAndPakageSelectionInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append(
      "RequestMethod",
      SaveOrganizationAndPakageSelection.RequestMethod
    );
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_01".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationAndPakageSelectionSuccess(
                  response.data.responseResult,
                  t("Organization-and-admin-created-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_02".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationAndPakageSelectionSuccess(
                  response.data.responseResult,
                  t(
                    "Organization-and-admin-created-successfully-but-failed-to-send-OTP"
                  )
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_03".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationAndPakageSelectionFailed(
                  t("Email-already-exists")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_04".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationAndPakageSelectionFailed(
                  t("Organization-name-already-taken")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_05".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationAndPakageSelectionFailed(
                  t("Failed-to-save-organization")
                )
              );
            } else {
              dispatch(
                createOrganizationAndPakageSelectionFailed(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              createOrganizationAndPakageSelectionFailed(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            createOrganizationAndPakageSelectionFailed(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          createOrganizationAndPakageSelectionFailed(t("Something-went-wrong"))
        );
      });
  };
};

//GET ALL ORGANIZATION SUBSCRIPTION EXPIRY DETAILS
const getAllorganizationSubscriptionExpiryDetialsInit = () => {
  return {
    type: actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_INIT,
  };
};

const getAllorganizationSubscriptionExpiryDetialsSuccess = (
  response,
  message
) => {
  return {
    type: actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllorganizationSubscriptionExpiryDetialsFailed = (message) => {
  return {
    type: actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_FAILS,
    message: message,
  };
};

const getAllorganizationSubscriptionExpiryDetailsApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getAllorganizationSubscriptionExpiryDetialsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append(
      "RequestMethod",
      GetOrganizationSubscriptionExpiryDetails.RequestMethod
    );
    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getAllorganizationSubscriptionExpiryDetailsApi(navigate, t, data)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllorganizationSubscriptionExpiryDetialsSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_02".toLowerCase()
                )
            ) {
              dispatch(
                getAllorganizationSubscriptionExpiryDetialsFailed(
                  t("Invalid-data-provided")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllorganizationSubscriptionExpiryDetialsFailed(
                  t("Subscription-not-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_05".toLowerCase()
                )
            ) {
              dispatch(
                getAllorganizationSubscriptionExpiryDetialsFailed(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                getAllorganizationSubscriptionExpiryDetialsFailed(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              getAllorganizationSubscriptionExpiryDetialsFailed(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            getAllorganizationSubscriptionExpiryDetialsFailed(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          getAllorganizationSubscriptionExpiryDetialsFailed(
            t("Something-went-wrong")
          )
        );
      });
  };
};

//ORGANIZATIONAL TRIAL EXTENDED

const organizationTrialExtendedInit = () => {
  return {
    type: actions.EXTEND_ORGANIZATION_TRIAL_INIT,
  };
};

const organizationTrialExtendedSuccess = (response, message) => {
  return {
    type: actions.EXTEND_ORGANIZATION_TRIAL_SUCCESS,
    response: response,
    message: message,
  };
};

const organizationTrialExtendedFail = (message) => {
  return {
    type: actions.EXTEND_ORGANIZATION_TRIAL_FAIL,
    message: message,
  };
};

const ExtendOrganizationTrialApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(organizationTrialExtendedInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append(
      "RequestMethod",
      GetOrganizationSubscriptionExpiryDetails.RequestMethod
    );
    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(ExtendOrganizationTrialApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_ExtendOrganizationTrial_01".toLowerCase()
                )
            ) {
              dispatch(
                organizationTrialExtendedSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_ExtendOrganizationTrial_02".toLowerCase()
                )
            ) {
              dispatch(
                organizationTrialExtendedFail(t("Extension-request-not-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_ExtendOrganizationTrial_03".toLowerCase()
                )
            ) {
              dispatch(
                organizationTrialExtendedFail(
                  t("Trial-status-not-added-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_ExtendOrganizationTrial_04".toLowerCase()
                )
            ) {
              dispatch(
                organizationTrialExtendedFail(
                  t("Trial-status-added-but-not-not-extended")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_ExtendOrganizationTrial_05".toLowerCase()
                )
            ) {
              dispatch(
                organizationTrialExtendedFail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                organizationTrialExtendedFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(organizationTrialExtendedFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(organizationTrialExtendedFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(organizationTrialExtendedFail(t("Something-went-wrong")));
      });
  };
};

//ADD Organization Users

const addOrganizationUsersInit = () => {
  return {
    type: actions.ADD_ORGANIZATION_USERS_INIT,
  };
};

const addOrganizationUsersSuccess = (response, message) => {
  return {
    type: actions.ADD_ORGANIZATION_USERS_SUCCESS,
    response: response,
    message: message,
  };
};

const addOrganizationUsersFailed = (message) => {
  return {
    type: actions.ADD_ORGANIZATION_USERS_FAIL,
    message: message,
  };
};

const AddOrganizationsUserApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(addOrganizationUsersInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", AddOrganizationsUser.RequestMethod);
    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(AddOrganizationsUserApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AddOrganizationsUser_01".toLowerCase()
                )
            ) {
              dispatch(
                addOrganizationUsersSuccess(
                  response.data.responseResult,
                  t("User-was-created-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AddOrganizationsUser_02".toLowerCase()
                )
            ) {
              dispatch(
                addOrganizationUsersSuccess(
                  t("User-created-successfully-and-the-OTP")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AddOrganizationsUser_03".toLowerCase()
                )
            ) {
              dispatch(addOrganizationUsersFailed(t("Invalid-data-provided")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AddOrganizationsUser_04".toLowerCase()
                )
            ) {
              dispatch(
                addOrganizationUsersFailed(
                  t("Failed-to-create-user-Package-not-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AddOrganizationsUser_05".toLowerCase()
                )
            ) {
              dispatch(
                addOrganizationUsersFailed(
                  t("Failed-to-create-user-headCount-exceeded")
                )
              );
            } else {
              dispatch(
                organizationTrialExtendedFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(organizationTrialExtendedFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(organizationTrialExtendedFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(organizationTrialExtendedFail(t("Something-went-wrong")));
      });
  };
};

//Edit Organization Users
const editOrganizationUsersInit = () => {
  return {
    type: actions.EDIT_ORGANIZATION_USERS_INIT,
  };
};

const editOrganizationUsersSuccess = (response, message) => {
  return {
    type: actions.EDIT_ORGANIZATION_USERS_SUCCESS,
    response: response,
    message: message,
  };
};

const editOrganizationUsersFail = (message) => {
  return {
    type: actions.EDIT_ORGANIZATION_USERS_FAIL,
    message: message,
  };
};

const EditOrganizationsUserApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(editOrganizationUsersInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", AddOrganizationsUser.RequestMethod);
    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(EditOrganizationsUserApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_EditOrganizationsUser_01".toLowerCase()
                )
            ) {
              dispatch(
                editOrganizationUsersSuccess(
                  response.data.responseResult,
                  t("The-user-has-been-edited-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_EditOrganizationsUser_02".toLowerCase()
                )
            ) {
              dispatch(editOrganizationUsersFail(t("Failed-to-update-user")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_EditOrganizationsUser_03".toLowerCase()
                )
            ) {
              dispatch(
                editOrganizationUsersSuccess(
                  t(
                    "The-user-has-been-edited-but-selected-package-limit-exceeded"
                  )
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_EditOrganizationsUser_04".toLowerCase()
                )
            ) {
              dispatch(editOrganizationUsersFail(t("Failed-to-update-user")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_EditOrganizationsUser_05".toLowerCase()
                )
            ) {
              dispatch(editOrganizationUsersFail(t("Something-went-wrong")));
            } else {
              dispatch(editOrganizationUsersFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(editOrganizationUsersFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(editOrganizationUsersFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(editOrganizationUsersFail(t("Something-went-wrong")));
      });
  };
};

export {
  signUpOrganizationAndPakageSelection,
  getAllorganizationSubscriptionExpiryDetailsApi,
  ExtendOrganizationTrialApi,
  AddOrganizationsUserApi,
  EditOrganizationsUserApi,
};
