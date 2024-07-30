import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import { UpdateOrganizersMeeting } from "./MeetingOrganizers_action";
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
  agendaVotingStatusUpdate,
  saveMeetingDocuments,
  getAllMeetingForAgendaImport,
  getAgendaWithMeetingIDForImport,
  getMeetingParticipantsInfo,
  sendAgendaPDFAsEmail,
  exportAgendaAsPDF,
  printMeetingAgenda,
} from "../../commen/apis/Api_config";
import {
  meetingApi,
  dataRoomApi,
  DataRoomAllFilesDownloads,
} from "../../commen/apis/Api_ends_points";
import {
  GetAllAgendaWiseMinutesApiFunc,
  GetAllUserAgendaRightsApiFunc,
  showVoteAgendaModal,
  meetingDetailsGlobalFlag,
  organizersGlobalFlag,
  agendaContributorsGlobalFlag,
  participantsGlobalFlag,
  agendaGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  actionsGlobalFlag,
  pollsGlobalFlag,
  attendanceGlobalFlag,
  uploadGlobalFlag,
} from "./NewMeetingActions";

const clearAgendaReducerState = () => {
  return {
    type: actions.CLEAR_MEETING_AGENDA_REDUCER,
  };
};
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
                getAgendaVotingDetails_success(response.data.responseResult, "")
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
                  ""
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
const SaveAgendaVoting = (Data, navigate, t, currentMeeting) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let getAgendaData = {
    MeetingID: currentMeeting,
  };
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
                  t("Voting-saved")
                )
              );
              dispatch(
                GetAdvanceMeetingAgendabyMeetingID(getAgendaData, navigate, t)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveAgendaVoting_02".toLowerCase()
                )
            ) {
              dispatch(saveAgendaVoting_fail(t("No-voting-saved")));
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
                  t("Voting-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveAgendaVoting_04".toLowerCase()
                )
            ) {
              dispatch(saveAgendaVoting_fail(t("Voting-not-updated")));
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
              // dispatch(showVoteAgendaModal(true));

              dispatch(
                getAgendaAndVotingInfo_success(response.data.responseResult, "")
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
                  t("Vote-casted-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_CasteVoteForAgenda_02".toLowerCase()
                )
            ) {
              dispatch(
                casteVoteForAgenda_fail(t("Vote-not-casted-successfully"))
              );
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
                  ""
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
const GetAdvanceMeetingAgendabyMeetingID = (
  Data,
  navigate,
  t,
  id,
  flag,
  currentMeeting
) => {
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
          dispatch(
            GetAdvanceMeetingAgendabyMeetingID(
              Data,
              navigate,
              t,
              id,
              flag,
              currentMeeting
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAdvanceMeetingAgendabyMeetingID_01".toLowerCase()
                )
            ) {
              if (flag) {
                if (flag === 1) {
                  let NewData = {
                    AgendaID: id,
                  };
                  dispatch(GetAllUserAgendaRightsApiFunc(navigate, t, NewData));
                } else {
                }
                dispatch(
                  getAdvanceMeetingAgendabyMeetingID_success(
                    response.data.responseResult,
                    ""
                  )
                );
              } else {
                dispatch(
                  getAdvanceMeetingAgendabyMeetingID_success(
                    response.data.responseResult,
                    ""
                  )
                );
              }
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
                ""
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
                ""
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
                ""
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
    type: actions.UPLOAD_DOCUMENTS_AGENDA_INIT,
  };
};

// Upload Documents Success
const uploadDocument_success = (response, message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_AGENDA_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const uploadDocument_fail = (message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_AGENDA_FAIL,
    message: message,
  };
};

// // Upload Documents API
// const UploadDocumentsAgendaApi = (
//   navigate,
//   t,
//   data,
//   folderID,
//   newFolder,
//   newfile
// ) => {
//   let token = JSON.parse(localStorage.getItem("token"));
//   let creatorID = localStorage.getItem("userID");
//   let organizationID = localStorage.getItem("organizationID");
//   return async (dispatch) => {
//     dispatch(uploadDocument_init());
//     let form = new FormData();
//     form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
//     form.append("RequestData", JSON.stringify(data));
//     form.append("File", data);
//     await axios({
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
//           dispatch(
//             UploadDocumentsAgendaApi(
//               navigate,
//               t,
//               data,
//               folderID,
//               newFolder,
//               newfile
//             )
//           );
//         } else if (response.data.responseCode === 200) {
//           if (response.data.responseResult.isExecuted === true) {
//             if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "DataRoom_DataRoomServiceManager_UploadDocuments_01".toLowerCase()
//                 )
//             ) {
//               return {
//                 success: true,
//                 dummyData: {
//                   DisplayFileName: response.data.responseResult.displayFileName,
//                   DiskusFileNameString:
//                     response.data.responseResult.diskusFileName,
//                   ShareAbleLink: response.data.responseResult.shareAbleLink,
//                   FK_UserID: JSON.parse(creatorID),
//                   FK_OrganizationID: JSON.parse(organizationID),
//                   FileSize: Number(response.data.responseResult.fileSizeOnDisk),
//                   fileSizeOnDisk: Number(response.data.responseResult.fileSize),
//                 },
//               };
//               // let dummyData = {
//               //   DisplayFileName: response.data.responseResult.displayFileName,
//               //   DiskusFileNameString:
//               //     response.data.responseResult.diskusFileName,
//               //   ShareAbleLink: response.data.responseResult.shareAbleLink,
//               //   FK_UserID: JSON.parse(creatorID),
//               //   FK_OrganizationID: JSON.parse(organizationID),
//               //   FileSize: Number(response.data.responseResult.fileSizeOnDisk),
//               //   fileSizeOnDisk: Number(response.data.responseResult.fileSize),
//               // };
//               // await newfile.push(dummyData);
//               // console.log("newfilenewfile", newfile);
//               // dispatch(
//               //   uploadDocument_success(response.data.responseResult, "")
//               // );
//               // await dispatch(
//               //   SaveFilesAgendaApi(
//               //     navigate,
//               //     t,
//               //     response.data.responseResult,
//               //     folderID,
//               //     newFolder
//               //   )
//               // );
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase()
//                 )
//             ) {
//               dispatch(uploadDocument_fail(t("Failed-to-update-document")));
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
//                 )
//             ) {
//               // dispatch(uploadDocument_fail(t("Something-went-wrong")));
//             }
//           } else {
//             dispatch(uploadDocument_fail(t("Something-went-wrong")));
//           }
//         } else {
//           dispatch(uploadDocument_fail(t("Something-went-wrong")));
//         }
//         // }
//       })
//       .catch((error) => {
//         dispatch(uploadDocument_fail(t("Something-went-wrong")));
//       });
//   };
// };

const UploadDocumentsAgendaApi = (
  navigate,
  t,
  data,
  folderID,
  newFolder,
  newfile
) => {
  return async (dispatch) => {
    dispatch(uploadDocument_init()); // Dispatch action to indicate upload initialization

    try {
      let token = JSON.parse(localStorage.getItem("token"));
      let creatorID = localStorage.getItem("userID");
      let organizationID = localStorage.getItem("organizationID");

      let form = new FormData();
      form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
      form.append("RequestData", JSON.stringify(data));
      form.append("File", data);

      const response = await axios({
        method: "post",
        url: dataRoomApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        // Token expired, refresh token
        await dispatch(RefreshToken(navigate, t));
        // Retry the upload
        return dispatch(
          UploadDocumentsAgendaApi(
            navigate,
            t,
            data,
            folderID,
            newFolder,
            newfile
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
            // Successful upload
            newfile.push({
              DisplayFileName: response.data.responseResult.displayFileName,
              DiskusFileNameString: response.data.responseResult.diskusFileName,
              ShareAbleLink: response.data.responseResult.shareAbleLink,
              FK_UserID: JSON.parse(creatorID),
              FK_OrganizationID: JSON.parse(organizationID),
              FileSize: Number(response.data.responseResult.fileSizeOnDisk),
              fileSizeOnDisk: Number(response.data.responseResult.fileSize),
            });
            // const dummyData = {
            //   DisplayFileName: response.data.responseResult.displayFileName,
            //   DiskusFileNameString: response.data.responseResult.diskusFileName,
            //   ShareAbleLink: response.data.responseResult.shareAbleLink,
            //   FK_UserID: JSON.parse(creatorID),
            //   FK_OrganizationID: JSON.parse(organizationID),
            //   FileSize: Number(response.data.responseResult.fileSizeOnDisk),
            //   fileSizeOnDisk: Number(response.data.responseResult.fileSize),
            // };
            // Dispatch success action
            // dispatch(uploadDocumentSuccess(dummyData)); // You need to create this action creator
            // return { success: true, dummyData };
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase()
              )
          ) {
            // Failed to update document
            dispatch(uploadDocument_fail(t("Failed-to-update-document")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
              )
          ) {
            // Handle other errors
            // dispatch(uploadDocumentFail(t("Something-went-wrong")));
          }
        } else {
          // Something went wrong
          dispatch(uploadDocument_fail(t("Something-went-wrong")));
        }
      } else {
        // Something went wrong
        dispatch(uploadDocument_fail(t("Something-went-wrong")));
      }
    } catch (error) {
      // Error occurred
      dispatch(uploadDocument_fail(t("Something-went-wrong")));
    }
  };
};

// Save Files Init
const saveFiles_init = () => {
  return {
    type: actions.SAVEFILES_AGENDA_INIT,
  };
};
// Save Files Success
const saveFiles_success = (response, message) => {
  return {
    type: actions.SAVEFILES_AGENDA_SUCCESS,
    response: response,
    message: message,
  };
};
// Save Files Fail
const saveFiles_fail = (message) => {
  return {
    type: actions.SAVEFILES_AGENDA_FAIL,
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
    Files: data,
    // Files: [
    //   {
    //     DisplayFileName: data.displayFileName,
    //     DiskusFileNameString: data.diskusFileName,
    //     ShareAbleLink: data.shareAbleLink,
    //     FK_UserID: JSON.parse(createrID),
    //     FK_OrganizationID: JSON.parse(OrganizationID),
    //     FileSizeOnDisk: Number(data.fileSizeOnDisk),
    //     FileSize: Number(data.fileSize),
    //   },
    // ],
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
              let fileIds = response.data.responseResult.fileID;
              console.log(fileIds, "newFileID");
              fileIds.forEach((newFileID, index) => {
                console.log(newFileID, "newFileID");
                return newFolder.push({
                  pK_FileID: newFileID.pK_FileID,
                  displayAttachmentName: newFileID.displayFileName,
                });
              });
              // newFolder.push({
              //   pK_FileID: response.data.responseResult.fileID,
              //   displayAttachmentName: data.displayFileName,
              // });
              // await dispatch(
              //   saveFiles_success(response.data.responseResult, "")
              // );
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

// Upload Documents Init
const saveMeetingDocuments_init = () => {
  return {
    type: actions.SAVE_DOCUMENTS_AGENDA_INIT,
  };
};

// Upload Documents Success
const saveMeetingDocuments_success = (response, message) => {
  return {
    type: actions.SAVE_DOCUMENTS_AGENDA_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const saveMeetingDocuments_fail = (message) => {
  return {
    type: actions.SAVE_DOCUMENTS_AGENDA_FAIL,
    message: message,
  };
};

// Upload Documents API
const SaveMeetingDocuments = (data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(saveMeetingDocuments_init());
    let form = new FormData();
    form.append("RequestMethod", saveMeetingDocuments.RequestMethod);
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
          dispatch(SaveMeetingDocuments(data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveMeetingDocuments_01".toLowerCase()
                )
            ) {
              dispatch(
                saveMeetingDocuments_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveMeetingDocuments_02".toLowerCase()
                )
            ) {
              dispatch(saveMeetingDocuments_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveMeetingDocuments_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveMeetingDocuments_fail(t("Something-went-wrong")));
        }
        // }
      })
      .catch((error) => {
        dispatch(saveMeetingDocuments_fail(t("Something-went-wrong")));
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
const AddUpdateAdvanceMeetingAgenda = (
  Data,
  navigate,
  t,
  currentMeeting,
  flag,
  publishMeetingData,
  setEdiorRole,
  setAdvanceMeetingModalID,
  setDataroomMapFolderId,
  setSceduleMeeting,
  setPublishState,
  setCalendarViewModal,
  setMeetingMaterial,
  setAgenda
) => {
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
          dispatch(
            AddUpdateAdvanceMeetingAgenda(
              Data,
              navigate,
              t,
              currentMeeting,
              flag,
              publishMeetingData,
              setEdiorRole,
              setAdvanceMeetingModalID,
              setDataroomMapFolderId,
              setSceduleMeeting,
              setPublishState,
              setCalendarViewModal,
              setMeetingMaterial,
              setAgenda
            )
          );
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
              const saveDocumentsData = Data;
              const agendaList = response.data.responseResult.agendaIds;

              // Function to replace IDs in the saveDocumentsData
              function replaceIDs(documents) {
                documents.forEach((doc) => {
                  const mainMatch = agendaList.find(
                    (item) => item.frontendid === doc.ID
                  );
                  if (mainMatch) {
                    doc.ID = mainMatch.databaseID;
                  }
                  doc.SubAgenda.forEach((subAgenda) => {
                    const subMatch = agendaList.find(
                      (item) => item.frontendid === subAgenda.SubAgendaID
                    );
                    if (subMatch) {
                      subAgenda.SubAgendaID = subMatch.databaseID;
                    }
                  });
                });
              }

              // Replace IDs in the main AgendaList
              replaceIDs(saveDocumentsData.AgendaList);

              const newUpdateFileList = {
                MeetingID: saveDocumentsData.MeetingID,
                UpdateFileList: [],
              };

              saveDocumentsData.AgendaList.forEach((agendas) => {
                const agendaID = agendas.ID;
                const subAgendaID =
                  agendas.SubAgenda.length > 0
                    ? agendas.SubAgenda[0].SubAgendaID
                    : null;

                const agendaFiles = agendas.Files.map((file) => {
                  return { PK_FileID: parseInt(file.OriginalAttachmentName) };
                });

                const subAgendaFiles =
                  agendas.SubAgenda.length > 0
                    ? agendas.SubAgenda[0].Subfiles.map((file) => {
                        return {
                          PK_FileID: parseInt(file.OriginalAttachmentName),
                        };
                      })
                    : [];

                if (agendaFiles.length > 0) {
                  newUpdateFileList.UpdateFileList.push({
                    AgendaID: agendaID,
                    FileIds: agendaFiles,
                  });
                }

                if (subAgendaID && subAgendaFiles.length > 0) {
                  newUpdateFileList.UpdateFileList.push({
                    AgendaID: subAgendaID,
                    FileIds: subAgendaFiles,
                  });
                }
              });

              console.log(
                "saveDocumentsData newUpdateFileList ",
                newUpdateFileList
              );
              await dispatch(
                SaveMeetingDocuments(newUpdateFileList, navigate, t)
              );
              if (flag === 1) {
                await dispatch(
                  GetAdvanceMeetingAgendabyMeetingID(
                    getMeetingData,
                    navigate,
                    t
                  )
                );
                setMeetingMaterial(true);
                setAgenda(false);
                dispatch(meetingDetailsGlobalFlag(false));
                dispatch(organizersGlobalFlag(false));
                dispatch(agendaContributorsGlobalFlag(false));
                dispatch(participantsGlobalFlag(false));
                dispatch(agendaGlobalFlag(false));
                dispatch(meetingMaterialGlobalFlag(true));
                dispatch(minutesGlobalFlag(false));
                dispatch(proposedMeetingDatesGlobalFlag(false));
                dispatch(actionsGlobalFlag(false));
                dispatch(pollsGlobalFlag(false));
                dispatch(attendanceGlobalFlag(false));
                dispatch(uploadGlobalFlag(false));
              } else if (flag === 2) {
                dispatch(
                  UpdateOrganizersMeeting(
                    navigate,
                    t,
                    5,
                    publishMeetingData,
                    setEdiorRole,
                    setAdvanceMeetingModalID,
                    setDataroomMapFolderId,
                    setSceduleMeeting,
                    setPublishState,
                    setCalendarViewModal
                  )
                );
                setSceduleMeeting(false);
                setMeetingMaterial(false);
                setAgenda(false);
                dispatch(meetingDetailsGlobalFlag(false));
                dispatch(organizersGlobalFlag(false));
                dispatch(agendaContributorsGlobalFlag(false));
                dispatch(participantsGlobalFlag(false));
                dispatch(agendaGlobalFlag(false));
                dispatch(meetingMaterialGlobalFlag(false));
                dispatch(minutesGlobalFlag(false));
                dispatch(proposedMeetingDatesGlobalFlag(false));
                dispatch(actionsGlobalFlag(false));
                dispatch(pollsGlobalFlag(false));
                dispatch(attendanceGlobalFlag(false));
                dispatch(uploadGlobalFlag(false));
              }
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

const agendaVotingStatusUpdate_init = () => {
  return {
    type: actions.START_END_AGENDAVOTING_INIT,
  };
};
const agendaVotingStatusUpdate_success = (message) => {
  return {
    type: actions.START_END_AGENDAVOTING_SUCCESS,
    message: message,
  };
};
const agendaVotingStatusUpdate_fail = (message) => {
  return {
    type: actions.START_END_AGENDAVOTING_FAIL,
    message: message,
  };
};
const AgendaVotingStatusUpdate = (Data, navigate, t, advanceMeetingModalID) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(agendaVotingStatusUpdate_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", agendaVotingStatusUpdate.RequestMethod);
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
          dispatch(
            AgendaVotingStatusUpdate(Data, navigate, t, advanceMeetingModalID)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AgendaVotingStatusUpdate_01".toLowerCase()
                )
            ) {
              dispatch(agendaVotingStatusUpdate_success(t("Voting-started")));
              let DataGet = {
                MeetingID: Number(advanceMeetingModalID),
              };
              dispatch(
                GetAdvanceMeetingAgendabyMeetingID(DataGet, navigate, t)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AgendaVotingStatusUpdate_02".toLowerCase()
                )
            ) {
              dispatch(agendaVotingStatusUpdate_fail(t("Voting-not-started")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AgendaVotingStatusUpdate_03".toLowerCase()
                )
            ) {
              dispatch(
                agendaVotingStatusUpdate_fail(
                  t("The-voting-cant-be-started-until-the-meeting-starts")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AgendaVotingStatusUpdate_05".toLowerCase()
                )
            ) {
              dispatch(
                agendaVotingStatusUpdate_fail(
                  t("Voting-has-already-been-started")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AgendaVotingStatusUpdate_06".toLowerCase()
                )
            ) {
              dispatch(
                agendaVotingStatusUpdate_fail(t("Voting-has-not-been-started"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AgendaVotingStatusUpdate_04".toLowerCase()
                )
            ) {
              dispatch(
                agendaVotingStatusUpdate_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                agendaVotingStatusUpdate_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(agendaVotingStatusUpdate_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(agendaVotingStatusUpdate_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(agendaVotingStatusUpdate_fail(t("Something-went-wrong")));
      });
  };
};

const GetCurrentAgendaDetails = (response) => {
  return {
    type: actions.GET_CURRENT_AGENDA_DETAILS,
    response: response,
  };
};

const setLoaderFalse = () => {
  return {
    type: actions.SET_LOADER_FALSE_AGENDA,
  };
};

const previousTabAgenda = (response) => {
  return {
    type: actions.PREVIOUS_TAB_AGENDA,
    response: response,
  };
};

const nextTabAgenda = (response) => {
  return {
    type: actions.NEXT_TAB_AGENDA,
    response: response,
  };
};

const getAllMeetingForAgendaImport_init = () => {
  return {
    type: actions.GET_ALLMEETINGFORAGENDAIMPORT_INIT,
  };
};
const getAllMeetingForAgendaImport_success = (response, message) => {
  return {
    type: actions.GET_ALLMEETINGFORAGENDAIMPORT_SUCCESS,
    response: response,
    message: message,
  };
};
const getAllMeetingForAgendaImport_fail = (message) => {
  return {
    type: actions.GET_ALLMEETINGFORAGENDAIMPORT_FAIL,
    message: message,
  };
};
const GetAllMeetingForAgendaImport = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllMeetingForAgendaImport_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllMeetingForAgendaImport.RequestMethod);
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
          dispatch(GetAllMeetingForAgendaImport(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingForAgendaImport_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllMeetingForAgendaImport_success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingForAgendaImport_02".toLowerCase()
                )
            ) {
              dispatch(
                getAllMeetingForAgendaImport_fail(t("No-records-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingForAgendaImport_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllMeetingForAgendaImport_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAllMeetingForAgendaImport_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getAllMeetingForAgendaImport_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getAllMeetingForAgendaImport_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(getAllMeetingForAgendaImport_fail(t("Something-went-wrong")));
      });
  };
};

const getAgendaWithMeetingIDForImport_init = () => {
  return {
    type: actions.GET_AGENDAWITHMEETINGIDFORIMPORT_INIT,
  };
};
const getAgendaWithMeetingIDForImport_success = (response, message) => {
  return {
    type: actions.GET_AGENDAWITHMEETINGIDFORIMPORT_SUCCESS,
    response: response,
    message: message,
  };
};
const getAgendaWithMeetingIDForImport_fail = (message) => {
  return {
    type: actions.GET_AGENDAWITHMEETINGIDFORIMPORT_FAIL,
    message: message,
  };
};
const GetAgendaWithMeetingIDForImport = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAgendaWithMeetingIDForImport_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAgendaWithMeetingIDForImport.RequestMethod);
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
          dispatch(GetAgendaWithMeetingIDForImport(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAgendaWithMeetingIDForImport_01".toLowerCase()
                )
            ) {
              dispatch(
                getAgendaWithMeetingIDForImport_success(
                  response.data.responseResult,
                  t("Agendas-imported-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAgendaWithMeetingIDForImport_02".toLowerCase()
                )
            ) {
              dispatch(
                getAgendaWithMeetingIDForImport_fail(t("No-agendas-exist"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAgendaWithMeetingIDForImport_03".toLowerCase()
                )
            ) {
              dispatch(
                getAgendaWithMeetingIDForImport_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAgendaWithMeetingIDForImport_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getAgendaWithMeetingIDForImport_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getAgendaWithMeetingIDForImport_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getAgendaWithMeetingIDForImport_fail(t("Something-went-wrong"))
        );
      });
  };
};

const meetingAgendaStartedMQTT = (response) => {
  return {
    type: actions.MQTT_MEETING_AGENDA_VOTING_STARTED,
    response: response,
  };
};

const meetingAgendaEndedMQTT = (response) => {
  return {
    type: actions.MQTT_MEETING_AGENDA_VOTING_ENDED,
    response: response,
  };
};

const meetingAgendaUpdatedMQTT = (response) => {
  return {
    type: actions.MQTT_MEETING_AGENDA_UPDATED,
    response: response,
  };
};

const printAgenda = (response) => {
  return {
    type: actions.PRINT_AGENDA,
    response: response,
  };
};

const exportAgenda = (response) => {
  return {
    type: actions.EXPORT_AGENDA,
    response: response,
  };
};

const agendaViewFlag = (response) => {
  return {
    type: actions.AGENDA_VIEW_FLAG,
    response: response,
  };
};

const getMeetingParticipantsAgenda_init = () => {
  return {
    type: actions.GET_GETMEETINGPARTICIPANTSAGENDA_INIT,
  };
};

const getMeetingParticipantsAgenda_success = (response, message) => {
  return {
    type: actions.GET_GETMEETINGPARTICIPANTSAGENDA_SUCCESS,
    response: response,
    message: message,
  };
};

const getMeetingParticipantsAgenda_fail = (message) => {
  return {
    type: actions.GET_GETMEETINGPARTICIPANTSAGENDA_FAIL,
    message: message,
  };
};

const GetMeetingParticipantsAgenda = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMeetingParticipantsAgenda_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getMeetingParticipantsInfo.RequestMethod);
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
          dispatch(GetMeetingParticipantsAgenda(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingParticipantsInfo_01".toLowerCase()
                )
            ) {
              dispatch(
                getMeetingParticipantsAgenda_success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingParticipantsInfo_02".toLowerCase()
                )
            ) {
              dispatch(
                getMeetingParticipantsAgenda_fail(t("No-records-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingParticipantsInfo_03".toLowerCase()
                )
            ) {
              dispatch(
                getMeetingParticipantsAgenda_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getMeetingParticipantsAgenda_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getMeetingParticipantsAgenda_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getMeetingParticipantsAgenda_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(getMeetingParticipantsAgenda_fail(t("Something-went-wrong")));
      });
  };
};

const sendAgendaPDFAsEmail_init = () => {
  return {
    type: actions.SEND_AGENDAPDFASEMAIL_INIT,
  };
};

const sendAgendaPDFAsEmail_success = (response, message) => {
  return {
    type: actions.SEND_AGENDAPDFASEMAIL_SUCCESS,
    response: response,
    message: message,
  };
};

const sendAgendaPDFAsEmail_fail = (message) => {
  return {
    type: actions.SEND_AGENDAPDFASEMAIL_FAIL,
    message: message,
  };
};

const SendAgendaPDFAsEmail = (Data, navigate, t, setShareEmailView) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(sendAgendaPDFAsEmail_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", sendAgendaPDFAsEmail.RequestMethod);
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
          dispatch(SendAgendaPDFAsEmail(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SendAgendaPDFAsEmail_01".toLowerCase()
                )
            ) {
              dispatch(
                sendAgendaPDFAsEmail_success(
                  response.data.responseResult,
                  t("Success")
                )
              );
              setShareEmailView(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SendAgendaPDFAsEmail_02".toLowerCase()
                )
            ) {
              dispatch(sendAgendaPDFAsEmail_fail(t("Invalid-data")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SendAgendaPDFAsEmail_03".toLowerCase()
                )
            ) {
              dispatch(sendAgendaPDFAsEmail_fail(t("Something-went-wrong")));
            } else {
              dispatch(sendAgendaPDFAsEmail_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(sendAgendaPDFAsEmail_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(sendAgendaPDFAsEmail_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(sendAgendaPDFAsEmail_fail(t("Something-went-wrong")));
      });
  };
};

const ExportAgendaPDF = (Data, navigate, t, meetingTitle) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let form = new FormData();
  form.append("RequestMethod", exportAgendaAsPDF.RequestMethod);
  form.append("RequestData", JSON.stringify(Data));
  let contentType = "application/pdf";
  return (dispatch) => {
    dispatch(sendAgendaPDFAsEmail_init());
    axios({
      method: "post",
      url: DataRoomAllFilesDownloads,
      data: form,
      headers: {
        _token: token,
      },
      responseType: "blob",
    })
      .then(async (response) => {
        if (response.status === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(ExportAgendaPDF(Data, navigate, t, meetingTitle));
          dispatch(setLoaderFalse());
        } else if (response.status === 200) {
          console.log("ExportAgendaPDFExportAgendaPDF", response);
          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: "application/pdf" })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", meetingTitle + " - Meeting Agenda");
          document.body.appendChild(link);
          link.click();
          dispatch(setLoaderFalse());
        }
      })
      .catch((response) => {});
  };
};

const printMeetingAgenda_init = () => {
  return {
    type: actions.PRINT_AGENDA_MEETING_INIT,
  };
};

const printMeetingAgenda_success = (response, message) => {
  return {
    type: actions.PRINT_AGENDA_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

const printMeetingAgenda_fail = (message) => {
  return {
    type: actions.PRINT_AGENDA_MEETING_FAIL,
    message: message,
  };
};

const PrintMeetingAgenda = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(printMeetingAgenda_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", printMeetingAgenda.RequestMethod);
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
          dispatch(SendAgendaPDFAsEmail(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_PrintMeetingAgenda_01".toLowerCase()
                )
            ) {
              dispatch(
                printMeetingAgenda_success(
                  response.data.responseResult,
                  t("Print-generated")
                )
              );
              const printWindow = window.open("", "_blank");
              printWindow.document.write(
                response.data.responseResult.printTemplate
              );
              printWindow.document.close();
              setTimeout(() => {
                printWindow.print();
              }, 1500);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_PrintMeetingAgenda_02".toLowerCase()
                )
            ) {
              dispatch(printMeetingAgenda_fail(t("Invalid-data")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_PrintMeetingAgenda_03".toLowerCase()
                )
            ) {
              dispatch(printMeetingAgenda_fail(t("Something-went-wrong")));
            } else {
              dispatch(printMeetingAgenda_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(printMeetingAgenda_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(printMeetingAgenda_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(printMeetingAgenda_fail(t("Something-went-wrong")));
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
  GetCurrentAgendaDetails,
  AgendaVotingStatusUpdate,
  getAgendaAndVotingInfo_success,
  getAgendaVotingDetails_success,
  saveFiles_success, //null emptystring
  saveAgendaVoting_success,
  addUpdateAdvanceMeetingAgenda_success,
  uploadDocument_success,
  getAllVotingResultDisplay_success,
  getAdvanceMeetingAgendabyMeetingID_fail,
  clearAgendaReducerState,
  setLoaderFalse,
  previousTabAgenda,
  nextTabAgenda,
  GetAllMeetingForAgendaImport,
  GetAgendaWithMeetingIDForImport,
  getAgendaWithMeetingIDForImport_success,
  getAllMeetingForAgendaImport_success,
  meetingAgendaStartedMQTT,
  meetingAgendaEndedMQTT,
  meetingAgendaUpdatedMQTT,
  printAgenda,
  exportAgenda,
  agendaViewFlag,
  GetMeetingParticipantsAgenda,
  SendAgendaPDFAsEmail,
  ExportAgendaPDF,
  PrintMeetingAgenda,
};
