import * as actions from "../action_types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { uploadDocument } from "../../commen/apis/Api_config";
import Helper from "../../commen/functions/history_logout";

const ShowNotification = (message) => {
  console.log("message", message);
  return {
    type: actions.SHOW,
    message: message,
  };
};

const UploadLoaderStart = () => {
  return {
    type: actions.GET_UPLOAD_LOADER_START,
  };
};

const uploadFail = (response) => {
  return {
    type: actions.GET_UPLOAD_FAIL,
    response: response,
  };
};

const SetLoaderFalseUpload = () => {
  return {
    type: actions.SET_LOADER_FALSE_UPLOAD,
  };
};

const uploadDocumentSuccess = (response, message) => {
  console.log(response, message, "uploadDocumentSuccess");
  return {
    type: actions.UPLOAD_DOCUMNET_FILE_SUCCESS,
    response: response,
    message: message,
  };
};

const uploadResponseEmpty = () => {
  return {
    type: actions.UPLOAD_RESPONSE_MESSAGE,
  };
};

const uploadDocumentFail = (response) => {
  return {
    type: actions.UPLOAD_DOCUMNET_FILE_FAIL,
    response: response,
  };
};

const ResetAllFilesUpload = () => {
  return {
    type: actions.RESET_ALL_FILES_UPLOAD,
    response: [],
  };
};

//File Upload
const FileUploadToDo = (
  data,
  t,
  setProgress,
  setUploadCounter,
  uploadCounter,
  setRemainingTime,
  remainingTime
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let startTime = Date.now();
  console.log("uploadedFile:", data);
  let form = new FormData();
  form.append("RequestMethod", uploadDocument.RequestMethod);
  form.append("RequestData", JSON.stringify(data));
  form.append("File", data);

  return (dispatch) => {
    dispatch(UploadLoaderStart());
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        let currentTime = Date.now();
        let elapsedTime = currentTime - startTime;
        let bytesUploaded = progressEvent.loaded;
        let bytesTotal = progressEvent.total;
        let bytesRemaining = bytesTotal - bytesUploaded;
        let bytesPerSecond = bytesUploaded / (elapsedTime / 1000);
        let secondsRemaining = Math.ceil(bytesRemaining / bytesPerSecond);
        console.log("secondsRemaining elapsedTime", elapsedTime);
        console.log("secondsRemaining bytesUploaded", bytesUploaded);
        console.log("secondsRemaining bytesTotal", bytesTotal);
        console.log("secondsRemaining bytesRemaining", bytesRemaining);
        console.log("secondsRemaining bytesPerSecond", bytesPerSecond);
        console.log("secondsRemaining secondsRemaining", secondsRemaining);
        console.log("secondsRemaining percentCompleted", percentCompleted);
        setProgress(percentCompleted);
        setRemainingTime(remainingTime + secondsRemaining);
      },
    })
      .then(async (response) => {
        console.log("response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(
            FileUploadToDo(
              data,
              t,
              setProgress,
              setUploadCounter,
              uploadCounter
            )
          );
        } else if (response.data.responseCode === 200) {
          console.log("response");
          if (response.data.responseResult.isExecuted === true) {
            console.log("response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UploadDocument_01".toLowerCase()
                )
            ) {
              if (uploadCounter != 0) {
                setUploadCounter(uploadCounter - 1);
              }
              console.log(response);
              dispatch(
                uploadDocumentSuccess(
                  response.data.responseResult,
                  t("valid-data")
                )
              );
              setProgress(0);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UploadDocument_02".toLowerCase()
                )
            ) {
              if (uploadCounter != 0) {
                setUploadCounter(uploadCounter - 1);
              }
              await dispatch(uploadDocumentFail(t("Invalid-data")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UploadDocument_03".toLowerCase()
                )
            ) {
              if (uploadCounter != 0) {
                setUploadCounter(uploadCounter - 1);
              }
              await dispatch(uploadDocumentFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(uploadDocumentFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(uploadDocumentFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(uploadDocumentFail(t("Something-went-wrong")));
      });
  };
};

export { FileUploadToDo, ResetAllFilesUpload, uploadResponseEmpty };
