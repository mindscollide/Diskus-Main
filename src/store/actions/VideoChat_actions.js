/**
 * @file VideoChat_actions.js
 * @description Redux thunk actions for video-meeting chat, agenda, attachments, and recordings.
 * Handles fetching meeting agendas, fetching/updating agenda attachments,
 * and downloading call/meeting recordings as blob files.
 * Dispatches: SHOW_MINUTES_STATE / SHOW_ATTACHMENTS_STATE / MEETINGATTACHMENT_MODAL /
 * GET_MEETINGAGENDAS_INIT / GET_MEETINGAGENDAS_SUCCESS / GET_MEETINGAGENDAS_FAIL /
 * GET_ATTACHMENTSBYMEETINGID_INIT / GET_ATTACHMENTSBYMEETINGID_SUCCESS / GET_ATTACHMENTSBYMEETINGID_FAIL /
 * AGENDA_ATTACHMENTUPDATE_INIT / AGENDA_ATTACHMENTUPDATE_SUCCESS / AGENDA_ATTACHMENTUPDATE_FAIL /
 * DOWNLOAD_CALL_RECORDING_INIT / DOWNLOAD_CALL_RECORDING_SUCCESS action types.
 */
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

/**
 * Toggles the minutes panel visibility.
 * @param {boolean} response - Visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showMinutes = (response) => {
  return {
    type: actions.SHOW_MINUTES_STATE,
    response: response,
  };
};

/**
 * Toggles the attachments panel visibility.
 * @param {boolean} response - Visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const showAttachments = (response) => {
  return {
    type: actions.SHOW_ATTACHMENTS_STATE,
    response: response,
  };
};

/**
 * Opens or closes the meeting-attachment modal.
 * @param {boolean} response - Modal visibility state.
 * @returns {{ type: string, response: boolean }}
 */
const meetingModalAttachment = (response) => {
  return {
    type: actions.MEETINGATTACHMENT_MODAL,
    response: response,
  };
};

/** @returns {{ type: string }} */
const getMeetingAgendasInit = () => {
  return {
    type: actions.GET_MEETINGAGENDAS_INIT,
  };
};

/** @returns {{ type: string, response: *, message: string }} */
const getMeetingAgendasSuccess = (response, message) => {
  return {
    type: actions.GET_MEETINGAGENDAS_SUCCESS,
    response: response,
    message: message,
  };
};

/** @returns {{ type: string, message: string }} */
const getMeetingAgendasFail = (message) => {
  return {
    type: actions.GET_MEETINGAGENDAS_FAIL,
    message: message,
  };
};

/**
 * Fetches all agendas for a specific meeting.
 * @param {Function} navigate - React Router navigate function.
 * @param {Object} data - Request payload containing the meeting ID.
 * @param {Function} t - i18next translation function.
 * @returns {Function} Redux thunk.
 */
const getMeetingAgendas = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
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
        dispatch(getMeetingAgendasFail());
      });
  };
};

/** @returns {{ type: string }} */
const getMeetingAttachmentsInit = () => {
  return {
    type: actions.GET_ATTACHMENTSBYMEETINGID_INIT,
  };
};

/** @returns {{ type: string, response: *, message: string }} */
const getMeetingAttachmentsSuccess = (response, message) => {
  return {
    type: actions.GET_ATTACHMENTSBYMEETINGID_SUCCESS,
    response: response,
    message: message,
  };
};

/** @returns {{ type: string, message: string }} */
const getMeetingAttachmentsFail = (message) => {
  return {
    type: actions.GET_ATTACHMENTSBYMEETINGID_FAIL,
    message: message,
  };
};

/**
 * Fetches all attachments for a specific meeting.
 * @param {Function} navigate - React Router navigate function.
 * @param {Object} data - Request payload containing the meeting ID.
 * @param {Function} t - i18next translation function.
 * @returns {Function} Redux thunk.
 */
const getMeetingAttachments = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
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
        dispatch(getMeetingAttachmentsFail(response.data.responseMessage));
      });
  };
};

