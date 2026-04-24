import * as actions from "../action_types";

import { dataRoomApi, meetingApi } from "../../commen/apis/Api_ends_points";
import {
  addUpdateAdvanceMeetingAgenda,
  CreateUpdateMeetingDataroomMapped,
  getAdvanceMeetingAgendabyMeetingID,
  getAllAgendaContributorRM,
  getAllMeetingDetailsByMeetingID,
  getAllMeetingOrganizers,
  getallMeetingType,
  GetAllRecurringNewMeeting,
  getAllSavedParticipants,
  GetAllUserAgendaRights,
  getMeetingByMeetingID,
  GetMeetingNewFrequencyReminder,
  joinMeeting,
  meetingStatusUpdate,
  saveAgendaContributorsRM,
  saveFilesRequestMethod,
  saveMeetingDetials,
  saveMeetingDocuments,
  saveMeetingOrganizers,
  saveParticipantsMeeting,
  searchUserMeetings,
  SettingMeetingProposedDates,
  UpdateMeetingUserhit,
  uploadDocumentsRequestMethod,
} from "../../commen/apis/Api_config";
import axiosInstance from "../../commen/functions/axiosInstance";

import {
  ProposedMeetingViewFlagAction,
  searchNewUserMeeting,
  showSceduleProposedMeeting,
} from "./NewMeetingActions";
import { RefreshToken } from "./Auth_action";
import store from "../store";
import { editMeetingFlag, saveMeetingFlag } from "./MeetingOrganizers_action";

// Fix: import Redux tab actions to replace individual xxxGlobalFlag dispatches
import {
  resetCreateEditTabs,
  setAdvanceMeetingRoute,
  setCreateEditTab,
  setViewTab,
  toggleCreateEditMeetingModal,
  toggleViewMeetingModal,
} from "./ModalStates_actions";
import {
  getMeetingByCommitteeIdApi,
  setMeetingbyCommitteeIdApi,
} from "./Committee_actions";
import {
  getMeetingbyGroupIdApi,
  setMeetingByGroupIdApi,
} from "./Groups_actions";
import { getCurrentDateTimeUTC } from "../../commen/functions/date_formater";
import {
  joinPresenterViewMainApi,
  nonMeetingVideoGlobalModal,
  presenterViewGlobalState,
  videoIconOrButtonState,
} from "./VideoFeature_actions";
import { switchOnMessage } from "../../commen/functions/utils";
import { webnotificationGlobalFlag } from "./UpdateUserNotificationSetting";
import { getAllUnpublishedMeetingData } from "../../hooks/meetingResponse/response";

// ─── Save Meeting Details ────────────────────────────────────────────────────

const handleSaveMeetingInit = () => ({
  type: actions.SAVE_MEETING_DETAILS_INIT,
});

const handleSaveMeetingSuccess = (response, message) => ({
  type: actions.SAVE_MEETING_DETAILS_SUCCESS,
  response,
  message,
});

const handleSaveMeetingFailed = (message) => ({
  type: actions.SAVE_MEETING_DETAILS_FAILED,
  message,
});

// ─── Save Meeting Details ────────────────────────────────────────────────────

export const SaveMeetingDetailsApi = (navigate, t, Data, routePath, object) => {
  return (dispatch) => {
    dispatch(handleSaveMeetingInit());
    const form = new FormData();
    form.append("RequestMethod", saveMeetingDetials.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SaveMeetingDetailsApi(navigate, t, Data, routePath, object));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();
            const meetingID = response.data.responseResult.meetingID;

            switchOnMessage(responseMessage, {
              // _01: Meeting saved — proceed to DataRoom folder mapping
              Meeting_MeetingServiceManager_SaveMeetingDetails_01: () => {
                dispatch(
                  handleSaveMeetingSuccess(response.data.responseResult, ""),
                );
                switch (routePath) {
                  case "saveMeeting":
                    dispatch(
                      CreateUpdateMeetingDataRoomMapeedFolderIdApi(
                        navigate,
                        t,
                        {
                          MeetingID: meetingID,
                          MeetingTitle: Data.MeetingDetails.MeetingTitle,
                          IsUpdateFlow: false,
                        },
                        routePath,
                        object,
                      ),
                    );
                    break;
                  case "publishedMeeting":
                    dispatch(
                      handleSaveMeetingSuccess(
                        response.data.responseResult,
                        t("Meeting-details-updated-and-published-successfully"),
                      ),
                    );
                    (async () => {
                      const currentView =
                        localStorage.getItem("MeetingCurrentView");
                      const meetingpageRow =
                        localStorage.getItem("MeetingPageRows");
                      const meetingPageCurrent =
                        localStorage.getItem("MeetingPageCurrent");
                      const userID = localStorage.getItem("userID");
                      await dispatch(
                        searchNewUserMeeting(
                          navigate,
                          t,
                          {
                            Date: "",
                            Title: "",
                            HostName: "",
                            UserID: Number(userID),
                            PageNumber:
                              meetingPageCurrent !== null
                                ? Number(meetingPageCurrent)
                                : 1,
                            Length:
                              meetingpageRow !== null
                                ? Number(meetingpageRow)
                                : 30,
                            PublishedMeetings:
                              currentView && Number(currentView) === 1,
                            ProposedMeetings:
                              currentView && Number(currentView) === 2,
                          },
                          "",
                          {},
                        ),
                      );
                    })();
                    break;
                  case "updateMeeting":
                    dispatch(
                      CreateUpdateMeetingDataRoomMapeedFolderIdApi(
                        navigate,
                        t,
                        {
                          MeetingID: meetingID,
                          MeetingTitle: Data.MeetingDetails.MeetingTitle,
                          IsUpdateFlow: true,
                        },
                        routePath,
                        {},
                      ),
                    );
                    break;
                  case "committeeSaveMeeting":
                    dispatch(
                      CreateUpdateMeetingDataRoomMapeedFolderIdApi(
                        navigate,
                        t,
                        {
                          MeetingID: meetingID,
                          MeetingTitle: Data.MeetingDetails.MeetingTitle,
                          IsUpdateFlow: false,
                        },
                        routePath,
                        {},
                      ),
                    );
                    break;
                  case "committeeUpdateMeeting":
                    dispatch(
                      CreateUpdateMeetingDataRoomMapeedFolderIdApi(
                        navigate,
                        t,
                        {
                          MeetingID: meetingID,
                          MeetingTitle: Data.MeetingDetails.MeetingTitle,
                          IsUpdateFlow: true,
                        },
                        routePath,
                        {},
                      ),
                    );
                    break;
                  case "committeePublishedMeeting":
                    break;
                  case "groupSaveMeeting":
                    dispatch(
                      CreateUpdateMeetingDataRoomMapeedFolderIdApi(
                        navigate,
                        t,
                        {
                          MeetingID: meetingID,
                          MeetingTitle: Data.MeetingDetails.MeetingTitle,
                          IsUpdateFlow: false,
                        },
                        routePath,
                        {},
                      ),
                    );
                    break;
                  case "groupUpdateMeeting":
                    dispatch(
                      CreateUpdateMeetingDataRoomMapeedFolderIdApi(
                        navigate,
                        t,
                        {
                          MeetingID: meetingID,
                          MeetingTitle: Data.MeetingDetails.MeetingTitle,
                          IsUpdateFlow: true,
                        },
                        routePath,
                        {},
                      ),
                    );
                    break;
                  case "groupPublishedMeeting":
                    break;
                  default:
                    break;
                }
              },
              // _02: No record found
              Meeting_MeetingServiceManager_SaveMeetingDetails_02: () =>
                dispatch(handleSaveMeetingFailed(t("No-record-found"))),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_SaveMeetingDetails_03: () =>
                dispatch(handleSaveMeetingFailed(t("Something-went-wrong"))),
              // _04: Consecutive dates invalid
              Meeting_MeetingServiceManager_SaveMeetingDetails_04: () =>
                dispatch(
                  handleSaveMeetingFailed(
                    t(
                      "Consecutive-date-times-should-be-greater-than-previous-date-time",
                    ),
                  ),
                ),
              // _05: Agenda required to publish
              Meeting_MeetingServiceManager_SaveMeetingDetails_05: () =>
                dispatch(
                  handleSaveMeetingFailed(t("Add-meeting-agenda-to-publish")),
                ),
              // _06: Organizers required to publish
              Meeting_MeetingServiceManager_SaveMeetingDetails_06: () =>
                dispatch(
                  handleSaveMeetingFailed(
                    t("Add-meeting-organizers-to-publish"),
                  ),
                ),
              // _07: Participants required to publish
              Meeting_MeetingServiceManager_SaveMeetingDetails_07: () =>
                dispatch(
                  handleSaveMeetingFailed(
                    t("Add-meeting-participants-to-publish"),
                  ),
                ),
              // _08: Meeting time has already elapsed
              Meeting_MeetingServiceManager_SaveMeetingDetails_08: () =>
                dispatch(
                  handleSaveMeetingFailed(
                    t("Meeting-cannot-be-published-after-time-has-elapsed"),
                  ),
                ),
              default: () =>
                dispatch(handleSaveMeetingFailed(t("Something-went-wrong"))),
            });
          } else {
            dispatch(handleSaveMeetingFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(handleSaveMeetingFailed(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("SaveMeetingDetailsApi:", error);
        dispatch(handleSaveMeetingFailed(t("Something-went-wrong")));
      });
  };
};
// ─── Create/Update Meeting DataRoom Mapped Folder ────────────────────────────

const showCreateUpdateMeetingDataRoomInit = () => ({
  type: actions.CREATE_UPDATE_MEETING_DATA_ROOM_MAPPED_INIT,
});

const showCreateUpdateMeetingDataRoomSuccess = (response, message, flag) => ({
  type: actions.CREATE_UPDATE_MEETING_DATA_ROOM_MAPPED_SUCCESS,
  response,
  message,
  loader: flag,
});

const showCreateUpdateMeetingDataRoomFailed = (message) => ({
  type: actions.CREATE_UPDATE_MEETING_DATA_ROOM_MAPPED_FAILED,
  message,
});

// ─── Create/Update Meeting DataRoom Mapped Folder ────────────────────────────

export const CreateUpdateMeetingDataRoomMapeedFolderIdApi = (
  navigate,
  t,
  Data,
  routePath,
  object,
) => {
  return (dispatch) => {
    dispatch(showCreateUpdateMeetingDataRoomInit());
    const form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      CreateUpdateMeetingDataroomMapped.RequestMethod,
    );

    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            CreateUpdateMeetingDataRoomMapeedFolderIdApi(
              navigate,
              t,
              Data,
              routePath,
              object,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();
            const folderID = response.data.responseResult.folderID;
            const committeeInfo =
              store.getState().CommitteeReducer?.viewCommitteeDetails;
            const groupInfo = store.getState().GroupsReducer?.viewGroupDetails;

            const handleRouteAfterSuccess = () => {
              switch (routePath) {
                case "saveMeeting":
                  const { setEditorRole } = object;
                  dispatch(setCreateEditTab("organizers"));
                  setEditorRole({
                    status: "11",
                    role: "Organizer",
                    isPrimaryOrganizer: true,
                  });
                  break;
                case "updateMeeting":
                  dispatch(setCreateEditTab("organizers"));

                  break;
                case "saveProposedMeeting": {
                  const {
                    rows,
                    ResponseDate,
                    setProposedNewMeeting,
                    setSceduleMeeting,
                    members,
                  } = object;

                  dispatch(
                    UpdateMeetingUserApi(
                      navigate,
                      t,
                      {
                        MeetingID: Data.MeetingID,
                        MeetingAttendeRoleID: 2,
                        UpdatedUsers: members.map((m) => m.userID),
                      },
                      "saveProposedMeeting",
                      {
                        members,
                        editableSave: 3,
                        MeetID: Data.MeetingID,
                        rows,
                        ResponseDate,
                        loader: true,
                        setProposedNewMeeting,
                        setSceduleMeeting,
                      },
                    ),
                  );
                  break;
                }
                case "getMeetingDetailsFromAgendaTab":
                case "EditMeetingFromMainListing": {
                  break;
                }
                case "committeeSaveMeeting":
                  dispatch(
                    setMeetingbyCommitteeIdApi(
                      navigate,
                      t,
                      {
                        MeetingID: Number(Data.MeetingID),
                        CommitteeID: Number(committeeInfo.committeeID),
                      },
                      "fromCommitteeAdvanceMeeting",
                      {},
                    ),
                  );
                  break;
                case "committeeUpdateMeeting":
                  break;
                case "groupSaveMeeting":
                  dispatch(
                    setMeetingByGroupIdApi(
                      navigate,
                      t,
                      {
                        MeetingID: Number(Data.MeetingID),
                        GroupID: Number(groupInfo.groupID),
                      },
                      "fromGroupAdvanceMeeting",
                      {},
                    ),
                  );
                  break;
                case "groupUpdateMeeting":
                  dispatch(
                    setCurrentMeetingInfo({
                      meetingID: Data.MeetingID,
                      meetingTitle: Data.MeetingTitle,
                      mapFolderId: folderID ?? 0,
                    }),
                  );
                  break;

                default:
                  break;
              }
            };

            const onSuccess = async (loaderFlag) => {
              await dispatch(
                showCreateUpdateMeetingDataRoomSuccess(
                  folderID,
                  "",
                  loaderFlag,
                ),
              );
              dispatch(
                setCurrentMeetingInfo({
                  meetingID: Data.MeetingID,
                  meetingTitle: Data.MeetingTitle,
                  mapFolderId: folderID ?? 0,
                }),
              );
              handleRouteAfterSuccess();
            };

            switchOnMessage(responseMessage, {
              // _01: Folder created/mapped successfully for first time
              DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_01:
                () => onSuccess(false),
              // _02: Failed to save or map folder
              DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_02:
                () =>
                  dispatch(
                    showCreateUpdateMeetingDataRoomFailed(
                      t("Failed-to-save-or-map-folder"),
                    ),
                  ),
              // _03: Folder already existed — re-mapped successfully
              DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_03:
                () => onSuccess(false),
              // _04: Failed to update existing folder
              DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_04:
                () =>
                  dispatch(
                    showCreateUpdateMeetingDataRoomFailed(
                      t("Unable-to-update-folder"),
                    ),
                  ),
              // _05: Successfully created new mapping entry
              DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_05:
                () => onSuccess(false),
              // _06: Failed to create new mapping
              DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_06:
                () =>
                  dispatch(
                    showCreateUpdateMeetingDataRoomFailed(
                      t("Failed-to-create-new-mapping"),
                    ),
                  ),
              // _07: Generic server-side failure
              DataRoom_DataRoomServiceManager_CreateUpdateMeetingDataRoomMap_07:
                () =>
                  dispatch(
                    showCreateUpdateMeetingDataRoomFailed(
                      t("Something-went-wrong"),
                    ),
                  ),
              default: () =>
                dispatch(
                  showCreateUpdateMeetingDataRoomFailed(
                    t("Something-went-wrong"),
                  ),
                ),
            });
          } else {
            dispatch(
              showCreateUpdateMeetingDataRoomFailed(t("Something-went-wrong")),
            );
          }
        } else {
          dispatch(
            showCreateUpdateMeetingDataRoomFailed(t("Something-went-wrong")),
          );
        }
      })
      .catch((error) => {
        console.error("CreateUpdateMeetingDataRoomMapeedFolderIdApi:", error);
        dispatch(
          showCreateUpdateMeetingDataRoomFailed(t("Something-went-wrong")),
        );
      });
  };
};
// ─── Update Meeting Users ────────────────────────────────────────────────────

