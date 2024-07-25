import * as actions from "../action_types";
import axios from "axios";
import {
  dataRoomApi,
  meetingApi,
  pollApi,
} from "../../commen/apis/Api_ends_points";
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
  DeleteGeneralMinutes,
  UpdateGeneralMinutes,
  agenwiseMinutes,
  DeleteagendaWiseMinutes,
  updateAgendaWiseMinutes,
  getAllAgendaWiseMinutes,
  getUserWiseProposeDate,
  saveDocumentAgendaWiseMinutes,
  RetriveAgendaWiseDocuments,
  getMeetingbyCommitteeIDRM,
  setMeetingbyCommitteeIDRM,
  DeleteDocumentGenralMinute,
  DeleteAgendaWiseDocuments,
  CreateUpdateMeetingDataroomMapped,
  ScheduleMeetingOnSelectedDate,
  UpdateMeetingUserhit,
  setMeetingbyGroupIDRM,
  getMeetingbyGroupIDRM,
  getAdvanceMeetingAgendabyMeetingID,
  getAllagendaWiseDocumentsApi,
  inviteForCollaboration,
  validateEncryptedStringUserAvailabilityForMeeting,
  getAllCommittesandGroupsforPolls,
  getUserWiseProposeDateOrganizer,
  endMeetingStatus,
  joinMeeting,
  leaveMeeting,
  ValidateEmailRelatedString,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import {
  groupCallRecipients,
  callRequestReceivedMQTT,
  LeaveCall,
} from "./VideoMain_actions";
import {
  maximizeVideoPanelFlag,
  normalizeVideoPanelFlag,
  videoChatPanel,
} from "./VideoFeature_actions";
import { ViewMeeting } from "./Get_List_Of_Assignees";
import { SaveMeetingOrganizers } from "./MeetingOrganizers_action";
import {
  createConvert,
  getCurrentDateTimeUTC,
} from "../../commen/functions/date_formater";
import { getAllUnpublishedMeetingData } from "../../hooks/meetingResponse/response";
import { GetAdvanceMeetingAgendabyMeetingID } from "./MeetingAgenda_action";
import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";
import { ResendUpdatedMinuteForReview } from "./Minutes_action";

const boardDeckModal = (response) => {
  return {
    type: actions.BOARD_DECK_MODAL,
    response: response,
  };
};

const boardDeckShareModal = (response) => {
  return {
    type: actions.BOARD_DECK_SHARE_MODAL,
    response: response,
  };
};

const boardDeckEmailModal = (response) => {
  return {
    type: actions.BOARD_DECK_EMAIL_MODAL,
    response: response,
  };
};

const ClearMessegeMeetingdetails = () => {
  return {
    type: actions.CLEAR_MEETING_DETAILS,
  };
};

