import * as actions from "../action_types";

const initialState = {
  Loading: false,
  showPendingApprovalsPage: true,
  showReviewMinutesPage: false,
  rejectCommentModal: false,
  editCommentModal: false,
  deleteCommentModal: false,
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

    default:
      return { ...state };
  }
};

export default MinutesReducer;
