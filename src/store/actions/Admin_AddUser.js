import * as actions from "../action_types";
import {
  AddOrganizationUser,
  allOrganizationUsers,
  deleteOrganizationUser,
  editOrganizationUser,
  OrganizationUserListStatistics,
} from "../../commen/apis/Api_config";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";
const addUserInit = () => {
  return {
    type: actions.ADMIN_ADDUSER_INIT,
  };
};

const addUserSuccess = (response, message) => {
  return {
    type: actions.ADMIN_ADDUSER_SUCCESS,
    response: response,
    message: message,
  };
};

const addUserFail = (message) => {
  return {
    type: actions.ADMIN_ADDUSER_FAIL,
    message: message,
  };
};

const addUserAction = (
  navigate,
  Data,
  setEmailVerifyModal,
  setAllowedLimitModal,
  t
) => {
  return async (dispatch) => {
    dispatch(addUserInit());
    let form = new FormData();
    form.append("RequestMethod", AddOrganizationUser.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(getAdminURLs, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            addUserAction(
              navigate,
              Data,
              setEmailVerifyModal,
              setAllowedLimitModal,
              t
            )
          );
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_01".toLowerCase()
              )
          ) {
            let newMessage = t("You-are-not-an-admin-Please-contact-support");
            dispatch(addUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_02".toLowerCase()
              )
          ) {
            let newMessage = t(
              "User-created-successfully-and-the-otp-has-been-generated-please-verify-you-email"
            );
            dispatch(addUserSuccess(response.data.responseResult, newMessage));
            try {
              setEmailVerifyModal(true);
            } catch {}
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_03".toLowerCase()
              )
          ) {
            let newMessage = t(
              "User-was-created-successfully-but-failed-to-generate-OTP"
            );
            dispatch(addUserSuccess(response.data.responseResult, newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_04".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-create-user");
            dispatch(addUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_05".toLowerCase()
              )
          ) {
            let newMessage = t(
              "user-has-not-been-created-but-associated-with-the-organization"
            );
            dispatch(addUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_06".toLowerCase()
              )
          ) {
            let newMessage = t("Something-went-wrong");
            dispatch(addUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_07".toLowerCase()
              )
          ) {
            let newMessage = t(
              "Email-already-exists-against-this-organization-Please-try-some-other-email"
            );
            dispatch(addUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_08".toLowerCase()
              )
          ) {
            let newMessage = t(
              "User-has-been-created-successfully-with-closed-status"
            );
            dispatch(addUserFail(newMessage));
            try {
              setAllowedLimitModal(true);
            } catch {}
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_09".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-create-user");
            dispatch(addUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_11".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-create-user");
            dispatch(addUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_12".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-create-user");
            dispatch(addUserFail(newMessage));
          } else {
            let newMessage = t("Something-went-wrong");
            dispatch(addUserFail(newMessage));
          }
        } else {
          let newMessage = t("Something-went-wrong");
          dispatch(addUserFail(newMessage));
        }
      })
      .catch((response) => {
        let newMessage = t("Something-went-wrong");
        dispatch(addUserFail(newMessage));
      });
  };
};

const OrganizationUserListStatisticsInit = () => {
  return {
    type: actions.ADMIN_USERLISTSTATIST_INIT,
  };
};

const OrganizationUserListStatisticsSuccess = (response, message) => {
  return {
    type: actions.ADMIN_USERLISTSTATIST_SUCCESS,
    response: response,
    // message: message,
  };
};

const OrganizationUserListStatisticsFail = (message) => {
  return {
    type: actions.ADMIN_USERLISTSTATIST_FAIL,
    message: message,
  };
};

