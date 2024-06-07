import {
  AddOrganizationsUser,
  AllOrganizationsUsers,
  GetOrganizationSelectedPackagesByOrganizationID,
  IsPackageExpiryDetail,
  SaveOrganizationAndPakageSelection,
  getOrganizationSelectedPakages,
  OrganizationPackageDetailsAndUserStats,
  GetAllUserTypePackages,
  ResendForgotPasswordCode,
  EditOrganizationsUser,
  DeleteOrganizationsUser,
  PaymentInitiateStepperThree,
  CancelSubReasons,
  CancelOrganizationsSubscriptions,
  ExtendOrganizationTrial,
  requestOrganizationTrialExtend,
  paymentStatus,
  changeSelectedSubscription,
  CancelTrailandUpdageOrganiztionRM,
} from "../../commen/apis/Api_config";
import {
  authenticationApi,
  getAdminURLs,
} from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import {
  openPaymentProcessModal,
  showDeleteUsersModal,
  showEditUserModal,
  showReasonForLeavingModal,
  showRequestExtentionModal,
  showSucessfullyUpdatedModal,
  showUpgradeNowModal,
} from "./UserMangementModalActions";
import { userLogOutApiFunc } from "./Auth_Sign_Out";
import {
  clearLocalStorageAtloginresponce,
  clearPaymentActionFromUrl,
  handleLoginResponse,
} from "../../commen/functions/utils";

