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

const uploadDocumentSuccess = (response) => {
  console.log("uploadedFile", response);
  return {
    type: actions.UPLOAD_DOCUMNET_FILE_SUCCESS,
    response: response,
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
const FileUploadToDo = (data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let finalObject = {};
  // console.log("uploadedFile:", finalObject);
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
    })
      .then(async (response) => {
        console.log("uploadedFile", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(FileUploadToDo(data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted) {
            console.log("FileUploadToDo", response.data.responseResult);
            dispatch(uploadDocumentSuccess(response.data.responseResult));
          } else {
            dispatch(uploadDocumentFail());
          }
        } else {
          dispatch(uploadDocumentFail());
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch(uploadDocumentFail());
      });
  };
};

export { FileUploadToDo, ResetAllFilesUpload, uploadResponseEmpty };
