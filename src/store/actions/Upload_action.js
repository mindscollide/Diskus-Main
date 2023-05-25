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
  navigate,
  data,
  t,
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log("uploadedFile:", data);
  let form = new FormData();
  form.append("RequestMethod", uploadDocument.RequestMethod);
  form.append("RequestData", JSON.stringify(data));
  form.append("File", data);

  return async (dispatch) => {
    dispatch(UploadLoaderStart());
    await axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList", response);
        console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList", response.data.responseCode);
        console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList", response.data.responseCode === 417);
        if (response.data.responseCode === 417) {
          console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList", response);

          await dispatch(RefreshToken(navigate, t));
          dispatch(
            FileUploadToDo(
              navigate,
              data,
              t,
            )
          );
        } else if (response.data.responseCode === 200) {
          console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList");
          if (response.data.responseResult.isExecuted === true) {
            console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UploadDocument_01".toLowerCase()
                )
            ) {

              console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList");
              dispatch(
                uploadDocumentSuccess(
                  response.data.responseResult,
                  t("valid-data")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UploadDocument_02".toLowerCase()
                )
            ) {
              console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList");
              await dispatch(uploadDocumentFail(t("Invalid-data")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UploadDocument_03".toLowerCase()
                )
            ) {
              console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList");
              await dispatch(uploadDocumentFail(t("Something-went-wrong")));
            }
          } else {
            console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList");
            await dispatch(uploadDocumentFail(t("Something-went-wrong")));
          }
        } else {
          console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList");
          await dispatch(uploadDocumentFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log("uploadReducer.uploadDocumentsListuploadReducer.uploadDocumentsList");
        dispatch(uploadDocumentFail(t("Something-went-wrong")));
      });
  };
};

export { FileUploadToDo, ResetAllFilesUpload, uploadResponseEmpty };
