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
  getAdvanceMeetingAgendabyMeetingID,
} from "../../commen/apis/Api_config";
import { meetingApi } from "../../commen/apis/Api_ends_points";

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
const getAdvanceMeetingAgendabyMeetingID_success = (response, message) => {
  return {
    type: actions.GET_ADVANCEMEETINGAGENDABYMEETINGID_SUCCESS,
    response: response,
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

export {
  GetAgendaVotingDetails,
  GetAllVotingResultDisplay,
  SaveAgendaVoting,
  clearResponseMessage,
  GetAgendaAndVotingInfo,
  CasteVoteForAgenda,
  ViewAgendaVotingResults,
  GetAdvanceMeetingAgendabyMeetingID,
};
