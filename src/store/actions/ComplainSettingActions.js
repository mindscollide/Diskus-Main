import * as actions from "../action_types";

import { complainceApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";
import {
  AddAuthority,
  DeleteAuthority,
  GetAllAuthority,
  GetAuthorityByID,
  UpdateAuthority,
} from "../../commen/apis/Api_config";

const GetAllAuthorityInit = () => {
  return {
    type: actions.GET_ALL_AUTHORITY_INIT,
  };
};

const GetAllAuthoritySuccess = (response, message) => {
  return {
    type: actions.GET_ALL_AUTHORITY_SUCCESS,
    response: response,
    message: message,
  };
};

const GetAllAuthorityFail = (message) => {
  return {
    type: actions.GET_ALL_AUTHORITY_FAIL,
    message: message,
  };
};

const GetAllAuthorityAPI = (navigate, t) => {
  return (dispatch) => {
    dispatch(GetAllAuthorityInit());
    let form = new FormData();
    form.append("RequestMethod", GetAllAuthority.RequestMethod);
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllAuthorityAPI(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthority_01".toLowerCase()
                )
            ) {
              await dispatch(
                GetAllAuthoritySuccess(
                  response.data.responseResult.taskStatuses,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthority_02".toLowerCase()
                )
            ) {
              await dispatch(GetAllAuthorityFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthority_03".toLowerCase()
                )
            ) {
              await dispatch(GetAllAuthorityFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(GetAllAuthorityFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(GetAllAuthorityFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(GetAllAuthorityFail(t("Something-went-wrong")));
      });
  };
};

// GetAuthorityByID
const GetAuthorityByIDInit = () => {
  return {
    type: actions.GET_AUTHORITY_BY_ID_INIT,
  };
};

const GetAuthorityByIDSuccess = (response, message) => {
  return {
    type: actions.GET_AUTHORITY_BY_ID_SUCCESS,
    response: response,
    message: message,
  };
};

const GetAuthorityByIDFail = (message) => {
  return {
    type: actions.GET_AUTHORITY_BY_ID_FAIL,
    message: message,
  };
};

const GetAuthorityByIDAPI = (navigate, t) => {
  return (dispatch) => {
    dispatch(GetAuthorityByIDInit());
    let form = new FormData();
    form.append("RequestMethod", GetAuthorityByID.RequestMethod);
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAuthorityByIDAPI(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAuthorityByID_01".toLowerCase()
                )
            ) {
              await dispatch(
                GetAuthorityByIDSuccess(
                  response.data.responseResult.taskStatuses,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAuthorityByID_02".toLowerCase()
                )
            ) {
              await dispatch(GetAuthorityByIDFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAuthorityByID_03".toLowerCase()
                )
            ) {
              await dispatch(GetAuthorityByIDFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(GetAuthorityByIDFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(GetAuthorityByIDFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(GetAuthorityByIDFail(t("Something-went-wrong")));
      });
  };
};

// DeleteAuthority
const DeleteAuthorityInit = () => {
  return {
    type: actions.DELETE_AUTHORITY_INIT,
  };
};

const DeleteAuthoritySuccess = (response, message) => {
  return {
    type: actions.DELETE_AUTHORITY_SUCCESS,
    response: response,
    message: message,
  };
};

const DeleteAuthorityFail = (message) => {
  return {
    type: actions.DELETE_AUTHORITY_FAIL,
    message: message,
  };
};

const DeleteAuthorityAPI = (navigate, t) => {
  return (dispatch) => {
    dispatch(DeleteAuthorityInit());
    let form = new FormData();
    form.append("RequestMethod", DeleteAuthority.RequestMethod);
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DeleteAuthorityAPI(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_DeleteAuthority_01".toLowerCase()
                )
            ) {
              await dispatch(
                DeleteAuthoritySuccess(
                  response.data.responseResult.taskStatuses,
                  t("Data-deleted-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_DeleteAuthority_02".toLowerCase()
                )
            ) {
              await dispatch(DeleteAuthorityFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_DeleteAuthority_03".toLowerCase()
                )
            ) {
              await dispatch(DeleteAuthorityFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(DeleteAuthorityFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(DeleteAuthorityFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(DeleteAuthorityFail(t("Something-went-wrong")));
      });
  };
};

// UpdateAuthority
const UpdateAuthorityInit = () => {
  return {
    type: actions.UPDATE_AUTHORITY_INIT,
  };
};

const UpdateAuthoritySuccess = (response, message) => {
  return {
    type: actions.UPDATE_AUTHORITY_SUCCESS,
    response: response,
    message: message,
  };
};

const UpdateAuthorityFail = (message) => {
  return {
    type: actions.UPDATE_AUTHORITY_FAIL,
    message: message,
  };
};

const UpdateAuthorityAPI = (navigate, t) => {
  return (dispatch) => {
    dispatch(UpdateAuthorityInit());
    let form = new FormData();
    form.append("RequestMethod", UpdateAuthority.RequestMethod);
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(UpdateAuthorityAPI(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_UpdateAuthority_01".toLowerCase()
                )
            ) {
              await dispatch(
                UpdateAuthoritySuccess(
                  response.data.responseResult.taskStatuses,
                  t("Authority-updated-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_UpdateAuthority_02".toLowerCase()
                )
            ) {
              await dispatch(
                UpdateAuthorityFail(
                  t("Authority-shortCode-already-exists-for-this-organization")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_UpdateAuthority_03".toLowerCase()
                )
            ) {
              await dispatch(
                UpdateAuthorityFail(
                  t("Authority-name-already-exists-for-this-organization")
                )
              );
            }
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Compliance_ComplianceServiceManager_UpdateAuthority_05".toLowerCase()
              )
          ) {
            await dispatch(
              UpdateAuthorityFail(
                t("Authority-record-not-found-against-the-provided-authorityId")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Compliance_ComplianceServiceManager_UpdateAuthority_06".toLowerCase()
              )
          ) {
            await dispatch(UpdateAuthorityFail(t("Something-went-wrong")));
          } else {
            await dispatch(UpdateAuthorityFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(UpdateAuthorityFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(UpdateAuthorityFail(t("Something-went-wrong")));
      });
  };
};

// AddAuthority
const AddAuthorityInit = () => {
  return {
    type: actions.ADD_AUTHORITY_INIT,
  };
};

const AddAuthoritySuccess = (response, message) => {
  return {
    type: actions.ADD_AUTHORITY_SUCCESS,
    response: response,
    message: message,
  };
};

const AddAuthorityFail = (message) => {
  return {
    type: actions.ADD_AUTHORITY_FAIL,
    message: message,
  };
};

const AddAuthorityAPI = (navigate, t) => {
  return (dispatch) => {
    dispatch(AddAuthorityInit());
    let form = new FormData();
    form.append("RequestMethod", AddAuthority.RequestMethod);
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(AddAuthorityAPI(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddAuthority_01".toLowerCase()
                )
            ) {
              await dispatch(
                AddAuthoritySuccess(
                  response.data.responseResult.taskStatuses,
                  t("Authority-created-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddAuthority_02".toLowerCase()
                )
            ) {
              await dispatch(
                AddAuthorityFail(
                  t("Authority-shortCode-already-exists-for-this-organization")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddAuthority_03".toLowerCase()
                )
            ) {
              await dispatch(
                AddAuthorityFail(
                  t("Authority-name-already-exists-for-this-organization")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddAuthority_06".toLowerCase()
                )
            ) {
              await dispatch(AddAuthorityFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(AddAuthorityFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(AddAuthorityFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(AddAuthorityFail(t("Something-went-wrong")));
      });
  };
};
const cleareMessage = () => {
  return {
    type: actions.GET_CLEAREMESSAGE_AUTHORITY,
  };
};
export {
  cleareMessage,
  GetAllAuthorityAPI,
  GetAuthorityByIDAPI,
  DeleteAuthorityAPI,
  UpdateAuthorityAPI,
  AddAuthorityAPI,
};
