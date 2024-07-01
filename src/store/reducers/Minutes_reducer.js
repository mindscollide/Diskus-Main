import * as actions from "../action_types";

const initialState = {
  Loading: false,
  showPendingApprovalsPage: true,
  showReviewMinutesPage: false,
  rejectCommentModal: false,
  editCommentModal: false,
  deleteCommentModal: false,
  deleteMeetingCommentModal: false,
  pendingApprovalGraphReducerData: {
    progressValues: [
      {
        numericValue: "03",
        percentageValue: 60,
      },
      {
        numericValue: "03",
        percentageValue: 30,
      },
      {
        numericValue: "02",
        percentageValue: 10,
      },
    ],
  },
  pendingApprovalTableReducerData: [
    {
      key: "1",
      name: "Board Member Executive Meeting from Boss's and hahahahahaha",
      userEmail: "john.doe@example.com",
      status: "Pending",
      leaveTime: "20220317121056",
    },
    {
      key: "2",
      name: "IT Departmental Meeting",
      userEmail: "john.doe@example.com",
      status: "Pending",
      leaveTime: "20220608204140",
    },
    {
      key: "3",
      name: "John Doe",
      userEmail: "john.doe@example.com",
      status: "Reviewed",
      leaveTime: "20200428025823",
    },
    {
      key: "4",
      name: "Stock and Shareholders Meeting",
      userEmail: "jane.smith@example.com",
      status: "Expired",
      leaveTime: "20220421055658",
    },
    {
      key: "5",
      name: "Board Member Executive Meeting from Boss's",
      userEmail: "michael.johnson@example.com",
      status: "Expired",
      leaveTime: "20230521200335",
    },
    {
      key: "6",
      name: "Board Member Executive Meeting from Boss's",
      userEmail: "emily.brown@example.com",
      status: "Reviewed",
      leaveTime: "20240908034555",
    },
  ],
  minutesDataAgendaWise: [
    {
      title: "Introduction",
      description:
        "Design phase completed, moving to development, discussed resource reallocation to address delays and decided unknown unknown printer took a galley of type a printer took a galley of type a to hold daily check-ins for quicker progress Design phase completed, moving to development, discussed resource reallocation to address delays and decided unknown unknown printer took a galley of type a printer took a galley of type a to hold daily check-ins for quicker progress Design phase completed, moving to development, discussed resource reallocation to address delays and decided unknown unknown printer took a galley of type a printer took a galley of type a to update.",
      attachments: [
        {
          name: "Dummy File.pdf",
        },
        {
          name: "Dummy File 2.pdf",
        },
        {
          name: "Dummy File 3.pdf",
        },
      ],
      uploader: {
        name: "Alex Rodriguez",
        avatar: "DefaultAvatar",
        uploaded_time: "4:00pm",
        uploaded_date: "18th May, 2024",
      },
      minuteID: 24,
      agendaID: 2451,
      subMinutes: [
        {
          title: "CEO Speech",
          description:
            "Design phase completed, moving to development, discussed resource reallocation to address delays and decided unknown unknown printer took a galley of type a printer took a galley of type a to hold daily check-ins for quicker progress Design phase completed, moving to development, discussed resource reallocation to address delays and decided unknown unknown printer took a galley of type a printer took a galley of type a to hold daily check-ins for quicker progress Design phase completed, moving to development, discussed resource reallocation to address delays and decided unknown unknown printer took a galley of type a printer took a galley of type a to update.",
          attachments: [],
          minuteID: 25,
          agendaID: 2454,
          uploader: {
            name: "Alex Rodriguez",
            avatar: "DefaultAvatar",
            uploaded_time: "4:00pm",
            uploaded_date: "18th May, 2024",
          },
        },
      ],
    },
    {
      title: "Introduction 2",
      description:
        "2222 Design phase completed, moving to development, discussed resource reallocation to address delays and decided unknown unknown printer took a galley of type a printer took a galley of type a to hold daily check-ins for quicker progress Design phase completed, moving to development, discussed resource reallocation to address delays and decided unknown unknown printer took a galley of type a printer took a galley of type a to hold daily check-ins for quicker progress Design phase completed, moving to development, discussed resource reallocation to address delays and decided unknown unknown printer took a galley of type a printer took a galley of type a to update.",
      attachments: [],
      uploader: {
        name: "Alex Rodriguez",
        avatar: "DefaultAvatar",
        uploaded_time: "4:00pm",
        uploaded_date: "18th May, 2024",
      },
      minuteID: 26,
      agendaID: 2459,
      subMinutes: [],
    },
  ],
  allMinutesAG: {
    agendaWise: [
      {
        title: "Agenda Item 1",
        id: 81,
        items: [
          {
            id: 1,
            description:
              "Introduction to the first agenda item. Introduction to the first agenda item. Introduction to the first agenda item. Introduction to the first agenda item. Introduction to the first agenda item. Introduction to the first agenda item. Introduction to the first agenda item. Introduction to the first agenda item. Introduction to the first agenda item. ",
            attachments: [],
          },
          {
            id: 2,
            description:
              "Discussion on the challenges faced and greetings to participants.",
            attachments: [],
          },
          {
            id: 3,
            description:
              "Updates on tasks and decisions made regarding project progress and delays.",
            attachments: [
              { fileName: "Annual Report 1.pdf" },
              { fileName: "Annual Report 2.pdf" },
            ],
          },
        ],
        subItems: [
          {
            title: "Sub Item 1.1: Overview",
            id: 82,

            items: [
              {
                id: 4,
                description: "Summary of the sub-item's main points.",
                attachments: [],
              },
              {
                id: 5,
                description: "Further discussion on challenges and greetings.",
                attachments: [],
              },
              {
                id: 6,
                description:
                  "Additional points discussed with relevant attachments.",
                attachments: [
                  { fileName: "Annual Report 1.pdf" },
                  { fileName: "Annual Report 2.pdf" },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Agenda Item 2",
        id: 83,

        items: [
          {
            id: 7,
            description: "Introduction to the second agenda item.",
            attachments: [],
          },
          {
            id: 8,
            description: "Discussion on further challenges and greetings.",
            attachments: [],
          },
          {
            id: 9,
            description: "Continued updates on tasks and project decisions.",
            attachments: [
              { fileName: "Annual Report 1.pdf" },
              { fileName: "Annual Report 2.pdf" },
            ],
          },
        ],
        subItems: [],
      },
    ],
    general: [
      {
        id: 10,
        description: "General introduction to the meeting.",
        attachments: [],
      },
      {
        id: 11,
        description: "General discussion on meeting challenges and greetings.",
        attachments: [],
      },
      {
        id: 12,
        description: "General updates on tasks and decisions made.",
        attachments: [
          { fileName: "Annual Report 1.pdf" },
          { fileName: "Annual Report 2.pdf" },
        ],
      },
    ],
  },
  ListOfDefaultRejectionCommentsData: null,
  PendingApprovalCountData: 0,
  GetMinuteReviewStatsForOrganizerByMeetingIdData: null,
  GetAllOrganizationUsersForReviewData: null,
  GetMinutesForReviewerByMeetingIdData: null,
  GetMinuteReviewPendingApprovalsStatsByReviewerIdData: null,
  GetMinuteReviewPendingApprovalsByReviewerIdData: null,
  currentMeetingMinutesToReview: null,
  SaveMinutesReviewFlowData: null,
  DeleteMinuteReducerData: null,
};

const MinutesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.PENDING_APPROVAL_PAGE: {
      return {
        ...state,
        showPendingApprovalsPage: action.response,
      };
    }

    case actions.REVIEW_MINUTES_PAGE: {
      return {
        ...state,
        showReviewMinutesPage: action.response,
      };
    }

    case actions.REJECT_COMMENT_MODAL: {
      return {
        ...state,
        rejectCommentModal: action.response,
      };
    }

    case actions.EDIT_COMMENT_MODAL: {
      return {
        ...state,
        editCommentModal: action.response,
      };
    }

    case actions.DELETE_COMMENT_MODAL: {
      return {
        ...state,
        deleteCommentModal: action.response,
      };
    }

    case actions.DELETE_COMMENT_MEETING_MODAL: {
      return {
        ...state,
        deleteMeetingCommentModal: action.response,
      };
    }

    case actions.PENDING_APPROVAL_GRAPH_DATA: {
      return {
        ...state,
        deleteMeetingCommentModal: action.response,
      };
    }

    case actions.CURRENT_MEETING_MINUTE_REVIEW: {
      return {
        ...state,
        currentMeetingMinutesToReviewData: action.response,
      };
    }

    case actions.GET_LISTOFDEFAULTREJECTIONCOMMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_LISTOFDEFAULTREJECTIONCOMMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ListOfDefaultRejectionCommentsData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_LISTOFDEFAULTREJECTIONCOMMENTS_FAIL: {
      return {
        ...state,
        Loading: false,
        ListOfDefaultRejectionCommentsData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_PENDINGAPPROVALSCOUNT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_PENDINGAPPROVALSCOUNT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        PendingApprovalCountData: action.response.pendingApprovalsCount,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_PENDINGAPPROVALSCOUNT_FAIL: {
      return {
        ...state,
        Loading: false,
        PendingApprovalCountData: 0,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MINUTEREVIEWSTATSFORORGANIZERBYMEETINGID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_MINUTEREVIEWSTATSFORORGANIZERBYMEETINGID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetMinuteReviewStatsForOrganizerByMeetingIdData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_MINUTEREVIEWSTATSFORORGANIZERBYMEETINGID_FAIL: {
      return {
        ...state,
        Loading: false,
        GetMinuteReviewStatsForOrganizerByMeetingIdData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALLORGANIZATIONUSERSFORREVIEW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ALLORGANIZATIONUSERSFORREVIEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetAllOrganizationUsersForReviewData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ALLORGANIZATIONUSERSFORREVIEW_FAIL: {
      return {
        ...state,
        Loading: false,
        GetAllOrganizationUsersForReviewData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MINUTESFORREVIEWERBYMEETINGID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_MINUTESFORREVIEWERBYMEETINGID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetMinutesForReviewerByMeetingIdData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_MINUTESFORREVIEWERBYMEETINGID_FAIL: {
      return {
        ...state,
        Loading: false,
        GetMinutesForReviewerByMeetingIdData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MINUTEREVIEWPENDINGAPPROVALSSTATSBYREVIEWERID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_MINUTEREVIEWPENDINGAPPROVALSSTATSBYREVIEWERID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetMinuteReviewPendingApprovalsStatsByReviewerIdData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_MINUTEREVIEWPENDINGAPPROVALSSTATSBYREVIEWERID_FAIL: {
      return {
        ...state,
        Loading: false,
        GetMinuteReviewPendingApprovalsStatsByReviewerIdData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MINUTEREVIEWPENDINGAPPROVALSBYREVIEWERID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_MINUTEREVIEWPENDINGAPPROVALSBYREVIEWERID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetMinuteReviewPendingApprovalsByReviewerIdData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_MINUTEREVIEWPENDINGAPPROVALSBYREVIEWERID_FAIL: {
      return {
        ...state,
        Loading: false,
        GetMinuteReviewPendingApprovalsByReviewerIdData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_MINUTESREVIEWFLOW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVE_MINUTESREVIEWFLOW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SaveMinutesReviewFlowData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_MINUTESREVIEWFLOW_FAIL: {
      return {
        ...state,
        Loading: false,
        SaveMinutesReviewFlowData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_MINUTE_DATA: {
      return {
        ...state,
        DeleteMinuteReducerData: action.response,
      };
    }

    default:
      return { ...state };
  }
};

export default MinutesReducer;
