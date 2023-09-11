import axios from "axios";
import {
  FolderisExistRequestMethod,
  createFolderRequestMethod,
  getDocumentsAndFolderRequestMethod,
  saveFilesRequestMethod,
  saveFilesandFolderRM,
  uploadDocumentsRequestMethod,
} from "../../commen/apis/Api_config";

import { dataRoomApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";

import {
  clearDataResponseMessage,
  getDocumentsAndFolderApi,
  getFolderDocumentsApi,
} from "./DataRoom_actions";
import { replaceSlashWithBackslash } from "../../commen/functions/regex";

// Folder Exist init
const FolderisExist_init = () => {
  return {
    type: actions.FOLDERISEXIST_INIT,
  };
};

// Folder Exist fail
const FolderisExist_fail = (message) => {
  return {
    type: actions.FOLDERISEXIST_FAIL,
    message: message,
  };
};

// Create Folder Init
const createFolder_init = () => {
  return {
    type: actions.CREATE_FOLDER_DATAROOM_INIT,
  };
};

// Create Folder Success
const createFolder_success = (response, message) => {
  return {
    type: actions.CREATE_FOLDER_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

// Create Folder Fail
const createFolder_fail = (message) => {
  return {
    type: actions.CREATE_FOLDER_DATAROOM_FAIL,
    message: message,
  };
};

// Create Folder API
const createFolderApi = (navigate, folder, t, setAddfolder) => {
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let token = JSON.parse(localStorage.getItem("token"));
  let folderID = JSON.parse(localStorage.getItem("folderID"));
  let Data = {
    FolderName: folder,
    UserID: parseInt(createrID),
    OrganizationID: parseInt(OrganizationID),
    ParentFolderID: folderID !== null ? folderID : 0,
  };
  return (dispatch) => {
    // dispatch(createFolder_init());
    let form = new FormData();
    form.append("RequestMethod", createFolderRequestMethod.RequestMethod);
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
          dispatch(createFolderApi(navigate, folder, t, setAddfolder));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_01".toLowerCase()
                )
            ) {
              await dispatch(FolderisExist_success(true));
              // if (folderID !== null) {
              //     dispatch(getFolderDocumentsApi(navigate, folderID, t))
              // } else {
              //     dispatch(getDocumentsAndFolderApi(navigate, 3, t))
              // }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_02".toLowerCase()
                )
            ) {
              dispatch(createFolder_fail(t("Failed-to-create-folder")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_03".toLowerCase()
                )
            ) {
              dispatch(createFolder_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(createFolder_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(createFolder_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(createFolder_fail(t("Something-went-wrong")));
      });
  };
};

// Upload Documents Init
const uploadDocument_init = () => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_INIT,
  };
};

// Upload Documents Success
const uploadDocument_success = (response, message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const uploadDocument_fail = (message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_FAIL,
    message: message,
  };
};

// Upload Documents API
const uploadDocumentsApi = (
  navigate,
  file,
  t,
  setProgress,
  setRemainingTime,
  remainingTime,
  setShowbarupload,
  setTasksAttachments
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let startTime = Date.now();
  return (dispatch) => {
    // dispatch(uploadDocument_init())
    setProgress(0);
    setShowbarupload(true);
    let form = new FormData();
    form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(file));
    form.append("File", file);
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
      onUploadProgress: (progressEvent) => {
        setTasksAttachments((prev) => [...prev, file]);
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            uploadDocumentsApi(
              navigate,
              file,
              t,
              setProgress,
              setRemainingTime,
              remainingTime,
              setShowbarupload
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_01".toLowerCase()
                )
            ) {
              await dispatch(
                uploadDocument_success(
                  response.data.responseResult,
                  t("Document-uploaded-successfully")
                )
              );
              await dispatch(
                saveFilesApi(
                  navigate,
                  response.data.responseResult,
                  t,
                  setShowbarupload,
                  setTasksAttachments
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase()
                )
            ) {
              dispatch(uploadDocument_fail(t("Failed-to-update-document")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
                )
            ) {
              dispatch(uploadDocument_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(uploadDocument_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(uploadDocument_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(uploadDocument_fail(t("Something-went-wrong")));
      });
  };
};

// Save Files Init
const saveFiles_init = () => {
  return {
    type: actions.SAVEFILES_DATAROOM_INIT,
  };
};
// Save Files Success
const saveFiles_success = (response, message) => {
  return {
    type: actions.SAVEFILES_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};
// Save Files Fail
const saveFiles_fail = (message) => {
  return {
    type: actions.SAVEFILES_DATAROOM_FAIL,
    message: message,
  };
};

// Save Files API
const saveFilesApi = (
  navigate,
  data,
  t,
  setShowbarupload,
  setTasksAttachments
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let folderID = JSON.parse(localStorage.getItem("folderID"));
  console.log(folderID, "folderIDfolderIDfolderID");
  let Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: [
      {
        DisplayFileName: data.displayFileName,
        DiskusFileName: JSON.parse(data.diskusFileName),
        ShareAbleLink: data.shareAbleLink,
        FK_UserID: JSON.parse(createrID),
        FK_OrganizationID: JSON.parse(OrganizationID),
      },
    ],
  };
  return (dispatch) => {
    // dispatch(saveFiles_init())
    let form = new FormData();
    form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
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
          dispatch(RefreshToken(navigate, t));
          dispatch(saveFilesApi(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase()
                )
            ) {
              await dispatch(
                saveFiles_success(
                  response.data.responseMessage,
                  t("Files-saved-successfully")
                )
              );
              setShowbarupload(false);
              setTasksAttachments([]);
              if (folderID !== null) {
                dispatch(getFolderDocumentsApi(navigate, folderID, t));
              } else {
                dispatch(getDocumentsAndFolderApi(navigate, 1, t));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
                )
            ) {
              dispatch(saveFiles_fail(t("Failed-to-save-any-file")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
                )
            ) {
              dispatch(saveFiles_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveFiles_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveFiles_fail(t("Something-went-wrong")));
        }
        console.log(response);
      })
      .catch(() => {
        dispatch(saveFiles_fail(t("Something-went-wrong")));
      });
  };
};

// huzeifa work

// Folder Exist success
const FolderisExist_success = (response) => {
  return {
    type: actions.FOLDERISEXIST_SUCCESS,
    response: response,
  };
};

const CreateFolder_success = (response) => {
  return {
    type: actions.CREATE_FOLDER_SUCCESS,
    response: response,
  };
};

// Folder Exist API
const CheckFolderisExist = (navigate, folderName, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let folderID = JSON.parse(localStorage.getItem("folderID"));
  let Data = {
    UserID: JSON.parse(createrID),
    ParentFolderID: folderID !== null ? folderID : 0,
    FolderName: folderName,
  };
  return (dispatch) => {
    // dispatch(FolderisExist_init());
    let form = new FormData();
    form.append("RequestMethod", FolderisExistRequestMethod.RequestMethod);
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
          dispatch(CheckFolderisExist(navigate, folderName, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_01".toLowerCase()
                )
            ) {
              await dispatch(FolderisExist_success(true));
              localStorage.setItem("folderName", folderName);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_02".toLowerCase()
                )
            ) {
              await dispatch(FolderisExist_success(false));
              // return false;
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_03".toLowerCase()
                )
            ) {
              await dispatch(FolderisExist_success(false));
              // return false;
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_04".toLowerCase()
                )
            ) {
              dispatch(FolderisExist_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(FolderisExist_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(FolderisExist_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(FolderisExist_fail(t("Something-went-wrong")));
      });
  };
};

const createFolder = (navigate, t, folder, type) => {
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let token = JSON.parse(localStorage.getItem("token"));
  let folderID = JSON.parse(localStorage.getItem("folderID"));
  let Data = {
    FolderName: folder,
    UserID: parseInt(createrID),
    OrganizationID: parseInt(OrganizationID),
    ParentFolderID: folderID !== null && folderID !== undefined ? folderID : 0,
    Type: type,
  };
  return (dispatch) => {
    // dispatch(createFolder_init());
    let form = new FormData();
    form.append("RequestMethod", createFolderRequestMethod.RequestMethod);
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
          dispatch(createFolderApi(navigate, t, folder, type));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_01".toLowerCase()
                )
            ) {
              let id = response.data.responseResult.folderID;
              console.log("ataRoomReducer.CreatedFolderID", id);

              await dispatch(CreateFolder_success(id));
              await dispatch(folderUploadData(response.data.responseResult));
              dispatch(FolderisExist_success(null));
              // if (folderID !== null) {
              //     dispatch(getFolderDocumentsApi(navigate, folderID, t))
              // } else {
              //     dispatch(getDocumentsAndFolderApi(navigate, 3, t))
              // }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_02".toLowerCase()
                )
            ) {
              await dispatch(CreateFolder_success(0));
              dispatch(createFolder_fail(t("Failed-to-create-folder")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_03".toLowerCase()
                )
            ) {
              await dispatch(CreateFolder_success(0));
              dispatch(createFolder_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(createFolder_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(createFolder_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(createFolder_fail(t("Something-went-wrong")));
      });
  };
};

// Upload Documents API
const uploadFile = (
  navigate,
  file,
  folderID,
  t,
  setProgress,
  setRemainingTime,
  remainingTime,
  setShowbarupload,
  setTasksAttachments,
  cancelToken
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log("uploadFileFolder", file);
  let startTime = Date.now();
  return async (dispatch) => {
    // dispatch(uploadDocument_init())
    setProgress(0);
    setShowbarupload(true);
    let form = new FormData();
    form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(file));
    form.append("File", file);
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
      onUploadProgress: (progressEvent) => {
        setTasksAttachments((prev) => {
          return [...prev, file];
        });
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
        setProgress(percentCompleted);
        setRemainingTime(remainingTime + secondsRemaining);
      },
      cancelToken: cancelToken.token,
    })
      .then(async (response) => {
        if (axios.isCancel(response)) {
          console.log("API call was canceled.");
          // dispatch(clearDataResponseMessage());
          return;
        } else {
          if (response.data.responseCode === 417) {
            await dispatch(RefreshToken(navigate, t));
            dispatch(
              uploadFile(
                navigate,
                file,
                folderID,
                t,
                setProgress,
                setRemainingTime,
                remainingTime,
                setShowbarupload,
                setTasksAttachments
              )
            );
          } else if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomServiceManager_UploadDocuments_01".toLowerCase()
                  )
              ) {
                await dispatch(
                  uploadDocument_success(
                    response.data.responseResult,
                    t("Document-uploaded-successfully")
                  )
                );
                await dispatch(
                  saveFilesandFoldersApi(
                    navigate,
                    folderID,
                    response.data.responseResult,
                    t,
                    setShowbarupload,
                    setTasksAttachments,
                    file.webkitRelativePath
                  )
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase()
                  )
              ) {
                dispatch(uploadDocument_fail(t("Failed-to-update-document")));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
                  )
              ) {
                dispatch(uploadDocument_fail(t("Something-went-wrong")));
              }
            } else {
              dispatch(uploadDocument_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(uploadDocument_fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("API call was canceled.");
          // dispatch(clearDataResponseMessage());
          return;
        } else {
          dispatch(uploadDocument_fail(t("Something-went-wrong")));
        }
      });
  };
};