const clearMessegesUserManagement = (response) => {
  return {
    type: actions.CLEAR_MESSEGES_USER_MANAGEMENT,
  };
};

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
        try {
          if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_01".toLowerCase()
                  )
              ) {
                localStorage.setItem(
                  "organizatioName",
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
                  "userEmail",
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
                localStorage.removeItem("SignupFlowPageRoute", 2);
                localStorage.setItem("SignupFlowPageRoute", 3);
                dispatch(signUpFlowRoutes(3));
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
                  "userEmail",
                  data.Organization.ContactPersonEmail
                );
                localStorage.setItem(
                  "organizatioName",
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
                localStorage.removeItem("SignupFlowPageRoute", 2);
                localStorage.setItem("SignupFlowPageRoute", 3);
                dispatch(signUpFlowRoutes(3));
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
    form.append("RequestMethod", ExtendOrganizationTrial.RequestMethod);
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
                  "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_01".toLowerCase()
                )
            ) {
              dispatch(
                organizationTrialExtendedSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              dispatch(showUpgradeNowModal(false));
              localStorage.removeItem("packageFeatureIDs");
              localStorage.removeItem("LocalUserRoutes");
              localStorage.removeItem("LocalAdminRoutes");
              localStorage.removeItem("VERIFICATION");
              localStorage.removeItem("TrialExpireSelectPac");
              dispatch(userLogOutApiFunc(navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_02".toLowerCase()
                )
            ) {
              dispatch(
                organizationTrialExtendedFail(t("Invalid-data-provided"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_03".toLowerCase()
                )
            ) {
              dispatch(
                organizationTrialExtendedFail(t("Subscription-not-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_04".toLowerCase()
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

const addOrganizationUsersSuccess = (response, message, loader) => {
  return {
    type: actions.ADD_ORGANIZATION_USERS_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};

const addOrganizationUsersFailed = (message) => {
  return {
    type: actions.ADD_ORGANIZATION_USERS_FAIL,
    message: message,
  };
};

const AddOrganizationsUserApi = (navigate, t, data, loader) => {
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
          dispatch(AddOrganizationsUserApi(navigate, t, data, loader));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AddOrganizationsUsers_01".toLowerCase()
                )
            ) {
              dispatch(
                addOrganizationUsersSuccess(
                  response.data.responseResult,
                  t("Users-added-successfully"),
                  loader
                )
              );
              navigate("/Admin/ManageUsers");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AddOrganizationsUsers_02".toLowerCase()
                )
            ) {
              dispatch(
                addOrganizationUsersSuccess(
                  t("Error-occurred-while-adding-users")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AddOrganizationsUsers_03".toLowerCase()
                )
            ) {
              dispatch(addOrganizationUsersFailed(t("Invalid-data-provided")));
            } else {
              dispatch(addOrganizationUsersFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(addOrganizationUsersFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(addOrganizationUsersFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(addOrganizationUsersFailed(t("Something-went-wrong")));
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

const EditOrganizationsUserApi = (navigate, t, data, flag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = localStorage.getItem("organizationID");
  let userID = localStorage.getItem("userID");
  return (dispatch) => {
    dispatch(editOrganizationUsersInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", EditOrganizationsUser.RequestMethod);
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
              dispatch(showEditUserModal(false));
              dispatch(showSucessfullyUpdatedModal(true));
              if (flag) {
                let data = {
                  OrganizationID: Number(organizationID),
                  RequestingUserID: Number(userID),
                };
                dispatch(AllOrganizationsUsersApi(navigate, t, data));
              }
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
                editOrganizationUsersFail(
                  t(
                    "The-user-has-been-edited-but-selected-package-limit-exceeded"
                  )
                )
              );
              dispatch(showEditUserModal(true));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_EditOrganizationsUser_04".toLowerCase()
                )
            ) {
              dispatch(editOrganizationUsersFail(t("Failed-to-update-user")));
              dispatch(showEditUserModal(true));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_EditOrganizationsUser_05".toLowerCase()
                )
            ) {
              dispatch(editOrganizationUsersFail(t("Something-went-wrong")));
              dispatch(showEditUserModal(true));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_EditOrganizationsUser_06".toLowerCase()
                )
            ) {
              dispatch(editOrganizationUsersFail(t("User-deletion-failed")));
              dispatch(showEditUserModal(true));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_EditOrganizationsUser_07".toLowerCase()
                )
            ) {
              dispatch(
                editOrganizationUsersFail(t("User-deleted-succesfully"))
              );
              dispatch(showEditUserModal(true));
            } else {
              dispatch(editOrganizationUsersFail(t("Something-went-wrong")));
              dispatch(showEditUserModal(true));
            }
          } else {
            dispatch(editOrganizationUsersFail(t("Something-went-wrong")));
            dispatch(showEditUserModal(true));
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
  console.log("AllOrganizationsUsersApi");
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

const GetOrganizationSelectedPackagesByOrganizationIDApi = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(organizationSelectedPakagebyOrganzationidInit());
    let form = new FormData();
    // form.append("RequestData", JSON.stringify(data));
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
            GetOrganizationSelectedPackagesByOrganizationIDApi(navigate, t)
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

//GET ORGANIZATION SELECTED PAKAGES
const getOrganizationSelectedPakagesInit = () => {
  return {
    type: actions.GET_ALL_ORGANIZATION_SELECTED_PAKAGES_INIT,
  };
};

const getOrganizationSelectedPakagesSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_ORGANIZATION_SELECTED_PAKAGES_SUCCESS,
    response: response,
    message: message,
  };
};

const getOrganizationSelectedPakagesFailed = (message) => {
  return {
    type: actions.GET_ALL_ORGANIZATION_SELECTED_PAKAGES_FAIL,
    message: message,
  };
};

const getOrganizationSelectedPakagesAPI = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getOrganizationSelectedPakagesInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", getOrganizationSelectedPakages.RequestMethod);
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getOrganizationSelectedPakagesAPI(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetOrganizationSelectedPackages_01".toLowerCase()
                )
            ) {
              dispatch(
                getOrganizationSelectedPakagesSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetOrganizationSelectedPackages_02".toLowerCase()
                )
            ) {
              dispatch(
                getOrganizationSelectedPakagesFailed(t("No-data-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetOrganizationSelectedPackages_03".toLowerCase()
                )
            ) {
              dispatch(
                getOrganizationSelectedPakagesFailed(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getOrganizationSelectedPakagesFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getOrganizationSelectedPakagesFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getOrganizationSelectedPakagesFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getOrganizationSelectedPakagesFailed(t("Something-went-wrong"))
        );
      });
  };
};

// Stats Graph Api for USER ADMIN
const getOrganizationPackageUserStatsInit = () => {
  return {
    type: actions.USERADMIN_LIST_OF_STATS_GRAPH_INIT,
  };
};

const getOrganizationPackageUserStatsSuccess = (response, message) => {
  return {
    type: actions.USERADMIN_LIST_OF_STATS_GRAPH_SUCCESS,
    response: response,
    message: message,
  };
};

const getOrganizationPackageUserStatsFail = (message) => {
  return {
    type: actions.USERADMIN_LIST_OF_STATS_GRAPH_FAIL,
    message: message,
  };
};

//Api to Show data in graph in userManagment Add user
const getOrganizationPackageUserStatsAPI = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getOrganizationPackageUserStatsInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      OrganizationPackageDetailsAndUserStats.RequestMethod
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
          dispatch(getOrganizationPackageUserStatsAPI(navigate, t));
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
                getOrganizationPackageUserStatsSuccess(
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
              dispatch(getOrganizationPackageUserStatsFail(t("No-data-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_OrganizationPackageDetailsAndUserStats_03".toLowerCase()
                )
            ) {
              dispatch(
                getOrganizationPackageUserStatsFail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getOrganizationPackageUserStatsFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getOrganizationPackageUserStatsFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getOrganizationPackageUserStatsFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getOrganizationPackageUserStatsFail(t("Something-went-wrong"))
        );
      });
  };
};

//Get All UserType Packages
const getAllUserTypePackagesInit = () => {
  return {
    type: actions.GET_ALL_USER_TYPES_PAKAGES_INIT,
  };
};

const getAllUserTypePackagesSuccess = (response, message, flag) => {
  return {
    type: actions.GET_ALL_USER_TYPES_PAKAGES_SUCCESS,
    response: response,
    message: message,
    loader: flag,
  };
};

const getAllUserTypePackagesFail = (message) => {
  return {
    type: actions.GET_ALL_USER_TYPES_PAKAGES_FAIL,
    message: message,
  };
};

const getAllUserTypePackagesApi = (navigate, t, flag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllUserTypePackagesInit());
    let form = new FormData();
    form.append("RequestMethod", GetAllUserTypePackages.RequestMethod);
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllUserTypePackagesApi(navigate, t, flag));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetAllUserTypePackages_01".toLowerCase()
                )
            ) {
              await dispatch(
                getAllUserTypePackagesSuccess(
                  response.data.responseResult,
                  t("Data-available"),
                  flag
                )
              );
              if (flag) {
                let OrganizationName = localStorage.getItem("organizatioName");
                let OrganiationSubscriptionID = localStorage.getItem(
                  "organizationSubscriptionID"
                );
                let Data = {
                  OrganizationName: OrganizationName,
                  OrganizationSubscriptionID: Number(OrganiationSubscriptionID),
                };
                dispatch(getOrganizationSelectedPakagesAPI(navigate, t, Data));
              } else {
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetAllUserTypePackages_02".toLowerCase()
                )
            ) {
              dispatch(getAllUserTypePackagesFail(t("No-data-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetAllUserTypePackages_03".toLowerCase()
                )
            ) {
              dispatch(getAllUserTypePackagesFail(t("Something-went-wrong")));
            } else {
              dispatch(getAllUserTypePackagesFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getAllUserTypePackagesFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAllUserTypePackagesFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllUserTypePackagesFail(t("Something-went-wrong")));
      });
  };
};

//Resend Forgot Password Code
const ResendForgotPasswordCodeInit = () => {
  return {
    type: actions.GET_ALL_USER_TYPES_PAKAGES_INIT,
  };
};

const ResendForgotPasswordCodeSuccess = (response, message) => {
  return {
    type: actions.RESEND_FORGOT_PASSWORD_CODE_SUCCESS,
    response: response,
    message: message,
  };
};

const ResendForgotPasswordCodefail = (message) => {
  return {
    type: actions.RESEND_FORGOT_PASSWORD_CODE_FAIL,
    message: message,
  };
};

const ResendForgotPasswordCodeApi = (
  t,
  verificationData,
  setSeconds,
  setMinutes
) => {
  return (dispatch) => {
    dispatch(ResendForgotPasswordCodeInit());
    let form = new FormData();
    form.append("RequestMethod", ResendForgotPasswordCode.RequestMethod);
    form.append("RequestData", JSON.stringify(verificationData));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_SignUpManager_ResendForgotPasswordCode_01"
          ) {
            let newMessage = t("Successful");
            dispatch(
              ResendForgotPasswordCodeSuccess(
                response.data.responseResult,
                newMessage
              )
            );
            return setSeconds(60), setMinutes(4);
          } else if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_SignUpManager_ResendForgotPasswordCode_02"
          ) {
            let newMessage = t("Unsuccessful");
            dispatch(ResendForgotPasswordCodefail(newMessage));
            return setSeconds(0), setMinutes(0);
          } else if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_SignUpManager_ResendForgotPasswordCode_03"
          ) {
            let newMessage = t("Something-went-wrong");
            dispatch(ResendForgotPasswordCodefail(newMessage));
            return setSeconds(0), setMinutes(0);
          }
        } else {
          let newMessage = t("Something-went-wrong");
          dispatch(ResendForgotPasswordCodefail(newMessage));
          return setSeconds(0), setMinutes(0);
        }
      })
      .catch((response) => {
        dispatch(ResendForgotPasswordCodefail(t("Something-went-wrong")));
      });
  };
};