const OrganizationUserListStatisticsAction = (navigate, Data, t) => {
  return async (dispatch) => {
    dispatch(OrganizationUserListStatisticsInit());
    let form = new FormData();
    form.append("RequestMethod", OrganizationUserListStatistics.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(getAdminURLs, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(OrganizationUserListStatisticsAction(navigate, Data, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_OrganizationUserListStatistics_01".toLowerCase()
              )
          ) {
            dispatch(
              OrganizationUserListStatisticsFail(
                t("You-are-not-an-admin.- contact-support")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_OrganizationUserListStatistics_02".toLowerCase()
              )
          ) {
            dispatch(
              OrganizationUserListStatisticsSuccess(
                response.data.responseResult,
                ""
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_OrganizationUserListStatistics_03".toLowerCase()
              )
          ) {
            dispatch(
              OrganizationUserListStatisticsFail(t("Something-went-wrong"))
            );
          }
        } else {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_OrganizationUserListStatistics_03".toLowerCase()
              )
          ) {
            dispatch(
              OrganizationUserListStatisticsFail(t("Something-went-wrong"))
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_OrganizationUserListStatistics_01".toLowerCase()
              )
          ) {
            dispatch(
              OrganizationUserListStatisticsFail(
                t("You-are-not-an-admin.- contact-support")
              )
            );
          }
        }
      })
      .catch((response) => {
        dispatch(OrganizationUserListStatisticsFail(t("Something-went-wrong")));
      });
  };
};

const allUserListInit = () => {
  return {
    type: actions.ADMIN_ALLUSERLIST_INIT,
  };
};

const allUserListSuccess = (response, message) => {
  return {
    type: actions.ADMIN_ALLUSERLIST_SUCCESS,
    response: response,
    message: message,
  };
};

const allUserListFail = (message) => {
  return {
    type: actions.ADMIN_ALLUSERLIST_FAIL,
    message: message,
  };
};
const AllUserAction = (navigate, Data, t, setIsUpdateSuccessfully) => {
  return async (dispatch) => {
    dispatch(allUserListInit());
    let form = new FormData();
    form.append("RequestMethod", allOrganizationUsers.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(getAdminURLs, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(addUserAction(navigate, Data, t, setIsUpdateSuccessfully));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AllOrganizationUsers_01".toLowerCase()
                )
            ) {
              let newMessage = t("You-are-not-an-admin-Please-contact-support");
              dispatch(allUserListFail(newMessage));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AllOrganizationUsers_02".toLowerCase()
                )
            ) {
              await dispatch(
                allUserListSuccess(
                  response.data.responseResult.organizationUsers,
                  ""
                )
              );
              try {
                setIsUpdateSuccessfully(false);
              } catch (response) {}
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AllOrganizationUsers_03".toLowerCase()
                )
            ) {
              let newMessage = t("No-data-available-against-this-Organization");
              dispatch(allUserListFail(newMessage));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AllOrganizationUsers_04".toLowerCase()
                )
            ) {
              let newMessage = t("Something-went-wrong");
              dispatch(allUserListFail(newMessage));
            }
          } else {
            let newMessage = t("Something-went-wrong");
            dispatch(allUserListFail(newMessage));
          }
        } else {
          let newMessage = t("Something-went-wrong");
          dispatch(allUserListFail(newMessage));
        }
      })
      .catch((response) => {
        let newMessage = t("Something-went-wrong");
        dispatch(allUserListFail(newMessage));
      });
  };
};

const editUserInit = () => {
  return {
    type: actions.ADMIN_EDITORGANIZATIONUSER_INIT,
  };
};

const editUserSuccess = (response, message) => {
  return {
    type: actions.ADMIN_EDITORGANIZATIONUSER_SUCCESS,
    response: response,
    message: message,
  };
};

const editUserFail = (message) => {
  return {
    type: actions.ADMIN_EDITORGANIZATIONUSER_FAIL,
    message: message,
  };
};