const savefilesandfolders_init = () => {
  return {
    type: actions.SAVEFILESANDFOLDERS_INIT,
  };
};
const savefilesandfolders_success = (response, message) => {
  return {
    type: actions.SAVEFILESANDFOLDERS_SUCCESS,
    response: response,
    message: message,
  };
};
const savefilesandfolders_fail = (message) => {
  return {
    type: actions.SAVEFILESANDFOLDERS_FAIL,
    message: message,
  };
};

const saveFilesandFoldersApi = (
  navigate,
  folderID,
  data,
  t,
  setShowbarupload,
  setTasksAttachments,
  filePath
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let currentView = localStorage.getItem("setTableView");
  let viewFolderID = localStorage.getItem("folderID");
  // let changePathFormat = filePath.
  let Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: [
      {
        DisplayFileName: data.displayFileName,
        DiskusFileName: JSON.parse(data.diskusFileName),
        ShareAbleLink: data.shareAbleLink,
        FK_UserID: JSON.parse(createrID),
        FK_OrganizationID: JSON.parse(OrganizationID),
        UriPath: replaceSlashWithBackslash(filePath),
      },
    ],
    UserID: JSON.parse(createrID),
    Type: 0,
  };
  return async (dispatch) => {
    // dispatch(savefilesandfolders_init())
    let form = new FormData();
    form.append("RequestMethod", saveFilesandFolderRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(
            saveFilesandFoldersApi(
              navigate,
              folderID,
              data,
              t,
              setShowbarupload,
              setTasksAttachments,
              filePath
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase()
                )
            ) {
              await dispatch(
                savefilesandfolders_success(
                  response.data.responseMessage,
                  t("Files-saved-successfully")
                )
              );
              // let currentView = localStorage.getItem("setTableView")
              // let viewFolderID = localStorage.getItem("folderID")
              // if (viewFolderID !== null) {
              //   await dispatch(getFolderDocumentsApi(navigate, Number(viewFolderID), t, 1));
              // } else {
              //   await dispatch(getDocumentsAndFolderApi(navigate, Number(currentView), t, 2));
              // }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
                )
            ) {
              dispatch(savefilesandfolders_fail(t("Failed-to-save-any-file")));
              setShowbarupload(false);
              setTasksAttachments([]);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
                )
            ) {
              dispatch(savefilesandfolders_fail(t("Something-went-wrong")));
              setShowbarupload(false);
              setTasksAttachments([]);
            } else {
              dispatch(savefilesandfolders_fail(t("Something-went-wrong")));
              setShowbarupload(false);
              setTasksAttachments([]);
            }
          } else {
            dispatch(savefilesandfolders_fail(t("Something-went-wrong")));
            setShowbarupload(false);
            setTasksAttachments([]);
          }
        } else {
          dispatch(savefilesandfolders_fail(t("Something-went-wrong")));
          setShowbarupload(false);
          setTasksAttachments([]);
        }
      })
      .catch(() => {
        dispatch(savefilesandfolders_fail(t("Something-went-wrong")));
        setShowbarupload(false);
        setTasksAttachments([]);
      });
  };
};

const folderUploadData = (response) => {
  return {
    type: actions.FOLDER_UPLOAD_DATA,
    response: response,
  };
};
export {
  saveFilesApi,
  createFolderApi,
  uploadDocumentsApi,
  // huzeifa work
  CheckFolderisExist,
  createFolder,
  uploadFile,
  FolderisExist_success,
  CreateFolder_success,
  folderUploadData,
};
