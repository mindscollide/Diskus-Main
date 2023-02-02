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

const GetAllOrganizationRoles = (t) => {
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
          await dispatch(RefreshToken());
          dispatch(GetAllOrganizationRoles(t));
        } else if (response.data.responseResult.isExecuted === true) {
          console.log("asd", response);
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllOrganizationRoles_01"
          ) {
            let newError = t("Record-Found");
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
            let newError = t("No-Record-Found");
            dispatch(getAllOrganizationRolesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllOrganizationRoles_03"
          ) {
            let newError = t("something-went-worng");
            dispatch(getAllOrganizationRolesFail(false, newError));
          }
        } else {
          let newError = t("something-went-worng");
          dispatch(getAllOrganizationRolesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("something-went-worng");
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

const GetAllUserRoles = (t) => {
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
        console.log("ValidateData", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(GetAllUserRoles(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserRoles_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getAllUserRolesSuccess(
                response.data.responseResult.userRoles,
                newError
              )
            );
            await dispatch(GetAllOrganizationRoles(t));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserRoles_02"
          ) {
            let newError = t("No-Record-Found");
            dispatch(getAllUserRolesFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserRoles_03"
          ) {
            let newError = t("something-went-worng");
            dispatch(getAllUserRolesFail(true, newError));
          }
        } else {
          let newError = t("something-went-worng");
          dispatch(getAllUserRolesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("something-went-worng");
        dispatch(getAllUserRolesFail(false, newError));
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

const GetOrganizationByID = (object, t) => {
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
          await dispatch(RefreshToken());
          dispatch(GetOrganizationByID(object, t));
        } else if (response.data.responseResult.isExecuted === true) {
          console.log("GetOrganizationByID", response.data.responseResult);
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetOrganizationByID_01"
          ) {
            let newError = t("Record-Found");
            await dispatch(
              getOrganizationByIDSuccess(
                response.data.responseResult.organizationDetails,
                newError
              )
            );
            console.log("GetOrganizationByID", response.data.responseResult);

            await dispatch(GetAllUserRoles(t));
            console.log("GetOrganizationByID", response.data.responseResult);
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetOrganizationByID_02"
          ) {
            let newError = t("No-Record-Found");
            dispatch(getOrganizationByIDFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetOrganizationByID_03"
          ) {
            let newError = t("something-went-worng");
            dispatch(getOrganizationByIDFail(true, newError));
          }
        } else {
          let newToste = t("something-went-worng");
          dispatch(getOrganizationByIDFail(false, newToste));
        }
      })
      .catch((response) => {
        let newToste = t("something-went-worng");
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

const GetAllUserStatus = (t) => {
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
        console.log("GetAllUserStatus", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(GetAllUserStatus(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_01"
          ) {
            let newError = t("Record-Found");
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
            let newError = t("No-Record-Found");
            dispatch(getAllUserStatusFail(false, newError));
          } else if (
            response.data.responseResult.responseMessage ===
            "Admin_AdminServiceManager_GetAllUserStatus_03"
          ) {
            let newError = t("something-went-worng");
            dispatch(getAllUserStatusFail(true, newError));
          }
        } else {
          let newError = t("something-went-worng");
          dispatch(getAllUserRolesFail(false, newError));
        }
      })
      .catch((response) => {
        let newError = t("something-went-worng");
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
