import {
  CreateUpdateMeetingDataroomMapped,
  getAllMeetingDetailsByMeetingID,
  getallMeetingType,
  joinMeeting,
  meetingStatusUpdate,
  saveMeetingDetials,
  searchUserMeetings,
} from "../../commen/apis/Api_config";
import { dataRoomApi, meetingApi } from "../../commen/apis/Api_ends_points";
import axiosInstance from "../../commen/functions/axiosInstance";
import { getCurrentDateTimeUTC } from "../../commen/functions/date_formater";
import { getAllUnpublishedMeetingData } from "../../hooks/meetingResponse/response";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import { GetAdvanceMeetingAgendabyMeetingID } from "./MeetingAgenda_action";
import {
  actionsGlobalFlag,
  agendaContributorsGlobalFlag,
  agendaGlobalFlag,
  attendanceGlobalFlag,
  GetAllMeetingRecurringApiNew,
  GetAllMeetingRemindersApiFrequencyNew,
  GetAllMeetingTypesNewFunction,
  getMeetingByCommitteeIDApi,
  getMeetingbyGroupApi,
  meetingDetailsGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  organizersGlobalFlag,
  participantsGlobalFlag,
  pollsGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  scheduleMeetingPageFlag,
  searchNewUserMeeting,
  uploadGlobalFlag,
} from "./NewMeetingActions";

import {
  nonMeetingVideoGlobalModal,
  presenterViewGlobalState,
  videoIconOrButtonState,
} from "./VideoFeature_actions";

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
/**
 * ============================================================
 * JOIN MEETING ACTION (NEW FLOW)
 * ============================================================
 *
 * This file handles:
 * 1️⃣ Joining a meeting
 * 2️⃣ Handling token refresh (417)
 * 3️⃣ Managing presenter view auto-join
 * 4️⃣ Handling conflict with active one-to-one/group calls
 * 5️⃣ Updating meeting status & UI states
 *
 * ============================================================
 */

/**
 * Action: JOIN_MEETING_INIT
 * Triggered before API call to set loading state
 */
const joinMeetingInit = () => {
  return {
    type: actions.JOIN_MEETING_INIT,
  };
};

/**
 * Action: JOIN_MEETING_SUCCESS
 * Triggered when meeting is successfully joined
 */
const joinMeetingSuccess = (response, message) => {
  return {
    type: actions.JOIN_MEETING_SUCCESS,
    response: response,
    message: message,
  };
};

/**
 * Action: JOIN_MEETING_FAIL
 * Triggered when meeting join fails
 */
const joinMeetingFail = (message) => {
  return {
    type: actions.JOIN_MEETING_FAIL,
    message: message,
  };
};

/**
 * ============================================================
 * Main Thunk Action: NewJoinCurrentMeeting
 * ============================================================
 *
 * Responsibilities:
 * - Call Join Meeting API
 * - Handle token expiration (417)
 * - Handle success/failure cases
 * - Manage presenter view state
 * - Handle active call conflicts
 * - Update meeting status
 *
 * @param navigate - React Router navigation
 * @param t - i18n translation function
 * @param Data - Meeting payload
 */
