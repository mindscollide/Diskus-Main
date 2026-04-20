/**
 * @file Upload_action.js
 * @description Redux thunk actions for uploading documents/files to the settings API.
 * Handles file uploads, tracks upload progress state, and resets upload state.
 * Dispatches: GET_UPLOAD_LOADER_START / UPLOAD_DOCUMNET_FILE_SUCCESS /
 * UPLOAD_DOCUMNET_FILE_FAIL / UPLOAD_RESPONSE_MESSAGE / RESET_ALL_FILES_UPLOAD /
 * UPLOAD_DOCUMENT_LOADER action types.
 */
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { uploadDocument } from "../../commen/apis/Api_config";
import axiosInstance from "../../commen/functions/axiosInstance";

/** @returns {{ type: string }} */
const UploadLoaderStart = () => {
  return {
    type: actions.GET_UPLOAD_LOADER_START,
  };
};

/** @returns {{ type: string, response: *, message: string, loading: boolean }} */
const uploadDocumentSuccess = (response, message, loading) => {
  return {
    type: actions.UPLOAD_DOCUMNET_FILE_SUCCESS,
    response: response,
    message: message,
    loading: loading,
  };
};

/** @returns {{ type: string }} */
const uploadResponseEmpty = () => {
  return {
    type: actions.UPLOAD_RESPONSE_MESSAGE,
  };
};

/** @returns {{ type: string, response: * }} */
const uploadDocumentFail = (response) => {
  return {
    type: actions.UPLOAD_DOCUMNET_FILE_FAIL,
    response: response,
  };
};

/** @returns {{ type: string, response: Array }} */
const ResetAllFilesUpload = () => {
  return {
    type: actions.RESET_ALL_FILES_UPLOAD,
    response: [],
  };
};

/** @returns {{ type: string, payload: * }} */
const uploaddocumentloader = (payload) => {
  return {
    type: actions.UPLOAD_DOCUMENT_LOADER,
    payload,
  };
};

/**
 * Uploads a file to the settings API and appends result metadata to newfile array.
 * The route parameter controls loader visibility after upload completion.
 * @param {Function} navigate - React Router navigate function.
 * @param {File} data - File object to upload.
 * @param {Function} t - i18next translation function.
 * @param {Array} newfile - Mutable array to push uploaded file metadata into.
 * @param {number|boolean} route - Upload route identifier controlling loader state.
 * @returns {Function} Redux thunk.
 */
const FileUploadToDo = (navigate, data, t, newfile, route) => {
  console.log(route, typeof route, "routerouteroute");
  let token = JSON.parse(localStorage.getItem("token"));

  let form = new FormData();
  form.append("RequestMethod", uploadDocument.RequestMethod);
  form.append("RequestData", JSON.stringify(data));
  form.append("File", data);

  return async (dispatch) => {
    dispatch(UploadLoaderStart());
    await   axiosInstance
    .post(settingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(FileUploadToDo(navigate, data, t, newfile, route));
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
              let loaderVal =
                Number(route) === 1 || Number(route) === 2 || route === false
                  ? false
                  : true;
              if (Number(route) !== 10) {
                await dispatch(
                  uploadDocumentSuccess(
                    response.data.responseResult,
                    t("valid-data"),
                    loaderVal
                  )
                );
              }
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

/**
 * Uploads a file to the settings API (simplified variant without newfile tracking).
 * @param {Function} navigate - React Router navigate function.
 * @param {File} data - File object to upload.
 * @param {Function} t - i18next translation function.
 * @returns {Function} Redux thunk.
 */
const FileUploadToDo2 = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  let form = new FormData();
  form.append("RequestMethod", uploadDocument.RequestMethod);
  form.append("RequestData", JSON.stringify(data));
  form.append("File", data);

  return async (dispatch) => {
    dispatch(UploadLoaderStart());
    axiosInstance
    .post(settingApi, form)
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
