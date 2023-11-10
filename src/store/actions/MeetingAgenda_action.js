import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import {
  getAgendaVotingDetails,
  getAllVotingResultDisplay,
  saveAgendaVoting,
  getAgendaAndVotingInfo,
  casteVoteForAgenda,
  viewAgendaVotingResults,
  saveFilesRequestMethod,
  uploadDocumentsRequestMethod,
  getAdvanceMeetingAgendabyMeetingID,
  createUpdateMeetingDataRoomMap,
  addUpdateAdvanceMeetingAgenda,
} from "../../commen/apis/Api_config";
import { meetingApi, dataRoomApi } from "../../commen/apis/Api_ends_points";
import { showVoteAgendaModal } from "./NewMeetingActions";

const clearResponseMessage = (message) => {
  return {
    type: actions.CLEAR_RESPONSEMESSAGE_AGENDAMEETING,
    message: message,
  };
};

const getAgendaVotingDetails_init = () => {
  return {
    type: actions.GET_AGENDAVOTINGDETAILS_INIT,
  };
};
const getAgendaVotingDetails_success = (response, message) => {
  return {
    type: actions.GET_AGENDAVOTINGDETAILS_SUCCESS,
    response: response,
    message: message,
  };
};
const getAgendaVotingDetails_fail = (message) => {
  return {
    type: actions.GET_AGENDAVOTINGDETAILS_FAIL,
    message: message,
  };
};
const GetAgendaVotingDetails = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAgendaVotingDetails_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAgendaVotingDetails.RequestMethod);
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAgendaVotingDetails(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAgendaVotingDetails_01".toLowerCase()
                )
            ) {
              dispatch(
                getAgendaVotingDetails_success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAgendaVotingDetails_02".toLowerCase()
                )
            ) {
              dispatch(getAgendaVotingDetails_fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAgendaVotingDetails_03".toLowerCase()
                )
            ) {
              dispatch(getAgendaVotingDetails_fail(t("Something-went-wrong")));
            } else {
              dispatch(getAgendaVotingDetails_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getAgendaVotingDetails_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAgendaVotingDetails_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAgendaVotingDetails_fail(t("Something-went-wrong")));
      });
  };
};

const getAllVotingResultDisplay_init = () => {
  return {
    type: actions.GET_ALLVOTINGRESULTDISPLAY_INIT,
  };
};
const getAllVotingResultDisplay_success = (response, message) => {
  return {
    type: actions.GET_ALLVOTINGRESULTDISPLAY_SUCCESS,
    response: response,
    message: message,
  };
};
const getAllVotingResultDisplay_fail = (message) => {
  return {
    type: actions.GET_ALLVOTINGRESULTDISPLAY_FAIL,
    message: message,
  };
};
const GetAllVotingResultDisplay = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllVotingResultDisplay_init());
    let form = new FormData();
    form.append("RequestMethod", getAllVotingResultDisplay.RequestMethod);
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllVotingResultDisplay(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllVotingResultDisplay_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllVotingResultDisplay_success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllVotingResultDisplay_02".toLowerCase()
                )
            ) {
              dispatch(getAllVotingResultDisplay_fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllVotingResultDisplay_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllVotingResultDisplay_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAllVotingResultDisplay_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(getAllVotingResultDisplay_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAllVotingResultDisplay_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllVotingResultDisplay_fail(t("Something-went-wrong")));
      });
  };
};

