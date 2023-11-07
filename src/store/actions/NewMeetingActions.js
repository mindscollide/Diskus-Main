import {
  FetchVideoUrl,
  GetAllRecurringNewMeeting,
  GetMeetingNewFrequencyReminder,
  SetMeetingPolls,
  SettingMeetingProposedDates,
  getAllAgendaContributorRM,
  getAllGroupsUsersAndCommitteesByOrganizaitonID,
  getAllMeetingDetailsByMeetingID,
  getAllPropsedMeetingdates,
  getAllSavedParticipants,
  getAllmeetingUsers,
  getParticipantsRoles,
  getPollsByMeetingID,
  getallMeetingType,
  saveAgendaContributorsRM,
  saveMeetingDetials,
  saveParticipantsMeeting,
  searchUserMeetings,
  sendNotification,
  setMeetingProposedDatesResponse,
  getAllMeetingMaterial,
  MeetingAgendaLock,
  GetAllUserAgendaRights,
  saveUserAttachmentPermission,
  getGeneralMinutes,
  SaveminutesGeneral,
  uploadDocumentsRequestMethod,
  saveFilesRequestMethod,
  SaveGeneralWiseSavingDocuments,
  RetriveGeneralMinutesDocuments,
  getAllGeneralMiintuesDocument,
  getUserWiseProposeDate,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import {
  dataRoomApi,
  meetingApi,
  pollApi,
} from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import axios from "axios";

const ClearMessegeMeetingdetails = () => {
  return {
    type: actions.CLEAR_MEETING_DETAILS,
  };
};

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

const sendRecentNotificationOrganizerModal = (response) => {
  return {
    type: actions.SEND_NOTIFICATION_ORGANIZORS_MODAL,
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
  viewValue,
  setCurrentMeetingID
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
          dispatch(
            SaveMeetingDetialsNewApiFunction(
              navigate,
              t,
              data,
              setSceduleMeeting,
              setorganizers,
              setmeetingDetails,
              viewValue,
              setCurrentMeetingID
            )
          );
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

              setCurrentMeetingID(response.data.responseResult.meetingID);

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
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingDetails_04".toLowerCase()
                )
            ) {
              dispatch(
                handleSaveMeetingFailed(
                  t(
                    "Consecutive-date-times-should-be-greater-than-previous-date-time"
                  )
                )
              );
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
const SaveparticipantsApi = (Data, navigate, t, currentMeeting) => {
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
          dispatch(SaveparticipantsApi(Data, navigate, t, currentMeeting));
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
              let Data = {
                MeetingID: Number(currentMeeting),
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

const saveAgendaContributors = (navigate, t, data, currentMeeting) => {
  let token = JSON.parse(localStorage.getItem("token"));

  let getAllData = {
    MeetingID:
      currentMeeting !== null && currentMeeting !== undefined
        ? Number(currentMeeting)
        : 1686,
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
          dispatch(saveAgendaContributors(navigate, t, data, currentMeeting));
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

//GET ALL MEETING DETAILS STARTED

const showGetAllMeetingDetialsInit = () => {
  return {
    type: actions.GET_ALL_MEETING_DETAILS_BY_MEETINGID_INIT,
  };
};

const showGetAllMeetingDetialsSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_MEETING_DETAILS_BY_MEETINGID_SUCCESS,
    response: response,
    message: message,
  };
};

const showGetAllMeetingDetialsFailed = (message) => {
  return {
    type: actions.GET_ALL_MEETING_DETAILS_BY_MEETINGID_FAILED,
    message: message,
  };
};

//GET ALL MEETING DETAILS API Function
const GetAllMeetingDetailsApiFunc = (
  Data,
  navigate,
  t,
  setCurrentMeetingID,
  setSceduleMeeting
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showGetAllMeetingDetialsInit());
    let form = new FormData();
    form.append("RequestMethod", getAllMeetingDetailsByMeetingID.RequestMethod);
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
          dispatch(
            GetAllMeetingDetailsApiFunc(
              Data,
              navigate,
              t,
              setCurrentMeetingID,
              setSceduleMeeting
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAdvanceMeetingDetailsByMeetingID_01".toLowerCase()
                )
            ) {
              console.log(Data, "DataDataDataData");
              setSceduleMeeting(true);
              setCurrentMeetingID(Data.MeetingID);
              dispatch(
                showGetAllMeetingDetialsSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAdvanceMeetingDetailsByMeetingID_02".toLowerCase()
                )
            ) {
              dispatch(showGetAllMeetingDetialsFailed(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAdvanceMeetingDetailsByMeetingID_03".toLowerCase()
                )
            ) {
              dispatch(showGetAllMeetingDetialsFailed(t("No-record-found")));
            } else {
              dispatch(
                showGetAllMeetingDetialsFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(showGetAllMeetingDetialsFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showGetAllMeetingDetialsFailed(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(showGetAllMeetingDetialsFailed(t("Something-went-wrong")));
      });
  };
};

//Get All Polls By Meeting ID

const showPollsByMeetingIdInit = () => {
  return {
    type: actions.GET_POLLS_BY_MEETING_ID_INIT,
  };
};

const showPollsByMeetingIdSuccess = (response, message) => {
  return {
    type: actions.GET_POLLS_BY_MEETING_ID_SUCCESS,
    response: response,
    message: message,
  };
};

const showPollsByMeetingIdFailed = (message) => {
  return {
    type: actions.GET_POLLS_BY_MEETING_ID_SUCCESS,
    message: message,
  };
};
//Api FUnctions For Getting All polls By Meeting ID
const GetAllPollsByMeetingIdApiFunc = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showPollsByMeetingIdInit());
    let form = new FormData();
    form.append("RequestMethod", getPollsByMeetingID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: pollApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllPollsByMeetingIdApiFunc(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetPollsByMeetingID_01".toLowerCase()
                )
            ) {
              dispatch(
                showPollsByMeetingIdSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetPollsByMeetingID_02".toLowerCase()
                )
            ) {
              dispatch(showPollsByMeetingIdFailed(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetPollsByMeetingID_03".toLowerCase()
                )
            ) {
              dispatch(showPollsByMeetingIdFailed(t("Something-went-wrong")));
            } else {
              dispatch(showPollsByMeetingIdFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(showPollsByMeetingIdFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showPollsByMeetingIdFailed(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(showPollsByMeetingIdFailed(t("Something-went-wrong")));
      });
  };
};

//get all meeting users Api

const showGetAllMeetingUsersInit = () => {
  return {
    type: actions.GET_ALL_MEETING_USER_INIT,
  };
};

const showGetAllMeetingUsersSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_MEETING_USER_SUCCESS,
    response: response,
    message: message,
  };
};

const showGetAllMeetingUsersFailed = (response, message) => {
  return {
    type: actions.GET_ALL_MEETING_USER_FAILED,
    message: message,
  };
};

//get all meeting users Api function
const GetAllMeetingUserApiFunc = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showGetAllMeetingUsersInit());
    let form = new FormData();
    form.append("RequestMethod", getAllmeetingUsers.RequestMethod);
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
          dispatch(GetAllMeetingUserApiFunc(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingUsers_01".toLowerCase()
                )
            ) {
              dispatch(
                showGetAllMeetingUsersSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingUsers_02".toLowerCase()
                )
            ) {
              dispatch(showGetAllMeetingUsersFailed(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingUsers_03".toLowerCase()
                )
            ) {
              dispatch(showGetAllMeetingUsersFailed(t("Something-went-wrong")));
            } else {
              dispatch(showGetAllMeetingUsersFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(showGetAllMeetingUsersFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showGetAllMeetingUsersFailed(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(showGetAllMeetingUsersFailed(t("Something-went-wrong")));
      });
  };
};

//set Meeting polls
const showSetMeetingPollsInit = () => {
  return {
    type: actions.SET_MEETING_POLLS_INIT,
  };
};

const showSetMeetingPollsSuccess = (message) => {
  return {
    type: actions.SET_MEETING_POLLS_INIT,
    message: message,
  };
};

const showSetMeetingPollsFailed = (message) => {
  return {
    type: actions.SET_MEETING_POLLS_INIT,
    message: message,
  };
};

const SetMeetingPollsApiFunc = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showSetMeetingPollsInit());
    let form = new FormData();
    form.append("RequestMethod", SetMeetingPolls.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: pollApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SetMeetingPollsApiFunc(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SetMeetingPolls_01".toLowerCase()
                )
            ) {
              dispatch(
                showSetMeetingPollsSuccess(
                  response.data.responseResult.responseMessage,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SetMeetingPolls_02".toLowerCase()
                )
            ) {
              dispatch(showSetMeetingPollsFailed(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SetMeetingPolls_03".toLowerCase()
                )
            ) {
              dispatch(showSetMeetingPollsFailed(t("Something-went-wrong")));
            } else {
              dispatch(showSetMeetingPollsFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(showSetMeetingPollsFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showSetMeetingPollsFailed(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(showSetMeetingPollsFailed(t("Something-went-wrong")));
      });
  };
};

//get ALl Proposed Dates

const showGetAllProposedMeetingDatesInit = () => {
  return {
    type: actions.GET_ALL_PRPOSED_DATES_INIT,
  };
};

const showGetAllProposedMeetingDatesSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_PRPOSED_DATES_SUCCESS,
    response: response,
    message: message,
  };
};

const showGetAllProposedMeetingDatesFailed = (message) => {
  return {
    type: actions.GET_ALL_PRPOSED_DATES_SUCCESS,
    message: message,
  };
};

const GetAllProposedMeetingDateApiFunc = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showGetAllProposedMeetingDatesInit());
    let form = new FormData();
    form.append("RequestMethod", getAllPropsedMeetingdates.RequestMethod);
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
          dispatch(GetAllProposedMeetingDateApiFunc(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingProposedDates_01".toLowerCase()
                )
            ) {
              dispatch(
                showGetAllProposedMeetingDatesSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingProposedDates_02".toLowerCase()
                )
            ) {
              dispatch(
                showGetAllProposedMeetingDatesFailed(t("No-record-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingProposedDates_03".toLowerCase()
                )
            ) {
              dispatch(
                showGetAllProposedMeetingDatesFailed(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                showGetAllProposedMeetingDatesFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              showGetAllProposedMeetingDatesFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            showGetAllProposedMeetingDatesFailed(t("Something-went-wrong"))
          );
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(
          showGetAllProposedMeetingDatesFailed(t("Something-went-wrong"))
        );
      });
  };
};

//Set Proposed Meeting Data

const showPrposedMeetingDateInit = () => {
  return {
    type: actions.SET_MEETING_PROPOSED_DATE_INIT,
  };
};

const showPrposedMeetingDateSuccess = (response, message) => {
  return {
    type: actions.SET_MEETING_PROPOSED_DATE_SUCCESS,
    response: response,
    message: message,
  };
};

const showPrposedMeetingDateFailed = (message) => {
  return {
    type: actions.SET_MEETING_PROPOSED_DATE_FAILED,
    message: message,
  };
};

const setProposedMeetingDateApiFunc = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showPrposedMeetingDateInit());
    let form = new FormData();
    form.append("RequestMethod", SettingMeetingProposedDates.RequestMethod);
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
          dispatch(setProposedMeetingDateApiFunc(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetMeetingProposedDates_01".toLowerCase()
                )
            ) {
              dispatch(
                showPrposedMeetingDateSuccess(
                  response.data.responseResult.responseMessage,
                  t("Record-saved")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetMeetingProposedDates_02".toLowerCase()
                )
            ) {
              dispatch(showPrposedMeetingDateFailed(t("No-record-saved")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetMeetingProposedDates_03".toLowerCase()
                )
            ) {
              dispatch(showPrposedMeetingDateFailed(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetMeetingProposedDates_04".toLowerCase()
                )
            ) {
              dispatch(
                showPrposedMeetingDateFailed(
                  t("Not-more-than-5-dates-are-allowed")
                )
              );
            } else {
              dispatch(showPrposedMeetingDateFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(showPrposedMeetingDateFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showPrposedMeetingDateFailed(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(showPrposedMeetingDateFailed(t("Something-went-wrong")));
      });
  };
};

//set Proposed Meeting Response Api

const showPrposedMeetingReponsneInit = () => {
  return {
    type: actions.SET_MEETING_RESPONSE_INIT,
  };
};

const showPrposedMeetingReponsneSuccess = (response, message) => {
  return {
    type: actions.SET_MEETING_RESPONSE_SUCCESS,
    response: response,
    message: message,
  };
};

const showPrposedMeetingReponsneFailed = (message) => {
  return {
    type: actions.SET_MEETING_RESPONSE_FAILED,
    message: message,
  };
};

const SetMeetingResponseApiFunc = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showPrposedMeetingReponsneInit());
    let form = new FormData();
    form.append("RequestMethod", setMeetingProposedDatesResponse.RequestMethod);
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
          dispatch(SetMeetingResponseApiFunc(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetMeetingProposedDatesResponse_01".toLowerCase()
                )
            ) {
              dispatch(
                showPrposedMeetingReponsneSuccess(
                  response.data.responseResult,
                  t("Record-saved")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetMeetingProposedDatesResponse_02".toLowerCase()
                )
            ) {
              dispatch(showPrposedMeetingReponsneFailed(t("No-record-saved")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetMeetingProposedDatesResponse_03".toLowerCase()
                )
            ) {
              dispatch(
                showPrposedMeetingReponsneFailed(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                showPrposedMeetingReponsneFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              showPrposedMeetingReponsneFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(showPrposedMeetingReponsneFailed(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(showPrposedMeetingReponsneFailed(t("Something-went-wrong")));
      });
  };
};

//Aun work on meeting Material Init
const meetingMaterialInit = () => {
  return {
    type: actions.GET_ALL_MEETING_MATERIAL_INIT,
  };
};

//Aun work on meeting Material Success
const meetingMaterialSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_MEETING_MATERIAL_SUCCESS,
    response: response,
    message: message,
  };
};

//Aun work on meeting Material Fail
const meetingMaterialFail = (message) => {
  return {
    type: actions.GET_ALL_MEETING_MATERIAL_FAIL,
    message: message,
  };
};

//Aun work on meeting Material Main API
const getMeetingMaterialAPI = (navigate, t, meetingMaterialData, rows) => {
  console.log(rows, "getMeetingMaterialAPI");
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(meetingMaterialInit());
    let form = new FormData();
    form.append("RequestMethod", getAllMeetingMaterial.RequestMethod);
    form.append("RequestData", JSON.stringify(meetingMaterialData));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(getMeetingMaterialAPI(navigate, t, meetingMaterialData));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllMeetingMaterial_01"
            ) {
              dispatch(
                meetingMaterialSuccess(
                  response.data.responseResult.parentAgendas,
                  t("Record-found")
                )
              );
              let newID;
              rows.map((data, index) => {
                newID = data.ID;
              });
              let NewData = {
                AgendaID: "1222",
              };
              console.log(NewData, "newIDnewIDnewID");
              dispatch(GetAllUserAgendaRightsApiFunc(navigate, t, NewData));
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllMeetingMaterial_02"
            ) {
              dispatch(
                meetingMaterialFail(
                  response.data.responseResult.responseMessage,
                  t("No-records-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllMeetingMaterial_03"
            ) {
              dispatch(
                meetingMaterialFail(
                  response.data.responseResult.responseMessage,
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(meetingMaterialFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(meetingMaterialFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(meetingMaterialFail(t("Something-went-wrong")));
      });
  };
};

const showUpdateMeetingAgendaLockStatusInit = () => {
  return {
    type: actions.UPDATE_MEETING_AGENDA_LOCK_STATUS_INIT,
  };
};

const showUpdateMeetingAgendaLockStatusSuccess = (response, message) => {
  return {
    type: actions.UPDATE_MEETING_AGENDA_LOCK_STATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const showUpdateMeetingAgendaLockStatusFailed = (message) => {
  return {
    type: actions.UPDATE_MEETING_AGENDA_LOCK_STATUS_FAILED,
    message: message,
  };
};

const UpateMeetingStatusLockApiFunc = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showUpdateMeetingAgendaLockStatusInit());
    let form = new FormData();
    form.append("RequestMethod", MeetingAgendaLock.RequestMethod);
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
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(UpateMeetingStatusLockApiFunc(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_SaveUserAttachmentPermission_01"
            ) {
              dispatch(
                showUpdateMeetingAgendaLockStatusSuccess(
                  response.data.responseResult.responseMessage,
                  t("Status-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_SaveUserAttachmentPermission_02"
            ) {
              dispatch(
                showUpdateMeetingAgendaLockStatusFailed(
                  response.data.responseResult.responseMessage,
                  t("status-not-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_SaveUserAttachmentPermission_03"
            ) {
              dispatch(
                showUpdateMeetingAgendaLockStatusFailed(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              showUpdateMeetingAgendaLockStatusFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            showUpdateMeetingAgendaLockStatusFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          showUpdateMeetingAgendaLockStatusFailed(t("Something-went-wrong"))
        );
      });
  };
};

const showGetAllUserAgendaRightsInit = () => {
  return {
    type: actions.GET_ALL_AGENDA_RIGHTS_INIT,
  };
};

const showGetAllUserAgendaRightsSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_AGENDA_RIGHTS_SUCCESS,
    response: response,
    message: message,
  };
};

const showGetAllUserAgendaRightsFailed = (message) => {
  return {
    type: actions.GET_ALL_AGENDA_RIGHTS_FAILED,
    message: message,
  };
};

const GetAllUserAgendaRightsApiFunc = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showGetAllUserAgendaRightsInit());
    let form = new FormData();
    form.append("RequestMethod", GetAllUserAgendaRights.RequestMethod);
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
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(GetAllUserAgendaRightsApiFunc(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllUserAgendaRights_01"
            ) {
              dispatch(
                showGetAllUserAgendaRightsSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllUserAgendaRights_02"
            ) {
              dispatch(
                showGetAllUserAgendaRightsFailed(
                  response.data.responseResult.responseMessage,
                  t("No-record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllUserAgendaRights_03"
            ) {
              dispatch(
                showGetAllUserAgendaRightsFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              showGetAllUserAgendaRightsFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(showGetAllUserAgendaRightsFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(showGetAllUserAgendaRightsFailed(t("Something-went-wrong")));
      });
  };
};

const SaveUserAttachmentPermissionsInit = () => {
  return {
    type: actions.SAVE_USER_ATTACHMENT_PERMISSION_INIT,
  };
};

const SaveUserAttachmentPermissionsSuccess = (response, message) => {
  return {
    type: actions.SAVE_USER_ATTACHMENT_PERMISSION_SUCCESS,
    response: response,
    message: message,
  };
};

const SaveUserAttachmentPermissionsFailed = (message) => {
  return {
    type: actions.SAVE_USER_ATTACHMENT_PERMISSION_SUCCESS,
    message: message,
  };
};

const SaveUserAttachmentsPermissionApiFunc = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(SaveUserAttachmentPermissionsInit());
    let form = new FormData();
    form.append("RequestMethod", saveUserAttachmentPermission.RequestMethod);
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
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(SaveUserAttachmentsPermissionApiFunc(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_SaveUserAttachmentPermission_01"
            ) {
              dispatch(
                SaveUserAttachmentPermissionsSuccess(
                  response.data.responseResult,
                  t("Record-saved")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_SaveUserAttachmentPermission_02 "
            ) {
              dispatch(
                SaveUserAttachmentPermissionsFailed(
                  response.data.responseResult.responseMessage,
                  t("No-record-saved")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_SaveUserAttachmentPermission_03"
            ) {
              dispatch(
                SaveUserAttachmentPermissionsFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              SaveUserAttachmentPermissionsFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            SaveUserAttachmentPermissionsFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          SaveUserAttachmentPermissionsFailed(t("Something-went-wrong"))
        );
      });
  };
};

// ADD General Minutes

const ShowADDGeneralMinutesInit = () => {
  return {
    type: actions.GET_ADD_GENERAL_MINUTES_INIT,
  };
};

const ShowADDGeneralMinutesSuccess = (response, message) => {
  return {
    type: actions.GET_ADD_GENERAL_MINUTES_SUCCESS,
    response: response,
    message: message,
  };
};

const ShowADDGeneralMinutesFailed = (message) => {
  return {
    type: actions.GET_ADD_GENERAL_MINUTES_FAILED,
    message: message,
  };
};

const ADDGeneralMinutesApiFunc = (navigate, t, Data, currentMeeting) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(ShowADDGeneralMinutesInit());
    let form = new FormData();
    form.append("RequestMethod", SaveminutesGeneral.RequestMethod);
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
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(ADDGeneralMinutesApiFunc(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_AddGeneralMinute_01"
            ) {
              dispatch(
                ShowADDGeneralMinutesSuccess(
                  response.data.responseResult.responseMessage,
                  t("Record-saved")
                )
              );
              let Meet = {
                MeetingID: Number(currentMeeting),
              };
              dispatch(getAllGeneralMinutesApiFunc(navigate, t, Meet));
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_AddGeneralMinute_02"
            ) {
              dispatch(
                ShowADDGeneralMinutesFailed(
                  response.data.responseResult.responseMessage,
                  t("No-record-saved")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_AddGeneralMinute_03"
            ) {
              dispatch(ShowADDGeneralMinutesFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(ShowADDGeneralMinutesFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(ShowADDGeneralMinutesFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(ShowADDGeneralMinutesFailed(t("Something-went-wrong")));
      });
  };
};

//Getting all the General Mintues

const ShowAllGeneralMinutesInit = () => {
  return {
    type: actions.GET_GENERAL_MINTES_INIT,
  };
};

const ShowAllGeneralMinutesSuccess = (response, message) => {
  return {
    type: actions.GET_GENERAL_MINTES_SUCCESS,
    response: response,
    message: message,
  };
};

const ShowAllGeneralMinutesFailed = (response, message) => {
  return {
    type: actions.GET_GENERAL_MINTES_FAILED,
    message: message,
  };
};

// Api Function For General Minutes
const getAllGeneralMinutesApiFunc = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(ShowAllGeneralMinutesInit());
    let form = new FormData();
    form.append("RequestMethod", getGeneralMinutes.RequestMethod);
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
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(getAllGeneralMinutesApiFunc(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetMeetingGeneralMinutes_01"
            ) {
              dispatch(
                ShowAllGeneralMinutesSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
              console.log(
                response.data.responseResult,
                "FK_MeetingGeneralMinutesID"
              );
              let MeetingDocs = {
                MDID: 1833,
              };
              dispatch(
                DocumentsOfMeetingGenralMinutesApiFunc(navigate, MeetingDocs, t)
              );

              // let FetchMinutesId;
              // response.data.responseResult.meetingMinutes.map(
              //   (dataMin, Indexmin) => {
              //     console.log(dataMin, "dataMindataMin");
              //     FetchMinutesId = dataMin.minuteID;
              //   }
              // );
              // let Retrive = {
              //   FK_MeetingGeneralMinutesID: FetchMinutesId,
              // };
              // dispatch(
              //   RetriveDocumentsMeetingGenralMinutesApiFunc(
              //     navigate,
              //     Retrive,
              //     t
              //   )
              // );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetMeetingGeneralMinutes_02"
            ) {
              dispatch(
                ShowAllGeneralMinutesFailed(
                  response.data.responseResult.responseMessage,
                  t("No-record-saved")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetMeetingGeneralMinutes_03"
            ) {
              dispatch(ShowAllGeneralMinutesFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(ShowAllGeneralMinutesFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(ShowAllGeneralMinutesFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(ShowAllGeneralMinutesFailed(t("Something-went-wrong")));
      });
  };
};

// Documents Upload And Save

// Upload Documents Init
const uploadDocument_init = () => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_INIT,
  };
};

// Upload Documents Success
const uploadDocument_success = (response, message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const uploadDocument_fail = (message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_FAIL,
    message: message,
  };
};

// Upload Documents API for Resolution
const uploadDocumentsMeetingMinutesApi = (
  navigate,
  t,
  data,
  folderID,
  newFolder
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return async (dispatch) => {
    dispatch(uploadDocument_init());
    let form = new FormData();
    form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
    form.append("File", data);
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            uploadDocumentsMeetingMinutesApi(navigate, t, data, folderID)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_01".toLowerCase()
                )
            ) {
              await dispatch(
                saveFilesMeetingMinutesApi(
                  navigate,
                  t,
                  response.data.responseResult,
                  folderID,
                  newFolder
                )
              );
              await dispatch(
                uploadDocument_success(
                  response.data.responseResult,
                  t("Document-uploaded-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase()
                )
            ) {
              dispatch(uploadDocument_fail(t("Failed-to-update-document")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
                )
            ) {
              dispatch(uploadDocument_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(uploadDocument_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(uploadDocument_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(uploadDocument_fail(t("Something-went-wrong")));
      });
  };
};

// Save Files Init
const saveFiles_init = () => {
  return {
    type: actions.SAVEFILES_DATAROOM_INIT,
  };
};

// Save Files Success
const saveFiles_success = (response, message) => {
  return {
    type: actions.SAVEFILES_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

// Save Files Fail
const saveFiles_fail = (message) => {
  return {
    type: actions.SAVEFILES_DATAROOM_FAIL,
    message: message,
  };
};

// Save Files API for Resolution
const saveFilesMeetingMinutesApi = (navigate, t, data, folderID, newFolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  let Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: [
      {
        DisplayFileName: data.displayFileName,
        DiskusFileName: JSON.parse(data.diskusFileName),
        ShareAbleLink: data.shareAbleLink,
        FK_UserID: JSON.parse(creatorID),
        FK_OrganizationID: JSON.parse(organizationID),
      },
    ],
    UserID: JSON.parse(creatorID),
    Type: 0,
  };
  return async (dispatch) => {
    dispatch(saveFiles_init());
    let form = new FormData();
    form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(saveFilesMeetingMinutesApi(navigate, t, data, newFolder));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase()
                )
            ) {
              let newData = {
                pK_FileID: response.data.responseResult.fileID,
                DisplayAttachmentName: data.displayFileName,
              };
              newFolder.push(newData);
              await dispatch(
                saveFiles_success(newData, t("Files-saved-successfully"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
                )
            ) {
              dispatch(saveFiles_fail(t("Failed-to-save-any-file")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
                )
            ) {
              dispatch(saveFiles_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveFiles_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveFiles_fail(t("Something-went-wrong")));
        }
        console.log(response);
      })
      .catch(() => {
        dispatch(saveFiles_fail(t("Something-went-wrong")));
      });
  };
};

//Save Minutes Documents

const showSaveMinutesDocsInit = () => {
  return {
    type: actions.SAVE_GENERAL_MIN_DOCUMENTS_INIT,
  };
};

const showSaveMinutesDocsSuccess = (response, message) => {
  return {
    type: actions.SAVE_GENERAL_MIN_DOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

const showSaveMinutesDocsFailed = (message) => {
  return {
    type: actions.SAVE_GENERAL_MIN_DOCUMENTS_FAILED,
    message: message,
  };
};

//SAVE GROUPS DOCUMENTS API

const SaveMinutesDocumentsApiFunc = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(showSaveMinutesDocsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", SaveGeneralWiseSavingDocuments.RequestMethod);
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SaveMinutesDocumentsApiFunc(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveGeneralMinutesDocuments_01".toLowerCase()
                )
            ) {
              await dispatch(
                showSaveMinutesDocsSuccess(
                  response.data.responseResult,
                  t("List-updated-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveGeneralMinutesDocuments_02".toLowerCase()
                )
            ) {
              dispatch(showSaveMinutesDocsFailed(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(showSaveMinutesDocsFailed(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(showSaveMinutesDocsFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(showSaveMinutesDocsFailed(t("Something-went-wrong")));
      });
  };
};

//general minutes Retrive documents

const showRetriveGeneralMinutesDocsInit = () => {
  return {
    type: actions.RETRIEVE_DOCUMENT_GENERAL_MINUTES_INIT,
  };
};

const showRetriveGeneralMinutesDocsSuccess = (response, message) => {
  return {
    type: actions.RETRIEVE_DOCUMENT_GENERAL_MINUTES_SUCCESS,
    response: response,
    message: message,
  };
};

const showRetriveGeneralMinutesDocsFailed = (message) => {
  return {
    type: actions.RETRIEVE_DOCUMENT_GENERAL_MINUTES_INIT,
    message: message,
  };
};

const RetriveDocumentsMeetingGenralMinutesApiFunc = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(showRetriveGeneralMinutesDocsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", RetriveGeneralMinutesDocuments.RequestMethod);
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            RetriveDocumentsMeetingGenralMinutesApiFunc(navigate, Data, t)
          );
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveGeneralMinuteDocuments_01".toLowerCase()
                )
            ) {
              await dispatch(
                showRetriveGeneralMinutesDocsSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveGeneralMinuteDocuments_02".toLowerCase()
                )
            ) {
              dispatch(
                showRetriveGeneralMinutesDocsFailed(t("No-data-available"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveGeneralMinuteDocuments_03".toLowerCase()
                )
            ) {
              dispatch(
                showRetriveGeneralMinutesDocsFailed(t("Something-went-wrong"))
              );
            }
          } else {
            console.log(response, "response");
            dispatch(
              showRetriveGeneralMinutesDocsFailed(t("Something-went-wrong"))
            );
          }
        } else {
          console.log(response, "response");
          dispatch(
            showRetriveGeneralMinutesDocsFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(
          showRetriveGeneralMinutesDocsFailed(t("Something-went-wrong"))
        );
      });
  };
};

//Retrive Document For Meeting
const showRetriveGeneralMinutesDocsMeetingInit = () => {
  return {
    type: actions.GENERAL_DOCUMENT_FOR_MEETING_INIT,
  };
};

const showRetriveGeneralMinutesDocsMeetingSuccess = (response, message) => {
  return {
    type: actions.GENERAL_DOCUMENT_FOR_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

const showRetriveGeneralMinutesDocsMeetingFailed = (message) => {
  return {
    type: actions.GENERAL_DOCUMENT_FOR_MEETING_FAILED,
    message: message,
  };
};

const DocumentsOfMeetingGenralMinutesApiFunc = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(showRetriveGeneralMinutesDocsMeetingInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllGeneralMiintuesDocument.RequestMethod);
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DocumentsOfMeetingGenralMinutesApiFunc(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetAllGeneralMiuteDocumentsForMeeting_01".toLowerCase()
                )
            ) {
              await dispatch(
                showRetriveGeneralMinutesDocsMeetingSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetAllGeneralMiuteDocumentsForMeeting_02".toLowerCase()
                )
            ) {
              dispatch(
                showRetriveGeneralMinutesDocsMeetingFailed(
                  t("No-data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetAllGeneralMiuteDocumentsForMeeting_03".toLowerCase()
                )
            ) {
              dispatch(
                showRetriveGeneralMinutesDocsMeetingFailed(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            console.log(response, "response");
            dispatch(
              showRetriveGeneralMinutesDocsMeetingFailed(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          console.log(response, "response");
          dispatch(
            showRetriveGeneralMinutesDocsMeetingFailed(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(
          showRetriveGeneralMinutesDocsMeetingFailed(t("Something-went-wrong"))
        );
      });
  };
};

// GET USER WISE PROPOSED API
const getProposedWiseInit = () => {
  return {
    type: actions.GET_USER_WISE_PROPOSED_INIT,
  };
};

const getProposedWiseSuccess = (response, message) => {
  return {
    type: actions.GET_USER_WISE_PROPOSED_SUCCESS,
    response,
    message,
  };
};

const getProposedWiseFail = (message) => {
  return {
    type: actions.GET_USER_WISE_PROPOSED_FAIL,
    message,
  };
};

const getUserProposedWiseApi = (navigate, t, proposedData) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getProposedWiseInit());
    let form = new FormData();
    form.append("RequestMethod", getUserWiseProposeDate.RequestMethod);
    form.append("RequestData", JSON.stringify(proposedData));
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
          dispatch(getUserProposedWiseApi(navigate, t, proposedData));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUserWiseProposedDates_01".toLowerCase()
                )
            ) {
              dispatch(
                getProposedWiseSuccess(
                  response.data.responseResult.responseMessage,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUserWiseProposedDates_02".toLowerCase()
                )
            ) {
              dispatch(getProposedWiseFail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUserWiseProposedDates_03".toLowerCase()
                )
            ) {
              dispatch(getProposedWiseFail(t("Something-went-wrong")));
            } else {
              dispatch(getProposedWiseFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getProposedWiseFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getProposedWiseFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getProposedWiseFail(t("Something-went-wrong")));
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
  GetAllMeetingDetailsApiFunc,
  ClearMessegeMeetingdetails,
  sendRecentNotificationOrganizerModal,
  GetAllPollsByMeetingIdApiFunc,
  GetAllMeetingUserApiFunc,
  SetMeetingPollsApiFunc,
  setProposedMeetingDateApiFunc,
  GetAllProposedMeetingDateApiFunc,
  SetMeetingResponseApiFunc,
  getMeetingMaterialAPI,
  GetAllUserAgendaRightsApiFunc,
  SaveUserAttachmentsPermissionApiFunc,
  getAllGeneralMinutesApiFunc,
  ADDGeneralMinutesApiFunc,
  uploadDocumentsMeetingMinutesApi,
  saveFilesMeetingMinutesApi,
  RetriveDocumentsMeetingGenralMinutesApiFunc,
  SaveMinutesDocumentsApiFunc,
  DocumentsOfMeetingGenralMinutesApiFunc,
  getUserProposedWiseApi,
  showGetAllMeetingDetialsFailed,
};