const UpdateMeetingUserInit = () => ({
  type: actions.UPDATE_MEETING_USERS_INIT,
});

const UpdateMeetingUserSuccess = (response, message, loader) => ({
  type: actions.UPDATE_MEETING_USERS_SUCCESS,
  response,
  message,
  loader,
});

const UpdateMeetingUserFailed = (message) => ({
  type: actions.UPDATE_MEETING_USERS_FAILED,
  message,
});

// ─── Update Meeting Users ────────────────────────────────────────────────────

export const UpdateMeetingUserApi = (
  navigate,
  t,
  Data,
  routePath,
  object = {},
) => {
  return (dispatch) => {
    dispatch(UpdateMeetingUserInit());
    const form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", UpdateMeetingUserhit.RequestMethod);

    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(UpdateMeetingUserApi(navigate, t, Data, routePath, object));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Users updated — proceed to next API in chain
              DataRoom_DataRoomManager_UpdateMeetingUsers_01: () => {
                dispatch(
                  UpdateMeetingUserSuccess(
                    response.data.responseResult,
                    "",
                    false,
                  ),
                );
                try {
                  const { editableSave } = object;
                  const meetingId =
                    store.getState().NewMeetingreducer?.currentMeetingInfo
                      ?.meetingID;

                  switch (routePath) {
                    case "saveMeetingParticipants": {
                      const { rspvRows } = object;
                      dispatch(
                        SaveParticipantsApi(
                          navigate,
                          t,
                          {
                            MeetingParticipants: rspvRows.map((row) => ({
                              UserID: row.userID,
                              Title: row.Title,
                              ParticipantRoleID:
                                row.participantRole?.participantRoleID ?? 0,
                            })),
                            MeetingID: Number(meetingId),
                            IsParticipantsAddFlow: editableSave !== 1,
                            NotificationMessage: "",
                          },
                          "saveMeetingParticipants",
                          {},
                        ),
                      );
                      break;
                    }
                    case "saveMeetingOrganizer": {
                      const { rowsData, notificationMessage, setIsEdit } =
                        object;
                      dispatch(saveMeetingFlag(false));
                      dispatch(editMeetingFlag(false));
                      setIsEdit(false);
                      dispatch(
                        SaveMeetingOrganizersApi(
                          navigate,
                          t,
                          {
                            MeetingOrganizers: rowsData.map((item) => ({
                              IsPrimaryOrganizer: item.isPrimaryOrganizer,
                              IsOrganizerNotified: item.isOrganizerNotified,
                              Title: item.organizerTitle,
                              UserID: item.userID,
                            })),
                            MeetingID: meetingId,
                            IsOrganizerAddFlow: editableSave !== 1,
                            NotificationMessage: notificationMessage,
                          },
                          "saveMeetingOrganizer",
                          { currentMeeting: meetingId },
                        ),
                      );
                      break;
                    }
                    case "saveAndUpdateAgendaContributor": {
                      const { rowsData, isEditFlag, notifyMessageField } =
                        object;
                      dispatch(
                        saveAgendaContributorsApi(
                          navigate,
                          t,
                          {
                            AgendaContributors: rowsData.map((data) => ({
                              UserID: data.userID,
                              Title: data.Title,
                              AgendaListRightsAll: data.agendaListRightsAll,
                              MeetingID:
                                meetingId !== 0 ? Number(meetingId) : 0,
                              IsContributorNotified: data.isContributorNotified,
                            })),
                            MeetingID: Number(meetingId),
                            IsAgendaContributorAddFlow: isEditFlag !== 1,
                            NotificationMessage: notifyMessageField,
                          },
                          "saveAndUpdateAgendaContributor",
                          { flag: isEditFlag },
                        ),
                      );
                      break;
                    }
                    case "EndMeetingFromMeetingDetailsModal":
                      const { setEndMeetingConfirmationModal } = object;
                      setEndMeetingConfirmationModal(false);
                      break;
                    default:
                      break;
                  }
                } catch (error) {
                  console.error("UpdateMeetingUserApi switch error:", error);
                }
              },
              // _02: Update failed
              DataRoom_DataRoomManager_UpdateMeetingUsers_02: () =>
                dispatch(UpdateMeetingUserFailed(t("Something-went-wrong"))),
              default: () =>
                dispatch(UpdateMeetingUserFailed(t("Something-went-wrong"))),
            });
          } else {
            dispatch(UpdateMeetingUserFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(UpdateMeetingUserFailed(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("UpdateMeetingUserApi:", error);
        dispatch(UpdateMeetingUserFailed(t("Something-went-wrong")));
      });
  };
};

// ─── Save Participants ───────────────────────────────────────────────────────

const showSavedParticipantsInit = () => ({
  type: actions.SAVE_MEETING_PARTICIPANTS_INIT,
});

const showSaveParticipantsSuccess = (response, message, loader) => ({
  type: actions.SAVE_MEETING_PARTICIPANTS_SUCCESS,
  response,
  message,
  loader,
});

const showSaveParticipantsFailed = (message) => ({
  type: actions.SAVE_MEETING_PARTICIPANTS_FAILED,
  message,
});

// ─── Save Participants ───────────────────────────────────────────────────────

export const SaveParticipantsApi = (navigate, t, Data, routePath, object) => {
  return (dispatch) => {
    dispatch(showSavedParticipantsInit());
    const form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", saveParticipantsMeeting.RequestMethod);

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SaveParticipantsApi(navigate, t, Data, routePath, object));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Participants saved successfully
              Meeting_MeetingServiceManager_SaveMeetingParticipants_01: () => {
                const {
                  currentMeeting,
                  flag,
                  rows,
                  ResponseDate,
                  loader,
                  setProposedNewMeeting,
                } = object;
                dispatch(
                  showSaveParticipantsSuccess(
                    response.data.responseResult,
                    t("Participants-details-updated-successfully"),
                    loader,
                  ),
                );
                if (flag === true) {
                  dispatch(
                    setProposedMeetingDateApi(
                      navigate,
                      t,
                      {
                        MeetingID: currentMeeting,
                        SendResponsebyDate: ResponseDate,
                        ProposedDates: rows,
                      },
                      routePath,
                      { flag, setProposedNewMeeting },
                    ),
                  );
                } else {
                  const meetingId =
                    store.getState().NewMeetingreducer?.currentMeetingInfo
                      ?.meetingID;
                  dispatch(
                    GetAllSavedparticipantsApi(
                      navigate,
                      t,
                      {
                        MeetingID: Number(meetingId),
                      },
                      routePath,
                      { flag: false },
                    ),
                  );
                }
              },
              // _02: No rows inserted
              Meeting_MeetingServiceManager_SaveMeetingParticipants_02: () =>
                dispatch(showSaveParticipantsFailed(t("No-row-inserted"))),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_SaveMeetingParticipants_03: () =>
                dispatch(showSaveParticipantsFailed(t("Something-went-wrong"))),
              default: () =>
                dispatch(showSaveParticipantsFailed(t("Something-went-wrong"))),
            });
          } else {
            dispatch(showSaveParticipantsFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showSaveParticipantsFailed(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("SaveParticipantsApi:", error);
        dispatch(showSaveParticipantsFailed(t("Something-went-wrong")));
      });
  };
};

