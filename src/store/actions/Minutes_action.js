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

export {
    pendingApprovalPage,
    reviewMinutesPage,
};
