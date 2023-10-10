import {
  GetAllRecurringNewMeeting,
  GetMeetingNewFrequencyReminder,
  getallMeetingType,
  saveMeetingDetials,
  searchUserMeetings,
} from "../../commen/apis/Api_config";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import axios from "axios";

const showAddUserModal = (response) => {
  return {
    type: actions.NEW_MEETING_ADDUSER_MODAL,
    response: response,
  };
};

const showCrossConfirmationModal = (response) => {
  return {
    type: actions.CROSS_CONFIRMATION_MODAL,
    response: response,
  };
};

const showNotifyOrganizors = (response) => {
  return {
    type: actions.NOTIFY_ORGANIZORS_MODAL,
    response: response,
  };
};

const showAddAgendaContributor = (response) => {
  return {
    type: actions.ADD_AGENDA_CONTRIBUTORS,
    response: response,
  };
};

const showAgendaContributorsModals = (response) => {
  return {
    type: actions.NOTIFY_AGENDA_CONTRIBUTORS,
    response: response,
  };
};

const showAddParticipantsModal = (response) => {
  return {
    type: actions.ADD_PARTICIPANTS_MODAL,
    response: response,
  };
};

const showAgenItemsRemovedModal = (response) => {
  return {
    type: actions.AGENDA_ITEM_REMOVED,
    response: response,
  };
};

const showMainAgendaItemRemovedModal = (response) => {
  return {
    type: actions.MAIN_AGENDA_ITEM_REMOVED,
    response: response,
  };
};

const showAdvancePermissionModal = (response) => {
  return {
    type: actions.ADVANCED_PERSMISSION_MODAL,
    response: response,
  };
};

const showAdvancePermissionConfirmation = (response) => {
  return {
    type: actions.ADVANCE_PERMISSION_CONFIRMATION,
    response: response,
  };
};

const showVoteAgendaModal = (response) => {
  return {
    type: actions.VOTE_AGENDA_MODAL,
    response: response,
  };
};

const showVoteConfirmationModal = (response) => {
  return {
    type: actions.VOTE_MODAL_CONFIRMATION,
    response: response,
  };
};

const showImportPreviousAgendaModal = (response) => {
  return {
    type: actions.IMPORT_PREVIOUS_AGENDA,
    response: response,
  };
};

const showEnableProposedMeetingDate = (response) => {
  return {
    type: actions.ENABLE_PROPOSED_MEETING_DATE,
    response: response,
  };
};

const showPrposedMeetingUnsavedModal = (response) => {
  return {
    type: actions.PROPOSED_MEETING_SAVED_MODAL,
    response: response,
  };
};

const showImportPreviousMinutes = (response) => {
  return {
    type: actions.IMPORT_PREVIOUS_MINUTES,
    response: response,
  };
};

const showAfterImportState = (response) => {
  return {
    type: actions.AFTER_IMPORT_STATE,
    response: response,
  };
};

const showUnsaveMinutesFileUpload = (response) => {
  return {
    type: actions.UNSAVE_MINUTES_FILEUPLOAD,
    response: response,
  };
};

const showUnsavedCreateFromScratch = (response) => {
  return {
    type: actions.UNSAVED_CREATE_FROM_SCRATCH,
    response: response,
  };
};

const showUnsavedForButonCreateFromScratch = (response) => {
  return {
    type: actions.UNSAVED_BUTTON_CREATE_SCRATCH,
    response: response,
  };
};

const showUnsavedModalImportAgenda = (response) => {
  return {
    type: actions.UNSAVED_IMPORT_AGENDA,
    response: response,
  };
};

const showUnsavedActionsModal = (response) => {
  return {
    type: actions.UNSAVED_MODAL_ACTIONS,
    response: response,
  };
};

const showRemovedTableModal = (response) => {
  return {
    type: actions.REMOVED_TABLE_MODAL,
    response: response,
  };
};

const showUnsavedPollsMeeting = (response) => {
  return {
    type: actions.UNSAVED_POLLS_MEETING,
    response: response,
  };
};

const showunsavedEditPollsMeetings = (response) => {
  return {
    type: actions.UNSAVED_EDIT_POLL_MEETING,
    response: response,
  };
};

const showDeleteMeetingModal = (response) => {
  return {
    type: actions.DELETE_MEETING_MODAL,
    response: response,
  };
};

const showEndMeetingModal = (response) => {
  return {
    type: actions.END_MEETING_MODAL,
    response: response,
  };
};

const showEndMeetingForAll = (response) => {
  return {
    type: actions.END_MEETING_FOR_ALL,
    response: response,
  };
};

const showSceduleProposedMeeting = (response) => {
  return {
    type: actions.SCEDULE_PROPOSED_MEETING,
    response: response,
  };
};

const showviewVotesAgenda = (response) => {
  return {
    type: actions.VIEW_VOTE_AGENDA,
    response: response,
  };
};