// ─── Set Proposed Meeting Dates ──────────────────────────────────────────────

const showPrposedMeetingDateInit = () => ({
  type: actions.SET_MEETING_PROPOSED_DATE_INIT,
});

const showPrposedMeetingDateSuccess = (response, message) => ({
  type: actions.SET_MEETING_PROPOSED_DATE_SUCCESS,
  response,
  message,
});

const showPrposedMeetingDateFailed = (message) => ({
  type: actions.SET_MEETING_PROPOSED_DATE_FAILED,
  message,
});

// ─── Set Proposed Meeting Dates ──────────────────────────────────────────────

export const setProposedMeetingDateApi = (
  navigate,
  t,
  Data,
  routePath,
  object,
) => {
  return (dispatch) => {
    dispatch(showPrposedMeetingDateInit());
    const form = new FormData();
    form.append("RequestMethod", SettingMeetingProposedDates.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            setProposedMeetingDateApi(navigate, t, Data, routePath, object),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Proposed dates saved
              Meeting_MeetingServiceManager_SetMeetingProposedDatess_01: () => {
                dispatch(
                  showPrposedMeetingDateSuccess(
                    response.data.responseResult,
                    t("Your-slots-has-been-added-successfully"),
                  ),
                );
                const { flag, setProposedNewMeeting } = object;
                if (flag === true) {
                  setProposedNewMeeting(false);
                  localStorage.setItem("MeetingCurrentView", 2);
                  const userID = localStorage.getItem("userID");
                  const meetingpageRow =
                    localStorage.getItem("MeetingPageRows");
                  const meetingPageCurrent =
                    localStorage.getItem("MeetingPageCurrent");
                  const currentView =
                    localStorage.getItem("MeetingCurrentView");
                  dispatch(
                    searchNewUserMeeting(
                      navigate,
                      t,
                      {
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
                        PublishedMeetings: Number(currentView) === 1,
                        ProposedMeetings: Number(currentView) === 2,
                      },
                      "",
                      {},
                    ),
                  );
                }
              },
              // _02: No record saved
              Meeting_MeetingServiceManager_SetMeetingProposedDates_02: () =>
                dispatch(showPrposedMeetingDateFailed(t("No-record-saved"))),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_SetMeetingProposedDates_03: () =>
                dispatch(
                  showPrposedMeetingDateFailed(t("Something-went-wrong")),
                ),
              // _04: More than 5 dates not allowed
              Meeting_MeetingServiceManager_SetMeetingProposedDates_04: () =>
                dispatch(
                  showPrposedMeetingDateFailed(
                    t("Not-more-than-5-dates-are-allowed"),
                  ),
                ),
              default: () =>
                dispatch(
                  showPrposedMeetingDateFailed(t("Something-went-wrong")),
                ),
            });
          } else {
            dispatch(showPrposedMeetingDateFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showPrposedMeetingDateFailed(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("setProposedMeetingDateApi:", error);
        dispatch(showPrposedMeetingDateFailed(t("Something-went-wrong")));
      });
  };
};

// ─── Get All Saved Participants ──────────────────────────────────────────────

const showAllMeetingParticipantsInit = () => ({
  type: actions.GET_ALL_SAVED_PARTICIPATNS_INIT,
});

const showAllMeetingParticipantsSuccess = (response, message, flag) => ({
  type: actions.GET_ALL_SAVED_PARTICIPATNS_SUCCESS,
  response,
  message,
  loader: flag,
});

const showAllMeetingParticipantsIsPublishedSuccess = (
  response,
  message,
  flag,
) => ({
  type: actions.GET_ALL_SAVED_PARTICIPATNS_ISPUBLISHED_SUCCESS,
  response,
  message,
  loader: flag,
});

const showAllMeetingParticipantsAllowrsvp = (response, message, flag) => ({
  type: actions.GET_ALL_SAVED_PARTICIPATNS_ALLOWRSVP,
  response,
  message,
  loader: flag,
});

const showAllMeetingParticipantsFailed = (message) => ({
  type: actions.GET_ALL_SAVED_PARTICIPATNS_FAILED,
  message,
});

// ─── Get All Saved Participants ──────────────────────────────────────────────

export const GetAllSavedparticipantsApi = (
  navigate,
  t,
  Data,
  routePath,
  object,
) => {
  const { flag } = object;
  return async (dispatch) => {
    dispatch(showAllMeetingParticipantsInit());
    const form = new FormData();
    form.append("RequestMethod", getAllSavedParticipants.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    await axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            GetAllSavedparticipantsApi(navigate, t, Data, routePath, object),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Participants fetched successfully
              Meeting_MeetingServiceManager_GetAllMeetingParticipants_01:
                () => {
                  dispatch(
                    showAllMeetingParticipantsSuccess(
                      response.data.responseResult.meetingParticipants,
                      "",
                      flag,
                    ),
                  );
                  dispatch(
                    showAllMeetingParticipantsIsPublishedSuccess(
                      response.data.responseResult.isPublished,
                      "",
                      flag,
                    ),
                  );
                  dispatch(
                    showAllMeetingParticipantsAllowrsvp(
                      response.data.responseResult.allowRSVP,
                      "",
                      flag,
                    ),
                  );
                },
              // _02: No participants — still update isPublished and allowRSVP
              Meeting_MeetingServiceManager_GetAllMeetingParticipants_02:
                () => {
                  dispatch(showAllMeetingParticipantsFailed(""));
                  dispatch(
                    showAllMeetingParticipantsIsPublishedSuccess(
                      response.data.responseResult.isPublished,
                      "",
                      flag,
                    ),
                  );
                  dispatch(
                    showAllMeetingParticipantsAllowrsvp(
                      response.data.responseResult.allowRSVP,
                      "",
                      flag,
                    ),
                  );
                },
              // _03: Server-side failure
              Meeting_MeetingServiceManager_GetAllMeetingParticipants_03: () =>
                dispatch(
                  showAllMeetingParticipantsFailed(t("Something-went-wrong")),
                ),
              default: () =>
                dispatch(
                  showAllMeetingParticipantsFailed(t("Something-went-wrong")),
                ),
            });
          } else {
            dispatch(
              showAllMeetingParticipantsFailed(t("Something-went-wrong")),
            );
          }
        } else {
          dispatch(showAllMeetingParticipantsFailed(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("GetAllSavedparticipantsApi:", error);
        dispatch(showAllMeetingParticipantsFailed(t("Something-went-wrong")));
      });
  };
};

// ─── Save Meeting Organizers ─────────────────────────────────────────────────

const saveMeetingOrganizers_init = () => ({
  type: actions.SAVE_MEETINGORGANIZERS_INIT,
});

const saveMeetingOrganizers_success = (response, message) => ({
  type: actions.SAVE_MEETINGORGANIZERS_SUCCESS,
  response,
  message,
});

const saveMeetingOrganizers_fail = (message) => ({
  type: actions.SAVE_MEETINGORGANIZERS_FAIL,
  message,
});

// ─── Save Meeting Organizers ─────────────────────────────────────────────────

export const SaveMeetingOrganizersApi = (
  navigate,
  t,
  Data,
  routePath,
  object,
) => {
  const meetingId =
    store.getState().NewMeetingreducer?.currentMeetingInfo.meetingID;

  return async (dispatch) => {
    dispatch(saveMeetingOrganizers_init());
    const form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", saveMeetingOrganizers.RequestMethod);

    await axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            SaveMeetingOrganizersApi(navigate, t, Data, routePath, object),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Organizers saved — refresh the organizers list
              Meeting_MeetingServiceManager_SaveMeetingOrganizers_01:
                async () => {
                  await dispatch(
                    saveMeetingOrganizers_success(
                      response.data.responseResult,
                      t("Organizers-saved-successfully"),
                    ),
                  );
                  dispatch(
                    GetAllMeetingOrganizersApi(
                      navigate,
                      t,
                      { MeetingID: meetingId },
                      "listOfOrganizers",
                      {},
                    ),
                  );
                },
              // _02: Failed to save
              Meeting_MeetingServiceManager_SaveMeetingOrganizers_02: () =>
                dispatch(
                  saveMeetingOrganizers_fail(
                    t("Organizers-not-saved-successfully"),
                  ),
                ),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_SaveMeetingOrganizers_03: () =>
                dispatch(saveMeetingOrganizers_fail(t("Something-went-wrong"))),
              default: () =>
                dispatch(saveMeetingOrganizers_fail(t("Something-went-wrong"))),
            });
          } else {
            dispatch(saveMeetingOrganizers_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveMeetingOrganizers_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("SaveMeetingOrganizersApi:", error);
        dispatch(saveMeetingOrganizers_fail(t("Something-went-wrong")));
      });
  };
};

// ─── Get All Meeting Organizers ──────────────────────────────────────────────

const getAllMeetingOrganizers_init = () => ({
  type: actions.GETALLMEETINGORGANIZERS_INIT,
});

const getAllMeetingOrganizers_success = (response, message) => ({
  type: actions.GETALLMEETINGORGANIZERS_SUCCESS,
  response,
  message,
});

const getAllMeetingOrganizers_fail = (message) => ({
  type: actions.GETALLMEETINGORGANIZERS_FAIL,
  message,
});

// ─── Get All Meeting Organizers ──────────────────────────────────────────────

export const GetAllMeetingOrganizersApi = (
  navigate,
  t,
  Data,
  routePath,
  object,
) => {
  return (dispatch) => {
    dispatch(getAllMeetingOrganizers_init());
    const form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllMeetingOrganizers.RequestMethod);

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            GetAllMeetingOrganizersApi(navigate, t, Data, routePath, object),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Fetched successfully
              Meeting_MeetingServiceManager_GetAllMeetingOrganizers_01: () =>
                dispatch(
                  getAllMeetingOrganizers_success(
                    response.data.responseResult,
                    "",
                  ),
                ),
              // _02: No records found
              Meeting_MeetingServiceManager_GetAllMeetingOrganizers_02: () =>
                dispatch(getAllMeetingOrganizers_fail(t("No-records-found"))),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_GetAllMeetingOrganizers_03: () =>
                dispatch(
                  getAllMeetingOrganizers_fail(t("Something-went-wrong")),
                ),
              default: () =>
                dispatch(
                  getAllMeetingOrganizers_fail(t("Something-went-wrong")),
                ),
            });
          } else {
            dispatch(getAllMeetingOrganizers_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAllMeetingOrganizers_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("GetAllMeetingOrganizersApi:", error);
        dispatch(getAllMeetingOrganizers_fail(t("Something-went-wrong")));
      });
  };
};

// ─── Save Agenda Contributors ────────────────────────────────────────────────

const saveAgendaContributors_init = () => ({
  type: actions.SAVE_AGENDACONTRIBUTORS_INIT,
});

const saveAgendaContributors_success = (message) => ({
  type: actions.SAVE_AGENDACONTRIBUTORS_SUCCESS,
  message,
});

const saveAgendaContributors_fail = (message) => ({
  type: actions.SAVE_AGENDACONTRIBUTORS_FAIL,
  message,
});

// ─── Save Agenda Contributors ────────────────────────────────────────────────