//Delete Orgazanition

const deleteOrganizationUserInit = () => {
  return {
    type: actions.DELETE_ORGANIZATION_USERS_INIT,
  };
};

const deleteOrganizationUserSuccess = (response, message) => {
  return {
    type: actions.DELETE_ORGANIZATION_USERS_SUCCESS,
    response: response,
    message: message,
  };
};

const deleteOrganizationUserFail = (message) => {
  return {
    type: actions.DELETE_ORGANIZATION_USERS_FAIL,
    message: message,
  };
};

const deleteOrganizationUserAPI = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = localStorage.getItem("organizationID");
  let userID = localStorage.getItem("userID");
  return (dispatch) => {
    dispatch(deleteOrganizationUserInit());
    let form = new FormData();
    form.append("RequestMethod", DeleteOrganizationsUser.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
          dispatch(deleteOrganizationUserAPI(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_DeleteOrganizationsUser_01".toLowerCase()
                )
            ) {
              dispatch(
                deleteOrganizationUserSuccess(
                  response.data.responseResult,
                  t("User-deleted-successfully")
                )
              );
              let data = {
                OrganizationID: Number(organizationID),
                RequestingUserID: Number(userID),
              };
              dispatch(AllOrganizationsUsersApi(navigate, t, data));
              dispatch(showDeleteUsersModal(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_DeleteOrganizationsUser_02".toLowerCase()
                )
            ) {
              dispatch(deleteOrganizationUserFail(t("Error-while-deleting")));
              dispatch(showDeleteUsersModal(true));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_DeleteOrganizationsUser_03".toLowerCase()
                )
            ) {
              dispatch(deleteOrganizationUserFail(t("Something-went-wrong")));
              dispatch(showDeleteUsersModal(true));
            } else {
              dispatch(deleteOrganizationUserFail(t("Something-went-wrong")));
              dispatch(showDeleteUsersModal(true));
            }
          } else {
            dispatch(deleteOrganizationUserFail(t("Something-went-wrong")));
            dispatch(showDeleteUsersModal(true));
          }
        } else {
          dispatch(deleteOrganizationUserFail(t("Something-went-wrong")));
          dispatch(showDeleteUsersModal(true));
        }
      })
      .catch((response) => {
        dispatch(deleteOrganizationUserFail(t("Something-went-wrong")));
      });
  };
};

