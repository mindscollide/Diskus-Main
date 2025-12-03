
import {
  FileisExistRequestMethod,
  deleteFolderRequestMethod,
  FolderisExistRequestMethod,
  deleteFileRequestMethod,
  createFolderRequestMethod,
  getDocumentsAndFolderRequestMethod,
  getFolderDocumentsRequestMethod,
  saveFilesRequestMethod,
  saveFolderRequestMethod,
  shareFilesRequestMethod,
  shareFolderRequestMethod,
  uploadDocumentsRequestMethod,
  renameFolderRequestMethod,
  renameFileRequestMethod,
  searchDocumentsFoldersAPI,
  getRecentDocumentsRM,
  getUserAgainstShareFolderRM,
  getUserAgainstShareFileRM,
  createFileLinkRM,
  createFolderLinkRM,
  updateGeneralAccessRM,
  checkFileLinkRM,
  requestAccessRM,
  updateFolderGeneralAccessRM,
  dataRoomFileDownloadService,
  dataRoomFolderDownloadService,
  validateEncyptedStringUserDataRoom,
  leaveFileSharingRM,
  leaveFolderSharingRM,
  GetDataRoomFileSharedPersmission,
} from "../../commen/apis/Api_config";
import {
  DataRoomAllFilesDownloads,
  dataRoomApi,
} from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import {
  fileFormatforSignatureFlow,
  isFunction,
  openDocumentViewer,
} from "../../commen/functions/utils";
import { showShareViaDataRoomPathConfirmation } from "./NewMeetingActions";
import { type } from "@testing-library/user-event/dist/cjs/utility/index.js";
import axiosInstance from "../../commen/functions/axiosInstance";
import axios from "axios";

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
  t,
  data,
  type,
  newJsonCreateFile,
  taskId,
  setTasksAttachments,
  tasksAttachments
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let folderID = JSON.parse(localStorage.getItem("folderID"));
  let currentView = localStorage.getItem("setTableView");
  let viewFolderID = localStorage.getItem("folderID");

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
    UserID: JSON.parse(createrID),
    Type: type !== null && type !== undefined ? type : 0,
  };
  if (!tasksAttachments[taskId]?.NetDisconnect) {
    return (dispatch) => {
      // dispatch(saveFiles_init())
      let form = new FormData();
      form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
      form.append("RequestData", JSON.stringify(Data));
      axiosInstance
        .post(dataRoomApi, form)
        .then(async (response) => {
          if (response.data.responseCode === 417) {
            dispatch(RefreshToken(navigate, t));
            dispatch(
              saveFilesApi(
                navigate,
                t,
                data,
                type,
                newJsonCreateFile,
                taskId,
                setTasksAttachments,
                tasksAttachments
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
                  saveFiles_success(
                    response.data.responseMessage,
                    t("Files-saved-successfully")
                  )
                );
                if (viewFolderID !== null) {
                  dispatch(
                    getFolderDocumentsApi(navigate, Number(viewFolderID), t)
                  );
                } else {
                  if (Number(currentView) === 4) {
                    let Data = {
                      UserID: Number(createrID),
                      OrganizationID: Number(OrganizationID),
                    };
                    dispatch(getRecentDocumentsApi(navigate, t, Data));
                  } else {
                    dispatch(
                      getDocumentsAndFolderApi(navigate, Number(currentView), t)
                    );
                  }
                }
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
                  )
              ) {
                dispatch(saveFiles_fail(t("Failed-to-save-any-file")));
                setTasksAttachments((prevTasks) => ({
                  ...prevTasks,
                  [taskId]: {
                    ...prevTasks[taskId],
                    Uploaded: false,
                    Uploading: false,
                    UploadingError: true,
                    Progress: 0,
                  },
                }));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
                  )
              ) {
                setTasksAttachments((prevTasks) => ({
                  ...prevTasks,
                  [taskId]: {
                    ...prevTasks[taskId],
                    Uploaded: false,
                    Uploading: false,
                    UploadingError: true,
                    Progress: 0,
                  },
                }));
                dispatch(saveFiles_fail(t("Something-went-wrong")));
              }
            } else {
              setTasksAttachments((prevTasks) => ({
                ...prevTasks,
                [taskId]: {
                  ...prevTasks[taskId],
                  Uploaded: false,
                  Uploading: false,
                  UploadingError: true,
                  Progress: 0,
                },
              }));
              dispatch(saveFiles_fail(t("Something-went-wrong")));
            }
          } else {
            setTasksAttachments((prevTasks) => ({
              ...prevTasks,
              [taskId]: {
                ...prevTasks[taskId],
                Uploaded: false,
                Uploading: false,
                UploadingError: true,
                Progress: 0,
              },
            }));
            dispatch(saveFiles_fail(t("Something-went-wrong")));
          }
        })
        .catch(() => {
          setTasksAttachments((prevTasks) => ({
            ...prevTasks,
            [taskId]: {
              ...prevTasks[taskId],
              Uploaded: false,
              Uploading: false,
              UploadingError: true,
              Progress: 0,
            },
          }));
          dispatch(saveFiles_fail(t("Something-went-wrong")));
        });
    };
  }
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
  t,
  newJsonCreateFile,
  taskId,
  setTasksAttachments,
  tasksAttachments,
  type,
  setShowbarupload,
  showbarupload
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  // Set Uploading to true when starting the upload
  setTasksAttachments((prevTasks) => ({
    ...prevTasks,
    [taskId]: {
      ...prevTasks[taskId],
      Uploading: true,
    },
  }));
  if (showbarupload === false) {
    setShowbarupload(true);
  }
  if (!tasksAttachments[taskId]?.NetDisconnect) {
    return (dispatch) => {
      let form = new FormData();
      form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
      form.append("RequestData", JSON.stringify(newJsonCreateFile.File));
      form.append("File", newJsonCreateFile.File);

      console.log(
        newJsonCreateFile.File,
        newJsonCreateFile,
        "newJsonCreateFile"
      );
      axiosInstance
        .post(dataRoomApi, form, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setTasksAttachments((prevTasks) => ({
              ...prevTasks,
              [taskId]: {
                ...prevTasks[taskId],
                Progress: percentCompleted,
              },
            }));
          },
          cancelToken: newJsonCreateFile.axiosCancelToken.token,
        })

        .then(async (response) => {
          if (response.data.responseCode === 417) {
            await dispatch(RefreshToken(navigate, t));
            dispatch(
              uploadDocumentsApi(
                navigate,
                t,
                newJsonCreateFile,
                taskId,
                setTasksAttachments,
                tasksAttachments,
                type,
                setShowbarupload,
                showbarupload
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
                setTasksAttachments((prevTasks) => ({
                  ...prevTasks,
                  [taskId]: {
                    ...prevTasks[taskId],
                    Uploaded: true,
                    Uploading: false,
                  },
                }));
                await dispatch(
                  uploadDocument_success(
                    response.data.responseResult,
                    t("Document-uploaded-successfully")
                  )
                );
                await dispatch(
                  saveFilesApi(
                    navigate,
                    t,
                    response.data.responseResult,
                    type,
                    newJsonCreateFile,
                    taskId,
                    setTasksAttachments,
                    tasksAttachments
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
                setTasksAttachments((prevTasks) => ({
                  ...prevTasks,
                  [taskId]: {
                    ...prevTasks[taskId],
                    Uploaded: false,
                    Uploading: false,
                    UploadingError: true,
                    Progress: 0,
                  },
                }));
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
                  )
              ) {
                setTasksAttachments((prevTasks) => ({
                  ...prevTasks,
                  [taskId]: {
                    ...prevTasks[taskId],
                    Uploaded: false,
                    Uploading: false,
                    UploadingError: true,
                    Progress: 0,
                  },
                }));
                dispatch(uploadDocument_fail(t("Something-went-wrong")));
              }
            } else {
              setTasksAttachments((prevTasks) => ({
                ...prevTasks,
                [taskId]: {
                  ...prevTasks[taskId],
                  Uploaded: false,
                  Uploading: false,
                  UploadingError: true,
                  Progress: 0,
                },
              }));
              dispatch(uploadDocument_fail(t("Something-went-wrong")));
            }
          } else {
            setTasksAttachments((prevTasks) => ({
              ...prevTasks,
              [taskId]: {
                ...prevTasks[taskId],
                Uploaded: false,
                Uploading: false,
                UploadingError: true,
                Progress: 0,
              },
            }));
            dispatch(uploadDocument_fail(t("Something-went-wrong")));
          }
          // }
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            // Handle cancellation as needed
          } else {
            setTasksAttachments((prevTasks) => ({
              ...prevTasks,
              [taskId]: {
                ...prevTasks[taskId],
                Uploaded: false,
                Uploading: false,
                UploadingError: true,
                Progress: 0,
              },
            }));
            // Handle other errors as needed
          }

          // dispatch(uploadDocument_fail(t("Something-went-wrong")));
        });
    };
  }
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
const BreadCrumbsList = (response) => {
  return {
    type: actions.DATAROOM_BREADCRUMBS,
    payload: response,
  };
};
// Get Folder Documents Api
const getFolderDocumentsApi = (
  navigate,
  FolderId,
  t,
  no,
  record,
  BreadCrumbsListArr,
  sortValue,
  isDescending
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");

  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    FolderID: Number(FolderId),
    UserID: Number(createrID),
    OrganizationID: Number(OrganizationID),
    sRow: 0,
    Length: 10,
    SortBy: sortValue ?? 1,
    isDescending: isDescending ?? true,
  };
  return (dispatch) => {
    if (no !== 1) {
      dispatch(getFolerDocuments_init());
    }
    let form = new FormData();
    form.append("RequestMethod", getFolderDocumentsRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getFolderDocumentsApi(
              navigate,
              FolderId,
              t,
              no,
              record,
              BreadCrumbsListArr,
              sortValue,
              isDescending
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetFolderDocuments_01".toLowerCase()
                )
            ) {
              let getCurrentView = localStorage.getItem("setTableView");
              let newArr;
              if (
                getCurrentView !== null &&
                record !== null &&
                record !== undefined
              ) {
                if (
                  BreadCrumbsListArr !== null &&
                  BreadCrumbsListArr !== undefined &&
                  BreadCrumbsListArr.length === 0
                ) {
                  // if User click from main root folder
                  let viewName =
                    Number(getCurrentView) === 1
                      ? t("My-document")
                      : Number(getCurrentView) === 2
                      ? t("Shared-with-me")
                      : Number(getCurrentView) === 3
                      ? t("All")
                      : t("Recently-added");
                  newArr = [
                    { name: viewName, id: Number(getCurrentView), main: true },
                    { name: record?.name, id: record?.id },
                  ];
                  dispatch(BreadCrumbsList(newArr));
                } else {
                  let findIfItsExist = BreadCrumbsListArr.findIndex(
                    (breadCrumbData, index) => breadCrumbData.id === record.id
                  );
                  if (findIfItsExist !== -1) {
                    // Keep only the elements before index 2
                    let checkingisExist = BreadCrumbsListArr.slice(
                      0,
                      findIfItsExist + 1
                    );
                    dispatch(BreadCrumbsList(checkingisExist));
                  } else {
                    let newFolderRecord = [
                      ...BreadCrumbsListArr,
                      { name: record?.name, id: record?.id },
                    ];
                    dispatch(BreadCrumbsList(newFolderRecord));
                  }
                }
              }

              dispatch(
                getFolerDocuments_success(response.data.responseResult, "")
              );
              if (no === 5) {
                dispatch(showShareViaDataRoomPathConfirmation(false));
                navigate("/Diskus/dataroom");
              }
              dispatch(isFolder(1));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetFolderDocuments_02".toLowerCase()
                )
            ) {
              dispatch(isFolder(2));
              dispatch(
                getFolerDocuments_success(
                  response.data.responseResult,
                  t("No-record-found")
                )
              );
              try {
                console.log(BreadCrumbsListArr, "BreadCrumbsListArr");

                if (
                  BreadCrumbsListArr !== null &&
                  BreadCrumbsListArr !== undefined &&
                  BreadCrumbsListArr.length === 0
                ) {
                  let getCurrentView = localStorage.getItem("setTableView");
                  let newArr;
                  // if User click from main root folder
                  let viewName =
                    Number(getCurrentView) === 1
                      ? t("My-document")
                      : Number(getCurrentView) === 2
                      ? t("Shared-with-me")
                      : Number(getCurrentView) === 3
                      ? t("All")
                      : t("Recently-added");
                  newArr = [
                    { name: viewName, id: Number(getCurrentView), main: true },
                    { name: record?.name, id: record?.id },
                  ];
                  dispatch(BreadCrumbsList(newArr));
                } else {
                  let findIfItsExist = BreadCrumbsListArr.findIndex(
                    (breadCrumbData, index) => breadCrumbData.id === record.id
                  );
                  if (findIfItsExist !== -1) {
                    // Keep only the elements before index 2
                    let checkingisExist = BreadCrumbsListArr.slice(
                      0,
                      findIfItsExist + 1
                    );
                    dispatch(BreadCrumbsList(checkingisExist));
                  } else {
                    let newFolderRecord = [
                      ...BreadCrumbsListArr,
                      { name: record?.name, id: record?.id },
                    ];
                    dispatch(BreadCrumbsList(newFolderRecord));
                  }
                }
              } catch (error) {
                console.log(error);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetFolderDocuments_03".toLowerCase()
                )
            ) {
              dispatch(isFolder(3));
              dispatch(getFolerDocuments_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(isFolder(3));
            dispatch(getFolerDocuments_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(isFolder(3));
          dispatch(getFolerDocuments_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(isFolder(3));
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
const createFolderApi = (
  navigate,
  folder,
  t,
  setAddfolder,
  type,
  setIsExistFolder
) => {
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let token = JSON.parse(localStorage.getItem("token"));
  let folderID = JSON.parse(localStorage.getItem("folderID"));
  let currentView = localStorage.getItem("setTableView");
  let Data = {
    FolderName: folder,
    UserID: parseInt(createrID),
    OrganizationID: parseInt(OrganizationID),
    ParentFolderID: folderID !== null ? folderID : 0,
    Type: type !== null && type !== undefined ? type : 0,
  };
  return (dispatch) => {
    dispatch(createFolder_init());
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
              folder,
              t,
              setAddfolder,
              type,
              setIsExistFolder
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
              await dispatch(
                createFolder_success(
                  response.data.responseResult,
                  t("Folder-created-successfully")
                )
              );
              setAddfolder(false);
              setIsExistFolder(false);

              if (folderID !== null && folderID !== undefined) {
                dispatch(getFolderDocumentsApi(navigate, folderID, t));
              } else {
                if (Number(currentView) === 4) {
                  let Data = {
                    UserID: Number(createrID),
                    OrganizationID: Number(OrganizationID),
                  };
                  dispatch(getRecentDocumentsApi(navigate, t, Data));
                } else {
                  dispatch(
                    getDocumentsAndFolderApi(navigate, Number(currentView), t)
                  );
                }
                // dispatch(dataBehaviour(true))
              }
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
            setAddfolder(false);
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

const getDocumentsAndFolderApi = (navigate, statusID, t, no, sort, order) => {
  return async (dispatch) => {
    const token = JSON.parse(localStorage.getItem("token"));
    const userID = localStorage.getItem("userID");
    const organizationID = localStorage.getItem("organizationID");

    const Data = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      StatusID: parseInt(statusID),
      SortBy: sort ?? 1,
      isDescending: order ?? true,
      sRow: 0,
      Length: 10,
    };

    if (no === 1) {
      dispatch(getDocumentsAndFolders_init());
    }

    try {
      const form = new FormData();
      form.append(
        "RequestMethod",
        getDocumentsAndFolderRequestMethod.RequestMethod
      );
      form.append("RequestData", JSON.stringify(Data));

      const response = await axiosInstance.post(dataRoomApi, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(
          getDocumentsAndFolderApi(navigate, statusID, t, no, sort, order)
        );
      }

      if (response.data.responseCode === 200) {
        const result = response.data.responseResult;
        if (result.isExecuted) {
          const message = result.responseMessage.toLowerCase();
          if (
            message === "dataroom_dataroommanager_getdocumentsandfolders_01"
          ) {
            dispatch(getDocumentsAndFolders_success(result, ""));
            localStorage.setItem("setTableView", statusID);
            return result; // Return the successful result
          } else if (
            message === "dataroom_dataroommanager_getdocumentsandfolders_02"
          ) {
            dispatch(getDocumentsAndFolders_fail(t("No-record-found")));
          } else {
            dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
        }
      } else {
        dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
      }
    } catch (error) {
      dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
      // throw new Error(error); // Re-throw error for further handling
    }
  };
};

// Get All Data from scroll behaviour
const getDocumentsAndFolderApiScrollbehaviour = (
  navigate,
  statusID,
  t,
  sRows,
  filterValue,
  order
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    UserID: parseInt(createrID),
    OrganizationID: parseInt(OrganizationID),
    StatusID: parseInt(statusID),
    SortBy: filterValue !== 0 ? filterValue : 1,
    isDescending: Boolean(order),
    sRow: Number(sRows),
    Length: 10,
  };
  return (dispatch) => {
    dispatch(tableSpinner(true));
    let form = new FormData();
    form.append(
      "RequestMethod",
      getDocumentsAndFolderRequestMethod.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getDocumentsAndFolderApiScrollbehaviour(
              navigate,
              statusID,
              t,
              sRows,
              filterValue
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetDocumentsAndFolders_01".toLowerCase()
            ) {
              dispatch(tableSpinner(false));
              dispatch(
                getDocumentsAndFolders_success(response.data.responseResult, "")
              );
              if (statusID === 1) {
                localStorage.setItem("setTableView", 1);
              } else if (statusID === 2) {
                localStorage.setItem("setTableView", 2);
              } else if (statusID === 3) {
                localStorage.setItem("setTableView", 3);
              }
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetDocumentsAndFolders_02".toLowerCase()
            ) {
              dispatch(getDocumentsAndFolders_fail(t("No-record-found")));
              dispatch(tableSpinner(false));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetDocumentsAndFolders_03".toLowerCase()
            ) {
              dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
              dispatch(tableSpinner(false));
            }
          } else {
            dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
            dispatch(tableSpinner(false));
          }
        } else {
          dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
          dispatch(tableSpinner(false));
        }
      })
      .catch((error) => {
        dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")));
        dispatch(tableSpinner(false));
        return new Error(error);
      });
  };
};

// Get folder Data from Scroll Behaviour
const getFolderDocumentsApiScrollBehaviour = (
  navigate,
  FolderId,
  t,
  no,
  sRow,
  SortBy,
  order
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    FolderID: Number(FolderId),
    UserID: Number(createrID),
    OrganizationID: Number(OrganizationID),
    sRow: Number(sRow),
    Length: 10,
    SortBy: SortBy !== null && SortBy !== undefined ? Number(SortBy) : 1,
    isDescending: order !== null && order !== undefined ? order : true,
  };
  return (dispatch) => {
    dispatch(tableSpinner(true));
    let form = new FormData();
    form.append("RequestMethod", getFolderDocumentsRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getFolderDocumentsApiScrollBehaviour(
              navigate,
              FolderId,
              t,
              no,
              sRow,
              SortBy,
              order
            )
          );
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
                getFolerDocuments_success(response.data.responseResult, "")
              );
              dispatch(isFolder(1));
              dispatch(tableSpinner(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetFolderDocuments_02".toLowerCase()
                )
            ) {
              dispatch(tableSpinner(false));
              dispatch(
                getFolerDocuments_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetFolderDocuments_03".toLowerCase()
                )
            ) {
              dispatch(tableSpinner(false));
              dispatch(getFolerDocuments_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(tableSpinner(false));
            dispatch(getFolerDocuments_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(tableSpinner(false));
          dispatch(getFolerDocuments_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(tableSpinner(false));
        dispatch(getFolerDocuments_fail(t("Something-went-wrong")));
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
const shareFilesApi = (navigate, FileData, t, setShareFile) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(shareFiles_init());
    let form = new FormData();
    form.append("RequestMethod", shareFilesRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(FileData));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(shareFilesApi(navigate, FileData, t, setShareFile));
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
              setShareFile(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_ShareFiles_02".toLowerCase()
                )
            ) {
              dispatch(shareFiles_fail(""));
              setShareFile(false);
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
const shareFoldersApi = (navigate, FolderData, t, setSharefolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let folderID = JSON.parse(localStorage.getItem("folderID"));
  let currentView = localStorage.getItem("setTableView");

  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  return (dispatch) => {
    dispatch(shareFolders_init());
    let form = new FormData();
    form.append("RequestMethod", shareFolderRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(FolderData));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(shareFoldersApi(navigate, FolderData, t, setSharefolder));
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
              setSharefolder(false);
              if (folderID !== null && folderID !== undefined) {
                dispatch(getFolderDocumentsApi(navigate, folderID, t));
              } else {
                if (Number(currentView) === 4) {
                  let Data = {
                    UserID: Number(createrID),
                    OrganizationID: Number(OrganizationID),
                  };
                  dispatch(getRecentDocumentsApi(navigate, t, Data));
                } else {
                  dispatch(
                    getDocumentsAndFolderApi(navigate, Number(currentView), t)
                  );
                }
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_ShareFolders_02".toLowerCase()
                )
            ) {
              setSharefolder(false);

              dispatch(shareFolders_fail(""));
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
const deleteFileDataroom = (navigate, id, t, setIsFileDelete) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentView = localStorage.getItem("setTableView");
  let folderId = localStorage.getItem("folderID");
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let data = [];
  data.push(id);
  let Data = { FileID: data };
  return (dispatch) => {
    dispatch(deleteFileDataroom_init());
    let form = new FormData();
    form.append("RequestMethod", deleteFileRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(deleteFileDataroom(navigate, id, t, setIsFileDelete));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFile_01".toLowerCase()
                )
            ) {
              try {
                if (Number(currentView) === 4) {
                  let Data = {
                    UserID: Number(createrID),
                    OrganizationID: Number(OrganizationID),
                  };
                  dispatch(getRecentDocumentsApi(navigate, t, Data));
                } else {
                  if (folderId !== null) {
                    dispatch(
                      getFolderDocumentsApi(navigate, Number(folderId), t)
                    );
                  } else {
                    dispatch(
                      getDocumentsAndFolderApi(navigate, Number(currentView), t)
                    );
                  }
                }

                isFunction(setIsFileDelete) && setIsFileDelete(false);

                dispatch(
                  deleteFileDataroom_success(
                    response.data.responseResult,
                    t("Files-deleted-successfully")
                  )
                );
              } catch (error) {
                console.log(error);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFile_02".toLowerCase()
                )
            ) {
              dispatch(deleteFileDataroom_fail(t("Failed-to-delete-any-file")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFile_03".toLowerCase()
                )
            ) {
              dispatch(deleteFileDataroom_fail(t("Something-went-wrong")));
            } else {
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
const IsFileisExist = (response) => {
  return {
    type: actions.ISFILEISEXIST,
    response: response,
  };
};
// File Exist API
const FileisExist = (
  navigate,
  t,
  newJsonCreateFile,
  setTasksAttachments,
  tasksAttachments,
  setShowbarupload,
  showbarupload
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let folderId = localStorage.getItem("folderID");
  let Data = {
    UserID: JSON.parse(createrID),
    ParentFolderID: folderId !== null ? Number(folderId) : 0,
    FileName: newJsonCreateFile.FileName,
  };
  return (dispatch) => {
    // dispatch(FileisExist_init());
    let form = new FormData();
    form.append("RequestMethod", FileisExistRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            FileisExist(
              navigate,
              t,
              newJsonCreateFile,
              setTasksAttachments,
              tasksAttachments,
              setShowbarupload,
              showbarupload
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
              localStorage.setItem("fileName", newJsonCreateFile.FileName);
              dispatch(FileisExist_fail(t("File-already-exist")));
              await dispatch(IsFileisExist(true));
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
              // await dispatch(FileisExist_fail(t("No-duplicate-found")));
              dispatch(
                uploadDocumentsApi(
                  navigate,
                  t,
                  newJsonCreateFile,
                  newJsonCreateFile.TaskId,
                  setTasksAttachments,
                  tasksAttachments,
                  0,
                  setShowbarupload,
                  showbarupload
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
            } else {
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

// Folder Exist fail
const FolderisExist_fail = (message) => {
  return {
    type: actions.FOLDERISEXIST_FAIL,
    message: message,
  };
};

// Folder Exist API
const FolderisExist = (
  navigate,
  FolderName,
  t,
  setAddfolder,
  Type,
  setIsExistFolder
) => {
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
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            FolderisExist(
              navigate,
              FolderName,
              t,
              setAddfolder,
              Type,
              setIsExistFolder
            )
          );
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
              localStorage.setItem("folderName", FolderName);
              setIsExistFolder(true);
              setAddfolder(false);
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
              // await dispatch(
              //   FolderisExist_fail(t('No-folder-exist-against-this-name')),
              // )
              dispatch(
                createFolderApi(
                  navigate,
                  FolderName,
                  t,
                  setAddfolder,
                  Type,
                  setIsExistFolder
                )
              );
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

const deleteFolder = (navigate, id, t, setIsFolderDelete) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentView = localStorage.getItem("setTableView");
  let createrID = localStorage.getItem("userID");
  let folderId = localStorage.getItem("folderID");

  let OrganizationID = localStorage.getItem("organizationID");
  let data = [];
  data.push(id);
  let Data = { FolderID: data };
  return (dispatch) => {
    dispatch(deleteFolder_init());
    let form = new FormData();
    form.append("RequestMethod", deleteFolderRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(deleteFolder(navigate, id, t, setIsFolderDelete));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFolder_01".toLowerCase()
                )
            ) {
              if (Number(currentView) === 4) {
                let Data = {
                  UserID: Number(createrID),
                  OrganizationID: Number(OrganizationID),
                };
                dispatch(getRecentDocumentsApi(navigate, t, Data));
              } else {
                if (folderId !== null) {
                  dispatch(
                    getFolderDocumentsApi(navigate, Number(folderId), t)
                  );
                } else {
                  dispatch(
                    getDocumentsAndFolderApi(navigate, Number(currentView), t)
                  );
                }
              }
              isFunction(setIsFolderDelete) && setIsFolderDelete(false);
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

// Folder Exist init
const FolderisExistrename_init = () => {
  return {
    type: actions.FOLDERISEXIST_INIT,
  };
};

// Folder Exist fail
const FolderisExistrename_fail = (message) => {
  return {
    type: actions.FOLDERISEXIST_FAIL,
    message: message,
  };
};

// Folder Exist API
const FolderisExistRename = (navigate, folderData, t, setRenamefolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let folderID = JSON.parse(localStorage.getItem("folderID"));

  let Data = {
    UserID: JSON.parse(createrID),
    ParentFolderID: folderID !== null ? folderID : 0,
    FolderName: folderData.FolderName,
  };
  return (dispatch) => {
    dispatch(FolderisExistrename_init());
    let form = new FormData();
    form.append("RequestMethod", FolderisExistRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(FolderisExist(navigate, folderData, t, setRenamefolder));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_01".toLowerCase()
                )
            ) {
              dispatch(FolderisExistrename_fail(t("Folder-already-exist")));
              // setAddfolder(true)
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_02".toLowerCase()
                )
            ) {
              await dispatch(
                FolderisExistrename_fail(t("Folder-name-is-required"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_03".toLowerCase()
                )
            ) {
              // await dispatch(
              //   FolderisExistrename_fail(t("No-folder-exist-against-this-name"))
              // );
              dispatch(
                renameFolderApi(navigate, folderData, t, setRenamefolder)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_FolderExist_04".toLowerCase()
                )
            ) {
              dispatch(FolderisExistrename_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(FolderisExistrename_fail(t("Something-went-wrong")));
          }
        }
      })
      .catch(() => {
        dispatch(FolderisExistrename_fail(t("Something-went-wrong")));
      });
  };
};

const renameFolder_init = () => {
  return {
    type: actions.RENAMEFOLDER_INIT,
  };
};

const renameFolder_fail = (message) => {
  return {
    type: actions.RENAMEFOLDER_FAIL,
    message: message,
  };
};
const renameFolderApi = (navigate, folderData, t, setRenamefolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentView = localStorage.getItem("setTableView");
  let folderId = localStorage.getItem("folderID");

  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");

  let Data = {
    FolderName: folderData.FolderName,
    FolderID: folderData.folderId,
  };
  return (dispatch) => {
    dispatch(renameFolder_init());
    let form = new FormData();
    form.append("RequestMethod", renameFolderRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance.post(dataRoomApi, form)
 
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(renameFolderApi(navigate, folderData, t, setRenamefolder));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_RenameFolder_01".toLowerCase()
                )
            ) {
              if (Number(currentView) === 4) {
                let Data = {
                  UserID: Number(createrID),
                  OrganizationID: Number(OrganizationID),
                };
                dispatch(getRecentDocumentsApi(navigate, t, Data));
              } else {
                if (folderId !== null) {
                  dispatch(
                    getFolderDocumentsApi(navigate, Number(folderId), t)
                  );
                } else {
                  dispatch(
                    getDocumentsAndFolderApi(navigate, Number(currentView), t)
                  );
                }
              }
              setRenamefolder(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_RenameFolder_02".toLowerCase()
                )
            ) {
              dispatch(renameFolder_fail(t("Folder-name-is-required")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_RenameFolder_03".toLowerCase()
                )
            ) {
              dispatch(renameFolder_fail(t("Failed-to-rename-folder")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_RenameFolder_04".toLowerCase()
                )
            ) {
              dispatch(renameFolder_fail(t("Something-went-wrong")));
            } else {
              dispatch(renameFolder_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(renameFolder_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(renameFolder_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(renameFolder_fail(t("Something-went-wrong")));
      });
  };
};

const FileisExist2 = (navigate, fileData, t, setShowRenameFile) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let Data = {
    UserID: JSON.parse(createrID),
    ParentFolderID: 0,
    FileName: fileData.FileName,
  };
  return (dispatch) => {
    dispatch(FileisExist_init());
    let form = new FormData();
    form.append("RequestMethod", FileisExistRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance.post(dataRoomApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(FileisExist(navigate, fileData, t, setShowRenameFile));
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
              // await dispatch(FileisExist_fail(t("No-duplicate-found")));
              dispatch(renameFileApi(navigate, fileData, t, setShowRenameFile));
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

const renameFile_init = () => {
  return {
    type: actions.RENAMEFILE_INIT,
  };
};

const renameFile_fail = (message) => {
  return {
    type: actions.RENAMEFILE_FAIL,
    message: message,
  };
};
const renameFileApi = (navigate, filedata, t, setShowRenameFile) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentView = localStorage.getItem("setTableView");
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let folderId = localStorage.getItem("folderID");

  let Data = {
    FileName: filedata.FileName,
    FileID: filedata.FileId,
  };
  return (dispatch) => {
    dispatch(renameFile_init());
    let form = new FormData();
    form.append("RequestMethod", renameFileRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance.post(dataRoomApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(renameFileApi(navigate, filedata, t, setShowRenameFile));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_RenameFile_01".toLowerCase()
                )
            ) {
              setShowRenameFile(false);
              if (Number(currentView) === 4) {
                let Data = {
                  UserID: Number(createrID),
                  OrganizationID: Number(OrganizationID),
                };
                dispatch(getRecentDocumentsApi(navigate, t, Data));
              } else {
                if (folderId !== null) {
                  dispatch(
                    getFolderDocumentsApi(navigate, Number(folderId), t)
                  );
                } else {
                  dispatch(
                    getDocumentsAndFolderApi(navigate, Number(currentView), t)
                  );
                }
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_RenameFile_02".toLowerCase()
                )
            ) {
              dispatch(renameFile_fail(t("Folder-name-is-required")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_RenameFile_03".toLowerCase()
                )
            ) {
              dispatch(renameFile_fail(t("Failed-to-rename-folder")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_RenameFile_03".toLowerCase()
                )
            ) {
              dispatch(renameFile_fail(t("Something-went-wrong")));
            } else {
              dispatch(renameFile_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(renameFile_fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((error) => {
        dispatch(renameFile_fail(t("Something-went-wrong")));
      });
  };
};
const tableSpinner = (payload, value) => {
  return {
    type: actions.DATAROOM_TABLE_SCROLL_BAR,
    response: payload,
    value: value,
  };
};

const dataBehaviour = (payload) => {
  return {
    type: actions.DATAROOM_DATA_BEHAVIOUR,
    response: payload,
  };
};

const isFolder = (response) => {
  return {
    type: actions.ISFOLDER,
    response: response,
  };
};
// const resetSpinner = () => {}
const clearDataResponseMessage = () => {
  return {
    type: actions.DATAROOM_CLEAR_MESSAGE,
  };
};
// Get Documents and Folders Init
const searchDocumentsAndFoldersApi_init = () => {
  return {
    type: actions.SEARCHDOCUMENTSANDFOLDERSAPI_DATAROOM_INIT,
  };
};

// Get Documents and Folders Success
const searchDocumentsAndFoldersApi_success = (response, fileCount, message) => {
  return {
    type: actions.SEARCHDOCUMENTSANDFOLDERSAPI_DATAROOM_SUCCESS,
    response: response,
    fileCount: fileCount,
    message: message,
  };
};

// Get Documents and Folders Fail
const searchDocumentsAndFoldersApi_fail = (message) => {
  return {
    type: actions.SEARCHDOCUMENTSANDFOLDERSAPI_DATAROOM_FAIL,
    message: message,
  };
};

// Get Documents And Folder API
const searchDocumentsAndFoldersApi = (navigate, t, data, no) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    if (no !== 1) {
      dispatch(searchDocumentsAndFoldersApi_init());
    }
    let form = new FormData();
    form.append("RequestMethod", searchDocumentsFoldersAPI.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance.post(dataRoomApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(searchDocumentsAndFoldersApi(navigate, t, data, no));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_SearchDocumentsAndFolders_01".toLowerCase()
            ) {
              dispatch(
                searchDocumentsAndFoldersApi_success(
                  response.data.responseResult.data,
                  response.data.responseResult.totalCount,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_SearchDocumentsAndFolders_02".toLowerCase()
            ) {
              dispatch(searchDocumentsAndFoldersApi_fail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_SearchDocumentsAndFolders_03".toLowerCase()
            ) {
              dispatch(
                searchDocumentsAndFoldersApi_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                searchDocumentsAndFoldersApi_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              searchDocumentsAndFoldersApi_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            searchDocumentsAndFoldersApi_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((error) => {
        dispatch(searchDocumentsAndFoldersApi_fail(t("Something-went-wrong")));
      });
  };
};

const recentDocuments_init = () => {
  return {
    type: actions.GET_RECENT_DOCUMENTS_INIT,
  };
};
const recentDocuments_success = (response, message) => {
  return {
    type: actions.GET_RECENT_DOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};
const recentDocuments_fail = (message) => {
  return {
    type: actions.GET_RECENT_DOCUMENTS_FAIL,
    message: message,
  };
};

const getRecentDocumentsApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(recentDocuments_init());
    let form = new FormData();
    form.append("RequestMethod", getRecentDocumentsRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance.post(dataRoomApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getRecentDocumentsApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetRecentDocuments_01".toLowerCase()
                )
            ) {
              dispatch(
                recentDocuments_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetRecentDocuments_02".toLowerCase()
                )
            ) {
              dispatch(recentDocuments_fail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetRecentDocuments_03".toLowerCase()
                )
            ) {
              dispatch(recentDocuments_fail(t("No-record-found")));
            } else {
              dispatch(recentDocuments_fail(t("No-record-found")));
            }
          } else {
            dispatch(recentDocuments_fail(t("No-record-found")));
          }
        } else {
          dispatch(recentDocuments_fail(t("No-record-found")));
        }
      })
      .catch((error) => {
        dispatch(recentDocuments_fail(t("No-record-found")));
      });
  };
};

const getSharedFileUser_init = () => {
  return {
    type: actions.GETUSERSAGAINSTSHAREDFILE_INIT,
  };
};

const getSharedFileUser_success = (response, message) => {
  return {
    type: actions.GETUSERSAGAINSTSHAREDFILE_SUCCESS,
    response,
    message,
  };
};

const getSharedFileUser_fail = (message) => {
  return {
    type: actions.GETUSERSAGAINSTSHAREDFILE_FAIL,
    message,
  };
};

const getSharedFileUsersApi = (navigate, data, t, setShareFileModal) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getSharedFileUser_init());
    let form = new FormData();
    form.append("RequestMethod", getUserAgainstShareFileRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance.post(dataRoomApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getSharedFileUsersApi(navigate, data, t, setShareFileModal));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetUsersAgainstSharedFile_01".toLowerCase()
            ) {
              dispatch(
                getSharedFileUser_success(response.data.responseResult, "")
              );
              setShareFileModal(true);
              // dispatch();
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetUsersAgainstSharedFile_02".toLowerCase()
            ) {
              dispatch(
                getSharedFileUser_success(response.data.responseResult, "")
              );
              setShareFileModal(true);
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetUsersAgainstSharedFile_03".toLowerCase()
            ) {
              dispatch(getSharedFileUser_fail(t("Something-went-wrong")));
            } else {
              dispatch(getSharedFileUser_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getSharedFileUser_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getSharedFileUser_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(getSharedFileUser_fail(t("Something-went-wrong")));
      });
  };
};

const getSharedFolderUser_init = () => {
  return {
    type: actions.GETUSERSAGAINSTSHAREDFOLDER_INIT,
  };
};

const getSharedFolderUser_success = (response, message) => {
  return {
    type: actions.GETUSERSAGAINSTSHAREDFOLDER_SUCCESS,
    response,
    message,
  };
};

const getSharedFolderUser_fail = (message) => {
  return {
    type: actions.GETUSERSAGAINSTSHAREDFOLDER_FAIL,
    message,
  };
};

const getSharedFolderUsersApi = (navigate, data, t, setSharefoldermodal) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getSharedFolderUser_init());
    let form = new FormData();
    form.append("RequestMethod", getUserAgainstShareFolderRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(dataRoomApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getSharedFolderUsersApi(navigate, data, t, setSharefoldermodal)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetUsersAgainstSharedFolder_01".toLowerCase()
            ) {
              dispatch(
                getSharedFolderUser_success(response.data.responseResult, "")
              );
              setSharefoldermodal(true);
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetUsersAgainstSharedFolder_02".toLowerCase()
            ) {
              dispatch(
                getSharedFolderUser_success(
                  response.data.responseResult,
                  t("No-record-found")
                )
              );
              setSharefoldermodal(true);
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_GetUsersAgainstSharedFolder_03".toLowerCase()
            ) {
              dispatch(getSharedFolderUser_fail(t("Something-went-wrong")));
            } else {
              dispatch(getSharedFolderUser_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getSharedFolderUser_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getSharedFolderUser_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(getSharedFolderUser_fail(t("Something-went-wrong")));
      });
  };
};

const createFolderLink_init = () => {
  return {
    type: actions.CREATEFOLDERLINK_INIT,
  };
};

const createFolderLink_success = (response, message) => {
  return {
    type: actions.CREATEFOLDERLINK_SUCCESS,
    response,
    message,
  };
};

const createFolderLink_fail = (message) => {
  return {
    type: actions.CREATEFOLDERLINK_FAIL,
    message,
  };
};

// const createFolderLinkApi = (navigate, t, data, setLinkedcopied) => {
//   let token = JSON.parse(localStorage.getItem("token"));

//   return (dispatch) => {
//     dispatch(createFolderLink_init());
//     let form = new FormData();
//     form.append("RequestMethod", createFolderLinkRM.RequestMethod);
//     form.append("RequestData", JSON.stringify(data));
//     axios({
//       method: "post",
//       url: dataRoomApi,
//       data: form,
//       headers: {
//         _token: token,
//       },
//     })
//       .then(async (response) => {
//         if (response.data.responseCode === 417) {
//           await dispatch(RefreshToken(navigate, t));
//           dispatch(createFolderLinkApi(navigate, t, data));
//         } else if (response.data.responseCode === 200) {
//           if (response.data.responseResult.isExecuted === true) {
//             if (
//               response.data.responseResult.responseMessage.toLowerCase() ===
//               "DataRoom_DataRoomManager_CreateFolderLink_01".toLowerCase()
//             ) {
//               dispatch(
//                 createFolderLink_success(
//                   response.data.responseResult.link,
//                   ""
//                 )
//               );
//               setLinkedcopied(true);
//             } else if (
//               response.data.responseResult.responseMessage.toLowerCase() ===
//               "DataRoom_DataRoomManager_CreateFolderLink_02".toLowerCase()
//             ) {
//               dispatch(
//                 createFolderLink_fail(t("Folder-not-shared-against-any-users"))
//               );
//             } else if (
//               response.data.responseResult.responseMessage.toLowerCase() ===
//               "DataRoom_DataRoomManager_CreateFolderLink_03".toLowerCase()
//             ) {
//               dispatch(createFolderLink_fail(t("Something-went-wrong")));
//             } else {
//               dispatch(createFolderLink_fail(t("Something-went-wrong")));
//             }
//           } else {
//             dispatch(createFolderLink_fail(t("Something-went-wrong")));
//           }
//         } else {
//           dispatch(createFolderLink_fail(t("Something-went-wrong")));
//         }
//       })
//       .catch((error) => {
//         dispatch(createFolderLink_fail(t("Something-went-wrong")));
//       });
//   };
// };

//Same Api Newly Implemented

const createFolderLinkApi = (navigate, t, data, setLinkedcopied) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(createFolderLink_init());
    let form = new FormData();
    form.append("RequestMethod", createFolderLinkRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(createFolderLinkApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CreateFolderFileLink_01".toLowerCase()
            ) {
              dispatch(
                createFolderLink_success(
                  response.data.responseResult.link,
                  t("Link-created")
                )
              );
              setLinkedcopied(true);
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CreateFolderFileLink_02".toLowerCase()
            ) {
              dispatch(createFolderLink_fail(t("No-file-exist-in-system")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CreateFolderFileLink_03".toLowerCase()
            ) {
              dispatch(createFolderLink_fail(t("No-folder-exist-in-system")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CreateFolderFileLink_04".toLowerCase()
            ) {
              dispatch(createFolderLink_fail(t("Something-went-wrong")));
            } else {
              dispatch(createFolderLink_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(createFolderLink_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(createFolderLink_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(createFolderLink_fail(t("Something-went-wrong")));
      });
  };
};

const createFileLink_init = () => {
  return {
    type: actions.CREATEFILELINK_INIT,
  };
};
const createFileLink_success = (response, message) => {
  return {
    type: actions.CREATEFILELINK_SUCCESS,
    response,
    message,
  };
};
const createFileLink_fail = (message) => {
  return {
    type: actions.CREATEFILELINK_FAIL,
    message,
  };
};
const createFileLinkApi = (navigate, t, data, setLinkedcopied) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(createFileLink_init());
    let form = new FormData();
    form.append("RequestMethod", createFileLinkRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(createFileLinkApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CreateFileLink_01".toLowerCase()
            ) {
              dispatch(
                createFileLink_success(
                  response.data.responseResult.link,
                  t("File-shared-against-different-users")
                )
              );
              setLinkedcopied(true);
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CreateFileLink_02".toLowerCase()
            ) {
              dispatch(
                createFileLink_fail(t("File-not-shared-against-any-users"))
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CreateFileLink_03".toLowerCase()
            ) {
              dispatch(createFileLink_fail(t("Something-went-wrong")));
            } else {
              dispatch(createFileLink_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(createFileLink_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(createFileLink_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(createFileLink_fail(t("Something-went-wrong")));
      });
  };
};

const checkFileLink_init = () => {
  return {
    type: actions.CHECKLINKFILE_INIT,
  };
};
const checkFileLink_success = (response, message) => {
  return {
    type: actions.CHECKLINKFILE_SUCCESS,
    response,
    message,
  };
};
const checkFileLink_fail = (message) => {
  return {
    type: actions.CHECKLINKFILE_FAIL,
    message,
  };
};
const checkFileLinkApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(checkFileLink_init());
    let form = new FormData();
    form.append("RequestMethod", checkFileLinkRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(checkFileLinkApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CheckLink_01".toLowerCase()
            ) {
              dispatch(
                checkFileLink_success(
                  response.data.responseResult,
                  t("No-restrictions")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CheckLink_02".toLowerCase()
            ) {
              dispatch(
                checkFileLink_success(
                  response.data.responseResult,
                  t(
                    "Only-allowed-to-my-organization-and-user-part-of-organization"
                  )
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CheckLink_03".toLowerCase()
            ) {
              dispatch(
                checkFileLink_success(
                  response.data.responseResult,
                  t(
                    "Only-allowed-to-my-organization-and-user-not-part-of-organization"
                  )
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CheckLink_04".toLowerCase()
            ) {
              dispatch(
                checkFileLink_success(
                  response.data.responseResult,
                  t("File-restricted-but-this-user-has-assigned-rights")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CheckLink_05".toLowerCase()
            ) {
              dispatch(
                checkFileLink_success(
                  response.data.responseResult,
                  t("File-restricted-request-is-to-ask-for-request-access")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CheckLink_06".toLowerCase()
            ) {
              dispatch(checkFileLink_fail(t("No-file-exists-in-the-system")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CheckLink_07".toLowerCase()
            ) {
              dispatch(checkFileLink_fail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_CheckLink_08".toLowerCase()
            ) {
              dispatch(checkFileLink_fail(t("Something-went-wrong")));
            } else {
              dispatch(checkFileLink_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(checkFileLink_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(checkFileLink_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(checkFileLink_fail(t("Something-went-wrong")));
      });
  };
};

const requestAccess_init = () => {
  return {
    type: actions.REQUESTACCESS_INIT,
  };
};

const requestAccess_success = (message) => {
  return {
    type: actions.REQUESTACCESS_SUCCESS,
    message,
  };
};

const requestAccess_fail = (message) => {
  return {
    type: actions.REQUESTACCESS_FAIL,
    message,
  };
};

const requestAccessApi = (navigate, t, data, setRequestAccept) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(requestAccess_init());
    let form = new FormData();
    form.append("RequestMethod", requestAccessRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(requestAccessApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_RequestAccess_01".toLowerCase()
            ) {
              dispatch(requestAccess_success(t("Access-requested")));
              setRequestAccept(true);
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_RequestAccess_02".toLowerCase()
            ) {
              dispatch(requestAccess_fail(t("Failed-to-request-access")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_RequestAccess_03".toLowerCase()
            ) {
              dispatch(requestAccess_fail(t("Something-went-wrong")));
            } else {
              dispatch(requestAccess_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(requestAccess_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(requestAccess_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(requestAccess_fail(t("Something-went-wrong")));
      });
  };
};

const updateGeneralAccess_init = () => {
  return {
    type: actions.UPDATEGENERALACCESS_INIT,
  };
};
const updateGeneralAccess_success = (response, message) => {
  return {
    type: actions.UPDATEGENERALACCESS_SUCCESS,
    response,
    message,
  };
};
const updateGeneralAccess_fail = (message) => {
  return {
    type: actions.UPDATEGENERALACCESS_FAIL,
    message,
  };
};
const updateGeneralAccessApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(updateGeneralAccess_init());
    let form = new FormData();
    form.append("RequestMethod", updateGeneralAccessRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(requestAccessApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_UpdateGeneralAccess_01".toLowerCase()
            ) {
              dispatch(
                updateGeneralAccess_success(
                  response.data.responseResult,
                  t("General-access-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_UpdateGeneralAccess_02".toLowerCase()
            ) {
              dispatch(
                updateGeneralAccess_fail(t("Failed-to-update-general-access"))
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_UpdateGeneralAccess_03".toLowerCase()
            ) {
              dispatch(updateGeneralAccess_fail(t("Something-went-wrong")));
            } else {
              dispatch(updateGeneralAccess_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(updateGeneralAccess_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(updateGeneralAccess_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(updateGeneralAccess_fail(t("Something-went-wrong")));
      });
  };
};

const updateFolderGeneralAccess_init = () => {
  return {
    type: actions.UPDATEFOLDERGENERALACCESS_INIT,
  };
};
const updateFolderGeneralAccess_success = (response, message) => {
  return {
    type: actions.UPDATEFOLDERGENERALACCESS_SUCCESS,
    response,
    message,
  };
};

const updateFolderGeneralAccess_fail = (message) => {
  return {
    type: actions.UPDATEFOLDERGENERALACCESS_FAIL,
    message,
  };
};
const updateFolderGeneralAccessApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(updateFolderGeneralAccess_init());
    let form = new FormData();
    form.append("RequestMethod", updateFolderGeneralAccessRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateFolderGeneralAccessApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_UpdateFolderGeneralAccess_01".toLowerCase()
            ) {
              dispatch(
                updateFolderGeneralAccess_success(
                  response.data.responseResult,
                  t("General-access-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_UpdateFolderGeneralAccess_02".toLowerCase()
            ) {
              dispatch(
                updateFolderGeneralAccess_fail(
                  t("Failed-to-update-general-access")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "DataRoom_DataRoomManager_UpdateFolderGeneralAccess_03".toLowerCase()
            ) {
              dispatch(
                updateFolderGeneralAccess_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                updateFolderGeneralAccess_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(updateFolderGeneralAccess_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(updateFolderGeneralAccess_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(updateFolderGeneralAccess_fail(t("Something-went-wrong")));
      });
  };
};

const DownloadMessage = (payload) => {
  return {
    type: actions.DOWNLOAD_MESSAGE,
    payload,
  };
};
const DownloadFileForDataRoomStart = () => {
  return {
    type: actions.DATA_ROOM_FILE_DOWNLOAD,
  };
};

const DownloadFileForDataRoomEnded = () => {
  return {
    type: actions.DATA_ROOM_FILE_DOWNLOAD_LOADER_FALSED,
  };
};

const downloadFail = (response) => {
  return {
    type: actions.DATA_ROOM_FILE_DOWNLOAD_FAILED,
    response: response,
  };
};

// DownloadFile
const DataRoomDownloadFileApiFunc = (navigate, data, t, Name) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let form = new FormData();
  form.append("RequestMethod", dataRoomFileDownloadService.RequestMethod);
  form.append("RequestData", JSON.stringify(data));
  let ext = Name.split(".").pop();
  let contentType;
  if (ext === "doc") {
    contentType = "application/msword";
  } else if (ext === "docx") {
    contentType =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  } else if (ext === "xls") {
    contentType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (ext === "xlsx") {
    contentType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (ext === "pdf") {
    contentType = "application/pdf";
  } else if (ext === "png") {
    contentType = "image/png";
  } else if (ext === "txt") {
    contentType = "text/plain";
  } else if (ext === "jpg") {
    contentType = "image/jpeg";
  } else if (ext === "jpeg") {
    contentType = "image/jpeg";
  } else {
  }
  return (dispatch) => {
    dispatch(DownloadMessage(1));
    dispatch(DownloadFileForDataRoomStart());

    axiosInstance
    .post(DataRoomAllFilesDownloads, form, {
      headers: {
        "Content-Disposition": "attachment; filename=template." + ext,
        "Content-Type": contentType,
      },
      responseType: "arraybuffer",
    })
  
      .then(async (response) => {
        console.log(response, "responseresponseresponse");
        if (response.status === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DataRoomDownloadFileApiFunc(navigate, data, t, Name));
        } else if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", Name);
          document.body.appendChild(link);
          link.click();

          dispatch(DownloadFileForDataRoomEnded(false));
          dispatch(DownloadMessage(0));
        }
      })
      .catch((response) => {
        console.log(response, "responseresponseresponse");

        dispatch(DownloadMessage(0));

        dispatch(downloadFail(response));
      });
  };
};

// const DataRoomDownloadFileApiFunc = (navigate, data, t, Name) => {
//   let token = JSON.parse(localStorage.getItem("token"));

//
//   let form = new FormData();
//   form.append("RequestMethod", dataRoomFileDownloadService.RequestMethod);
//   form.append("RequestData", JSON.stringify(data));

//   return (dispatch) => {
//     dispatch(DownloadFileForDataRoomStart());

//     axios({
//       method: "post",
//       url: DataRoomAllFilesDownloads,
//       data: form,
//       headers: {
//         _token: token,
//         "Content-Disposition": `attachment; filename=${Name}`,
//         "Content-Type": "application/octet-stream", // Use a generic Content-Type
//       },
//       responseType: "arraybuffer",
//     })
//       .then(async (response) => {
//         if (response.data.responseCode === 417) {
//           await dispatch(RefreshToken(navigate, t));
//           dispatch(DataRoomDownloadFileApiFunc(navigate, data, t, Name));
//         } else if (response.status === 200) {
//           const url = window.URL.createObjectURL(new Blob([response.data]));
//           const link = document.createElement("a");
//           link.href = url;
//           link.setAttribute("download", Name);
//           document.body.appendChild(link);
//           link.click();
//
//           dispatch(DownloadFileForDataRoomEnded(false));
//         } else {
//           dispatch(downloadFail(response));
//         }
//       })
//       .catch((response) => {
//
//         dispatch(downloadFail(response));
//       });
//   };
// };

const DownloadFolderForDataRoomStart = () => {
  return {
    type: actions.DATA_ROOM_FOLDER_DOWNLOAD,
  };
};

const DownloadFolderForDataRoomEnded = () => {
  return {
    type: actions.DATA_ROOM_FOLDER_DOWNLOAD_LOADER_FALSE,
  };
};

const downloadFolderFail = (response) => {
  return {
    type: actions.DATA_ROOM_FOLDER_DOWNLOAD_FAILED,
    response: response,
  };
};

const DataRoomDownloadFolderApiFunc = (navigate, data, t, Name) => {
  let token = JSON.parse(localStorage.getItem("token"));

  let form = new FormData();
  form.append("RequestMethod", dataRoomFolderDownloadService.RequestMethod);
  form.append("RequestData", JSON.stringify(data));

  return (dispatch) => {
    dispatch(DownloadMessage(1));
    dispatch(DownloadFolderForDataRoomStart());
    axiosInstance
      .post(DataRoomAllFilesDownloads, form, {
        headers: {
          "Content-Disposition": `attachment; filename=${Name}.zip`,
          "Content-Type": "application/zip", // Set the content type to zip
        },
        responseType: "arraybuffer",
      })

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DataRoomDownloadFolderApiFunc(navigate, data, t, Name));
        } else if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${Name}.zip`);
          document.body.appendChild(link);
          link.click();

          dispatch(DownloadFolderForDataRoomEnded(false));
          dispatch(DownloadMessage(0));
        } else {
          dispatch(downloadFail(response));
        }
      })
      .catch((response) => {
        dispatch(downloadFolderFail(response));
        dispatch(DownloadMessage(0));
      });
  };
};

const showFileDetailsModal = (response) => {
  return {
    type: actions.FILE_DETAIL_MODAL,
    response: response,
  };
};

//Validate User For Data Room

const validateUserDataRoomInit = () => {
  return {
    type: actions.VALIDATE_EMPTY_STRING_DATAROOM_INIT,
  };
};

const validateUserDataRoomSuccess = (response, message) => {
  return {
    type: actions.VALIDATE_EMPTY_STRING_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

const validateUserDataRoomFailed = (message) => {
  return {
    type: actions.VALIDATE_EMPTY_STRING_DATAROOM_FAILED,
    message: message,
  };
};

const validateUserAvailibilityEncryptedStringDataRoomApi = (
  navigate,
  Data,
  t,
  setShareFileModal,
  setRequestFile
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(validateUserDataRoomInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      validateEncyptedStringUserDataRoom.RequestMethod
    );

    try {
      const response = await axiosInstance.post(dataRoomApi, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        await dispatch(
          validateUserAvailibilityEncryptedStringDataRoomApi(
            navigate,
            Data,
            t,
            setShareFileModal,
            setRequestFile
          )
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_ValidateEncryptedStringUserAvailabilityForDataRoom_01".toLowerCase()
              )
          ) {
            await dispatch(
              validateUserDataRoomSuccess(
                response.data.responseResult,
                t("No-restrictions")
              )
            );
            if (response.data.responseResult.isAccess) {
              if (response.data.responseResult.data.isFolder === true) {
                dispatch(
                  getFolderDocumentsApi(
                    navigate,
                    Number(response.data.responseResult.data.id),
                    t,
                    1
                  )
                );
              } else {
                let ext = response.data.responseResult.data.name
                  .split(".")
                  .pop();
                if (fileFormatforSignatureFlow.includes(ext)) {
                  const pdfData = {
                    taskId: response.data.responseResult.data.id,
                    commingFrom: 4,
                    fileName: response.data.responseResult.data.name,
                    attachmentID: response.data.responseResult.data.id,
                    isPermission: response.data.responseResult.permissionID,
                  };
                  window.open(
                    `/DisKus/documentViewer?pdfData=${encodeURIComponent(
                      JSON.stringify(pdfData)
                    )}`,
                    "_blank",
                    "noopener noreferrer"
                  );
                }
              }
            } else {
              setRequestFile(true);
            }
            localStorage.removeItem("DataRoomEmail");
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_ValidateEncryptedStringUserAvailabilityForDataRoom_02".toLowerCase()
              )
          ) {
            dispatch(
              validateUserDataRoomSuccess(
                response.data.responseResult,
                t(
                  "Only-allowed-to-my-organization-and-user-part-of-organization"
                )
              )
            );
            if (response.data.responseResult.isAccess) {
              if (response.data.responseResult.data.isFolder === true) {
                dispatch(
                  getFolderDocumentsApi(
                    navigate,
                    Number(response.data.responseResult.data.id),
                    t,
                    1
                  )
                );
              } else {
                let ext = response.data.responseResult.data.name
                  .split(".")
                  .pop();
                if (fileFormatforSignatureFlow.includes(ext)) {
                  const pdfData = {
                    taskId: response.data.responseResult.data.id,
                    commingFrom: 4,
                    fileName: response.data.responseResult.data.name,
                    attachmentID: response.data.responseResult.data.id,
                    isPermission: response.data.responseResult.permissionID,
                  };
                  window.open(
                    `/DisKus/documentViewer?pdfData=${encodeURIComponent(
                      JSON.stringify(pdfData)
                    )}`,
                    "_blank",
                    "noopener noreferrer"
                  );
                }
              }
            } else {
              setRequestFile(true);
            }
            localStorage.removeItem("DataRoomEmail");
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_ValidateEncryptedStringUserAvailabilityForDataRoom_03".toLowerCase()
              )
          ) {
            dispatch(
              validateUserDataRoomSuccess(
                response.data.responseResult,
                t(
                  "Only-allowed-to-my-organization-and-user-not-part-of-organization"
                )
              )
            );
            if (response.data.responseResult.isAccess) {
              localStorage.removeItem("DataRoomEmail");
              if (response.data.responseResult.data.isFolder === true) {
                dispatch(
                  getFolderDocumentsApi(
                    navigate,
                    Number(response.data.responseResult.data.id),
                    t,
                    1
                  )
                );
              } else {
                let ext = response.data.responseResult.data.name
                  .split(".")
                  .pop();
                if (fileFormatforSignatureFlow.includes(ext)) {
                  const pdfData = {
                    taskId: response.data.responseResult.data.id,
                    commingFrom: 4,
                    fileName: response.data.responseResult.data.name,
                    attachmentID: response.data.responseResult.data.id,
                    isPermission: response.data.responseResult.permissionID,
                  };
                  window.open(
                    `/DisKus/documentViewer?pdfData=${encodeURIComponent(
                      JSON.stringify(pdfData)
                    )}`,
                    "_blank",
                    "noopener noreferrer"
                  );
                }
              }
            } else {
              setRequestFile(true);
            }
            localStorage.removeItem("DataRoomEmail");
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_ValidateEncryptedStringUserAvailabilityForDataRoom_04".toLowerCase()
              )
          ) {
            dispatch(
              validateUserDataRoomSuccess(
                response.data.responseResult,
                t("File-restricted-but-this-user-has-assigned-rights")
              )
            );
            // setShareFileModal(true);
            if (response.data.responseResult.isAccess) {
              if (response.data.responseResult.data.isFolder === true) {
                dispatch(
                  getFolderDocumentsApi(
                    navigate,
                    Number(response.data.responseResult.data.id),
                    t,
                    1
                  )
                );
              } else {
                let ext = response?.data?.responseResult?.data?.name
                  .split(".")
                  .pop();
                if (fileFormatforSignatureFlow.includes(ext)) {
                  const pdfData = {
                    taskId: response.data.responseResult.data.id,
                    commingFrom: 4,
                    fileName: response.data.responseResult.data.name,
                    attachmentID: response.data.responseResult.data.id,
                    isPermission: response.data.responseResult.permissionID,
                  };
                  window.open(
                    `/DisKus/documentViewer?pdfData=${encodeURIComponent(
                      JSON.stringify(pdfData)
                    )}`,
                    "_blank",
                    "noopener noreferrer"
                  );
                }
              }
            } else {
              setRequestFile(true);
            }
            localStorage.removeItem("DataRoomEmail");
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_ValidateEncryptedStringUserAvailabilityForDataRoom_05".toLowerCase()
              )
          ) {
            dispatch(
              validateUserDataRoomSuccess(
                response.data.responseResult,
                t("File-restricted-request-is-to-ask-for-request-access")
              )
            );
            setRequestFile(true);
            localStorage.removeItem("DataRoomEmail");
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_ValidateEncryptedStringUserAvailabilityForDataRoom_06".toLowerCase()
              )
          ) {
            dispatch(
              validateUserDataRoomFailed(t("No-file-exists-in-the-system"))
            );
            localStorage.removeItem("DataRoomEmail");
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_ValidateEncryptedStringUserAvailabilityForDataRoom_07".toLowerCase()
              )
          ) {
            dispatch(validateUserDataRoomFailed(t("Link-expired")));
            localStorage.removeItem("DataRoomEmail");
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_ValidateEncryptedStringUserAvailabilityForDataRoom_08".toLowerCase()
              )
          ) {
            dispatch(validateUserDataRoomFailed(t("Something-went-wrong")));
            localStorage.removeItem("DataRoomEmail");
          } else {
            dispatch(validateUserDataRoomFailed(t("Something-went-wrong")));
            localStorage.removeItem("DataRoomEmail");
          }
        } else {
          dispatch(validateUserDataRoomFailed(t("Something-went-wrong")));
          localStorage.removeItem("DataRoomEmail");
        }
      } else {
        dispatch(validateUserDataRoomFailed(t("Something-went-wrong")));
        localStorage.removeItem("DataRoomEmail");
      }
    } catch (error) {
      console.log(error);
      dispatch(validateUserDataRoomFailed(t("Something-went-wrong")));
      localStorage.removeItem("DataRoomEmail");
    }
  };
};
// Delete file init
const deleteSharedFileDataroom_init = () => {
  return {
    type: actions.DELETE_SHARED_FILE_INIT,
  };
};

// Delete file success
const deleteSharedFileDataroom_success = (response, message) => {
  return {
    type: actions.DELETE_SHARED_FILE_SUCCESS,
    response: response,
    message: message,
  };
};

// Delete file fail
const deleteSharedFileDataroom_fail = (message) => {
  return {
    type: actions.DELETE_SHARED_FILE_FAIL,
    message: message,
  };
};

// Delete file API
const deleteSharedFileDataroom = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentView = localStorage.getItem("setTableView");
  let folderId = localStorage.getItem("folderID");
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");

  return (dispatch) => {
    dispatch(deleteSharedFileDataroom_init());
    let form = new FormData();
    form.append("RequestMethod", leaveFileSharingRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(deleteFileDataroom(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFileSharing_01".toLowerCase()
                )
            ) {
              if (Number(currentView) === 4) {
                let Data = {
                  UserID: Number(createrID),
                  OrganizationID: Number(OrganizationID),
                };
                dispatch(getRecentDocumentsApi(navigate, t, Data));
              } else {
                if (folderId !== null) {
                  dispatch(
                    getFolderDocumentsApi(navigate, Number(folderId), t)
                  );
                } else {
                  dispatch(
                    getDocumentsAndFolderApi(navigate, Number(currentView), t)
                  );
                }
              }
              dispatch(
                deleteSharedFileDataroom_success(
                  response.data.responseResult,
                  t("Remove-shared-file-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFileSharing_02".toLowerCase()
                )
            ) {
              dispatch(
                deleteSharedFileDataroom_fail(t("Failed-to-delete-any-file"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFileSharing_03".toLowerCase()
                )
            ) {
              dispatch(
                deleteSharedFileDataroom_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                deleteSharedFileDataroom_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(deleteSharedFileDataroom_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(deleteSharedFileDataroom_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(deleteSharedFileDataroom_fail(t("Something-went-wrong")));
      });
  };
};
// Delete file init
const deleteSharedFolderDataroom_init = () => {
  return {
    type: actions.DELETE_SHARED_FOLDER_INIT,
  };
};

// Delete file success
const deleteSharedFolderDataroom_success = (response, message) => {
  return {
    type: actions.DELETE_SHARED_FOLDER_SUCCESS,
    response: response,
    message: message,
  };
};

// Delete file fail
const deleteSharedFolderDataroom_fail = (message) => {
  return {
    type: actions.DELETE_SHARED_FOLDER_FAIL,
    message: message,
  };
};

// Delete file API
const deleteSharedFolderDataroom = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentView = localStorage.getItem("setTableView");
  let folderId = localStorage.getItem("folderID");
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");

  return (dispatch) => {
    dispatch(deleteSharedFolderDataroom_init());
    let form = new FormData();
    form.append("RequestMethod", leaveFolderSharingRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(deleteSharedFolderDataroom(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFolderSharing_01".toLowerCase()
                )
            ) {
              if (Number(currentView) === 4) {
                let Data = {
                  UserID: Number(createrID),
                  OrganizationID: Number(OrganizationID),
                };
                dispatch(getRecentDocumentsApi(navigate, t, Data));
              } else {
                if (folderId !== null) {
                  dispatch(
                    getFolderDocumentsApi(navigate, Number(folderId), t)
                  );
                } else {
                  dispatch(
                    getDocumentsAndFolderApi(navigate, Number(currentView), t)
                  );
                }
              }
              dispatch(
                deleteSharedFolderDataroom_success(
                  response.data.responseResult,
                  t("Remove-shared-folder-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFolderSharing_02".toLowerCase()
                )
            ) {
              dispatch(
                deleteSharedFolderDataroom_fail(t("Failed-to-delete-any-file"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_DeleteFolderSharing_03".toLowerCase()
                )
            ) {
              dispatch(
                deleteSharedFolderDataroom_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                deleteSharedFolderDataroom_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              deleteSharedFolderDataroom_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(deleteSharedFolderDataroom_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(deleteSharedFolderDataroom_fail(t("Something-went-wrong")));
      });
  };
};

const fileSharedMQTT = (response) => {
  return {
    type: actions.DATAROOM_FILE_SHARED_MQTT,
    response,
  };
};

const folderSharedMQTT = (response) => {
  return {
    type: actions.DATAROOM_FOLDER_SHARED_MQTT,
    response,
  };
};
const fileRemoveMQTT = (response) => {
  return {
    type: actions.DATAROOM_FILE_REMOVE_MQTT,
    response: response,
  };
};
const folderRemoveMQTT = (response) => {
  return {
    type: actions.DATAROOM_FOLDER_REMOVE_MQTT,
    response: response,
  };
};

//DataRoom FileSharing Permission
const DataRoomFileSharingPermissionInit = () => {
  return {
    type: actions.DATAROOM_FILE_SHARED_PERMISSION_INIT,
  };
};

const DataRoomFileSharingPermissionSuccess = (response, message) => {
  return {
    type: actions.DATAROOM_FILE_SHARED_PERMISSION_SUCCESS,
    response: response,
    message: message,
  };
};

const DataRoomFileSharingPermissionFailed = (message) => {
  return {
    type: actions.DATAROOM_FILE_SHARED_PERMISSION_FAILED,
    message: message,
  };
};

const DataRoomFileSharingPermissionAPI = (
  navigate,
  t,
  Data,
  FileID,
  FileName
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(DataRoomFileSharingPermissionInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      GetDataRoomFileSharedPersmission.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DataRoomFileSharingPermissionAPI(navigate, t, Data));
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetDataRoomSharedFilePermission_01".toLowerCase()
              )
          ) {
            dispatch(
              DataRoomFileSharingPermissionSuccess(
                response.data.responseResult,
                ""
              )
            );

            //Open File Viewer Open According to Permission ID
            const pdfData = {
              taskId: FileID,
              commingFrom: 4,
              fileName: FileName,
              attachmentID: FileID,
              isPermission: Number(response.data.responseResult.permissionID),
            };

            console.log(pdfData, "stringifypdfData");
            const pdfDataJson = JSON.stringify(pdfData);
            let ext = FileName.split(".").pop();
            openDocumentViewer(ext, pdfDataJson, dispatch, navigate, t, FileID);
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetDataRoomSharedFilePermission_02".toLowerCase()
              )
          ) {
            dispatch(DataRoomFileSharingPermissionFailed(""));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetDataRoomSharedFilePermission_03".toLowerCase()
              )
          ) {
            dispatch(
              DataRoomFileSharingPermissionFailed(t("Something-went-wrong"))
            );
          } else {
            dispatch(
              DataRoomFileSharingPermissionFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            DataRoomFileSharingPermissionFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((error) => {
        dispatch(
          DataRoomFileSharingPermissionFailed(t("Something-went-wrong"))
        );
      });
  };
};
export {
  folderRemoveMQTT,
  fileRemoveMQTT,
  fileSharedMQTT,
  folderSharedMQTT,
  deleteSharedFolderDataroom,
  deleteSharedFileDataroom,
  createFolderLink_fail,
  createFileLink_fail,
  checkFileLinkApi,
  requestAccessApi,
  updateGeneralAccessApi,
  updateFolderGeneralAccessApi,
  createFileLinkApi,
  createFolderLinkApi,
  getSharedFolderUsersApi,
  getSharedFileUsersApi,
  saveFilesApi,
  FileisExist,
  deleteFolder,
  getDocumentsAndFolderApi,
  deleteFileDataroom,
  clearDataResponseMessage,
  getFolderDocumentsApi,
  shareFoldersApi,
  shareFilesApi,
  createFolderApi,
  uploadDocumentsApi,
  FolderisExist,
  FolderisExistRename,
  FileisExist2,
  getDocumentsAndFolderApiScrollbehaviour,
  tableSpinner,
  dataBehaviour,
  getFolderDocumentsApiScrollBehaviour,
  isFolder,
  searchDocumentsAndFoldersApi,
  IsFileisExist,
  getRecentDocumentsApi,
  DataRoomDownloadFileApiFunc,
  DataRoomDownloadFolderApiFunc,
  showFileDetailsModal,
  validateUserAvailibilityEncryptedStringDataRoomApi,
  BreadCrumbsList,
  DataRoomFileSharingPermissionAPI,
};
