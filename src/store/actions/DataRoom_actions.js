import axios from "axios";
import {
  FileisExistRequestMethod,
  deleteFolderRequestMethod,
  FolderisExistRequestMethod,
  deleteFileRequestMethod,
  createFolderRequestMethod,
  getDocumentsAndFolderRequestMethod,
  getFolderDocumentsRequestMethod,
  getMyDocumentsAndFoldersRequestMethod,
  saveFilesRequestMethod,
  saveFolderRequestMethod,
  shareFilesRequestMethod,
  shareFolderRequestMethod,
  uploadDocumentsRequestMethod,
} from "../../commen/apis/Api_config";
import { dataRoomApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";

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
const saveFilesApi = (navigate, data, t) => {
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
              if (folderID !== null) {
                await dispatch(getFolderDocumentsApi(folderID, t));
              } else {
                await dispatch(getDocumentsAndFolderApi(1, t));
              }
              localStorage.removeItem("folderID");
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
        setTasksAttachments((prev) => {
          return { ...prev, [file.uid]: file };
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
              await dispatch(saveFilesApi(response.data.responseResult, t));
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

// Save Folder Init
const saveFolder_init = () => {
  return {
    type: actions.SAVE_FOLDER_DATAROOM_INIT,
  };
};
// Save Folder Success
const saveFolder_success = (response, message) => {
  return {
    type: actions.SAVE_FOLDER_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};
// Save Folder Fail
const saveFolder_fail = (message) => {
  return {
    type: actions.SAVE_FOLDER_DATAROOM_FAIL,
    message: message,
  };
};

// Save Folder API
const saveFolderApi = () => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {};
  return (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", saveFolderRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then((response) => {
        if (response.data.responseCode === 417) {
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_01".toLowerCase()
                )
            ) {
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_02".toLowerCase()
                )
            ) {
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_03".toLowerCase()
                )
            ) {
            }
          } else {
          }
        } else {
        }
      })
      .catch((error) => {});
  };
};

// Get Folder Documents Init
const getFolerDocuments_init = () => {
  return {
    type: actions.GET_FOLDER_DOCUMENTS_DATAROOM_INIT,
  };
};