export const saveAgendaContributorsApi = (
  navigate,
  t,
  data,
  routePath,
  object,
) => {
  return (dispatch) => {
    dispatch(saveAgendaContributors_init());
    const form = new FormData();
    form.append("RequestMethod", saveAgendaContributorsRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            saveAgendaContributorsApi(navigate, t, data, routePath, object),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Contributors saved — refresh the list
              Meeting_MeetingServiceManager_SaveAgendaContributors_01: () => {
                switch (routePath) {
                  case "saveAndUpdateAgendaContributor": {
                    const { flag } = object;
                    const meetingId =
                      store.getState().NewMeetingreducer?.currentMeetingInfo
                        .meetingID;
                    dispatch(
                      saveAgendaContributors_success(
                        flag === 1
                          ? t("Agenda-contributor-updated")
                          : t("Agenda-contributor-added"),
                      ),
                    );
                    dispatch(
                      getAllAgendaContributorsApi(
                        navigate,
                        t,
                        {
                          MeetingID:
                            meetingId !== null && meetingId !== undefined
                              ? Number(meetingId)
                              : 0,
                        },
                        "",
                        {},
                      ),
                    );
                    break;
                  }
                  default:
                    break;
                }
              },
              // _02: No record inserted
              Meeting_MeetingServiceManager_SaveAgendaContributors_02: () =>
                dispatch(saveAgendaContributors_fail(t("No-record-inserted"))),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_SaveAgendaContributors_03: () =>
                dispatch(
                  saveAgendaContributors_fail(t("Something-went-wrong")),
                ),
              default: () =>
                dispatch(
                  saveAgendaContributors_fail(t("Something-went-wrong")),
                ),
            });
          } else {
            dispatch(saveAgendaContributors_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveAgendaContributors_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("saveAgendaContributorsApi:", error);
        dispatch(saveAgendaContributors_fail(t("Something-went-wrong")));
      });
  };
};

// ─── Get All Agenda Contributors ─────────────────────────────────────────────

const getAllAgendaContributor_init = () => ({
  type: actions.GET_ALL_AGENDACONTRIBUTOR_INIT,
});

const getAllAgendaContributor_success = (response, message) => ({
  type: actions.GET_ALL_AGENDACONTRIBUTOR_SUCCESS,
  response,
  message,
});

const getAllAgendaContributor_isPublished_success = (response) => ({
  type: actions.GET_ALL_AGENDACONTRIBUTOR_ISPUBLISHED_SUCCESS,
  response,
});

const getAllAgendaContributor_allowRSVP = (response) => ({
  type: actions.GET_ALL_AGENDACONTRIBUTOR_ALLOWRSVP,
  response,
});

const getAllAgendaContributor_fail = (message) => ({
  type: actions.GET_ALL_AGENDACONTRIBUTOR_FAIL,
  message,
});

// ─── Get All Agenda Contributors ─────────────────────────────────────────────

export const getAllAgendaContributorsApi = (
  navigate,
  t,
  data,
  routePath,
  object,
) => {
  return (dispatch) => {
    dispatch(getAllAgendaContributor_init());
    const form = new FormData();
    form.append("RequestMethod", getAllAgendaContributorRM.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getAllAgendaContributorsApi(navigate, t, data, routePath, object),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Contributors fetched — also update isPublished and allowRSVP
              Meeting_MeetingServiceManager_GetAllMeetingAgendaContributors_01:
                () => {
                  dispatch(
                    getAllAgendaContributor_success(
                      response.data.responseResult.meetingAgendaContributors,
                      "",
                    ),
                  );
                  dispatch(
                    getAllAgendaContributor_isPublished_success(
                      response.data.responseResult.isPublished,
                    ),
                  );
                  dispatch(
                    getAllAgendaContributor_allowRSVP(
                      response.data.responseResult.allowRSVP,
                    ),
                  );
                },
              // _02: No contributors — still update isPublished and allowRSVP
              Meeting_MeetingServiceManager_GetAllMeetingAgendaContributors_02:
                () => {
                  dispatch(getAllAgendaContributor_fail(""));
                  dispatch(
                    getAllAgendaContributor_isPublished_success(
                      response.data.responseResult.isPublished,
                    ),
                  );
                  dispatch(
                    getAllAgendaContributor_allowRSVP(
                      response.data.responseResult.allowRSVP,
                    ),
                  );
                },
              // _03: Server-side failure
              Meeting_MeetingServiceManager_GetAllMeetingAgendaContributors_03:
                () =>
                  dispatch(
                    getAllAgendaContributor_fail(t("Something-went-wrong")),
                  ),
              default: () =>
                dispatch(
                  getAllAgendaContributor_fail(t("Something-went-wrong")),
                ),
            });
          } else {
            dispatch(getAllAgendaContributor_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAllAgendaContributor_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("getAllAgendaContributorsApi:", error);
        dispatch(getAllAgendaContributor_fail(t("Something-went-wrong")));
      });
  };
};
// ─── Get Advance Meeting Agenda by Meeting ID ────────────────────────────────

const getAdvanceMeetingAgendabyMeetingID_init = () => ({
  type: actions.GET_ADVANCEMEETINGAGENDABYMEETINGID_INIT,
});

const getAdvanceMeetingAgendabyMeetingID_success = (data, message) => ({
  type: actions.GET_ADVANCEMEETINGAGENDABYMEETINGID_SUCCESS,
  response: data,
  message,
});

const getAdvanceMeetingAgendabyMeetingID_fail = (message) => ({
  type: actions.GET_ADVANCEMEETINGAGENDABYMEETINGID_FAIL,
  message,
});

// ─── Get Advance Meeting Agenda by Meeting ID ────────────────────────────────

export const GetAdvanceMeetingAgendabyMeetingIdApi = (
  navigate,
  t,
  Data,
  routePath,
  object,
) => {
  return (dispatch) => {
    dispatch(getAdvanceMeetingAgendabyMeetingID_init());
    const form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      getAdvanceMeetingAgendabyMeetingID.RequestMethod,
    );

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            GetAdvanceMeetingAgendabyMeetingIdApi(
              navigate,
              t,
              Data,
              routePath,
              object,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Agenda fetched — optionally fetch rights if flag === 1
              Meeting_MeetingServiceManager_GetAdvanceMeetingAgendabyMeetingID_01:
                () => {
                  const { flag, id } = object ?? {};
                  if (flag === 1) {
                    dispatch(
                      GetAllUserAgendaRightsApi(
                        navigate,
                        t,
                        { AgendaID: id },
                        "",
                        {},
                      ),
                    );
                  }
                  dispatch(
                    getAdvanceMeetingAgendabyMeetingID_success(
                      response.data.responseResult,
                      "",
                    ),
                  );
                },
              // _02: No records found
              Meeting_MeetingServiceManager_GetAdvanceMeetingAgendabyMeetingID_02:
                () =>
                  dispatch(
                    getAdvanceMeetingAgendabyMeetingID_fail(
                      t("No-records-found"),
                    ),
                  ),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_GetAdvanceMeetingAgendabyMeetingID_03:
                () =>
                  dispatch(
                    getAdvanceMeetingAgendabyMeetingID_fail(
                      t("Something-went-wrong"),
                    ),
                  ),
              default: () =>
                dispatch(
                  getAdvanceMeetingAgendabyMeetingID_fail(
                    t("Something-went-wrong"),
                  ),
                ),
            });
          } else {
            dispatch(
              getAdvanceMeetingAgendabyMeetingID_fail(
                t("Something-went-wrong"),
              ),
            );
          }
        } else {
          dispatch(
            getAdvanceMeetingAgendabyMeetingID_fail(t("Something-went-wrong")),
          );
        }
      })
      .catch((error) => {
        console.error("GetAdvanceMeetingAgendabyMeetingIdApi:", error);
        dispatch(
          getAdvanceMeetingAgendabyMeetingID_fail(t("Something-went-wrong")),
        );
      });
  };
};

// ─── Get All User Agenda Rights ──────────────────────────────────────────────

const showGetAllUserAgendaRightsInit = () => ({
  type: actions.GET_ALL_AGENDA_RIGHTS_INIT,
});

const showGetAllUserAgendaRightsSuccess = (response, message) => ({
  type: actions.GET_ALL_AGENDA_RIGHTS_SUCCESS,
  response,
  message,
});

const showGetAllUserAgendaRightsFailed = (message) => ({
  type: actions.GET_ALL_AGENDA_RIGHTS_FAILED,
  message,
});

// ─── Get All User Agenda Rights ──────────────────────────────────────────────

export const GetAllUserAgendaRightsApi = (
  navigate,
  t,
  Data,
  routePath,
  object,
) => {
  return (dispatch) => {
    dispatch(showGetAllUserAgendaRightsInit());
    const form = new FormData();
    form.append("RequestMethod", GetAllUserAgendaRights.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            GetAllUserAgendaRightsApi(navigate, t, Data, routePath, object),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Rights fetched successfully
              Meeting_MeetingServiceManager_GetAllUserAgendaRights_01: () =>
                dispatch(
                  showGetAllUserAgendaRightsSuccess(
                    response.data.responseResult,
                    "",
                  ),
                ),
              // _02: No record found
              Meeting_MeetingServiceManager_GetAllUserAgendaRights_02: () =>
                dispatch(
                  showGetAllUserAgendaRightsFailed(t("No-record-found")),
                ),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_GetAllUserAgendaRights_03: () =>
                dispatch(
                  showGetAllUserAgendaRightsFailed(t("Something-went-wrong")),
                ),
              default: () =>
                dispatch(
                  showGetAllUserAgendaRightsFailed(t("Something-went-wrong")),
                ),
            });
          } else {
            dispatch(
              showGetAllUserAgendaRightsFailed(t("Something-went-wrong")),
            );
          }
        } else {
          dispatch(showGetAllUserAgendaRightsFailed(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("GetAllUserAgendaRightsApi:", error);
        dispatch(showGetAllUserAgendaRightsFailed(t("Something-went-wrong")));
      });
  };
};

// ─── Upload Documents Meeting Agenda ────────────────────────────────────────

const uploadDocument_init = () => ({
  type: actions.UPLOAD_DOCUMENTS_AGENDA_INIT,
});

const uploadDocument_success = (response, message) => ({
  type: actions.UPLOAD_DOCUMENTS_AGENDA_SUCCESS,
  response,
  message,
});

const uploadDocument_fail = (message) => ({
  type: actions.UPLOAD_DOCUMENTS_AGENDA_FAIL,
  message,
});

// ─── Upload Documents ────────────────────────────────────────────────────────

