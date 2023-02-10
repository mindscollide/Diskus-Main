import * as actions from "../action_types";
import axios from "axios";

import {
  getAttachmentByMeetingId,
  getAgendasByMeetingId,
  updateAgendaAttachments,
} from "../../commen/apis/Api_config";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";

const showMinutes = (response) => {
  return {
    type: actions.SHOW_MINUTES_STATE,
    response: response,
  };
};

const showAttachments = (response) => {
  return {
    type: actions.SHOW_ATTACHMENTS_STATE,
    response: response,
  };
};
const meetingModalAttachment = (response) => {
  return {
    type: actions.MEETINGATTACHMENT_MODAL,
    response: response,
  };
};

const getMeetingAgendasInit = () => {
  return {
    type: actions.GET_MEETINGAGENDAS_INIT,
  };
};
const getMeetingAgendasSuccess = (response, message) => {
  return {
    type: actions.GET_MEETINGAGENDAS_SUCCESS,
    response: response,
    message: message,
  };
};

const getMeetingAgendasFail = (message) => {
  return {
    type: actions.GET_MEETINGAGENDAS_FAIL,
    message: message,
  };
};

const getMeetingAgendas = (data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMeetingAgendasInit());
    let form = new FormData();
    form.append("RequestMethod", getAgendasByMeetingId.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("getMeetingAgenda", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(getMeetingAgendas(data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(
              "timezone response in conidtion",
              response.data.responseResult
            );
            dispatch(
              getMeetingAgendasSuccess(
                response.data.responseResult,
                response.data.responseMessage
              )
            );
          } else {
            dispatch(getMeetingAgendasFail(response.data.responseMessage));
          }
        } else {
          await dispatch(getMeetingAgendasFail(response.data.responseMessage));
        }
      })
      .catch((response) => {
        console.log("response", response);
        dispatch(getMeetingAgendasFail());
      });
  };
};

const getMeetingAttachmentsInit = () => {
  return {
    type: actions.GET_ATTACHMENTSBYMEETINGID_INIT,
  };
};
const getMeetingAttachmentsSuccess = (response, message) => {
  console.log("responseresponseresponseresponseresponse", response);
  return {
    type: actions.GET_ATTACHMENTSBYMEETINGID_SUCCESS,
    response: response,
    message: message,
  };
};
const getMeetingAttachmentsFail = (message) => {
  return {
    type: actions.GET_ATTACHMENTSBYMEETINGID_FAIL,
    message: message,
  };
};
const getMeetingAttachments = (data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMeetingAttachmentsInit());
    let form = new FormData();
    form.append("RequestMethod", getAttachmentByMeetingId.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("getMeetingAgendaAttachment", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(getMeetingAttachments(data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(
              "attachments files by agenda",
              response.data.responseResult
            );
            dispatch(
              getMeetingAttachmentsSuccess(
                response.data.responseResult,
                response.data.responseMessage
              )
            );
          } else {
            dispatch(getMeetingAttachmentsFail(response.data.responseMessage));
          }
        } else {
          await dispatch(
            getMeetingAttachmentsFail(response.data.responseMessage)
          );
        }
      })
      .catch((response) => {
        console.log("response", response);
        dispatch(getMeetingAttachmentsFail(response.data.responseMessage));
      });
  };
};

const updateAgendaAttahmentsInit = () => {
  return {
    type: actions.AGENDA_ATTACHMENTUPDATE_INIT,
  };
};
const updateAgendaAttahmentsSuccess = (response, message) => {
  return {
    type: actions.AGENDA_ATTACHMENTUPDATE_SUCCESS,
    response: response,
    message: message,
  };
};
const updateAgendaAttahmentsFail = (message) => {
  return {
    type: actions.AGENDA_ATTACHMENTUPDATE_FAIL,
    message: message,
  };
};
const updateAgendaAttachment = (data, t) => {
  let AgendaAttachments = { AgendaAttachments: [...data] };
  console.log(
    "AgendaAttachmentsAgendaAttachmentsAgendaAttachmentsAgendaAttachmentsAgendaAttachments",
    JSON.stringify(AgendaAttachments)
  );
  let token = JSON.parse(localStorage.getItem("token"));
  let meetingID = localStorage.getItem("MeetingId");
  let obj = { MeetingID: JSON.parse(meetingID) };

  return (dispatch) => {
    dispatch(updateAgendaAttahmentsInit());
    let form = new FormData();
    form.append("RequestMethod", updateAgendaAttachments.RequestMethod);
    form.append("RequestData", JSON.stringify(AgendaAttachments));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("getMeetingAgendaAttachment123", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(updateAgendaAttachment(data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              updateAgendaAttahmentsSuccess(
                response.data.responseResult,
                response.data.responseMessage
              )
            );
          } else {
            await dispatch(
              updateAgendaAttahmentsFail(response.data.responseMessage)
            );
          }
        } else {
          await dispatch(
            updateAgendaAttahmentsFail(response.data.responseMessage)
          );
        }
      })
      .catch((response) => {
        dispatch(updateAgendaAttahmentsFail(response.data.responseMessage));
      });
  };
};
export {
  getMeetingAgendas,
  showMinutes,
  showAttachments,
  meetingModalAttachment,
  getMeetingAttachments,
  updateAgendaAttachment,
};