const NewJoinCurrentMeeting = (navigate, t, Data, isQuickMeeting) => {
  return async (dispatch) => {
    // 🔹 Step 1: Trigger loading state
    await dispatch(joinMeetingInit());

    /**
     * Prepare FormData payload
     * API requires:
     * - RequestMethod
     * - RequestData (stringified JSON)
     */
    let form = new FormData();
    form.append("RequestMethod", joinMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        /**
         * ============================================================
         * TOKEN EXPIRED (417)
         * ============================================================
         * If token expired:
         * - Refresh token
         * - Retry joining meeting
         */
        if (response.data.responseCode === 200) {
          /**
           * ============================================================
           * SUCCESS RESPONSE (200)
           * ============================================================
           */
          if (response.data.responseResult.isExecuted === true) {
            /**
             * ------------------------------------------------------------
             * CASE 1: Join Meeting Success (_01)
             * ------------------------------------------------------------
             */
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeeting_01".toLowerCase()
                )
            ) {
              // Hide video icon/button
              dispatch(videoIconOrButtonState(false));

              // Dispatch success action
              await dispatch(
                joinMeetingSuccess(
                  response.data.responseResult,
                  t("Successful")
                )
              );

              /**
               * Handle Quick Meeting vs Advance Meeting
               */
              if (isQuickMeeting === true) {
                // Fetch meeting details
                let viewMeetingData = { MeetingID: Number(Data.FK_MDID) };

                // await dispatch(
                //   ViewMeeting(
                //     navigate,
                //     viewMeetingData,
                //     t,
                //     setViewFlag,
                //     setEditFlag,
                //     setSceduleMeeting,
                //     no
                //   )
                // );
              } else {
                // Open advance meeting publish page
                // isFunction(setAdvanceMeetingModalID) &&
                //   setAdvanceMeetingModalID(Number(Data.FK_MDID));
                // isFunction(setViewAdvanceMeetingModal) &&
                //   setViewAdvanceMeetingModal(true);
                // await dispatch(viewAdvanceMeetingPublishPageFlag(true));
                // await dispatch(scheduleMeetingPageFlag(false));
              }

              /**
               * Store current meeting ID in localStorage
               */
              localStorage.setItem("currentMeetingID", Data.FK_MDID);

              /**
               * Update meeting status (10 = Joined)
               */
              // await dispatch(currentMeetingStatus(10));

              /**
               * ============================================================
               * PRESENTER VIEW HANDLING
               * ============================================================
               */

              let activeStatusOneToOne = JSON.parse(
                localStorage.getItem("activeCall")
              );

              let presenterViewStatus =
                response.data.responseResult.isPresenterViewStarted;

              /**
               * Case A:
               * Presenter View Started
               * No active one-to-one call
               * → Join presenter view immediately
               */
              if (presenterViewStatus && !activeStatusOneToOne) {
                let data = {
                  VideoCallURL: String(Data.VideoCallURL),
                  WasInVideo: false,
                };

                // dispatch(joinPresenterViewMainApi(navigate, t, data));
              } else if (presenterViewStatus && activeStatusOneToOne) {
                /**
                 * Case B:
                 * Presenter View Started
                 * BUT active one-to-one call exists
                 *
                 * → Show NonMeetingVideoModal
                 * → Ask user before leaving current call
                 */
                // Flag to join presenter after leaving one-to-one
                localStorage.setItem("JoinpresenterForonetoone", true);

                // Open confirmation modal
                dispatch(nonMeetingVideoGlobalModal(true));

                // Prepare presenter state
                dispatch(presenterViewGlobalState(0, true, false, false));
              }
            } else if (
              /**
               * ------------------------------------------------------------
               * CASE 2: Join Failed (_02)
               * ------------------------------------------------------------
               */
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_JoinMeeting_02".toLowerCase()
                )
            ) {
              dispatch(joinMeetingFail(t("Unsuccessful")));
            } else if (
              /**
               * ------------------------------------------------------------
               * CASE 3: Join Blocked (_03)
               * ------------------------------------------------------------
               */
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
              /**
               * Unknown message case
               */
              dispatch(joinMeetingFail(t("Something-went-wrong")));
            }
          } else {
            /**
             * isExecuted false case
             */
            dispatch(joinMeetingFail(t("Something-went-wrong")));
          }
        } else {
          /**
           * Any other responseCode
           */
          dispatch(joinMeetingFail(t("Something-went-wrong")));
        }
      })

      /**
       * Network or unexpected error
       */
      .catch(() => {
        dispatch(joinMeetingFail(t("Something-went-wrong")));
      });
  };
};

/**
 * ============================================================
 * MEETING STATUS UPDATE ACTION
 * ============================================================
 *
 * This action handles:
 * 1️⃣ Publishing Meeting
 * 2️⃣ Starting Meeting
 * 3️⃣ Ending Meeting
 * 4️⃣ Route-based post-processing
 * 5️⃣ Re-fetching lists after update
 * 6️⃣ Auto Join Meeting when required
 *
 * Handles token refresh (417) automatically.
 * ============================================================
 */

/* ============================= */
/* ACTION TYPES */
/* ============================= */

// INIT
const meetingStatusUpdate_init = () => ({
  type: actions.MEETING_STATUS_UPDATE_INIT,
});

