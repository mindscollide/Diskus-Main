// import { isArray } from "lodash"

const getUserInfo = (data, currentUserId) => {
  const userInfo = {
    isAgendaContributor: false,
    isOrganiser: false,
    isParticipant: false,
    userData: null,
  };

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
    }
  });

  return userInfo;
};

export const getAllUnpublishedMeetingData = async (meetingData) => {
  let currentUserId = Number(localStorage.getItem("userID"));

  let newMeetingData = [];
  if (Array.isArray(meetingData) && meetingData?.length > 0) {
    meetingData.forEach(async (data, index) => {
      const primaryOrganizerA = data.meetingAttendees.find(
        (item) => item.isPrimaryOrganizer === true
      );
      const meetingAgendaLength =
        data.meetingAgenda !== null &&
        data.meetingAgenda !== undefined &&
        data.meetingAgenda.length > 0
          ? true
          : false;

      let usersData = await getUserInfo(data, currentUserId);
      newMeetingData.push({
        dateOfMeeting: data.dateOfMeeting,
        host: primaryOrganizerA?.user?.name,
        isAttachment: data.isAttachment,
        isChat: data.isChat,
        isVideoCall: data.isVideoCall,
        isQuickMeeting: data.isQuickMeeting,
        meetingAgenda: meetingAgendaLength,
        isOrganizer: usersData?.isOrganiser,
        isAgendaContributor: usersData?.isAgendaContributor,
        isParticipant: usersData?.isParticipant,
        talkGroupID: data.talkGroupID,
        meetingType: data.meetingTypeID,
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
        userDetails: usersData?.userData,
      });
    });
  }
  return newMeetingData;
};
