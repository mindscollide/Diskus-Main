import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import { GetAllAgendaWiseMinutesApiFunc } from "./NewMeetingActions";
import { getAllAgendaForAgendaWise } from "../../commen/apis/Api_config";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import axiosInstance from "../../commen/functions/axiosInstance";

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
  currentMeeting,
  setAddReviewers
) => {
  
  return async (dispatch) => {
    await dispatch(getAllAgendaForAgendaWiseInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllAgendaForAgendaWise.RequestMethod);

    try {
      const response = await axiosInstance.post(meetingApi, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        // Retry the API request
        await dispatch(
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
            let newData = {
              MeetingID: currentMeeting,
            };

            // Call GetAllAgendaWiseMinutesApiFunc and wait for it to complete
            await dispatch(
              GetAllAgendaWiseMinutesApiFunc(
                navigate,
                newData,
                t,
                currentMeeting,
                false,
                false
              )
            );

            // Dispatch success after GetAllAgendaWiseMinutesApiFunc has completed
            await dispatch(
              getAllAgendaForAgendaWiseSuccess(response.data.responseResult, "")
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
          dispatch(getAllAgendaForAgendaWiseFailed(t("Something-went-wrong")));
        }
      } else {
        dispatch(getAllAgendaForAgendaWiseFailed(t("Something-went-wrong")));
      }
    } catch (error) {
      dispatch(getAllAgendaForAgendaWiseFailed(t("Something-went-wrong")));
    }
  };
};

export { GetAdvanceMeetingAgendabyMeetingIDForAgendaWiseMinutes };