const saveAgendaVoting_init = () => {
  return {
    type: actions.SAVE_AGENDA_VOTING_INIT,
  };
};
const saveAgendaVoting_success = (response, message) => {
  return {
    type: actions.SAVE_AGENDA_VOTING_SUCCESS,
    response: response,
    message: message,
  };
};
const saveAgendaVoting_fail = (message) => {
  return {
    type: actions.SAVE_AGENDA_VOTING_FAIL,
    message: message,
  };
};
const SaveAgendaVoting = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(saveAgendaVoting_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", saveAgendaVoting.RequestMethod);
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SaveAgendaVoting(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveAgendaVoting_01".toLowerCase()
                )
            ) {
              dispatch(
                saveAgendaVoting_success(
                  response.data.responseResult,
                  t("Record-saved")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveAgendaVoting_02".toLowerCase()
                )
            ) {
              dispatch(saveAgendaVoting_fail(t("No-records-saved")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveAgendaVoting_03".toLowerCase()
                )
            ) {
              dispatch(
                saveAgendaVoting_success(
                  response.data.responseResult,
                  t("Record-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveAgendaVoting_04".toLowerCase()
                )
            ) {
              dispatch(saveAgendaVoting_fail(t("Record-not-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveAgendaVoting_05".toLowerCase()
                )
            ) {
              dispatch(saveAgendaVoting_fail(t("Something-went-wrong")));
            } else {
              dispatch(saveAgendaVoting_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveAgendaVoting_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveAgendaVoting_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(saveAgendaVoting_fail(t("Something-went-wrong")));
      });
  };
};

const getAgendaAndVotingInfo_init = () => {
  return {
    type: actions.GET_AGENDAVOTINGINFO_INIT,
  };
};
const getAgendaAndVotingInfo_success = (response, message) => {
  return {
    type: actions.GET_AGENDAVOTINGINFO_SUCCESS,
    response: response,
    message: message,
  };
};
const getAgendaAndVotingInfo_fail = (message) => {
  return {
    type: actions.GET_AGENDAVOTINGINFO_FAIL,
    message: message,
  };
};
const GetAgendaAndVotingInfo = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAgendaAndVotingInfo_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAgendaAndVotingInfo.RequestMethod);
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAgendaAndVotingInfo(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAgendaAndVotingInfo_01".toLowerCase()
                )
            ) {
              dispatch(showVoteAgendaModal(true));

              dispatch(
                getAgendaAndVotingInfo_success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAgendaAndVotingInfo_02".toLowerCase()
                )
            ) {
              dispatch(getAgendaAndVotingInfo_fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAgendaAndVotingInfo_03".toLowerCase()
                )
            ) {
              dispatch(getAgendaAndVotingInfo_fail(t("Something-went-wrong")));
            } else {
              dispatch(getAgendaAndVotingInfo_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getAgendaAndVotingInfo_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAgendaAndVotingInfo_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAgendaAndVotingInfo_fail(t("Something-went-wrong")));
      });
  };
};