/** @returns {{ type: string }} */
const updateAgendaAttahmentsInit = () => {
  return {
    type: actions.AGENDA_ATTACHMENTUPDATE_INIT,
  };
};

/** @returns {{ type: string, response: *, message: string }} */
const updateAgendaAttahmentsSuccess = (response, message) => {
  return {
    type: actions.AGENDA_ATTACHMENTUPDATE_SUCCESS,
    response: response,
    message: message,
  };
};

/** @returns {{ type: string, message: string }} */
const updateAgendaAttahmentsFail = (message) => {
  return {
    type: actions.AGENDA_ATTACHMENTUPDATE_FAIL,
    message: message,
  };
};

/**
 * Updates the attachments list for a meeting agenda.
 * @param {Function} navigate - React Router navigate function.
 * @param {Array} data - Array of agenda attachment objects to update.
 * @param {Function} t - i18next translation function.
 * @returns {Function} Redux thunk.
 */
const updateAgendaAttachment = (navigate, data, t) => {
  let AgendaAttachments = { AgendaAttachments: [...data] };
  console.log(
    "AgendaAttachmentsAgendaAttachmentsAgendaAttachmentsAgendaAttachmentsAgendaAttachments",
    JSON.stringify(AgendaAttachments)
  );
  let token = JSON.parse(localStorage.getItem("token"));

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

/** @returns {{ type: string }} */
const downloadCallRecording_init = () => {
  return {
    type: actions.DOWNLOAD_CALL_RECORDING_INIT,
  };
};

/** @returns {{ type: string }} */
const downloadCallRecording_success = () => {
  return {
    type: actions.DOWNLOAD_CALL_RECORDING_SUCCESS,
  };
};

/**
 * Downloads a video-call recording as an MP4 blob.
 * Filename format: VideoCall-ddMMyyyy-starttime-Recording.mp4
 * @param {Object} Data - Request payload containing the recording reference.
 * @param {Function} navigate - React Router navigate function.
 * @param {Function} t - i18next translation function.
 * @param {string} utcDate - UTC date string used in the downloaded filename.
 * @param {string} utcTime - UTC time string used in the downloaded filename.
 * @returns {Function} Redux thunk.
 */
const DownloadCallRecording = (Data, navigate, t, utcDate, utcTime) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let form = new FormData();
  form.append("RequestMethod", downloadCallRecording.RequestMethod);
  form.append("RequestData", JSON.stringify(Data));
  return (dispatch) => {
    dispatch(downloadCallRecording_init());
    axiosInstance.post(DataRoomAllFilesDownloads, form, {
      responseType: "blob",
    })
      .then(async (response) => {
        if (response.status === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DownloadCallRecording(Data, navigate, t, utcDate, utcTime));
          dispatch(downloadCallRecording_success());
        } else if (response.status === 200) {
          console.log("DownloadCallRecording", response);
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

/**
 * Downloads a meeting recording as an MP4 blob.
 * Filename format: MeetingTitle-ddMMyyyy-starttime-Recording.mp4
 * @param {Object} Data - Request payload containing the recording reference.
 * @param {Function} navigate - React Router navigate function.
 * @param {Function} t - i18next translation function.
 * @param {string} meetingTitle - Meeting title used in the downloaded filename.
 * @param {string} utcDate - UTC date string used in the downloaded filename.
 * @param {string} utcTime - UTC time string used in the downloaded filename.
 * @returns {Function} Redux thunk.
 */
const DownloadMeetingRecording = (
  Data,
  navigate,
  t,
  meetingTitle,
  utcDate,
  utcTime
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let form = new FormData();
  form.append("RequestMethod", downloadMeetingRecording.RequestMethod);
  form.append("RequestData", JSON.stringify(Data));
  return (dispatch) => {
    dispatch(downloadCallRecording_init());
    axiosInstance.post(DataRoomAllFilesDownloads, form, {
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
          console.log("DownloadMeetingRecording", response);
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