// SUCCESS
const meetingStatusUpdate_success = (response, message) => ({
  type: actions.MEETING_STATUS_UPDATE_SUCCESS,
  response,
  message,
});

// FAIL
const meetingStatusUpdate_fail = (message) => ({
  type: actions.MEETING_STATUS_UPDATE_FAIL,
  message,
});

/* ============================= */
/* MAIN THUNK */
/* ============================= */

export const meetingStatusUpdateApi = (
  navigate,
  t,
  Data,
  route,
  actions
  //   setEditorRole,
  //   setAdvanceMeetingModalID,
  //   setDataroomMapFolderId,
  //   setSceduleMeeting,
  //   setViewFlag,
  //   setEditFlag,
  //   setCalendarViewModal,
  //   dashboardFlag,
  //   setViewAdvanceMeetingModal,
  //   setEndMeetingConfirmationModal
) => {
  /**
   * Prepare Leave/Join data for video logic
   */
  let leaveMeetingData = {
    VideoCallURL: Data.VideoCallURL || Data.videoCallURL,
    FK_MDID: Number(Data.MeetingID),
    DateTime: getCurrentDateTimeUTC(),
  };

  return async (dispatch) => {
    dispatch(meetingStatusUpdate_init());

    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", meetingStatusUpdate.RequestMethod);

    try {
      const response = await axiosInstance.post(meetingApi, form);

      /* ============================= */
      /* TOKEN EXPIRED */
      /* ============================= */

      /* ============================= */
      /* SUCCESS RESPONSE */
      /* ============================= */
      if (
        response.data.responseCode === 200 &&
        response.data.responseResult.isExecuted
      ) {
        const message =
          response.data.responseResult.responseMessage.toLowerCase();

        /* =====================================================
           SUCCESS CASE (_01)
        ====================================================== */
        if (
          message.includes(
            "Meeting_MeetingServiceManager_MeetingStatusUpdate_01".toLowerCase()
          )
        ) {
          await dispatch(
            meetingStatusUpdate_success(
              response.data.responseResult,

              // Dynamic Success Messages
              route === "publishMeeting"
                ? t("Meeting-published-successfully")
                : (route === 4 || route === 6 || route === 7 || route === 11) &&
                  Data.StatusID === 10
                ? t("Meeting-started-successfully")
                : (route === 4 || route === 6 || route === 7 || route === 12) &&
                  Data.StatusID === 9
                ? t("Meeting-ended-successfully")
                : ""
            )
          );

          /* =====================================================
             ROUTE BASED FLOW HANDLING
          ====================================================== */

          switch (route) {
            /* ---------------------------
               ROUTE 3 → Direct Join
            ---------------------------- */
            case 3: {
              await dispatch(
                GetAllMeetingDetailsApi(
                  navigate,
                  t,
                  { MeetingID: Number(Data.MeetingID) },
                  "",
                  {}
                  // setSceduleMeeting,
                  // setDataroomMapFolderId,
                )
              );

              // dispatch(
              //   JoinCurrentMeeting(
              //     false,
              //     navigate,
              //     t,
              //     leaveMeetingData,
              //     setViewFlag,
              //     setEditFlag,
              //     setSceduleMeeting,
              //     1,
              //     setAdvanceMeetingModalID,
              //     setViewAdvanceMeetingModal
              //   )
              // );
              break;
            }

            /* ---------------------------
               ROUTE 4 → Start/End
            ---------------------------- */
            case 4: {
              if (Data.StatusID === 9) {
                // End meeting
                // setEndMeetingConfirmationModal(false);
              } else {
                // if (!isQuickMeeting) {
                //   setAdvanceMeetingModalID(Data.MeetingID);
                //   setEditorRole({
                //     status: "10",
                //     role: "Organizer",
                //     isPrimaryOrganizer: false,
                //   });
                // }
                // dispatch(
                //   NewJoinCurrentMeeting(
                //     navigate,
                //     t,
                //     Data,
                //     leaveMeetingData,
                //     setViewFlag,
                //     setEditFlag,
                //     setSceduleMeeting,
                //     1,
                //     setAdvanceMeetingModalID,
                //     setViewAdvanceMeetingModal
                //   )
                // );
              }
              break;
            }

            /* ---------------------------
               ROUTE 5 → Publish
            ---------------------------- */
            case "publishMeeting": {
              const {
                isQuickMeeting,
                setEditorRole, // shorthand if variable name matches key
                setIsMeetingCreateOrEdit, // For update create and update view
                setIsCreateEditMeeting,
              } = actions; // For Create and Update Component} = actions;
              let userID = localStorage.getItem("userID");

              let searchData = {
                Date: "",
                Title: "",
                HostName: "",
                UserID: Number(userID),
                PageNumber: 1,
                Length: 30,
                PublishedMeetings:
                  localStorage.getItem("MeetingCurrentView") &&
                  Number(localStorage.getItem("MeetingCurrentView")) === 1
                    ? true
                    : false,
                ProposedMeetings:
                  localStorage.getItem("MeetingCurrentView") &&
                  Number(localStorage.getItem("MeetingCurrentView")) === 2
                    ? true
                    : false,
              };
              setIsMeetingCreateOrEdit(1);
              setIsCreateEditMeeting(false);
              setEditorRole({
                status: "",
                role: "",
                isPrimaryOrganizer: false,
              });
              await dispatch(searchNewUserMeeting(navigate, searchData, t));
              dispatch(scheduleMeetingPageFlag(false));
              dispatch(
                setCurrentMeetingInfo({
                  meetingID: 0,
                  meetingTitle: "",
                  mapFolderId: 0,
                })
              );
              break;
            }

            /* ---------------------------
               ROUTE 6 → Committee
            ---------------------------- */
            case 6: {
              if (Data.StatusID === 10) {
                dispatch(
                  NewJoinCurrentMeeting(
                    navigate,
                    t,
                    Data
                    // leaveMeetingData,
                    // setViewFlag,
                    // setEditFlag,
                    // setSceduleMeeting,
                    // 1,
                    // setAdvanceMeetingModalID,
                    // setViewAdvanceMeetingModal
                  )
                );
              } else {
                dispatch(getMeetingByCommitteeIDApi(navigate, t, {}));
              }
              break;
            }

            /* ---------------------------
               ROUTE 7 → Group
            ---------------------------- */
            case 7: {
              if (Data.StatusID === 10) {
                dispatch(NewJoinCurrentMeeting(navigate, t, Data));
              } else {
                dispatch(getMeetingbyGroupApi(navigate, t, {}));
              }
              break;
            }

            /* ---------------------------
               ROUTE 11 → Quick Modal Start
            ---------------------------- */
            case 11: {
              if (Data.StatusID === 10) {
                dispatch(
                  NewJoinCurrentMeeting(
                    navigate,
                    t,
                    Data,
                    leaveMeetingData
                    // setViewFlag,
                    // setEditFlag,
                    // setSceduleMeeting,
                    // route,
                    // setAdvanceMeetingModalID,
                    // setViewAdvanceMeetingModal
                  )
                );
              }
              break;
            }

            default:
              break;
          }
        } else if (message.includes("meetingstatusupdate_02"))
          /* =====================================================
           FAILURE CASES (_02 to _07)
        ====================================================== */
          dispatch(meetingStatusUpdate_fail(t("Record-not-updated")));
        else if (message.includes("meetingstatusupdate_04"))
          dispatch(
            meetingStatusUpdate_fail(t("Add-meeting-agenda-to-publish"))
          );
        else if (message.includes("meetingstatusupdate_05"))
          dispatch(
            meetingStatusUpdate_fail(t("Add-meeting-organizers-to-publish"))
          );
        else if (message.includes("meetingstatusupdate_06"))
          dispatch(
            meetingStatusUpdate_fail(t("Add-meeting-participants-to-publish"))
          );
        else if (message.includes("meetingstatusupdate_07"))
          dispatch(
            meetingStatusUpdate_fail(
              t("Meeting-cannot-be-published-after-time-has-elapsed")
            )
          );
        else dispatch(meetingStatusUpdate_fail(t("Something-went-wrong")));
      } else {
        dispatch(meetingStatusUpdate_fail(t("Something-went-wrong")));
      }
    } catch (error) {
      dispatch(meetingStatusUpdate_fail(t("Something-went-wrong")));
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
export const SaveMeetingDetialsApi = (
  navigate,
  t,
  data,
  meetingState,
  actions
  // setSceduleMeeting,
  // setorganizers,
  // setmeetingDetails,
  // viewValue,
  // setCurrentMeetingID,
  // currentMeeting,
  // meetingDetails,
  // setDataroomMapFolderId,
  // members,
  // rows,
  // ResponseDate,
  // setProposedNewMeeting,
  // flag
) => {
  // MeetingState = Published or Update or Save
  return (dispatch) => {
    dispatch(handleSaveMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", saveMeetingDetials.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            SaveMeetingDetialsApi(
              navigate,
              t,
              data,
              meetingState,
              actions
              // setSceduleMeeting,
              // setorganizers,
              // setmeetingDetails,
              // viewValue,
              // setCurrentMeetingID,
              // currentMeeting,
              // meetingDetails,
              // setDataroomMapFolderId,
              // members,
              // rows,
              // ResponseDate,
              // setProposedNewMeeting
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
              let MeetID = response.data.responseResult.meetingID;
              // setCurrentMeetingID(response.data.responseResult.meetingID);
              dispatch(
                handleSaveMeetingSuccess(response.data.responseResult, "")
              );
              switch (meetingState.toLowerCase()) {
                case "save":
                  const {} = actions;
                  let MappedData = {
                    MeetingID: response.data.responseResult.meetingID,
                    MeetingTitle: data.MeetingDetails.MeetingTitle,
                    IsUpdateFlow: false,
                  };
                  dispatch(
                    CreateUpdateMeetingDataRoomMapedApi(
                      navigate,
                      MappedData,
                      t,
                      meetingState,
                      {}
                    )
                  );

                  break;
                case "published":
                  dispatch(
                    handleSaveMeetingSuccess(
                      response.data.responseResult,
                      t("Meeting-details-updated-and-published-successfully")
                    )
                  );
                  dispatch(meetingDetailsGlobalFlag(false));
                  dispatch(organizersGlobalFlag(false));
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
                    ProposedMeetings:
                      currentView && Number(currentView) === 2 ? true : false,
                  };
                  await dispatch(searchNewUserMeeting(navigate, searchData, t));
                  break;

                default:
                  break;
              }

              // else if (viewValue === 2) {
              //   if (Number(data.MeetingDetails.MeetingStatusID) === 1) {
              //     setSceduleMeeting(false);
              //     // dispatch(scheduleMeetingPageFlag(false));

              //     dispatch(
              //       handleSaveMeetingSuccess(
              //         response.data.responseResult,
              //         t("Meeting-details-updated-and-published-successfully")
              //       )
              //     );
              //     // dispatch(meetingDetailsGlobalFlag(false));
              //     // dispatch(organizersGlobalFlag(true));
              //     // dispatch(agendaContributorsGlobalFlag(false));
              //     // dispatch(participantsGlobalFlag(false));
              //     // dispatch(agendaGlobalFlag(false));
              //     // dispatch(meetingMaterialGlobalFlag(false));
              //     // dispatch(minutesGlobalFlag(false));
              //     // dispatch(proposedMeetingDatesGlobalFlag(false));
              //     // dispatch(actionsGlobalFlag(false));
              //     // dispatch(pollsGlobalFlag(false));
              //     // dispatch(attendanceGlobalFlag(false));
              //     // dispatch(uploadGlobalFlag(false));
              //     let currentView = localStorage.getItem("MeetingCurrentView");
              //     let meetingpageRow = localStorage.getItem("MeetingPageRows");
              //     let meetingPageCurrent =
              //       localStorage.getItem("MeetingPageCurrent");
              //     let userID = localStorage.getItem("userID");
              //     let searchData = {
              //       Date: "",
              //       Title: "",
              //       HostName: "",
              //       UserID: Number(userID),
              //       PageNumber:
              //         meetingPageCurrent !== null
              //           ? Number(meetingPageCurrent)
              //           : 1,
              //       Length:
              //         meetingpageRow !== null ? Number(meetingpageRow) : 30,
              //       PublishedMeetings:
              //         localStorage.getItem("MeetingCurrentView") &&
              //         Number(localStorage.getItem("MeetingCurrentView")) === 1
              //           ? true
              //           : false,
              //       ProposedMeetings:
              //         localStorage.getItem("MeetingCurrentView") &&
              //         Number(localStorage.getItem("MeetingCurrentView")) === 2
              //           ? true
              //           : false,
              //     };
              //     await dispatch(searchNewUserMeeting(navigate, searchData, t));
              //   } else {
              //     let Data = {
              //       MeetingID: Number(response.data.responseResult.meetingID),
              //     };
              //     await dispatch(
              //       GetAllMeetingDetailsApiFunc(
              //         navigate,
              //         t,
              //         Data,
              //         true,
              //         setCurrentMeetingID,
              //         setSceduleMeeting,
              //         setDataroomMapFolderId,
              //         data.MeetingDetails.MeetingStatusID
              //       )
              //     );

              //     // dispatch(meetingDetailsGlobalFlag(false));
              //     // dispatch(organizersGlobalFlag(true));
              //     // dispatch(agendaContributorsGlobalFlag(false));
              //     // dispatch(participantsGlobalFlag(false));
              //     // dispatch(agendaGlobalFlag(false));
              //     // dispatch(meetingMaterialGlobalFlag(false));
              //     // dispatch(minutesGlobalFlag(false));
              //     // dispatch(proposedMeetingDatesGlobalFlag(false));
              //     // dispatch(actionsGlobalFlag(false));
              //     // dispatch(pollsGlobalFlag(false));
              //     // dispatch(attendanceGlobalFlag(false));
              //     // dispatch(uploadGlobalFlag(false));
              //     setorganizers(true);
              //     setmeetingDetails(false);
              //   }
              // } else if (viewValue === 3) {
              //   // setorganizers(true);
              //   // setmeetingDetails(false);
              // } else if (viewValue === 4) {
              //   let MappedData = {
              //     MeetingID: response.data.responseResult.meetingID,
              //     MeetingTitle: meetingDetails.MeetingTitle,
              //     IsUpdateFlow: true,
              //   };
              //   // await dispatch(
              //   //   CreateUpdateMeetingDataRoomMapeedApiFunc(
              //   //     navigate,
              //   //     MappedData,
              //   //     t,
              //   //     setDataroomMapFolderId
              //   //   )
              //   // );

              //   // dispatch(meetingDetailsGlobalFlag(false));
              //   // dispatch(organizersGlobalFlag(true));
              //   // dispatch(agendaContributorsGlobalFlag(false));
              //   // dispatch(participantsGlobalFlag(false));
              //   // dispatch(agendaGlobalFlag(false));
              //   // dispatch(meetingMaterialGlobalFlag(false));
              //   // dispatch(minutesGlobalFlag(false));
              //   // dispatch(proposedMeetingDatesGlobalFlag(false));
              //   // dispatch(actionsGlobalFlag(false));
              //   // dispatch(pollsGlobalFlag(false));
              //   // dispatch(attendanceGlobalFlag(false));
              //   // dispatch(uploadGlobalFlag(false));
              //   setorganizers(true);
              //   setmeetingDetails(false);
              // }
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
export const getAllMeetingsApi = (navigate, t, Data, val) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(SearchMeeting_Init());
    let form = new FormData();
    form.append("RequestMethod", searchUserMeetings.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          console.log("chek search meeting");
          dispatch(getAllMeetingsApi(navigate, t, Data));
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
                // dispatch(ProposedMeetingViewFlagAction(false));
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
                  // dispatch(webnotificationGlobalFlag(true));
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
                  // dispatch(showSceduleProposedMeeting(true));
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

export const listOfMeetingTypesApi = (navigate, t, loader) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(handlegetAllMeetingTypesInit());
    let form = new FormData();
    form.append("RequestMethod", getallMeetingType.RequestMethod);
    try {
      const response = await axiosInstance.post(meetingApi, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        // Retry the API request
        await dispatch(listOfMeetingTypesApi(navigate, t, loader));
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

export const CreateUpdateMeetingDataRoomMapedApi = (
  navigate,
  Data,
  t,
  meetingState,
  actions
  // setCreatedMeetingInfo,
  // members,
  // MeetID,
  // rows,
  // ResponseDate,
  // setProposedNewMeeting,
  // flag,
  // setSceduleMeeting
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
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            CreateUpdateMeetingDataRoomMapedApi(
              navigate,
              Data,
              t,
              meetingState,
              actions
              // setCreatedMeetingInfo,
              // members,
              // MeetID,
              // rows,
              // ResponseDate,
              // setProposedNewMeeting,
              // flag,
              // setSceduleMeeting
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
                  false
                )
              );
              // localStorage.setItem(
              //   "folderDataRoomMeeting",
              //   response.data.responseResult.folderID
              // );

              switch (meetingState) {
                case "save":
                  dispatch(
                    setCurrentMeetingInfo({
                      meetingID: Data.MeetingID,
                      meetingTitle: Data.MeetingTitle,
                      mapFolderId:
                        response?.data?.responseResult?.folderID ?? 0,
                    })
                  );
                  dispatch(meetingDetailsGlobalFlag(false));
                  dispatch(organizersGlobalFlag(true));
                  break;
                case "editMeeting":
                  const { setIsCreateEditMeeting, setIsMeetingCreateOrEdit } =
                    actions;
                  setIsCreateEditMeeting(true);
                  setIsMeetingCreateOrEdit(2);
                  dispatch(
                    setCurrentMeetingInfo({
                      meetingID: Data.MeetingID,
                      meetingTitle: Data.MeetingTitle,
                      mapFolderId:
                        response?.data?.responseResult?.folderID ?? 0,
                    })
                  );
                  dispatch(meetingDetailsGlobalFlag(true));
                  dispatch(organizersGlobalFlag(false));
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
                default:
                  break;
              }

              // let newarry = [];
              // members.forEach((data, index) => {
              //   newarry.push(data.userID);
              // });
              // let Data2 = {
              //   MeetingID: MeetID,
              //   MeetingAttendeRoleID: 2,
              //   UpdatedUsers: newarry,
              // };
              // dispatch(
              //   UpdateMeetingUserApiFunc(
              //     navigate,
              //     Data2,
              //     t,
              //     members,
              //     3,
              //     MeetID,
              //     rows,
              //     ResponseDate,
              //     true,
              //     setProposedNewMeeting,
              //     setSceduleMeeting
              //   )
              // );
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
                  false
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
                  false
                )
              );
              switch (meetingState) {
                case "save":
                  dispatch(
                    setCurrentMeetingInfo({
                      meetingID: Data.MeetingID,
                      meetingTitle: Data.MeetingTitle,
                      mapFolderId:
                        response?.data?.responseResult?.folderID ?? 0,
                    })
                  );
                  dispatch(meetingDetailsGlobalFlag(false));
                  dispatch(organizersGlobalFlag(true));
                  break;
                case "editMeeting":
                  try {
                    const { setIsCreateEditMeeting, setIsMeetingCreateOrEdit } =
                      actions;
                    setIsCreateEditMeeting(true);
                    setIsMeetingCreateOrEdit(2);
                    dispatch(
                      setCurrentMeetingInfo({
                        meetingID: Data.MeetingID,
                        meetingTitle: Data.MeetingTitle,
                        mapFolderId:
                          response?.data?.responseResult?.folderID ?? 0,
                      })
                    );
                    dispatch(meetingDetailsGlobalFlag(true));
                    dispatch(organizersGlobalFlag(false));
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
                  } catch (error) {
                    console.log(error);
                  }

                default:
                  break;
              }
              // setCurrentMeetingInfo((prev) => ({
              //   ...prev,
              //   meetingId: Data.MeetingID,
              //   meetingMapFolderId:
              //     response?.data?.responseResult?.folderID ?? 0,
              //   meetingTitle: Data.MeetingTitle,
              // }));
              // dispatch(
              //   setCurrentMeetingInfo({
              //     meetingID: Data.MeetingID,
              //     meetingTitle: Data.MeetingTitle,
              //     mapFolderId:  response?.data?.responseResult?.folderID ?? 0,
              //   })
              // );
              // let newarry = [];
              // members.forEach((data, index) => {
              //   newarry.push(data.userID);
              // });
              // let Data2 = {
              //   MeetingID: MeetID,
              //   MeetingAttendeRoleID: 2,
              //   UpdatedUsers: newarry,
              // };
              // dispatch(
              //   UpdateMeetingUserApiFunc(
              //     navigate,
              //     Data2,
              //     t,
              //     members,
              //     3,
              //     MeetID,
              //     rows,
              //     ResponseDate,
              //     true,
              //     setProposedNewMeeting
              //   )
              // );
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
                  false
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
                  false
                )
              );
              localStorage.setItem(
                "folderDataRoomMeeting",
                response.data.responseResult.folderID
              );
              dispatch(
                setCurrentMeetingInfo({
                  meetingID: Data.MeetingID,
                  meetingTitle: Data.MeetingTitle,
                  mapFolderId: response?.data?.responseResult?.folderID ?? 0,
                })
              );
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
                  false
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

export const setActiveCreateAndEditMeetingTab = (tab) => ({
  type: actions.ACTIVE_CREATE_AND_EDIT_MEETING_TAB,
  payload: tab,
});
export const setActiveViewMeetingTab = (tab) => ({
  type: actions.ACTIVE_VIEW_MEETING_TAB,
  payload: tab,
});

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
export const GetAllMeetingDetailsApi = (
  navigate,
  t,
  Data,
  meetingState,
  actions
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    await dispatch(showGetAllMeetingDetialsInit());
    let form = new FormData();
    form.append("RequestMethod", getAllMeetingDetailsByMeetingID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            GetAllMeetingDetailsApi(
              navigate,
              t,
              Data,
              meetingState,
              actions
              // loader,
              // setCurrentMeetingID,
              // setSceduleMeeting,
              // setCreatedMeetingInfo,

              // viewValue,
              // flag,
              // role
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
              switch (meetingState) {
                case "viewDetail":
                  dispatch(meetingDetailsGlobalFlag(true));
                  dispatch(organizersGlobalFlag(false));
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
                  break;
                case "editMeeting":
                  let MappedData = {
                    MeetingID:
                      response.data.responseResult.advanceMeetingDetails
                        .meetingID,
                    MeetingTitle:
                      response.data.responseResult.advanceMeetingDetails
                        .meetingTitle,
                    IsUpdateFlow: true,
                  };
                  dispatch(
                    CreateUpdateMeetingDataRoomMapedApi(
                      navigate,
                      MappedData,
                      t,
                      meetingState,
                      actions
                    )
                  );

                  break;
                default:
                  break;
              }
              // localStorage.setItem(
              //   "meetingTitle",
              //   response.data.responseResult.advanceMeetingDetails.meetingTitle,
              // );
              // localStorage.setItem(
              //   "currentMeetingLS",
              //   response.data.responseResult.advanceMeetingDetails.meetingID,
              // );
              // let MappedData = {
              //   MeetingID:
              //     response.data.responseResult.advanceMeetingDetails.meetingID,
              //   MeetingTitle:
              //     response.data.responseResult.advanceMeetingDetails
              //       .meetingTitle,
              //   IsUpdateFlow:
              //     viewValue !== null &&
              //     viewValue !== undefined &&
              //     viewValue !== 0 &&
              //     Number(viewValue) === 11
              //       ? false
              //       : true,
              // };
              // if (flag !== undefined && flag != null) {
              //   if (flag === 1) {
              //     await dispatch(GetAllMeetingTypesNewFunction(navigate, t));
              //     // Reminder Frequency Drop Down API
              //     await dispatch(
              //       GetAllMeetingRemindersApiFrequencyNew(navigate, t)
              //     );
              //     // Recurring Drop Down API
              //     await dispatch(
              //       GetAllMeetingRecurringApiNew(navigate, t, false)
              //     );
              //   } else if (flag === 2) {
              //     console.log("Flag for proposed meeting Edit flow only");
              //   }
              // }
              // else {
              // await dispatch(
              //   CreateUpdateMeetingDataRoomMapedApi(
              //     navigate,
              //     MappedData,
              //     t,
              //     // setCreatedMeetingInfo,
              //     // false,
              //     // false,
              //     // false,
              //     // false,
              //     // false,
              //     // false
              //   ),
              // );
              // }

              await dispatch(
                showGetAllMeetingDetialsSuccess(
                  response.data.responseResult,
                  "",
                  false
                )
              );
              try {
                dispatch(meetingDetailsGlobalFlag(true));
                const { editorRole = "" } = actions;
                // dispatch(scheduleMeetingPageFlag(true));
                // setCurrentMeetingID(Data.MeetingID);
                if (editorRole === "Agenda Contributor") {
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
