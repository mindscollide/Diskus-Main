import * as actions from "../action_types";

const initialState = {
  Loading: false,
  showPendingApprovalsPage: true,
  showReviewMinutesPage: false,
  rejectCommentModal: false,
  editCommentModal: false,
  deleteMinuteAgenda: false,
  deleteMinuteGeneral: false,
  deleteCommentModal: false,
  acceptCommentModal: false,
  deleteMeetingCommentModal: false,
  ListOfDefaultRejectionCommentsData: null,
  PendingApprovalCountData: null,
  GetMinuteReviewStatsForOrganizerByMeetingIdData: null,
  GetAllOrganizationUsersForReviewData: null,
  GetMinutesForReviewerByMeetingIdData: null,
  GetMinuteReviewPendingApprovalsStatsByReviewerIdData: null,
  GetMinuteReviewPendingApprovalsByReviewerIdData: null,
  currentMeetingMinutesToReview: null,
  SaveMinutesReviewFlowData: null,
  DeleteMinuteReducerData: null,
  EditSingleMinuteData: null,
  UpdateMinuteFlag: false,
  GetMinutesVersionHistorywithCommentsData: null,
  GetMinuteReviewDetailsForOrganizerbyMinuteId: null,
  GetMinuteReviewFlowByMeetingIdData: null,
  AcceptRejectMinuteReviewData: null,
  RejectMinuteData: null,
  PublishedMinutes: null,
  GetPublishedMinutes: null,
  CurrentUserPicture: null,
  PublishMeetingMinutesData: null,
  GetDataForResendMinuteReviewData: null,
  currentMeetingMinutesToReviewData: null,
  ResendUpdatedMinuteForReviewData: null,
  PendingApprovalStatsThisWeek: null,
  GetStatsForPublishingMinutesByWorkFlowIdData: null,
  WorkFlowActorStatusData: null,
  ResponseMessage: "",
};

const MinutesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_MINUTEREVIEWFLOWBYMEETINGID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_MINUTEREVIEWFLOWBYMEETINGID_SUCCESS: {
      try {
        return {
          ...state,
          Loading: false,
          GetMinuteReviewFlowByMeetingIdData: action.response,
          ResponseMessage: action.message,
        };
      } catch (error) {
        console.log(
          "GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId",
          error
        );
      }
    }

    case actions.GET_MINUTEREVIEWFLOWBYMEETINGID_FAIL: {
      return {
        ...state,
        GetMinuteReviewFlowByMeetingIdData: null,
        ResponseMessage: action.message,
      };
    }

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

    case actions.DELETE_COMMENT_AGENDA_MODAL: {
      return {
        ...state,
        deleteMinuteAgenda: action.response,
      };
    }

    case actions.DELETE_COMMENT_GENERAL_MODAL: {
      return {
        ...state,
        deleteMinuteGeneral: action.response,
      };
    }

    case actions.DELETE_COMMENT_MODAL: {
      return {
        ...state,
        deleteCommentModal: action.response,
      };
    }

    case actions.ACCEPT_COMMENT_MODAL: {
      return {
        ...state,
        acceptCommentModal: action.response,
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
        PendingApprovalCountData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_PENDINGAPPROVALSCOUNT_FAIL: {
      return {
        ...state,
        Loading: false,
        PendingApprovalCountData: null,
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

    case actions.EDIT_MINUTE_DATA: {
      return {
        ...state,
        EditSingleMinuteData: action.response,
      };
    }

    case actions.UPDATE_MINUTE_FLAG: {
      return {
        ...state,
        UpdateMinuteFlag: action.response,
      };
    }
    case actions.GETMINUTEVERSIONHISTORYWITHCOMMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETMINUTEVERSIONHISTORYWITHCOMMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetMinutesVersionHistorywithCommentsData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETMINUTEVERSIONHISTORYWITHCOMMENTS_FAIL: {
      return {
        ...state,
        Loading: false,
        GetMinutesVersionHistorywithCommentsData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GETMINUTEREVIEWDETAILSFORORGANIZATIONBYMINUTEID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETMINUTEREVIEWDETAILSFORORGANIZATIONBYMINUTEID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetMinuteReviewDetailsForOrganizerbyMinuteId: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETMINUTEREVIEWDETAILSFORORGANIZATIONBYMINUTEID_FAIL: {
      return {
        ...state,
        Loading: false,
        GetMinuteReviewDetailsForOrganizerbyMinuteId: null,
        ResponseMessage: action.message,
      };
    }

    case actions.PUBLISHEDMEETINGMINUTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.PUBLISHEDMEETINGMINUTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        PublishedMinutes: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.PUBLISHEDMEETINGMINUTES_FAIL: {
      return {
        ...state,
        Loading: false,
        PublishedMinutes: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETPUBLISHEDMEETINGMINUTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETPUBLISHEDMEETINGMINUTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetPublishedMinutes: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETPUBLISHEDMEETINGMINUTES_FAIL: {
      return {
        ...state,
        Loading: false,
        GetPublishedMinutes: null,
        ResponseMessage: action.message,
      };
    }

    case actions.CLEAR_MINUTES_MESSAGES: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }

    case actions.ACCEPT_REJECT_MINUTESREVIEW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ACCEPT_REJECT_MINUTESREVIEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        AcceptRejectMinuteReviewData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.ACCEPT_REJECT_MINUTESREVIEW_FAIL: {
      return {
        ...state,
        Loading: false,
        AcceptRejectMinuteReviewData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.REJECT_MINUTE: {
      return {
        ...state,
        RejectMinuteData: action.response,
      };
    }

    case actions.CURRENT_USER_PICTURE: {
      return {
        ...state,
        CurrentUserPicture: action.response,
      };
    }

    case actions.PUBLISH_MEETINGMINUTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.PUBLISH_MEETINGMINUTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        PublishMeetingMinutesData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.PUBLISH_MEETINGMINUTES_FAIL: {
      return {
        ...state,
        Loading: false,
        PublishMeetingMinutesData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_DATAFORRESENDMINUTEREVIEW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_DATAFORRESENDMINUTEREVIEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetDataForResendMinuteReviewData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_DATAFORRESENDMINUTEREVIEW_FAIL: {
      return {
        ...state,
        Loading: false,
        GetDataForResendMinuteReviewData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.RESEND_UPDATEDMINUTEFORREVIEW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.RESEND_UPDATEDMINUTEFORREVIEW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResendUpdatedMinuteForReviewData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.RESEND_UPDATEDMINUTEFORREVIEW_FAIL: {
      return {
        ...state,
        Loading: false,
        ResendUpdatedMinuteForReviewData: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETMINUTESANDSIGNATUREAPPROVALTHISWEEK_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETMINUTESANDSIGNATUREAPPROVALTHISWEEK_SUCCESS: {
      return {
        ...state,
        Loading: false,
        PendingApprovalStatsThisWeek: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETMINUTESANDSIGNATUREAPPROVALTHISWEEK_FAIL: {
      return {
        ...state,
        Loading: false,
        PendingApprovalStatsThisWeek: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_STATSFORPUBLISHINGMINUTESBYWORKFLOWID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_STATSFORPUBLISHINGMINUTESBYWORKFLOWID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetStatsForPublishingMinutesByWorkFlowIdData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_STATSFORPUBLISHINGMINUTESBYWORKFLOWID_FAIL: {
      return {
        ...state,
        Loading: false,
        GetStatsForPublishingMinutesByWorkFlowIdData: null,
        ResponseMessage: action.message,
      };
    }
    //Work Flow Actor Status
    case actions.MINUTES_WORKFLOW_ACTOR_STATUS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.MINUTES_WORKFLOW_ACTOR_STATUS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        WorkFlowActorStatusData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.MINUTES_WORKFLOW_ACTOR_STATUS_FAIL: {
      return {
        ...state,
        Loading: false,
        WorkFlowActorStatusData: null,
        ResponseMessage: action.message,
      };
    }

    default:
      return { ...state };
  }
};

export default MinutesReducer;
