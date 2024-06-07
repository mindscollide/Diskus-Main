import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { uploadDocument } from "../../commen/apis/Api_config";

const UploadLoaderStart = () => {
  return {
    type: actions.GET_UPLOAD_LOADER_START,
  };
};

const uploadDocumentSuccess = (response, message, loading) => {
  return {
    type: actions.UPLOAD_DOCUMNET_FILE_SUCCESS,
    response: response,
    message: message,
    loading: loading,
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

const uploaddocumentloader = (payload) => {
  return {
    type: actions.UPLOAD_DOCUMENT_LOADER,
    payload,
  };
};
//File Upload
const FileUploadToDo = (navigate, data, t, newfile) => {
  let token = JSON.parse(localStorage.getItem("token"));

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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(FileUploadToDo(navigate, data, t, newfile));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UploadDocument_01".toLowerCase()
                )
            ) {
              console.log(newfile, "PromisePromisePromise");
              if (newfile) {
                let dataResultdisplayFileName =
                  response.data.responseResult.displayFileName;
                let dataResultoriginalFileName =
                  response.data.responseResult.originalFileName;
                let dataresponce = {
                  FK_TID: 0,
                  PK_TAID: 0,
                  CreationDateTime: "",
                  DisplayAttachmentName: dataResultdisplayFileName,
                  OriginalAttachmentName: dataResultoriginalFileName,
                  // fileSize:data.size
                };
                await newfile.push(dataresponce);
              }
              await dispatch(
                uploadDocumentSuccess(
                  response.data.responseResult,
                  t("valid-data"),
                  false
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UploadDocument_02".toLowerCase()
                )
            ) {
              await dispatch(uploadDocumentFail(t("Invalid-data")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UploadDocument_03".toLowerCase()
                )
            ) {
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

//File Upload
const FileUploadToDo2 = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  let form = new FormData();
  form.append("RequestMethod", uploadDocument.RequestMethod);
  form.append("RequestData", JSON.stringify(data));
  form.append("File", data);

  return async (dispatch) => {
    dispatch(UploadLoaderStart());
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(FileUploadToDo(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UploadDocument_01".toLowerCase()
                )
            ) {
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
              await dispatch(uploadDocumentFail(t("Invalid-data")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_UploadDocument_03".toLowerCase()
                )
            ) {
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

export {
  FileUploadToDo,
  ResetAllFilesUpload,
  uploadResponseEmpty,
  FileUploadToDo2,
  uploaddocumentloader,
};
