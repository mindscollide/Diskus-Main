import * as actions from "../action_types";
import axios from "axios";
import {
  AddOrganizationUser,
  allOrganizationUsers,
  deleteOrganizationUser,
  editOrganizationUser,
  OrganizationUserListStatistics,
} from "../../commen/apis/Api_config";
import {
  authenticationApi,
  getAdminURLs,
} from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
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

const addUserAction = (Data, setEmailVerifyModal, setAllowedLimitModal, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(addUserInit());
    let form = new FormData();
    form.append("RequestMethod", AddOrganizationUser.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(
            addUserAction(Data, setEmailVerifyModal, setAllowedLimitModal, t)
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
              "User-created-successfully-and-the-OTP-has-been-generated-Please-verify-you-email"
            );
            dispatch(addUserSuccess(response.data.responseResult, newMessage));
            return setEmailVerifyModal(true);
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
            // return setEmailVerifyModal(true);
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_04".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-Create-User");
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
            let newMessage = t("The-user-has-been-added-successfully");
            dispatch(addUserSuccess(response.data.responseResult, newMessage));
            return setEmailVerifyModal(true);
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
              "User-Has-Been-Created-Successfully-with-Closed-status"
            );
            dispatch(addUserFail(newMessage));
            return setAllowedLimitModal(true);
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_09".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-Create-User");
            dispatch(addUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_10".toLowerCase()
              )
          ) {
            let newMessage = t("Invalid-User-Email");
            dispatch(addUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_11".toLowerCase()
              )
          ) {
            let newMessage = t("Invalid-Organization");
            dispatch(addUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AddOrganizationUser_12".toLowerCase()
              )
          ) {
            let newMessage = t("something-went-worng");
            dispatch(addUserFail(newMessage));
          }
        } else {
          let newMessage = t("something-went-worng");
          dispatch(addUserFail(newMessage));
        }
      })
      .catch((response) => {
        let newMessage = t("something-went-worng");
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

const OrganizationUserListStatisticsAction = (Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(OrganizationUserListStatisticsInit());
    let form = new FormData();
    form.append("RequestMethod", OrganizationUserListStatistics.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(OrganizationUserListStatisticsAction(Data, t));
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
                t("Data-Available")
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
              OrganizationUserListStatisticsFail(t("something-went-worng"))
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
              OrganizationUserListStatisticsFail(t("something-went-worng"))
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
        dispatch(OrganizationUserListStatisticsFail(t("something-went-worng")));
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
const AllUserAction = (Data, t, setIsUpdateSuccessfully) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(allUserListInit());
    let form = new FormData();
    form.append("RequestMethod", allOrganizationUsers.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(addUserAction(Data, t, setIsUpdateSuccessfully));
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
              let newMessage = t("Data-Available");
              await dispatch(
                allUserListSuccess(
                  response.data.responseResult.organizationUsers,
                  newMessage
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
              let newMessage = t("something-went-worng");
              dispatch(allUserListFail(newMessage));
            }
          } else {
            console.log("Admin_AdminServiceManager_AllOrganizationUsers_02");
            let newMessage = t("something-went-worng");
            dispatch(allUserListFail(newMessage));
          }
        } else {
          console.log("Admin_AdminServiceManager_AllOrganizationUsers_02");
          let newMessage = t("something-went-worng");
          dispatch(allUserListFail(newMessage));
        }
      })
      .catch((response) => {
        console.log("Admin_AdminServiceManager_AllOrganizationUsers_02");
        let newMessage = t("something-went-worng");
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
  setIsUpdateSuccessfully,
  setEditModal,
  updateData,
  t
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(editUserInit());
    let form = new FormData();
    form.append("RequestMethod", editOrganizationUser.RequestMethod);
    form.append("RequestData", JSON.stringify(updateData));
    await axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(
            editUserAction(setIsUpdateSuccessfully, setEditModal, updateData, t)
          );
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_01".toLowerCase()
              )
          ) {
            let newMessage = t("You-are-not-an-admin-Please-contact-support");
            dispatch(editUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_02".toLowerCase()
              )
          ) {
            let newMessage = t("The-user-has-been-edited-successfully.");
            await dispatch(
              editUserSuccess(response.data.responseResult, newMessage)
            );
            try {
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
            let newMessage = t("Failed-to-update-User.");
            dispatch(editUserSuccess(response.data.responseResult, newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_04".toLowerCase()
              )
          ) {
            let newMessage = t(
              "The-user-have-been-updated-successfully-but-the-user-status-has-not-been-updated"
            );
            await dispatch(editUserFail(newMessage));
            try {
              setIsUpdateSuccessfully(true);
              setEditModal(false);
            } catch (response) {}
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_05".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-update-user.");
            dispatch(addUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_06".toLowerCase()
              )
          ) {
            let newMessage = t("The-user-has-been-edited-successfully");
            await dispatch(
              editUserSuccess(response.data.responseResult, newMessage)
            );
            try {
              setIsUpdateSuccessfully(true);
              setEditModal(false);
            } catch (response) {}
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_07".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-updated-user");
            dispatch(editUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_08".toLowerCase()
              )
          ) {
            let newMessage = t("The-user-has-been-edited-successfully");
            dispatch(editUserFail(newMessage));
            // return setAllowedLimitModal(true);
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_09".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-updated-user");
            dispatch(editUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_10".toLowerCase()
              )
          ) {
            let newMessage = t("Failed-to-updated-user");
            dispatch(editUserFail(newMessage));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_EditOrganizationUser_11".toLowerCase()
              )
          ) {
            let newMessage = t("something-went-worng");
            dispatch(editUserFail(newMessage));
          }
        } else {
          let newMessage = t("something-went-worng");
          dispatch(editUserFail(newMessage));
        }
      })
      .catch((response) => {
        let newMessage = t("something-went-worng");
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

const deleteUserAction = (dataForDelete, setDeleteEditModal, newData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(deleteUserInit());
    let form = new FormData();
    form.append("RequestMethod", deleteOrganizationUser.RequestMethod);
    form.append("RequestData", JSON.stringify(dataForDelete));
    await axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(
            deleteUserAction(dataForDelete, setDeleteEditModal, newData, t)
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
            await dispatch(AllUserAction(newData, t));
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
            let newMessage = t("something-went-worng");
            dispatch(deleteUserFail(newMessage));
          }
        } else {
          let newMessage = t("something-went-worng");
          dispatch(deleteUserFail(newMessage));
        }
      })
      .catch((response) => {
        let newMessage = t("something-went-worng");
        dispatch(deleteUserFail(newMessage));
      });
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
};
