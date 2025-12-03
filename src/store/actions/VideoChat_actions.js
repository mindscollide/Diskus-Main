import * as actions from "../action_types";

import {
  getAttachmentByMeetingId,
  getAgendasByMeetingId,
  updateAgendaAttachments,
  downloadCallRecording,
  downloadMeetingRecording,
} from "../../commen/apis/Api_config";
import {
  meetingApi,
  DataRoomAllFilesDownloads,
} from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";

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

const getMeetingAgendas = (navigate, data, t) => {
  return (dispatch) => {
    dispatch(getMeetingAgendasInit());
    let form = new FormData();
    form.append("RequestMethod", getAgendasByMeetingId.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getMeetingAgendas(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
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
const getMeetingAttachments = (navigate, data, t) => {
  return (dispatch) => {
    dispatch(getMeetingAttachmentsInit());
    let form = new FormData();
    form.append("RequestMethod", getAttachmentByMeetingId.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getMeetingAttachments(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
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
const updateAgendaAttachment = (navigate, data, t) => {
  let AgendaAttachments = { AgendaAttachments: [...data] };

  return (dispatch) => {
    dispatch(updateAgendaAttahmentsInit());
    let form = new FormData();
    form.append("RequestMethod", updateAgendaAttachments.RequestMethod);
    form.append("RequestData", JSON.stringify(AgendaAttachments));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateAgendaAttachment(navigate, data, t));
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

const downloadCallRecording_init = () => {
  return {
    type: actions.DOWNLOAD_CALL_RECORDING_INIT,
  };
};

const downloadCallRecording_success = () => {
  return {
    type: actions.DOWNLOAD_CALL_RECORDING_SUCCESS,
  };
};

// For Meeting TItle -> MeetingTitle-ddMMyyyy-starttime-Recording.mp4
// For Video Call Title ->  VideoCall-ddMMyyyy-starttime-Recording.mp4

const DownloadCallRecording = (Data, navigate, t, utcDate, utcTime) => {
  let form = new FormData();
  form.append("RequestMethod", downloadCallRecording.RequestMethod);
  form.append("RequestData", JSON.stringify(Data));
  return (dispatch) => {
    dispatch(downloadCallRecording_init());
    axiosInstance
      .post(DataRoomAllFilesDownloads, form, {
        responseType: "blob",
      })
      .then(async (response) => {
        if (response.status === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DownloadCallRecording(Data, navigate, t, utcDate, utcTime));
          dispatch(downloadCallRecording_success());
        } else if (response.status === 200) {
          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: "video/mp4" })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            "VideoCall-" + utcDate + "-" + utcTime + "-Recording.mp4"
          );
          document.body.appendChild(link);
          link.click();
          dispatch(downloadCallRecording_success());
        }
      })
      .catch((response) => {
        console.error("Error downloading the video", response);
      });
  };
};

const DownloadMeetingRecording = (
  Data,
  navigate,
  t,
  meetingTitle,
  utcDate,
  utcTime
) => {
  let form = new FormData();
  form.append("RequestMethod", downloadMeetingRecording.RequestMethod);
  form.append("RequestData", JSON.stringify(Data));
  return (dispatch) => {
    dispatch(downloadCallRecording_init());
    axiosInstance
      .post(DataRoomAllFilesDownloads, form, {
        responseType: "blob",
      })

      .then(async (response) => {
        if (response.status === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            DownloadMeetingRecording(
              Data,
              navigate,
              t,
              meetingTitle,
              utcDate,
              utcTime
            )
          );
          dispatch(downloadCallRecording_success());
        } else if (response.status === 200) {
          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: "video/mp4" })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            meetingTitle + "-" + utcDate + "-" + utcTime + "-Recording.mp4"
          );
          document.body.appendChild(link);
          link.click();
          dispatch(downloadCallRecording_success());
        }
      })
      .catch((response) => {
        console.error("Error downloading the video", response);
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
  DownloadCallRecording,
  DownloadMeetingRecording,
};
