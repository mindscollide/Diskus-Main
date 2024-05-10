// import { isArray } from "lodash"

const getUserInfo = (data, currentUserId) => {
  const userInfo = {
    isAgendaContributor: false,
    isOrganiser: false,
    isParticipant: false,
    userData: null,
    isPrimaryOrganizer: false,
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
      if (attendee.isPrimaryOrganizer === true) {
        userInfo.isPrimaryOrganizer = true;
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
      const meetingAgendas =
        data.meetingAgenda !== null &&
        data.meetingAgenda !== undefined &&
        data.meetingAgenda.length > 0
          ? data.meetingAgenda
          : [];

      let usersData = await getUserInfo(data, currentUserId);
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
      });
    });
  }
  return newMeetingData;
};

export const mqttMeetingData = async (meetingData) => {
  let currentUserId = Number(localStorage.getItem("userID"));

  // const primaryOrganizerA = meetingData.meetingAttendees.find(
  //   (item) => item.isPrimaryOrganizer === true
  // );
  const meetingAgendas =
    meetingData.meetingAgenda !== null &&
    meetingData.meetingAgenda !== undefined &&
    meetingData.meetingAgenda.length > 0
      ? meetingData.meetingAgenda
      : [];

  // let usersData = await getUserInfo(
  //   meetingData.meetingAttendees,
  //   currentUserId
  // );
  let Data = {
    dateOfMeeting: meetingData.dateOfMeeting,
    host: meetingData?.host,
    isAttachment:
      meetingData.isAttachment !== null ? meetingData.isAttachment : false,
    isChat: meetingData.isChat !== null ? meetingData.isChat : false,
    isVideoCall:
      meetingData.isVideoCall !== null ? meetingData.isVideoCall : false,
    isQuickMeeting:
      meetingData.isQuickMeeting !== null ? meetingData.isQuickMeeting : false,
    meetingAgenda: meetingAgendas,
    isOrganizer: meetingData?.isOrganiser,
    isAgendaContributor: meetingData?.isAgendaContributor,
    isParticipant: meetingData?.isParticipant,
    talkGroupID:
      meetingData.talkGroupID !== null ? meetingData.talkGroupID : false,
    meetingType:
      meetingData.meetingTypeID === 1 && meetingData.isQuickMeeting === true
        ? 0
        : meetingData.meetingTypeID,
    meetingEndTime:
      meetingData.meetingEndTime !== null ? meetingData.meetingEndTime : false,
    meetingStartTime:
      meetingData.meetingStartTime !== null
        ? meetingData.meetingStartTime
        : false,
    pK_MDID: meetingData?.pK_MDID,
    meetingPoll: {
      totalNoOfDirectors:
        meetingData?.proposedMeetingDetail?.totalNoOfDirectors,
      totalNoOfDirectorsVoted:
        meetingData?.proposedMeetingDetail?.totalNoOfDirectorsVoted,
    },
    responseDeadLine: meetingData?.responseDeadLine,
    status: meetingData?.status,
    title: meetingData?.title,
    isPrimaryOrganizer: meetingData?.isPrimaryOrganizer,
    userDetails: meetingData?.userData,
  };
};
