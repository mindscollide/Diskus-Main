import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";

const pendingApprovalPage = (response) => {
  return {
    type: actions.PENDING_APPROVAL_PAGE,
    response: response,
  };
};

const reviewMinutesPage = (response) => {
  return {
    type: actions.REVIEW_MINUTES_PAGE,
    response: response,
  };
};

const rejectCommentModal = (response) => {
  return {
    type: actions.REJECT_COMMENT_MODAL,
    response: response,
  };
};

const editCommentModal = (response) => {
  return {
    type: actions.EDIT_COMMENT_MODAL,
    response: response,
  };
};

const deleteCommentModal = (response) => {
  return {
    type: actions.DELETE_COMMENT_MODAL,
    response: response,
  };
};

export {
  pendingApprovalPage,
  reviewMinutesPage,
  rejectCommentModal,
  editCommentModal,
  deleteCommentModal,
};
