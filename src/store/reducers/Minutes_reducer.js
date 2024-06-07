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

    default:
      return { ...state };
  }
};

export default MinutesReducer;
