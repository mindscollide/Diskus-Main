import axios from "axios";
import { dataRoomApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import {
  getDataAnalyticsCountRM,
  getDataAnalyticsRM,
  getFileFolderDetailsRM,
  updateAndOpenByAndDescriptionRM,
} from "../../commen/apis/Api_config";
import { showFileDetailsModal } from "./DataRoom_actions";

const getFileandFolderDetail_Init = () => {
  return {
    type: actions.GETFILESANDFOLDERS_DETAILS_INIT,
  };
};
const getFileandFolderDetail_Success = (response, message) => {
  return {
    type: actions.GETFILESANDFOLDERS_DETAILS_SUCCESS,
    response,
    message,
  };
};
const getFileandFolderDetail_Fail = (message) => {
  return {
    type: actions.GETFILESANDFOLDERS_DETAILS_FAIL,
    message,
  };
};

const getFilesandFolderDetailsApi = (navigate, t, Data, setDetailView) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getFileandFolderDetail_Init());
    let form = new FormData();
    form.append("RequestMethod", getFileFolderDetailsRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getFilesandFolderDetailsApi(navigate, t, Data, setDetailView)
          );
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetFileFolderDetails_01".toLowerCase()
              )
          ) {
            dispatch(
              getFileandFolderDetail_Success(
                response.data.responseResult.data,
                t("Data-available")
              )
            );
            setDetailView(true);
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetFileFolderDetails_02".toLowerCase()
              )
          ) {
            dispatch(getFileandFolderDetail_Fail(t("No-data-available")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetFileFolderDetails_03".toLowerCase()
              )
          ) {
            dispatch(getFileandFolderDetail_Fail(t("Something-went-wrong")));
          } else {
            dispatch(getFileandFolderDetail_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getFileandFolderDetail_Fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(getFileandFolderDetail_Fail(t("Something-went-wrong")));
      });
  };
};

const updateFileandFolderDetails_Init = () => {
  return {
    type: actions.UPDATEANDOPENBYANDDESCRIPTION_INIT,
  };
};
const updateFileandFolderDetails_Success = (response, message) => {
  return {
    type: actions.UPDATEANDOPENBYANDDESCRIPTION_SUCCESS,
    response,
    message,
  };
};
const updateFileandFolderDetails_Fail = (message) => {
  return {
    type: actions.UPDATEANDOPENBYANDDESCRIPTION_FAIL,
    message,
  };
};
const updateFileandFolderDetailsApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(updateFileandFolderDetails_Init());
    let form = new FormData();
    form.append("RequestMethod", updateAndOpenByAndDescriptionRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateFileandFolderDetailsApi(navigate, t, Data));
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_UpdateOpenedByAndDescription_01".toLowerCase()
              )
          ) {
            dispatch(
              updateFileandFolderDetails_Success(
                response.data.responseResult,
                t("Information-saved")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_UpdateOpenedByAndDescription_02".toLowerCase()
              )
          ) {
            dispatch(updateFileandFolderDetails_Fail(t("Failed-to-update")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_UpdateOpenedByAndDescription_03".toLowerCase()
              )
          ) {
            dispatch(
              updateFileandFolderDetails_Fail(t("Something-went-wrong"))
            );
          } else {
            dispatch(
              updateFileandFolderDetails_Fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(updateFileandFolderDetails_Fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(updateFileandFolderDetails_Fail(t("Something-went-wrong")));
      });
  };
};

const getDataAnalytics_Init = () => {
  return {
    type: actions.GETDATAANALYTICS_INIT,
  };
};
const getDataAnalytics_Success = (response, message) => {
  return {
    type: actions.GETDATAANALYTICS_SUCCESS,
    response,
    message,
  };
};
const getDataAnalytics_Fail = (message) => {
  return {
    type: actions.GETDATAANALYTICS_FAIL,
    message,
  };
};
const getDataAnalyticsApi = (
  navigate,
  t,
  Data,
  setActivityState,
  setDetailsState
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getDataAnalytics_Init());
    let form = new FormData();
    form.append("RequestMethod", getDataAnalyticsRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getDataAnalyticsApi(
              navigate,
              t,
              Data,
              setActivityState,
              setDetailsState
            )
          );
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetDataAnalytics_01".toLowerCase()
              )
          ) {
            await dispatch(
              getDataAnalytics_Success(
                response.data.responseResult,
                t("Data-available")
              )
            );
            setActivityState(true);
            setDetailsState(false);
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetDataAnalytics_02".toLowerCase()
              )
          ) {
            dispatch(getDataAnalytics_Fail(t("No-data-available")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetDataAnalytics_03".toLowerCase()
              )
          ) {
            dispatch(getDataAnalytics_Fail(t("Something-went-wrong")));
          } else {
            dispatch(getDataAnalytics_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getDataAnalytics_Fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(getDataAnalytics_Fail(t("Something-went-wrong")));
      });
  };
};

const getDataAnalyticsCount_Init = () => {
  return {
    type: actions.GETDATAANALYTICSCOUNT_INIT,
  };
};
const getDataAnalyticsCount_Success = (response, message) => {
  return {
    type: actions.GETDATAANALYTICSCOUNT_SUCCESS,
    response,
    message,
  };
};
const getDataAnalyticsCount_Fail = (message) => {
  return {
    type: actions.GETDATAANALYTICSCOUNT_FAIL,
    message,
  };
};
const getDataAnalyticsCountApi = (
  navigate,
  t,
  Data,
  record,
  setFileDataforAnalyticsCount
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getDataAnalyticsCount_Init());
    let form = new FormData();
    form.append("RequestMethod", getDataAnalyticsCountRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getDataAnalyticsCountApi(
              navigate,
              t,
              Data,
              record,
              setFileDataforAnalyticsCount
            )
          );
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetDataAnalyticsCount_01".toLowerCase()
              )
          ) {
            dispatch(
              getDataAnalyticsCount_Success(
                response.data.responseResult.dataAnalysis,
                t("Data-available")
              )
            );
            setFileDataforAnalyticsCount(record);
            dispatch(showFileDetailsModal(true));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetDataAnalyticsCount_02".toLowerCase()
              )
          ) {
            dispatch(getDataAnalyticsCount_Fail(t("No-data-available")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetDataAnalyticsCount_03".toLowerCase()
              )
          ) {
            dispatch(getDataAnalyticsCount_Fail(t("Something-went-wrong")));
          } else {
            dispatch(getDataAnalyticsCount_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getDataAnalyticsCount_Fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(getDataAnalyticsCount_Fail(t("Something-went-wrong")));
      });
  };
};
const clearDataResponseMessageDataRoom2 = () => {
  return {
    type: actions.CLEAR_DATAROOM2_RESPONSE_MESSAGE,
  };
};
export {
  getDataAnalyticsCountApi,
  getDataAnalyticsApi,
  updateFileandFolderDetailsApi,
  getFilesandFolderDetailsApi,
  clearDataResponseMessageDataRoom2,
};
