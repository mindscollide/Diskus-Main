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
  getAllagendaWiseDocumentsApi,
  inviteForCollaboration,
  validateEncryptedStringUserAvailabilityForMeeting,
  getUserWiseProposeDateOrganizer,
  endMeetingStatus,
  joinMeeting,
  leaveMeeting,
  ValidateEmailRelatedString,
  getDashboardMeetingStatsRM,
  validateEncryptedStringParticipantProposedRM,
  getAllMeetingUsersRSVPDetailsRM,
  leaveMeetingVideo,
  ProposeNewMeetingSaveParticipants,
  ValidateEncryptedStringUserMeetingProposeDatesPollRM,
  GetMeetingStatus,
  ValidateEncryptedStringMeetingRelatedEmailDataRM,
  MoveFilesToFoldersRM,
  GetMeetingRecordingFilesRM,
  RequestMeetingRecordingTranscriptRM,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import {
  callRequestReceivedMQTT,
  LeaveCall,
  LeaveInitmationMessegeVideoMeetAction,
} from "./VideoMain_actions";
import {
  joinPresenterViewMainApi,
  makeHostNow,
  maximizeVideoPanelFlag,
  maxParticipantVideoCallPanel,
  minimizeVideoPanelFlag,
  nonMeetingVideoGlobalModal,
  normalizeVideoPanelFlag,
  openPresenterViewMainApi,
  participantVideoButtonState,
  participantVideoNavigationScreen,
  participantWaitingListBox,
  presenterViewGlobalState,
  screenShareTriggeredGlobally,
  setAudioControlHost,
  setRaisedUnRaisedParticiant,
  setVideoControlHost,
  videoChatPanel,
  videoIconOrButtonState,
} from "./VideoFeature_actions";
import { ViewMeeting } from "./Get_List_Of_Assignees";
import { SaveMeetingOrganizers } from "./MeetingOrganizers_action";
import { getCurrentDateTimeUTC } from "../../commen/functions/date_formater";
import { getAllUnpublishedMeetingData } from "../../hooks/meetingResponse/response";
import {
  GetAdvanceMeetingAgendabyMeetingID,
  SaveMeetingDocuments,
} from "./MeetingAgenda_action";
import {
  MinutesWorkFlowActorStatusNotificationAPI,
  ResendUpdatedMinuteForReview,
} from "./Minutes_action";
import { mqttConnectionGuestUser } from "../../commen/functions/mqttconnection_guest";
import {
  handleMeetingNavigation,
  handleNavigationforParticipantVideoFlow,
  isFunction,
} from "../../commen/functions/utils";
import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";
import { webnotificationGlobalFlag } from "./UpdateUserNotificationSetting";
import NonMeetingVideoModal from "../../container/pages/meeting/viewMeetings/nonMeetingVideoModal/NonMeetingVideoModal";
import {
  createResolutionModal,
  resultResolutionFlag,
  viewAttachmentFlag,
  viewResolutionModal,
  voteResolutionFlag,
} from "./Resolution_actions";
import {
  createCommitteePageFlag,
  updateCommitteePageFlag,
  viewCommitteePageFlag,
} from "./Committee_actions";
import {
  createGroupPageFlag,
  updateGroupPageFlag,
  viewGroupPageFlag,
} from "./Groups_actions";

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
  setProposedNewMeeting,
  flag
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
                  IsUpdateFlow: flag ? true : false,
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
                    setProposedNewMeeting,
                    flag,
                    setSceduleMeeting
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
                  let meetingPageCurrent =
                    localStorage.getItem("MeetingPageCurrent");
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
                      meetingpageRow !== null ? Number(meetingpageRow) : 30,
                    PublishedMeetings:
                      currentView && Number(currentView) === 1 ? true : false,
                  };
                  console.log("chek search meeting");
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
                }
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
    dispatch(handlegetallReminderFrequencyInit());
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
const handleReucrringSInit = () => {
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
    dispatch(handleReucrringSInit());
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
const searchNewUserMeeting = (navigate, Data, t, val) => {
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
          console.log("chek search meeting");
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
              if (val === 1) {
                dispatch(ProposedMeetingViewFlagAction(false));
              }
              let getMeetingData = await getAllUnpublishedMeetingData(
                response.data.responseResult.meetings,
                1
              );
              let newMeetingData = {
                meetingStartedMinuteAgo:
                  response.data.responseResult.meetingStartedMinuteAgo,
                meetings: getMeetingData,
                pageNumbers: response.data.responseResult.pageNumbers,
                totalRecords: response.data.responseResult.totalRecords,
              };
              await dispatch(SearchMeeting_Success(newMeetingData, ""));
              let webNotifactionDataRoutecheckFlag = JSON.parse(
                localStorage.getItem("webNotifactionDataRoutecheckFlag")
              );
              try {
                if (webNotifactionDataRoutecheckFlag) {
                  dispatch(webnotificationGlobalFlag(true));
                }
              } catch (error) {
                console.log(error);
              }
              if (
                JSON.parse(localStorage.getItem("ProposedMeetingOrganizer")) ===
                true
              ) {
                if (
                  JSON.parse(localStorage.getItem("MeetingStatusID")) === 12
                ) {
                  //Notification Work
                  console.log("ComingIN");
                  //if the Meeting status is Proposed then navigate to the unpublished open Scedule Proposed meeting Modal
                  dispatch(showSceduleProposedMeeting(true));
                } else {
                  console.log("ComingIN");
                  //Else condition if the meeting status of the proposed meeting is not [published] then navigate to Proposed Meeting page
                  localStorage.removeItem("MeetingStatusID");
                  localStorage.removeItem("ProposedMeetingOrganizer");
                  localStorage.removeItem("ProposedMeetingOrganizerMeetingID");
                }
              }
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
  flag,
  currentMeetingTitle,
  meetingID
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(MeetingUrlSpinner(true));
    let form = new FormData();
    let videoMeetingID = Number(meetingID);
    console.log(videoMeetingID, "videoMeetingIDvideoMeetingID");
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
              flag,
              currentMeetingTitle,
              meetingID
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingVideoURLNew_01".toLowerCase()
                )
            ) {
              dispatch(showMeetingURLSuccess(response.data.responseResult, ""));
              mqttConnectionGuestUser(
                response.data.responseResult.userGUID,
                dispatch
              );
              dispatch(MeetingUrlSpinner(false));
              let meetingURL = response.data.responseResult.videoURL;
              var match = meetingURL.match(/RoomID=([^&]*)/);
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
                console.log("Check LeaveCall new");
                dispatch(LeaveCall(Data, navigate, t));
                localStorage.setItem("isCaller", false);
              }
              localStorage.setItem("isMeeting", true);
              localStorage.setItem("CallType", 2);
              console.log("leavecallMeetingVideo");
              localStorage.setItem("callTypeID", 2);
              localStorage.setItem("activeCall", true);
              localStorage.setItem("callerID", 9999);
              localStorage.setItem("acceptedRoomID", match[1]);
              localStorage.setItem("activeRoomID", match[1]);
              localStorage.setItem("acceptedRecipientID", currentUserID);
              localStorage.setItem("isMeetingVideo", true);
              localStorage.setItem("meetingVideoID", videoMeetingID);
              localStorage.setItem("meetingTitle", currentMeetingTitle);
              localStorage.setItem(
                "userGUID",
                response.data.responseResult.userGUID
              );
              dispatch(callRequestReceivedMQTT({}, ""));
              if (flag === 0) {
                console.log("Flag True");
                dispatch(maximizeVideoPanelFlag(true));
              } else {
                console.log("Flag False");
                dispatch(normalizeVideoPanelFlag(true));
              }
              dispatch(videoChatPanel(false));
              // dispatch(groupCallRecipients(groupCallActiveUsers))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingVideoURLNew_02".toLowerCase()
                )
            ) {
              dispatch(MeetingUrlSpinner(false));

              dispatch(showMeetingURLFailed(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingVideoURLNew_03".toLowerCase()
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

//Proposed New meeting for Saved participants (New API)
const saveParcipantsProposeMeetingInit = () => {
  return {
    type: actions.PARTICIPANT_SAVED_PROPOSED_NEW_MEETING_INIT,
  };
};

const saveParcipantsProposeMeetingSuccess = (response, message) => {
  return {
    type: actions.PARTICIPANT_SAVED_PROPOSED_NEW_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

const saveParcipantsProposeMeetingFail = (message) => {
  return {
    type: actions.PARTICIPANT_SAVED_PROPOSED_NEW_MEETING_FAIL,
    message: message,
  };
};

const saveParcipantsProposeMeetingAPI = (
  Data,
  navigate,
  t,
  currentMeeting,
  flag,
  rows,
  ResponseDate,
  setProposedNewMeeting,
  setSceduleMeeting
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(saveParcipantsProposeMeetingInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      ProposeNewMeetingSaveParticipants.RequestMethod
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
            saveParcipantsProposeMeetingAPI(
              Data,
              navigate,
              t,
              currentMeeting,
              flag,
              rows,
              ResponseDate,
              setProposedNewMeeting,
              setSceduleMeeting
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingParticipantsForProposedMeeting_01".toLowerCase()
                )
            ) {
              dispatch(
                saveParcipantsProposeMeetingSuccess(
                  response.data.responseResult,
                  t("Successfully-updated-participants-list")
                )
              );
              if (flag === true) {
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
                    setProposedNewMeeting,
                    setSceduleMeeting
                  )
                );
              } else {
                let Data = {
                  MeetingID: Number(currentMeeting),
                };
                dispatch(GetAllSavedparticipantsAPI(Data, navigate, t, false));
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingParticipantsForProposedMeeting_02".toLowerCase()
                )
            ) {
              dispatch(
                saveParcipantsProposeMeetingFail(
                  t("Participants Update Failed")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingParticipantsForProposedMeeting_03".toLowerCase()
                )
            ) {
              dispatch(
                saveParcipantsProposeMeetingFail(t("Something-went-wrong"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SaveMeetingParticipantsForProposedMeeting_04".toLowerCase()
                )
            ) {
              dispatch(
                saveParcipantsProposeMeetingFail(
                  t("Meeting is not in proposed state")
                )
              );
            } else {
              dispatch(
                saveParcipantsProposeMeetingFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              saveParcipantsProposeMeetingFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(saveParcipantsProposeMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(saveParcipantsProposeMeetingFail(t("Something-went-wrong")));
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
                let Data = {
                  MeetingID: currentMeeting,
                  SendResponsebyDate: ResponseDate,
                  ProposedDates: rows,
                };
                console.log(Data, "sendResponseByate");
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
                dispatch(GetAllSavedparticipantsAPI(Data, navigate, t, false));
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

const showAllMeetingParticipantsSuccess = (response, message, flag) => {
  return {
    type: actions.GET_ALL_SAVED_PARTICIPATNS_SUCCESS,
    response: response,
    message: message,
    loader: flag,
  };
};

const showAllMeetingParticipantsIsPublishedSuccess = (
  response,
  message,
  flag
) => {
  return {
    type: actions.GET_ALL_SAVED_PARTICIPATNS_ISPUBLISHED_SUCCESS,
    response: response,
    message: message,
    loader: flag,
  };
};

const showAllMeetingParticipantsAllowrsvp = (response, message, flag) => {
  return {
    type: actions.GET_ALL_SAVED_PARTICIPATNS_ALLOWRSVP,
    response: response,
    message: message,
    loader: flag,
  };
};

const showAllMeetingParticipantsFailed = (message) => {
  return {
    type: actions.GET_ALL_SAVED_PARTICIPATNS_FAILED,
    message: message,
  };
};

//Get All Saved  participants API Function

const GetAllSavedparticipantsAPI = (Data, navigate, t, flag) => {
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
          dispatch(GetAllSavedparticipantsAPI(Data, navigate, t, flag));
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
                  "",
                  flag
                )
              );
              dispatch(
                showAllMeetingParticipantsIsPublishedSuccess(
                  response.data.responseResult.isPublished,
                  "",
                  flag
                )
              );
              dispatch(
                showAllMeetingParticipantsAllowrsvp(
                  response.data.responseResult.allowRSVP,
                  "",
                  flag
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingParticipants_02".toLowerCase()
                )
            ) {
              dispatch(showAllMeetingParticipantsFailed("", flag));
              dispatch(
                showAllMeetingParticipantsIsPublishedSuccess(
                  response.data.responseResult.isPublished,
                  "",
                  flag
                )
              );
              dispatch(
                showAllMeetingParticipantsAllowrsvp(
                  response.data.responseResult.allowRSVP,
                  "",
                  flag
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
                "meetingTitle",
                response.data.responseResult.advanceMeetingDetails.meetingTitle
              );
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
                    GetAllMeetingRecurringApiNew(navigate, t, false)
                  );
                } else if (flag === 2) {
                  console.log("Flag for proposed meeting Edit flow only");
                }
              } else {
                await dispatch(
                  CreateUpdateMeetingDataRoomMapeedApiFunc(
                    navigate,
                    MappedData,
                    t,
                    setDataroomMapFolderId,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false
                  )
                );
              }

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
  setProposedNewMeeting,
  setSceduleMeeting
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
              setProposedNewMeeting,
              setSceduleMeeting
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
                  t("Your-slots-has-been-added-successfully")
                )
              );
              if (flag === true) {
                setProposedNewMeeting(false);
                console.log("saif i am here");
                let userID = localStorage.getItem("userID");
                let meetingpageRow = localStorage.getItem("MeetingPageRows");
                let meetingPageCurrent =
                  localStorage.getItem("MeetingPageCurrent");
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
                  Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
                  PublishedMeetings: false,
                };
                console.log("chek search meeting");
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

const SetMeetingResponseApiFunc = (
  Data,
  navigate,
  t,
  setViewProposeDatePoll
) => {
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
          dispatch(
            SetMeetingResponseApiFunc(Data, navigate, t, setViewProposeDatePoll)
          );
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
                  t("Your-vote-is-submitted-successfully")
                )
              );
              let userID = localStorage.getItem("userID");
              let meetingpageRow = localStorage.getItem("MeetingPageRows");
              let meetingPageCurrent =
                localStorage.getItem("MeetingPageCurrent");
              localStorage.setItem("MeetingCurrentView", 2);
              setViewProposeDatePoll(false);
              let searchData = {
                Date: "",
                Title: "",
                HostName: "",
                UserID: Number(userID),
                PageNumber:
                  meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
                Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
                PublishedMeetings: false,
              };
              console.log("chek search meeting");
              dispatch(searchNewUserMeeting(navigate, searchData, t));
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
    type: actions.SAVE_USER_ATTACHMENT_PERMISSION_FAILED,
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
                  t("Settings-are-saved-successfully")
                )
              );
              dispatch(showAdvancePermissionModal(false));
            } else if (
              response.data.responseResult.responseMessage ===
              "Meeting_MeetingServiceManager_SaveUserAttachmentPermission_02 "
            ) {
              dispatch(
                SaveUserAttachmentPermissionsFailed(t("No-record-saved"))
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
                //     ""
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
                // reject("No data available");
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
                // reject("Something went wrong");
              }
            } else {
              dispatch(
                showRetriveGeneralMinutesDocsMeetingFailed(
                  t("Something-went-wrong")
                )
              );
              // reject("Something went wrong");
            }
          } else {
            dispatch(
              showRetriveGeneralMinutesDocsMeetingFailed(
                t("Something-went-wrong")
              )
            );
            // reject("Something went wrong");
          }
        })
        .catch((error) => {
          dispatch(
            showRetriveGeneralMinutesDocsMeetingFailed(
              t("Something-went-wrong")
            )
          );
          // reject("Something went wrong");
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
                FileSizeOnDisk: Number(response.data.responseResult.fileSize),
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
                  ""
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

const clearProposedWiseData = () => {
  return {
    type: actions.CLEAR_GET_USER_WISE_PROPOSED,
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
            // await dispatch(
            //   GetAllGeneralMinutesApiFunc(
            //     navigate,
            //     t,
            //     Data,
            //     Number(currentMeeting),
            //     true
            //   )
            // );
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
  isAgenda,
  setAgendaOptionValue,
  setAddNoteFields,
  addNoteFields,
  setFileAttachments,
  setFileForSend,
  setisEdit
) => {
  let token = JSON.parse(localStorage.getItem("token"));
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
              setAgendaOptionValue({
                label: "",
                value: 0,
              });
              setAddNoteFields({
                ...addNoteFields,
                Description: {
                  value: "",
                  errorMessage: "",
                  errorStatus: true,
                },
              });

              setFileAttachments([]);
              setFileForSend([]);
              setisEdit(false);
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

const AddAgendaWiseMinutesApiFunc = (
  navigate,
  Data,
  t,
  setAgendaOptionValue
) => {
  let token = JSON.parse(localStorage.getItem("token"));
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
              (await isFunction(setAgendaOptionValue)) &&
                setAgendaOptionValue({
                  value: 0,
                  label: "",
                });
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
  isAgenda,
  fileUploadFlag
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentMeeting = JSON.parse(localStorage.getItem("currentMeetingID"));
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
            resendFlag,
            resendData,
            setEditMinute,
            setConfirmationEdit,
            setResendMinuteForReview,
            setShowRevisionHistory,
            isAgenda,
            fileUploadFlag
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
            let Meet = {
              MeetingID: currentMeeting,
            };
            if (!fileUploadFlag) {
              await dispatch(
                GetAllGeneralMinutesApiFunc(navigate, t, Meet, currentMeeting)
              );
            }
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
                FileSizeOnDisk: Number(response.data.responseResult.fileSize),
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
                  ""
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

const showCreateUpdateMeetingDataRoomSuccess = (response, message, flag) => {
  return {
    type: actions.CREATE_UPDATE_MEETING_DATA_ROOM_MAPPED_SUCCESS,
    response: response,
    message: message,
    loader: flag,
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
  setProposedNewMeeting,
  flag,
  setSceduleMeeting
) => {
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
              setProposedNewMeeting,
              flag,
              setSceduleMeeting
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
                  "",
                  flag
                )
              );
              localStorage.setItem(
                "folderDataRoomMeeting",
                response.data.responseResult.folderID
              );
              setDataroomMapFolderId(response.data.responseResult.folderID);
              let newarry = [];
              members.forEach((data, index) => {
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
                  setProposedNewMeeting,
                  setSceduleMeeting
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
                  t("Failed-to-save-or-map-folder"),
                  "",
                  flag
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
                  "",
                  flag
                )
              );
              localStorage.setItem(
                "folderDataRoomMeeting",
                response.data.responseResult.folderID
              );
              setDataroomMapFolderId(response.data.responseResult.folderID);
              let newarry = [];
              members.forEach((data, index) => {
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
                  "DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_04".toLowerCase()
                )
            ) {
              dispatch(
                showCreateUpdateMeetingDataRoomFailed(
                  t("Unable-to-update-folder"),
                  "",
                  flag
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
                  "",
                  flag
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
                  t("Failed-to-create-new-mapping"),
                  "",
                  flag
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

const scheduleMeetingMainApi = (
  navigate,
  t,
  scheduleMeeting,
  setDataroomMapFolderId,
  setCurrentMeetingID,
  setSceduleMeeting,
  MeetingID
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log(MeetingID, "MeetingIDMeetingIDMeetingID");
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
          dispatch(
            scheduleMeetingMainApi(
              navigate,
              t,
              scheduleMeeting,
              setDataroomMapFolderId,
              setCurrentMeetingID,
              setSceduleMeeting,
              MeetingID
            )
          );
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

              let getMeetingID = localStorage.getItem("currentMeetingLS");
              let MeetingData = {
                MeetingID: Number(getMeetingID),
              };
              console.log(MeetingData, "MeetingIDMeetingIDMeetingID");
              await dispatch(
                GetAllMeetingDetailsApiFunc(
                  navigate,
                  t,
                  MeetingData,
                  false,
                  setCurrentMeetingID,
                  setSceduleMeeting,
                  setDataroomMapFolderId,
                  0,
                  1
                )
              ); //         GetAllMeetingDetailsApiFunc(
              setSceduleMeeting(true);
              dispatch(scheduleMeetingPageFlag(true));
              dispatch(meetingDetailsGlobalFlag(true));
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
  setProposedNewMeeting,
  setSceduleMeeting
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
                setProposedNewMeeting,
                setSceduleMeeting
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
                  };
                  await dispatch(
                    saveParcipantsProposeMeetingAPI(
                      saveParticipant,
                      navigate,
                      t,
                      currentMeeting,
                      true,
                      rows,
                      ResponseDate,
                      setProposedNewMeeting,
                      setSceduleMeeting
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

const removeUpComingEvent = (response) => {
  return {
    type: actions.REMOVE_PARTICIPANT_FROM_UPCOMINGEVENTS,
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
            localStorage.removeItem("RSVP");
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_ValidateEncryptedStringUserAvailabilityForMeeting_02".toLowerCase()
              )
          ) {
            localStorage.removeItem("RSVP");

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
            localStorage.removeItem("RSVP");
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
            localStorage.removeItem("RSVP");
          } else {
            dispatch(
              validateEmptyStringUserAvailibilityFailed(
                t("Something-went-wrong")
              )
            );
            localStorage.removeItem("RSVP");
          }
        } else {
          dispatch(
            validateEmptyStringUserAvailibilityFailed(t("Something-went-wrong"))
          );
          localStorage.removeItem("RSVP");
        }
      } else {
        dispatch(
          validateEmptyStringUserAvailibilityFailed(t("Something-went-wrong"))
        );
        localStorage.removeItem("RSVP");
      }
    } catch (error) {
      dispatch(
        validateEmptyStringUserAvailibilityFailed(t("Something-went-wrong"))
      );
      localStorage.removeItem("RSVP");
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

const endMeetingStatusApi = (
  navigate,
  t,
  Data,
  setViewFlag,
  setEndMeetingConfirmationModal,
  route,
  setDeleteMeetingConfirmationModal
) => {
  console.log("end meeting chaek");
  let token = JSON.parse(localStorage.getItem("token"));
  let leaveMeetingData = {
    FK_MDID: Number(Data.MeetingID),
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
          dispatch(
            endMeetingStatusApi(
              navigate,
              t,
              Data,
              setViewFlag,
              setEndMeetingConfirmationModal
            )
          );
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
              if (route !== null && route !== undefined) {
                if (route === 5) {
                  setDeleteMeetingConfirmationModal(false);
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
                  dispatch(
                    LeaveCurrentMeeting(
                      navigate,
                      t,
                      leaveMeetingData,
                      true,
                      setViewFlag,
                      "",
                      "",
                      "",
                      setEndMeetingConfirmationModal
                    )
                  );
                }
              }
              // }
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
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_08".toLowerCase()
                )
            ) {
              // dispatch(
              //   endMeetingFail(
              //     t("Meeting-cannot-be-published-after-time-has-elapsed")
              //   )
              // );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_MeetingStatusUpdate_09".toLowerCase()
                )
            ) {
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
              // dispatch(
              //   endMeetingFail(
              //     t("Meeting-cannot-be-published-after-time-has-elapsed")
              //   )
              // );
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
  setViewAdvanceMeetingModal,
  NotificationCheckQuickMeet
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
              setViewAdvanceMeetingModal,
              NotificationCheckQuickMeet
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
              dispatch(videoIconOrButtonState(false));
              localStorage.setItem("isMeeting", true);
              localStorage.setItem("videoCallURL", Data.VideoCallURL);
              localStorage.setItem(
                "AdvanceMeetingOpen",
                isQuickMeeting ? false : true
              );
              localStorage.setItem(
                "typeOfMeeting",
                isQuickMeeting ? "isQuickMeeting" : "isAdvanceMeeting"
              );
              localStorage.setItem(
                "isMeetingVideoHostCheck",
                response.data.responseResult.isMeetingVideoHost
              );

              await dispatch(
                joinMeetingSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              if (isQuickMeeting === true) {
                let viewMeetingData = { MeetingID: Number(Data.FK_MDID) };
                console.log(
                  { no, viewMeetingData },
                  "viewMeetingDataviewMeetingData"
                );
                if (no !== 11) {
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
                }
              } else {
                isFunction(setAdvanceMeetingModalID) &&
                  setAdvanceMeetingModalID(Number(Data.FK_MDID));
                isFunction(setViewAdvanceMeetingModal) &&
                  setViewAdvanceMeetingModal(true);
                await dispatch(viewAdvanceMeetingPublishPageFlag(true));
                await dispatch(scheduleMeetingPageFlag(false));
              }
              //Work For Web Notification Quick  Meeting Joining
              if (NotificationCheckQuickMeet) {
                console.log("here i am");
                let viewMeetingData = { MeetingID: Number(Data.FK_MDID) };
                dispatch(
                  ViewMeeting(
                    navigate,
                    viewMeetingData,
                    t,
                    setViewFlag,
                    false,
                    false,
                    1
                  )
                );
              }
              localStorage.setItem("currentMeetingID", Data.FK_MDID);
              await dispatch(currentMeetingStatus(10));
              let activeStatusOneToOne = JSON.parse(
                localStorage.getItem("activeCall")
              );

              let presenterViewStatus =
                response.data.responseResult.isPresenterViewStarted;
              if (presenterViewStatus && !activeStatusOneToOne) {
                console.log("busyCall 21");

                let data = {
                  VideoCallURL: String(Data.VideoCallURL),
                  WasInVideo: false,
                };
                console.log("onClickStopPresenter", data);
                dispatch(joinPresenterViewMainApi(navigate, t, data));
              } else if (presenterViewStatus && activeStatusOneToOne) {
                console.log("busyCall 21");
                localStorage.setItem("JoinpresenterForonetoone", true);
                dispatch(nonMeetingVideoGlobalModal(true));
                dispatch(presenterViewGlobalState(0, true, false, false));
              }
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
              dispatch(
                joinMeetingFail(
                  t(
                    "Unable-to-join-the-meeting-at-this-time-please-try-after-some-time"
                  )
                )
              );
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
  setEditorRole,
  setAdvanceMeetingModalID,
  setViewAdvanceMeetingModal,
  setEndMeetingConfirmationModal
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows") || 30;
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent") || 1;
  let roomID = localStorage.getItem("acceptedRoomID");
  let userGUID = localStorage.getItem("userGUID");
  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
  let ViewGroupID = localStorage.getItem("ViewGroupID");
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
              setEditorRole,
              setAdvanceMeetingModalID,
              setViewAdvanceMeetingModal,
              setEndMeetingConfirmationModal
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
              localStorage.removeItem("meetingTitle");
              localStorage.removeItem("typeOfMeeting");
              localStorage.removeItem("currentMeetingID");
              localStorage.removeItem("currentMeetingLS");
              localStorage.setItem("AdvanceMeetingOpen", false);
              localStorage.setItem("isMeetingVideoHostCheck", false);
              dispatch(showEndMeetingModal(false));
              if (typeof setViewAdvanceMeetingModal === "function") {
                setViewAdvanceMeetingModal(false);
              }
              try {
                dispatch(currentMeetingStatus(0));

                if (isQuickMeeting) {
                  dispatch(
                    leaveMeetingQuickSuccess(
                      response.data.responseResult,
                      t("Successful")
                    )
                  );
                  console.log("Checking ");
                  if (typeof setEndMeetingConfirmationModal === "function") {
                    setEndMeetingConfirmationModal(false);
                  }
                  if (ViewCommitteeID !== null) {
                    let userID = localStorage.getItem("userID");

                    let searchData = {
                      CommitteeID: Number(ViewCommitteeID),
                      Date: "",
                      Title: "",
                      HostName: "",
                      UserID: Number(userID),
                      PageNumber: 1,
                      Length: 50,
                      PublishedMeetings: true,
                    };
                    dispatch(
                      getMeetingByCommitteeIDApi(navigate, t, searchData)
                    );
                  } else if (ViewGroupID !== null) {
                    let searchData = {
                      GroupID: Number(ViewGroupID),
                      Date: "",
                      Title: "",
                      HostName: "",
                      UserID: Number(userID),
                      PageNumber: 1,
                      Length: 50,
                      PublishedMeetings: true,
                    };
                    dispatch(getMeetingbyGroupApi(navigate, t, searchData));
                  } else {
                    let searchData = {
                      Date: "",
                      Title: "",
                      HostName: "",
                      UserID: Number(userID),
                      PageNumber: Number(meetingPageCurrent),
                      Length: Number(meetingpageRow),
                      PublishedMeetings:
                        currentView && Number(currentView) === 1 ? true : false,
                    };
                    console.log("chek search meeting");
                    await dispatch(
                      searchNewUserMeeting(navigate, searchData, t)
                    );
                  }
                } else {
                  dispatch(
                    leaveMeetingAdvancedSuccess(
                      response.data.responseResult,
                      t("Successful")
                    )
                  );
                  if (typeof setEndMeetingConfirmationModal === "function") {
                    setEndMeetingConfirmationModal(false);
                  }
                  if (
                    localStorage.getItem("navigateLocation") === "resolution"
                  ) {
                    navigate("/Diskus/resolution");
                  } else if (
                    localStorage.getItem("navigateLocation") === "dataroom"
                  ) {
                    navigate("/Diskus/dataroom");
                  } else if (
                    localStorage.getItem("navigateLocation") === "committee"
                  ) {
                    navigate("/Diskus/committee");
                  } else if (
                    localStorage.getItem("navigateLocation") === "groups"
                  ) {
                    navigate("/Diskus/groups");
                  } else if (
                    localStorage.getItem("navigateLocation") === "polling"
                  ) {
                    navigate("/Diskus/polling");
                  } else if (
                    localStorage.getItem("navigateLocation") === "polling"
                  ) {
                    navigate("/Diskus/polling");
                  } else if (
                    localStorage.getItem("navigateLocation") === "calendar"
                  ) {
                    navigate("/Diskus/calendar");
                  } else if (
                    localStorage.getItem("navigateLocation") === "todolist"
                  ) {
                    navigate("/Diskus/todolist");
                  } else if (
                    localStorage.getItem("navigateLocation") === "Notes"
                  ) {
                    navigate("/Diskus/Notes");
                  } else if (
                    localStorage.getItem("navigateLocation") === "MainDashBoard"
                  ) {
                    console.log("navigateLocation");
                    navigate("/Diskus/");
                  } else {
                    let searchData = {
                      Date: "",
                      Title: "",
                      HostName: "",
                      UserID: Number(userID),
                      PageNumber: Number(meetingPageCurrent),
                      Length: Number(meetingpageRow),
                      PublishedMeetings:
                        currentView && Number(currentView) === 1 ? true : false,
                    };
                    console.log("chek search meeting");
                    await dispatch(
                      searchNewUserMeeting(navigate, searchData, t)
                    );
                    localStorage.removeItem("folderDataRoomMeeting");
                    setEditorRole({ status: null, role: null });
                    setAdvanceMeetingModalID(null);

                    dispatch(viewAdvanceMeetingPublishPageFlag(false));
                    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
                  }
                }

                // let newName = localStorage.getItem("name");
                // let Data = {
                //   RoomID: roomID,
                //   UserGUID: userGUID,
                //   Name: String(newName),
                // };
                // if (roomID !== "0" && userGUID !== null) {
                //   dispatch(normalizeVideoPanelFlag(false));
                //   dispatch(maximizeVideoPanelFlag(false));
                //   dispatch(minimizeVideoPanelFlag(false));

                //   localStorage.setItem("activeCall", false);

                //   localStorage.setItem("isMeeting", false);
                //   localStorage.setItem("meetingTitle", "");
                //   localStorage.setItem("acceptedRecipientID", 0);
                //   localStorage.setItem("acceptedRoomID", 0);
                //   localStorage.setItem("activeRoomID", 0);
                //   localStorage.setItem("meetingVideoID", 0);
                //   localStorage.setItem("MicOff", true);
                //   localStorage.setItem("VidOff", true);
                //   dispatch(LeaveMeetingVideo(Data, navigate, t));
                // }
              } catch (error) {
                console.log(error);
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
                  "Meeting_MeetingServiceManager_LeaveMeeting_05".toLowerCase()
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

const LeaveCurrentMeetingOtherMenus = (
  navigate,
  t,
  Data,
  scheduleMeetingsPageFlag,
  viewProposeDateMeetingsPageFlag,
  viewAdvanceMeetingsPublishPageFlag,
  viewAdvanceMeetingsUnpublishPageFlag,
  viewProposeOrganizerMeetingsPageFlag,
  proposeNewMeetingsPageFlag,
  viewMeetingsFlag,
  scheduleMeetingPageFlagReducer,
  viewProposeDateMeetingPageFlagReducer,
  viewAdvanceMeetingPublishPageFlagReducer,
  viewAdvanceMeetingUnpublishPageFlagReducer,
  viewProposeOrganizerMeetingPageFlagReducer,
  proposeNewMeetingPageFlagReducer,
  viewMeetingFlagReducer,
  location,
  setViewAdvanceMeetingModal
) => {
  console.log(
    {
      scheduleMeetingsPageFlag,
      viewProposeDateMeetingsPageFlag,
      viewAdvanceMeetingsPublishPageFlag,
      viewAdvanceMeetingsUnpublishPageFlag,
      viewProposeOrganizerMeetingsPageFlag,
      proposeNewMeetingsPageFlag,
      viewMeetingsFlag,
      scheduleMeetingPageFlagReducer,
      viewProposeDateMeetingPageFlagReducer,
      viewAdvanceMeetingPublishPageFlagReducer,
      viewAdvanceMeetingUnpublishPageFlagReducer,
      viewProposeOrganizerMeetingPageFlagReducer,
      proposeNewMeetingPageFlagReducer,
      viewMeetingFlagReducer,
      location,
      setViewAdvanceMeetingModal
    },
    "Coming inside this block scopr"
  );
  let token = JSON.parse(localStorage.getItem("token"));
  let currentMeetingVideoID = Number(localStorage.getItem("meetingVideoID"));
  let NavigationLocation = localStorage.getItem("navigateLocation");
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
            LeaveCurrentMeetingOtherMenus(
              navigate,
              t,
              Data,
              scheduleMeetingsPageFlag,
              viewProposeDateMeetingsPageFlag,
              viewAdvanceMeetingsPublishPageFlag,
              viewAdvanceMeetingsUnpublishPageFlag,
              viewProposeOrganizerMeetingsPageFlag,
              proposeNewMeetingsPageFlag,
              viewMeetingsFlag,
              scheduleMeetingPageFlagReducer,
              viewProposeDateMeetingPageFlagReducer,
              viewAdvanceMeetingPublishPageFlagReducer,
              viewAdvanceMeetingUnpublishPageFlagReducer,
              viewProposeOrganizerMeetingPageFlagReducer,
              proposeNewMeetingPageFlagReducer,
              viewMeetingFlagReducer,
              location,
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
              localStorage.removeItem("meetingTitle");
              localStorage.removeItem("typeOfMeeting");
              localStorage.removeItem("currentMeetingID");
              localStorage.removeItem("currentMeetingLS");
              localStorage.setItem("AdvanceMeetingOpen", false);
              localStorage.setItem("isMeetingVideoHostCheck", false);
              dispatch(currentMeetingStatus(0));
              dispatch(
                leaveMeetingAdvancedSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              if (currentMeetingVideoID !== 0) {
              }
              dispatch(normalizeVideoPanelFlag(false));
              dispatch(maximizeVideoPanelFlag(false));
              dispatch(minimizeVideoPanelFlag(false));

              localStorage.setItem("activeCall", false);
              localStorage.setItem("isMeeting", false);
              localStorage.setItem("meetingTitle", "");
              localStorage.setItem("acceptedRecipientID", 0);
              localStorage.setItem("acceptedRoomID", 0);
              localStorage.setItem("activeRoomID", 0);
              localStorage.setItem("meetingVideoID", 0);
              localStorage.setItem("MicOff", true);
              localStorage.setItem("VidOff", true);
              // Navigation Location k according yaha conditions lagein ge

              try {
                await handleNavigationforParticipantVideoFlow({
                  NavigationLocation,
                  navigate,
                  dispatch,
                  location,
                  setViewAdvanceMeetingModal,
                  flags: {
                    scheduleMeetingPageFlagReducer,
                    viewProposeDateMeetingPageFlagReducer,
                    viewAdvanceMeetingPublishPageFlagReducer,
                    viewAdvanceMeetingUnpublishPageFlagReducer,
                    viewProposeOrganizerMeetingPageFlagReducer,
                    proposeNewMeetingPageFlagReducer,
                    viewMeetingFlagReducer,
                    scheduleMeetingsPageFlag,
                    viewProposeDateMeetingsPageFlag,
                    viewAdvanceMeetingsPublishPageFlag,
                    viewAdvanceMeetingsUnpublishPageFlag,
                    viewProposeOrganizerMeetingsPageFlag,
                    proposeNewMeetingsPageFlag,
                    viewMeetingsFlag,
                  },
                  t,
                });
              } catch (error) {
                console.log(error, "Navigation error");
              }
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
                  "Meeting_MeetingServiceManager_LeaveMeeting_05".toLowerCase()
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

const validateStringParticipantProposed_init = () => {
  return {
    type: actions.VALIDATEENCRYPTEDSTRINGPARTICIPANTPROPOSED_INIT,
  };
};
const validateStringParticipantProposed_success = (response, message) => {
  return {
    type: actions.VALIDATEENCRYPTEDSTRINGPARTICIPANTPROPOSED_SUCCESS,
    response: response,
    message: message,
  };
};

const validateStringParticipantProposed_fail = (message) => {
  return {
    type: actions.VALIDATEENCRYPTEDSTRINGPARTICIPANTPROPOSED_FAIL,
    message: message,
  };
};

const validateStringParticipantProposedApi = (emailString, navigate, t) => {
  return async (dispatch) => {
    try {
      let Data = {
        EncryptedString: emailString,
      };
      let token = JSON.parse(localStorage.getItem("token"));

      dispatch(validateStringParticipantProposed_init());

      let form = new FormData();
      form.append(
        "RequestMethod",
        validateEncryptedStringParticipantProposedRM.RequestMethod
      );
      form.append("RequestData", JSON.stringify(Data));

      let response = await axios({
        method: "post",
        url: meetingApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        // Token expired, refresh token and retry
        await dispatch(RefreshToken(navigate, t));
        // Retry the API call
        return dispatch(
          validateStringParticipantProposedApi(emailString, navigate, t)
        );
      }
      if (response.data.responseCode === 200) {
        const responseResult = response.data.responseResult;

        if (responseResult.isExecuted) {
          const message = responseResult.responseMessage.toLowerCase();

          if (
            message.includes(
              "validateencryptedstringusermeetingproposedatesselection_01"
            )
          ) {
            // Success case
            await dispatch(
              validateStringParticipantProposed_success(
                responseResult.data,
                t("Successfully")
              )
            );
            return responseResult.data;
          } else if (
            message.includes(
              "validateencryptedstringusermeetingproposedatesselection_02"
            )
          ) {
            // Failure case
            dispatch(validateStringParticipantProposed_fail(t("Unsuccessful")));
            // throw new Error(t("Something-went-wrong"));
          } else if (
            message.includes(
              "validateencryptedstringusermeetingproposedatesselection_03"
            )
          ) {
            // Something went wrong case
            dispatch(
              validateStringParticipantProposed_fail(t("Something-went-wrong"))
            );
            // throw new Error(t("Something-went-wrong"));
          }
        } else {
          dispatch(
            validateStringParticipantProposed_fail(t("Something-went-wrong"))
          );
          // throw new Error(t("Something-went-wrong"));
        }
      } else {
        dispatch(
          validateStringParticipantProposed_fail(t("Something-went-wrong"))
        );
        // throw new Error(t("Something-went-wrong"));
      }
    } catch (error) {
      dispatch(
        validateStringParticipantProposed_fail(t("Something-went-wrong"))
      );
      // throw new Error(t("Something-went-wrong"));
    }
  };
};

const emailRouteID = (id) => {
  return {
    type: actions.EMAIL_ROUTE_ID,
    response: id,
  };
};

const getDashbardMeetingData_init = () => {
  return {
    type: actions.GETDASHBOARDMEETINGDATA_INIT,
  };
};
const getDashbardMeetingData_success = (response, message = "") => {
  return {
    type: actions.GETDASHBOARDMEETINGDATA_SUCCESS,
    response: response,
    message: message,
  };
};
const getDashbardMeetingData_fail = (message = "") => {
  return {
    type: actions.GETDASHBOARDMEETINGDATA_FAIL,
    message: message,
  };
};

const getDashboardMeetingCountMQTT = (response) => {
  return {
    type: actions.GETMEETINGCOUNT_DASHBOARD_MQTT,
    payload: response,
  };
};
const getDashbardMeetingDataApi = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    await dispatch(getDashbardMeetingData_init());
    let form = new FormData();
    form.append("RequestMethod", getDashboardMeetingStatsRM.RequestMethod);
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
          dispatch(getDashbardMeetingDataApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetDashboardMeetingData_01".toLowerCase()
                )
            ) {
              dispatch(
                getDashbardMeetingData_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetDashboardMeetingData_02".toLowerCase()
                )
            ) {
              dispatch(getDashbardMeetingData_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetDashboardMeetingData_03".toLowerCase()
                )
            ) {
              dispatch(getDashbardMeetingData_fail(t("Something-went-wrong")));
            } else {
              dispatch(getDashbardMeetingData_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getDashbardMeetingData_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getDashbardMeetingData_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getDashbardMeetingData_fail(t("Something-went-wrong")));
      });
  };
};

const getAllMeetingUsersRSVP_init = () => {
  return {
    type: actions.GETALLMEETINGUSERSRSVPDETAILS_INIT,
  };
};
const getAllMeetingUsersRSVP_success = (response, message) => {
  return {
    type: actions.GETALLMEETINGUSERSRSVPDETAILS_SUCCESS,
    response: response,
    message: message,
  };
};
const getAllMeetingUsersRSVP_fail = (message) => {
  return {
    type: actions.GETALLMEETINGUSERSRSVPDETAILS_FAIL,
    message: message,
  };
};
const getAllMeetingUsersRSVPApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    await dispatch(getAllMeetingUsersRSVP_init());
    let form = new FormData();
    form.append("RequestMethod", getAllMeetingUsersRSVPDetailsRM.RequestMethod);
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
          await dispatch(getAllMeetingUsersRSVPApi(navigate, t));
          dispatch(getAllMeetingUsersRSVPApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingUserRSVPDetails_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllMeetingUsersRSVP_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingUserRSVPDetails_02".toLowerCase()
                )
            ) {
              dispatch(getAllMeetingUsersRSVP_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllMeetingUserRSVPDetails_03".toLowerCase()
                )
            ) {
              dispatch(getAllMeetingUsersRSVP_fail(t("Something-went-wrong")));
            } else {
              dispatch(getAllMeetingUsersRSVP_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getAllMeetingUsersRSVP_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAllMeetingUsersRSVP_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllMeetingUsersRSVP_fail(t("Something-went-wrong")));
      });
  };
};

// leaveMeetingVideo new Api

const leaveMeetingVideoFail = (message) => {
  return {
    type: actions.LEAVE_MEETING_VIDEO_FAIL,
    message: message,
  };
};

const LeaveMeetingVideo = (
  Data,
  navigate,
  t,
  flag,
  organizerData,
  setJoiningOneToOneAfterLeavingPresenterView,
  setLeaveMeetingVideoForOneToOneOrGroup
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", leaveMeetingVideo.RequestMethod);
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
            LeaveMeetingVideo(
              Data,
              navigate,
              t,
              flag,
              organizerData,
              setJoiningOneToOneAfterLeavingPresenterView,
              setLeaveMeetingVideoForOneToOneOrGroup
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeaveMeetingVideo_01".toLowerCase()
                )
            ) {
              // let meetingFlag = JSON.parse(
              //   localStorage.getItem("isMeetingVideoHostCheck")
              // );

              await dispatch(videoIconOrButtonState(false));
              await dispatch(participantVideoButtonState(false));
              await dispatch(maxParticipantVideoCallPanel(false));
              await dispatch(screenShareTriggeredGlobally(false));

              const meetingHost = {
                isHost: false,
                isHostId: 0,
                isDashboardVideo: false,
              };
              // dispatch(makeHostNow(meetingHost));
              localStorage.setItem(
                "meetinHostInfo",
                JSON.stringify(meetingHost)
              );
              localStorage.removeItem("newRoomId");
              localStorage.setItem("isMeetingVideo", false);
              localStorage.removeItem("refinedVideoUrl");
              localStorage.removeItem("participantRoomId");
              localStorage.removeItem("isSharedSceenEnable");
              localStorage.setItem("refinedVideoGiven", false);
              localStorage.setItem("isWebCamEnabled", false);
              localStorage.setItem("isMicEnabled", false);
              localStorage.setItem("activeCall", false);
              await dispatch(setAudioControlHost(false));
              console.log("videoHideUnHideForHost");
              await dispatch(setVideoControlHost(false));

              try {
                // for closed waiting an start presenting
                console.log("maximizeParticipantVideoFlag");
                let currentMeeting = localStorage.getItem("currentMeetingID");
                if (flag === 1) {
                  console.log("Check Leave");
                  console.log("maximizeParticipantVideoFlag");
                  console.log("maximizeParticipantVideoFlag");

                  await dispatch(videoIconOrButtonState(false));
                  await dispatch(participantVideoButtonState(false));
                  dispatch(
                    openPresenterViewMainApi(
                      t,
                      navigate,
                      organizerData,
                      currentMeeting,
                      4
                    )
                  );
                } else if (flag === 2) {
                  console.log("Check Leave");
                  let currentMeetingVideoURL =
                    localStorage.getItem("videoCallURL");
                  await dispatch(videoIconOrButtonState(false));
                  await dispatch(participantVideoButtonState(false));
                  let data = {
                    VideoCallURL: String(currentMeetingVideoURL),
                    WasInVideo: false,
                  };
                  dispatch(joinPresenterViewMainApi(navigate, t, data));
                } else if (flag === 3) {
                  console.log("busyCall");
                  await setLeaveMeetingVideoForOneToOneOrGroup(false);
                  setJoiningOneToOneAfterLeavingPresenterView(true);
                } else if (flag === 4) {
                  console.log("busyCall Nothing");
                  await dispatch(normalizeVideoPanelFlag(false));
                  await dispatch(maximizeVideoPanelFlag(false));
                  await dispatch(minimizeVideoPanelFlag(false));
                }

                sessionStorage.removeItem("isWaiting");
              } catch {}

              // dispatch(leaveMeetingVideoSuccess(response, "Successful"));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeaveMeetingVideo_02".toLowerCase()
                )
            ) {
              dispatch(leaveMeetingVideoFail(t("Unsuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeaveMeetingVideo_03".toLowerCase()
                )
            ) {
              dispatch(leaveMeetingVideoFail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_LeaveMeetingVideo_04".toLowerCase()
                )
            ) {
              await dispatch(normalizeVideoPanelFlag(false));
              await dispatch(maximizeVideoPanelFlag(false));
              await dispatch(minimizeVideoPanelFlag(false));
              await dispatch(videoIconOrButtonState(false));
              await dispatch(screenShareTriggeredGlobally(false));
              await dispatch(participantVideoButtonState(false));
              localStorage.removeItem("newRoomId");
              localStorage.setItem("isMeetingVideo", false);
              localStorage.removeItem("refinedVideoUrl");
              localStorage.removeItem("participantRoomId");
              localStorage.removeItem("isSharedSceenEnable");
              localStorage.setItem("refinedVideoGiven", false);
              localStorage.setItem("isWebCamEnabled", false);
              localStorage.setItem("isMicEnabled", false);
              localStorage.setItem("activeCall", false);
              await dispatch(setAudioControlHost(false));
              console.log("videoHideUnHideForHost");
              await dispatch(setVideoControlHost(false));
              let getMeetingHostData = Data.IsHost;
              console.log("Check Leave");
              console.log(getMeetingHostData, "asdadadadadaddda");
              if (flag === 1) {
                console.log("Check Leave");
                console.log("maximizeParticipantVideoFlag");
                console.log("maximizeParticipantVideoFlag");
                let currentMeeting = localStorage.getItem("currentMeetingID");

                await dispatch(videoIconOrButtonState(false));
                await dispatch(participantVideoButtonState(false));
                dispatch(
                  openPresenterViewMainApi(
                    t,
                    navigate,
                    organizerData,
                    currentMeeting,
                    4
                  )
                );
              } else if (flag === 2) {
                console.log("Check Leave");
                let currentMeetingVideoURL =
                  localStorage.getItem("videoCallURL");
                await dispatch(videoIconOrButtonState(false));
                await dispatch(participantVideoButtonState(false));
                let data = {
                  VideoCallURL: String(currentMeetingVideoURL),
                  WasInVideo: false,
                };
                dispatch(joinPresenterViewMainApi(navigate, t, data));
              } else if (flag === 3) {
                console.log("busyCall");
                await setLeaveMeetingVideoForOneToOneOrGroup(false);
                setJoiningOneToOneAfterLeavingPresenterView(true);
              } else if (flag === 4) {
                console.log("busyCall Nothing");
                await dispatch(normalizeVideoPanelFlag(false));
                await dispatch(maximizeVideoPanelFlag(false));
                await dispatch(minimizeVideoPanelFlag(false));
              } else {
                console.log("Check Leave");
                localStorage.setItem("isMeetingVideoHostCheck", false);
              }
              // this will check on leave that it's host  if it's  host then isMeetingVideoHostCheck should be false
              // if (getMeetingHostData) {
              //   localStorage.setItem("isMeetingVideoHostCheck", false);
              // }
            } else {
              dispatch(leaveMeetingVideoFail(t("On-host-transfer-flow")));
            }
          } else {
            dispatch(leaveMeetingVideoFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(leaveMeetingVideoFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log("leaveMeetingVideoFail", response);
        dispatch(leaveMeetingVideoFail(t("Something-went-wrong")));
      });
  };
};

const meetingReminderNotifcation = (response) => {
  return {
    type: actions.MEETING_REMINDER_NOTIFICATION,
    response: response,
  };
};

const newMeetingGlobalLoader = (response = false) => {
  return {
    type: actions.NEW_MEETING_LOADER_REDUCER,
    loader: response,
  };
};

const proposedMeetingData = () => {
  return {
    type: actions.PROPOSED_MEETING_DATES_DATA,
  };
};

const ParticipantsData = () => {
  return {
    type: actions.PARTICIPANT_PROPOSED_MEETING,
  };
};

const GetAllMeetingDetialsData = () => {
  return {
    type: actions.GET_ALL_MEETING_DETAILS_DATA,
  };
};

const showCancelModalAgendaBuilder = (response) => {
  return {
    type: actions.UNSAVED_NEW_AGENDA_CANCEL_MODAL,
    response: response,
  };
};

const showShareViaDataRoomPathConfirmation = (response) => {
  return {
    type: actions.SHARE_VIA_DATAROOM_PATH_CONFIRMATION,
    response: response,
  };
};
const validateStringUserMeetingProposedDatesPolls_Init = () => {
  return {
    type: actions.VALIDATEENCRYPTEDSTRINGUSERMEETINGPROPOSEDATESPOLL_INIT,
  };
};
const validateStringUserMeetingProposedDatesPolls_Success = (
  response,
  message
) => {
  return {
    type: actions.VALIDATEENCRYPTEDSTRINGUSERMEETINGPROPOSEDATESPOLL_SUCCESS,
    response: response,
    message: message,
  };
};
const validateStringUserMeetingProposedDatesPolls_Fail = (message) => {
  return {
    type: actions.VALIDATEENCRYPTEDSTRINGUSERMEETINGPROPOSEDATESPOLL_FAIL,
    message: message,
  };
};

const validateStringUserMeetingProposedDatesPollsApi = (
  emailString,
  navigate,
  t
) => {
  return async (dispatch) => {
    try {
      let Data = {
        EncryptedString: emailString,
      };
      let token = JSON.parse(localStorage.getItem("token"));

      dispatch(validateStringUserMeetingProposedDatesPolls_Init());

      let form = new FormData();
      form.append(
        "RequestMethod",
        ValidateEncryptedStringUserMeetingProposeDatesPollRM.RequestMethod
      );
      form.append("RequestData", JSON.stringify(Data));

      let response = await axios({
        method: "post",
        url: meetingApi,
        data: form,
        headers: {
          _token: token,
        },
      });

      if (response.data.responseCode === 417) {
        // Token expired, refresh token and retry
        await dispatch(RefreshToken(navigate, t));
        // Retry the API call
        return dispatch(
          validateStringUserMeetingProposedDatesPollsApi(
            emailString,
            navigate,
            t
          )
        );
      }
      if (response.data.responseCode === 200) {
        const responseResult = response.data.responseResult;

        if (responseResult.isExecuted) {
          const message = responseResult.responseMessage.toLowerCase();

          if (
            message.includes(
              "Meeting_MeetingServiceManager_ValidateEncryptedStringUserMeetingProposeDatesPoll_01".toLowerCase()
            )
          ) {
            // Success case
            await dispatch(
              validateStringUserMeetingProposedDatesPolls_Success(
                responseResult.data,
                t("Successfully")
              )
            );
            return responseResult.data;
          } else if (
            message.includes(
              "Meeting_MeetingServiceManager_ValidateEncryptedStringUserMeetingProposeDatesPoll_02".toLowerCase()
            )
          ) {
            // Failure case
            dispatch(
              validateStringUserMeetingProposedDatesPolls_Fail(
                t("Unsuccessful")
              )
            );
            // throw new Error(t("Something-went-wrong"));
          } else if (
            message.includes(
              "Meeting_MeetingServiceManager_ValidateEncryptedStringUserMeetingProposeDatesPoll_03".toLowerCase()
            )
          ) {
            // Something went wrong case
            dispatch(
              validateStringUserMeetingProposedDatesPolls_Fail(
                t("Something-went-wrong")
              )
            );
            // throw new Error(t("Something-went-wrong"));
          }
        } else {
          dispatch(
            validateStringUserMeetingProposedDatesPolls_Fail(
              t("Something-went-wrong")
            )
          );
          // throw new Error(t("Something-went-wrong"));
        }
      } else {
        dispatch(
          validateStringUserMeetingProposedDatesPolls_Fail(
            t("Something-went-wrong")
          )
        );
        // throw new Error(t("Something-went-wrong"));
      }
    } catch (error) {
      dispatch(
        validateStringUserMeetingProposedDatesPolls_Fail(
          t("Something-went-wrong")
        )
      );
      // throw new Error(t("Something-went-wrong"));
    }
  };
};

//New Proposed Meeting View Flag Action
const ProposedMeetingViewFlagAction = (response) => {
  return {
    type: actions.PROPOSED_MEETING_VIEW_FLAG,
    response: response,
  };
};

//New Proposed Meeting View Flag Action
const LeaveMeetingSideBarModalAction = (response) => {
  return {
    type: actions.LEAVE_MODAL_SIDEBAR,
    response: response,
  };
};

//Get Meeting Status Data API
const GetMeetingStatusDataInit = () => {
  return {
    type: actions.GET_MEETING_STATUS_INIT,
  };
};

const GetMeetingStatusDataSuccess = (response, message) => {
  return {
    type: actions.GET_MEETING_STATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const GetMeetingStatusDataFail = (message) => {
  return {
    type: actions.GET_MEETING_STATUS_FAIL,
    message: message,
  };
};

const GetMeetingStatusDataAPI = (
  navigate,
  t,
  Data,
  setEditorRole,
  FlagOnRouteClickAdvanceMeet,
  setViewAdvanceMeetingModal,
  Check,
  setVideoTalk,
  setViewFlag
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  console.log(FlagOnRouteClickAdvanceMeet, "FlagOnRouteClickAdvanceMeet");
  return async (dispatch) => {
    await dispatch(GetMeetingStatusDataInit());
    let form = new FormData();
    form.append("RequestMethod", GetMeetingStatus.RequestMethod);
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
          dispatch(
            GetMeetingStatusDataAPI(
              navigate,
              t,
              Data,
              setEditorRole,
              FlagOnRouteClickAdvanceMeet,
              setViewAdvanceMeetingModal,
              Check,
              setVideoTalk,
              setViewFlag
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingStatusData_01".toLowerCase()
                )
            ) {
              dispatch(
                GetMeetingStatusDataSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              try {
                //Send Response By Date for Proposed Meeting
                localStorage.setItem(
                  "NotificationClickSendResponseByDate",
                  response.data.responseResult.sendResponseByDeadline
                );

                //For Global Use Meeting Status ID
                localStorage.setItem(
                  "MeetingStatusID",
                  response.data.responseResult.meetingStatusID
                );

                // For Setting Minutes Published Status
                localStorage.setItem(
                  "MinutesPublishedStatus",
                  response.data.responseResult.isMinutesPublished
                );

                //Global Edit States Context State
                isFunction(setEditorRole) &&
                  setEditorRole({
                    status: Number(
                      response.data.responseResult.meetingStatusID
                    ),
                    role:
                      Number(response.data.responseResult.attendeeRoleID) === 2
                        ? "Participant"
                        : Number(
                            response.data.responseResult.attendeeRoleID
                          ) === 4
                        ? "Agenda Contributor"
                        : "Organizer",
                    isPrimaryOrganizer: false,
                  });

                // For Notification ID === 9
                if (FlagOnRouteClickAdvanceMeet === true) {
                  dispatch(scheduleMeetingPageFlag(false));
                  isFunction(setViewAdvanceMeetingModal) &&
                    setViewAdvanceMeetingModal(true);
                  dispatch(viewAdvanceMeetingPublishPageFlag(true));
                }
                //Global Video Chat And Group ID Context State
                isFunction(setVideoTalk) &&
                  setVideoTalk({
                    isChat: response.data.responseResult.isChat,
                    isVideoCall: response.data.responseResult.isVideoCall,
                    talkGroupID: response.data.responseResult.talkGroupID,
                  });
                console.log(Check, "errorerrorerror");
                //Joining Meeting Scenario
                if (Check === 1) {
                  let joinMeetingData = {
                    VideoCallURL: response.data.responseResult.videoCallUrl,
                    FK_MDID: Number(
                      localStorage.getItem("NotificationAdvanceMeetingID")
                    ),
                    DateTime: getCurrentDateTimeUTC(),
                  };

                  dispatch(
                    JoinCurrentMeeting(
                      JSON.parse(
                        localStorage.getItem("QuickMeetingCheckNotification")
                      ),
                      navigate,
                      t,
                      joinMeetingData
                    )
                  );
                } else if (Check === 2) {
                  if (
                    Number(response.data.responseResult.meetingStatusID) !== 1
                  ) {
                    dispatch(showSceduleProposedMeeting(true));
                  }
                } else if (Check === 3) {
                  //Notification for being added as a minute reviewer
                  let Data = {
                    MeetingID: Number(
                      localStorage.getItem("NotificationClickMinutesMeetingID")
                    ),
                  };
                  dispatch(
                    MinutesWorkFlowActorStatusNotificationAPI(Data, navigate, t)
                  );
                } else if (Check === 4) {
                  let joinMeetingData = {
                    VideoCallURL: response.data.responseResult.videoCallUrl,
                    FK_MDID: Number(
                      localStorage.getItem("NotificationAdvanceMeetingID")
                    ),
                    DateTime: getCurrentDateTimeUTC(),
                  };

                  dispatch(
                    JoinCurrentMeeting(
                      JSON.parse(
                        localStorage.getItem("QuickMeetingCheckNotification")
                      ),
                      navigate,
                      t,
                      joinMeetingData,
                      setViewFlag,
                      false,
                      false,
                      0,
                      false,
                      false,
                      true
                    )
                  );
                }
              } catch (error) {
                console.log(error, "errorerrorerror");
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingStatusData_02".toLowerCase()
                )
            ) {
              dispatch(GetMeetingStatusDataFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingStatusData_03".toLowerCase()
                )
            ) {
              dispatch(GetMeetingStatusDataFail(t("Something-went-wrong")));
            } else {
              dispatch(GetMeetingStatusDataFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(GetMeetingStatusDataFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(GetMeetingStatusDataFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(GetMeetingStatusDataFail(t("Something-went-wrong")));
      });
  };
};

//Voting Agenda Poll has been Started Modal Action Method

const AgendaPollVotingStartedAction = (response) => {
  return {
    type: actions.VOTING_POLL_STARTED_AGENDA_MODAL,
    response: response,
  };
};

// Details Committees Email Routes
const validateEncryptedStringViewMeetingLink_Init = () => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_MEETING_RELATED_EMAIL_DATA_INIT,
});

const validateEncryptedStringViewMeetingLink_Success = (response, message) => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_MEETING_RELATED_EMAIL_DATA_SUCCESS,
  response,
  message,
});

const validateEncryptedStringViewMeetingLink_Fail = (message) => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_MEETING_RELATED_EMAIL_DATA_FAIL,
  message,
});
const validateEncryptedStringViewMeetingLinkApi = (
  encryptedString,
  navigate,
  t
) => {
  return async (dispatch) => {
    try {
      let data = { EncryptedString: encryptedString };
      let token = JSON.parse(localStorage.getItem("token"));

      dispatch(validateEncryptedStringViewMeetingLink_Init());

      let form = new FormData();
      form.append(
        "RequestMethod",
        ValidateEncryptedStringMeetingRelatedEmailDataRM.RequestMethod
      );
      form.append("RequestData", JSON.stringify(data));

      let response = await axios.post(meetingApi, form, {
        headers: { _token: token },
      });

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(
          validateEncryptedStringViewMeetingLinkApi(
            encryptedString,
            navigate,
            t
          )
        );
      }

      if (response.data.responseCode === 200) {
        const responseResult = response.data.responseResult;

        if (responseResult.isExecuted) {
          const message = responseResult.responseMessage.toLowerCase();

          if (
            message.includes(
              "Meeting_MeetingServiceManager_ValidateEncryptedStringMeetingRelatedEmailData_01".toLowerCase()
            )
          ) {
            dispatch(
              validateEncryptedStringViewMeetingLink_Success(
                responseResult.data,
                t("Successfully")
              )
            );

            return {
              response: response.data.responseResult?.data,
              responseCode: 1,
              isExecuted: true,
            };
          } else if (
            message.includes(
              "Meeting_MeetingServiceManager_ValidateEncryptedStringMeetingRelatedEmailData_02".toLowerCase()
            )
          ) {
            dispatch(validateEncryptedStringViewMeetingLink_Fail(""));
            return {
              isExecuted: false,
              responseCode: 2,
            };
          } else if (
            message.includes(
              "Meeting_MeetingServiceManager_ValidateEncryptedStringMeetingRelatedEmailData_03".toLowerCase()
            )
          ) {
            dispatch(
              validateEncryptedStringViewMeetingLink_Fail(
                t("Invalid-request-data")
              )
            );
            return {
              isExecuted: false,
              responseCode: 3,
            };
          } else if (
            message.includes(
              "Meeting_MeetingServiceManager_ValidateEncryptedStringMeetingRelatedEmailData_04".toLowerCase()
            )
          ) {
            dispatch(
              validateEncryptedStringViewMeetingLink_Fail(
                t("Someting-went-wrong")
              )
            );
            return {
              isExecuted: false,
              responseCode: 4,
            };
          } else {
            dispatch(
              validateEncryptedStringViewMeetingLink_Fail(
                t("Someting-went-wrong")
              )
            );
            return {
              isExecuted: false,
              responseCode: 5,
            };
          }
        } else {
          dispatch(
            validateEncryptedStringViewMeetingLink_Fail(
              t("Something-went-wrong")
            )
          );
          return {
            isExecuted: false,
            responseCode: 5,
          };
        }
      } else {
        dispatch(
          validateEncryptedStringViewMeetingLink_Fail(t("Something-went-wrong"))
        );
        return {
          isExecuted: false,
          responseCode: 5,
        };
      }
    } catch (error) {
      dispatch(
        validateEncryptedStringViewMeetingLink_Fail(t("Something-went-wrong"))
      );
      return {
        isExecuted: false,
        responseCode: 0,
      };
    }
  };
};

// Upload Documents Init

// Upload Documents Success
const uploadDocument_success_quickMeeting = (response, message) => {
  return {
    type: actions.QUICKMEETING_DOCUMENTS_UPLOAD_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const uploadDocument_fail_quickMeeting = (message) => {
  return {
    type: actions.QUICKMEETING_DOCUMENTS_UPLOAD_FAIL,
    message: message,
  };
};

// Upload Documents API for Quick Meeting
const uploadDocumentsQuickMeetingApi = (navigate, t, data, newfile) => {
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
          dispatch(uploadDocumentsQuickMeetingApi(navigate, t, data, newfile));
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
                FileSizeOnDisk: Number(response.data.responseResult.fileSize),
              });
              await dispatch(
                uploadDocument_success_quickMeeting(
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
                uploadDocument_fail_quickMeeting(t("Failed-to-update-document"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
                )
            ) {
              dispatch(
                uploadDocument_fail_quickMeeting(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              uploadDocument_fail_quickMeeting(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(uploadDocument_fail_quickMeeting(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(uploadDocument_fail_quickMeeting(t("Something-went-wrong")));
      });
  };
};

// Save Files Actions
const saveFilesQuickMeeting_Init = () => ({
  type: actions.QUICKMEETING_SAVE_DOCUMENTS_INIT,
});

const saveFilesQuickMeeting_Success = (response, message) => ({
  type: actions.QUICKMEETING_SAVE_DOCUMENTS_SUCCESS,
  response,
  message,
});

const saveFilesQuickMeeting_Fail = (message) => ({
  type: actions.QUICKMEETING_SAVE_DOCUMENTS_FAIL,
  message,
});

// Save Files API for Quick Meeting
const saveFilesQuickMeetingApi = (navigate, t, data, folderID, newFolder) => {
  return async (dispatch) => {
    try {
      let token = JSON.parse(localStorage.getItem("token"));
      let creatorID = JSON.parse(localStorage.getItem("userID"));
      let requestData = {
        FolderID:
          folderID !== null && folderID !== undefined ? Number(folderID) : 0,
        Files: data,
        UserID: creatorID,
        Type: 0,
      };

      dispatch(saveFilesQuickMeeting_Init());

      let form = new FormData();
      form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
      form.append("RequestData", JSON.stringify(requestData));

      let response = await axios.post(dataRoomApi, form, {
        headers: { _token: token },
      });

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(
          saveFilesQuickMeetingApi(navigate, t, data, folderID, newFolder)
        );
      }

      if (response.data.responseCode === 200) {
        const responseResult = response.data.responseResult;

        if (responseResult.isExecuted) {
          const message = responseResult.responseMessage.toLowerCase();

          if (
            message.includes(
              "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase()
            )
          ) {
            try {
              responseResult.fileID.forEach((newFileID) => {
                newFolder.push({
                  pK_FileID: newFileID.pK_FileID,
                  displayFileName: newFileID.displayFileName,
                });
              });
            } catch (error) {
              console.error("Error processing file IDs:", error);
            }

            dispatch(
              saveFilesQuickMeeting_Success(
                responseResult,
                t("Files-saved-successfully")
              )
            );

            return {
              isExecuted: true,
              responseCode: 1,
              newFolder,
            };
          } else if (
            message.includes(
              "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
            )
          ) {
            dispatch(saveFilesQuickMeeting_Fail(t("Failed-to-save-any-file")));
            return {
              isExecuted: false,
              responseCode: 2,
            };
          } else if (
            message.includes(
              "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
            )
          ) {
            dispatch(saveFilesQuickMeeting_Fail(t("Something-went-wrong")));
            return {
              isExecuted: false,
              responseCode: 3,
            };
          } else {
            dispatch(saveFilesQuickMeeting_Fail(t("Something-went-wrong")));
            return {
              isExecuted: false,
              responseCode: 4,
            };
          }
        } else {
          dispatch(saveFilesQuickMeeting_Fail(t("Something-went-wrong")));
          return {
            isExecuted: false,
            responseCode: 5,
          };
        }
      } else {
        dispatch(saveFilesQuickMeeting_Fail(t("Something-went-wrong")));
        return {
          isExecuted: false,
          responseCode: 5,
        };
      }
    } catch (error) {
      dispatch(saveFilesQuickMeeting_Fail(t("Something-went-wrong")));
      return {
        isExecuted: false,
        responseCode: 0,
      };
    }
  };
};

const moveFilesAndFolder_init = () => {
  return {
    type: actions.MOVEFILEANDFODLER_INIT,
  };
};
const moveFilesAndFolder_success = (response, message) => {
  return {
    type: actions.MOVEFILEANDFODLER_SUCCESS,
    response: response,
    message: message,
  };
};
const moveFilesAndFolder_fail = (message) => {
  return {
    type: actions.MOVEFILEANDFODLER_FAIL,
    message: message,
  };
};

const moveFilesAndFoldersApi = (
  navigate,
  t,
  Data,
  newAgendas,
  checkFlag,
  setShow
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    await dispatch(moveFilesAndFolder_init());
    let form = new FormData();
    form.append("RequestMethod", MoveFilesToFoldersRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
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
          dispatch(RefreshToken(navigate, t));
          dispatch(
            moveFilesAndFoldersApi(
              navigate,
              t,
              Data,
              newAgendas,
              checkFlag,
              setShow
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_MoveFilesToFolders_01".toLowerCase()
                )
            ) {
              dispatch(
                moveFilesAndFolder_success(
                  response.data.responseResult,
                  t("Files-moved-successfully")
                )
              );
              await dispatch(
                SaveMeetingDocuments(
                  newAgendas,
                  navigate,
                  t,
                  checkFlag,
                  setShow
                )
              );
              console.log(checkFlag, "checkFlagcheckFlag");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_MoveFilesToFolders_02".toLowerCase()
                )
            ) {
              dispatch(moveFilesAndFolder_fail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_MoveFilesToFolders_03".toLowerCase()
                )
            ) {
              dispatch(moveFilesAndFolder_fail(t("Something-went-wrong")));
            } else {
              dispatch(moveFilesAndFolder_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(moveFilesAndFolder_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(moveFilesAndFolder_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(moveFilesAndFolder_fail(t("Something-went-wrong")));
      });
  };
};
const getMeetingRecordingFiles_init = () => {
  return {
    type: actions.GETMEETINGRECORDINGFILES_INIT,
  };
};

const getMeetingRecordingFiles_success = (response) => {
  return {
    type: actions.GETMEETINGRECORDINGFILES_SUCCESS,
    response: response,
  };
};

const getMeetingRecordingFiles_fail = (message) => {
  return {
    type: actions.GETMEETINGRECORDINGFILES_FAIL,
    message: message,
  };
};

const getMeetingRecordingFilesApi = (
  navigate,
  t,
  Data,
  setStepDownloadModal
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(getMeetingRecordingFiles_init());

    let form = new FormData();
    form.append("RequestMethod", GetMeetingRecordingFilesRM.RequestMethod);
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
          dispatch(
            getMeetingRecordingFilesApi(navigate, t, Data, setStepDownloadModal)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingRecordingFiles_01".toLowerCase()
                )
            ) {
              let apiResonse = {
                response: {
                  response: response.data.responseResult,
                  MeetingID: Data.MeetingID,
                },
              };
              dispatch(
                getMeetingRecordingFiles_success(apiResonse, t("Successful"))
              );
              isFunction(setStepDownloadModal) && setStepDownloadModal(2);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingRecordingFiles_02".toLowerCase()
                )
            ) {
              let apiResonse = {
                response: {
                  response: response.data.responseResult,
                  MeetingID: Data.MeetingID,
                },
              };
              dispatch(
                getMeetingRecordingFiles_success(apiResonse, t("Successful"))
              );
              isFunction(setStepDownloadModal) && setStepDownloadModal(2);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingRecordingFiles_03".toLowerCase()
                )
            ) {
              dispatch(
                getMeetingRecordingFiles_fail(t("No-meeting-recording-found"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingRecordingFiles_04".toLowerCase()
                )
            ) {
              getMeetingRecordingFiles_fail(t("Something-went-wrong"));
            } else {
              dispatch(
                getMeetingRecordingFiles_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(getMeetingRecordingFiles_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getMeetingRecordingFiles_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(getMeetingRecordingFiles_fail(t("Something-went-wrong")));
      });
  };
};
const requestMeetingRecordingTranscript_init = () => {
  return {
    type: actions.REQUEST_MEETING_RECORDING_TRANSCRIPT_INIT,
  };
};

const requestMeetingRecordingTranscript_success = (response, message) => {
  return {
    type: actions.REQUEST_MEETING_RECORDING_TRANSCRIPT_SUCCESS,
    response: response,
    message: message,
  };
};

const requestMeetingRecordingTranscript_fail = (message) => {
  return {
    type: actions.REQUEST_MEETING_RECORDING_TRANSCRIPT_FAIL,
    message: message,
  };
};

const requestMeetingRecordingTranscript_clear = () => {
  return {
    type: actions.REQUEST_MEETING_RECORDING_TRANSCRIPT_CLEAR,
  };
};

const requestMeetingRecordingTranscriptApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(requestMeetingRecordingTranscript_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      RequestMeetingRecordingTranscriptRM.RequestMethod
    ); // Replace with actual request method
    form.append("RequestData", JSON.stringify(Data));

    axios({
      method: "post",
      url: dataRoomApi, // Replace with actual API URL
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(requestMeetingRecordingTranscriptApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_RequestMeetingRecordingTranscript_01".toLowerCase()
                )
            ) {
              dispatch(
                requestMeetingRecordingTranscript_success(
                  response.data.responseResult,
                  t("Successful")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_RequestMeetingRecordingTranscript_02".toLowerCase()
                )
            ) {
              dispatch(
                requestMeetingRecordingTranscript_fail(t("Unsuccessfull"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_RequestMeetingRecordingTranscript_03".toLowerCase()
                )
            ) {
              dispatch(
                requestMeetingRecordingTranscript_fail(
                  t("Something went wrong")
                )
              );
            } else {
              dispatch(
                requestMeetingRecordingTranscript_fail(
                  t("Something went wrong")
                )
              );
            }
          } else {
            dispatch(
              requestMeetingRecordingTranscript_fail(t("Something went wrong"))
            );
          }
        } else {
          dispatch(
            requestMeetingRecordingTranscript_fail(t("Something went wrong"))
          );
        }
      })
      .catch(() => {
        dispatch(
          requestMeetingRecordingTranscript_fail(t("Something went wrong"))
        );
      });
  };
};

const meetingTranscriptDownloaded = (response) => {
  return {
    type: actions.MEETING_TRANSCRIPT_DOWNLOADED,
    payload: response,
  };
};

const meetingMinutesDownloaded = (response) => {
  return {
    type: actions.MEETING_MINUTES_DOWNLOADED,
    payload: response,
  };
};

const NewJoinCurrentMeeting = (
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
              dispatch(videoIconOrButtonState(false));
              localStorage.setItem("isMeeting", true);
              localStorage.setItem("videoCallURL", Data.VideoCallURL);
              localStorage.setItem(
                "AdvanceMeetingOpen",
                isQuickMeeting ? false : true
              );
              localStorage.setItem(
                "typeOfMeeting",
                isQuickMeeting ? "isQuickMeeting" : "isAdvanceMeeting"
              );
              localStorage.setItem(
                "isMeetingVideoHostCheck",
                response.data.responseResult.isMeetingVideoHost
              );

              await dispatch(
                joinMeetingSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              if (isQuickMeeting === true) {
                let viewMeetingData = { MeetingID: Number(Data.FK_MDID) };
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
                isFunction(setAdvanceMeetingModalID) &&
                  setAdvanceMeetingModalID(Number(Data.FK_MDID));
                isFunction(setViewAdvanceMeetingModal) &&
                  setViewAdvanceMeetingModal(true);
                await dispatch(viewAdvanceMeetingPublishPageFlag(true));
                await dispatch(scheduleMeetingPageFlag(false));
              }
              localStorage.setItem("currentMeetingID", Data.FK_MDID);
              await dispatch(currentMeetingStatus(10));
              let activeStatusOneToOne = JSON.parse(
                localStorage.getItem("activeCall")
              );

              let presenterViewStatus =
                response.data.responseResult.isPresenterViewStarted;
              if (presenterViewStatus && !activeStatusOneToOne) {
                console.log("busyCall 21");

                let data = {
                  VideoCallURL: String(Data.VideoCallURL),
                  WasInVideo: false,
                };
                console.log("onClickStopPresenter", data);
                dispatch(joinPresenterViewMainApi(navigate, t, data));
              } else if (presenterViewStatus && activeStatusOneToOne) {
                console.log("busyCall 21");
                localStorage.setItem("JoinpresenterForonetoone", true);
                dispatch(nonMeetingVideoGlobalModal(true));
                dispatch(presenterViewGlobalState(0, true, false, false));
              }
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
              dispatch(
                joinMeetingFail(
                  t(
                    "Unable-to-join-the-meeting-at-this-time-please-try-after-some-time"
                  )
                )
              );
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

export {
  NewJoinCurrentMeeting,
  meetingMinutesDownloaded,
  requestMeetingRecordingTranscriptApi,
  getMeetingRecordingFilesApi,
  moveFilesAndFoldersApi,
  uploadDocumentsQuickMeetingApi,
  saveFilesQuickMeetingApi,
  validateEncryptedStringViewMeetingLinkApi,
  newMeetingGlobalLoader,
  meetingReminderNotifcation,
  getAllMeetingUsersRSVPApi,
  getDashbardMeetingDataApi,
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
  validateStringParticipantProposedApi,
  LeaveMeetingVideo,
  proposedMeetingData,
  ParticipantsData,
  GetAllMeetingDetialsData,
  showCancelModalAgendaBuilder,
  showShareViaDataRoomPathConfirmation,
  getDashboardMeetingCountMQTT,
  validateStringUserMeetingProposedDatesPollsApi,
  ProposedMeetingViewFlagAction,
  LeaveMeetingSideBarModalAction,
  GetMeetingStatusDataAPI,
  removeUpComingEvent,
  AgendaPollVotingStartedAction,
  validateEmptyStringUserAvailibilityFailed,
  requestMeetingRecordingTranscript_clear,
  meetingTranscriptDownloaded,
  clearProposedWiseData,
};
