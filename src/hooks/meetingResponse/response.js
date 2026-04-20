/**
 * @file hooks/meetingResponse/response.js
 * @description Data-transformation helpers that normalise raw meeting API
 * responses and MQTT push payloads into a consistent flat object shape consumed
 * by the meetings list and calendar components.
 *
 * The module also determines the current user's role in each meeting
 * (organiser / participant / agenda-contributor / primary organiser) by
 * scanning the `meetingAttendees` array or the MQTT delta payload.
 */

// import { isArray } from "lodash"

/**
 * Derives the current user's role flags and profile data from a meeting record.
 *
 * @param {Object} data           - Meeting object from the API or MQTT.
 * @param {number} currentUserId  - ID of the authenticated user.
 * @param {1|2}    currentSource  - Data source:
 *   - `1` = full meeting list from REST API (uses `meetingAttendees`)
 *   - `2` = MQTT delta update (uses top-level `attendeeRoleID`)
 * @returns {{
 *   isAgendaContributor: boolean,
 *   isOrganiser: boolean,
 *   isParticipant: boolean,
 *   isPrimaryOrganizer: boolean,
 *   userData: Object|null
 * }}
 */
const getUserInfo = (data, currentUserId, currentSource) => {
  // current Source 1 = get All meetings
  // current Source 2 = mqtt aad and update organizers
  const userInfo = {
    isAgendaContributor: false,
    isOrganiser: false,
    isParticipant: false,
    userData: null,
    isPrimaryOrganizer: false,
  };
  try {
    if (Number(currentSource) === 1) {
      data.meetingAttendees.forEach((attendee) => {
        if (Number(attendee.user.pK_UID) === Number(currentUserId)) {
          userInfo.userData = attendee.user;
          switch (attendee.meetingAttendeeRole.pK_MARID) {
            case 1:
              userInfo.isOrganiser = true;
              break;
            case 2:
              userInfo.isParticipant = true;
              break;
            case 4:
              userInfo.isAgendaContributor = true;
              break;
            default:
              console.log("ERROR");
          }
          if (attendee.isPrimaryOrganizer === true) {
            userInfo.isPrimaryOrganizer = true;
          }
        }
      });
    } else if (Number(currentSource) === 2) {
      switch (data.attendeeRoleID) {
        case 1:
          userInfo.isOrganiser = true;
          break;
        case 2:
          userInfo.isParticipant = true;
          break;
        case 4:
          userInfo.isAgendaContributor = true;
          break;
        default:
          console.log("ERROR");
      }
      if (data.isPrimaryOrganizer === true) {
        userInfo.isPrimaryOrganizer = true;
      }
    }
  } catch {}

  return userInfo;
};

/**
 * Transforms an array of raw meeting records (from the REST API) into a
 * normalised flat shape expected by the meetings list component.
 *
 * Resolves each meeting's role info with `getUserInfo` (source = 1) and builds
 * a clean object with safe defaults for all optional fields.
 *
 * @param {Array<Object>} meetingData    - Raw meeting array from the API.
 * @param {1|2}           currentSourceID - Source identifier forwarded to `getUserInfo`.
 * @returns {Promise<Array<Object>>} Normalised meeting records.
 */
