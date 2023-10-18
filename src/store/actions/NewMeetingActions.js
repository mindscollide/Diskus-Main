import {
  FetchVideoUrl,
  GetAllRecurringNewMeeting,
  GetMeetingNewFrequencyReminder,
  getAllAgendaContributorRM,
  getAllGroupsUsersAndCommitteesByOrganizaitonID,
  getAllSavedParticipants,
  getParticipantsRoles,
  getallMeetingType,
  saveAgendaContributorsRM,
  saveMeetingDetials,
  saveParticipantsMeeting,
  searchUserMeetings,
  sendNotification,
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

const showCancelModalAgenda = (response) => {
  return {
    type: actions.CANCEL_AGENDA,
    response: response,
  };
};

const showCancelMeetingMaterial = (response) => {
  return {
    type: actions.CANCEL_MEETING_MATERIAL,
    response: response,
  };
};

const showCancelActions = (response) => {
  return {
    type: actions.CANCEL_ACTIONS,
    response: response,
  };
};

const showCancelPolls = (response) => {
  return {
    type: actions.CANCEL_POLLS,
    response: response,
  };
};

const showAddMoreParticipantsInit = () => {
  return {
    type: actions.ADD_MORE_PARTICIPANTS_MODAL_INIT,
  };
};

const showAddMoreParticipantsSuccess = (response, message) => {
  return {
    type: actions.ADD_MORE_PARTICIPANTS_MODAL_SUCCESS,
    response: response,
    message: message,
  };
};

const showAddMoreParticipantsFailed = (message) => {
  return {
    type: actions.ADD_MORE_PARTICIPANTS_MODAL_FAILED,
    message: message,
  };
};

//Function For GetAll Groups And Committeess For Partcipants
const GetAllCommitteesUsersandGroupsParticipants = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showAddMoreParticipantsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      getAllGroupsUsersAndCommitteesByOrganizaitonID.RequestMethod
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
            GetAllCommitteesUsersandGroupsParticipants(Data, navigate, t)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_01".toLowerCase()
                )
            ) {
              dispatch(
                showAddMoreParticipantsSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_02".toLowerCase()
                )
            ) {
              dispatch(showAddMoreParticipantsFailed(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_03".toLowerCase()
                )
            ) {
              dispatch(
                showAddMoreParticipantsFailed(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                showAddMoreParticipantsFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(showAddMoreParticipantsFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showAddMoreParticipantsFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(showAddMoreParticipantsFailed(t("Something-went-wrong")));
      });
  };
};

//Particpants Roles

const showParticipantsRolesInit = () => {
  return {
    type: actions.GET_ALL_ROLES_PARTICIPANTS_INIT,
  };
};

const showParticipantsRolesSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_ROLES_PARTICIPANTS_SUCCESS,
    response: response,
    message: message,
  };
};

const showParticipantsRolesFailed = (message) => {
  return {
    type: actions.GET_ALL_ROLES_PARTICIPANTS_FAILED,
    message: message,
  };
};

