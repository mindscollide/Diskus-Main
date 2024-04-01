import {
  AddOrganizationsUser,
  AllOrganizationsUsers,
  GetOrganizationSelectedPackagesByOrganizationID,
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

const signUpFlowRoutes = (response) => {
  return {
    type: actions.ROUTES_FOR_SIGNUP_FLOW_UM,
    response: response,
  };
};

const LoginFlowRoutes = (response) => {
  return {
    type: actions.ROUTING_ON_PAGES_USERMANAGEMENT,
    response: response,
  };
};

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

const signUpOrganizationAndPakageSelection = (
  data,
  navigate,
  t,
  signupCurrentPageStep,
  setSignupStep
) => {
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
        try {
          if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_SignUpManager_SaveOrganizationAndSelectedPackage_01".toLowerCase()
                  )
              ) {
                localStorage.setItem(
                  "OrganizatioName",
                  data.Organization.OrganizationName
                );
                localStorage.setItem(
                  "userID",
                  response.data.responseResult.userID
                );
                localStorage.setItem(
                  "OrganizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "UserEmail",
                  data.Organization.ContactPersonEmail
                );
                dispatch(
                  createOrganizationAndPakageSelectionSuccess(
                    response.data.responseResult,
                    t("Organization-and-admin-created-successfully")
                  )
                );
                localStorage.removeItem("PackageID");
                localStorage.setItem("minutes", 4);
                localStorage.setItem("seconds", 60);
                localStorage.setItem("signupCurrentPage", 3);
                navigate("/Signup");
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_02".toLowerCase()
                  )
              ) {
                localStorage.setItem(
                  "userID",
                  response.data.responseResult.userID
                );
                localStorage.setItem(
                  "OrganizationID",
                  response.data.responseResult.organizationID
                );
                localStorage.setItem(
                  "UserEmail",
                  data.Organization.ContactPersonEmail
                );
                localStorage.setItem(
                  "OrganizatioName",
                  data.Organization.OrganizationName
                );
                dispatch(
                  createOrganizationAndPakageSelectionSuccess(
                    response.data.responseResult,
                    t(
                      "Organization-and-admin-created-successfully-but-failed-to-send-OTP"
                    )
                  )
                );
                localStorage.setItem("minutes", 0);
                localStorage.setItem("seconds", 0);
                localStorage.removeItem("PackageID");
                localStorage.setItem("signupCurrentPage", 3);
                navigate("/Signup");
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
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_06".toLowerCase()
                  )
              ) {
                dispatch(
                  createOrganizationAndPakageSelectionFailed(
                    t("Failed-to-save-subscriptions")
                  )
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_07".toLowerCase()
                  )
              ) {
                dispatch(
                  createOrganizationAndPakageSelectionFailed(
                    t("Failed-to-create-admin-user")
                  )
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_08".toLowerCase()
                  )
              ) {
                dispatch(
                  createOrganizationAndPakageSelectionFailed(
                    t("Failed-to-add-organization-user-mapping")
                  )
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_09".toLowerCase()
                  )
              ) {
                dispatch(
                  createOrganizationAndPakageSelectionFailed(
                    t("Failed-to-save-admin-user-alloted-package")
                  )
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_10".toLowerCase()
                  )
              ) {
                dispatch(
                  createOrganizationAndPakageSelectionFailed(
                    t("Failed-to-save-organization-settings")
                  )
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_11".toLowerCase()
                  )
              ) {
                dispatch(
                  createOrganizationAndPakageSelectionFailed(
                    t("Something-went-wrong")
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
        } catch (error) {
          console.log(error, "errorerrorerrorerrorerror");
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

//ALL ORGANIZATION USERS

const allOrganizationUsersInit = () => {
  return {
    type: actions.ALL_ORGANIZAION_USERS_INIT,
  };
};

const allOrganizationUsersSuccess = (response, message) => {
  return {
    type: actions.ALL_ORGANIZAION_USERS_SUCCESS,
    response: response,
    message: message,
  };
};

const allOrganizationUsersFail = (message) => {
  return {
    type: actions.ALL_ORGANIZAION_USERS_FAIL,
    message: message,
  };
};

const AllOrganizationsUsersApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(allOrganizationUsersInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", AllOrganizationsUsers.RequestMethod);
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
          dispatch(AllOrganizationsUsersApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AllOrganizationsUsers_02".toLowerCase()
                )
            ) {
              dispatch(
                allOrganizationUsersSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AllOrganizationsUsers_03".toLowerCase()
                )
            ) {
              dispatch(allOrganizationUsersFail(t("No-data-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AllOrganizationsUsers_04".toLowerCase()
                )
            ) {
              dispatch(allOrganizationUsersFail(t("Something-went-wrong")));
            } else {
              dispatch(allOrganizationUsersFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(allOrganizationUsersFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(allOrganizationUsersFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(allOrganizationUsersFail(t("Something-went-wrong")));
      });
  };
};

//ALL ORGANIZATION PAKAGE DETAILS AND USER STATS

const organzationPakageDetailsAnduserStatsInit = () => {
  return {
    type: actions.ORGANIZATION_PAKAGEDETAILS_AND_USERSTATS_INIT,
  };
};

const organzationPakageDetailsAnduserStatsSuccess = (response, message) => {
  return {
    type: actions.ORGANIZATION_PAKAGEDETAILS_AND_USERSTATS_SUCCESS,
    response: response,
    message: message,
  };
};

const organzationPakageDetailsAnduserStatsFailed = (message) => {
  return {
    type: actions.ORGANIZATION_PAKAGEDETAILS_AND_USERSTATS_FAIL,
    message: message,
  };
};

const OrganizationPackageDetailsAndUserStatsApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(organzationPakageDetailsAnduserStatsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", AllOrganizationsUsers.RequestMethod);
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
            OrganizationPackageDetailsAndUserStatsApi(navigate, t, data)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_OrganizationPackageDetailsAndUserStats_01".toLowerCase()
                )
            ) {
              dispatch(
                organzationPakageDetailsAnduserStatsSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_OrganizationPackageDetailsAndUserStats_02".toLowerCase()
                )
            ) {
              dispatch(
                organzationPakageDetailsAnduserStatsFailed(t("No-data-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_OrganizationPackageDetailsAndUserStats_03".toLowerCase()
                )
            ) {
              dispatch(
                organzationPakageDetailsAnduserStatsFailed(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                organzationPakageDetailsAnduserStatsFailed(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              organzationPakageDetailsAnduserStatsFailed(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            organzationPakageDetailsAnduserStatsFailed(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          organzationPakageDetailsAnduserStatsFailed(t("Something-went-wrong"))
        );
      });
  };
};

//GET ORGANIZATION PAKAGE SELECTED BY ORGANIZATION ID

const organizationSelectedPakagebyOrganzationidInit = () => {
  return {
    type: actions.GET_ORGANZIATION_SELECTEDPAKAGE_BY_ORGANZATIONID_INIT,
  };
};

const organizationSelectedPakagebyOrganzationidSuccess = (
  response,
  message
) => {
  return {
    type: actions.GET_ORGANZIATION_SELECTEDPAKAGE_BY_ORGANZATIONID_SUCCESS,
    response: response,
    message: message,
  };
};

const organizationSelectedPakagebyOrganzationidFail = (message) => {
  return {
    type: actions.GET_ORGANZIATION_SELECTEDPAKAGE_BY_ORGANZATIONID_FAIL,
    message: message,
  };
};

const GetOrganizationSelectedPackagesByOrganizationIDApi = (
  navigate,
  t,
  data
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(organizationSelectedPakagebyOrganzationidInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append(
      "RequestMethod",
      GetOrganizationSelectedPackagesByOrganizationID.RequestMethod
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
            GetOrganizationSelectedPackagesByOrganizationIDApi(
              navigate,
              t,
              data
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSelectedPackages_01".toLowerCase()
                )
            ) {
              dispatch(
                organizationSelectedPakagebyOrganzationidSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSelectedPackages_02".toLowerCase()
                )
            ) {
              dispatch(
                organizationSelectedPakagebyOrganzationidFail(
                  t("No-data-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSelectedPackages_03".toLowerCase()
                )
            ) {
              dispatch(
                organizationSelectedPakagebyOrganzationidFail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                organizationSelectedPakagebyOrganzationidFail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              organizationSelectedPakagebyOrganzationidFail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            organizationSelectedPakagebyOrganzationidFail(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          organizationSelectedPakagebyOrganzationidFail(
            t("Something-went-wrong")
          )
        );
      });
  };
};

export {
  signUpOrganizationAndPakageSelection,
  getAllorganizationSubscriptionExpiryDetailsApi,
  ExtendOrganizationTrialApi,
  AddOrganizationsUserApi,
  EditOrganizationsUserApi,
  AllOrganizationsUsersApi,
  OrganizationPackageDetailsAndUserStatsApi,
  GetOrganizationSelectedPackagesByOrganizationIDApi,
  signUpFlowRoutes,
  LoginFlowRoutes,
};