export const UploadDocumentsMeetingAgendaApi = (
  navigate,
  t,
  data,
  routePath,
  object,
) => {
  return async (dispatch) => {
    dispatch(uploadDocument_init());
    try {
      const creatorID = localStorage.getItem("userID");
      const organizationID = localStorage.getItem("organizationID");
      const form = new FormData();
      form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
      form.append("RequestData", JSON.stringify(data));
      form.append("File", data);

      const response = await axiosInstance.post(dataRoomApi, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(
          UploadDocumentsMeetingAgendaApi(navigate, t, data, routePath, object),
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          const responseMessage =
            response.data.responseResult.responseMessage.toLowerCase();

          switchOnMessage(responseMessage, {
            // _01: Uploaded — push file metadata into caller's array
            DataRoom_DataRoomServiceManager_UploadDocuments_01: () => {
              switch (routePath) {
                case "uploadDocumentsFromAgenda":
                  const { newfile } = object;
                  newfile.push({
                    DisplayFileName:
                      response.data.responseResult.displayFileName,
                    DiskusFileNameString:
                      response.data.responseResult.diskusFileName,
                    ShareAbleLink: response.data.responseResult.shareAbleLink,
                    FK_UserID: JSON.parse(creatorID),
                    FK_OrganizationID: JSON.parse(organizationID),
                    FileSize: Number(
                      response.data.responseResult.fileSizeOnDisk,
                    ),
                    FileSizeOnDisk: Number(
                      response.data.responseResult.fileSize,
                    ),
                  });

                  break;

                default:
                  break;
              }
            },
            // _02: Failed to update document
            DataRoom_DataRoomServiceManager_UploadDocuments_02: () =>
              dispatch(uploadDocument_fail(t("Failed-to-update-document"))),
            // _03: intentionally unhandled
          });
        } else {
          dispatch(uploadDocument_fail(t("Something-went-wrong")));
        }
      } else {
        dispatch(uploadDocument_fail(t("Something-went-wrong")));
      }
    } catch (error) {
      console.error("UploadDocumentsMeetingAgendaApi:", error);
      dispatch(uploadDocument_fail(t("Something-went-wrong")));
    }
  };
};
// ─── Save Meeting Agenda Files ───────────────────────────────────────────────

const saveFiles_init = () => ({
  type: actions.SAVEFILES_AGENDA_INIT,
});

const saveFiles_success = (response, message) => ({
  type: actions.SAVEFILES_AGENDA_SUCCESS,
  response,
  message,
});

const saveFiles_fail = (message) => ({
  type: actions.SAVEFILES_AGENDA_FAIL,
  message,
});

// ─── Save Meeting Agenda Files ───────────────────────────────────────────────

export const SaveMeetingAgendaFilesApi = (
  navigate,
  t,
  data,
  routePath,
  object,
) => {
  const { folderID, newFolder } = object;
  const createrID = localStorage.getItem("userID");
  const Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: data,
    UserID: JSON.parse(createrID),
    Type: 0,
  };

  return async (dispatch) => {
    dispatch(saveFiles_init());
    const form = new FormData();
    form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    await axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            SaveMeetingAgendaFilesApi(navigate, t, data, routePath, object),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Files saved — push file IDs into caller's array
              DataRoom_DataRoomServiceManager_SaveFiles_01: () => {
                switch (routePath) {
                  case "saveFilesFromAgenda":
                    response.data.responseResult.fileID.forEach((newFileID) => {
                      newFolder.push({
                        pK_FileID: newFileID.pK_FileID,
                        displayAttachmentName: newFileID.displayFileName,
                      });
                    });
                    break;

                  default:
                    break;
                }
              },
              // _02: Failed to save any file
              DataRoom_DataRoomServiceManager_SaveFiles_02: () =>
                dispatch(saveFiles_fail(t("Failed-to-save-any-file"))),
              // _03: Server-side failure
              DataRoom_DataRoomServiceManager_SaveFiles_03: () =>
                dispatch(saveFiles_fail(t("Something-went-wrong"))),
              default: () =>
                dispatch(saveFiles_fail(t("Something-went-wrong"))),
            });
          } else {
            dispatch(saveFiles_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveFiles_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("SaveMeetingAgendaFilesApi:", error);
        dispatch(saveFiles_fail(t("Something-went-wrong")));
      });
  };
};
const addUpdateAdvanceMeetingAgenda_init = () => {
  return {
    type: actions.SAVEUPDATE_ADVANCEMEETINGAGENDA_INIT,
  };
};
const addUpdateAdvanceMeetingAgenda_success = (response, message) => {
  return {
    type: actions.SAVEUPDATE_ADVANCEMEETINGAGENDA_SUCCESS,
    response: response,
    message: message,
  };
};
const addUpdateAdvanceMeetingAgenda_fail = (message) => {
  return {
    type: actions.SAVEUPDATE_ADVANCEMEETINGAGENDA_FAIL,
    message: message,
  };
};
// ─── Add/Update Advance Meeting Agenda ───────────────────────────────────────

export const AddUpdateAdvanceMeetingAgendaApi = (
  navigate,
  t,
  Data,
  routePath,
  object,
) => {
  const {
    currentMeeting,
    flag,
    publishMeetingData,
    setEditorRole,
    setAdvanceMeetingModalID,
    setDataroomMapFolderId,
    setSceduleMeeting,
    setPublishState,
    setCalendarViewModal,
    setMeetingMaterial,
    setAgenda,
  } = object;

  const getMeetingData = { MeetingID: currentMeeting };

  return (dispatch) => {
    dispatch(addUpdateAdvanceMeetingAgenda_init());
    const form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", addUpdateAdvanceMeetingAgenda.RequestMethod);

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            AddUpdateAdvanceMeetingAgendaApi(
              navigate,
              t,
              Data,
              routePath,
              object,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Agenda saved — replace IDs, save documents, then route
              Meeting_MeetingServiceManager_AddUpdateAdvanceMeetingAgenda_01:
                async () => {
                  dispatch(
                    addUpdateAdvanceMeetingAgenda_success(
                      response.data.responseResult,
                      t("Record-saved"),
                    ),
                  );
                  const meetingId =
                    store.getState().NewMeetingreducer?.currentMeetingInfo
                      .meetingID;
                  const saveDocumentsData = Data;
                  const agendaList = response.data.responseResult.agendaIds;

                  const replaceIDs = (documents) => {
                    documents.forEach((doc) => {
                      const mainMatch = agendaList.find(
                        (item) => item.frontendid === doc.ID,
                      );
                      if (mainMatch) doc.ID = mainMatch.databaseID;
                      doc.SubAgenda.forEach((subAgenda) => {
                        const subMatch = agendaList.find(
                          (item) => item.frontendid === subAgenda.SubAgendaID,
                        );
                        if (subMatch)
                          subAgenda.SubAgendaID = subMatch.databaseID;
                      });
                    });
                  };

                  replaceIDs(saveDocumentsData.AgendaList);

                  const newUpdateFileList = {
                    MeetingID: saveDocumentsData.MeetingID,
                    UpdateFileList: [],
                  };

                  saveDocumentsData.AgendaList.forEach((agendas) => {
                    const agendaID = agendas.ID;
                    const subAgendaID =
                      agendas.SubAgenda.length > 0
                        ? agendas.SubAgenda[0].SubAgendaID
                        : null;
                    const agendaFiles = agendas.Files.map((file) => ({
                      PK_FileID: Number(file.OriginalAttachmentName),
                    }));
                    const subAgendaFiles =
                      agendas.SubAgenda.length > 0
                        ? agendas.SubAgenda[0].Subfiles.map((file) => ({
                            PK_FileID: parseInt(file.OriginalAttachmentName),
                          }))
                        : [];
                    if (agendaFiles.length > 0) {
                      newUpdateFileList.UpdateFileList.push({
                        AgendaID: agendaID,
                        FileIds: agendaFiles,
                      });
                    }
                    if (subAgendaID && subAgendaFiles.length > 0) {
                      newUpdateFileList.UpdateFileList.push({
                        AgendaID: subAgendaID,
                        FileIds: subAgendaFiles,
                      });
                    }
                  });

                  await dispatch(
                    SaveMeetingDocuments(
                      navigate,
                      t,
                      newUpdateFileList,
                      "",
                      {},
                    ),
                  );

                  switch (routePath) {
                    case "saveMeetingAgenda":
                      await dispatch(
                        GetAdvanceMeetingAgendabyMeetingIdApi(
                          navigate,
                          t,
                          {
                            MeetingID: meetingId,
                          },
                          "saveMeetingAgenda",
                          {},
                        ),
                      );
                      dispatch(setCreateEditTab("meetingMaterial"));
                      break;
                    case "saveAgendaAndPublishMeeting": {
                      const meetingId =
                        store.getState().NewMeetingreducer?.currentMeetingInfo
                          ?.meetingID;
                      dispatch(
                        UpdateMeetingStatusApi(
                          navigate,
                          t,
                          {
                            MeetingID: meetingId,
                            StatusID: 1,
                          },
                          "publishMeetingFromAgendaTab",
                          {
                            route: 5,
                            publishMeetingData,
                            setEditorRole,
                            setAdvanceMeetingModalID,
                            setDataroomMapFolderId,
                            setSceduleMeeting,
                            setPublishState,
                            setCalendarViewModal,
                          },
                        ),
                      );
                      break;
                    }
                    default:
                      break;
                  }

                  if (flag === 1) {
                    await dispatch(
                      GetAdvanceMeetingAgendabyMeetingIdApi(
                        navigate,
                        t,
                        getMeetingData,
                        "",
                        {},
                      ),
                    );
                    setMeetingMaterial(true);
                    setAgenda(false);
                  } else if (flag === 2) {
                    dispatch(
                      UpdateMeetingStatusApi(
                        navigate,
                        t,
                        {
                          MeetingID: currentMeeting,
                          StatusID: 9,
                        },
                        "endMeeting",
                        {
                          route: 4,
                          publishMeetingData,
                          setEditorRole,
                          setAdvanceMeetingModalID,
                          setDataroomMapFolderId,
                          setSceduleMeeting,
                          setPublishState,
                          setCalendarViewModal,
                        },
                      ),
                    );
                    setSceduleMeeting(false);
                    setMeetingMaterial(false);
                    setAgenda(false);
                  }
                },
              // _02: No records found
              Meeting_MeetingServiceManager_AddUpdateAdvanceMeetingAgenda_02:
                () =>
                  dispatch(
                    addUpdateAdvanceMeetingAgenda_fail(t("No-records-found")),
                  ),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_AddUpdateAdvanceMeetingAgenda_03:
                () =>
                  dispatch(
                    addUpdateAdvanceMeetingAgenda_fail(
                      t("Something-went-wrong"),
                    ),
                  ),
              default: () =>
                dispatch(
                  addUpdateAdvanceMeetingAgenda_fail(t("Something-went-wrong")),
                ),
            });
          } else {
            dispatch(
              addUpdateAdvanceMeetingAgenda_fail(t("Something-went-wrong")),
            );
          }
        } else {
          dispatch(
            addUpdateAdvanceMeetingAgenda_fail(t("Something-went-wrong")),
          );
        }
      })
      .catch((error) => {
        console.error("AddUpdateAdvanceMeetingAgendaApi:", error);
        dispatch(addUpdateAdvanceMeetingAgenda_fail(t("Something-went-wrong")));
      });
  };
};

// Upload Documents Init
const saveMeetingDocuments_init = () => {
  return {
    type: actions.SAVE_DOCUMENTS_AGENDA_INIT,
  };
};

