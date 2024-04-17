import {
  AddOrganizationsUser,
  AllOrganizationsUsers,
  GetOrganizationSelectedPackagesByOrganizationID,
  IsPackageExpiryDetail,
  SaveOrganizationAndPakageSelection,
  getOrganizationSelectedPakages,
  OrganizationPackageDetailsAndUserStats,
  GetAllUserTypePackages,
  deleteOrganizationUserApi,
  ResendForgotPasswordCode,
  EditOrganizationsUser,
  DeleteOrganizationsUser,
} from "../../commen/apis/Api_config";
import {
  authenticationApi,
  getAdminURLs,
} from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import { getUserSetting } from "./GetUserSetting";
import { getAllLanguages } from "./Language_actions";
import {
  showDeleteUsersModal,
  showEditUserModal,
  showSucessfullyUpdatedModal,
} from "./UserMangementModalActions";

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

// //GET ALL ORGANIZATION SUBSCRIPTION EXPIRY DETAILS
// const getAllorganizationSubscriptionExpiryDetialsInit = () => {
//   return {
//     type: actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_INIT,
//   };
// };

// const getAllorganizationSubscriptionExpiryDetialsSuccess = (
//   response,
//   message
// ) => {
//   return {
//     type: actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_SUCCESS,
//     response: response,
//     message: message,
//   };
// };

// const getAllorganizationSubscriptionExpiryDetialsFailed = (message) => {
//   return {
//     type: actions.GET_ORGANIZATION_SUBSCRIPTION_EXPIRYDETAILS_FAILS,
//     message: message,
//   };
// };

// const getAllorganizationSubscriptionExpiryDetailsApi = (navigate, t, data) => {
//   let token = JSON.parse(localStorage.getItem("token"));

//   return (dispatch) => {
//     dispatch(getAllorganizationSubscriptionExpiryDetialsInit());
//     let form = new FormData();
//     form.append("RequestData", JSON.stringify(data));
//     form.append(
//       "RequestMethod",
//       IsPackageExpiryDetail.RequestMethod
//     );
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
//           await dispatch(RefreshToken(navigate, t));
//           dispatch(
//             getAllorganizationSubscriptionExpiryDetailsApi(navigate, t, data)
//           );
//         } else if (response.data.responseCode === 200) {
//           if (response.data.responseResult.isExecuted === true) {
//             if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_01".toLowerCase()
//                 )
//             ) {
//               console.log("dateOfExpiry",response.data.responseResult)
//               localStorage.setItem(
//                 "dateOfExpiry",
//                 response.data.responseResult.dateOfExpiry
//               );
//               localStorage.setItem(
//                 "isExtensionAvailable",
//                 response.data.responseResult.isExtensionAvailable
//               );
//               localStorage.setItem(
//                 "remainingDays",
//                 response.data.responseResult.remainingDays
//               );
//               dispatch(
//                 getAllorganizationSubscriptionExpiryDetialsSuccess(
//                   response.data.responseResult,
//                   t("Successful")
//                 )
//               );

//               await dispatch(getUserSetting(navigate, t, true));
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_02".toLowerCase()
//                 )
//             ) {
//               dispatch(
//                 getAllorganizationSubscriptionExpiryDetialsFailed(
//                   t("Invalid-data-provided")
//                 )
//               );
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_03".toLowerCase()
//                 )
//             ) {
//               dispatch(
//                 getAllorganizationSubscriptionExpiryDetialsFailed(
//                   t("Subscription-not-found")
//                 )
//               );
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Admin_AdminServiceManager_GetOrganizationSubscriptionExpiryDetails_05".toLowerCase()
//                 )
//             ) {
//               dispatch(
//                 getAllorganizationSubscriptionExpiryDetialsFailed(
//                   t("Something-went-wrong")
//                 )
//               );
//             } else {
//               dispatch(
//                 getAllorganizationSubscriptionExpiryDetialsFailed(
//                   t("Something-went-wrong")
//                 )
//               );
//             }
//           } else {
//             dispatch(
//               getAllorganizationSubscriptionExpiryDetialsFailed(
//                 t("Something-went-wrong")
//               )
//             );
//           }
//         } else {
//           dispatch(
//             getAllorganizationSubscriptionExpiryDetialsFailed(
//               t("Something-went-wrong")
//             )
//           );
//         }
//       })
//       .catch((response) => {
//         dispatch(
//           getAllorganizationSubscriptionExpiryDetialsFailed(
//             t("Something-went-wrong")
//           )
//         );
//       });
//   };
// };

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
    form.append("RequestMethod", IsPackageExpiryDetail.RequestMethod);
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
                editOrganizationUsersSuccess(
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
                  "Admin_AdminServiceManager_GetOrganizationSelectedPackages_01".toLowerCase()
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
                  "Admin_AdminServiceManager_GetOrganizationSelectedPackages_02".toLowerCase()
                )
            ) {
              dispatch(
                getOrganizationSelectedPakagesFailed(t("No-data-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetOrganizationSelectedPackages_03".toLowerCase()
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
const getOrganizationPackageUserStatsAPI = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getOrganizationPackageUserStatsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
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
          dispatch(getOrganizationPackageUserStatsAPI(navigate, t, data));
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

const getAllUserTypePackagesSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_USER_TYPES_PAKAGES_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllUserTypePackagesFail = (message) => {
  return {
    type: actions.GET_ALL_USER_TYPES_PAKAGES_FAIL,
    message: message,
  };
};

const getAllUserTypePackagesApi = (navigate, t) => {
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
          dispatch(getAllUserTypePackagesApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetAllUserTypePackages_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllUserTypePackagesSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
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
                  t("Data-available")
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
              dispatch(deleteOrganizationUserFail(t("No-data-found")));
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

export {
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
};
