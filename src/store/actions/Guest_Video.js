import * as actions from "../action_types";
import axios from "axios";
import { videoApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import { getMeetingGuestVideoURL } from "../../commen/apis/Api_config";

const getMeetingGuestVideoInit = () => {
  return {
    type: actions.GET_MEETING_GUEST_URL_INIT,
  };
};

const getMeetingGuestVideoSuccess = (response, message) => {
  return {
    type: actions.GET_MEETING_GUEST_URL_INIT,
    response: response,
    message: message,
  };
};

const getMeetingGuestVideoFail = (message) => {
  return {
    type: actions.GET_MEETING_GUEST_URL_INIT,
    message: message,
  };
};

const getMeetingGuestVideoMainApi = () => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMeetingGuestVideoInit());
    let form = new FormData();
    form.append("RequestMethod", getMeetingGuestVideoURL.RequestMethod);
    form.append("RequestData", JSON.stringify());

    axios({
      method: "post",
      url: videoApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getMeetingGuestVideoMainApi(navigate, t));
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
                getMeetingGuestVideoSuccess(response.data.responseResult, "")
              );
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

export { getMeetingGuestVideoMainApi };