// Upload Documents Success
const saveMeetingDocuments_success = (response, message) => {
  return {
    type: actions.SAVE_DOCUMENTS_AGENDA_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const saveMeetingDocuments_fail = (message) => {
  return {
    type: actions.SAVE_DOCUMENTS_AGENDA_FAIL,
    message: message,
  };
};

// ─── Save Meeting Documents ──────────────────────────────────────────────────

const SaveMeetingDocuments = (navigate, t, data, routePath, object) => {
  return async (dispatch) => {
    dispatch(saveMeetingDocuments_init());
    const form = new FormData();
    form.append("RequestMethod", saveMeetingDocuments.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    await axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SaveMeetingDocuments(navigate, t, data, routePath, object));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Documents saved — trigger post-save action
              DataRoom_DataRoomManager_SaveMeetingDocuments_01: () => {
                dispatch(
                  saveMeetingDocuments_success(
                    response.data.responseResult,
                    "",
                  ),
                );
                const { setShow } = object;
                const createrID = localStorage.getItem("userID");
                if (setShow) setShow(false);

                switch (routePath) {
                  case "checkFlag4": {
                    const meetingpageRow =
                      localStorage.getItem("MeetingPageRows");
                    const meetingPageCurrent =
                      localStorage.getItem("MeetingPageCurrent") || 1;
                    dispatch(
                      searchNewUserMeeting(
                        navigate,
                        t,
                        {
                          Date: "",
                          Title: "",
                          HostName: "",
                          UserID: Number(createrID),
                          PageNumber: Number(meetingPageCurrent),
                          Length: Number(meetingpageRow)
                            ? Number(meetingpageRow)
                            : 50,
                          PublishedMeetings:
                            localStorage.getItem("MeetingCurrentView") !==
                              null &&
                            Number(
                              localStorage.getItem("MeetingCurrentView"),
                            ) === 1,
                          ProposedMeetings:
                            localStorage.getItem("MeetingCurrentView") !==
                              null &&
                            Number(
                              localStorage.getItem("MeetingCurrentView"),
                            ) === 2,
                        },
                        "",
                        {},
                      ),
                    );
                    break;
                  }
                  case "checkFlag5": {
                    const ViewCommitteeID =
                      localStorage.getItem("ViewCommitteeID");
                    dispatch(
                      setMeetingbyCommitteeIdApi(navigate, t, {
                        MeetingID: Number(data.MeetingID),
                        CommitteeID: Number(ViewCommitteeID),
                      }),
                    );
                    break;
                  }
                  case "checkFlag6": {
                    const ViewCommitteeID =
                      localStorage.getItem("ViewCommitteeID");
                    dispatch(
                      getMeetingByCommitteeIdApi(navigate, t, {
                        CommitteeID: Number(ViewCommitteeID),
                        Date: "",
                        Title: "",
                        HostName: "",
                        UserID: Number(createrID),
                        PageNumber: 1,
                        Length: 50,
                        PublishedMeetings: true,
                      }),
                    );
                    break;
                  }
                  case "checkFlag7": {
                    const ViewGroupID = localStorage.getItem("ViewGroupID");
                    dispatch(
                      setMeetingByGroupIdApi(navigate, t, {
                        MeetingID: Number(data.MeetingID),
                        GroupID: Number(ViewGroupID),
                      }),
                    );
                    break;
                  }
                  case "checkFlag8": {
                    const ViewGroupID = localStorage.getItem("ViewGroupID");
                    dispatch(
                      getMeetingbyGroupIdApi(navigate, t, {
                        GroupID: Number(ViewGroupID),
                        Date: "",
                        Title: "",
                        HostName: "",
                        UserID: Number(createrID),
                        PageNumber: 1,
                        Length: 50,
                        PublishedMeetings: true,
                      }),
                    );
                    break;
                  }
                  default:
                    break;
                }
              },
              // _02: Server-side failure
              DataRoom_DataRoomManager_SaveMeetingDocuments_02: () =>
                dispatch(saveMeetingDocuments_fail(t("Something-went-wrong"))),
              default: () =>
                dispatch(saveMeetingDocuments_fail(t("Something-went-wrong"))),
            });
          } else {
            dispatch(saveMeetingDocuments_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveMeetingDocuments_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("SaveMeetingDocuments:", error);
        dispatch(saveMeetingDocuments_fail(t("Something-went-wrong")));
      });
  };
};

// save meeting organizers Init
const updateOrganizerMeetingStatus_init = () => {
  return {
    type: actions.UPDATE_ORGANIZERSMEETING_INIT,
  };
};

// save meeting organizers success
const updateOrganizerMeetingStatus_success = (response, message) => {
  return {
    type: actions.UPDATE_ORGANIZERSMEETING_SUCCESS,
    response: response,
    message: message,
  };
};

// save meeting organizers fail
const updateOrganizerMeetingStatus_fail = (message) => {
  return {
    type: actions.UPDATE_ORGANIZERSMEETING_FAIL,
    message: message,
  };
};

// ─── Update Meeting Status ───────────────────────────────────────────────────

