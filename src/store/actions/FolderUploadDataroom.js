
import {
  FolderisExistRequestMethod,
  createFolderRequestMethod,
  saveFilesRequestMethod,
  saveFilesandFolderRM,
  uploadDocumentsRequestMethod,
} from "../../commen/apis/Api_config";

import { dataRoomApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";

import {
  getDocumentsAndFolderApi,
  getFolderDocumentsApi,
} from "./DataRoom_actions";
import { replaceSlashWithBackslash } from "../../commen/functions/regex";
import axiosInstance from "../../commen/functions/axiosInstance";

// Folder Exist fail
const FolderisExist_fail = (message) => {
  return {
    type: actions.FOLDERISEXIST_FAIL,
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
    let form = new FormData();
    form.append("RequestMethod", createFolderRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
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

// Upload Documents Success
const uploadDocument_success = (response, message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_SUCCESS,
    response: response,
    message: "",
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
    axiosInstance
      .post(dataRoomApi, form, {
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

// Save Files Success
const saveFiles_success = (response, message) => {
  return {
    type: actions.SAVEFILES_DATAROOM_SUCCESS,
    response: response,
    message: "",
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

  let Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: [
      {
        DisplayFileName: data.displayFileName,
        DiskusFileNameString: data.diskusFileName,
        ShareAbleLink: data.shareAbleLink,
        FK_UserID: JSON.parse(createrID),
        FK_OrganizationID: JSON.parse(OrganizationID),
        FileSizeOnDisk: Number(data.fileSizeOnDisk),
        FileSize: Number(data.fileSize),
      },
    ],
  };
  return (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
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
const CreateFolderEmpty = () => {
  return {
    type: actions.CREATE_FOLDER_EMPTY,
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
    FolderName: folderName.FolderName,
  };
  return (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", FolderisExistRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
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
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_03".toLowerCase()
                )
            ) {
              await dispatch(FolderisExist_success(false));
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

const folderUploadData = (response) => {
  return {
    type: actions.FOLDER_UPLOAD_DATA,
    response: response,
  };
};

const removeFolderUploadData = (response) => {
  return {
    type: actions.REMOVE_FOLDER_UPLOAD_DATA,
    response: response,
  };
};

const createFolder = (
  navigate,
  t,
  folder,
  setShowbarupload,
  showbarupload,
  type
) => {
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let token = JSON.parse(localStorage.getItem("token"));
  let folderID = JSON.parse(localStorage.getItem("folderID"));
  let Data = {
    FolderName: folder.FolderName,
    UserID: parseInt(createrID),
    OrganizationID: parseInt(OrganizationID),
    ParentFolderID: folderID !== null && folderID !== undefined ? folderID : 0,
    Type: type,
  };
  return (dispatch) => {
    if (showbarupload === false) {
      setShowbarupload(true);
    }
    let form = new FormData();
    form.append("RequestMethod", createFolderRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            createFolderApi(
              navigate,
              t,
              folder,
              setShowbarupload,
              showbarupload,
              type
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_01".toLowerCase()
                )
            ) {
              let newDataResponceUD = {
                FolderName: response.data.responseResult.displayFolderName,
                FolderID: response.data.responseResult.folderID,
                DisplayFolderNameOLD:
                  response.data.responseResult.displayFolderNameOLD,
              };

              await dispatch(CreateFolder_success(newDataResponceUD));
              dispatch(FolderisExist_success(null));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_02".toLowerCase()
                )
            ) {
              await dispatch(CreateFolderEmpty());

              dispatch(createFolder_fail(t("Failed-to-create-folder")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateFolder_03".toLowerCase()
                )
            ) {
              await dispatch(CreateFolderEmpty());
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
  netDisconnect
  // axiosCancelToken
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  if (!netDisconnect) {
    return async (dispatch) => {
      let form = new FormData();
      form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
      form.append("RequestData", JSON.stringify(file));
      form.append("File", file);
      console.log(file, "filefile");
      await axiosInstance
        .post(dataRoomApi, form)
        .then(async (response) => {
          if (response.data.responseCode === 417) {
            await dispatch(RefreshToken(navigate, t));
            dispatch(uploadFile(navigate, file, folderID, t, netDisconnect));
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
                    file.webkitRelativePath,
                    netDisconnect
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
  }
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
  filePath,
  netDisconnect
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: [
      {
        DisplayFileName: data.displayFileName,
        DiskusFileNameString: data.diskusFileName,
        ShareAbleLink: data.shareAbleLink,
        FK_UserID: JSON.parse(createrID),
        FK_OrganizationID: JSON.parse(OrganizationID),
        UriPath: replaceSlashWithBackslash(filePath),
        FileSizeOnDisk: Number(data.fileSizeOnDisk),
        FileSize: Number(data.fileSize),
      },
    ],
    UserID: JSON.parse(createrID),
    Type: 0,
  };
  if (!netDisconnect) {
    return async (dispatch) => {
      let form = new FormData();
      form.append("RequestMethod", saveFilesandFolderRM.RequestMethod);
      form.append("RequestData", JSON.stringify(Data));
      await axiosInstance
        .post(dataRoomApi, form)
        .then(async (response) => {
          if (response.data.responseCode === 417) {
            dispatch(RefreshToken(navigate, t));
            dispatch(
              saveFilesandFoldersApi(
                navigate,
                folderID,
                data,
                t,
                filePath,
                netDisconnect
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
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
                  )
              ) {
                dispatch(
                  savefilesandfolders_fail(t("Failed-to-save-any-file"))
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
                  )
              ) {
                dispatch(savefilesandfolders_fail(t("Something-went-wrong")));
              } else {
                dispatch(savefilesandfolders_fail(t("Something-went-wrong")));
              }
            } else {
              dispatch(savefilesandfolders_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(savefilesandfolders_fail(t("Something-went-wrong")));
          }
        })
        .catch(() => {
          dispatch(savefilesandfolders_fail(t("Something-went-wrong")));
        });
    };
  }
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
  removeFolderUploadData,
  CreateFolderEmpty,
};