//Payment Initiate Stepper Three API

const paymentInitiateInitApi = () => {
  return {
    type: actions.PAYMENT_INITIATE_INIT,
  };
};

const paymentInitiateSuccessApi = (response, message) => {
  return {
    type: actions.PAYMENT_INITIATE_SUCCESS,
    response: response,
    message: message,
  };
};

const paymentInitiateFailApi = (message) => {
  return {
    type: actions.PAYMENT_INITIATE_FAIL,
    message: message,
  };
};

const paymentInitiateMainApi = (navigate, t, newData) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(paymentInitiateInitApi());
    let form = new FormData();
    form.append("RequestMethod", PaymentInitiateStepperThree.RequestMethod);
    form.append("RequestData", JSON.stringify(newData));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(paymentInitiateMainApi(navigate, t, newData));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentInitiate_01".toLowerCase()
                )
            ) {
              dispatch(
                paymentInitiateSuccessApi(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              // setPaymentModal(true);
              dispatch(openPaymentProcessModal(true));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentInitiate_02".toLowerCase()
                )
            ) {
              dispatch(paymentInitiateFailApi(t("Invalid-request-data")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentInitiate_03".toLowerCase()
                )
            ) {
              dispatch(
                paymentInitiateFailApi(t("Invoice-details-does-not-exist"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentInitiate_04".toLowerCase()
                )
            ) {
              dispatch(
                paymentInitiateFailApi(t("Failed-to-save-billing-information"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentInitiate_05".toLowerCase()
                )
            ) {
              dispatch(paymentInitiateFailApi(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentInitiate_06".toLowerCase()
                )
            ) {
              dispatch(
                paymentInitiateFailApi(t("Payment-gateway-api-response-failed"))
              );
            } else {
              dispatch(paymentInitiateFailApi(t("Something-went-wrong")));
            }
          } else {
            dispatch(paymentInitiateFailApi(t("Something-went-wrong")));
          }
        } else {
          dispatch(paymentInitiateFailApi(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(paymentInitiateFailApi(t("Something-went-wrong")));
      });
  };
};

// For cancel subcription reason
const cancelSubscriptionReasonInit = () => {
  return {
    type: actions.CANCEL_SUB_REASONS_INIT,
  };
};

const cancelSubscriptionReasonSuccess = (response, message) => {
  return {
    type: actions.CANCEL_SUB_REASONS_SUCCESS,
    response: response,
    message: message,
  };
};

const cancelSubscriptionReasonFail = (message) => {
  return {
    type: actions.CANCEL_SUB_REASONS_FAIL,
    message: message,
  };
};

const getCancelSubscriptionReasonApi = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(cancelSubscriptionReasonInit());
    let form = new FormData();
    form.append("RequestMethod", CancelSubReasons.RequestMethod);
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
          dispatch(getCancelSubscriptionReasonApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetCancelSubscriptionReasons_01".toLowerCase()
                )
            ) {
              dispatch(
                cancelSubscriptionReasonSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetCancelSubscriptionReasons_02".toLowerCase()
                )
            ) {
              dispatch(cancelSubscriptionReasonFail(t("No-data-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetCancelSubscriptionReasons_03".toLowerCase()
                )
            ) {
              dispatch(cancelSubscriptionReasonFail(t("Something-went-wrong")));
            } else {
              dispatch(cancelSubscriptionReasonFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(cancelSubscriptionReasonFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(cancelSubscriptionReasonFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(cancelSubscriptionReasonFail(t("Something-went-wrong")));
      });
  };
};

// For CancelOrganizationsSubscription Api submit
const cancelOrganizationSubReasonInit = () => {
  return {
    type: actions.CANCEL_ORGANIZATION_SUB_INIT,
  };
};

const cancelOrganizationSubReasonSuccess = (response, message) => {
  return {
    type: actions.CANCEL_ORGANIZATION_SUB_SUCCESS,
    response: response,
    message: message,
  };
};

const cancelOrganizationSubReasonFail = (message) => {
  return {
    type: actions.CANCEL_ORGANIZATION_SUB_FAIL,
    message: message,
  };
};

const cancelOrganizationSubApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(cancelOrganizationSubReasonInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      CancelOrganizationsSubscriptions.RequestMethod
    );
    form.append("RequestData", JSON.stringify(data));
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
          dispatch(cancelOrganizationSubApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_CancelOrganizationsSubscription_01".toLowerCase()
                )
            ) {
              dispatch(
                cancelOrganizationSubReasonSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              dispatch(showReasonForLeavingModal(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_CancelOrganizationsSubscription_02".toLowerCase()
                )
            ) {
              dispatch(
                cancelOrganizationSubReasonFail(
                  t("organization-subscription-not-cancelled")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_CancelOrganizationsSubscription_03".toLowerCase()
                )
            ) {
              dispatch(
                cancelOrganizationSubReasonFail(
                  t("invalid-subscription-status-id-provided")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_CancelOrganizationsSubscription_04".toLowerCase()
                )
            ) {
              dispatch(
                cancelOrganizationSubReasonFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              cancelOrganizationSubReasonFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(cancelOrganizationSubReasonFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(cancelOrganizationSubReasonFail(t("Something-went-wrong")));
      });
  };
};

// Api for upgrade button on package details which is not ready yet but structure should be ready when Api will implemented ready to go
// const paymentUpgradeDetailInit = () => {
//   return {
//     type: actions.PACKAGE_UPGRADE_DETAIL_INIT,
//   };
// };

// const paymentUpgradeDetailSuccess = (response, message) => {
//   return {
//     type: actions.PACKAGE_UPGRADE_DETAIL_SUCCESS,
//     response: response,
//     message: message,
//   };
// };

// const paymentUpgradeDetailFail = (message) => {
//   return {
//     type: actions.PACKAGE_UPGRADE_DETAIL_FAIL,
//     message: message,
//   };
// };

// const paymentUpgradeDetailMainApi = (navigate, t) => {
//   let token = JSON.parse(localStorage.getItem("token"));
//   return (dispatch) => {
//     let form = new FormData();
//     form.append(
//       "RequestMethod",
//       CancelOrganizationsSubscriptions.RequestMethod
//     );
//     form.append("RequestData", JSON.stringify());
//     axios({
//       method: "post",
//       url: getAdminURLs,
//       data: form,
//       headers: {
//         _token: token,
//       },
//     })
//       .then(async (response) => {
//         if (response.data.responseCode === 417) {
//         } else if (response.data.responseCode === 200) {
//         } else {
//         }
//       })
//       .catch((response) => {});
//   };
// };

// FOR REQUEST ORGANIZATION TRIAL EXTEND
const requestOrganizationExtendInit = () => {
  return {
    type: actions.REQUEST_ORGANIZATION_TRIAL_EXTEND_INIT,
  };
};

const requestOrganizationExtendSuccess = (response, message) => {
  return {
    type: actions.REQUEST_ORGANIZATION_TRIAL_EXTEND_SUCCESS,
    response: response,
    message: message,
  };
};

const requestOrganizationExtendFail = (message) => {
  return {
    type: actions.REQUEST_ORGANIZATION_TRIAL_EXTEND_FAIL,
    message: message,
  };
};

const requestOrganizationExtendApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(requestOrganizationExtendInit());
    let form = new FormData();
    form.append("RequestMethod", requestOrganizationTrialExtend.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
          dispatch(requestOrganizationExtendApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_RequestOrganizationTrialExtend_01".toLowerCase()
                )
            ) {
              dispatch(
                requestOrganizationExtendSuccess(
                  response.data.responseResult,
                  t("Trial-requested-successfully")
                )
              );
              dispatch(showRequestExtentionModal(true));
              dispatch(userLogOutApiFunc(navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_RequestOrganizationTrialExtend_02".toLowerCase()
                )
            ) {
              dispatch(
                requestOrganizationExtendFail(t("User-is-not-an-admin-user"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_RequestOrganizationTrialExtend_03".toLowerCase()
                )
            ) {
              dispatch(
                requestOrganizationExtendFail(
                  t("Error-inserting-trial-request")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_RequestOrganizationTrialExtend_04".toLowerCase()
                )
            ) {
              dispatch(
                requestOrganizationExtendSuccess(
                  t("Trial-requested-successfully-and-auto-extended")
                )
              );
              dispatch(userLogOutApiFunc(navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_RequestOrganizationTrialExtend_05".toLowerCase()
                )
            ) {
              dispatch(
                requestOrganizationExtendFail(t("Something-went-wrong"))
              );
            }
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_RequestOrganizationTrialExtend_06".toLowerCase()
              )
          ) {
            dispatch(
              requestOrganizationExtendSuccess(t("Request-already-exists"))
            );
            dispatch(userLogOutApiFunc(navigate, t));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_RequestOrganizationTrialExtend_07".toLowerCase()
              )
          ) {
            dispatch(
              requestOrganizationExtendFail(t("Trial-extension-already-given"))
            );
          } else {
            dispatch(requestOrganizationExtendFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(requestOrganizationExtendFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(requestOrganizationExtendFail(t("Something-went-wrong")));
      });
  };
};

//Payment Status Api
const paymentStatusInit = () => {
  return {
    type: actions.PAYMENT_STATUS_INIT,
  };
};

const paymentStatusSuccess = (response, message) => {
  return {
    type: actions.PAYMENT_STATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const paymentStatusFailed = (response, message) => {
  return {
    type: actions.PAYMENT_STATUS_FAILED,
    message: message,
  };
};

const paymentStatusApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(paymentStatusInit());
    let form = new FormData();
    form.append("RequestMethod", paymentStatus.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(paymentStatusApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentStatus_01".toLowerCase()
                )
            ) {
              await handleLoginResponse(
                response.data.responseResult.userAuthData
              );
              await dispatch(
                paymentStatusSuccess(
                  response.data.responseResult,
                  t("Successful-organization-subscription-is-activated")
                )
              );
              navigate("/Admin/ManageUsers");
              clearLocalStorageAtloginresponce(dispatch, 1, navigate);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentStatus_02".toLowerCase()
                )
            ) {
              dispatch(
                paymentStatusFailed(t("UnSuccessful-response-from-edfa-pay"))
              );
              clearPaymentActionFromUrl();
              navigate("/");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentStatus_03".toLowerCase()
                )
            ) {
              dispatch(
                paymentStatusFailed(
                  t("UnSuccessful-response-code-from-edfa-pay")
                )
              );
              clearPaymentActionFromUrl();
              navigate("/");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentStatus_04".toLowerCase()
                )
            ) {
              dispatch(paymentStatusFailed(t("Invalid-request-data")));
              clearPaymentActionFromUrl();
              navigate("/");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_PaymentStatus_05".toLowerCase()
                )
            ) {
              dispatch(paymentStatusFailed(t("Not-an-authentic-user")));
              clearPaymentActionFromUrl();
              navigate("/");
            }
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ERM_AuthService_SignUpManager_PaymentStatus_06".toLowerCase()
              )
          ) {
            dispatch(paymentStatusFailed(t("Payment-not-settled")));
            clearPaymentActionFromUrl();
            navigate("/");
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ERM_AuthService_SignUpManager_PaymentStatus_07".toLowerCase()
              )
          ) {
            dispatch(
              paymentStatusFailed(
                t("Error-activating-organization-subscription-and-creator")
              )
            );
            clearPaymentActionFromUrl();
            navigate("/");
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "ERM_AuthService_SignUpManager_PaymentStatus_08".toLowerCase()
              )
          ) {
            console.log(dispatch, "dispatchdispatch");
            dispatch(paymentStatusFailed(t("Something-went-wrong")));
            clearPaymentActionFromUrl();
            navigate("/");
          } else {
            dispatch(paymentStatusFailed(t("Something-went-wrong")));
            clearPaymentActionFromUrl();
            navigate("/");
          }
        } else {
          dispatch(paymentStatusFailed(t("Something-went-wrong")));
          clearPaymentActionFromUrl();
          navigate("/");
        }
      })
      .catch((response) => {
        dispatch(paymentStatusFailed(t("Something-went-wrong")));
      });
  };
};
//Payment Status Api
const changeSelectPacakge_Init = () => {
  return {
    type: actions.CHANGE_PACKAGE_SELECTED_INIT,
  };
};