export const UpdateMeetingStatusApi = (
  navigate,
  t,
  Data,
  routePath,
  object,
) => {
  const {
    route,
    setEditorRole,
    setAdvanceMeetingModalID,
    setDataroomMapFolderId,
    setSceduleMeeting,
    setViewFlag,
    setEditFlag,
    setCalendarViewModal,
    setViewAdvanceMeetingModal,
    setEndMeetingConfirmationModal,
    isQuickMeeting,
    videoCallURL,
  } = object;

  const leaveMeetingData = {
    VideoCallURL: videoCallURL,
    FK_MDID: Number(Data.MeetingID),
    DateTime: getCurrentDateTimeUTC(),
  };

  return async (dispatch) => {
    dispatch(updateOrganizerMeetingStatus_init());
    const form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", meetingStatusUpdate.RequestMethod);

    await axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            UpdateMeetingStatusApi(navigate, t, Data, routePath, object),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Status updated — execute route-based post-update logic
              Meeting_MeetingServiceManager_MeetingStatusUpdate_01:
                async () => {
                  try {
                    await dispatch(
                      updateOrganizerMeetingStatus_success(
                        response.data.responseResult,
                        route === 5
                          ? t("Meeting-published-successfully")
                          : (route === 4 ||
                                route === 6 ||
                                route === 7 ||
                                route === 11) &&
                              Data.StatusID === 10
                            ? t("Meeting-started-successfully")
                            : (route === 4 ||
                                  route === 6 ||
                                  route === 7 ||
                                  route === 12) &&
                                Data.StatusID === 9
                              ? t("Meeting-ended-successfully")
                              : "",
                      ),
                    );

                    switch (routePath) {
                      case "publishMeetingFromParticipant":
                      case "publishMeetingFromAgendaContributor":
                      case "publishMeetingFromOrganizer":
                      case "PublishMeetingFromMeetingMaterial": {
                        dispatch(toggleCreateEditMeetingModal(false));
                        dispatch(resetCreateEditTabs());
                        const currentView =
                          localStorage.getItem("MeetingCurrentView");
                        const meetingpageRow =
                          localStorage.getItem("MeetingPageRows");
                        const meetingPageCurrent =
                          localStorage.getItem("MeetingPageCurrent");
                        const userID = localStorage.getItem("userID");
                        await dispatch(
                          searchNewUserMeeting(
                            navigate,
                            {
                              Date: "",
                              Title: "",
                              HostName: "",
                              UserID: Number(userID),
                              PageNumber:
                                meetingPageCurrent !== null
                                  ? Number(meetingPageCurrent)
                                  : 1,
                              Length:
                                meetingpageRow !== null
                                  ? Number(meetingpageRow)
                                  : 30,
                              PublishedMeetings:
                                currentView && Number(currentView) === 1,
                              ProposedMeetings:
                                currentView && Number(currentView) === 2,
                            },
                            t,

                            "",
                            {},
                          ),
                        );
                        break;
                      }
                      case "startMeetingFromMainListing": {
                        dispatch(toggleViewMeetingModal(true));
                        dispatch(setViewTab("agendaViewer"));
                        const { record } = object;
                        dispatch(
                          joinMeetingApi(
                            navigate,
                            t,
                            {
                              FK_MDID: Number(record.pK_MDID),
                              DateTime: getCurrentDateTimeUTC(),
                              VideoCallURL: record.videoCallURL,
                            },
                            "startMeetingFromMainListing",
                            object,
                          ),
                        );
                        // here we need to call Join Meeting API
                        break;
                      }
                      case 3:
                        await dispatch(
                          getMeetingDetailsByMeetingIdApi(
                            navigate,
                            t,
                            {
                              MeetingID: Number(Data.MeetingID),
                            },
                            "startMeeting",
                            { setSceduleMeeting, setDataroomMapFolderId },
                          ),
                        );
                        dispatch(
                          joinMeetingApi(
                            navigate,
                            t,
                            leaveMeetingData,
                            "joinFromRoute3",
                            {
                              isQuickMeeting: false,
                              setViewFlag,
                              setEditFlag,
                              setSceduleMeeting,
                              routeNo: 1,
                              setAdvanceMeetingModalID,
                              setViewAdvanceMeetingModal,
                            },
                          ),
                        );
                        break;
                      case 4:
                        if (Data.StatusID === 9) {
                          setEndMeetingConfirmationModal(false);
                        } else {
                          if (!isQuickMeeting) {
                            setAdvanceMeetingModalID(Data.MeetingID);
                            setEditorRole({
                              status: "10",
                              role: "Organizer",
                              isPrimaryOrganizer: false,
                            });
                          }
                          dispatch(
                            joinMeetingApi(
                              navigate,
                              t,
                              leaveMeetingData,
                              "joinFromRoute4",
                              {
                                isQuickMeeting: true,
                                setViewFlag,
                                setEditFlag,
                                setSceduleMeeting,
                                routeNo: 1,
                                setAdvanceMeetingModalID,
                                setViewAdvanceMeetingModal,
                              },
                            ),
                          );
                        }
                        break;
                      case 5: {
                        const currentView =
                          localStorage.getItem("MeetingCurrentView");
                        const meetingpageRow =
                          localStorage.getItem("MeetingPageRows");
                        const meetingPageCurrent =
                          localStorage.getItem("MeetingPageCurrent");
                        const userID = localStorage.getItem("userID");
                        await dispatch(
                          searchNewUserMeeting(
                            navigate,
                            t,
                            {
                              Date: "",
                              Title: "",
                              HostName: "",
                              UserID: Number(userID),
                              PageNumber:
                                meetingPageCurrent !== null
                                  ? Number(meetingPageCurrent)
                                  : 1,
                              Length:
                                meetingpageRow !== null
                                  ? Number(meetingpageRow)
                                  : 30,
                              PublishedMeetings:
                                currentView && Number(currentView) === 1,
                              ProposedMeetings:
                                currentView && Number(currentView) === 2,
                            },
                            "",
                            {},
                          ),
                        );
                        break;
                      }
                      case 6:
                        if (Data.StatusID === 10) {
                          dispatch(
                            joinMeetingApi(
                              navigate,
                              t,
                              leaveMeetingData,
                              "joinFromRoute6",
                              {
                                isQuickMeeting: true,
                                setViewFlag,
                                setEditFlag,
                                setSceduleMeeting,
                                routeNo: 1,
                                setAdvanceMeetingModalID,
                                setViewAdvanceMeetingModal,
                              },
                            ),
                          );
                        } else {
                          const ViewCommitteeID =
                            localStorage.getItem("ViewCommitteeID");
                          const userID = localStorage.getItem("userID");
                          dispatch(
                            getMeetingByCommitteeIdApi(navigate, t, {
                              CommitteeID: Number(ViewCommitteeID),
                              Date: "",
                              Title: "",
                              HostName: "",
                              UserID: Number(userID),
                              PageNumber: 1,
                              Length: 50,
                              PublishedMeetings: true,
                            }),
                          );
                        }
                        break;
                      case 7:
                        if (Data.StatusID === 10) {
                          dispatch(
                            joinMeetingApi(
                              navigate,
                              t,
                              leaveMeetingData,
                              "joinFromRoute7",
                              {
                                isQuickMeeting: true,
                                setViewFlag,
                                setEditFlag,
                                setSceduleMeeting,
                                routeNo: 1,
                                setAdvanceMeetingModalID,
                                setViewAdvanceMeetingModal,
                              },
                            ),
                          );
                        } else {
                          const ViewGroupID =
                            localStorage.getItem("ViewGroupID");
                          const userID = localStorage.getItem("userID");
                          dispatch(
                            getMeetingbyGroupIdApi(navigate, t, {
                              GroupID: Number(ViewGroupID),
                              Date: "",
                              Title: "",
                              HostName: "",
                              UserID: Number(userID),
                              PageNumber: 1,
                              Length: 50,
                              PublishedMeetings: true,
                            }),
                          );
                        }
                        break;
                      case 11:
                        if (Data.StatusID === 10) {
                          dispatch(
                            joinMeetingApi(
                              navigate,
                              t,
                              leaveMeetingData,
                              "joinFromRoute11",
                              {
                                isQuickMeeting: true,
                                setViewFlag,
                                setEditFlag,
                                setSceduleMeeting,
                                routeNo: route,
                                setAdvanceMeetingModalID,
                                setViewAdvanceMeetingModal,
                              },
                            ),
                          );
                        }
                        break;
                      default:
                        break;
                    }
                  } catch (error) {
                    console.error(
                      "UpdateMeetingStatusApi route handler:",
                      error,
                    );
                  }
                },
              // _02: Record not updated
              Meeting_MeetingServiceManager_MeetingStatusUpdate_02: () =>
                dispatch(
                  updateOrganizerMeetingStatus_fail(t("Record-not-updated")),
                ),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_MeetingStatusUpdate_03: () =>
                dispatch(
                  updateOrganizerMeetingStatus_fail(t("Something-went-wrong")),
                ),
              // _04: Agenda required
              Meeting_MeetingServiceManager_MeetingStatusUpdate_04: () =>
                dispatch(
                  updateOrganizerMeetingStatus_fail(
                    t("Add-meeting-agenda-to-publish"),
                  ),
                ),
              // _05: Organizers required
              Meeting_MeetingServiceManager_MeetingStatusUpdate_05: () =>
                dispatch(
                  updateOrganizerMeetingStatus_fail(
                    t("Add-meeting-organizers-to-publish"),
                  ),
                ),
              // _06: Participants required
              Meeting_MeetingServiceManager_MeetingStatusUpdate_06: () =>
                dispatch(
                  updateOrganizerMeetingStatus_fail(
                    t("Add-meeting-participants-to-publish"),
                  ),
                ),
              // _07: Time elapsed
              Meeting_MeetingServiceManager_MeetingStatusUpdate_07: () =>
                dispatch(
                  updateOrganizerMeetingStatus_fail(
                    t("Meeting-cannot-be-published-after-time-has-elapsed"),
                  ),
                ),
              default: () =>
                dispatch(
                  updateOrganizerMeetingStatus_fail(t("Something-went-wrong")),
                ),
            });
          } else {
            dispatch(
              updateOrganizerMeetingStatus_fail(t("Something-went-wrong")),
            );
          }
        } else {
          dispatch(
            updateOrganizerMeetingStatus_fail(t("Something-went-wrong")),
          );
        }
      })
      .catch((error) => {
        console.error("UpdateMeetingStatusApi:", error);
        dispatch(updateOrganizerMeetingStatus_fail(t("Something-went-wrong")));
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
// ─── Get Meeting Details by Meeting ID ───────────────────────────────────────

export const getMeetingDetailsByMeetingIdApi = (
  navigate,
  t,
  Data,
  routePath,
  object,
) => {
  return async (dispatch) => {
    dispatch(showGetAllMeetingDetialsInit());

    const form = new FormData();
    form.append("RequestMethod", getAllMeetingDetailsByMeetingID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    const failGeneric = () =>
      dispatch(showGetAllMeetingDetialsFailed(t("Something-went-wrong")));
    const failNoRecord = () =>
      dispatch(showGetAllMeetingDetialsFailed(t("No-record-found")));

    try {
      const response = await axiosInstance.post(meetingApi, form);
      const { responseCode, responseResult } = response.data;

      // Token expired → refresh and retry
      if (responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(
          getMeetingDetailsByMeetingIdApi(navigate, t, Data, routePath, object),
        );
      }

      if (responseCode !== 200 || !responseResult?.isExecuted) {
        return failGeneric();
      }

      const message = responseResult.responseMessage.toLowerCase();
      const details = responseResult.advanceMeetingDetails;

      switchOnMessage(message, {
        // _01: Details fetched successfully
        Meeting_MeetingServiceManager_GetAdvanceMeetingDetailsByMeetingID_01:
          async () => {
            const mappedFolderPayload = {
              MeetingID: details.meetingID,
              MeetingTitle: details.meetingTitle,
              IsUpdateFlow: true,
            };

            switch (routePath) {
              case "getMeetingDetailsFromAgendaTab": {
                dispatch(
                  CreateUpdateMeetingDataRoomMapeedFolderIdApi(
                    navigate,
                    t,
                    mappedFolderPayload,
                    "getMeetingDetailsFromAgendaTab",
                    {},
                  ),
                );
                break;
              }

              case "EditMeetingFromMainListing": {
                const { role, callFunc } = object;
                callFunc?.();

                dispatch(
                  setCreateEditTab(
                    role === "Agenda Contributor" ? "agenda" : "meetingDetails",
                  ),
                );
                dispatch(toggleCreateEditMeetingModal(true));
                dispatch(setAdvanceMeetingRoute(2));
                dispatch(
                  CreateUpdateMeetingDataRoomMapeedFolderIdApi(
                    navigate,
                    t,
                    mappedFolderPayload,
                    "EditMeetingFromMainListing",
                    {},
                  ),
                );
                break;
              }

              case "viewDetail":
              default:
                break;
            }

            dispatch(
              showGetAllMeetingDetialsSuccess(responseResult, "", false),
            );
          },

        // _02 & _03: No record / server failure
        Meeting_MeetingServiceManager_GetAdvanceMeetingDetailsByMeetingID_02:
          failNoRecord,
        Meeting_MeetingServiceManager_GetAdvanceMeetingDetailsByMeetingID_03:
          failNoRecord,

        default: failGeneric,
      });
    } catch (error) {
      console.error("getMeetingDetailsByMeetingIdApi:", error);
      failGeneric();
    }
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

// ─── Get All Meeting Types ───────────────────────────────────────────────────

export const GetAllMeetingTypesNewFunction = (navigate, t, loader) => {
  return async (dispatch) => {
    dispatch(handlegetAllMeetingTypesInit());
    const form = new FormData();
    form.append("RequestMethod", getallMeetingType.RequestMethod);
    try {
      const response = await axiosInstance.post(meetingApi, form);
      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        await dispatch(GetAllMeetingTypesNewFunction(navigate, t, loader));
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          const responseMessage =
            response.data.responseResult.responseMessage.toLowerCase();
          switchOnMessage(responseMessage, {
            // _01: Types fetched successfully
            Meeting_MeetingServiceManager_GetAllMeetingTypes_01: () =>
              dispatch(
                handlegetAllMeetingTypesSuccess(
                  response.data.responseResult,
                  "",
                  loader,
                ),
              ),
            // _02: No record found
            Meeting_MeetingServiceManager_GetAllMeetingTypes_02: () =>
              dispatch(handlegetAllMeetingTypesFailed(t("No-record-found"))),
            // _03: Server-side failure
            Meeting_MeetingServiceManager_GetAllMeetingTypes_03: () =>
              dispatch(
                handlegetAllMeetingTypesFailed(t("Something-went-wrong")),
              ),
            default: () =>
              dispatch(
                handlegetAllMeetingTypesFailed(t("Something-went-wrong")),
              ),
          });
        } else {
          dispatch(handlegetAllMeetingTypesFailed(t("Something-went-wrong")));
        }
      } else {
        dispatch(handlegetAllMeetingTypesFailed(t("Something-went-wrong")));
      }
    } catch (error) {
      console.error("GetAllMeetingTypesNewFunction:", error);
      dispatch(handlegetAllMeetingTypesFailed(t("Something-went-wrong")));
    }
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

// ─── Get All Meeting Reminder Frequency ──────────────────────────────────────

export const GetAllMeetingRemindersFrequencyApi = (navigate, t) => {
  return async (dispatch) => {
    dispatch(handlegetallReminderFrequencyInit());
    const form = new FormData();
    form.append("RequestMethod", GetMeetingNewFrequencyReminder.RequestMethod);
    try {
      const response = await axiosInstance.post(meetingApi, form);
      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        await dispatch(GetAllMeetingRemindersFrequencyApi(navigate, t));
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          const responseMessage =
            response.data.responseResult.responseMessage.toLowerCase();
          switchOnMessage(responseMessage, {
            // _01: Frequencies fetched successfully
            Meeting_MeetingServiceManager_GetMeetingReminders_01: () =>
              dispatch(
                handlegetallReminderFrequencySuccess(
                  response.data.responseResult,
                  "",
                ),
              ),
            // _02: No record found
            Meeting_MeetingServiceManager_GetMeetingReminders_02: () =>
              dispatch(
                handlegetallReminderFrequencyFailed(t("No-record-found")),
              ),
            // _03: Server-side failure
            Meeting_MeetingServiceManager_GetMeetingReminders_03: () =>
              dispatch(
                handlegetallReminderFrequencyFailed(t("Something-went-wrong")),
              ),
            default: () =>
              dispatch(
                handlegetallReminderFrequencyFailed(t("Something-went-wrong")),
              ),
          });
        } else {
          dispatch(
            handlegetallReminderFrequencyFailed(t("Something-went-wrong")),
          );
        }
      } else {
        dispatch(
          handlegetallReminderFrequencyFailed(t("Something-went-wrong")),
        );
      }
    } catch (error) {
      console.error("GetAllMeetingRemindersFrequencyApi:", error);
      dispatch(handlegetallReminderFrequencyFailed(t("Something-went-wrong")));
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

// ─── Get All Meeting Recurring ───────────────────────────────────────────────

export const GetAllMeetingRecurringApi = (navigate, t, loader) => {
  return (dispatch) => {
    dispatch(handleReucrringSInit());
    const form = new FormData();
    form.append("RequestMethod", GetAllRecurringNewMeeting.RequestMethod);
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllMeetingRecurringApi(navigate, t, loader));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();
            switchOnMessage(responseMessage, {
              // _01: Recurring factors fetched successfully
              Meeting_MeetingServiceManager_GetAllRecurringFactor_01: () =>
                dispatch(
                  handleReucrringSuccess(
                    response.data.responseResult,
                    "",
                    loader,
                  ),
                ),
              // _02: No record found
              Meeting_MeetingServiceManager_GetAllRecurringFactor_02: () =>
                dispatch(handleReucrringFailed(t("No-record-found"), loader)),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_GetAllRecurringFactor_03: () =>
                dispatch(
                  handleReucrringFailed(t("Something-went-wrong"), loader),
                ),
              default: () =>
                dispatch(
                  handleReucrringFailed(t("Something-went-wrong"), loader),
                ),
            });
          } else {
            dispatch(handleReucrringFailed(t("Something-went-wrong"), loader));
          }
        } else {
          dispatch(handleReucrringFailed(t("Something-went-wrong"), loader));
        }
      })
      .catch((error) => {
        console.error("GetAllMeetingRecurringApi:", error);
        dispatch(handleReucrringFailed(t("Something-went-wrong"), loader));
      });
  };
};

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

// ─── Join Meeting ────────────────────────────────────────────────────────────

export const joinMeetingApi = (navigate, t, Data, routePath, object) => {
  const {
    isQuickMeeting,
    setViewFlag,
    setEditFlag,
    setSceduleMeeting,
    routeNo,
    setAdvanceMeetingModalID,
    setViewAdvanceMeetingModal,
    NotificationCheckQuickMeet,
  } = object;

  return async (dispatch) => {
    await dispatch(joinMeetingInit());
    const form = new FormData();
    form.append("RequestMethod", joinMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(joinMeetingApi(navigate, t, Data, routePath, object));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Joined — set flags and handle video/presenter
              Meeting_MeetingServiceManager_JoinMeeting_01: async () => {
                dispatch(videoIconOrButtonState(false));
                localStorage.setItem("isMeeting", true);
                sessionStorage.setItem("isMeeting", true);
                localStorage.setItem("videoCallURL", Data.VideoCallURL);
                localStorage.setItem(
                  "AdvanceMeetingOpen",
                  isQuickMeeting ? false : true,
                );
                localStorage.setItem(
                  "typeOfMeeting",
                  isQuickMeeting ? "isQuickMeeting" : "isAdvanceMeeting",
                );
                localStorage.setItem(
                  "isMeetingVideoHostCheck",
                  response.data.responseResult.isMeetingVideoHost,
                );

                await dispatch(
                  joinMeetingSuccess(
                    response.data.responseResult,
                    t("Successful"),
                  ),
                );

                if (isQuickMeeting === true && routeNo !== 11) {
                  await dispatch(
                    getViewMeetingByMeetingIdApi(
                      navigate,
                      t,
                      { MeetingID: Number(Data.FK_MDID) },
                      "viewMeeting",
                      {
                        setViewFlag,
                        setEditFlag,
                        setSceduleMeeting,
                        no: routeNo,
                      },
                    ),
                  );
                }

                if (NotificationCheckQuickMeet) {
                  dispatch(
                    getViewMeetingByMeetingIdApi(
                      navigate,
                      t,
                      { MeetingID: Number(Data.FK_MDID) },
                      "viewMeeting",
                      {
                        setViewFlag,
                        setEditFlag: false,
                        setSceduleMeeting: false,
                        no: 1,
                      },
                    ),
                  );
                }

                localStorage.setItem("currentMeetingID", Data.FK_MDID);

                const activeStatusOneToOne = JSON.parse(
                  localStorage.getItem("activeCall"),
                );
                const presenterViewStatus =
                  response.data.responseResult.isPresenterViewStarted;

                if (presenterViewStatus && !activeStatusOneToOne) {
                  dispatch(
                    joinPresenterViewMainApi(navigate, t, {
                      VideoCallURL: String(Data.VideoCallURL),
                      WasInVideo: false,
                    }),
                  );
                } else if (presenterViewStatus && activeStatusOneToOne) {
                  localStorage.setItem("JoinpresenterForonetoone", true);
                  dispatch(nonMeetingVideoGlobalModal(true));
                  dispatch(presenterViewGlobalState(0, true, false, false));
                }

                // Route-specific extras (runs AFTER the normal _01 flow)
                switch (routePath) {
                  case "JoinMeetingFromListing": {
                    const { isQuickMeeting, record } = object;
                    if (isQuickMeeting) {
                      return;
                    }
                    dispatch(setViewTab("agendaViewer"));
                    dispatch(toggleViewMeetingModal(true));
                    localStorage.setItem("meetingTitle", record.title);
                    dispatch(
                      setCurrentMeetingInfo({
                        meetingID: Data.MeetingID,
                        meetingTitle: record.title,
                        // mapFolderId: 0,
                      }),
                    );
                    break;
                  }
                  case "startMeetingFromMainListing": {
                    const { record } = object;

                    dispatch(setViewTab("agendaViewer"));
                    dispatch(toggleViewMeetingModal(true));
                    localStorage.setItem("meetingTitle", record.title);
                    dispatch(
                      setCurrentMeetingInfo({
                        meetingID: Data.MeetingID,
                        meetingTitle: record.title,
                        // mapFolderId: 0,
                      }),
                    );
                    break;
                  }
                  default:
                    break;
                }
              },
              // _02: Join unsuccessful
              Meeting_MeetingServiceManager_JoinMeeting_02: () =>
                dispatch(joinMeetingFail(t("Unsuccessful"))),
              // _03: Unable to join at this time
              Meeting_MeetingServiceManager_JoinMeeting_03: () =>
                dispatch(
                  joinMeetingFail(
                    t(
                      "Unable-to-join-the-meeting-at-this-time-please-try-after-some-time",
                    ),
                  ),
                ),
              default: () =>
                dispatch(joinMeetingFail(t("Something-went-wrong"))),
            });
          } else {
            dispatch(joinMeetingFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(joinMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("joinMeetingApi:", error);
        dispatch(joinMeetingFail(t("Something-went-wrong")));
      });
  };
};

