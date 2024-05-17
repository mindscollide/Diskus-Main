import {
  getAllOrganizationRoles,
  getAllUserRoles,
  getAllUserStatus,
  getOrganizationByID,
} from "../../commen/apis/Api_config";
import * as actions from "../action_types";
import axios from "axios";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";

const getAllOrganizationRolesinit = (response) => {
  return {
    type: actions.ADMIN_ALLORGANAIZATIONROLES_INIT,
    response: response,
  };
};

const getAllOrganizationRolesSuccess = (response, message) => {
  return {
    type: actions.ADMIN_ALLORGANAIZATIONROLES_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllOrganizationRolesFail = (response, message) => {
  return {
    type: actions.ADMIN_ALLORGANAIZATIONROLES_FAIL,
    response: response,
    message: message,
  };
};

const GetAllOrganizationRoles = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllOrganizationRolesinit());
    let form = new FormData();
    form.append("RequestMethod", getAllOrganizationRoles.RequestMethod);
    // form.append("RequestData", JSON.stringify(object));

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
          dispatch(GetAllOrganizationRoles(navigate, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllOrganizationRoles_01"
          ) {
            let newError = "";
            dispatch(
              getAllOrganizationRolesSuccess(
                response.data.responseResult.organizationRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllOrganizationRoles_02"
          ) {
            let newError = t("No-records-found");
            dispatch(getAllOrganizationRolesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllOrganizationRoles_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getAllOrganizationRolesFail(false, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getAllOrganizationRolesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getAllOrganizationRolesFail(false, newError));
      });
  };
};

const getAllUserRolesInit = (response) => {
  return {
    type: actions.ADMIN_USERROLELIST_INIT,
    response: response,
  };
};

const getAllUserRolesSuccess = (response, message) => {
  return {
    type: actions.ADMIN_USERROLELIST_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllUserRolesFail = (response, message) => {
  return {
    type: actions.ADMIN_USERROLELIST_FAIL,
    response: response,
    message: message,
  };
};

const GetAllUserRoles = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllUserRolesInit());
    let form = new FormData();
    form.append("RequestMethod", getAllUserRoles.RequestMethod);
    // form.append("RequestData", JSON.stringify(object));

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
          dispatch(GetAllUserRoles(navigate, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserRoles_01"
          ) {
            let newError = "";
            await dispatch(
              getAllUserRolesSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
            await dispatch(GetAllOrganizationRoles(navigate, t));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserRoles_02"
          ) {
            let newError = t("No-records-found");
            dispatch(getAllUserRolesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserRoles_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getAllUserRolesFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getAllUserRolesFail(false, newError));
        }
      })
      .catch((response) => {
        dispatch(getAllUserRolesFail(false, t("Something-went-wrong")));
      });
  };
};

const getOrganizationByIDInit = (response) => {
  return {
    type: actions.ADMIN_GETORGANAIZATIONID_INIT,
    response: response,
  };
};

const getOrganizationByIDSuccess = (response, message) => {
  return {
    type: actions.ADMIN_GETORGANAIZATIONID_INIT_SUCCESS,
    response: response,
    message: message,
  };
};

const getOrganizationByIDFail = (response, message) => {
  return {
    type: actions.ADMIN_GETORGANAIZATIONID_INIT_FAIL,
    response: response,
    message: message,
  };
};

const GetOrganizationByID = (navigate, object, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getOrganizationByIDInit());
    let form = new FormData();
    form.append("RequestMethod", getOrganizationByID.RequestMethod);
    form.append("RequestData", JSON.stringify(object));

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
          dispatch(GetOrganizationByID(navigate, object, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetOrganizationByID_01"
          ) {
            let newError = "";
            await dispatch(
              getOrganizationByIDSuccess(
                response.data.responseResult.organizationDetails,
                newError
              )
            );

            await dispatch(GetAllUserRoles(navigate, t));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetOrganizationByID_02"
          ) {
            let newError = t("No-records-found");
            dispatch(getOrganizationByIDFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetOrganizationByID_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getOrganizationByIDFail(true, newError));
          }
        } else {
          let newToste = t("Something-went-wrong");
          dispatch(getOrganizationByIDFail(false, newToste));
        }
      })
      .catch((response) => {
        let newToste = t("Something-went-wrong");
        dispatch(getOrganizationByIDFail(false, newToste));
      });
  };
};
const getAllUserStatusInit = (response) => {
  return {
    type: actions.ADMIN_USERSTATUSLIST_INIT,
    response: response,
  };
};

const getAllUserStatusSuccess = (response, message) => {
  return {
    type: actions.ADMIN_USERSTATUSLIST_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllUserStatusFail = (response, message) => {
  return {
    type: actions.ADMIN_USERSTATUSLIST_FAIL,
    response: response,
    message: message,
  };
};

const GetAllUserStatus = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllUserStatusInit());
    let form = new FormData();
    form.append("RequestMethod", getAllUserStatus.RequestMethod);
    // form.append("RequestData", JSON.stringify(object));

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
          dispatch(GetAllUserStatus(navigate, t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = "";
            await dispatch(
              getAllUserStatusSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_02"
          ) {
            let newError = t("No-records-found");
            dispatch(getAllUserStatusFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
          ) {
            let newError = t("Something-went-wrong");
            dispatch(getAllUserStatusFail(true, newError));
          }
        } else {
          let newError = t("Something-went-wrong");
          dispatch(getAllUserRolesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("Something-went-wrong");
        dispatch(getAllUserStatusFail(false, newError));
      });
  };
};
export {
  GetAllOrganizationRoles,
  GetAllUserRoles,
  GetOrganizationByID,
  GetAllUserStatus,
};