const changeSelectPacakge_Success = (response, message) => {
  return {
    type: actions.CHANGE_PACKAGE_SELECTED_SUCCESS,
    response: response,
    message: message,
  };
};

const changeSelectPacakge_Failed = (response, message) => {
  return {
    type: actions.CHANGE_PACKAGE_SELECTED_FAIL,
    message: message,
  };
};

const changeSelectPacakgeApi = (navigate, t, data, changePacakgeFlag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(changeSelectPacakge_Init());
    let form = new FormData();
    form.append("RequestMethod", changeSelectedSubscription.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
            changeSelectPacakgeApi(navigate, t, data, changePacakgeFlag)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_ChangeSelectedSubscriptionDetails_01".toLowerCase()
                )
            ) {
              dispatch(changeSelectPacakge_Success(t("Successfully"), ""));
              localStorage.setItem(
                "organizationSubscriptionID",
                Number(response.data.responseResult.subscriptionID)
              );
              if (changePacakgeFlag) {
                localStorage.setItem("SignupFlowPageRoute", 5);
                dispatch(signUpFlowRoutes(5));
                localStorage.removeItem("changePacakgeFlag");
                navigate("/Signup");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_ChangeSelectedSubscriptionDetails_02".toLowerCase()
                )
            ) {
              dispatch(
                changeSelectPacakge_Failed(
                  t("Failed-to-delete-current-Inactive-ubscription")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_ChangeSelectedSubscriptionDetails_03".toLowerCase()
                )
            ) {
              dispatch(
                changeSelectPacakge_Failed(
                  t("Failed-to-save-organization-subscription")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_ChangeSelectedSubscriptionDetails_04".toLowerCase()
                )
            ) {
              dispatch(changeSelectPacakge_Failed(t("Something-went-wrong")));
            }
          } else {
            dispatch(changeSelectPacakge_Failed(t("Something-went-wrong")));
          }
        } else {
          dispatch(changeSelectPacakge_Failed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(changeSelectPacakge_Failed(t("Something-went-wrong")));
      });
  };
};