const GetAllParticipantsRoleNew = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showParticipantsRolesInit());
    let form = new FormData();
    form.append("RequestMethod", getParticipantsRoles.RequestMethod);
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
          dispatch(GetAllParticipantsRoleNew(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllParticipantRoles_01".toLowerCase()
                )
            ) {
              dispatch(
                showParticipantsRolesSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllParticipantRoles_02".toLowerCase()
                )
            ) {
              dispatch(showParticipantsRolesFailed(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllParticipantRoles_03".toLowerCase()
                )
            ) {
              dispatch(showParticipantsRolesFailed(t("Something-went-wrong")));
            } else {
              dispatch(showParticipantsRolesFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(showParticipantsRolesFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showParticipantsRolesFailed(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(showParticipantsRolesFailed(t("Something-went-wrong")));
      });
  };
};

//Get Meeting URL

const showMeetingURLInit = () => {
  return {
    type: actions.GET_MEETING_URL_INIT,
  };
};

const showMeetingURLSuccess = (response, message) => {
  return {
    type: actions.GET_MEETING_URL_SUCCESS,
    response: response,
    message: message,
  };
};

const showMeetingURLFailed = (message) => {
  return {
    type: actions.GET_MEETING_URL_FAILED,
    message: message,
  };
};

const MeetingUrlSpinner = (response) => {
  return {
    type: actions.GET_MEETING_URL_SPINNER,
    response: response,
  };
};

//Fetch Meeting URL
const FetchMeetingURLApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    // dispatch(showMeetingURLInit());
    dispatch(MeetingUrlSpinner(true));
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", FetchVideoUrl.RequestMethod);
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
          dispatch(FetchMeetingURLApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingVideoURL_01".toLowerCase()
                )
            ) {
              dispatch(
                showMeetingURLSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
              dispatch(MeetingUrlSpinner(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingVideoURL_02".toLowerCase()
                )
            ) {
              dispatch(MeetingUrlSpinner(false));

              dispatch(showMeetingURLFailed(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingVideoURL_03".toLowerCase()
                )
            ) {
              dispatch(MeetingUrlSpinner(false));

              dispatch(showMeetingURLFailed(t("Something-went-wrong")));
            } else {
              dispatch(MeetingUrlSpinner(false));

              dispatch(showMeetingURLFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(MeetingUrlSpinner(false));

            dispatch(showMeetingURLFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(MeetingUrlSpinner(false));

          dispatch(showMeetingURLFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(MeetingUrlSpinner(false));

        dispatch(showMeetingURLFailed(t("Something-went-wrong")));
      });
  };
};

//Save Participants

const showSavedParticipantsInit = () => {
  return {
    type: actions.SAVE_MEETING_PARTICIPANTS_INIT,
  };
};

const showSaveParticipantsSuccess = (response, message) => {
  return {
    type: actions.SAVE_MEETING_PARTICIPANTS_SUCCESS,
    response: response,
    message: message,
  };
};

const showSaveParticipantsFailed = (message) => {
  return {
    type: actions.SAVE_MEETING_PARTICIPANTS_FAILED,
    message: message,
  };
};

//Saving the participants Api
const SaveparticipantsApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showSavedParticipantsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", saveParticipantsMeeting.RequestMethod);
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
          dispatch(SaveparticipantsApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingParticipants_01".toLowerCase()
                )
            ) {
              dispatch(
                showSaveParticipantsSuccess(
                  response.data.responseResult,
                  t("Record-inserted")
                )
              );
              let currentMeetingID = localStorage.getItem("meetingID");
              let Data = {
                MeetingID: Number(currentMeetingID),
              };
              dispatch(GetAllSavedparticipantsAPI(Data, navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingParticipants_02".toLowerCase()
                )
            ) {
              dispatch(showSaveParticipantsFailed(t("No-row-inserted")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingParticipants_03".toLowerCase()
                )
            ) {
              dispatch(showSaveParticipantsFailed(t("Something-went-wrong")));
            } else {
              dispatch(showSaveParticipantsFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(showSaveParticipantsFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showSaveParticipantsFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(showSaveParticipantsFailed(t("Something-went-wrong")));
      });
  };
};

const getAllAgendaContributor_init = () => {
  return {
    type: actions.GET_ALL_AGENDACONTRIBUTOR_INIT,
  };
};

const getAllAgendaContributor_success = (response, message) => {
  return {
    type: actions.GET_ALL_AGENDACONTRIBUTOR_SUCCESS,
    response,
    message,
  };
};

const getAllAgendaContributor_fail = (message) => {
  return {
    type: actions.GET_ALL_AGENDACONTRIBUTOR_FAIL,
    message,
  };
};

const getAllAgendaContributorApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllAgendaContributor_init());
    let form = new FormData();
    form.append("RequestMethod", getAllAgendaContributorRM.RequestMethod);
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
          dispatch(getAllAgendaContributorApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingAgendaContributors_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllAgendaContributor_success(
                  response.data.responseResult.meetingAgendaContributors,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingAgendaContributors_02".toLowerCase()
                )
            ) {
              dispatch(getAllAgendaContributor_fail(t("No-record-inserted")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingAgendaContributors_03".toLowerCase()
                )
            ) {
              dispatch(getAllAgendaContributor_fail(t("Something-went-wrong")));
            } else {
              dispatch(getAllAgendaContributor_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getAllAgendaContributor_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAllAgendaContributor_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllAgendaContributor_fail(t("Something-went-wrong")));
      });
  };
};

const saveAgendaContributors_init = () => {
  return {
    type: actions.SAVE_AGENDACONTRIBUTORS_INIT,
  };
};

const saveAgendaContributors_success = (message) => {
  return {
    type: actions.SAVE_AGENDACONTRIBUTORS_SUCCESS,
    message: message,
  };
};