const editUserAction = (
  navigate,
  setIsUpdateSuccessfully,
  setEditModal,
  updateData,
  t,
  setIsUserNotUpdate
) => {
  return async (dispatch) => {
    dispatch(editUserInit());
    let form = new FormData();
    form.append("RequestMethod", editOrganizationUser.RequestMethod);
    form.append("RequestData", JSON.stringify(updateData));
    axiosInstance
      .post(getAdminURLs, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            editUserAction(
              navigate,
              setIsUpdateSuccessfully,
              setEditModal,
              updateData,
              t,
              setIsUserNotUpdate
            )
          );
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_01".toLowerCase()
              )
          ) {
            let newMessage = t("You-are-not-an-admin-please-contact-support");
            dispatch(editUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_02".toLowerCase()
              )
          ) {
            let newMessage = t("The-user-has-been-edited-successfully");
            await dispatch(
              editUserSuccess(response.data.responseResult, newMessage)
            );
            try {
              setIsUserNotUpdate(false);
              setIsUpdateSuccessfully(true);
              setEditModal(false);
            } catch (response) {}
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_03".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-update-user");
            dispatch(editUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_04".toLowerCase()
              )
          ) {
            let newMessage = t(
              "The-user-has-been-updated-but-the-status-has-not-been-updated"
            );
            await dispatch(
              editUserSuccess(response.data.responseResult, newMessage)
            );
            try {
              setIsUserNotUpdate(true);
              setIsUpdateSuccessfully(false);
              setEditModal(false);
            } catch (response) {}
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_05".toLowerCase()
              )
          ) {
            let newMessage = t("Something-went-wrong");
            dispatch(editUserFail(newMessage));
          } else {
            let newMessage = t("Something-went-wrong");
            dispatch(editUserFail(newMessage));
          }
        } else {
          let newMessage = t("Something-went-wrong");
          dispatch(editUserFail(newMessage));
        }
      })
      .catch((response) => {
        let newMessage = t("Something-went-wrong");
        dispatch(editUserFail(newMessage));
      });
  };
};

const deleteUserInit = () => {
  return {
    type: actions.ADMIN_DELETEORGANIZATIONUSER_INIT,
  };
};

const deleteUserSuccess = (response, message) => {
  return {
    type: actions.ADMIN_DELETEORGANIZATIONUSER_SUCCESS,
    response: response,
    message: message,
  };
};

const deleteUserFail = (message) => {
  return {
    type: actions.ADMIN_DELETEORGANIZATIONUSER_FAIL,
    message: message,
  };
};

const deleteUserAction = (
  navigate,
  dataForDelete,
  setDeleteEditModal,
  newData,
  t
) => {
  return async (dispatch) => {
    dispatch(deleteUserInit());
    let form = new FormData();
    form.append("RequestMethod", deleteOrganizationUser.RequestMethod);
    form.append("RequestData", JSON.stringify(dataForDelete));
    axiosInstance
      .post(getAdminURLs, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            deleteUserAction(
              navigate,
              dataForDelete,
              setDeleteEditModal,
              newData,
              t
            )
          );
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_DeleteOrganizationUser_01".toLowerCase()
              )
          ) {
            let newMessage = t("You-are-not-an-admin-Please-contact-support");
            dispatch(deleteUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_DeleteOrganizationUser_02".toLowerCase()
              )
          ) {
            let newMessage = t("Organization-user-deleted-successfully");
            await dispatch(
              deleteUserSuccess(response.data.responseResult, newMessage)
            );
            await dispatch(AllUserAction(navigate, newData, t));
            return setDeleteEditModal(false);
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_DeleteOrganizationUser_03".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-delete-organization-user");
            dispatch(deleteUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_DeleteOrganizationUser_04".toLowerCase()
              )
          ) {
            let newMessage = t("Something-went-wrong");
            dispatch(deleteUserFail(newMessage));
          }
        } else {
          let newMessage = t("Something-went-wrong");
          dispatch(deleteUserFail(newMessage));
        }
      })
      .catch((response) => {
        let newMessage = t("Something-went-wrong");
        dispatch(deleteUserFail(newMessage));
      });
  };
};
const setLoader = (response) => {
  return {
    type: actions.ADD_USER_LOADER,
    response: response,
  };
};
const setEmailCheck = (response) => {
  return {
    type: actions.ADD_EMAIL_CHECK_FALSE,
    response: response,
  };
};
const cleareMessage = () => {
  return {
    type: actions.ADMIN_CLEARE_MESSAGE,
  };
};

export {
  addUserAction,
  OrganizationUserListStatisticsAction,
  cleareMessage,
  AllUserAction,
  editUserAction,
  deleteUserAction,
  setLoader,
  setEmailCheck,
};
