  // ─── Helpers ──────────────────────────────────────────────────────────────

  export const buildEditorRole = (record) => ({
    status: record.status,
    role: record.isParticipant
      ? "Participant"
      : record.isAgendaContributor
        ? "Agenda Contributor"
        : "Organizer",
    isPrimaryOrganizer: record.isPrimaryOrganizer,
  });

  export const buildVideoTalk = (record) => ({
    isChat: record.isChat,
    isVideoCall: record.isVideoCall,
    talkGroupID: record.talkGroupID,
  });

 export  const setMeetingLocalStorage = (record) => {
    localStorage.setItem("videoCallURL", record.videoCallURL);
    localStorage.setItem("isMinutePublished", record.isMinutePublished);
    localStorage.setItem("meetingTitle", record.title);
  };
