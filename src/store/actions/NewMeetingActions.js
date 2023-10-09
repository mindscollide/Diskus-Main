import axios from "axios";
import { searchUserMeetings } from "../../commen/apis/Api_config";
import * as actions from "../action_types";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";

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
  searchNewUserMeeting,
  clearMeetingState,
};
