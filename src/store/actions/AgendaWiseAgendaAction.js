import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import { GetAllAgendaWiseMinutesApiFunc } from "./NewMeetingActions";
import { getAllAgendaForAgendaWise } from "../../commen/apis/Api_config";
import { meetingApi } from "../../commen/apis/Api_ends_points";

const getAllAgendaForAgendaWiseInit = () => ({
  type: actions.GET_ALL_AGENDAWISE_AGENDA_INIT,
});

const getAllAgendaForAgendaWiseSuccess = (response, message) => ({
  type: actions.GET_ALL_AGENDAWISE_AGENDA_SUCCESS,
  response: response,
  message: message,
});

const getAllAgendaForAgendaWiseFailed = (message) => ({
  type: actions.GET_ALL_AGENDAWISE_AGENDA_FAILED,
  message: message,
});

const GetAdvanceMeetingAgendabyMeetingIDForAgendaWiseMinutes = (
  Data,
  navigate,
  t,
  currentMeeting
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllAgendaForAgendaWiseInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllAgendaForAgendaWise.RequestMethod);
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
            GetAdvanceMeetingAgendabyMeetingIDForAgendaWiseMinutes(
              Data,
              navigate,
              t,
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
              dispatch(
                getAllAgendaForAgendaWiseSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );

              let newData = {
                MeetingID: currentMeeting,
              };
              dispatch(
                GetAllAgendaWiseMinutesApiFunc(
                  navigate,
                  newData,
                  t,
                  currentMeeting
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAdvanceMeetingAgendabyMeetingID_02".toLowerCase()
                )
            ) {
              dispatch(getAllAgendaForAgendaWiseFailed(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAdvanceMeetingAgendabyMeetingID_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllAgendaForAgendaWiseFailed(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAllAgendaForAgendaWiseFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getAllAgendaForAgendaWiseFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(getAllAgendaForAgendaWiseFailed(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(getAllAgendaForAgendaWiseFailed(t("Something-went-wrong")));
      });
  };
};

export { GetAdvanceMeetingAgendabyMeetingIDForAgendaWiseMinutes };