const CleareMessegeNewMeeting = () => {
  return {
    type: actions.CLEAR_MEETING_MESSAGES,
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

const deleteSavedPollsMeeting = (response) => {
  return {
    type: actions.DELETE_POLL_MEETING,
    response: response,
  };
};

const editFlowDeleteSavedPollsMeeting = (response) => {
  return {
    type: actions.EDIT_FLOW_DELETE_POLL_MEETING,
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

const handlegetAllMeetingTypesSuccess = (response, message, loader) => {
  return {
    type: actions.GET_ALL_MEETING_TYPES_NEW_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};

const handlegetAllMeetingTypesFailed = (message, loader) => {
  return {
    type: actions.GET_ALL_MEETING_TYPES_NEW_FAILED,
    message: message,
    loader: loader,
  };
};

const GetAllMeetingTypesNewFunction = (navigate, t, loader) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(handlegetAllMeetingTypesInit());
    let form = new FormData();
    form.append("RequestMethod", getallMeetingType.RequestMethod);

    try {
      const response = await axios({
        method: "post",
        url: meetingApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        // Retry the API request
        await dispatch(GetAllMeetingTypesNewFunction(navigate, t, loader));
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
                "",
                loader
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
            dispatch(handlegetAllMeetingTypesFailed(t("Something-went-wrong")));
          } else {
            dispatch(handlegetAllMeetingTypesFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(handlegetAllMeetingTypesFailed(t("Something-went-wrong")));
        }
      } else {
        dispatch(handlegetAllMeetingTypesFailed(t("Something-went-wrong")));
      }
    } catch (error) {
      dispatch(handlegetAllMeetingTypesFailed(t("Something-went-wrong")));
    }
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
  setCurrentMeetingID,
  currentMeeting,
  meetingDetails,
  setDataroomMapFolderId,
  members,
  rows,
  ResponseDate,
  setProposedNewMeeting
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
              setCurrentMeetingID,
              currentMeeting,
              meetingDetails,
              setDataroomMapFolderId,
              members,
              rows,
              ResponseDate,
              setProposedNewMeeting
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
              localStorage.setItem(
                "currentMeetingLS",
                response.data.responseResult.meetingID
              );
              let MeetID = response.data.responseResult.meetingID;
              setCurrentMeetingID(response.data.responseResult.meetingID);
              dispatch(
                handleSaveMeetingSuccess(response.data.responseResult, "")
              );
              if (viewValue === 1) {
                let MappedData = {
                  MeetingID: response.data.responseResult.meetingID,
                  MeetingTitle: meetingDetails.MeetingTitle,
                  IsUpdateFlow: false,
                };
                dispatch(
                  CreateUpdateMeetingDataRoomMapeedApiFunc(
                    navigate,
                    MappedData,
                    t,
                    setDataroomMapFolderId,
                    members,
                    MeetID,
                    rows,
                    ResponseDate,
                    setProposedNewMeeting
                  )
                );
                // setSceduleMeeting(false);
              } else if (viewValue === 2) {
                if (Number(data.MeetingDetails.MeetingStatusID) === 1) {
                  setSceduleMeeting(false);
                  dispatch(scheduleMeetingPageFlag(false));

                  dispatch(
                    handleSaveMeetingSuccess(
                      response.data.responseResult,
                      t("Meeting-details-updated-and-published-successfully")
                    )
                  );
                  dispatch(meetingDetailsGlobalFlag(false));
                  dispatch(organizersGlobalFlag(true));
                  dispatch(agendaContributorsGlobalFlag(false));
                  dispatch(participantsGlobalFlag(false));
                  dispatch(agendaGlobalFlag(false));
                  dispatch(meetingMaterialGlobalFlag(false));
                  dispatch(minutesGlobalFlag(false));
                  dispatch(proposedMeetingDatesGlobalFlag(false));
                  dispatch(actionsGlobalFlag(false));
                  dispatch(pollsGlobalFlag(false));
                  dispatch(attendanceGlobalFlag(false));
                  dispatch(uploadGlobalFlag(false));
                  let currentView = localStorage.getItem("MeetingCurrentView");
                  let meetingpageRow = localStorage.getItem("MeetingPageRows");
                  let meetingPageCurrent = parseInt(
                    localStorage.getItem("MeetingPageCurrent")
                  );
                  let userID = localStorage.getItem("userID");
                  let searchData = {
                    Date: "",
                    Title: "",
                    HostName: "",
                    UserID: Number(userID),
                    PageNumber:
                      meetingPageCurrent !== null
                        ? Number(meetingPageCurrent)
                        : 1,
                    Length:
                      meetingpageRow !== null ? Number(meetingpageRow) : 50,
                    PublishedMeetings:
                      currentView && Number(currentView) === 1 ? true : false,
                  };
                  await dispatch(searchNewUserMeeting(navigate, searchData, t));
                } else {
                  let Data = {
                    MeetingID: Number(response.data.responseResult.meetingID),
                  };
                  await dispatch(
                    GetAllMeetingDetailsApiFunc(
                      navigate,
                      t,
                      Data,
                      true,
                      setCurrentMeetingID,
                      setSceduleMeeting,
                      setDataroomMapFolderId,
                      data.MeetingDetails.MeetingStatusID
                    )
                  );

                  dispatch(meetingDetailsGlobalFlag(false));
                  dispatch(organizersGlobalFlag(true));
                  dispatch(agendaContributorsGlobalFlag(false));
                  dispatch(participantsGlobalFlag(false));
                  dispatch(agendaGlobalFlag(false));
                  dispatch(meetingMaterialGlobalFlag(false));
                  dispatch(minutesGlobalFlag(false));
                  dispatch(proposedMeetingDatesGlobalFlag(false));
                  dispatch(actionsGlobalFlag(false));
                  dispatch(pollsGlobalFlag(false));
                  dispatch(attendanceGlobalFlag(false));
                  dispatch(uploadGlobalFlag(false));
                  setorganizers(true);
                  setmeetingDetails(false);
                  // let MappedData = {
                  //   MeetingID: response.data.responseResult.meetingID,
                  //   MeetingTitle: meetingDetails.MeetingTitle,
                  //   IsUpdateFlow: false,
                  // };
                  // dispatch(
                  //   CreateUpdateMeetingDataRoomMapeedApiFunc(
                  //     navigate,
                  //     MappedData,
                  //     t,
                  //     setDataroomMapFolderId,
                  //     viewValue
                  //   )
                  // );
                }

                // setSceduleMeeting(false);
              } else if (viewValue === 3) {
                setorganizers(true);
                setmeetingDetails(false);
              } else if (viewValue === 4) {
                let MappedData = {
                  MeetingID: response.data.responseResult.meetingID,
                  MeetingTitle: meetingDetails.MeetingTitle,
                  IsUpdateFlow: true,
                };
                await dispatch(
                  CreateUpdateMeetingDataRoomMapeedApiFunc(
                    navigate,
                    MappedData,
                    t,
                    setDataroomMapFolderId
                  )
                );
                let Data = {
                  MeetingID: Number(response.data.responseResult.meetingID),
                };
                // await dispatch(
                //   GetAllMeetingDetailsApiFunc(
                //     navigate,
                //     t,
                //     Data,
                //     true,
                //     setCurrentMeetingID,
                //     setSceduleMeeting,
                //     setDataroomMapFolderId,
                //     data.MeetingDetails.MeetingStatusID
                //   )
                // );
                dispatch(meetingDetailsGlobalFlag(false));
                dispatch(organizersGlobalFlag(true));
                dispatch(agendaContributorsGlobalFlag(false));
                dispatch(participantsGlobalFlag(false));
                dispatch(agendaGlobalFlag(false));
                dispatch(meetingMaterialGlobalFlag(false));
                dispatch(minutesGlobalFlag(false));
                dispatch(proposedMeetingDatesGlobalFlag(false));
                dispatch(actionsGlobalFlag(false));
                dispatch(pollsGlobalFlag(false));
                dispatch(attendanceGlobalFlag(false));
                dispatch(uploadGlobalFlag(false));
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
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingDetails_05".toLowerCase()
                )
            ) {
              dispatch(
                handleSaveMeetingFailed(t("Add-meeting-agenda-to-publish"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingDetails_06".toLowerCase()
                )
            ) {
              dispatch(
                handleSaveMeetingFailed(t("Add-meeting-organizers-to-publish"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingDetails_07".toLowerCase()
                )
            ) {
              dispatch(
                handleSaveMeetingFailed(
                  t("Add-meeting-participants-to-publish")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingDetails_08".toLowerCase()
                )
            ) {
              dispatch(
                handleSaveMeetingFailed(
                  t("Meeting-cannot-be-published-after-time-has-elapsed")
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
  return async (dispatch) => {
    // dispatch(handlegetallReminderFrequencyInit());
    let form = new FormData();
    form.append("RequestMethod", GetMeetingNewFrequencyReminder.RequestMethod);

    try {
      const response = await axios({
        method: "post",
        url: meetingApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        // Retry the API request
        await dispatch(GetAllMeetingRemindersApiFrequencyNew(navigate, t));
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
                ""
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_GetMeetingReminders_02".toLowerCase()
              )
          ) {
            dispatch(handlegetallReminderFrequencyFailed(t("No-record-found")));
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
    } catch (error) {
      // Retry the API request in case of an error
      await dispatch(GetAllMeetingRemindersApiFrequencyNew(navigate, t));
    }
  };
};

const handleReucrringInit = () => {
  return {
    type: actions.GET_ALL_RECURRING_INIT,
  };
};

const handleReucrringSuccess = (response, message, loader) => {
  return {
    type: actions.GET_ALL_RECURRING_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};

const handleReucrringFailed = (message, loader) => {
  return {
    type: actions.GET_ALL_RECURRING_FAILED,
    message: message,
    loader: loader,
  };
};

//Functions Get All Meeting Recurring API
const GetAllMeetingRecurringApiNew = (navigate, t, loader) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    // dispatch(handleReucrringInit());
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
                handleReucrringSuccess(response.data.responseResult, "", loader)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllRecurringFactor_02".toLowerCase()
                )
            ) {
              dispatch(handleReucrringFailed(t("No-record-found"), loader));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllRecurringFactor_03".toLowerCase()
                )
            ) {
              dispatch(
                handleReucrringFailed(t("Something-went-wrong"), loader)
              );
            } else {
              dispatch(
                handleReucrringFailed(t("Something-went-wrong"), loader)
              );
            }
          } else {
            dispatch(handleReucrringFailed(t("Something-went-wrong"), loader));
          }
        } else {
          dispatch(handleReucrringFailed(t("Something-went-wrong"), loader));
        }
      })
      .catch((response) => {
        dispatch(handleReucrringFailed(t("Something-went-wrong"), loader));
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
              let getMeetingData = await getAllUnpublishedMeetingData(
                response.data.responseResult.meetings,
                1
              );
              console.log(
                getMeetingData,
                "getMeetingDatagetMeetingDatagetMeetingData"
              );
              let newMeetingData = {
                meetingStartedMinuteAgo:
                  response.data.responseResult.meetingStartedMinuteAgo,
                meetings: getMeetingData,
                pageNumbers: response.data.responseResult.pageNumbers,
                totalRecords: response.data.responseResult.totalRecords,
              };
              dispatch(SearchMeeting_Success(newMeetingData, ""));
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

const viewMeetingFlag = (response) => {
  return {
    type: actions.VIEW_MEETING_FLAG,
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
                showAddMoreParticipantsSuccess(response.data.responseResult, "")
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
  return async (dispatch) => {
    await dispatch(showParticipantsRolesInit());
    let form = new FormData();
    form.append("RequestMethod", getParticipantsRoles.RequestMethod);
    await axios({
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
                showParticipantsRolesSuccess(response.data.responseResult, "")
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
const FetchMeetingURLApi = (
  Data,
  navigate,
  t,
  currentUserID,
  currentOrganization,
  flag
) => {
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
          dispatch(
            FetchMeetingURLApi(
              Data,
              navigate,
              t,
              currentUserID,
              currentOrganization,
              flag
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingVideoURL_01".toLowerCase()
                )
            ) {
              dispatch(showMeetingURLSuccess(response.data.responseResult, ""));
              dispatch(MeetingUrlSpinner(false));
              let meetingURL = response.data.responseResult.videoURL;
              var match = meetingURL.match(/RoomID=([^&]*)/);
              let initiateRoomID = localStorage.getItem("initiateCallRoomID");
              let acceptedRoomID = localStorage.getItem("activeRoomID");
              let initiateVideoCallFlag = JSON.parse(
                localStorage.getItem("initiateVideoCall")
              );
              let currentCallType = JSON.parse(
                localStorage.getItem("CallType")
              );
              let activeCallStatus = JSON.parse(
                localStorage.getItem("activeCall")
              );
              let meetingStatus = JSON.parse(localStorage.getItem("isMeeting"));
              let Data = {
                OrganizationID: currentOrganization,
                RoomID: acceptedRoomID,
                IsCaller: initiateVideoCallFlag === true ? true : false,
                CallTypeID: currentCallType,
              };
              if (activeCallStatus === true && meetingStatus === false) {
                dispatch(LeaveCall(Data, navigate, t));
                localStorage.setItem("isCaller", false);
              }
              localStorage.setItem("CallType", 2);
              localStorage.setItem("callTypeID", 2);
              localStorage.setItem("activeCall", true);
              localStorage.setItem("isMeeting", true);
              localStorage.setItem("callerID", 9999);
              localStorage.setItem("acceptedRoomID", match[1]);
              localStorage.setItem("activeRoomID", match[1]);
              localStorage.setItem("acceptedRecipientID", currentUserID);
              localStorage.setItem("isMeetingVideo", true);
              localStorage.setItem(
                "meetingTitle",
                response.data.responseResult.meetingTitle
              );
              dispatch(callRequestReceivedMQTT({}, ""));
              if (flag === 0) {
                dispatch(maximizeVideoPanelFlag(true));
              } else {
                dispatch(normalizeVideoPanelFlag(true));
              }
              dispatch(videoChatPanel(false));
              // dispatch(groupCallRecipients(groupCallActiveUsers))
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

const clipboardURLMeetingData = (response) => {
  return {
    type: actions.GET_MEETING_URL_CLIPBOARD,
    response: response,
  };
};

const FetchMeetingURLClipboard = (
  Data,
  navigate,
  t,
  currentUserID,
  currentOrganization
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
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
          dispatch(
            FetchMeetingURLClipboard(
              Data,
              navigate,
              t,
              currentUserID,
              currentOrganization
            )
          );
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
                clipboardURLMeetingData(response.data.responseResult.videoURL)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingVideoURL_02".toLowerCase()
                )
            ) {
              dispatch(clipboardURLMeetingData(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingVideoURL_03".toLowerCase()
                )
            ) {
              dispatch(clipboardURLMeetingData(""));
            } else {
              dispatch(clipboardURLMeetingData(""));
            }
          } else {
            dispatch(clipboardURLMeetingData(""));
          }
        } else {
          dispatch(clipboardURLMeetingData(""));
        }
      })
      .catch((response) => {
        dispatch(clipboardURLMeetingData(""));
      });
  };
};

//Save Participants

const showSavedParticipantsInit = () => {
  return {
    type: actions.SAVE_MEETING_PARTICIPANTS_INIT,
  };
};

const showSaveParticipantsSuccess = (response, message, loader) => {
  return {
    type: actions.SAVE_MEETING_PARTICIPANTS_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};

const showSaveParticipantsFailed = (message) => {
  return {
    type: actions.SAVE_MEETING_PARTICIPANTS_FAILED,
    message: message,
  };
};

//Saving the participants Api
const SaveparticipantsApi = (
  Data,
  navigate,
  t,
  currentMeeting,
  flag,
  rows,
  ResponseDate,
  loader,
  setProposedNewMeeting
) => {
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
          dispatch(
            SaveparticipantsApi(
              Data,
              navigate,
              t,
              currentMeeting,
              flag,
              rows,
              ResponseDate,
              loader,
              setProposedNewMeeting
            )
          );
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
                  t("Participants-details-updated-successfully"),
                  loader
                )
              );
              if (flag === true) {
                console.log(rows, "flagflag");

                let Data = {
                  MeetingID: currentMeeting,
                  SendResponsebyDate: ResponseDate,
                  ProposedDates: rows,
                };
                dispatch(
                  setProposedMeetingDateApiFunc(
                    Data,
                    navigate,
                    t,
                    true,
                    setProposedNewMeeting
                  )
                );
              } else {
                let Data = {
                  MeetingID: Number(currentMeeting),
                };
                dispatch(GetAllSavedparticipantsAPI(Data, navigate, t));
              }
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

const getAllAgendaContributor_isPublished_success = (response, message) => {
  return {
    type: actions.GET_ALL_AGENDACONTRIBUTOR_ISPUBLISHED_SUCCESS,
    response,
  };
};

const getAllAgendaContributor_allowRSVP = (response, message) => {
  return {
    type: actions.GET_ALL_AGENDACONTRIBUTOR_ALLOWRSVP,
    response,
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
                  ""
                )
              );
              dispatch(
                getAllAgendaContributor_isPublished_success(
                  response.data.responseResult.isPublished
                )
              );
              dispatch(
                getAllAgendaContributor_allowRSVP(
                  response.data.responseResult.allowRSVP
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingAgendaContributors_02".toLowerCase()
                )
            ) {
              dispatch(getAllAgendaContributor_fail(""));
              dispatch(
                getAllAgendaContributor_isPublished_success(
                  response.data.responseResult.isPublished
                )
              );
              dispatch(
                getAllAgendaContributor_allowRSVP(
                  response.data.responseResult.allowRSVP
                )
              );
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

const saveAgendaContributors = (navigate, t, data, currentMeeting, flag) => {
  let token = JSON.parse(localStorage.getItem("token"));

  let getAllData = {
    MeetingID:
      currentMeeting !== null && currentMeeting !== undefined
        ? Number(currentMeeting)
        : 0,
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
          dispatch(
            saveAgendaContributors(navigate, t, data, currentMeeting, flag)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveAgendaContributors_01".toLowerCase()
                )
            ) {
              if (flag === 1) {
                // Update
                dispatch(
                  saveAgendaContributors_success(
                    t("Agenda-contributor-updated")
                  )
                );
              } else if (flag === 0) {
                // Added
                dispatch(
                  saveAgendaContributors_success(t("Agenda-contributor-added"))
                );
              }
              // await dispatch(
              //   saveAgendaContributors_success(t("Record-Inserted"))
              // );
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

const showAllMeetingParticipantsIsPublishedSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_SAVED_PARTICIPATNS_ISPUBLISHED_SUCCESS,
    response: response,
  };
};

const showAllMeetingParticipantsAllowrsvp = (response, message) => {
  return {
    type: actions.GET_ALL_SAVED_PARTICIPATNS_ALLOWRSVP,
    response: response,
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
  return async (dispatch) => {
    dispatch(showAllMeetingParticipantsInit());
    let form = new FormData();
    form.append("RequestMethod", getAllSavedParticipants.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
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
                  ""
                )
              );
              dispatch(
                showAllMeetingParticipantsIsPublishedSuccess(
                  response.data.responseResult.isPublished
                )
              );
              dispatch(
                showAllMeetingParticipantsAllowrsvp(
                  response.data.responseResult.allowRSVP
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingParticipants_02".toLowerCase()
                )
            ) {
              dispatch(showAllMeetingParticipantsFailed(""));
              dispatch(
                showAllMeetingParticipantsIsPublishedSuccess(
                  response.data.responseResult.isPublished
                )
              );
              dispatch(
                showAllMeetingParticipantsAllowrsvp(
                  response.data.responseResult.allowRSVP
                )
              );
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
                  ""
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

const showGetAllMeetingDetialsSuccess = (response, message, loader) => {
  return {
    type: actions.GET_ALL_MEETING_DETAILS_BY_MEETINGID_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};

const showGetAllMeetingDetialsFailed = (message) => {
  return {
    type: actions.GET_ALL_MEETING_DETAILS_BY_MEETINGID_FAILED,
    message: message,
  };
};
const cleareAllState = () => {
  return {
    type: actions.CLEARE_ALL_MEETING_STATE,
  };
};
//GET ALL MEETING DETAILS API Function
const GetAllMeetingDetailsApiFunc = (
  navigate,
  t,
  Data,
  loader,
  setCurrentMeetingID,
  setSceduleMeeting,
  setDataroomMapFolderId,
  viewValue,
  flag,
  role
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    await dispatch(showGetAllMeetingDetialsInit());
    let form = new FormData();
    form.append("RequestMethod", getAllMeetingDetailsByMeetingID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
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
              navigate,
              t,
              Data,
              loader,
              setCurrentMeetingID,
              setSceduleMeeting,
              setDataroomMapFolderId,
              viewValue,
              flag,
              role
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
              localStorage.setItem(
                "currentMeetingLS",
                response.data.responseResult.advanceMeetingDetails.meetingID
              );
              let MappedData = {
                MeetingID:
                  response.data.responseResult.advanceMeetingDetails.meetingID,
                MeetingTitle:
                  response.data.responseResult.advanceMeetingDetails
                    .meetingTitle,
                IsUpdateFlow:
                  viewValue !== null &&
                  viewValue !== undefined &&
                  viewValue !== 0 &&
                  Number(viewValue) === 11
                    ? false
                    : true,
              };
              if (flag !== undefined && flag != null) {
                if (flag === 1) {
                  await dispatch(GetAllMeetingTypesNewFunction(navigate, t));
                  // Reminder Frequency Drop Down API
                  await dispatch(
                    GetAllMeetingRemindersApiFrequencyNew(navigate, t)
                  );
                  // Recurring Drop Down API
                  await dispatch(
                    GetAllMeetingRecurringApiNew(navigate, t, true)
                  );
                }
              }
              console.log("hello loader check", loader);
              await dispatch(
                CreateUpdateMeetingDataRoomMapeedApiFunc(
                  navigate,
                  MappedData,
                  t,
                  setDataroomMapFolderId
                )
              );
              await dispatch(
                showGetAllMeetingDetialsSuccess(
                  response.data.responseResult,
                  "",
                  loader
                )
              );
              try {
                setSceduleMeeting(true);
                console.log("rolerole goes in this check");
                // dispatch(scheduleMeetingPageFlag(true));
                setCurrentMeetingID(Data.MeetingID);
                if (role === "Agenda Contributor") {
                  let agendaMeetingID = {
                    MeetingID: Data.MeetingID,
                  };
                  dispatch(
                    GetAdvanceMeetingAgendabyMeetingID(
                      agendaMeetingID,
                      navigate,
                      t
                    )
                  );
                }
              } catch {}
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
    type: actions.GET_POLLS_BY_MEETING_ID_FAILED,
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
                showPollsByMeetingIdSuccess(response.data.responseResult, "")
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
                showGetAllMeetingUsersSuccess(response.data.responseResult, "")
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
    type: actions.SET_MEETING_POLLS_SUCCESS,
    message: message,
  };
};

const showSetMeetingPollsFailed = (message) => {
  return {
    type: actions.SET_MEETING_POLLS_FAILED,
    message: message,
  };
};

const SetMeetingPollsApiFunc = (Data, navigate, t, currentMeeting) => {
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
              dispatch(showSetMeetingPollsSuccess(""));
              let OrganizationID = localStorage.getItem("organizationID");
              let Data1 = {
                MeetingID: currentMeeting,
                OrganizationID: Number(OrganizationID),
                CreatorName: "",
                PollTitle: "",
                PageNumber: 1,
                Length: 50,
              };
              dispatch(GetAllPollsByMeetingIdApiFunc(Data1, navigate, t));
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

const showGetAllProposedMeetingDatesSuccess = (response, message, flag) => {
  return {
    type: actions.GET_ALL_PRPOSED_DATES_SUCCESS,
    response: response,
    message: message,
    loader: flag,
  };
};

const showGetAllProposedMeetingDatesFailed = (message) => {
  return {
    type: actions.GET_ALL_PRPOSED_DATES_FAILED,
    message: message,
  };
};
const cleareAllProposedMeetingDates = () => {
  return {
    type: actions.CLEARE_ALL_PROPOSED_MEETING_DATES,
  };
};
const GetAllProposedMeetingDateApiFunc = (Data, navigate, t, flag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(showGetAllProposedMeetingDatesInit());
    let form = new FormData();
    form.append("RequestMethod", getAllPropsedMeetingdates.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
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
          dispatch(GetAllProposedMeetingDateApiFunc(Data, navigate, t, flag));
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
                  "",
                  flag
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
                showGetAllProposedMeetingDatesSuccess(
                  [],
                  t("No-record-found"),
                  flag
                )
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

const setProposedMeetingDateApiFunc = (
  Data,
  navigate,
  t,
  flag,
  setProposedNewMeeting
) => {
  return (dispatch) => {
    dispatch(showPrposedMeetingDateInit());
    let token = JSON.parse(localStorage.getItem("token"));
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
          dispatch(
            setProposedMeetingDateApiFunc(
              Data,
              navigate,
              t,
              flag,
              setProposedNewMeeting
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetMeetingProposedDatess_01".toLowerCase()
                )
            ) {
              dispatch(
                showPrposedMeetingDateSuccess(
                  response.data.responseResult,
                  t("Record-saved")
                )
              );
              if (flag === true) {
                setProposedNewMeeting(false);
                let userID = localStorage.getItem("userID");
                let meetingpageRow = localStorage.getItem("MeetingPageRows");
                let meetingPageCurrent = parseInt(
                  localStorage.getItem("MeetingPageCurrent")
                );
                localStorage.setItem("MeetingCurrentView", 2);

                let searchData = {
                  Date: "",
                  Title: "",
                  HostName: "",
                  UserID: Number(userID),
                  PageNumber:
                    meetingPageCurrent !== null
                      ? Number(meetingPageCurrent)
                      : 1,
                  Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
                  PublishedMeetings: false,
                };
                dispatch(searchNewUserMeeting(navigate, searchData, t));
              } else {
                let NewData = {
                  MeetingID: Data.MeetingID,
                };
                dispatch(
                  GetAllProposedMeetingDateApiFunc(NewData, navigate, t, false)
                );
              }
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
      })
      .catch((error) => {
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
              dispatch(showPrposedMeetingReponsneFailed(t("No-record-found")));
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

const meetingMaterialIsPublishedSuccess = (response) => {
  return {
    type: actions.GET_ALL_MEETING_MATERIAL_ISPUBLISHED_SUCCESS,
    response: response,
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
const getMeetingMaterialAPI = (navigate, t, meetingMaterialData, rows, id) => {
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
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(
            getMeetingMaterialAPI(navigate, t, meetingMaterialData, rows, id)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllMeetingMaterial_01"
            ) {
              dispatch(
                meetingMaterialSuccess(
                  response.data.responseResult.meetingMaterial,
                  ""
                )
              );
              dispatch(
                meetingMaterialIsPublishedSuccess(
                  response.data.responseResult.isPublished
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllMeetingMaterial_02"
            ) {
              dispatch(meetingMaterialFail(""));
              dispatch(
                meetingMaterialIsPublishedSuccess(
                  response.data.responseResult.isPublished
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllMeetingMaterial_03"
            ) {
              dispatch(meetingMaterialFail(t("Something-went-wrong")));
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
const UpateMeetingStatusLockApiFunc = (navigate, t, Data, value, callback) => {
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
        // ... your existing code
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(
            UpateMeetingStatusLockApiFunc(navigate, t, Data, value, callback)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_UpdateMeetingAgendaLockStatus_01"
            ) {
              dispatch(
                showUpdateMeetingAgendaLockStatusSuccess(
                  response.data.responseResult.responseMessage,
                  t("Status-updated")
                )
              );
              callback(true); // Pass the updated flag back to the callback
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_UpdateMeetingAgendaLockStatus_02"
            ) {
              dispatch(
                showUpdateMeetingAgendaLockStatusFailed(
                  response.data.responseResult.responseMessage,
                  t("status-not-updated")
                )
              );
              callback(false);
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_UpdateMeetingAgendaLockStatus_03"
            ) {
              dispatch(
                showUpdateMeetingAgendaLockStatusFailed(
                  t("Something-went-wrong")
                )
              );
              callback(false);
            }
          } else {
            dispatch(
              showUpdateMeetingAgendaLockStatusFailed(t("Something-went-wrong"))
            );
            callback(false);
          }
        } else {
          dispatch(
            showUpdateMeetingAgendaLockStatusFailed(t("Something-went-wrong"))
          );
          callback(false);
        }
      })
      .catch((response) => {
        dispatch(
          showUpdateMeetingAgendaLockStatusFailed(t("Something-went-wrong"))
        );
        callback(false);
      });
  };
};
// const UpateMeetingStatusLockApiFunc = (navigate, t, Data, value, flag) => {
//   let token = JSON.parse(localStorage.getItem("token"));
//   return (dispatch) => {
//     dispatch(showUpdateMeetingAgendaLockStatusInit());
//     let form = new FormData();
//     form.append("RequestMethod", MeetingAgendaLock.RequestMethod);
//     form.append("RequestData", JSON.stringify(Data));
//     axios({
//       method: "post",
//       url: meetingApi,
//       data: form,
//       headers: {
//         _token: token,
//       },
//     })
//       .then(async (response) => {
//         if (response.data.responseCode === 417) {
//           dispatch(RefreshToken(navigate, t));
//           dispatch(
//             UpateMeetingStatusLockApiFunc(navigate, t, Data, value, flag)
//           );
//         } else if (response.data.responseCode === 200) {
//           if (response.data.responseResult.isExecuted === true) {
//             if (
//               response.data.responseResult.responseMessage ===
//               "Meeting_MeetingServiceManager_SaveUserAttachmentPermission_01"
//             ) {
//               if (Number(value) === 1) {
//                 dispatch(
//                   showUpdateMeetingAgendaLockStatusSuccess(
//                     response.data.responseResult.responseMessage,
//                     t("Status-updated")
//                   )
//                 );
//                 return (flag = true);
//               } else if (Number(value) === 2) {
//                 dispatch(
//                   showUpdateMeetingAgendaLockStatusSuccess(
//                     response.data.responseResult.responseMessage,
//                     t("Status-updated")
//                   )
//                 );
//                 return (flag = true);
//               }
//             } else if (
//               response.data.responseResult.responseMessage ===
//               "Meeting_MeetingServiceManager_SaveUserAttachmentPermission_02"
//             ) {
//               dispatch(
//                 showUpdateMeetingAgendaLockStatusFailed(
//                   response.data.responseResult.responseMessage,
//                   t("status-not-updated")
//                 )
//               );
//             } else if (
//               response.data.responseResult.responseMessage ===
//               "Meeting_MeetingServiceManager_SaveUserAttachmentPermission_03"
//             ) {
//               dispatch(
//                 showUpdateMeetingAgendaLockStatusFailed(
//                   t("Something-went-wrong")
//                 )
//               );
//             }
//           } else {
//             dispatch(
//               showUpdateMeetingAgendaLockStatusFailed(t("Something-went-wrong"))
//             );
//           }
//         } else {
//           dispatch(
//             showUpdateMeetingAgendaLockStatusFailed(t("Something-went-wrong"))
//           );
//         }
//       })
//       .catch((response) => {
//         dispatch(
//           showUpdateMeetingAgendaLockStatusFailed(t("Something-went-wrong"))
//         );
//       });
//   };
// };

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
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(GetAllUserAgendaRightsApiFunc(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_GetAllUserAgendaRights_01"
            ) {
              dispatch(
                showGetAllUserAgendaRightsSuccess(
                  response.data.responseResult,
                  ""
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
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(SaveUserAttachmentsPermissionApiFunc(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
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

const ADDGeneralMinutesApiFunc = (navigate, t, Data) => {
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
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          dispatch(ADDGeneralMinutesApiFunc(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_AddGeneralMinute_01"
            ) {
              dispatch(
                ShowADDGeneralMinutesSuccess(
                  response.data.responseResult.minuteID,
                  t("Record-saved")
                )
              );
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

//Retrive Document For Meeting
const showRetriveGeneralMinutesDocsMeetingInit = () => {
  return {
    type: actions.GENERAL_DOCUMENT_FOR_MEETING_INIT,
  };
};

const showRetriveGeneralMinutesDocsMeetingSuccess = (response, message) => {
  return async (dispatch) => {
    return new Promise((resolve) => {
      dispatch({
        type: actions.GENERAL_DOCUMENT_FOR_MEETING_SUCCESS,
        response: response,
        message: message,
      });
      resolve("Success");
    });
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
  return async (dispatch) => {
    return new Promise((resolve, reject) => {
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
          if (response.data.responseCode === 417) {
            await dispatch(RefreshToken(navigate, t));
            dispatch(DocumentsOfMeetingGenralMinutesApiFunc(navigate, Data, t));
            reject("Response code 417");
          } else if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomManager_GetAllGeneralMiuteDocumentsForMeeting_01".toLowerCase()
                  )
              ) {
                // await dispatch(
                //   showRetriveGeneralMinutesDocsMeetingSuccess(
                //     response.data.responseResult,
                //     t("Data-available")
                //   )
                // );
                await dispatch(
                  showRetriveGeneralMinutesDocsMeetingSuccess(
                    response.data.responseResult,
                    ""
                  )
                );
                resolve("Success");
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
                reject("No data available");
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
                reject("Something went wrong");
              }
            } else {
              dispatch(
                showRetriveGeneralMinutesDocsMeetingFailed(
                  t("Something-went-wrong")
                )
              );
              reject("Something went wrong");
            }
          } else {
            dispatch(
              showRetriveGeneralMinutesDocsMeetingFailed(
                t("Something-went-wrong")
              )
            );
            reject("Something went wrong");
          }
        })
        .catch((error) => {
          dispatch(
            showRetriveGeneralMinutesDocsMeetingFailed(
              t("Something-went-wrong")
            )
          );
          reject("Something went wrong");
        });
    });
  };
};

//Getting all the General Mintues

const showAllGeneralMinutesInit = () => {
  return {
    type: actions.GET_GENERAL_MINTES_INIT,
  };
};

const showAllGeneralMinutesSuccess = (response, message, flag) => {
  return {
    type: actions.GET_GENERAL_MINTES_SUCCESS,
    response: response,
    message: message,
    flag: flag,
  };
};

const showAllGeneralMinutesFailed = (message) => {
  return {
    type: actions.GET_GENERAL_MINTES_FAILED,
    message: message,
  };
};

// Api Function For General Minutes
const GetAllGeneralMinutesApiFunc = (
  navigate,
  t,
  Data,
  currentMeeting,
  flag
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(showAllGeneralMinutesInit());
    let form = new FormData();
    form.append("RequestMethod", getGeneralMinutes.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    try {
      const response = await axios({
        method: "post",
        url: meetingApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        dispatch(
          GetAllGeneralMinutesApiFunc(navigate, t, Data, currentMeeting, flag)
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage ===
            "Meeting_MeetingServiceManager_GetMeetingGeneralMinutes_01"
          ) {
            let MeetingDocs = {
              MDID: currentMeeting,
            };
            // Call DocumentsOfMeetingGenralMinutesApiFunc and wait for its response
            await dispatch(
              DocumentsOfMeetingGenralMinutesApiFunc(navigate, MeetingDocs, t)
            );

            // After DocumentsOfMeetingGenralMinutesApiFunc is done, call showAllGeneralMinutesSuccess
            if (flag) {
              dispatch(
                showAllGeneralMinutesSuccess(
                  response.data.responseResult,
                  "",
                  true
                )
              );
            } else {
              dispatch(
                showAllGeneralMinutesSuccess(
                  response.data.responseResult,
                  "",
                  false
                )
              );
            }
          } else if (
            response.data.responseResult.responseMessage ===
            "Meeting_MeetingServiceManager_GetMeetingGeneralMinutes_02"
          ) {
            dispatch(showAllGeneralMinutesFailed(t("No-record-found")));
          } else if (
            response.data.responseResult.responseMessage ===
            "Meeting_MeetingServiceManager_GetMeetingGeneralMinutes_03"
          ) {
            dispatch(showAllGeneralMinutesFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showAllGeneralMinutesFailed(t("Something-went-wrong")));
        }
      } else {
        dispatch(showAllGeneralMinutesFailed(t("Something-went-wrong")));
      }
    } catch (error) {
      dispatch(showAllGeneralMinutesFailed(t("Something-went-wrong")));
    }
  };
};
const cleareMinutsData = () => {
  return {
    type: actions.CLEARE_MINUTS_DATA,
  };
};
// Documents Upload And Save

// Upload Documents Init
const uploadDocument_init = () => {
  return {
    type: actions.UPLOAD_DOCUMENT_INIT,
  };
};

// Upload Documents Success
const uploadDocument_success = (response, message) => {
  return {
    type: actions.UPLOAD_DOCUMENT_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const uploadDocument_fail = (message) => {
  return {
    type: actions.UPLOAD_DOCUMENT_FAILED,
    message: message,
  };
};

// Upload Documents API for general Minutes
const uploadDocumentsMeetingMinutesApi = (
  navigate,
  t,
  data,
  folderID,
  // newFolder,
  newfile
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
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
            uploadDocumentsMeetingMinutesApi(
              navigate,
              t,
              data,
              folderID,
              // newFolder,
              newfile
            )
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
              newfile.push({
                DisplayFileName: response.data.responseResult.displayFileName,
                DiskusFileNameString:
                  response.data.responseResult.diskusFileName,
                ShareAbleLink: response.data.responseResult.shareAbleLink,
                FK_UserID: JSON.parse(creatorID),
                FK_OrganizationID: JSON.parse(organizationID),
                FileSize: Number(response.data.responseResult.fileSizeOnDisk),
                fileSizeOnDisk: Number(response.data.responseResult.fileSize),
              });
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
    type: actions.SAVED_FILES_INIT,
  };
};

// Save Files Success
const saveFiles_success = (response, message) => {
  return {
    type: actions.SAVED_FILES_SUCCESS,
    response: response,
    message: message,
  };
};

// Save Files Fail
const saveFiles_fail = (message) => {
  return {
    type: actions.SAVED_FILES_FAILED,
    message: message,
  };
};

// Save Files API for genral Minutes
const saveFilesMeetingMinutesApi = (navigate, t, data, folderID, newFolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let Data = {
    FolderID: folderID !== null ? Number(folderID) : 0,
    Files: data,
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
          dispatch(
            saveFilesMeetingMinutesApi(navigate, t, data, folderID, newFolder)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase()
                )
            ) {
              try {
                let fileIds = response.data.responseResult.fileID;
                console.log(fileIds, "newFileID");
                fileIds.map((newFileID, index) => {
                  console.log(newFileID, "newFileID");

                  return newFolder.push({
                    pK_FileID: newFileID.pK_FileID,
                  });
                });
              } catch (error) {
                console.log(error, "newFileID");
              }
              await dispatch(
                saveFiles_success(
                  response.data.responseResult,
                  t("Files-saved-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
                )
            ) {
              dispatch(saveFiles_fail(t("Failed-to-save-any-file")));
              dispatch(ShowADDGeneralMinutesFailed(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
                )
            ) {
              dispatch(ShowADDGeneralMinutesFailed(""));

              dispatch(saveFiles_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(ShowADDGeneralMinutesFailed(""));

            dispatch(saveFiles_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(ShowADDGeneralMinutesFailed(""));

          dispatch(saveFiles_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(saveFiles_fail(t("Something-went-wrong")));
        dispatch(ShowADDGeneralMinutesFailed(""));
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

const SaveMinutesDocumentsApiFunc = (navigate, Data, t, currentMeeting) => {
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            SaveMinutesDocumentsApiFunc(navigate, Data, t, currentMeeting)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
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
              let Meet = {
                MeetingID: Number(Data.FK_MDID),
              };
              await dispatch(
                GetAllGeneralMinutesApiFunc(navigate, t, Meet, currentMeeting)
              );
              dispatch(ShowADDGeneralMinutesFailed(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveGeneralMinutesDocuments_02".toLowerCase()
                )
            ) {
              dispatch(showSaveMinutesDocsFailed(t("Something-went-wrong")));
              dispatch(ShowADDGeneralMinutesFailed(""));
            }
          } else {
            dispatch(showSaveMinutesDocsFailed(t("Something-went-wrong")));
            dispatch(ShowADDGeneralMinutesFailed(""));
          }
        } else {
          dispatch(showSaveMinutesDocsFailed(t("Something-went-wrong")));
          dispatch(ShowADDGeneralMinutesFailed(""));
        }
      })
      .catch((response) => {
        dispatch(showSaveMinutesDocsFailed(t("Something-went-wrong")));
        dispatch(ShowADDGeneralMinutesFailed(""));
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
    type: actions.RETRIEVE_DOCUMENT_GENERAL_MINUTES_FAILED,
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            RetriveDocumentsMeetingGenralMinutesApiFunc(navigate, Data, t)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
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
            dispatch(
              showRetriveGeneralMinutesDocsFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            showRetriveGeneralMinutesDocsFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          showRetriveGeneralMinutesDocsFailed(t("Something-went-wrong"))
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

const getProposedWiseSuccess = (response, message, loader) => {
  return {
    type: actions.GET_USER_WISE_PROPOSED_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};

const getProposedWiseFail = (message, loader) => {
  return {
    type: actions.GET_USER_WISE_PROPOSED_FAIL,
    message: message,
    loader: loader,
  };
};

const getUserProposedWiseApi = (navigate, t, proposedData, loader) => {
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
          dispatch(getUserProposedWiseApi(navigate, t, proposedData, loader));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetParticipantWiseProposedDates_01".toLowerCase()
                )
            ) {
              dispatch(
                getProposedWiseSuccess(
                  response.data.responseResult.userWiseMeetingProposedDates,
                  "",
                  loader
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetParticipantWiseProposedDates_02".toLowerCase()
                )
            ) {
              dispatch(getProposedWiseFail(t("No-record-found"), loader));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetParticipantWiseProposedDates_03".toLowerCase()
                )
            ) {
              dispatch(getProposedWiseFail(t("Something-went-wrong"), loader));
            } else {
              dispatch(getProposedWiseFail(t("Something-went-wrong"), loader));
            }
          } else {
            dispatch(getProposedWiseFail(t("Something-went-wrong"), loader));
          }
        } else {
          dispatch(getProposedWiseFail(t("Something-went-wrong"), loader));
        }
      })
      .catch((response) => {
        dispatch(getProposedWiseFail(t("Something-went-wrong"), loader));
      });
  };
};

const showGetAllAgendaWiseMinutesInit = () => {
  return {
    type: actions.GET_ALL_AGENDA_WISE_MINUTES_INIT,
  };
};

const showGetAllAgendaWiseMinutesSuccess = (response, message, loader) => {
  return {
    type: actions.GET_ALL_AGENDA_WISE_MINUTES_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};

const showGetAllAgendaWiseMinutesFailed = (message) => {
  return {
    type: actions.GET_ALL_AGENDA_WISE_MINUTES_FAILED,
    message: message,
  };
};

const GetAllAgendaWiseMinutesApiFunc = (
  navigate,
  Data,
  t,
  currentMeeting,
  loader,
  setAddReviewers,
  clickFlag
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(showGetAllAgendaWiseMinutesInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllAgendaWiseMinutes.RequestMethod);

    try {
      const response = await axios({
        method: "post",
        url: meetingApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        // Retry the API request
        await dispatch(
          GetAllAgendaWiseMinutesApiFunc(
            navigate,
            Data,
            t,
            currentMeeting,
            loader,
            setAddReviewers,
            clickFlag
          )
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_GetAllMeetingAgendaWiseMinutes_01".toLowerCase()
              )
          ) {
            await dispatch(
              GetAllGeneralMinutesApiFunc(
                navigate,
                t,
                Data,
                Number(currentMeeting),
                true
              )
            );
            let allAgendaWiseDocs = {
              MDID: Number(currentMeeting),
            };
            // Call AllDocumentsForAgendaWiseMinutesApiFunc and wait for it to complete
            // if (clickFlag === true) {
            //   setAddReviewers(true);
            // }
            await dispatch(
              AllDocumentsForAgendaWiseMinutesApiFunc(
                navigate,
                allAgendaWiseDocs,
                t
              )
            );
            await dispatch(
              showGetAllAgendaWiseMinutesSuccess(
                response.data.responseResult,
                "",
                loader
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_GetAllMeetingAgendaWiseMinutes_02".toLowerCase()
              )
          ) {
            dispatch(showGetAllAgendaWiseMinutesFailed(t("No-record-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_GetAllMeetingAgendaWiseMinutes_03".toLowerCase()
              )
          ) {
            dispatch(
              showGetAllAgendaWiseMinutesFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            showGetAllAgendaWiseMinutesFailed(t("Something-went-wrong"))
          );
        }
      } else {
        dispatch(showGetAllAgendaWiseMinutesFailed(t("Something-went-wrong")));
      }
    } catch (error) {
      dispatch(showGetAllAgendaWiseMinutesFailed(t("Something-went-wrong")));
    }
  };
};

//Update  Agenda Wise Minutess

const showUpdateAgendaWiseMinutesInit = () => {
  return {
    type: actions.UPDATE_AGENDA_WISE_MINUTES_INIT,
  };
};

const showUpdateAgendaWiseMinutesSuccess = (response, message) => {
  return {
    type: actions.UPDATE_AGENDA_WISE_MINUTES_SUCCESS,
    response: response,
    message: message,
  };
};

const showUpdateAgendaWiseMinutesFailed = (message) => {
  return {
    type: actions.UPDATE_AGENDA_WISE_MINUTES_FAILED,
    message: message,
  };
};

const UpdateAgendaWiseMinutesApiFunc = (
  navigate,
  Data,
  t,
  resendFlag,
  resendData,
  setEditMinute,
  setConfirmationEdit,
  setResendMinuteForReview,
  setShowRevisionHistory,
  isAgenda
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(showUpdateAgendaWiseMinutesInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", updateAgendaWiseMinutes.RequestMethod);
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
          dispatch(UpdateAgendaWiseMinutesApiFunc(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_UpdateAgendaWiseMinute_01".toLowerCase()
                )
            ) {
              await dispatch(
                showUpdateAgendaWiseMinutesSuccess(
                  response.data.responseResult,
                  t("Record-updated")
                )
              );
              if (resendFlag === true) {
                dispatch(
                  ResendUpdatedMinuteForReview(
                    resendData,
                    navigate,
                    t,
                    setEditMinute,
                    setConfirmationEdit,
                    setResendMinuteForReview,
                    setShowRevisionHistory,
                    isAgenda
                  )
                );
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_UpdateAgendaWiseMinute_02".toLowerCase()
                )
            ) {
              dispatch(
                showUpdateAgendaWiseMinutesFailed(t("Record-not-updated"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_UpdateAgendaWiseMinute_03".toLowerCase()
                )
            ) {
              dispatch(
                showUpdateAgendaWiseMinutesFailed(t("Something-went-wrong"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_UpdateAgendaWiseMinute_04".toLowerCase()
                )
            ) {
              dispatch(
                showUpdateAgendaWiseMinutesFailed(
                  t("Only-minute-creator-can-update")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_UpdateAgendaWiseMinute_05".toLowerCase()
                )
            ) {
              await dispatch(
                showUpdateMinutesSuccess(
                  response.data.responseResult,
                  t("Record-updated-and-is-a-review-minute")
                )
              );
              if (resendFlag === true) {
                dispatch(
                  ResendUpdatedMinuteForReview(
                    resendData,
                    navigate,
                    t,
                    setEditMinute,
                    setConfirmationEdit,
                    setResendMinuteForReview,
                    setShowRevisionHistory,
                    isAgenda
                  )
                );
              }
            }
          } else {
            dispatch(
              showUpdateAgendaWiseMinutesFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            showUpdateAgendaWiseMinutesFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(showUpdateAgendaWiseMinutesFailed(t("Something-went-wrong")));
      });
  };
};

//Delete agenda wise minutes

const showDeleteAgendaWiseMinutesInit = () => {
  return {
    type: actions.DELETE_AGENDA_WISE_MINUTES_INIT,
  };
};

const showDeleteAgendaWiseMinutesSuccess = (response, message) => {
  return {
    type: actions.DELETE_AGENDA_WISE_MINUTES_SUCCESS,
    response: response,
    message: message,
  };
};

const showDeleteAgendaWiseMinutesFailed = (message) => {
  return {
    type: actions.DELETE_AGENDA_WISE_MINUTES_FAILED,
    message: message,
  };
};

const DeleteAgendaWiseMinutesApiFunc = (
  navigate,
  Data,
  t,
  currentMeeting,
  id
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(showDeleteAgendaWiseMinutesInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", DeleteagendaWiseMinutes.RequestMethod);
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
            DeleteAgendaWiseMinutesApiFunc(
              navigate,
              Data,
              t,
              currentMeeting,
              id
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_DeleteAgendaWiseMinute_01".toLowerCase()
                )
            ) {
              await dispatch(
                showDeleteAgendaWiseMinutesSuccess(
                  response.data.responseResult,
                  t("Record-deleted")
                )
              );

              let DeleteGetAll = {
                MeetingID: currentMeeting,
              };
              dispatch(
                GetAllAgendaWiseMinutesApiFunc(
                  navigate,
                  DeleteGetAll,
                  t,
                  currentMeeting
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_DeleteAgendaWiseMinute_02".toLowerCase()
                )
            ) {
              dispatch(
                showDeleteAgendaWiseMinutesFailed(t("No-record-deleted"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_DeleteAgendaWiseMinute_03".toLowerCase()
                )
            ) {
              dispatch(
                showDeleteAgendaWiseMinutesFailed(t("Something-went-wrong"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_DeleteAgendaWiseMinute_04".toLowerCase()
                )
            ) {
              dispatch(
                showDeleteAgendaWiseMinutesFailed(
                  t("Only-a-organizer-can-perform-this-operation")
                )
              );
            }
          } else {
            dispatch(
              showDeleteAgendaWiseMinutesFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            showDeleteAgendaWiseMinutesFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(showDeleteAgendaWiseMinutesFailed(t("Something-went-wrong")));
      });
  };
};

//Delete General Minutes

const DeleteGeneralMinutesInit = () => {
  return {
    type: actions.DELETE_GENERAL_MINUTES_METHOD_INIT,
  };
};

const DeleteGeneralMinutesSuccess = (response, message) => {
  return {
    type: actions.DELETE_GENERAL_MINUTES_METHOD_SUCCESS,
    response: response,
    message: message,
  };
};

const DeleteGeneralMinutesFailed = (message) => {
  return {
    type: actions.DELETE_GENERAL_MINUTES_METHOD_FAILED,
    message: message,
  };
};

const DeleteGeneralMinutesApiFunc = (navigate, Data, t, currentMeeting) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  let currentMeetingID = localStorage.getItem("meetingID");
  return (dispatch) => {
    dispatch(DeleteGeneralMinutesInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", DeleteGeneralMinutes.RequestMethod);
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
            DeleteGeneralMinutesApiFunc(navigate, Data, t, currentMeeting)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_DeleteGeneralMinute_01".toLowerCase()
                )
            ) {
              await dispatch(
                DeleteGeneralMinutesSuccess(
                  response.data.responseResult.responseMessage,
                  t("Record-deleted")
                )
              );

              let DelMeet = {
                MeetingID: currentMeeting,
              };

              dispatch(
                GetAllGeneralMinutesApiFunc(
                  navigate,
                  t,
                  DelMeet,
                  currentMeeting
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_DeleteGeneralMinute_02".toLowerCase()
                )
            ) {
              dispatch(DeleteGeneralMinutesFailed(t("No-record-deleted")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_DeleteGeneralMinute_03".toLowerCase()
                )
            ) {
              dispatch(DeleteGeneralMinutesFailed(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_DeleteGeneralMinute_04".toLowerCase()
                )
            ) {
              dispatch(
                DeleteGeneralMinutesFailed(t("Only-minute-creator-can-delete"))
              );
            }
          } else {
            dispatch(
              showRetriveGeneralMinutesDocsMeetingFailed(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            showRetriveGeneralMinutesDocsMeetingFailed(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          showRetriveGeneralMinutesDocsMeetingFailed(t("Something-went-wrong"))
        );
      });
  };
};

//Agenda Wise Add minutes

const showAgendaWiseAddMinutesInit = () => {
  return {
    type: actions.AGENDA_WISE_MINUTES_INIT,
  };
};

const showAgendaWiseAddMinutesSuccess = (response, message) => {
  return {
    type: actions.AGENDA_WISE_MINUTES_SUCCESS,
    response: response,
    message: message,
  };
};

const showAgendaWiseAddMinutesFailed = (message) => {
  return {
    type: actions.AGENDA_WISE_MINUTES_FAILED,
    message: message,
  };
};

const AddAgendaWiseMinutesApiFunc = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(showAgendaWiseAddMinutesInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", agenwiseMinutes.RequestMethod);
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
          dispatch(AddAgendaWiseMinutesApiFunc(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AddAgendaWiseMinutes_01".toLowerCase()
                )
            ) {
              await dispatch(
                showAgendaWiseAddMinutesSuccess(
                  response.data.responseResult.minuteID,
                  t("Record-saved")
                )
              );
              console.log(
                response.data.responseResult,
                "GetAllAgendaWiseMinutesApiFunc"
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AddAgendaWiseMinutes_02".toLowerCase()
                )
            ) {
              dispatch(showAgendaWiseAddMinutesFailed(t("No-record-saved")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_AddAgendaWiseMinutes_03".toLowerCase()
                )
            ) {
              dispatch(
                showAgendaWiseAddMinutesFailed(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                showAgendaWiseAddMinutesFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(showAgendaWiseAddMinutesFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showAgendaWiseAddMinutesFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(showAgendaWiseAddMinutesFailed(t("Something-went-wrong")));
      });
  };
};

//Save Agenda Wise Document

const showSavedAgendaWiseDocumentInit = () => {
  return {
    type: actions.SAVE_DOCUMENTS_AGENDA_WISE_INIT,
  };
};

const showSavedAgendaWiseDocumentSuccess = (response, message) => {
  return {
    type: actions.SAVE_DOCUMENTS_AGENDA_WISE_SUCCESS,
    response: response,
    message: message,
  };
};

const showSavedAgendaWiseDocumentFailed = (message) => {
  return {
    type: actions.SAVE_DOCUMENTS_AGENDA_WISE_FAILED,
    message: message,
  };
};

const SaveAgendaWiseDocumentsApiFunc = (navigate, Data, t, id) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(showSavedAgendaWiseDocumentInit());

    try {
      let form = new FormData();
      form.append("RequestData", JSON.stringify(Data));
      form.append("RequestMethod", saveDocumentAgendaWiseMinutes.RequestMethod);
      const response = await axios({
        method: "post",
        url: dataRoomApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        // Assuming RefreshToken is synchronous; otherwise, handle it accordingly
        await dispatch(SaveAgendaWiseDocumentsApiFunc(navigate, Data, t, id));
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_SaveAgendaWiseMinutesDocuments_01".toLowerCase()
              )
          ) {
            await dispatch(
              showSavedAgendaWiseDocumentSuccess(
                response.data.responseResult,
                t("List-updated-successfully")
              )
            );

            let getAll = {
              MeetingID: Number(id),
            };

            await dispatch(
              GetAllAgendaWiseMinutesApiFunc(navigate, getAll, t, id, true)
            );
            dispatch(showAgendaWiseAddMinutesFailed(""));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_SaveAgendaWiseMinutesDocuments_02".toLowerCase()
              )
          ) {
            dispatch(
              showSavedAgendaWiseDocumentFailed(t("Something-went-wrong"))
            );
            dispatch(showAgendaWiseAddMinutesFailed(""));
          } else {
            dispatch(
              showSavedAgendaWiseDocumentFailed(t("Something-went-wrong"))
            );
            dispatch(showAgendaWiseAddMinutesFailed(""));
          }
        } else {
          dispatch(
            showSavedAgendaWiseDocumentFailed(t("Something-went-wrong"))
          );
          dispatch(showAgendaWiseAddMinutesFailed(""));
        }
      } else {
        dispatch(showSavedAgendaWiseDocumentFailed(t("Something-went-wrong")));
        dispatch(showAgendaWiseAddMinutesFailed(""));
      }
    } catch (error) {
      dispatch(showSavedAgendaWiseDocumentFailed(t("Something-went-wrong")));
      dispatch(showAgendaWiseAddMinutesFailed(""));
    }
  };
};

//Update General meeting

const showUpdateMinutesInit = () => {
  return {
    type: actions.UPDATE_GENERAL_MINUTES_INIT,
  };
};

const showUpdateMinutesSuccess = (resposne, message) => {
  return {
    type: actions.UPDATE_GENERAL_MINUTES_SUCCESS,
    resposne: resposne,
    message: message,
  };
};

const showUpdateMinutesFailed = (message) => {
  return {
    type: actions.UPDATE_GENERAL_MINUTES_FAILED,
    message: message,
  };
};

const UpdateMinutesGeneralApiFunc = (
  navigate,
  Data,
  t,
  resendFlag,
  resendData,
  setEditMinute,
  setConfirmationEdit,
  setResendMinuteForReview,
  setShowRevisionHistory,
  isAgenda
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return async (dispatch) => {
    dispatch(showUpdateMinutesInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", UpdateGeneralMinutes.RequestMethod);

    try {
      const response = await axios({
        method: "post",
        url: meetingApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        // Retry the API request
        await dispatch(
          UpdateMinutesGeneralApiFunc(
            navigate,
            Data,
            t,
            setEditMinute,
            setConfirmationEdit,
            setResendMinuteForReview
          )
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_UpdateGeneralMinute_01".toLowerCase()
              )
          ) {
            await dispatch(
              showUpdateMinutesSuccess(
                response.data.responseResult,
                t("Record-updated")
              )
            );
            if (resendFlag === true) {
              dispatch(
                ResendUpdatedMinuteForReview(
                  resendData,
                  navigate,
                  t,
                  setEditMinute,
                  setConfirmationEdit,
                  setResendMinuteForReview,
                  setShowRevisionHistory,
                  isAgenda
                )
              );
            }
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_UpdateGeneralMinute_02".toLowerCase()
              )
          ) {
            dispatch(showUpdateMinutesFailed(t("No-record-update")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_UpdateGeneralMinute_03".toLowerCase()
              )
          ) {
            dispatch(showUpdateMinutesFailed(t("Something-went-wrong")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_UpdateGeneralMinute_04".toLowerCase()
              )
          ) {
            dispatch(
              showUpdateMinutesFailed(t("Only-minute-creator-can-update"))
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_UpdateGeneralMinute_05".toLowerCase()
              )
          ) {
            await dispatch(
              showUpdateMinutesSuccess(
                response.data.responseResult,
                t("Record-updated-and-is-a-review-minute")
              )
            );
            if (resendFlag === true) {
              dispatch(
                ResendUpdatedMinuteForReview(
                  resendData,
                  navigate,
                  t,
                  setEditMinute,
                  setConfirmationEdit,
                  setResendMinuteForReview,
                  setShowRevisionHistory,
                  isAgenda
                )
              );
            }
          }
        } else {
          dispatch(showUpdateMinutesFailed(t("Something-went-wrong")));
        }
      } else {
        dispatch(showUpdateMinutesFailed(t("Something-went-wrong")));
      }
    } catch (error) {
      dispatch(showUpdateMinutesFailed(t("Something-went-wrong")));
    }
  };
};

//Upload Documents for agendawise minutes

// Upload Documents Init

// Upload Documents Success
const uploadDocument_success_agenda_wise = (response, message) => {
  return {
    type: actions.UPLOAD_DOCUMENT_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const uploadDocument_fail_agenda_wise = (message) => {
  return {
    type: actions.UPLOAD_DOCUMENT_FAILED,
    message: message,
  };
};

// Upload Documents API for general Minutes
const uploadDocumentsMeetingAgendaWiseMinutesApi = (
  navigate,
  t,
  data,
  folderID,
  // newFolder,
  newfile
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  return async (dispatch) => {
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
            uploadDocumentsMeetingAgendaWiseMinutesApi(
              navigate,
              t,
              data,
              folderID,
              // newFolder,
              newfile
            )
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
              newfile.push({
                DisplayFileName: response.data.responseResult.displayFileName,
                DiskusFileNameString:
                  response.data.responseResult.diskusFileName,
                ShareAbleLink: response.data.responseResult.shareAbleLink,
                FK_UserID: JSON.parse(creatorID),
                FK_OrganizationID: JSON.parse(organizationID),
                FileSize: Number(response.data.responseResult.fileSizeOnDisk),
                fileSizeOnDisk: Number(response.data.responseResult.fileSize),
              });
              await dispatch(
                uploadDocument_success_agenda_wise(
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
              dispatch(
                uploadDocument_fail_agenda_wise(t("Failed-to-update-document"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
                )
            ) {
              dispatch(
                uploadDocument_fail_agenda_wise(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              uploadDocument_fail_agenda_wise(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(uploadDocument_fail_agenda_wise(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(uploadDocument_fail_agenda_wise(t("Something-went-wrong")));
      });
  };
};

// Save Files Init

// Save Files Success
const saveFiles_success_agenda_wise = (response, message) => {
  return {
    type: actions.SAVED_FILES_SUCCESS,
    response: response,
    message: message,
  };
};

// Save Files Fail
const saveFiles_fail_agenda_wise = (message) => {
  return {
    type: actions.SAVED_FILES_FAILED,
    message: message,
  };
};

// Save Files API for genral Minutes
const saveFilesMeetingagendaWiseMinutesApi = (
  navigate,
  t,
  data,
  folderID,
  newFolder
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let Data = {
    FolderID: folderID !== null ? Number(folderID) : 0,
    Files: data,
    UserID: JSON.parse(creatorID),
    Type: 0,
  };
  return async (dispatch) => {
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
          dispatch(
            saveFilesMeetingagendaWiseMinutesApi(navigate, t, data, newFolder)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase()
                )
            ) {
              try {
                let fileIds = response.data.responseResult.fileID;
                console.log(fileIds, "newFileID");
                fileIds.map((newFileID, index) => {
                  console.log(newFileID, "newFileID");

                  return newFolder.push({
                    pK_FileID: newFileID.pK_FileID,
                  });
                });
              } catch (error) {
                console.log(error, "newFileID");
              }
              await dispatch(
                saveFiles_success_agenda_wise(
                  response.data.responseResult,
                  t("Files-saved-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
                )
            ) {
              dispatch(
                saveFiles_fail_agenda_wise(t("Failed-to-save-any-file"))
              );
              dispatch(showAgendaWiseAddMinutesFailed(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
                )
            ) {
              dispatch(showAgendaWiseAddMinutesFailed(""));

              dispatch(saveFiles_fail_agenda_wise(t("Something-went-wrong")));
            }
          } else {
            dispatch(showAgendaWiseAddMinutesFailed(""));

            dispatch(saveFiles_fail_agenda_wise(t("Something-went-wrong")));
          }
        } else {
          dispatch(showAgendaWiseAddMinutesFailed(""));

          dispatch(saveFiles_fail_agenda_wise(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(saveFiles_fail_agenda_wise(t("Something-went-wrong")));
        dispatch(showAgendaWiseAddMinutesFailed(""));
      });
  };
};

//Retrive all agendawise documents

const showRetriveAgendaWiseDocumentsInit = () => {
  return {
    type: actions.RETRIVE_AGENDA_WISE_DOCUMENTS_INIT,
  };
};

const showRetriveAgendaWiseDocumentsSuccess = (response, message) => {
  return {
    type: actions.RETRIVE_AGENDA_WISE_DOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

const showRetriveAgendaWiseDocumentsFailed = (message) => {
  return {
    type: actions.RETRIVE_AGENDA_WISE_DOCUMENTS_FAILED,
    message: message,
  };
};

const AgendaWiseRetriveDocumentsMeetingMinutesApiFunc = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(showRetriveAgendaWiseDocumentsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", RetriveAgendaWiseDocuments.RequestMethod);
    axios({
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
            AgendaWiseRetriveDocumentsMeetingMinutesApiFunc(navigate, Data, t)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveAgendaWiseMiuteDocuments_01".toLowerCase()
                )
            ) {
              await dispatch(
                showRetriveAgendaWiseDocumentsSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveAgendaWiseMiuteDocuments_02".toLowerCase()
                )
            ) {
              dispatch(
                showRetriveAgendaWiseDocumentsFailed(t("No-data-available"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveAgendaWiseMiuteDocuments_03".toLowerCase()
                )
            ) {
              dispatch(
                showRetriveAgendaWiseDocumentsFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              showRetriveAgendaWiseDocumentsFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            showRetriveAgendaWiseDocumentsFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          showRetriveAgendaWiseDocumentsFailed(t("Something-went-wrong"))
        );
      });
  };
};

//Dlete Documentes General Minutes

const showDeleteGeneralMeetingDocumentsInit = () => {
  return {
    type: actions.DELETE_GENERAL_MINUTE_DCOUMENTS_INIT,
  };
};

const showDeleteGeneralMeetingDocumentsSuccess = (response, message) => {
  return {
    type: actions.DELETE_GENERAL_MINUTE_DCOUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

const showDeleteGeneralMeetingDocumentsFailed = (message) => {
  return {
    type: actions.DELETE_GENERAL_MINUTE_DCOUMENTS_FAILED,
    message: message,
  };
};

const DeleteGeneralMinuteDocumentsApiFunc = (
  navigate,
  Data,
  t,
  currentMeeting,
  MinuteData
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(showDeleteGeneralMeetingDocumentsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", DeleteDocumentGenralMinute.RequestMethod);
    axios({
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
            DeleteGeneralMinuteDocumentsApiFunc(
              navigate,
              Data,
              t,
              currentMeeting,
              MinuteData
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_DeleteGeneralMinuteDocuments_01".toLowerCase()
                )
            ) {
              await dispatch(
                showDeleteGeneralMeetingDocumentsSuccess(
                  response.data.responseResult,
                  t("Record-deleted")
                )
              );
              let Erase = {
                MinuteID: MinuteData.minuteID,
              };
              dispatch(
                DeleteGeneralMinutesApiFunc(navigate, Erase, t, currentMeeting)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_DeleteGeneralMinuteDocuments_02".toLowerCase()
                )
            ) {
              dispatch(
                showDeleteGeneralMeetingDocumentsFailed(t("No-record-deleted"))
              );
              let Erase = {
                MinuteID: MinuteData.minuteID,
              };
              dispatch(
                DeleteGeneralMinutesApiFunc(navigate, Erase, t, currentMeeting)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_DeleteGeneralMinuteDocuments_03".toLowerCase()
                )
            ) {
              dispatch(
                showDeleteGeneralMeetingDocumentsFailed(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              showDeleteGeneralMeetingDocumentsFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            showDeleteGeneralMeetingDocumentsFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          showDeleteGeneralMeetingDocumentsFailed(t("Something-went-wrong"))
        );
      });
  };
};

//Documents Delete Agenda Wise

const showDeleteAgendaWiseDocumentInit = () => {
  return {
    type: actions.DELETE_AGENDA_WISE_DOCUMENT_DELETE_INIT,
  };
};

const showDeleteAgendaWiseDocumentSuccess = (response, message) => {
  return {
    type: actions.DELETE_AGENDA_WISE_DOCUMENT_DELETE_SUCCESS,
    response: response,
    message: message,
  };
};

const showDeleteAgendaWiseDocumentFailed = (message) => {
  return {
    type: actions.DELETE_AGENDA_WISE_DOCUMENT_DELETE_FAILED,
    message: message,
  };
};

const DeleteAgendaWiseMinutesDocumentsApiFunc = (
  navigate,
  Data,
  t,
  currentMeeting,
  id
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showDeleteAgendaWiseDocumentInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", DeleteAgendaWiseDocuments.RequestMethod);
    axios({
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
            DeleteAgendaWiseMinutesDocumentsApiFunc(
              navigate,
              Data,
              t,
              currentMeeting,

              id
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_DeleteAgendaWiseMinuteDocuments_01".toLowerCase()
                )
            ) {
              await dispatch(
                showDeleteAgendaWiseDocumentSuccess(
                  response.data.responseResult,
                  t("Record-deleted")
                )
              );
              let AgendaWiseDelData = {
                MinuteID: Number(id),
              };
              dispatch(
                DeleteAgendaWiseMinutesApiFunc(
                  navigate,
                  AgendaWiseDelData,
                  t,
                  currentMeeting,
                  id
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_DeleteAgendaWiseMinuteDocuments_02".toLowerCase()
                )
            ) {
              dispatch(
                showDeleteAgendaWiseDocumentFailed(t("No-record-deleted"))
              );
              let AgendaWiseDelData = {
                MinuteID: Number(id),
              };
              dispatch(
                DeleteAgendaWiseMinutesApiFunc(
                  navigate,
                  AgendaWiseDelData,
                  t,
                  currentMeeting
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_DeleteAgendaWiseMinuteDocuments_03".toLowerCase()
                )
            ) {
              dispatch(
                showDeleteAgendaWiseDocumentFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              showDeleteAgendaWiseDocumentFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(getMeetingByCommitteeID_fail(t("Something-went-wrong")));

          dispatch(
            showDeleteAgendaWiseDocumentFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(getMeetingByCommitteeID_fail(t("Something-went-wrong")));

        dispatch(showDeleteAgendaWiseDocumentFailed(t("Something-went-wrong")));
      });
  };
};

//Create update Meeting Data Room Mapped

const showCreateUpdateMeetingDataRoomInit = () => {
  return {
    type: actions.CREATE_UPDATE_MEETING_DATA_ROOM_MAPPED_INIT,
  };
};

const showCreateUpdateMeetingDataRoomSuccess = (response, message) => {
  return {
    type: actions.CREATE_UPDATE_MEETING_DATA_ROOM_MAPPED_SUCCESS,
    response: response,
    message: message,
  };
};

const showCreateUpdateMeetingDataRoomFailed = (response, message) => {
  return {
    type: actions.CREATE_UPDATE_MEETING_DATA_ROOM_MAPPED_FAILED,
    message: message,
  };
};

const CreateUpdateMeetingDataRoomMapeedApiFunc = (
  navigate,
  Data,
  t,
  setDataroomMapFolderId,
  members,
  MeetID,
  rows,
  ResponseDate,
  setProposedNewMeeting
) => {
  console.log(
    { Data },
    "CreateUpdateDataRoadMapApiFuncCreateUpdateDataRoadMapApiFunc"
  );
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showCreateUpdateMeetingDataRoomInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      CreateUpdateMeetingDataroomMapped.RequestMethod
    );
    axios({
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
            CreateUpdateMeetingDataRoomMapeedApiFunc(
              navigate,
              Data,
              t,
              members,
              MeetID,
              rows,
              ResponseDate,
              setProposedNewMeeting
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_01".toLowerCase()
                )
            ) {
              await dispatch(
                showCreateUpdateMeetingDataRoomSuccess(
                  response.data.responseResult.folderID,
                  ""
                )
              );
              localStorage.setItem(
                "folderDataRoomMeeting",
                response.data.responseResult.folderID
              );
              setDataroomMapFolderId(response.data.responseResult.folderID);
              let newarry = [];
              members.map((data, index) => {
                newarry.push(data.userID);
              });
              let Data = {
                MeetingID: MeetID,
                MeetingAttendeRoleID: 2,
                UpdatedUsers: newarry,
              };
              dispatch(
                UpdateMeetingUserApiFunc(
                  navigate,
                  Data,
                  t,
                  members,
                  3,
                  MeetID,
                  rows,
                  ResponseDate,
                  true,
                  setProposedNewMeeting
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_02".toLowerCase()
                )
            ) {
              dispatch(
                showCreateUpdateMeetingDataRoomFailed(
                  t("Failed-to-save-or-map-folder")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_03".toLowerCase()
                )
            ) {
              await dispatch(
                showCreateUpdateMeetingDataRoomSuccess(
                  response.data.responseResult.folderID,
                  ""
                )
              );
              localStorage.setItem(
                "folderDataRoomMeeting",
                response.data.responseResult.folderID
              );
              setDataroomMapFolderId(response.data.responseResult.folderID);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_04".toLowerCase()
                )
            ) {
              dispatch(
                showCreateUpdateMeetingDataRoomFailed(
                  t("Unable-to-update-folder")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_05".toLowerCase()
                )
            ) {
              await dispatch(
                showCreateUpdateMeetingDataRoomSuccess(
                  response.data.responseResult,
                  ""
                )
              );
              localStorage.setItem(
                "folderDataRoomMeeting",
                response.data.responseResult.folderID
              );
              setDataroomMapFolderId(response.data.responseResult.folderID);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_06".toLowerCase()
                )
            ) {
              dispatch(
                showCreateUpdateMeetingDataRoomFailed(
                  t("Failed-to-create-new-mapping")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_07".toLowerCase()
                )
            ) {
              dispatch(
                showCreateUpdateMeetingDataRoomFailed(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              showCreateUpdateMeetingDataRoomFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            showCreateUpdateMeetingDataRoomFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          showCreateUpdateMeetingDataRoomFailed(t("Something-went-wrong"))
        );
      });
  };
};
// get Meeting By Group ID Init
const getMeetingbyGroup_init = () => {
  return {
    type: actions.GETMEETINGBYGROUPID_INIT,
  };
};
// get Meeting by Group ID Success
const getMeetingbyGroup_success = (response, message) => {
  return {
    type: actions.GETMEETINGBYGROUPID_SUCCESS,
    response: response,
    message: message,
  };
};
// get Meeting by Group ID Failed
const getMeetingbyGroup_fail = (message) => {
  return {
    type: actions.GETMEETINGBYGROUPID_FAIL,
    message: message,
  };
};

// Get Meeting by Group ID
const getMeetingbyGroupApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMeetingbyGroup_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getMeetingbyGroupIDRM.RequestMethod);
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
          dispatch(getMeetingbyGroupApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByGroupID_01".toLowerCase()
                )
            ) {
              dispatch(
                getMeetingbyGroup_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByGroupID_02".toLowerCase()
                )
            ) {
              dispatch(getMeetingbyGroup_fail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByGroupID_03".toLowerCase()
                )
            ) {
              dispatch(getMeetingbyGroup_fail(t("Something-went-wrong")));
            } else {
              dispatch(getMeetingbyGroup_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getMeetingbyGroup_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getMeetingbyGroup_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getMeetingbyGroup_fail(t("Something-went-wrong")));
      });
  };
};

// get Committee by Meeting ID
const setMeetingByGroupID_init = () => {
  return {
    type: actions.SETMEETINGBYGROUPID_INIT,
  };
};
const setMeetingByGroupID_success = (response, message) => {
  return {
    type: actions.SETMEETINGBYGROUPID_SUCCESS,
    response: response,
    message: message,
  };
};
const setMeetingByGroupID_fail = (message) => {
  return {
    type: actions.SETMEETINGBYGROUPID_FAIL,
    message: message,
  };
};
const setMeetingByGroupIDApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(setMeetingByGroupID_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", setMeetingbyGroupIDRM.RequestMethod);
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
          dispatch(setMeetingByGroupIDApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetGroupMeeting_01".toLowerCase()
                )
            ) {
              dispatch(
                setMeetingByGroupID_success(
                  response.data.responseResult,
                  t("Record-save")
                )
              );
              let ViewGroupID = localStorage.getItem("ViewGroupID");
              let currentUserId = localStorage.getItem("userID");

              let searchData = {
                GroupID: Number(ViewGroupID),
                Date: "",
                Title: "",
                HostName: "",
                UserID: Number(currentUserId),
                PageNumber: 1,
                Length: 50,
                PublishedMeetings: true,
              };
              dispatch(getMeetingbyGroupApi(navigate, t, searchData));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetGroupMeeting_02".toLowerCase()
                )
            ) {
              dispatch(setMeetingByGroupID_fail(t("No-record-save")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetGroupMeeting_03".toLowerCase()
                )
            ) {
              dispatch(setMeetingByGroupID_fail(t("Something-went-wrong")));
            } else {
              dispatch(setMeetingByGroupID_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(setMeetingByGroupID_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(setMeetingByGroupID_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(setMeetingByGroupID_fail(t("Something-went-wrong")));
      });
  };
};

// Set Meeting by Group ID

const getMeetingByCommitteeID_init = () => {
  return {
    type: actions.GETMEETINGBYCOMMITTEEID_INIT,
  };
};
const getMeetingByCommitteeID_success = (response, message) => {
  return {
    type: actions.GETMEETINGBYCOMMITTEEID_SUCCESS,
    response: response,
    message: message,
  };
};
const getMeetingByCommitteeID_fail = (message) => {
  return {
    type: actions.GETMEETINGBYCOMMITTEEID_FAIL,
    message: message,
  };
};
const getMeetingByCommitteeIDApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMeetingByCommitteeID_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getMeetingbyCommitteeIDRM.RequestMethod);
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
          dispatch(getMeetingByCommitteeIDApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByCommitteeID_01".toLowerCase()
                )
            ) {
              dispatch(
                getMeetingByCommitteeID_success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByCommitteeID_02".toLowerCase()
                )
            ) {
              dispatch(getMeetingByCommitteeID_fail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByCommitteeID_03".toLowerCase()
                )
            ) {
              dispatch(getMeetingByCommitteeID_fail(t("Something-went-wrong")));
            } else {
              dispatch(getMeetingByCommitteeID_fail(t("Something-went-wrong")));
            }
          } else {
          }
        } else {
          dispatch(getMeetingByCommitteeID_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getMeetingByCommitteeID_fail(t("Something-went-wrong")));
      });
  };
};

// set Meeting by Committee ID
const setMeetingbyCommitteeID_init = () => {
  return {
    type: actions.SETMEETINGBYCOMMITTEEID_INIT,
  };
};
const setMeetingbyCommitteeID_success = (response, message) => {
  return {
    type: actions.SETMEETINGBYCOMMITTEEID_SUCCESS,
    response: response,
    message: message,
  };
};
const setMeetingbyCommitteeID_fail = (message) => {
  return {
    type: actions.SETMEETINGBYCOMMITTEEID_FAIL,
    message: message,
  };
};
const setMeetingbyCommitteeIDApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(setMeetingbyCommitteeID_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", setMeetingbyCommitteeIDRM.RequestMethod);
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
          dispatch(setMeetingbyCommitteeIDApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetCommitteeMeetings_01".toLowerCase()
                )
            ) {
              dispatch(
                setMeetingbyCommitteeID_success(
                  response.data.responseResult,
                  t("Record-save")
                )
              );
              let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
              let currentUserId = localStorage.getItem("userID");

              let searchData = {
                CommitteeID: Number(ViewCommitteeID),
                Date: "",
                Title: "",
                HostName: "",
                UserID: Number(currentUserId),
                PageNumber: 1,
                Length: 50,
                PublishedMeetings: true,
              };
              dispatch(getMeetingByCommitteeIDApi(navigate, t, searchData));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetCommitteeMeetings_02".toLowerCase()
                )
            ) {
              dispatch(setMeetingbyCommitteeID_fail(t("No-record-save")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetCommitteeMeetings_03".toLowerCase()
                )
            ) {
              dispatch(setMeetingbyCommitteeID_fail(t("Something-went-wrong")));
            } else {
              dispatch(setMeetingbyCommitteeID_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(setMeetingbyCommitteeID_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(setMeetingbyCommitteeID_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(setMeetingbyCommitteeID_fail(t("Something-went-wrong")));
      });
  };
};

// schedule meeting on select date Init
const scheduleMeetingInit = () => {
  return {
    type: actions.SCHEDULE_MEETING_ON_SELECT_DATE_INIT,
  };
};

const scheduleMeetingSuccess = (response, message) => {
  return {
    type: actions.SCHEDULE_MEETING_ON_SELECT_DATE_SUCCESS,
    response: response,
    message: message,
  };
};

const scheduleMeetingFail = (message) => {
  return {
    type: actions.SCHEDULE_MEETING_ON_SELECT_DATE_FAIL,
    message: message,
  };
};

const scheduleMeetingMainApi = (navigate, t, scheduleMeeting) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(scheduleMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", ScheduleMeetingOnSelectedDate.RequestMethod);
    form.append("RequestData", JSON.stringify(scheduleMeeting));
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
          dispatch(scheduleMeetingMainApi(navigate, t, scheduleMeeting));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ScheduleMeetingOnSelectedDate_01".toLowerCase()
                )
            ) {
              dispatch(
                scheduleMeetingSuccess(
                  response.data.responseResult.responseMessage,
                  t("Record-saved")
                )
              );
              dispatch(showSceduleProposedMeeting(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ScheduleMeetingOnSelectedDate_02".toLowerCase()
                )
            ) {
              dispatch(scheduleMeetingFail(t("No-record-saved")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ScheduleMeetingOnSelectedDate_03".toLowerCase()
                )
            ) {
              dispatch(scheduleMeetingFail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ScheduleMeetingOnSelectedDate_04".toLowerCase()
                )
            ) {
              dispatch(
                scheduleMeetingFail(
                  t("The-meeting-must-be-in-a-proposed-state")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ScheduleMeetingOnSelectedDate_05".toLowerCase()
                )
            ) {
              dispatch(scheduleMeetingFail(t("The-user-must-be-an-organizer")));
            } else {
              dispatch(scheduleMeetingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(scheduleMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(scheduleMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(scheduleMeetingFail(t("Something-went-wrong")));
      });
  };
};
//Update Meeting Users For Participants

const UpdateMeetingUserInit = () => {
  return {
    type: actions.UPDATE_MEETING_USERS_INIT,
  };
};

const UpdateMeetingUserSuccess = (response, message, loader) => {
  return {
    type: actions.UPDATE_MEETING_USERS_SUCCESS,
    response: response,
    message: message,
    loader: loader,
  };
};

const UpdateMeetingUserFailed = (response, message) => {
  return {
    type: actions.UPDATE_MEETING_USERS_FAILED,
    message: message,
  };
};

const UpdateMeetingUserApiFunc = (
  navigate,
  Data,
  t,
  rspvRows,
  editableSave,
  currentMeeting,
  rows,
  ResponseDate,
  loader,
  setProposedNewMeeting
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(UpdateMeetingUserInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", UpdateMeetingUserhit.RequestMethod);
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        try {
          if (response.data.responseCode === 417) {
            await dispatch(RefreshToken(navigate, t));
            dispatch(
              UpdateMeetingUserApiFunc(
                navigate,
                Data,
                t,
                rspvRows,
                editableSave,
                currentMeeting,
                rows,
                ResponseDate,
                loader,
                setProposedNewMeeting
              )
            );
          } else if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomManager_UpdateMeetingUsers_01".toLowerCase()
                  )
              ) {
                dispatch(
                  UpdateMeetingUserSuccess(
                    response.data.responseResult,
                    "",
                    loader
                  )
                );

                if (Number(editableSave) === 1) {
                  let newData = [];
                  let copyData = [...rspvRows];
                  copyData.forEach((data, index) => {
                    newData.push({
                      UserID: data.userID,
                      Title: data.Title,
                      ParticipantRoleID: data.participantRole.participantRoleID
                        ? data.participantRole.participantRoleID
                        : 0,
                    });
                  });
                  let Data = {
                    MeetingParticipants: newData,
                    MeetingID: Number(currentMeeting),
                    IsParticipantsAddFlow: false,
                    NotificationMessage: "",
                  };
                  dispatch(
                    SaveparticipantsApi(Data, navigate, t, currentMeeting)
                  );
                } else if (Number(editableSave) === 2) {
                  let newData = [];
                  let copyData = [...rspvRows];
                  copyData.forEach((data, index) => {
                    newData.push({
                      UserID: data.userID,
                      Title: data.Title,
                      ParticipantRoleID: data.participantRole.participantRoleID
                        ? data.participantRole.participantRoleID
                        : 0,
                    });
                  });
                  let Data = {
                    MeetingParticipants: newData,
                    MeetingID: Number(currentMeeting),
                    IsParticipantsAddFlow: true,
                    NotificationMessage: "",
                  };

                  dispatch(
                    SaveparticipantsApi(Data, navigate, t, currentMeeting)
                  );
                } else if (Number(editableSave) === 3) {
                  let newMembers = [];
                  let DublicateData = [...rspvRows];
                  DublicateData.forEach((data, index) => {
                    newMembers.push({
                      UserID: data.userID,
                      Title: "",
                      ParticipantRoleID: 2,
                    });
                  });
                  let saveParticipant = {
                    MeetingParticipants: newMembers,
                    MeetingID: currentMeeting,
                    IsParticipantsAddFlow: true,
                    NotificationMessage: "",
                  };
                  await dispatch(
                    SaveparticipantsApi(
                      saveParticipant,
                      navigate,
                      t,
                      currentMeeting,
                      true,
                      rows,
                      ResponseDate,
                      true,
                      setProposedNewMeeting
                    )
                  );
                }
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "DataRoom_DataRoomManager_UpdateMeetingUsers_02".toLowerCase()
                  )
              ) {
                dispatch(UpdateMeetingUserFailed(t("Something-went-wrong")));
              }
            } else {
              dispatch(UpdateMeetingUserFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(UpdateMeetingUserFailed(t("Something-went-wrong")));
          }
        } catch (error) {}
      })
      .catch((response) => {
        dispatch(UpdateMeetingUserFailed(t("Something-went-wrong")));
      });
  };
};

//Update Meeting Users For Agenda Contributor

const UpdateMeetingUserAgendaContributorInit = () => {
  return {
    type: actions.UPDATE_MEETING_USERS_INIT,
  };
};

const UpdateMeetingUserAgendaContributorSuccess = (response, message) => {
  return {
    type: actions.UPDATE_MEETING_USERS_SUCCESS,
    response: response,
    message: message,
  };
};

const UpdateMeetingUserAgendaContributorFailed = (response, message) => {
  return {
    type: actions.UPDATE_MEETING_USERS_FAILED,
    message: message,
  };
};

const UpdateMeetingUserForAgendaContributor = (
  navigate,
  Data,
  t,
  rowsData,
  currentMeeting,
  isEditFlag,
  notifyMessageField
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(UpdateMeetingUserAgendaContributorInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", UpdateMeetingUserhit.RequestMethod);
    axios({
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
            UpdateMeetingUserForAgendaContributor(
              navigate,
              Data,
              t,
              rowsData,
              currentMeeting,
              isEditFlag,
              notifyMessageField
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_UpdateMeetingUsers_01".toLowerCase()
                )
            ) {
              await dispatch(
                UpdateMeetingUserAgendaContributorSuccess(
                  response.data.responseResult,
                  ""
                )
              );
              if (isEditFlag === 1) {
                let newData = [];
                let copyData = [...rowsData];
                copyData.forEach((data, index) => {
                  newData.push({
                    UserID: data.userID,
                    Title: data.Title,
                    AgendaListRightsAll: data.agendaListRightsAll,
                    MeetingID:
                      currentMeeting !== null ? Number(currentMeeting) : 0,
                    IsContributorNotified: data.isContributorNotified,
                  });
                });
                let Data = {
                  AgendaContributors: newData,
                  MeetingID: Number(currentMeeting),
                  IsAgendaContributorAddFlow: false,
                  NotificationMessage: notifyMessageField,
                };
                dispatch(
                  saveAgendaContributors(
                    navigate,
                    t,
                    Data,
                    currentMeeting,
                    isEditFlag
                  )
                );
              } else {
                let newData = [];
                let copyData = [...rowsData];
                copyData.forEach((data, index) => {
                  newData.push({
                    UserID: data.userID,
                    Title: data.Title,
                    AgendaListRightsAll: data.agendaListRightsAll,
                    MeetingID:
                      currentMeeting !== null ? Number(currentMeeting) : 0,
                    IsContributorNotified: data.isContributorNotified,
                  });
                });
                let Data = {
                  AgendaContributors: newData,
                  MeetingID: Number(currentMeeting),
                  IsAgendaContributorAddFlow: true,
                  NotificationMessage: notifyMessageField,
                };
                dispatch(
                  saveAgendaContributors(
                    navigate,
                    t,
                    Data,
                    currentMeeting,
                    isEditFlag
                  )
                );
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_UpdateMeetingUsers_02".toLowerCase()
                )
            ) {
              dispatch(
                UpdateMeetingUserAgendaContributorFailed(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              UpdateMeetingUserAgendaContributorFailed(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            UpdateMeetingUserAgendaContributorFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          UpdateMeetingUserAgendaContributorFailed(t("Something-went-wrong"))
        );
      });
  };
};

//Update Meeting Users For Organizers

const UpdateMeetingUserOrganizersInit = () => {
  return {
    type: actions.UPDATE_MEETING_USERS_INIT,
  };
};

const UpdateMeetingUserOrganizersSuccess = (response, message) => {
  return {
    type: actions.UPDATE_MEETING_USERS_SUCCESS,
    response: response,
    message: message,
  };
};

const UpdateMeetingUserOrganizersFailed = (response, message) => {
  return {
    type: actions.UPDATE_MEETING_USERS_FAILED,
    message: message,
  };
};

const UpdateMeetingUserForOrganizers = (
  navigate,
  Data,
  t,
  saveMeetingFlag,
  editMeetingFlag,
  rowsData,
  currentMeeting,
  editFlag,
  notificationMessage,
  setIsEdit
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(UpdateMeetingUserOrganizersInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", UpdateMeetingUserhit.RequestMethod);
    axios({
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
            UpdateMeetingUserForOrganizers(
              navigate,
              Data,
              t,
              saveMeetingFlag,
              editMeetingFlag,
              rowsData,
              currentMeeting,
              editFlag,
              notificationMessage,
              setIsEdit
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_UpdateMeetingUsers_01".toLowerCase()
                )
            ) {
              await dispatch(
                UpdateMeetingUserOrganizersSuccess(
                  response.data.responseResult,
                  ""
                )
              );
              if (editFlag === 2) {
                let Data = {
                  MeetingOrganizers: rowsData.map((item) => {
                    return {
                      IsPrimaryOrganizer: item.isPrimaryOrganizer,
                      IsOrganizerNotified: item.isOrganizerNotified,
                      Title: item.organizerTitle,
                      UserID: item.userID,
                    };
                  }),
                  MeetingID: currentMeeting,
                  IsOrganizerAddFlow: false,
                  NotificationMessage: "",
                };
                //
                //

                dispatch(
                  SaveMeetingOrganizers(navigate, Data, t, currentMeeting)
                );
                dispatch(saveMeetingFlag(false));
                dispatch(editMeetingFlag(false));
              } else if (editFlag === 1) {
                let Data = {
                  MeetingOrganizers: rowsData.map((item) => {
                    return {
                      IsPrimaryOrganizer: item.isPrimaryOrganizer,
                      IsOrganizerNotified: item.isOrganizerNotified,
                      Title: item.organizerTitle,
                      UserID: item.userID,
                    };
                  }),
                  MeetingID: currentMeeting,
                  IsOrganizerAddFlow: true,
                  NotificationMessage: notificationMessage,
                };

                dispatch(
                  SaveMeetingOrganizers(navigate, Data, t, currentMeeting)
                );
                dispatch(saveMeetingFlag(false));
                dispatch(editMeetingFlag(false));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_UpdateMeetingUsers_02".toLowerCase()
                )
            ) {
              dispatch(
                UpdateMeetingUserOrganizersFailed(t("Something-went-wrong"))
              );
              setIsEdit(true);
            }
          } else {
            dispatch(
              UpdateMeetingUserOrganizersFailed(t("Something-went-wrong"))
            );
            setIsEdit(true);
          }
        } else {
          dispatch(
            UpdateMeetingUserOrganizersFailed(t("Something-went-wrong"))
          );
          setIsEdit(true);
        }
      })
      .catch((response) => {
        dispatch(UpdateMeetingUserOrganizersFailed(t("Something-went-wrong")));
        setIsEdit(true);
      });
  };
};

const showUnsavedViewMinutesModal = (response) => {
  return {
    type: actions.UNSAVE_VIEW_MINTUES_MODAL,
    response: response,
  };
};

const showUnsavedViewPollsModal = (response) => {
  return {
    type: actions.UNSAVED_VIEW_POLLS_MODAL,
    response: response,
  };
};

const ShowNextConfirmationModal = (response) => {
  return {
    type: actions.NEXT_CONFIRMATION_MODAL,
    response: response,
  };
};

const showPreviousConfirmationModal = (response) => {
  return {
    type: actions.PREVIOUS_MODAL,
    response: response,
  };
};

const showAttendanceConfirmationModal = (response) => {
  return {
    type: actions.ATTENDENCE_ASSURANCE_MODAL,
    response: response,
  };
};

const clearResponseNewMeetingReducerMessage = () => {
  return {
    type: actions.NEWMEETING_RESPONSEMESSAGE,
  };
};

//aLL DOCUMENTS FOR AGENDA WISE MINUTES
const showAllDocumentsAgendaWiseMinutesInit = () => {
  return {
    type: actions.GET_ALL_AGENDAWISE_DOCUMENT_INIT,
  };
};

const showAllDocumentsAgendaWiseMinutesSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_AGENDAWISE_DOCUMENT_SUCCESS,
    response: response,
    message: message,
  };
};

const showAllDocumentsAgendaWiseMinutesFailed = (message) => {
  return {
    type: actions.GET_ALL_AGENDAWISE_DOCUMENT_FAILED,
    message: message,
  };
};

const AllDocumentsForAgendaWiseMinutesApiFunc = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(showAllDocumentsAgendaWiseMinutesInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllagendaWiseDocumentsApi.RequestMethod);

    try {
      const response = await axios({
        method: "post",
        url: dataRoomApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        // Retry the API request
        await dispatch(
          AllDocumentsForAgendaWiseMinutesApiFunc(navigate, Data, t)
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetAllAgendaWiseMinuteDocumentsForMeeting_01".toLowerCase()
              )
          ) {
            await dispatch(
              showAllDocumentsAgendaWiseMinutesSuccess(
                response.data.responseResult,
                ""
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetAllAgendaWiseMinuteDocumentsForMeeting_02".toLowerCase()
              )
          ) {
            dispatch(
              showAllDocumentsAgendaWiseMinutesFailed(t("No-data-available"))
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "DataRoom_DataRoomManager_GetAllAgendaWiseMinuteDocumentsForMeeting_03".toLowerCase()
              )
          ) {
            dispatch(
              showAllDocumentsAgendaWiseMinutesFailed(t("Something-went-wrong"))
            );
          } else {
            dispatch(
              showAllDocumentsAgendaWiseMinutesFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            showAllDocumentsAgendaWiseMinutesFailed(t("Something-went-wrong"))
          );
        }
      } else {
        dispatch(
          showAllDocumentsAgendaWiseMinutesFailed(t("Something-went-wrong"))
        );
      }
    } catch (error) {
      dispatch(
        showAllDocumentsAgendaWiseMinutesFailed(t("Something-went-wrong"))
      );
    }
  };
};

//INVITE TO COLLABORATE

const showIniviteToCollaborateInit = () => {
  return {
    type: actions.INVITE_TO_COLLABORATE_INIT,
  };
};

const showIniviteToCollaborateSuccess = (response, message) => {
  return {
    type: actions.INVITE_TO_COLLABORATE_SUCCESS,
    response: response,
    message: message,
  };
};

const showIniviteToCollaborateFailed = (message) => {
  return {
    type: actions.INVITE_TO_COLLABORATE_FAILED,
    message: message,
  };
};

const InviteToCollaborateMinutesApiFunc = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(showIniviteToCollaborateInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", inviteForCollaboration.RequestMethod);

    try {
      const response = await axios({
        method: "post",
        url: meetingApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        // Retry the API request
        await dispatch(InviteToCollaborateMinutesApiFunc(navigate, Data, t));
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_InviteForMinuteCollaboration_01".toLowerCase()
              )
          ) {
            await dispatch(
              showIniviteToCollaborateSuccess(
                response.data.responseResult,
                t("Notification-sent")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_InviteForMinuteCollaboration_02".toLowerCase()
              )
          ) {
            dispatch(showIniviteToCollaborateFailed(t("No-notification-sent")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_InviteForMinuteCollaboration_03".toLowerCase()
              )
          ) {
            dispatch(showIniviteToCollaborateFailed(t("Something-went-wrong")));
          } else {
            dispatch(showIniviteToCollaborateFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showIniviteToCollaborateFailed(t("Something-went-wrong")));
        }
      } else {
        dispatch(showIniviteToCollaborateFailed(t("Something-went-wrong")));
      }
    } catch (error) {
      dispatch(showIniviteToCollaborateFailed(t("Something-went-wrong")));
    }
  };
};

//MQTT RESPONSES OF MEETING
const meetingStatusProposedMqtt = (response) => {
  return {
    type: actions.MQTT_MEETING_STATUS_PROPOSED,
    response: response,
  };
};

const meetingStatusPublishedMqtt = (response) => {
  console.log(response, "meetingStatusPublishedMqttmeetingStatusPublishedMqtt");
  return {
    type: actions.MQTT_MEETING_STATUS_PUBLISHED,
    response: response,
  };
};

const meetingNotConductedMQTT = (response) => {
  return {
    type: actions.MQTT_MEETING_STATUS_NOTCONDUCTED,
    response: response,
  };
};

//Validate Empty String User Availibility For Meeting

const validateEmptyStringUserAvailibilityInit = () => {
  return {
    type: actions.VALIDATE_EMPTY_STRING_INIT,
  };
};

const validateEmptyStringUserAvailibilitySuccess = (response, message) => {
  return {
    type: actions.VALIDATE_EMPTY_STRING_SUCCESS,
    response: response,
    message: message,
  };
};

const validateEmptyStringUserAvailibilityFailed = (message) => {
  return {
    type: actions.VALIDATE_EMPTY_STRING_FAILED,
    message: message,
  };
};

const validateEncryptedStringUserAvailibilityForMeetingApi = (
  navigate,
  Data,
  t
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(validateEmptyStringUserAvailibilityInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      validateEncryptedStringUserAvailabilityForMeeting.RequestMethod
    );

    try {
      const response = await axios({
        method: "post",
        url: meetingApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        // Retry the API request
        await dispatch(
          validateEncryptedStringUserAvailibilityForMeetingApi(
            navigate,
            Data,
            t
          )
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_ValidateEncryptedStringUserAvailabilityForMeeting_01".toLowerCase()
              )
          ) {
            await dispatch(
              validateEmptyStringUserAvailibilitySuccess(
                response.data.responseResult,
                t("Successfully-updated")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_ValidateEncryptedStringUserAvailabilityForMeeting_02".toLowerCase()
              )
          ) {
            navigate("/Diskus/Meeting");
            dispatch(
              validateEmptyStringUserAvailibilityFailed(t("Validation-failed"))
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_ValidateEncryptedStringUserAvailabilityForMeeting_03".toLowerCase()
              )
          ) {
            dispatch(
              validateEmptyStringUserAvailibilityFailed(
                t("Something-went-wrong")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_ValidateEncryptedStringUserAvailabilityForMeeting_04".toLowerCase()
              )
          ) {
            dispatch(
              validateEmptyStringUserAvailibilityFailed(
                t("Failed-to-update-attendee-avaliability")
              )
            );
          } else {
            dispatch(
              validateEmptyStringUserAvailibilityFailed(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            validateEmptyStringUserAvailibilityFailed(t("Something-went-wrong"))
          );
        }
      } else {
        dispatch(
          validateEmptyStringUserAvailibilityFailed(t("Something-went-wrong"))
        );
      }
    } catch (error) {
      dispatch(
        validateEmptyStringUserAvailibilityFailed(t("Something-went-wrong"))
      );
    }
  };
};

const dashboardCalendarEvent = (response) => {
  return {
    type: actions.DASHBOARD_CALENDAR_DATA,
    response: response,
  };
};

const scheduleMeetingPageFlag = (response) => {
  return {
    type: actions.SCHEDULE_NEW_MEETING_PAGE_FLAG,
    response: response,
  };
};

const viewProposeDateMeetingPageFlag = (response) => {
  return {
    type: actions.VIEW_PROPOSED_DATE_MEETING_PAGE_FLAG,
    response: response,
  };
};

const viewAdvanceMeetingPublishPageFlag = (response) => {
  return {
    type: actions.VIEW_ADVANCE_MEETING_PUBLISH_PAGE_FLAG,
    response: response,
  };
};

const viewAdvanceMeetingUnpublishPageFlag = (response) => {
  return {
    type: actions.VIEW_ADVANCE_MEETING_UNPUBLISH_PAGE_FLAG,
    response: response,
  };
};

const viewProposeOrganizerMeetingPageFlag = (response) => {
  return {
    type: actions.VIEW_PROPOSE_PRGANIZER_MEETING_PAGE_FLAG,
    response: response,
  };
};

const proposeNewMeetingPageFlag = (response) => {
  return {
    type: actions.PROPOSE_NEW_MEETING_PAGE_FLAG,
    response: response,
  };
};

// get user wise proposed dates in unpublished meeting on organizer start
const getUserProposedDatesInit = () => {
  return {
    type: actions.GET_USER_PROPOSED_DATES_INIT,
  };
};

const getUserProposedDatesSuccess = (response, message) => {
  return {
    type: actions.GET_USER_PROPOSED_DATES_SUCCESS,
    response: response,
    message: message,
  };
};

const getUserProposedDatesFail = (message) => {
  return {
    type: actions.GET_USER_PROPOSED_DATES_FAIL,
    message: message,
  };
};

const getUserWiseProposedDatesMainApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getUserProposedDatesInit());
    let form = new FormData();
    form.append("RequestMethod", getUserWiseProposeDateOrganizer.RequestMethod);
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
          dispatch(getUserWiseProposedDatesMainApi(navigate, t, Data));
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
                getUserProposedDatesSuccess(
                  response.data.responseResult.userWiseMeetingProposedDates,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUserWiseProposedDates_02".toLowerCase()
                )
            ) {
              dispatch(getUserProposedDatesFail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetUserWiseProposedDates_03".toLowerCase()
                )
            ) {
              dispatch(getUserProposedDatesFail(t("Something-went-wrong")));
            } else {
              dispatch(getUserProposedDatesFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getUserProposedDatesFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getUserProposedDatesFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getUserProposedDatesFail(t("Something-went-wrong")));
      });
  };
};

// get user wise proposed dates in unpublished meeting on organizer end

const sidebarPopupAdvanceMeeting = (response) => {
  return {
    type: actions.SIDEBAR_POPUP_ADVANCE_MEETING,
    response: response,
  };
};

//Meeting Details
const meetingDetailsGlobalFlag = (response) => {
  return {
    type: actions.MEETING_DETAILS_GLOBAL_FLAG,
    response: response,
  };
};

//Organizers
const organizersGlobalFlag = (response) => {
  return {
    type: actions.ORGANIZERS_GLOBAL_FLAG,
    response: response,
  };
};

//Agenda Contributors
const agendaContributorsGlobalFlag = (response) => {
  return {
    type: actions.AGENDA_CONTRIBUTORS_GLOBAL_FLAG,
    response: response,
  };
};

//Participants
const participantsGlobalFlag = (response) => {
  return {
    type: actions.PARTICIPANTS_GLOBAL_FLAG,
    response: response,
  };
};

//Agenda
const agendaGlobalFlag = (response) => {
  return {
    type: actions.AGENDA_GLOBAL_FLAG,
    response: response,
  };
};

//Meeting Material
const meetingMaterialGlobalFlag = (response) => {
  return {
    type: actions.MEETING_MATERIAL_GLOBAL_FLAG,
    response: response,
  };
};

//Minutes
const minutesGlobalFlag = (response) => {
  return {
    type: actions.MINUTES_GLOBAL_FLAG,
    response: response,
  };
};

//Proposed Meeting Dates
const proposedMeetingDatesGlobalFlag = (response) => {
  return {
    type: actions.PROPOSED_MEETING_DATES_GLOBAL_FLAG,
    response: response,
  };
};

//Actions Page
const actionsGlobalFlag = (response) => {
  return {
    type: actions.ACTIONS_GLOBAL_FLAG,
    response: response,
  };
};

//Polls
const pollsGlobalFlag = (response) => {
  return {
    type: actions.POLLS_GLOBAL_FLAG,
    response: response,
  };
};

//Attendance
const attendanceGlobalFlag = (response) => {
  return {
    type: actions.ATTENDANCE_GLOBAL_FLAG,
    response: response,
  };
};

//Upload Document
const uploadGlobalFlag = (response) => {
  return {
    type: actions.UPLOAD_GLOBAL_FLAG,
    response: response,
  };
};

// end meeting new Api
const endMeetingInit = () => {
  return {
    type: actions.END_MEETING_STATUS_INIT,
  };
};

const endMeetingSuccess = (response, message) => {
  return {
    type: actions.END_MEETING_STATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const endMeetingFail = (message) => {
  return {
    type: actions.END_MEETING_STATUS_FAIL,
    message: message,
  };
};

const endMeetingStatusApi = (navigate, t, Data, setViewFlag) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let leaveMeetingData = {
    FK_MDID: Data.MeetingID,
    DateTime: getCurrentDateTimeUTC(),
  };
  return async (dispatch) => {
    await dispatch(endMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", endMeetingStatus.RequestMethod);
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
          dispatch(endMeetingStatusApi(navigate, t, Data, setViewFlag));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_01".toLowerCase()
                )
            ) {
              dispatch(
                endMeetingSuccess(
                  response.data.responseResult,
                  t("Record-updated")
                )
              );
              dispatch(
                LeaveCurrentMeeting(
                  navigate,
                  t,
                  leaveMeetingData,
                  true,
                  setViewFlag
                )
              );
              let currentView = localStorage.getItem("MeetingCurrentView");
              let meetingpageRow = localStorage.getItem("MeetingPageRows");
              let meetingPageCurrent = parseInt(
                localStorage.getItem("MeetingPageCurrent")
              );
              let userID = localStorage.getItem("userID");
              let searchData = {
                Date: "",
                Title: "",
                HostName: "",
                UserID: Number(userID),
                PageNumber:
                  meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
                Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
                PublishedMeetings:
                  currentView && Number(currentView) === 1 ? true : false,
              };
              await dispatch(searchNewUserMeeting(navigate, searchData, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_02".toLowerCase()
                )
            ) {
              dispatch(endMeetingFail(t("No-records-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_03".toLowerCase()
                )
            ) {
              dispatch(endMeetingFail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_04".toLowerCase()
                )
            ) {
              dispatch(endMeetingFail(t("Add-meeting-agenda-to-publish")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_05".toLowerCase()
                )
            ) {
              dispatch(endMeetingFail(t("Add-meeting-organizers-to-publish")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_06".toLowerCase()
                )
            ) {
              dispatch(
                endMeetingFail(t("Add-meeting-participants-to-publish"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_07".toLowerCase()
                )
            ) {
              dispatch(
                endMeetingFail(
                  t("Meeting-cannot-be-published-after-time-has-elapsed")
                )
              );
            } else {
              dispatch(endMeetingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(endMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(endMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(endMeetingFail(t("Something-went-wrong")));
      });
  };
};

const meetingAgendaContributorAdded = (response) => {
  return {
    type: actions.MQTT_MEETING_AC_ADDED,
    response: response,
  };
};

const meetingAgendaContributorRemoved = (response) => {
  return {
    type: actions.MQTT_MEETING_AC_REMOVED,
    response: response,
  };
};

const meetingOrganizerAdded = (response) => {
  return {
    type: actions.MQTT_MEETING_ORG_ADDED,
    response: response,
  };
};

const meetingOrganizerRemoved = (response) => {
  return {
    type: actions.MQTT_MEETING_ORG_REMOVED,
    response: response,
  };
};

// Join meeting new Api
const joinMeetingInit = () => {
  return {
    type: actions.JOIN_MEETING_INIT,
  };
};

const joinMeetingSuccess = (response, message) => {
  return {
    type: actions.JOIN_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

const joinMeetingFail = (message) => {
  return {
    type: actions.JOIN_MEETING_FAIL,
    message: message,
  };
};

const JoinCurrentMeeting = (
  isQuickMeeting,
  navigate,
  t,
  Data,
  setViewFlag,
  setEditFlag,
  setSceduleMeeting,
  no,
  setAdvanceMeetingModalID,
  setViewAdvanceMeetingModal
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    await dispatch(joinMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", joinMeeting.RequestMethod);
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
            JoinCurrentMeeting(
              isQuickMeeting,
              navigate,
              t,
              Data,
              setViewFlag,
              setEditFlag,
              setSceduleMeeting,
              no,
              setAdvanceMeetingModalID,
              setViewAdvanceMeetingModal
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeeting_01".toLowerCase()
                )
            ) {
              await dispatch(
                joinMeetingSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              if (isQuickMeeting === true) {
                let viewMeetingData = { MeetingID: Data.FK_MDID };
                await dispatch(
                  ViewMeeting(
                    navigate,
                    viewMeetingData,
                    t,
                    setViewFlag,
                    setEditFlag,
                    setSceduleMeeting,
                    no
                  )
                );
              } else {
                setAdvanceMeetingModalID(Data.FK_MDID);
                setViewAdvanceMeetingModal(true);
                await dispatch(viewAdvanceMeetingPublishPageFlag(true));
                await dispatch(scheduleMeetingPageFlag(false));
                localStorage.setItem("currentMeetingID", Data.FK_MDID);
              }
              dispatch(currentMeetingStatus(10));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeeting_02".toLowerCase()
                )
            ) {
              dispatch(joinMeetingFail(t("Unsuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeeting_03".toLowerCase()
                )
            ) {
              dispatch(joinMeetingFail(t("Something-went-wrong")));
            } else {
              dispatch(joinMeetingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(joinMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(joinMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(joinMeetingFail(t("Something-went-wrong")));
      });
  };
};

// Leave meeting new Api
const leaveMeetingInit = () => {
  return {
    type: actions.LEAVE_MEETING_INIT,
  };
};

const leaveMeetingQuickSuccess = (response, message) => {
  return {
    type: actions.LEAVE_MEETING_SUCCESS_QUICK,
    response: response,
    message: message,
  };
};

const leaveMeetingAdvancedSuccess = (response, message) => {
  return {
    type: actions.LEAVE_MEETING_SUCCESS_ADVANCED,
    response: response,
    message: message,
  };
};

const leaveMeetingFail = (message) => {
  return {
    type: actions.LEAVE_MEETING_FAIL,
    message: message,
  };
};

const LeaveCurrentMeeting = (
  navigate,
  t,
  Data,
  isQuickMeeting,
  setViewFlag,
  setEdiorRole,
  setAdvanceMeetingModalID,
  setViewAdvanceMeetingModal
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");
  return async (dispatch) => {
    await dispatch(leaveMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", leaveMeeting.RequestMethod);
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
            LeaveCurrentMeeting(
              navigate,
              t,
              Data,
              isQuickMeeting,
              setViewFlag,
              setEdiorRole,
              setAdvanceMeetingModalID,
              setViewAdvanceMeetingModal
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeaveMeeting_01".toLowerCase()
                )
            ) {
              dispatch(currentMeetingStatus(0));
              if (isQuickMeeting) {
                dispatch(
                  leaveMeetingQuickSuccess(
                    response.data.responseResult,
                    t("Successful")
                  )
                );
                let searchData = {
                  Date: "",
                  Title: "",
                  HostName: "",
                  UserID: Number(userID),
                  PageNumber: Number(meetingPageCurrent),
                  Length: Number(meetingpageRow),
                  PublishedMeetings: true,
                };
                await dispatch(searchNewUserMeeting(navigate, searchData, t));
              } else {
                dispatch(
                  leaveMeetingAdvancedSuccess(
                    response.data.responseResult,
                    t("Successful")
                  )
                );
                let searchData = {
                  Date: "",
                  Title: "",
                  HostName: "",
                  UserID: Number(userID),
                  PageNumber: Number(meetingPageCurrent),
                  Length: Number(meetingpageRow),
                  PublishedMeetings: true,
                };
                await dispatch(searchNewUserMeeting(navigate, searchData, t));
                localStorage.removeItem("folderDataRoomMeeting");
                setEdiorRole({ status: null, role: null });
                setAdvanceMeetingModalID(null);
                setViewAdvanceMeetingModal(false);
                dispatch(viewAdvanceMeetingPublishPageFlag(false));
                dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
              }
              setViewFlag(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeaveMeeting_02".toLowerCase()
                )
            ) {
              dispatch(leaveMeetingFail(t("Unsuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeaveMeeting_04".toLowerCase()
                )
            ) {
              dispatch(leaveMeetingFail(t("Join-Log-Not-Found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeeting_03".toLowerCase()
                )
            ) {
              dispatch(leaveMeetingFail(t("Something-went-wrong")));
            } else {
              dispatch(leaveMeetingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(leaveMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(leaveMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(leaveMeetingFail(t("Something-went-wrong")));
      });
  };
};

const LeaveCurrentMeetingOtherMenus = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    await dispatch(leaveMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", leaveMeeting.RequestMethod);
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
          dispatch(LeaveCurrentMeetingOtherMenus(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeaveMeeting_01".toLowerCase()
                )
            ) {
              dispatch(currentMeetingStatus(0));
              dispatch(
                leaveMeetingAdvancedSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeaveMeeting_02".toLowerCase()
                )
            ) {
              dispatch(leaveMeetingFail(t("Unsuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeaveMeeting_04".toLowerCase()
                )
            ) {
              dispatch(leaveMeetingFail(t("Join-Log-Not-Found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeeting_03".toLowerCase()
                )
            ) {
              dispatch(leaveMeetingFail(t("Something-went-wrong")));
            } else {
              dispatch(leaveMeetingFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(leaveMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(leaveMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(leaveMeetingFail(t("Something-went-wrong")));
      });
  };
};

//Meetin Status Current
const currentMeetingStatus = (response) => {
  return {
    type: actions.CURRENT_MEETING_STATUS,
    response: response,
  };
};
const meetingParticipantAdded = (response) => {
  return {
    type: actions.MQTT_MEETING_PAR_ADDED,
    response: response,
  };
};
const meetingParticipantRemoved = (response) => {
  return {
    type: actions.MQTT_MEETING_PAR_REMOVED,
    response: response,
  };
};

const validateStringEmail_init = () => {
  return {
    type: actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_INIT,
  };
};
const validateStringEmail_success = (response, message) => {
  return {
    type: actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_SUCCESS,
    response: response,
    message: message,
  };
};

const validateStringEmail_fail = (message) => {
  return {
    type: actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_FAIL,
    message: message,
  };
};

// const validateStringEmailApi = (emailString, navigate, t, RouteNo) => {
//   let Data = {
//     EncryptedString: emailString,
//   };
//   let token = JSON.parse(localStorage.getItem("token"));
//   return async (dispatch) => {
//     await dispatch(validateStringEmail_init());
//     let form = new FormData();
//     form.append("RequestMethod", ValidateEmailRelatedString.RequestMethod);
//     form.append("RequestData", JSON.stringify(Data));
//     axios({
//       method: "post",
//       url: meetingApi,
//       data: form,
//       headers: {
//         _token: token,
//       },
//     })
//       .then(async (response) => {
//         if (response.data.responseCode === 417) {
//           await dispatch(RefreshToken(navigate, t));
//           dispatch(validateStringEmailApi(emailString, navigate, t, RouteNo));
//         } else if (response.data.responseCode === 200) {
//           if (response.data.responseResult.isExecuted === true) {
//             if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Meeting_MeetingServiceManager_ValidateEncryptedStringMeetingRelatedEmailData_01".toLowerCase()
//                 )
//             ) {
//               await dispatch(
//                 validateStringEmail_success(
//                   response.data.responseResult?.data,
//                   t("Successfully")
//                 )
//               );
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Meeting_MeetingServiceManager_ValidateEncryptedStringMeetingRelatedEmailData_02".toLowerCase()
//                 )
//             ) {
//               dispatch(validateStringEmail_fail(t("Unsuccessful")));
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Meeting_MeetingServiceManager_ValidateEncryptedStringMeetingRelatedEmailData_03".toLowerCase()
//                 )
//             ) {
//               dispatch(validateStringEmail_fail(t("Something-went-wrong")));
//             }
//           } else {
//             dispatch(validateStringEmail_fail(t("Something-went-wrong")));
//           }
//         } else {
//           dispatch(validateStringEmail_fail(t("Something-went-wrong")));
//         }
//       })
//       .catch((response) => {
//         dispatch(validateStringEmail_fail("Something-went-wrong"));
//       });
//   };
// };
const validateStringEmailApi = (
  emailString,
  navigate,
  t,
  RouteNo,
  dispatch
) => {
  return new Promise((resolve, reject) => {
    let Data = {
      EncryptedString: emailString,
    };
    let token = JSON.parse(localStorage.getItem("token"));

    dispatch(validateStringEmail_init());

    let form = new FormData();
    form.append("RequestMethod", ValidateEmailRelatedString.RequestMethod);
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
          // Retry the API call
          resolve(
            dispatch(
              validateStringEmailApi(
                emailString,
                navigate,
                t,
                RouteNo,
                dispatch
              )
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ValidateEncryptedStringMeetingRelatedEmailData_01".toLowerCase()
                )
            ) {
              await dispatch(
                validateStringEmail_success(
                  response.data.responseResult?.data,
                  t("Successfully")
                )
              );
              dispatch(emailRouteID(RouteNo));
              resolve(response.data.responseResult.data);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ValidateEncryptedStringMeetingRelatedEmailData_02".toLowerCase()
                )
            ) {
              dispatch(validateStringEmail_fail(t("Unsuccessful")));
              reject("Unsuccessful");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_ValidateEncryptedStringMeetingRelatedEmailData_03".toLowerCase()
                )
            ) {
              dispatch(validateStringEmail_fail(t("Something-went-wrong")));
              reject("Something-went-wrong");
            }
          } else {
            dispatch(validateStringEmail_fail(t("Something-went-wrong")));
            reject("Something-went-wrong");
          }
        } else {
          dispatch(validateStringEmail_fail(t("Something-went-wrong")));
          reject("Something-went-wrong");
        }
      })
      .catch((error) => {
        dispatch(validateStringEmail_fail("Something-went-wrong"));
        reject(error);
      });
  });
};

const emailRouteID = (id) => {
  return {
    type: actions.EMAIL_ROUTE_ID,
    response: id,
  };
};

export {
  emailRouteID,
  clearResponseNewMeetingReducerMessage,
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
  FetchMeetingURLClipboard,
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
  GetAllGeneralMinutesApiFunc,
  ADDGeneralMinutesApiFunc,
  uploadDocumentsMeetingMinutesApi,
  saveFilesMeetingMinutesApi,
  RetriveDocumentsMeetingGenralMinutesApiFunc,
  SaveMinutesDocumentsApiFunc,
  DocumentsOfMeetingGenralMinutesApiFunc,
  DeleteGeneralMinutesApiFunc,
  UpdateMinutesGeneralApiFunc,
  AddAgendaWiseMinutesApiFunc,
  DeleteAgendaWiseMinutesApiFunc,
  UpdateAgendaWiseMinutesApiFunc,
  GetAllAgendaWiseMinutesApiFunc,
  getUserProposedWiseApi,
  UpateMeetingStatusLockApiFunc,
  SaveAgendaWiseDocumentsApiFunc,
  showGetAllMeetingDetialsFailed,
  uploadDocumentsMeetingAgendaWiseMinutesApi,
  saveFilesMeetingagendaWiseMinutesApi,
  AgendaWiseRetriveDocumentsMeetingMinutesApiFunc,
  setMeetingbyCommitteeIDApi,
  getMeetingByCommitteeIDApi,
  getMeetingbyGroupApi,
  setMeetingByGroupIDApi,
  DeleteGeneralMinuteDocumentsApiFunc,
  DeleteAgendaWiseMinutesDocumentsApiFunc,
  CreateUpdateMeetingDataRoomMapeedApiFunc,
  UpdateMeetingUserApiFunc,
  UpdateMeetingUserForAgendaContributor,
  UpdateMeetingUserForOrganizers,
  scheduleMeetingMainApi,
  showUnsavedViewMinutesModal,
  showUnsavedViewPollsModal,
  ShowNextConfirmationModal,
  showPreviousConfirmationModal,
  cleareAllState,
  CleareMessegeNewMeeting,
  showAttendanceConfirmationModal,
  showAllMeetingParticipantsSuccess,
  showGetAllMeetingDetialsInit,
  getAllAgendaContributor_fail,
  showAllMeetingParticipantsFailed,
  meetingMaterialFail,
  cleareMinutsData,
  showAllGeneralMinutesFailed,
  InviteToCollaborateMinutesApiFunc,
  meetingStatusProposedMqtt,
  meetingStatusPublishedMqtt,
  validateEncryptedStringUserAvailibilityForMeetingApi,
  dashboardCalendarEvent,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  proposeNewMeetingPageFlag,
  meetingNotConductedMQTT,
  getUserWiseProposedDatesMainApi,
  sidebarPopupAdvanceMeeting,
  viewMeetingFlag,
  meetingDetailsGlobalFlag,
  organizersGlobalFlag,
  agendaContributorsGlobalFlag,
  participantsGlobalFlag,
  agendaGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  actionsGlobalFlag,
  pollsGlobalFlag,
  attendanceGlobalFlag,
  cleareAllProposedMeetingDates,
  uploadGlobalFlag,
  endMeetingStatusApi,
  deleteSavedPollsMeeting,
  editFlowDeleteSavedPollsMeeting,
  meetingAgendaContributorAdded,
  meetingAgendaContributorRemoved,
  meetingOrganizerAdded,
  meetingOrganizerRemoved,
  meetingParticipantAdded,
  meetingParticipantRemoved,
  JoinCurrentMeeting,
  LeaveCurrentMeeting,
  LeaveCurrentMeetingOtherMenus,
  currentMeetingStatus,
  validateStringEmailApi,
  boardDeckModal,
  boardDeckShareModal,
  boardDeckEmailModal,
  AllDocumentsForAgendaWiseMinutesApiFunc,
};