export const getAllUnpublishedMeetingData = async (
  meetingData,
  currentSourceID
) => {
  let currentUserId = Number(localStorage.getItem("userID"));

  let newMeetingData = [];
  if (Array.isArray(meetingData) && meetingData?.length > 0) {
    meetingData.forEach(async (data, index) => {
      const primaryOrganizerA = data.meetingAttendees.find(
        (item) => item.isPrimaryOrganizer === true
      );
      const meetingAgendas =
        data.meetingAgenda !== null &&
        data.meetingAgenda !== undefined &&
        data.meetingAgenda.length > 0
          ? data.meetingAgenda
          : [];

      let usersData = await getUserInfo(data, currentUserId, currentSourceID);
      newMeetingData.push({
        dateOfMeeting: data.dateOfMeeting,
        host: data.host,
        isAttachment: data.isAttachment,
        isChat: data.isChat,
        isVideoCall: data.isVideoCall || false,
        videoCallURL: data.videoCallURL || "",
        isQuickMeeting: data.isQuickMeeting || false,
        meetingAgenda: meetingAgendas || [],
        isOrganizer: usersData?.isOrganiser || false,
        isAgendaContributor: usersData?.isAgendaContributor || false,
        isParticipant: usersData?.isParticipant || false,
        talkGroupID: data.talkGroupID || 0,
        meetingType:
          data.meetingTypeID === 1 && data.isQuickMeeting === true
            ? 0
            : data.meetingTypeID || data.meetingType,
        meetingEndTime: data.meetingEndTime || "",
        meetingStartTime: data.meetingStartTime || "",
        pK_MDID: data.pK_MDID || 0,
        meetingPoll: {
          totalNoOfDirectors: data?.proposedMeetingDetail?.totalNoOfDirectors || 0,
          totalNoOfDirectorsVoted:
            data.proposedMeetingDetail?.totalNoOfDirectorsVoted || 0,
        },
        responseDeadLine: data.responseDeadLine || 0,
        status: data.status,
        title: data.title,
        key: index,
        isPrimaryOrganizer: usersData?.isPrimaryOrganizer,
        userDetails: usersData?.userData,
        isMinutePublished: data?.isMinutePublished || false,
        isRecordingAvailable: data?.isRecordingAvailable || false,
      });
    });
  }
  return newMeetingData;
};

/**
 * Normalises a **single** meeting payload received via MQTT (add / update
 * notification) into the same flat shape used by the meetings list.
 *
 * Uses `getUserInfo` with source = `currentSourceID` (typically `2`) to derive
 * role flags from the MQTT-delta fields rather than a full attendees array.
 *
 * @param {Object} meetingData      - Raw meeting payload from MQTT.
 * @param {1|2}    currentSourceID  - Source identifier forwarded to `getUserInfo`.
 * @returns {Promise<Object>} Normalised meeting record.
 */
export const mqttMeetingData = async (meetingData, currentSourceID) => {
  let currentUserId = Number(localStorage.getItem("userID"));
  let usersData = await getUserInfo(
    meetingData,
    currentUserId,
    currentSourceID
  );

  const meetingAgendas =
    Array.isArray(meetingData.meetingAgenda) &&
    meetingData.meetingAgenda.length > 0
      ? meetingData.meetingAgenda
      : [];

  let meetingTypeID = meetingData.meetingTypeID ?? meetingData.meetingType ?? 0;
  if (meetingTypeID === 1 && meetingData.isQuickMeeting === true) {
    meetingTypeID = 0;
  }

  let Data = {
    dateOfMeeting: meetingData?.dateOfMeeting,
    host: meetingData?.host,
    isAttachment: meetingData.isAttachment ?? false,
    isChat: meetingData.isChat ?? false,
    isVideoCall: meetingData.isVideoCall ?? false,
    videoCallURL: meetingData.videoCallURL,
    isQuickMeeting: meetingData.isQuickMeeting ?? false,
    meetingAgenda: meetingAgendas,
    isOrganizer: usersData?.isOrganiser,
    isAgendaContributor: usersData?.isAgendaContributor,
    isParticipant: usersData?.isParticipant,
    talkGroupID: meetingData.talkGroupID ?? false,
    meetingType: meetingTypeID,
    meetingEndTime: meetingData.meetingEndTime ?? false,
    meetingStartTime: meetingData.meetingStartTime ?? false,
    pK_MDID: meetingData?.pK_MDID,
    meetingPoll: {
      totalNoOfDirectors:
        meetingData?.proposedMeetingDetail?.totalNoOfDirectors,
      totalNoOfDirectorsVoted:
        meetingData?.proposedMeetingDetail?.totalNoOfDirectorsVoted,
    },
    responseDeadLine: meetingData?.responseDeadLine,
    status: String(meetingData?.status),
    title: meetingData?.title,
    isPrimaryOrganizer: usersData?.isPrimaryOrganizer,
    userDetails: usersData?.userData,
    isRecordingAvailable:
      meetingData.isRecordingAvailable !== undefined &&
      meetingData.isRecordingAvailable !== null
        ? meetingData.isRecordingAvailable
        : false,
  };

  return Data;
};