//
//Payment Status Api
const cancelisTrailandSubscription_Init = () => {
  return {
    type: actions.CANCELFREETRAILANDUPDGRADEORGANIZATION_INIT,
  };
};

const cancelisTrailandSubscription_Success = (response, message) => {
  return {
    type: actions.CANCELFREETRAILANDUPDGRADEORGANIZATION_SUCCESS,
    response: response,
    message: message,
  };
};

const cancelisTrailandSubscription_Failed = (response, message) => {
  return {
    type: actions.CANCELFREETRAILANDUPDGRADEORGANIZATION_FAIL,
    message: message,
  };
};

const cancelisTrailandSubscriptionApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(cancelisTrailandSubscription_Init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      CancelTrailandUpdageOrganiztionRM.RequestMethod
    );
    form.append("RequestData", JSON.stringify(data));
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
          dispatch(cancelisTrailandSubscriptionApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_CancelTrialAndUpgradeOrganizationSubscription_01".toLowerCase()
                )
            ) {
              dispatch(
                cancelisTrailandSubscription_Success(t("Successfully"), "")
              );
              localStorage.setItem(
                "organizationSubscriptionID",
                Number(response.data.responseResult.subscriptionID)
              );
              navigate("/Admin/PaymentFormUserManagement");
              // localStorage.setItem("organizationSubscriptionID", Number(response.data.responseResult.subscriptionID))
              // if (changePacakgeFlag) {

              //   localStorage.setItem("SignupFlowPageRoute", 5);
              //   dispatch(signUpFlowRoutes(5));
              //   localStorage.removeItem("changePacakgeFlag");
              //   navigate("/Signup")
              // }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_CancelTrialAndUpgradeOrganizationSubscription_02".toLowerCase()
                )
            ) {
              dispatch(
                cancelisTrailandSubscription_Failed(
                  t("Failed-to-cancel-trial-subscription")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_CancelTrialAndUpgradeOrganizationSubscription_03".toLowerCase()
                )
            ) {
              dispatch(
                cancelisTrailandSubscription_Failed(
                  t("Failed-to-save-organization-subscription")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_CancelTrialAndUpgradeOrganizationSubscription_04".toLowerCase()
                )
            ) {
              dispatch(
                cancelisTrailandSubscription_Failed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              cancelisTrailandSubscription_Failed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            cancelisTrailandSubscription_Failed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          cancelisTrailandSubscription_Failed(t("Something-went-wrong"))
        );
      });
  };
};
export {
  changeSelectPacakgeApi,
  signUpOrganizationAndPakageSelection,
  // getAllorganizationSubscriptionExpiryDetailsApi,
  ExtendOrganizationTrialApi,
  AddOrganizationsUserApi,
  EditOrganizationsUserApi,
  AllOrganizationsUsersApi,
  OrganizationPackageDetailsAndUserStatsApi,
  GetOrganizationSelectedPackagesByOrganizationIDApi,
  signUpFlowRoutes,
  LoginFlowRoutes,
  getOrganizationSelectedPakagesAPI,
  getOrganizationPackageUserStatsAPI,
  getAllUserTypePackagesApi,
  ResendForgotPasswordCodeApi,
  deleteOrganizationUserAPI,
  paymentInitiateMainApi,
  getCancelSubscriptionReasonApi,
  cancelOrganizationSubApi,
  clearMessegesUserManagement,
  // signupFlowRoutes,
  // paymentUpgradeDetailMainApi
  requestOrganizationExtendApi,
  paymentStatusApi,
  cancelisTrailandSubscriptionApi,
};
