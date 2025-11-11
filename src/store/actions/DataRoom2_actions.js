import axios from "axios";
import { dataRoomApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import {
  ValidateEncryptedStringViewFileLinkRM,
  ValidateEncryptedStringViewFolderLinkRM,
  getDataAnalyticsCountRM,
  getDataAnalyticsRM,
  getFileFolderDetailsRM,
  updateAndOpenByAndDescriptionRM,
} from "../../commen/apis/Api_config";
import { showFileDetailsModal } from "./DataRoom_actions";
import axiosInstance from "../../commen/functions/axiosInstance";

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
                ""
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
            dispatch(getFileandFolderDetail_Fail(""));
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
              getDataAnalytics_Success(response.data.responseResult, "")
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
            setActivityState(false);
            setDetailsState(true);

            dispatch(getDataAnalytics_Fail(t("No-record-found")));
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
                ""
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
            dispatch(getDataAnalyticsCount_Fail(t("No-record-found")));
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

// List Committees
const validateEncryptedStringViewFileLink_Init = () => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_FILE_LINK_INIT,
});

const validateEncryptedStringViewFileLink_Success = (response, message) => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_FILE_LINK_SUCCESS,
  response,
  message,
});

const validateEncryptedStringViewFileLink_Fail = (message) => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_FILE_LINK_FAIL,
  message,
});
const validateEncryptedStringViewFileLinkApi = (
  encryptedString,
  navigate,
  t
) => {
  return async (dispatch) => {
    try {
      let data = { EncryptedString: encryptedString };
      let token = JSON.parse(localStorage.getItem("token"));

      dispatch(validateEncryptedStringViewFileLink_Init());

      let form = new FormData();
      form.append(
        "RequestMethod",
        ValidateEncryptedStringViewFileLinkRM.RequestMethod
      );
      form.append("RequestData", JSON.stringify(data));

      let response = await axiosInstance.post(dataRoomApi, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(
          validateEncryptedStringViewFileLinkApi(encryptedString, navigate, t)
        );
      }

      if (response.data.responseCode === 200) {
        const responseResult = response.data.responseResult;

        if (responseResult.isExecuted) {
          const message = responseResult.responseMessage.toLowerCase();

          if (
            message.includes(
              "DataRoom_DataRoomServiceManager_ValidateEncryptedStringViewFileLink_01".toLowerCase()
            )
          ) {
            dispatch(
              validateEncryptedStringViewFileLink_Success(
                responseResult.data,
                t("Successfully")
              )
            );
            let response = {
              response: responseResult.data,
              fileName: responseResult.folderOrFileName,
            };
            return {
              response: response,
              responseCode: 1,
              isExecuted: true,
            };
          } else if (
            message.includes(
              "DataRoom_DataRoomServiceManager_ValidateEncryptedStringViewFileLink_02".toLowerCase()
            )
          ) {
            dispatch(
              validateEncryptedStringViewFileLink_Fail(
                t("Something-went-wrong")
              )
            );
            return {
              isExecuted: false,
              responseCode: 2,
            };
          } else if (
            message.includes(
              "DataRoom_DataRoomServiceManager_ValidateEncryptedStringViewFileLink_03".toLowerCase()
            )
          ) {
            dispatch(
              validateEncryptedStringViewFileLink_Fail(
                t("Invalid-request-data")
              )
            );
            return {
              isExecuted: false,
              responseCode: 3,
            };
          } else if (
            message.includes(
              "DataRoom_DataRoomServiceManager_ValidateEncryptedStringViewFileLink_0".toLowerCase()
            )
          ) {
            dispatch(
              validateEncryptedStringViewFileLink_Fail(t("Someting-went-wrong"))
            );
            return {
              isExecuted: false,
              responseCode: 4,
            };
          } else {
            dispatch(
              validateEncryptedStringViewFileLink_Fail(t("Unsuccessful"))
            );
            return {
              isExecuted: false,
              responseCode: 5,
            };
          }
        } else {
          dispatch(
            validateEncryptedStringViewFileLink_Fail(t("Something-went-wrong"))
          );
          return {
            isExecuted: false,
            responseCode: 5,
          };
        }
      } else {
        dispatch(
          validateEncryptedStringViewFileLink_Fail(t("Something-went-wrong"))
        );
        return {
          isExecuted: false,
          responseCode: 5,
        };
      }
    } catch (error) {
      dispatch(
        validateEncryptedStringViewFileLink_Fail(t("Something-went-wrong"))
      );
      return {
        isExecuted: false,
        responseCode: 0,
      };
    }
  };
};

