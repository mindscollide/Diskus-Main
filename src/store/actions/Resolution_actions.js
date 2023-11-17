import axios from "axios";
import {
  updateResolutionDataRoomMapRM,
  saveResolutionDocumentsRM,
  getAllVotingRequestMethod,
  cancelResolutionRequestMethod,
  updateVoteRequestMethod,
  closeResolutionRequestMethod,
  getAllVotingStatusRequestMethod,
  getVoteDetailsByID,
  getResolutionResultsDetails,
  getResolutionsRequestMethod,
  scheduleResolutionRequestMethod,
  getResolutionByIDRequestMethod,
  addUpdateResolutionRequestMethod,
  getVoterResolutionRequestMethod,
  uploadDocumentsRequestMethod,
  saveFilesRequestMethod,
} from "../../commen/apis/Api_config";
import {
  dataRoomApi,
  getResolutionApi,
} from "../../commen/apis/Api_ends_points";
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

// Save Files API for Resolution
const saveFilesResolutionApi = (navigate, t, data, folderID, newFolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  let Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: [
      {
        DisplayFileName: data.displayFileName,
        DiskusFileNameString: data.diskusFileName,
        ShareAbleLink: data.shareAbleLink,
        FK_UserID: JSON.parse(creatorID),
        FK_OrganizationID: JSON.parse(organizationID),
        fileSizeOnDisk: Number(data.fileSizeOnDisk),
        FileSize: Number(data.fileSize),
      },
    ],
    UserID: JSON.parse(creatorID),
    Type: 0,
  };
  return async (dispatch) => {
    dispatch(saveFiles_init());
    let form = new FormData();
    form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
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
            saveFilesResolutionApi(navigate, t, data, folderID, newFolder)
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
              let newData = {
                DisplayAttachmentName: data.displayFileName,
                OriginalAttachmentName:
                  response.data.responseResult.fileID.toString(),
              };
              newFolder.push(newData);
              await dispatch(
                saveFiles_success(newData, t("Files-saved-successfully"))
              );
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

// Upload Documents API for Resolution
const uploadDocumentsResolutionApi = (
  navigate,
  t,
  data,
  folderID,
  newFolder
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return async (dispatch) => {
    dispatch(uploadDocument_init());
    let form = new FormData();
    form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
    form.append("File", data);
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(uploadDocumentsResolutionApi(navigate, t, data, folderID));
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
                saveFilesResolutionApi(
                  navigate,
                  t,
                  response.data.responseResult,
                  folderID,
                  newFolder
                )
              );
              await dispatch(
                uploadDocument_success(
                  response.data.responseResult,
                  t("Document-uploaded-successfully")
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

const updateResolutionDataRoom_init = () => {
  return {
    type: actions.UPDATERESOLUTIONDATAROOMMAP_INIT,
  };
};

const updateResolutionDataRoom_success = (response, message) => {
  return {
    type: actions.UPDATERESOLUTIONDATAROOMMAP_SUCCESS,
    response: response,
    message: message,
  };
};

const updateResolutionDataRoom_fail = (message) => {
  return {
    type: actions.UPDATERESOLUTIONDATAROOMMAP_FAIL,
    message: message,
  };
};

const updateResolutionDataRoomApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(updateResolutionDataRoom_init());
    let form = new FormData();
    form.append("RequestMethod", updateResolutionDataRoomMapRM.RequestMethod);
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
          dispatch(updateResolutionDataRoomApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UpdateResolutionDataRoomMap_01".toLowerCase()
                )
            ) {
              localStorage.setItem("resolutionID", Data.ResolutionID);
              dispatch(
                updateResolutionDataRoom_success(
                  response.data.responseResult.folderID,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UpdateResolutionDataRoomMap_02".toLowerCase()
                )
            ) {
              dispatch(
                updateResolutionDataRoom_fail(t("Failed-to-save-or-map-folder"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UpdateResolutionDataRoomMap_03".toLowerCase()
                )
            ) {
              localStorage.setItem("resolutionID", Data.ResolutionID);

              dispatch(
                updateResolutionDataRoom_success(
                  response.data.responseResult.folderID,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UpdateResolutionDataRoomMap_04".toLowerCase()
                )
            ) {
              dispatch(
                updateResolutionDataRoom_fail(t("Unable-to-update-folder"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UpdateResolutionDataRoomMap_05".toLowerCase()
                )
            ) {
              dispatch(
                updateResolutionDataRoom_success(
                  response.data.responseResult.folderID,
                  t("New-mapping-created")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UpdateResolutionDataRoomMap_06".toLowerCase()
                )
            ) {
              dispatch(
                updateResolutionDataRoom_fail(t("Failed-to-create-new-mapping"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UpdateResolutionDataRoomMap_07".toLowerCase()
                )
            ) {
              dispatch(
                updateResolutionDataRoom_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                updateResolutionDataRoom_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(updateResolutionDataRoom_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(updateResolutionDataRoom_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(updateResolutionDataRoom_fail(t("Something-went-wrong")));
      });
  };
};

const saveResolutionDocuments_init = () => {
  return {
    type: actions.SAVERESOLUTIONDOCUMENTS_INIT,
  };
};

const saveResolutionDocuments_success = (response, message) => {
  return {
    type: actions.SAVERESOLUTIONDOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

const saveResolutionDocuments_fail = (message) => {
  return {
    type: actions.SAVERESOLUTIONDOCUMENTS_FAIL,
    message: message,
  };
};

const saveResolutionDocumentsApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentView = localStorage.getItem("ButtonTab");
  let resolutionView = localStorage.getItem("resolutionView");
  return (dispatch) => {
    dispatch(saveResolutionDocuments_init());
    let form = new FormData();
    form.append("RequestMethod", saveResolutionDocumentsRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
          dispatch(updateResolutionDataRoomApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveResolutionDocuments_01".toLowerCase()
                )
            ) {
              dispatch(
                saveResolutionDocuments_success(
                  response.data.responseResult,
                  t("Update-successful")
                )
              );
              dispatch(updateResolutionDataRoom_fail(""));
              dispatch(saveFiles_fail(""));

              localStorage.removeItem("resolutionID");
              dispatch(createResolutionModal(false));
              dispatch(updateResolutionModal(false));
              if (Number(resolutionView) === 1) {
                dispatch(getResolutions(navigate, Number(currentView), t));
              } else {
                dispatch(getVoterResolution(navigate, Number(currentView), t));
              }
              // updateResolutionDataRoom_fail
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveResolutionDocuments_02".toLowerCase()
                )
            ) {
              dispatch(saveResolutionDocuments_fail(t("Something-went-wrong")));
              dispatch(updateResolutionDataRoom_fail(""));
              dispatch(saveFiles_fail(""));

              localStorage.removeItem("resolutionID");
              dispatch(createResolutionModal(false));
              dispatch(updateResolutionModal(false));
              if (Number(resolutionView) === 1) {
                dispatch(getResolutions(navigate, Number(currentView), t));
              } else {
                dispatch(getVoterResolution(navigate, Number(currentView), t));
              }
            } else {
              dispatch(saveResolutionDocuments_fail(t("Something-went-wrong")));
              dispatch(updateResolutionDataRoom_fail(""));
              dispatch(saveFiles_fail(""));

              localStorage.removeItem("resolutionID");
              dispatch(createResolutionModal(false));
              dispatch(updateResolutionModal(false));
              if (Number(resolutionView) === 1) {
                dispatch(getResolutions(navigate, Number(currentView), t));
              } else {
                dispatch(getVoterResolution(navigate, Number(currentView), t));
              }
            }
          } else {
            dispatch(saveResolutionDocuments_fail(t("Something-went-wrong")));
            dispatch(updateResolutionDataRoom_fail(""));
            dispatch(saveFiles_fail(""));

            localStorage.removeItem("resolutionID");
            dispatch(createResolutionModal(false));
            dispatch(updateResolutionModal(false));
            if (Number(resolutionView) === 1) {
              dispatch(getResolutions(navigate, Number(currentView), t));
            } else {
              dispatch(getVoterResolution(navigate, Number(currentView), t));
            }
          }
        } else {
          dispatch(saveResolutionDocuments_fail(t("Something-went-wrong")));
          dispatch(updateResolutionDataRoom_fail(""));
          dispatch(saveFiles_fail(""));
          localStorage.removeItem("resolutionID");
          dispatch(createResolutionModal(false));
          dispatch(updateResolutionModal(false));

          if (Number(resolutionView) === 1) {
            dispatch(getResolutions(navigate, Number(currentView), t));
          } else {
            dispatch(getVoterResolution(navigate, Number(currentView), t));
          }
        }
      })
      .catch(() => {
        dispatch(saveResolutionDocuments_fail(t("Something-went-wrong")));
        dispatch(updateResolutionDataRoom_fail(""));
        localStorage.removeItem("resolutionID");
        dispatch(saveFiles_fail(""));

        dispatch(createResolutionModal(false));
        dispatch(updateResolutionModal(false));
        if (Number(resolutionView) === 1) {
          dispatch(getResolutions(navigate, Number(currentView), t));
        } else {
          dispatch(getVoterResolution(navigate, Number(currentView), t));
        }
      });
  };
};

const getAllVoting_Init = () => {
  return {
    type: actions.GET_ALL_VOTING_METHOD_INIT,
  };
};

const getAllVoting_Success = (response, message) => {
  console.log(response, message, "actionaction");
  return {
    type: actions.GET_ALL_VOTING_METHOD_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllVoting_Fail = (message) => {
  return {
    type: actions.GET_ALL_VOTING_METHOD_FAIL,
    message: message,
  };
};

// Get All Voting Methods Api
const getAllVotingMethods = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllVoting_Init());
    let form = new FormData();
    form.append("RequestMethod", getAllVotingRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllVotingMethods(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetAllVotingMethod_01".toLowerCase()
            ) {
              dispatch(
                getAllVoting_Success(
                  response.data.responseResult.resolutionMethod,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetAllVotingMethod_02".toLowerCase()
            ) {
              dispatch(getAllVoting_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetAllVotingMethod_03".toLowerCase()
            ) {
              dispatch(getAllVoting_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getAllVoting_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAllVoting_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllVoting_Fail(t("Something-went-wrong")));
      });
  };
};

const getAllResolutionStatus_Init = () => {
  return {
    type: actions.GET_ALL_RESOLUTION_STATUS_INIT,
  };
};

const getAllResolutionStatus_Success = (response, message) => {
  console.log(response, message, "actionaction111");
  return {
    type: actions.GET_ALL_RESOLUTION_STATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllResolutionStatus_Fail = (message) => {
  return {
    type: actions.GET_ALL_RESOLUTION_STATUS_FAIL,
    message: message,
  };
};

// Get All Resolution Status Api
const getAllResolutionStatus = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllResolutionStatus_Init());
    let form = new FormData();
    form.append("RequestMethod", getAllVotingStatusRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllResolutionStatus(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetAllResolutionStatus_01".toLowerCase()
            ) {
              dispatch(
                getAllResolutionStatus_Success(
                  response.data.responseResult.resolutionStatus,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetAllResolutionStatus_02".toLowerCase()
            ) {
              dispatch(getAllResolutionStatus_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetAllResolutionStatus_03".toLowerCase()
            ) {
              dispatch(getAllResolutionStatus_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getAllResolutionStatus_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAllResolutionStatus_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllResolutionStatus_Fail(t("Something-went-wrong")));
      });
  };
};

const getResolutions_Init = () => {
  return {
    type: actions.GET_RESOLUTIONS_INIT,
  };
};
const getResolutions_Success = (response, message) => {
  return {
    type: actions.GET_RESOLUTIONS_SUCCESS,
    response: response,
    message: message,
  };
};

const getResolutions_Fail = (message) => {
  return {
    type: actions.GET_RESOLUTIONS_FAIL,
    message: message,
  };
};

// Get Resolutions
const getResolutions = (
  navigate,
  id,
  t,
  title,
  circulationDate,
  votingDateLine
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = JSON.parse(localStorage.getItem("userID"));
  let moderatorPage = JSON.parse(localStorage.getItem("moderatorPage"));
  let moderatorRows = JSON.parse(localStorage.getItem("moderatorRows"));

  let Data = {
    FK_UID: userID,
    ResolutionStatus: JSON.parse(id),
    Title: title !== null && title !== undefined ? title : "",
    PageNumber: moderatorPage !== null ? moderatorPage : 1,
    Length: moderatorRows !== null ? moderatorRows : 50,
    CirculationDate:
      circulationDate !== null && circulationDate !== undefined
        ? circulationDate
        : "",
    VotingDeadlineDate:
      votingDateLine !== null && votingDateLine !== undefined
        ? votingDateLine
        : "",
  };
  return (dispatch) => {
    dispatch(getResolutions_Init());
    let form = new FormData();
    form.append("RequestMethod", getResolutionsRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getResolutions(navigate, id, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_SearchResolutions_01".toLowerCase()
            ) {
              dispatch(
                getResolutions_Success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_SearchResolutions_02".toLowerCase()
            ) {
              dispatch(
                getResolutions_Success(
                  response.data.responseResult.resolutionTable,
                  t("No-data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_SearchResolutions_03".toLowerCase()
            ) {
              dispatch(getResolutions_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getResolutions_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getResolutions_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getResolutions_Fail(t("Something-went-wrong")));
      });
  };
};
const createResolution_Init = () => {
  return {
    type: actions.SCHEDULE_RESOLUTION_INIT,
  };
};

const createResolution_Success = (response, message) => {
  return {
    type: actions.SCHEDULE_RESOLUTION_SUCCESS,
    response: response,
  };
};

const createResolution_Fail = (message) => {
  return {
    type: actions.SCHEDULE_RESOLUTION_FAIL,
    message: message,
  };
};

// Create Resolution Api
const createResolution = (navigate, Data, voters, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(createResolution_Init());
    let form = new FormData();
    form.append("RequestMethod", scheduleResolutionRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(createResolution(navigate, Data, voters, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_ScheduleResolution_01".toLowerCase()
            ) {
              // await dispatch(
              //   createResolution_Success(
              //     response.data.responseResult.resolutionID
              //   )
              // );
              let newArr = [];
              await voters.map((data, index) => newArr.push(data.FK_UID));
              let NewData = {
                ResolutionID: Number(response.data.responseResult.resolutionID),
                ResolutionTitle: Data.ResolutionModel.Title,
                IsUpdateFlow: false,
                VotersList: newArr,
              };

              await dispatch(updateResolutionDataRoomApi(navigate, t, NewData));
              // dispatch(
              //   updateResolution(
              //     navigate,
              //     response.data.responseResult.resolutionID,
              //     voters,
              //     nonVoter,
              //     tasksAttachments,
              //     t,
              //     no,
              //     circulated
              //   )
              // );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_ScheduleResolution_02".toLowerCase()
            ) {
              dispatch(createResolution_Fail(t("Failed-to-create-resolution")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_ScheduleResolution_03".toLowerCase()
            ) {
              dispatch(createResolution_Fail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_ScheduleResolution_04".toLowerCase()
            ) {
              dispatch(createResolution_Fail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_ScheduleResolution_05".toLowerCase()
            ) {
              let newArr = [];
              await voters.map((data, index) => newArr.push(data.FK_UID));
              let NewData = {
                ResolutionID: Number(response.data.responseResult.resolutionID),
                ResolutionTitle: Data.ResolutionModel.Title,
                IsUpdateFlow: true,
                VotersList: newArr,
              };

              await dispatch(updateResolutionDataRoomApi(navigate, t, NewData));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_ScheduleResolution_06".toLowerCase()
            ) {
              dispatch(createResolution_Fail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_ScheduleResolution_07".toLowerCase()
            ) {
              dispatch(
                createResolution_Fail(
                  t("Circulationdatetime-cannot-be-less-than-current-date")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_ScheduleResolution_08".toLowerCase()
            ) {
              dispatch(
                createResolution_Fail(
                  t("Deadlinedatetime-cannot-be-less-than-current-date")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_ScheduleResolution_09".toLowerCase()
            ) {
              dispatch(
                createResolution_Fail(
                  t(
                    "Decisionannouncementdatetime-cannot-be-less-than-current-date"
                  )
                )
              );
            } else {
              dispatch(createResolution_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(createResolution_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(createResolution_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(createResolution_Fail(t("Something-went-wrong")));
      });
  };
};

const updateResolution_Init = () => {
  return {
    type: actions.ADD_UPDATE_DETAILS_RESOLUTION_INIT,
  };
};
const updateResolution_Success = (message) => {
  return {
    type: actions.ADD_UPDATE_DETAILS_RESOLUTION_SUCCESS,
    message: message,
  };
};
const updateResolution_Fail = (message) => {
  return {
    type: actions.ADD_UPDATE_DETAILS_RESOLUTION_FAIL,
    message: message,
  };
};

// Update Resolution Api
const updateResolution = (
  navigate,
  resolutionID,
  voters,
  nonVoter,
  tasksAttachments,
  t,
  circulated
) => {
  let Data2 = {
    IsCirculate: circulated === 2 ? true : false,
    FK_ResolutionID: JSON.parse(resolutionID),
    Voters: voters,
    NonVoters: nonVoter,
    Attachments: tasksAttachments,
  };
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(updateResolution_Init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      addUpdateResolutionRequestMethod.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data2));
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            updateResolution(
              navigate,
              resolutionID,
              voters,
              nonVoter,
              tasksAttachments,
              t,
              circulated
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_01".toLowerCase()
            ) {
              dispatch(
                updateResolution_Success(
                  t("Resolution-circulated-successfully")
                )
              );
              let newArr = [];
              if (tasksAttachments.length > 0) {
                tasksAttachments.forEach((data, index) => {
                  newArr.push({
                    PK_FileID: Number(data.OriginalAttachmentName),
                  });
                });
              }
              let Data = {
                ResolutionID: Data2.FK_ResolutionID,
                UpdateFileList: newArr,
              };
              dispatch(saveResolutionDocumentsApi(navigate, t, Data));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_02".toLowerCase()
            ) {
              dispatch(
                updateResolution_Fail(t("Failed-to-update-resolution-status"))
              );
              dispatch(updateResolutionDataRoom_fail(""));
              dispatch(saveFiles_fail(""));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_03".toLowerCase()
            ) {
              console.log("check");
              dispatch(
                updateResolution_Success(
                  t("Resolution-details-updated-successfully")
                )
              );
              let newArr = [];
              if (tasksAttachments.length > 0) {
                tasksAttachments.forEach((data, index) => {
                  newArr.push({
                    PK_FileID: Number(data.OriginalAttachmentName),
                  });
                });
              }
              let Data = {
                ResolutionID: Data2.FK_ResolutionID,
                UpdateFileList: newArr,
              };
              dispatch(saveResolutionDocumentsApi(navigate, t, Data));
              // dispatch(createResolutionModal(false));
              // dispatch(updateResolutionModal(false));
              // if (Number(resolutionView) === 1) {
              //   dispatch(getResolutions(navigate, Number(currentView), t));
              // } else {
              //   dispatch(getVoterResolution(navigate, Number(currentView), t));
              // }
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_04".toLowerCase()
            ) {
              dispatch(
                updateResolution_Fail(t("Please-add-at-least-one-voter"))
              );
              dispatch(updateResolutionDataRoom_fail(""));
              dispatch(saveFiles_fail(""));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_05".toLowerCase()
            ) {
              dispatch(updateResolution_Fail(t("Something-went-wrong")));
              dispatch(updateResolutionDataRoom_fail(""));
              dispatch(saveFiles_fail(""));

              localStorage.removeItem("resolutionID");
            }
          } else {
            dispatch(updateResolution_Fail(t("Something-went-wrong")));
            dispatch(updateResolutionDataRoom_fail(""));
            dispatch(saveFiles_fail(""));

            localStorage.removeItem("resolutionID");
          }
        } else {
          dispatch(updateResolution_Fail(t("Something-went-wrong")));
          dispatch(updateResolutionDataRoom_fail(""));
          dispatch(saveFiles_fail(""));

          localStorage.removeItem("resolutionID");
        }
      })
      .catch((response) => {
        dispatch(updateResolution_Fail(t("Something-went-wrong")));
        dispatch(updateResolutionDataRoom_fail(""));
        dispatch(saveFiles_fail(""));
      });
  };
};
const getResolutionById_Init = () => {
  return {
    type: actions.GET_RESOLUTION_BY_RESOLUTION_ID_INIT,
  };
};
const getResolutionById_Success = (response, message) => {
  return {
    type: actions.GET_RESOLUTION_BY_RESOLUTION_ID_SUCCESS,
    response: response,
    message: message,
  };
};
const getResolutionById_Fail = (message) => {
  return {
    type: actions.GET_RESOLUTION_BY_RESOLUTION_ID_FAIL,
    message: message,
  };
};
// Get Resolution by Resolution ID Api
const getResolutionbyResolutionID = (navigate, id, t, no) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    ResolutionID: JSON.parse(id),
  };

  return (dispatch) => {
    dispatch(getResolutionById_Init());
    let form = new FormData();
    form.append("RequestMethod", getResolutionByIDRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getResolutionbyResolutionID(navigate, id, t, no));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetResolutionByID_01".toLowerCase()
            ) {
              dispatch(
                getResolutionById_Success(
                  response.data.responseResult.resolution,
                  t("Data-available")
                )
              );
              if (no === 1) {
                dispatch(updateResolutionModal(true));
                dispatch(viewResolutionModal(false));
              } else {
                dispatch(viewResolutionModal(true));
                dispatch(updateResolutionModal(false));
              }
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetResolutionByID_02".toLowerCase()
            ) {
              dispatch(getResolutionById_Fail(t("Unable-to-fetch-data")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetResolutionByID_03".toLowerCase()
            ) {
              dispatch(getResolutionById_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getResolutionById_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getResolutionById_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getResolutionById_Fail(t("Something-went-wrong")));
      });
  };
};
const getResolutionResult_Init = () => {
  return {
    type: actions.GET_RESOLUTION_RESULTS_DETAILS_INIT,
  };
};
const getResolutionResult_Success = (response, message) => {
  return {
    type: actions.GET_RESOLUTION_RESULTS_DETAILS_SUCCESS,
    response: response,
    message: message,
  };
};
const getResolutionResult_Fail = (message) => {
  return {
    type: actions.GET_RESOLUTION_RESULTS_DETAILS_FAIL,
    message: message,
  };
};
// Get Resolution Result Api
const getResolutionResult = (navigate, id, t, setResultresolution) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = JSON.parse(localStorage.getItem("userID"));
  let Data = {
    ResolutionID: JSON.parse(id),
    UserID: userID,
  };
  return (dispatch) => {
    dispatch(getResolutionResult_Init());
    let form = new FormData();
    form.append("RequestMethod", getResolutionResultsDetails.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getResolutionResult(navigate, id, t, setResultresolution));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetResultDetails_01".toLowerCase()
            ) {
              dispatch(
                getResolutionResult_Success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
              setResultresolution(true);
              localStorage.setItem("ResolutionID", id);
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetResultDetails_02".toLowerCase()
            ) {
              dispatch(getResolutionResult_Fail(t("No-record-added")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetResultDetails_03".toLowerCase()
            ) {
              dispatch(getResolutionResult_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getResolutionResult_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getResolutionResult_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getResolutionResult_Fail(t("Something-went-wrong")));
      });
  };
};
const getVotesDetail_Init = () => {
  return {
    type: actions.GET_VOTESDETAILSBYID_INIT,
  };
};
const getVotesDetail_Success = (response, message) => {
  return {
    type: actions.GET_VOTESDETAILSBYID_SUCCESS,
    response: response,
    message: message,
  };
};
const getVotesDetail_Fail = (message) => {
  return {
    type: actions.GET_VOTESDETAILSBYID_FAIL,
    message: message,
  };
};
// Get Voting Details
const getVotesDetails = (navigate, id, t, setVoteresolution) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = JSON.parse(localStorage.getItem("userID"));
  let Data = {
    ResolutionID: JSON.parse(id),
    UserID: userID,
  };
  return (dispatch) => {
    dispatch(getVotesDetail_Init());
    let form = new FormData();
    form.append("RequestMethod", getVoteDetailsByID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getVotesDetails(navigate, id, t, setVoteresolution));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetVoteDetailsByID_01".toLowerCase()
            ) {
              dispatch(
                getVotesDetail_Success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
              setVoteresolution(true);
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetVoteDetailsByID_02".toLowerCase()
            ) {
              dispatch(getVotesDetail_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_GetVoteDetailsByID_03".toLowerCase()
            ) {
              dispatch(getVotesDetail_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getVotesDetail_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getVotesDetail_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getVotesDetail_Fail(t("Something-went-wrong")));
      });
  };
};
const cancelResolution_Init = () => {
  return {
    type: actions.CANCEL_RESOLUTION_INIT,
  };
};
const cancelResolution_Success = (response, message) => {
  return {
    type: actions.CANCEL_RESOLUTION_SUCCESS,
    response: response,
    message: message,
  };
};
const cancelResolution_Fail = (message) => {
  return {
    type: actions.CANCEL_RESOLUTION_FAIL,
    message: message,
  };
};
// Cancel Resolution Api
const cancelResolutionApi = (
  navigate,
  id,
  t,
  setCancelresolution,
  setCancelModal
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = JSON.parse(localStorage.getItem("userID"));
  let resolutionView = localStorage.getItem("resolutionView");
  let currentView = localStorage.getItem("ButtonTab");
  let Data = {
    ResolutionID: JSON.parse(id),
    UserID: userID,
  };
  return (dispatch) => {
    dispatch(cancelResolution_Init());
    let form = new FormData();
    form.append("RequestMethod", cancelResolutionRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(cancelResolutionApi(navigate, id, t, setCancelresolution));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_CancelResolution_01".toLowerCase()
            ) {
              dispatch(
                cancelResolution_Success(
                  response.data.responseResult,
                  t("Resolution-cancelled")
                )
              );
              await setCancelresolution(false);
              setCancelModal(false);
              dispatch(updateResolutionModal(false));
              if (Number(resolutionView) === 1) {
                dispatch(getResolutions(navigate, Number(currentView), t));
              } else {
                dispatch(getVoterResolution(navigate, Number(currentView), t));
              }
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_CancelResolution_02".toLowerCase()
            ) {
              dispatch(cancelResolution_Fail(t("Failed-to-cancel-resolution")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_CancelResolution_03".toLowerCase()
            ) {
              dispatch(cancelResolution_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(cancelResolution_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(cancelResolution_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(cancelResolution_Fail(t("Something-went-wrong")));
      });
  };
};
const closeResolution_Init = () => {
  return {
    type: actions.CLOSE_RESOLUTION_INIT,
  };
};
const closeResolution_Success = (response, message) => {
  return {
    type: actions.CLOSE_RESOLUTION_SUCCESS,
    response: response,
    message: message,
  };
};
const closeResolution_Fail = (message) => {
  return {
    type: actions.CLOSE_RESOLUTION_FAIL,
    message: message,
  };
};

// Close Reolution Api
const closeResolutionApi = (
  navigate,
  ResolutionID,
  ResolutionDecisionID,
  notes,
  t,
  setResultresolution
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let resolutionView = localStorage.getItem("resolutionView");
  let currentView = localStorage.getItem("ButtonTab");
  let Data = {
    ResolutionID: JSON.parse(ResolutionID),
    ResolutionDecision: JSON.parse(ResolutionDecisionID),
    Notes: notes,
  };
  return (dispatch) => {
    dispatch(closeResolution_Init());
    let form = new FormData();
    form.append("RequestMethod", closeResolutionRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            closeResolutionApi(
              navigate,
              ResolutionID,
              ResolutionDecisionID,
              notes,
              t,
              setResultresolution
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_CloseResolution_01".toLowerCase()
            ) {
              dispatch(
                closeResolution_Success(
                  response.data.responseResult,
                  t("Resolution-closed-successfully")
                )
              );
              if (Number(resolutionView) === 1) {
                dispatch(getResolutions(navigate, Number(currentView), t));
              } else {
                dispatch(getVoterResolution(navigate, Number(currentView), t));
              }
              setResultresolution(false);
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_CloseResolution_02".toLowerCase()
            ) {
              dispatch(closeResolution_Fail(t("Failed-to-close-resolution")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_CloseResolution_03".toLowerCase()
            ) {
              dispatch(closeResolution_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(closeResolution_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(closeResolution_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(closeResolution_Fail(t("Something-went-wrong")));
      });
  };
};
const updateVote_Init = () => {
  return {
    type: actions.CLOSE_RESOLUTION_INIT,
  };
};
const updateVote_Success = (response, message) => {
  return {
    type: actions.CLOSE_RESOLUTION_SUCCESS,
    response: response,
    message: message,
  };
};
const updateVote_Fail = (message) => {
  return {
    type: actions.CLOSE_RESOLUTION_FAIL,
    message: message,
  };
};
// Update Vote Api
const updateVoteApi = (navigate, Data, t, setVoteresolution) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let resolutionView = localStorage.getItem("resolutionView");
  let currentView = localStorage.getItem("ButtonTab");
  return (dispatch) => {
    dispatch(updateVote_Init());
    let form = new FormData();
    form.append("RequestMethod", updateVoteRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateVoteApi(navigate, Data, t, setVoteresolution));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_UpdateVote_01".toLowerCase()
            ) {
              dispatch(
                updateVote_Success(
                  response.data.responseResult,
                  t("Record-updated-successfully")
                )
              );
              setVoteresolution(false);
              localStorage.removeItem("voterID");
              if (Number(resolutionView) === 1) {
                dispatch(getResolutions(navigate, Number(currentView), t));
              } else {
                dispatch(getVoterResolution(navigate, Number(currentView), t));
              }
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_UpdateVote_02".toLowerCase()
            ) {
              dispatch(updateVote_Fail(t("No-record-updated")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_UpdateVote_03".toLowerCase()
            ) {
              dispatch(updateVote_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(updateVote_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(updateVote_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(updateVote_Fail(t("Something-went-wrong")));
      });
  };
};
const getVoterResolution_init = () => {
  return {
    type: actions.SEARCH_VOTERRESOLUTION_INIT,
  };
};
const getVoterResolution_success = (response, message) => {
  return {
    type: actions.SEARCH_VOTERRESOLUTION_SUCCESS,
    response: response,
    message: message,
  };
};
const getVoterResolution_fail = (message) => {
  return {
    type: actions.SEARCH_VOTERRESOLUTION_FAIL,
    message: message,
  };
};
// Get Voter Resolution Api
const getVoterResolution = (
  navigate,
  id,
  t,
  title,
  circulationDate,
  votingDateLine
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = JSON.parse(localStorage.getItem("userID"));
  let voterPage = JSON.parse(localStorage.getItem("voterPage"));
  let voterRows = JSON.parse(localStorage.getItem("voterRows"));
  let Data = {
    FK_UID: userID,
    ResolutionStatus: JSON.parse(id),
    Title: title !== null && title !== undefined ? title : "",
    CirculationDate:
      circulationDate !== null && circulationDate !== undefined
        ? circulationDate
        : "",
    VotingDeadlineDate:
      votingDateLine !== null && votingDateLine !== undefined
        ? votingDateLine
        : "",
    PageNumber: voterPage !== null ? voterPage : 1,
    Length: voterRows !== null ? voterRows : 50,
  };

  return (dispatch) => {
    dispatch(getVoterResolution_init());
    let form = new FormData();
    form.append("RequestMethod", getVoterResolutionRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getResolutionApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getVoterResolution(navigate, id, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_SearchVoterResolutions_01".toLowerCase()
            ) {
              dispatch(
                getVoterResolution_success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_SearchVoterResolutions_02".toLowerCase()
            ) {
              dispatch(getVoterResolution_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Resolution_ResolutionServiceManager_SearchVoterResolutions_03".toLowerCase()
            ) {
              dispatch(getVoterResolution_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getVoterResolution_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getVoterResolution_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getVoterResolution_fail(t("Something-went-wrong")));
      });
  };
};
const currentResolutionView = (response) => {
  return {
    type: actions.CURRENTRESOLUTIONSTATE,
    response: response,
  };
};
const currentClosedView = (response) => {
  return {
    type: actions.RESOLUTIONCLOSEDORNOTCLOSED,
    response: response,
  };
};
const clearResponseMessage = () => {
  return {
    type: actions.CLEAR_RESPONSEMESSAGE_RESOLUTION,
  };
};

const createResolutionModal = (value) => {
  return {
    type: actions.CREATE_RESOLUTION_MODAL,
    payload: value,
  };
};

const updateResolutionModal = (value) => {
  return {
    type: actions.UPDATE_RESOLUTION_MODAL,
    payload: value,
  };
};

const viewResolutionModal = (value) => {
  return {
    type: actions.VIEW_RESOLUTION_MODAL,
    payload: value,
  };
};

const resolutionMQTTCreate = (response) => {
  return {
    type: actions.NEW_RESOLUTION_CREATED_MQTT,
    response: response,
  };
};

const resolutionMQTTCancelled = (response) => {
  return {
    type: actions.CANCELLED_RESOLUTION_MQTT,
    response: response,
  };
};

const resolutionMQTTClosed = (response) => {
  return {
    type: actions.CLOSED_RESOLUTION_MQTT,
    response: response,
  };
};

export {
  viewResolutionModal,
  saveFilesResolutionApi,
  uploadDocumentsResolutionApi,
  updateResolutionModal,
  createResolutionModal,
  getAllVotingMethods,
  currentResolutionView,
  currentClosedView,
  getAllResolutionStatus,
  getVoterResolution,
  clearResponseMessage,
  cancelResolutionApi,
  closeResolutionApi,
  getResolutions,
  updateVoteApi,
  updateResolution,
  getVotesDetails,
  createResolution,
  getResolutionResult,
  getResolutionbyResolutionID,
  resolutionMQTTCreate,
  resolutionMQTTClosed,
  resolutionMQTTCancelled,
};
