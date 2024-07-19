// import { isArray } from "lodash"

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
      }
      if (data.isPrimaryOrganizer === true) {
        userInfo.isPrimaryOrganizer = true;
      }
    }
  } catch {}

  return userInfo;
};

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
        host: primaryOrganizerA?.user?.name,
        isAttachment: data.isAttachment,
        isChat: data.isChat,
        isVideoCall: data.isVideoCall,
        isQuickMeeting: data.isQuickMeeting,
        meetingAgenda: meetingAgendas,
        isOrganizer: usersData?.isOrganiser,
        isAgendaContributor: usersData?.isAgendaContributor,
        isParticipant: usersData?.isParticipant,
        talkGroupID: data.talkGroupID,
        meetingType:
          data.meetingTypeID === 1 && data.isQuickMeeting === true
            ? 0
            : data.meetingTypeID,
        meetingEndTime: data.meetingEndTime,
        meetingStartTime: data.meetingStartTime,
        pK_MDID: data.pK_MDID,
        meetingPoll: {
          totalNoOfDirectors: data.proposedMeetingDetail.totalNoOfDirectors,
          totalNoOfDirectorsVoted:
            data.proposedMeetingDetail.totalNoOfDirectorsVoted,
        },
        responseDeadLine: data.responseDeadLine,
        status: data.status,
        title: data.title,
        key: index,
        isPrimaryOrganizer: usersData?.isPrimaryOrganizer,
        userDetails: usersData?.userData,
        isMinutePublished: data?.isMinutePublished,
      });
    });
  }
  return newMeetingData;
};

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
  };

  return Data;
};