const ViewMeetingInit = () => {
  return {
    type: actions.VIEW_MEETING_INIT,
  };
};

const ViewMeetingSuccess = (response, message) => {
  return {
    type: actions.VIEW_MEETING_SUCESS,
    response: response,
    message: message,
  };
};

const ViewMeetingFail = (message) => {
  return {
    type: actions.VIEW_MEETING_FAIL,
    message: message,
  };
};

// ─── View Meeting by Meeting ID ──────────────────────────────────────────────

export const getViewMeetingByMeetingIdApi = (
  navigate,
  t,
  Data,
  routePath,
  object,
) => {
  const {
    setViewFlag,
    setEditFlag,
    setCalendarViewModal,
    no,
    setViewMeetingModal,
    setEditMeetingModal,
  } = object;

  return (dispatch) => {
    dispatch(ViewMeetingInit());
    const form = new FormData();
    form.append("RequestMethod", getMeetingByMeetingID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getViewMeetingByMeetingIdApi(navigate, t, Data, routePath, object),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            const responseMessage =
              response.data.responseResult.responseMessage.toLowerCase();

            switchOnMessage(responseMessage, {
              // _01: Meeting fetched — trigger view/edit based on `no`
              Meeting_MeetingServiceManager_GetMeetingsByMeetingID_01:
                async () => {
                  await dispatch(
                    ViewMeetingSuccess(response.data.responseResult, ""),
                  );
                  try {
                    switch (routePath) {
                      case "EditMeetingFromMainListing":
                        const { role } = object;
                        if (role === "Agenda Contributor") {
                          dispatch(setCreateEditTab("agenda"));
                        } else {
                          dispatch(setCreateEditTab("meetingDetails"));
                        }
                        dispatch(setAdvanceMeetingRoute(2));
                        dispatch(toggleCreateEditMeetingModal(true));

                        dispatch(
                          CreateUpdateMeetingDataRoomMapeedFolderIdApi(
                            navigate,
                            t,
                            {
                              MeetingID:
                                response.data.responseResult
                                  .advanceMeetingDetails.meetingID,
                              MeetingTitle:
                                response.data.responseResult
                                  .advanceMeetingDetails.meetingTitle,
                              IsUpdateFlow: true,
                            },
                            "EditMeetingFromMainListing",
                            {},
                          ),
                        );
                        break;

                      default:
                        break;
                    }
                    // switch (no) {
                    //   case 1:
                    //     setViewFlag(true);
                    //     localStorage.setItem("typeOfMeeting", "isQuickMeeting");
                    //     break;
                    //   case 2:
                    //     setEditFlag(true);
                    //     break;
                    //   case 3:
                    //   case 10:
                    //     setViewFlag(true);
                    //     setCalendarViewModal(true);
                    //     break;
                    //   case 4:
                    //     setViewMeetingModal(true);
                    //     break;
                    //   case 5:
                    //     setEditMeetingModal(true);
                    //     break;
                    //   case 6:
                    //     setViewFlag(true);
                    //     break;
                    //   default:
                    //     break;
                    // }
                  } catch (error) {
                    console.error(
                      "getViewMeetingByMeetingIdApi post-success:",
                      error,
                    );
                  }
                },
              // _02: No records found
              Meeting_MeetingServiceManager_GetMeetingsByMeetingID_02:
                async () =>
                  await dispatch(ViewMeetingFail(t("No-records-found"))),
              // _03: Server-side failure
              Meeting_MeetingServiceManager_GetMeetingsByMeetingID_03:
                async () =>
                  await dispatch(ViewMeetingFail(t("Something-went-wrong"))),
              default: async () =>
                await dispatch(ViewMeetingFail(t("Something-went-wrong"))),
            });
          } else {
            await dispatch(ViewMeetingFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(ViewMeetingFail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        console.error("getViewMeetingByMeetingIdApi:", error);
        dispatch(ViewMeetingFail(t("Something-went-wrong")));
      });
  };
};

const listOfMeetings_init = () => {
  return {
    type: actions.GET_SEARCH_NEW_MEETINGS_INIT,
  };
};
const listOfMeetings_success = (response, message) => {
  return {
    type: actions.GET_SEARCH_NEW_MEETINGS_SUCCESS,
    response: response,
    message: message,
  };
};
const listOfMeetings_fail = (message) => {
  return {
    type: actions.GET_SEARCH_NEW_MEETINGS_FAIL,
    message: message,
  };
};

export const listOfMeetingsApi = (navigate, t, Data, routePath, object) => {
  return (dispatch) => {
    dispatch(listOfMeetings_init());
    let form = new FormData();
    form.append("RequestMethod", searchUserMeetings.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(listOfMeetingsApi(navigate, t, Data, routePath, object));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SearchMeetings_01".toLowerCase(),
                )
            ) {
              // const { val } = object;
              // if (val === 1) {
              //   dispatch(ProposedMeetingViewFlagAction(false));
              // }
              let getMeetingData = await getAllUnpublishedMeetingData(
                response.data.responseResult.meetings,
                1,
              );
              let newMeetingData = {
                meetingStartedMinuteAgo:
                  response.data.responseResult.meetingStartedMinuteAgo,
                meetings: getMeetingData,
                pageNumbers: response.data.responseResult.pageNumbers,
                totalRecords: response.data.responseResult.totalRecords,
              };
              await dispatch(listOfMeetings_success(newMeetingData, ""));
              let webNotifactionDataRoutecheckFlag = JSON.parse(
                localStorage.getItem("webNotifactionDataRoutecheckFlag"),
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
                  "Meeting_MeetingServiceManager_SearchMeetings_02".toLowerCase(),
                )
            ) {
              dispatch(listOfMeetings_fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SearchMeetings_03".toLowerCase(),
                )
            ) {
              dispatch(listOfMeetings_fail(t("Something-went-wrong")));
            } else {
              dispatch(listOfMeetings_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(listOfMeetings_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(listOfMeetings_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(listOfMeetings_fail(t("Something-went-wrong")));
      });
  };
};

export const setCurrentMeetingInfo = ({
  meetingID,
  meetingTitle,
  mapFolderId,
}) => {
  return {
    type: actions.CURRENT_MEETING_INFO,
    response: {
      meetingID,
      meetingTitle,
      mapFolderId,
    },
  };
};
export const resetCurrentMeetingInfo = () => {
  return {
    type: actions.CLEAR_CURRENT_MEETING_INFO,
  };
};