const saveAgendaContributors_fail = (message) => {
  return {
    type: actions.SAVE_AGENDACONTRIBUTORS_FAIL,
    message: message,
  };
};

const saveAgendaContributors = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentMeetingID = localStorage.getItem("meetingID");

  let getAllData = {
    MeetingID: currentMeetingID !== null ? Number(currentMeetingID) : 1686,
  };
  return (dispatch) => {
    dispatch(saveAgendaContributors_init());
    let form = new FormData();
    form.append("RequestMethod", saveAgendaContributorsRM.RequestMethod);
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
          dispatch(saveAgendaContributors(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveAgendaContributors_01".toLowerCase()
                )
            ) {
              await dispatch(
                saveAgendaContributors_success(t("Record-Inserted"))
              );
              dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveAgendaContributors_02".toLowerCase()
                )
            ) {
              dispatch(saveAgendaContributors_fail(t("No-record-inserted")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveAgendaContributors_03".toLowerCase()
                )
            ) {
              dispatch(saveAgendaContributors_fail(t("Something-went-wrong")));
            } else {
              dispatch(saveAgendaContributors_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveAgendaContributors_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveAgendaContributors_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(saveAgendaContributors_fail(t("Something-went-wrong")));
      });
  };
};

//Get all saved Participants Meeting
const showAllMeetingParticipantsInit = () => {
  return {
    type: actions.GET_ALL_SAVED_PARTICIPATNS_INIT,
  };
};

const showAllMeetingParticipantsSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_SAVED_PARTICIPATNS_SUCCESS,
    response: response,
    message: message,
  };
};

const showAllMeetingParticipantsFailed = (message) => {
  return {
    type: actions.GET_ALL_SAVED_PARTICIPATNS_FAILED,
    message: message,
  };
};

//Get All Saved  participants API Function

const GetAllSavedparticipantsAPI = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showAllMeetingParticipantsInit());
    let form = new FormData();
    form.append("RequestMethod", getAllSavedParticipants.RequestMethod);
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllSavedparticipantsAPI(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingParticipants_01".toLowerCase()
                )
            ) {
              dispatch(
                showAllMeetingParticipantsSuccess(
                  response.data.responseResult.meetingParticipants,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingParticipants_02".toLowerCase()
                )
            ) {
              dispatch(showAllMeetingParticipantsFailed(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingParticipants_03".toLowerCase()
                )
            ) {
              dispatch(
                showAllMeetingParticipantsFailed(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                showAllMeetingParticipantsFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              showAllMeetingParticipantsFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(showAllMeetingParticipantsFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(showAllMeetingParticipantsFailed(t("Something-went-wrong")));
      });
  };
};

//Send Notification Api
const sendNotificationParticipantsInit = () => {
  return {
    type: actions.SEND_NOTIFICATION_INIT,
  };
};

const sendNotificationParticipantsSuccess = (message) => {
  return {
    type: actions.SEND_NOTIFICATION_SUCCESS,
    message: message,
  };
};

const sendNotificationParticipantsFailed = (message) => {
  return {
    type: actions.SEND_NOTIFICATION_FAILED,
    message: message,
  };
};

//Send Notification API Function
const SendNotificationApiFunc = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(sendNotificationParticipantsInit());
    let form = new FormData();
    form.append("RequestMethod", sendNotification.RequestMethod);
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SendNotificationApiFunc(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetRecentNotifications_01".toLowerCase()
                )
            ) {
              dispatch(
                sendNotificationParticipantsSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetRecentNotifications_02".toLowerCase()
                )
            ) {
              dispatch(
                sendNotificationParticipantsFailed(t("No-record-found"))
              );
            } else {
              dispatch(
                sendNotificationParticipantsFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              sendNotificationParticipantsFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            sendNotificationParticipantsFailed(t("Something-went-wrong"))
          );
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(sendNotificationParticipantsFailed(t("Something-went-wrong")));
      });
  };
};

export {
  getAllAgendaContributorApi,
  saveAgendaContributors,
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
  showCancelModalAgenda,
  showCancelMeetingMaterial,
  showCancelActions,
  showCancelPolls,
  GetAllCommitteesUsersandGroupsParticipants,
  GetAllParticipantsRoleNew,
  FetchMeetingURLApi,
  SaveparticipantsApi,
  GetAllSavedparticipantsAPI,
  SendNotificationApiFunc,
};