const casteVoteForAgenda_init = () => {
  return {
    type: actions.CASTEVOTEFORAGENDA_INIT,
  };
};
const casteVoteForAgenda_success = (response, message) => {
  return {
    type: actions.CASTEVOTEFORAGENDA_SUCCESS,
    response: response,
    message: message,
  };
};
const casteVoteForAgenda_fail = (message) => {
  return {
    type: actions.CASTEVOTEFORAGENDA_FAIL,
    message: message,
  };
};
const CasteVoteForAgenda = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(casteVoteForAgenda_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", casteVoteForAgenda.RequestMethod);
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SaveAgendaVoting(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_CasteVoteForAgenda_01".toLowerCase()
                )
            ) {
              dispatch(
                casteVoteForAgenda_success(
                  response.data.responseResult,
                  t("Record-saved")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_CasteVoteForAgenda_02".toLowerCase()
                )
            ) {
              dispatch(casteVoteForAgenda_fail(t("No-records-saved")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_CasteVoteForAgenda_03".toLowerCase()
                )
            ) {
              dispatch(casteVoteForAgenda_fail(t("Something-went-wrong")));
            } else {
              dispatch(casteVoteForAgenda_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(casteVoteForAgenda_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(casteVoteForAgenda_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(casteVoteForAgenda_fail(t("Something-went-wrong")));
      });
  };
};

const viewAgendaVotingResults_init = () => {
  return {
    type: actions.VIEW_AGENDAVOTINGRESULTS_INIT,
  };
};
const viewAgendaVotingResults_success = (response, message) => {
  return {
    type: actions.VIEW_AGENDAVOTINGRESULTS_SUCCESS,
    response: response,
    message: message,
  };
};
const viewAgendaVotingResults_fail = (message) => {
  return {
    type: actions.VIEW_AGENDAVOTINGRESULTS_FAIL,
    message: message,
  };
};
const ViewAgendaVotingResults = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(viewAgendaVotingResults_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", viewAgendaVotingResults.RequestMethod);
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(ViewAgendaVotingResults(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ViewAgendaVotingResults_01".toLowerCase()
                )
            ) {
              dispatch(
                viewAgendaVotingResults_success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ViewAgendaVotingResults_02".toLowerCase()
                )
            ) {
              dispatch(viewAgendaVotingResults_fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ViewAgendaVotingResults_03".toLowerCase()
                )
            ) {
              dispatch(viewAgendaVotingResults_fail(t("Something-went-wrong")));
            } else {
              dispatch(viewAgendaVotingResults_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(viewAgendaVotingResults_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(viewAgendaVotingResults_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(viewAgendaVotingResults_fail(t("Something-went-wrong")));
      });
  };
};

const getAdvanceMeetingAgendabyMeetingID_init = () => {
  return {
    type: actions.GET_ADVANCEMEETINGAGENDABYMEETINGID_INIT,
  };
};
const getAdvanceMeetingAgendabyMeetingID_success = (data, message) => {
  console.log(data, message, "getAdvanceMeetingAgendabyMeetingID_success");
  return {
    type: actions.GET_ADVANCEMEETINGAGENDABYMEETINGID_SUCCESS,
    response: data,
    message: message,
  };
};
const getAdvanceMeetingAgendabyMeetingID_fail = (message) => {
  return {
    type: actions.GET_ADVANCEMEETINGAGENDABYMEETINGID_FAIL,
    message: message,
  };
};
const GetAdvanceMeetingAgendabyMeetingID = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAdvanceMeetingAgendabyMeetingID_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      getAdvanceMeetingAgendabyMeetingID.RequestMethod
    );
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAdvanceMeetingAgendabyMeetingID(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAdvanceMeetingAgendabyMeetingID_01".toLowerCase()
                )
            ) {
              dispatch(
                getAdvanceMeetingAgendabyMeetingID_success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAdvanceMeetingAgendabyMeetingID_02".toLowerCase()
                )
            ) {
              dispatch(
                getAdvanceMeetingAgendabyMeetingID_fail(t("No-records-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAdvanceMeetingAgendabyMeetingID_03".toLowerCase()
                )
            ) {
              dispatch(
                getAdvanceMeetingAgendabyMeetingID_fail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                getAdvanceMeetingAgendabyMeetingID_fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              getAdvanceMeetingAgendabyMeetingID_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getAdvanceMeetingAgendabyMeetingID_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getAdvanceMeetingAgendabyMeetingID_fail(t("Something-went-wrong"))
        );
      });
  };
};

const createUpdateMeetingDataRoomMap_init = () => {
  return {
    type: actions.CREATEUPDATEMEETINGDATAROOMMAP_INIT,
  };
};

const createUpdateMeetingDataRoomMap_success = (response, message) => {
  return {
    type: actions.CREATEUPDATEMEETINGDATAROOMMAP_SUCCESS,
    response: response,
    message: message,
  };
};

const createUpdateMeetingDataRoomMap_fail = (message) => {
  return {
    type: actions.CREATEUPDATEMEETINGDATAROOMMAP_FAIL,
    message: message,
  };
};

