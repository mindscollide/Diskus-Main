import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateEncryptedStringViewMeetingLinkApi } from "@/store/actions/NewMeetingActions";
import { PARTICIPANT_ROLE } from "./meeting.constants";
import { useMeetingListActions } from "./useMeetingListActions";

// Single place that turns the data returned by
// ValidateEncryptedStringMeetingRelatedEmailData (same shape whether it came
// from the viewMeetingLink / mtAgUpdate / committee / group tokens or from
// /Redirected's location.state) into "join / quick view / advance view".
// It reuses the list's own handleViewMeeting so email links behave exactly
// like clicking the meeting in the listing.
export const useMeetingLinkActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleViewMeeting } = useMeetingListActions();

  const openMeetingFromLinkData = async (data, viewTab = "meetingDetails") => {
    const {
      attendeeId,
      isQuickMeeting,
      meetingID,
      meetingStatusId,
      isChat,
      talkGroupId,
      isVideo,
      videoCallUrl,
      meetingTitle,
    } = data;

    if (meetingTitle) localStorage.setItem("meetingTitle", meetingTitle);

    await handleViewMeeting(
      {
        pK_MDID: Number(meetingID),
        title: meetingTitle,
        isQuickMeeting: Boolean(isQuickMeeting),
        videoCallURL: videoCallUrl,
        status: meetingStatusId,
        isParticipant: Number(attendeeId) === PARTICIPANT_ROLE.PARTICIPANT,
        isAgendaContributor:
          Number(attendeeId) === PARTICIPANT_ROLE.AGENDA_CONTRIBUTOR,
        isPrimaryOrganizer: false,
        isChat,
        isVideoCall: isVideo,
        talkGroupID: talkGroupId,
      },
      viewTab,
    );
  };

  // Resolves to the validated link data, or null when the token is invalid /
  // expired / the request fails (never throws, callers just stop on null).
  const validateMeetingLink = async (token) => {
    try {
      const getResponse = await dispatch(
        validateEncryptedStringViewMeetingLinkApi(token, navigate, t),
      );
      if (getResponse?.isExecuted && getResponse?.responseCode === 1) {
        return getResponse.response;
      }
    } catch (error) {
      console.error("View meeting link error:", error);
    }
    return null;
  };

  // Every storage key in storageKeys is removed afterwards (success or
  // failure) so a stale token can't re-open the meeting on the next
  // visit/login. openData lets Committee/Group open their container first.
  const handleEncryptedMeetingLink = async (
    token,
    storageKeys,
    viewTab,
    openData = openMeetingFromLinkData,
  ) => {
    try {
      const data = await validateMeetingLink(token);
      if (data) await openData(data, viewTab);
    } catch (error) {
      console.error("View meeting link error:", error);
    } finally {
      [].concat(storageKeys).forEach((key) => localStorage.removeItem(key));
    }
  };

  return {
    openMeetingFromLinkData,
    validateMeetingLink,
    handleEncryptedMeetingLink,
  };
};