// Get Folder Documents Success
const getFolerDocuments_success = (response, message) => {
  return {
    type: actions.GET_FOLDER_DOCUMENTS_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

// Get Folder Documents Fail
const getFolerDocuments_fail = (message) => {
  return {
    type: actions.GET_FOLDER_DOCUMENTS_DATAROOM_FAIL,
    message: message,
  };
};

// Get Folder Documents Api
const getFolderDocumentsApi = (navigate, FolderId, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = { FolderID: JSON.parse(FolderId) };
  return (dispatch) => {
    dispatch(getFolerDocuments_init());
    let form = new FormData();
    form.append("RequestMethod", getFolderDocumentsRequestMethod.RequestMethod);
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
          dispatch(getFolderDocumentsApi(navigate, FolderId, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetFolderDocuments_01".toLowerCase()
                )
            ) {
              dispatch(
                getFolerDocuments_success(
                  response.data.responseResult.data,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetFolderDocuments_02".toLowerCase()
                )
            ) {
              dispatch(getFolerDocuments_fail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetFolderDocuments_03".toLowerCase()
                )
            ) {
              dispatch(getFolerDocuments_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getFolerDocuments_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getFolerDocuments_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(getFolerDocuments_fail(t("Something-went-wrong")));
      });
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
    dispatch(createFolder_init());
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
              await dispatch(
                createFolder_success(
                  response.data.responseResult,
                  t("Folder-created-successfully")
                )
              );
              dispatch(getDocumentsAndFolderApi(3, t));
              setAddfolder(false);
              localStorage.removeItem("folderID");
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

// Get Documents and Folders Init
const getDocumentsAndFolders_init = () => {
  return {
    type: actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_INIT,
  };
};

// Get Documents and Folders Success
const getDocumentsAndFolders_success = (response, message) => {
  return {
    type: actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

// Get Documents and Folders Fail
const getDocumentsAndFolders_fail = (message) => {
  return {
    type: actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_FAIL,
    message: message,
  };
};

// Get Documents And Folder API
const getDocumentsAndFolderApi = (navigate, statusID, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    UserID: parseInt(createrID),
    OrganizationID: parseInt(OrganizationID),
    StatusID: parseInt(statusID),
  };
  // let Data = {
  //     UserID: 722,
  //     OrganizationID: 270,
  //     StatusID: parseInt(statusID)
  // }
  return (dispatch) => {
    dispatch(getDocumentsAndFolders_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getDocumentsAndFolderRequestMethod.RequestMethod
    );
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
          dispatch(getDocumentsAndFolderApi(navigate, statusID, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetDocumentsAndFolders_01".toLowerCase()
            ) {
              dispatch(
                getDocumentsAndFolders_success(
                  response.data.responseResult.data,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetDocumentsAndFolders_02".toLowerCase()
            ) {
              dispatch(getDocumentsAndFolders_fail(t("No-record-found")));
              console.log("checking1212");
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetDocumentsAndFolders_03".toLowerCase()
            ) {
              dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
      });
  };
};

// Share Files Init
const shareFiles_init = () => {
  return {
    type: actions.SHAREFILES_DATAROOM_INIT,
  };
};

// Share Files Success
const shareFiles_success = (response, message) => {
  return {
    type: actions.SHAREFILES_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

// Share Files Fail
const shareFiles_fail = (message) => {
  return {
    type: actions.SHAREFILES_DATAROOM_FAIL,
    message: message,
  };
};

// Share Files Api
const shareFilesApi = (navigate, FileData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(shareFiles_init());
    let form = new FormData();
    form.append("RequestMethod", shareFilesRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(FileData));
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
          dispatch(shareFilesApi(navigate, FileData, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_ShareFiles_01".toLowerCase()
                )
            ) {
              dispatch(
                shareFiles_success(
                  response.data.responseResult,
                  t("Files-shared-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_ShareFiles_02".toLowerCase()
                )
            ) {
              dispatch(shareFiles_fail(t("Failed-to-share-file")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_ShareFiles_03".toLowerCase()
                )
            ) {
              dispatch(shareFiles_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(shareFiles_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(shareFiles_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(shareFiles_fail(t("Something-went-wrong")));
      });
  };
};

// Share Folders Init
const shareFolders_init = () => {
  return {
    type: actions.SHAREFOLDERS_DATAROOM_INIT,
  };
};

// Share Folders Success
const shareFolders_success = (response, message) => {
  return {
    type: actions.SHAREFILES_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

// Share Folders Fail
const shareFolders_fail = (message) => {
  return {
    type: actions.SHAREFOLDERS_DATAROOM_FAIL,
    message: message,
  };
};

// Share Folders Api
const shareFoldersApi = (navigate, FolderData, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(shareFolders_init());
    let form = new FormData();
    form.append("RequestMethod", shareFolderRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(FolderData));
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
          dispatch(shareFoldersApi(navigate, FolderData, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_ShareFolders_01".toLowerCase()
                )
            ) {
              dispatch(
                shareFolders_success(
                  response.data.responseResult,
                  t("Folder-share-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_ShareFolders_02".toLowerCase()
                )
            ) {
              dispatch(shareFolders_fail(t("Failed-to-share-folder")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_ShareFolders_03".toLowerCase()
                )
            ) {
              dispatch(shareFolders_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(shareFolders_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(shareFolders_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(shareFolders_fail(t("Something-went-wrong")));
      });
  };
};

// Delete file init
const deleteFileDataroom_init = () => {
  return {
    type: actions.DELETEFILE_DATAROOM_INIT,
  };
};

// Delete file success
const deleteFileDataroom_success = (response, message) => {
  console.log(response, message);
  return {
    type: actions.DELETEFILE_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

// Delete file fail
const deleteFileDataroom_fail = (message) => {
  return {
    type: actions.DELETEFILE_DATAROOM_FAIL,
    message: message,
  };
};

// Delete file API
const deleteFileDataroom = (navigate, id, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let data = [];
  data.push(id);
  let Data = { FileID: data };
  return (dispatch) => {
    dispatch(deleteFileDataroom_init());
    let form = new FormData();
    form.append("RequestMethod", deleteFileRequestMethod.RequestMethod);
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
          dispatch(deleteFileDataroom(navigate, id, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFile_01".toLowerCase()
                )
            ) {
              console.log("hello");
              dispatch(getDocumentsAndFolderApi(3, t));
              dispatch(
                deleteFileDataroom_success(
                  response.data.responseResult,
                  t("Files-deleted-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFile_02".toLowerCase()
                )
            ) {
              console.log("hello");
              dispatch(deleteFileDataroom_fail(t("Failed-to-delete-any-file")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFile_03".toLowerCase()
                )
            ) {
              dispatch(deleteFileDataroom_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(deleteFileDataroom_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(deleteFileDataroom_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(deleteFileDataroom_fail(t("Something-went-wrong")));
      });
  };
};

// File Exist init
const FileisExist_init = () => {
  return {
    type: actions.FILEISEXIST_INIT,
  };
};

// File Exist success
const FileisExist_success = (message) => {
  return {
    type: actions.FILEISEXIST_SUCCESS,
    message: message,
  };
};

// File Exist fail
const FileisExist_fail = (message) => {
  return {
    type: actions.FILEISEXIST_FAIL,
    message: message,
  };
};

// File Exist API
const FileisExist = (
  navigate,
  FileName,
  t,
  file,
  setProgress,
  setRemainingTime,
  remainingTime,
  setShowbarupload,
  setTasksAttachments
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let Data = {
    UserID: JSON.parse(createrID),
    ParentFolderID: 0,
    FileName: FileName,
  };
  return (dispatch) => {
    dispatch(FileisExist_init());
    let form = new FormData();
    form.append("RequestMethod", FileisExistRequestMethod.RequestMethod);
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
            FileisExist(
              navigate,
              FileName,
              t,
              file,
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
                  "DataRoom_DataRoomServiceManager_FileExist_01".toLowerCase()
                )
            ) {
              dispatch(FileisExist_fail(t("File-already-exist")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FileExist_02".toLowerCase()
                )
            ) {
              dispatch(FileisExist_success(t("No-file-exist")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FileExist_03".toLowerCase()
                )
            ) {
              await dispatch(FileisExist_fail(t("No-duplicate-found")));
              await dispatch(
                uploadDocumentsApi(
                  file,
                  t,
                  setProgress,
                  setRemainingTime,
                  remainingTime,
                  setShowbarupload,
                  setTasksAttachments
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FileExist_04".toLowerCase()
                )
            ) {
              dispatch(FileisExist_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(FileisExist_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(FileisExist_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(FileisExist_fail(t("Something-went-wrong")));
      });
  };
};

// Folder Exist init
const FolderisExist_init = () => {
  return {
    type: actions.FOLDERISEXIST_INIT,
  };
};

// Folder Exist success
const FolderisExist_success = (message) => {
  return {
    type: actions.FOLDERISEXIST_SUCCESS,
    message: message,
  };
};

// Folder Exist fail
const FolderisExist_fail = (message) => {
  return {
    type: actions.FOLDERISEXIST_FAIL,
    message: message,
  };
};

// Folder Exist API
const FolderisExist = (navigate, FolderName, t, setAddfolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let folderID = JSON.parse(localStorage.getItem("folderID"));
  let Data = {
    UserID: JSON.parse(createrID),
    ParentFolderID: folderID !== null ? folderID : 0,
    FolderName: FolderName,
  };
  return (dispatch) => {
    dispatch(FolderisExist_init());
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
          dispatch(FolderisExist(navigate, FolderName, t, setAddfolder));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_01".toLowerCase()
                )
            ) {
              dispatch(FolderisExist_fail(t("Folder-already-exist")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_02".toLowerCase()
                )
            ) {
              await dispatch(FolderisExist_fail(t("Folder-name-is-required")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_03".toLowerCase()
                )
            ) {
              await dispatch(
                FolderisExist_fail(t("No Folder Exist Against this name"))
              );
              dispatch(createFolderApi(FolderName, t, setAddfolder));
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

const deleteFolder_init = () => {
  return {
    type: actions.DELETEFOLDER_DATAROOM_INIT,
  };
};
const deleteFolder_success = (response, message) => {
  return {
    type: actions.DELETEFOLDER_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};
const deleteFolder_fail = (message) => {
  return {
    type: actions.DELETEFOLDER_DATAROOM_FAIL,
    message: message,
  };
};
const deleteFolder = (navigate, id, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let data = [];
  data.push(id);
  let Data = { FolderID: data };
  return (dispatch) => {
    dispatch(deleteFolder_init());
    let form = new FormData();
    form.append("RequestMethod", deleteFolderRequestMethod.RequestMethod);
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
          dispatch(deleteFolder(navigate, id, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFolder_01".toLowerCase()
                )
            ) {
              console.log("hello");
              dispatch(getDocumentsAndFolderApi(3, t));
              dispatch(
                deleteFolder_success(
                  response.data.responseResult,
                  t("Folder-deleted-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFolder_02".toLowerCase()
                )
            ) {
              console.log("hello");
              dispatch(deleteFolder_fail(t("Failed-to-delete-any-folder")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFolder_03".toLowerCase()
                )
            ) {
              dispatch(deleteFolder_fail(t("Something-went-wrong")));
            } else {
              dispatch(deleteFolder_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(deleteFolder_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(deleteFolder_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(deleteFolder_fail(t("Something-went-wrong")));
      });
  };
};
const clearDataResponseMessage = () => {
  return {
    type: actions.CLEARE_MESSAGE,
  };
};
export {
  saveFilesApi,
  FileisExist,
  deleteFolder,
  getDocumentsAndFolderApi,
  deleteFileDataroom,
  clearDataResponseMessage,
  getFolderDocumentsApi,
  shareFoldersApi,
  saveFolderApi,
  shareFilesApi,
  createFolderApi,
  uploadDocumentsApi,
  FolderisExist,
};