// Details Committees Email Routes
const validateEncryptedStringViewFolderLink_Init = () => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_FOLDER_LINK_INIT,
});

const validateEncryptedStringViewFolderLink_Success = (response, message) => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_FOLDER_LINK_SUCCESS,
  response,
  message,
});

const validateEncryptedStringViewFolderLink_Fail = (message) => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_FOLDER_LINK_FAIL,
  message,
});
const validateEncryptedStringViewFolderLinkApi = (
  encryptedString,
  navigate,
  t
) => {
  return async (dispatch) => {
    try {
      let data = { EncryptedString: encryptedString };
      let token = JSON.parse(localStorage.getItem("token"));

      dispatch(validateEncryptedStringViewFolderLink_Init());

      let form = new FormData();
      form.append(
        "RequestMethod",
        ValidateEncryptedStringViewFolderLinkRM.RequestMethod
      );
      form.append("RequestData", JSON.stringify(data));

      let response = await axiosInstance.post(dataRoomApi, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(
          validateEncryptedStringViewFolderLinkApi(encryptedString, navigate, t)
        );
      }

      if (response.data.responseCode === 200) {
        const responseResult = response.data.responseResult;

        if (responseResult.isExecuted) {
          const message = responseResult.responseMessage.toLowerCase();

          if (
            message.includes(
              "DataRoom_DataRoomServiceManager_ValidateEncryptedStringViewFolderLink_01".toLowerCase()
            )
          ) {
            dispatch(
              validateEncryptedStringViewFolderLink_Success(
                responseResult.data,
                t("Successfully")
              )
            );
            let response = {
              response: responseResult.data,
              folderName: responseResult.folderOrFileName,
            };
            return {
              response: response,
              responseCode: 1,
              isExecuted: true,
            };
          } else if (
            message.includes(
              "DataRoom_DataRoomServiceManager_ValidateEncryptedStringViewFolderLink_02".toLowerCase()
            )
          ) {
            dispatch(validateEncryptedStringViewFolderLink_Fail(""));
            return {
              isExecuted: false,
              responseCode: 2,
            };
          } else if (
            message.includes(
              "DataRoom_DataRoomServiceManager_ValidateEncryptedStringViewFolderLink_03".toLowerCase()
            )
          ) {
            dispatch(
              validateEncryptedStringViewFolderLink_Fail(
                t("Invalid-request-data")
              )
            );
            return {
              isExecuted: false,
              responseCode: 3,
            };
          } else if (
            message.includes(
              "DataRoom_DataRoomServiceManager_ValidateEncryptedStringViewFolderLink_04".toLowerCase()
            )
          ) {
            dispatch(
              validateEncryptedStringViewFolderLink_Fail(
                t("Someting-went-wrong")
              )
            );
            return {
              isExecuted: false,
              responseCode: 4,
            };
          } else {
            dispatch(
              validateEncryptedStringViewFolderLink_Fail(
                t("Someting-went-wrong")
              )
            );
            return {
              isExecuted: false,
              responseCode: 5,
            };
          }
        } else {
          dispatch(
            validateEncryptedStringViewFolderLink_Fail(
              t("Something-went-wrong")
            )
          );
          return {
            isExecuted: false,
            responseCode: 5,
          };
        }
      } else {
        dispatch(
          validateEncryptedStringViewFolderLink_Fail(t("Something-went-wrong"))
        );
        return {
          isExecuted: false,
          responseCode: 5,
        };
      }
    } catch (error) {
      dispatch(
        validateEncryptedStringViewFolderLink_Fail(t("Something-went-wrong"))
      );
      return {
        isExecuted: false,
        responseCode: 0,
      };
    }
  };
};

const meetingVideoRecording = (response) => {
  return {
    type: actions.MEETING_VIDEO_RECORDING_RECEIVED,
    response,
  };
};
const videoRecording = (response) => {
  return {
    type: actions.VIDEO_RECORDING_RECEIVED,
    response,
  };
};
export {
  meetingVideoRecording,
  videoRecording,
  getDataAnalyticsCountApi,
  getDataAnalyticsApi,
  updateFileandFolderDetailsApi,
  getFilesandFolderDetailsApi,
  clearDataResponseMessageDataRoom2,
  validateEncryptedStringViewFolderLinkApi,
  validateEncryptedStringViewFileLinkApi,
};