// Folder ID
const CreateUpdateMeetingDataRoomMap = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(createUpdateMeetingDataRoomMap_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", createUpdateMeetingDataRoomMap.RequestMethod);
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(CreateUpdateMeetingDataRoomMap(navigate, t, data));
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_01".toLowerCase()
          ) {
            dispatch(
              createUpdateMeetingDataRoomMap_success(
                response.data.responseResult.folderID,
                t("Folder-mapped-with-data-room")
              )
            );
            localStorage.setItem("MeetingID", data.MeetingID);
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_02".toLowerCase()
          ) {
            dispatch(
              createUpdateMeetingDataRoomMap_fail(
                t("Failed-to-save-or-map-folder")
              )
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_03".toLowerCase()
          ) {
            dispatch(
              createUpdateMeetingDataRoomMap_success(
                response.data.responseResult.folderID,
                t("Update-successfullly")
              )
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_04".toLowerCase()
          ) {
            dispatch(
              createUpdateMeetingDataRoomMap_fail(t("Unable-to-update-folder"))
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_05".toLowerCase()
          ) {
            dispatch(
              createUpdateMeetingDataRoomMap_success(
                response.data.responseResult.folderID,
                t("New-mapped-created")
              )
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_06".toLowerCase()
          ) {
            dispatch(
              createUpdateMeetingDataRoomMap_fail(
                t("Failed-to-created-new-mapping")
              )
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_07".toLowerCase()
          ) {
            dispatch(
              createUpdateMeetingDataRoomMap_fail(t("Something-went-wrong"))
            );
          } else {
            dispatch(
              createUpdateMeetingDataRoomMap_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            createUpdateMeetingDataRoomMap_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          createUpdateMeetingDataRoomMap_fail(t("Something-went-wrong"))
        );
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
const UploadDocumentsAgendaApi = (navigate, t, data, folderID, newFolder) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return async (dispatch) => {
    dispatch(uploadDocument_init());
    let form = new FormData();
    form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
          dispatch(
            UploadDocumentsAgendaApi(navigate, t, data, folderID, newFolder)
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
              dispatch(
                uploadDocument_success(response.data.responseResult, "")
              );
              await dispatch(
                SaveFilesAgendaApi(
                  navigate,
                  t,
                  response.data.responseResult,
                  folderID,
                  newFolder
                )
              );
              // let newData = {
              //   DisplayAttachmentName: data.displayFileName,
              //   OriginalAttachmentName:
              //     response.data.responseResult.fileID.toString(),
              // };
              // newfile.push(newData);
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
        // }
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
const SaveFilesAgendaApi = (navigate, t, data, folderID, newFolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
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
    UserID: JSON.parse(createrID),
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
          await dispatch(RefreshToken(navigate, t));
          dispatch(SaveFilesAgendaApi(navigate, t, data, folderID, newFolder));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase()
                )
            ) {
              newFolder.push({
                pK_FileID: response.data.responseResult.fileID,
                displayAttachmentName: data.displayFileName,
              });
              await dispatch(
                saveFiles_success(response.data.responseResult, "")
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
      })
      .catch(() => {
        dispatch(saveFiles_fail(t("Something-went-wrong")));
      });
  };
};

const addUpdateAdvanceMeetingAgenda_init = () => {
  return {
    type: actions.SAVEUPDATE_ADVANCEMEETINGAGENDA_INIT,
  };
};
const addUpdateAdvanceMeetingAgenda_success = (response, message) => {
  return {
    type: actions.SAVEUPDATE_ADVANCEMEETINGAGENDA_SUCCESS,
    response: response,
    message: message,
  };
};
const addUpdateAdvanceMeetingAgenda_fail = (message) => {
  return {
    type: actions.SAVEUPDATE_ADVANCEMEETINGAGENDA_FAIL,
    message: message,
  };
};
const AddUpdateAdvanceMeetingAgenda = (Data, navigate, t, currentMeeting) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let getMeetingData = {
    MeetingID: currentMeeting,
  };
  return (dispatch) => {
    dispatch(addUpdateAdvanceMeetingAgenda_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", addUpdateAdvanceMeetingAgenda.RequestMethod);
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAgendaVotingDetails(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AddUpdateAdvanceMeetingAgenda_01".toLowerCase()
                )
            ) {
              dispatch(
                addUpdateAdvanceMeetingAgenda_success(
                  response.data.responseResult,
                  t("Record-saved")
                )
              );
              await dispatch(
                GetAdvanceMeetingAgendabyMeetingID(getMeetingData, navigate, t)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AddUpdateAdvanceMeetingAgenda_02".toLowerCase()
                )
            ) {
              dispatch(
                addUpdateAdvanceMeetingAgenda_fail(t("No-records-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AddUpdateAdvanceMeetingAgenda_03".toLowerCase()
                )
            ) {
              dispatch(
                addUpdateAdvanceMeetingAgenda_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                addUpdateAdvanceMeetingAgenda_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              addUpdateAdvanceMeetingAgenda_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            addUpdateAdvanceMeetingAgenda_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(addUpdateAdvanceMeetingAgenda_fail(t("Something-went-wrong")));
      });
  };
};

export {
  GetAgendaVotingDetails,
  GetAllVotingResultDisplay,
  SaveAgendaVoting,
  clearResponseMessage,
  GetAgendaAndVotingInfo,
  CasteVoteForAgenda,
  ViewAgendaVotingResults,
  GetAdvanceMeetingAgendabyMeetingID,
  CreateUpdateMeetingDataRoomMap,
  SaveFilesAgendaApi,
  UploadDocumentsAgendaApi,
  AddUpdateAdvanceMeetingAgenda,
};