const showCastVoteAgendaModal = (response) => {
  return {
    type: actions.CAST_VOTE_AGENDA,
    response: response,
  };
};

const handlegetAllMeetingTypesInit = () => {
  return {
    type: actions.GET_ALL_MEETING_TYPES_NEW_INIT,
  };
};

const handlegetAllMeetingTypesSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_MEETING_TYPES_NEW_SUCCESS,
    response: response,
    message: message,
  };
};

const handlegetAllMeetingTypesFailed = (message) => {
  return {
    type: actions.GET_ALL_MEETING_TYPES_NEW_FAILED,
    message: message,
  };
};

const GetAllMeetingTypesNewFunction = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(handlegetAllMeetingTypesInit());
    let form = new FormData();
    form.append("RequestMethod", getallMeetingType.RequestMethod);
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
          dispatch(GetAllMeetingTypesNewFunction(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingTypes_01".toLowerCase()
                )
            ) {
              dispatch(
                handlegetAllMeetingTypesSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingTypes_02".toLowerCase()
                )
            ) {
              dispatch(handlegetAllMeetingTypesFailed(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingTypes_03".toLowerCase()
                )
            ) {
              dispatch(
                handlegetAllMeetingTypesFailed(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                handlegetAllMeetingTypesFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(handlegetAllMeetingTypesFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(handlegetAllMeetingTypesFailed(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(handlegetAllMeetingTypesFailed(t("Something-went-wrong")));
      });
  };
};

const handleSaveMeetingInit = () => {
  return {
    type: actions.SAVE_MEETING_DETAILS_INIT,
  };
};

const handleSaveMeetingSuccess = (response, message) => {
  return {
    type: actions.SAVE_MEETING_DETAILS_SUCCESS,
    response: response,
    message: message,
  };
};

const handleSaveMeetingFailed = (message) => {
  return {
    type: actions.SAVE_MEETING_DETAILS_FAILED,
    message: message,
  };
};

//Function For Save Meeting Api Function
const SaveMeetingDetialsNewApiFunction = (
  navigate,
  t,
  data,
  setSceduleMeeting,
  setorganizers,
  setmeetingDetails,
  viewValue
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(handleSaveMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", saveMeetingDetials.RequestMethod);
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
          dispatch(SaveMeetingDetialsNewApiFunction(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingDetails_01".toLowerCase()
                )
            ) {
              dispatch(
                handleSaveMeetingSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
              localStorage.setItem(
                "meetingID",
                response.data.responseResult.meetingID
              );
              console.log(
                data.MeetingDetails.MeetingStatusID,
                "MeetingStatusIDMeetingStatusIDMeetingStatusID"
              );
              if (viewValue === 1) {
                setSceduleMeeting(false);
              } else if (viewValue === 2) {
              } else if (viewValue === 3) {
                setorganizers(true);
                setmeetingDetails(false);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingDetails_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(handleSaveMeetingFailed(t("No-record-found", data)));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingDetails_03".toLowerCase()
                )
            ) {
              dispatch(handleSaveMeetingFailed(t("Something-went-wrong")));
            } else {
              dispatch(handleSaveMeetingFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(handleSaveMeetingFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(handleSaveMeetingFailed(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(handleSaveMeetingFailed(t("Something-went-wrong")));
      });
  };
};

const handlegetallReminderFrequencyInit = () => {
  return {
    type: actions.GET_ALL_REMINDER_FREQUENCY_INIT,
  };
};

const handlegetallReminderFrequencySuccess = (response, message) => {
  return {
    type: actions.GET_ALL_REMINDER_FREQUENCY_SUCCESS,
    response: response,
    message: message,
  };
};

const handlegetallReminderFrequencyFailed = (message) => {
  return {
    type: actions.GET_ALL_REMINDER_FREQUENCY_FAILED,
    message: message,
  };
};

//Functions Get All Meeting Reminder Frequency API
const GetAllMeetingRemindersApiFrequencyNew = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(handlegetallReminderFrequencyInit());
    let form = new FormData();
    form.append("RequestMethod", GetMeetingNewFrequencyReminder.RequestMethod);
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
          dispatch(GetAllMeetingRemindersApiFrequencyNew(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingReminders_01".toLowerCase()
                )
            ) {
              dispatch(
                handlegetallReminderFrequencySuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingReminders_02".toLowerCase()
                )
            ) {
              dispatch(
                handlegetallReminderFrequencyFailed(t("No-record-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingReminders_03".toLowerCase()
                )
            ) {
              dispatch(
                handlegetallReminderFrequencyFailed(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                handlegetallReminderFrequencyFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              handlegetallReminderFrequencyFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            handlegetallReminderFrequencyFailed(t("Something-went-wrong"))
          );
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(
          handlegetallReminderFrequencyFailed(t("Something-went-wrong"))
        );
      });
  };
};

const handleReucrringInit = () => {
  return {
    type: actions.GET_ALL_RECURRING_INIT,
  };
};

const handleReucrringSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_RECURRING_SUCCESS,
    response: response,
    message: message,
  };
};

const handleReucrringFailed = (message) => {
  return {
    type: actions.GET_ALL_RECURRING_FAILED,
    message: message,
  };
};

//Functions Get All Meeting Recurring API
const GetAllMeetingRecurringApiNew = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(handleReucrringInit());
    let form = new FormData();
    form.append("RequestMethod", GetAllRecurringNewMeeting.RequestMethod);
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
          dispatch(GetAllMeetingRecurringApiNew(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllRecurringFactor_01".toLowerCase()
                )
            ) {
              dispatch(
                handleReucrringSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllRecurringFactor_02".toLowerCase()
                )
            ) {
              dispatch(handleReucrringFailed(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllRecurringFactor_03".toLowerCase()
                )
            ) {
              dispatch(handleReucrringFailed(t("Something-went-wrong")));
            } else {
              dispatch(handleReucrringFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(handleReucrringFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(handleReucrringFailed(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(handleReucrringFailed(t("Something-went-wrong")));
      });
  };
};
// Search Meeting Init
const SearchMeeting_Init = () => {
  return {
    type: actions.GET_SEARCH_NEW_MEETINGS_INIT,
  };
};
// Search Meeting Init
const SearchMeeting_Success = (response, message) => {
  return {
    type: actions.GET_SEARCH_NEW_MEETINGS_SUCCESS,
    response: response,
    message: message,
  };
};
// Search Meeting Init
const SearchMeeting_Fail = (message) => {
  return {
    type: actions.GET_SEARCH_NEW_MEETINGS_FAIL,
    message: message,
  };
};
const searchNewUserMeeting = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(SearchMeeting_Init());
    let form = new FormData();
    form.append("RequestMethod", searchUserMeetings.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "responseresponseresponse");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(searchNewUserMeeting(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SearchMeetings_01".toLowerCase()
                )
            ) {
              dispatch(
                SearchMeeting_Success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SearchMeetings_02".toLowerCase()
                )
            ) {
              dispatch(SearchMeeting_Fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SearchMeetings_03".toLowerCase()
                )
            ) {
              dispatch(SearchMeeting_Fail(t("Something-went-wrong")));
            } else {
              dispatch(SearchMeeting_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(SearchMeeting_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(SearchMeeting_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(SearchMeeting_Fail(t("Something-went-wrong")));
      });
  };
};

const clearMeetingState = () => {
  return {
    type: actions.CLEAR_NEWMEETINGSTATE,
  };
};

//cancel Modal Meeting Details

const showCancelModalmeetingDeitals = (response) => {
  return {
    type: actions.CANCEL_BUTTON_MODAL_MEETING_DETIALS_TAB,
    response: response,
  };
};

const showCancelModalOrganizers = (response) => {
  return {
    type: actions.CANCEL_BUTTON_MODAL_ORGANIZER,
    response: response,
  };
};

const showCancelModalAgendaContributor = (response) => {
  return {
    type: actions.CANCEL_AGENDA_CONTRIBUTOR,
    response: response,
  };
};

const showCancelModalPartipants = (response) => {
  return {
    type: actions.CANCEL_PARTICIPANTS,
    response: response,
  };
};

export {
  showAddUserModal,
  showCrossConfirmationModal,
  showNotifyOrganizors,
  showAddAgendaContributor,
  showAgendaContributorsModals,
  showAddParticipantsModal,
  showAgenItemsRemovedModal,
  showMainAgendaItemRemovedModal,
  showAdvancePermissionModal,
  showAdvancePermissionConfirmation,
  showVoteAgendaModal,
  showVoteConfirmationModal,
  showImportPreviousAgendaModal,
  showEnableProposedMeetingDate,
  showPrposedMeetingUnsavedModal,
  showImportPreviousMinutes,
  showAfterImportState,
  showUnsaveMinutesFileUpload,
  showUnsavedCreateFromScratch,
  showUnsavedForButonCreateFromScratch,
  showUnsavedModalImportAgenda,
  showUnsavedActionsModal,
  showRemovedTableModal,
  showUnsavedPollsMeeting,
  showunsavedEditPollsMeetings,
  showDeleteMeetingModal,
  showEndMeetingModal,
  showEndMeetingForAll,
  showSceduleProposedMeeting,
  showviewVotesAgenda,
  showCastVoteAgendaModal,
  handlegetAllMeetingTypesInit,
  handlegetAllMeetingTypesSuccess,
  handlegetAllMeetingTypesFailed,
  GetAllMeetingTypesNewFunction,
  SaveMeetingDetialsNewApiFunction,
  GetAllMeetingRemindersApiFrequencyNew,
  GetAllMeetingRecurringApiNew,
  searchNewUserMeeting,
  clearMeetingState,
  showCancelModalmeetingDeitals,
  showCancelModalOrganizers,
  showCancelModalAgendaContributor,
  showCancelModalPartipants,
};
