import * as actions from "../action_types";
import axios from "axios";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import {
  getMeetingGuestVideoURL,
  ValidateEncryptedStringGuestVideoLink,
} from "../../commen/apis/Api_config";
import copyToClipboard from "../../hooks/useClipBoard";

const getMeetingGuestVideoInit = () => {
  return {
    type: actions.GET_MEETING_GUEST_URL_INIT,
  };
};

const getMeetingGuestVideoSuccess = (response, message) => {
  return {
    type: actions.GET_MEETING_GUEST_URL_SUCCESS,
    response: response,
    message: message,
  };
};

const getMeetingGuestVideoFail = (message) => {
  return {
    type: actions.GET_MEETING_GUEST_URL_FAIL,
    message: message,
  };
};

const getMeetingGuestVideoMainApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMeetingGuestVideoInit());
    let form = new FormData();
    form.append("RequestMethod", getMeetingGuestVideoURL.RequestMethod);
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getMeetingGuestVideoMainApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingGuestVideoURL_01".toLowerCase()
                )
            ) {
              await dispatch(
                getMeetingGuestVideoSuccess(
                  response.data.responseResult.guestVideoURL,
                  t("Meeting-link-copied")
                )
              );
              copyToClipboard(response.data.responseResult.guestVideoURL);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingGuestVideoURL_02".toLowerCase()
                )
            ) {
              await dispatch(getMeetingGuestVideoFail(t("Meeting Not Found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingGuestVideoURL_03".toLowerCase()
                )
            ) {
              await dispatch(
                getMeetingGuestVideoFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(getMeetingGuestVideoFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(getMeetingGuestVideoFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getMeetingGuestVideoFail(t("Something-went-wrong")));
      });
  };
};

const validateEncryptGuestVideoInit = () => {
  return {
    type: actions.VALIDATE_ENCRYPT_STRING_GUEST_VIDEO_INIT,
  };
};

const validateEncryptGuestVideoSuccess = (response, message) => {
  return {
    type: actions.VALIDATE_ENCRYPT_STRING_GUEST_VIDEO_SUCCESS,
    response: response,
    message: message,
  };
};

const validateEncryptGuestVideoFail = (message) => {
  return {
    type: actions.VALIDATE_ENCRYPT_STRING_GUEST_VIDEO_FAIL,
    message: message,
  };
};

const validateEncryptGuestVideoMainApi = (navigate, t) => {
  return (dispatch) => {
    dispatch(validateEncryptGuestVideoInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      ValidateEncryptedStringGuestVideoLink.RequestMethod
    );
    form.append("RequestData", JSON.stringify());

    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {},
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          //   await dispatch(RefreshToken(navigate, t));
          dispatch(validateEncryptGuestVideoMainApi(navigate));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ValidateEncryptedStringGuestVideoLink_01".toLowerCase()
                )
            ) {
              await dispatch(
                validateEncryptGuestVideoSuccess(
                  response.data.responseResult,
                  t("Active Meeting")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ValidateEncryptedStringGuestVideoLink_02".toLowerCase()
                )
            ) {
              await dispatch(
                validateEncryptGuestVideoFail(t("Meeting Not Active"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ValidateEncryptedStringGuestVideoLink_03".toLowerCase()
                )
            ) {
              await dispatch(
                validateEncryptGuestVideoFail(t("Invalid Meeting"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ValidateEncryptedStringGuestVideoLink_04".toLowerCase()
                )
            ) {
              await dispatch(
                validateEncryptGuestVideoFail(t("Something-went-wrong"))
              );
            }
          } else {
            await dispatch(
              validateEncryptGuestVideoFail(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            validateEncryptGuestVideoFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(validateEncryptGuestVideoFail(t("Something-went-wrong")));
      });
  };
};

export { getMeetingGuestVideoMainApi, validateEncryptGuestVideoMainApi };
