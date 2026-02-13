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

import {
  nonMeetingVideoGlobalModal,
  presenterViewGlobalState,
} from "./VideoFeature_actions";

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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(NewJoinCurrentMeeting(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
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
                  "Meeting_MeetingServiceManager_JoinMeeting_01".toLowerCase(),
                )
            ) {
              // Hide video icon/button
              dispatch(videoIconOrButtonState(false));

              // Dispatch success action
              await dispatch(
                joinMeetingSuccess(
                  response.data.responseResult,
                  t("Successful"),
                ),
              );

              /**
               * Handle Quick Meeting vs Advance Meeting
               */
              if (isQuickMeeting === true) {
                // Fetch meeting details
                let viewMeetingData = { MeetingID: Number(Data.FK_MDID) };

                await dispatch(
                  ViewMeeting(
                    navigate,
                    viewMeetingData,
                    t,
                    setViewFlag,
                    setEditFlag,
                    setSceduleMeeting,
                    no,
                  ),
                );
              } else {
                // Open advance meeting publish page
                isFunction(setAdvanceMeetingModalID) &&
                  setAdvanceMeetingModalID(Number(Data.FK_MDID));

                isFunction(setViewAdvanceMeetingModal) &&
                  setViewAdvanceMeetingModal(true);

                await dispatch(viewAdvanceMeetingPublishPageFlag(true));
                await dispatch(scheduleMeetingPageFlag(false));
              }

              /**
               * Store current meeting ID in localStorage
               */
              localStorage.setItem("currentMeetingID", Data.FK_MDID);

              /**
               * Update meeting status (10 = Joined)
               */
              await dispatch(currentMeetingStatus(10));

              /**
               * ============================================================
               * PRESENTER VIEW HANDLING
               * ============================================================
               */

              let activeStatusOneToOne = JSON.parse(
                localStorage.getItem("activeCall"),
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

                dispatch(joinPresenterViewMainApi(navigate, t, data));
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
                  "Meeting_MeetingServiceManager_JoinMeeting_02".toLowerCase(),
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
                  "Meeting_MeetingServiceManager_JoinMeeting_03".toLowerCase(),
                )
            ) {
              dispatch(
                joinMeetingFail(
                  t(
                    "Unable-to-join-the-meeting-at-this-time-please-try-after-some-time",
                  ),
                ),
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

const meetingStatusUpdateApi = (
  navigate,
  t,
  Data,
  route,
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
      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(meetingStatusUpdateApi(navigate, t, Data, route));
      }

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
            "Meeting_MeetingServiceManager_MeetingStatusUpdate_01".toLowerCase(),
          )
        ) {
          await dispatch(
            meetingStatusUpdate_success(
              response.data.responseResult,

              // Dynamic Success Messages
              route === 5
                ? t("Meeting-published-successfully")
                : (route === 4 || route === 6 || route === 7 || route === 11) &&
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

          /* =====================================================
             ROUTE BASED FLOW HANDLING
          ====================================================== */

          switch (route) {
            /* ---------------------------
               ROUTE 3 → Direct Join
            ---------------------------- */
            case 3: {
              await dispatch(
                GetAllMeetingDetailsApiFunc(
                  navigate,
                  t,
                  { MeetingID: Number(Data.MeetingID) },
                  true,
                  setSceduleMeeting,
                  setDataroomMapFolderId,
                ),
              );

              dispatch(
                JoinCurrentMeeting(
                  false,
                  navigate,
                  t,
                  leaveMeetingData,
                  setViewFlag,
                  setEditFlag,
                  setSceduleMeeting,
                  1,
                  setAdvanceMeetingModalID,
                  setViewAdvanceMeetingModal,
                ),
              );
              break;
            }

            /* ---------------------------
               ROUTE 4 → Start/End
            ---------------------------- */
            case 4: {
              if (Data.StatusID === 9) {
                // End meeting
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
                  NewJoinCurrentMeeting(
                    navigate,
                    t,
                    Data,
                    leaveMeetingData,
                    setViewFlag,
                    setEditFlag,
                    setSceduleMeeting,
                    1,
                    setAdvanceMeetingModalID,
                    setViewAdvanceMeetingModal,
                  ),
                );
              }
              break;
            }

            /* ---------------------------
               ROUTE 5 → Publish
            ---------------------------- */
            case 5: {
              let userID = localStorage.getItem("userID");

              let searchData = {
                Date: "",
                Title: "",
                HostName: "",
                UserID: Number(userID),
                PageNumber: 1,
                Length: 30,
                PublishedMeetings: true,
              };

              await dispatch(searchNewUserMeeting(navigate, searchData, t));
              setSceduleMeeting(false);
              dispatch(scheduleMeetingPageFlag(false));
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
                    Data,
                    leaveMeetingData,
                    setViewFlag,
                    setEditFlag,
                    setSceduleMeeting,
                    1,
                    setAdvanceMeetingModalID,
                    setViewAdvanceMeetingModal,
                  ),
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
                    leaveMeetingData,
                    setViewFlag,
                    setEditFlag,
                    setSceduleMeeting,
                    route,
                    setAdvanceMeetingModalID,
                    setViewAdvanceMeetingModal,
                  ),
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
            meetingStatusUpdate_fail(t("Add-meeting-agenda-to-publish")),
          );
        else if (message.includes("meetingstatusupdate_05"))
          dispatch(
            meetingStatusUpdate_fail(t("Add-meeting-organizers-to-publish")),
          );
        else if (message.includes("meetingstatusupdate_06"))
          dispatch(
            meetingStatusUpdate_fail(t("Add-meeting-participants-to-publish")),
          );
        else if (message.includes("meetingstatusupdate_07"))
          dispatch(
            meetingStatusUpdate_fail(
              t("Meeting-cannot-be-published-after-time-has-elapsed"),
            ),
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
