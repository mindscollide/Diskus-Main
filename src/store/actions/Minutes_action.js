import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import {
  listOfDefaultRejectionComments,
  pendingApprovalsCount,
  getMinuteReviewStatsForOrganizerByMeetingId,
} from "../../commen/apis/Api_config";
import { workflowApi } from "../../commen/apis/Api_ends_points";

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

const deleteCommentMeetingModal = (response) => {
  return {
    type: actions.DELETE_COMMENT_MEETING_MODAL,
    response: response,
  };
};

const pendingApprovalGraph = (response) => {
  return {
    type: actions.PENDING_APPROVAL_GRAPH_DATA,
    response: response,
  };
};

const getListOfDefaultRejectionComments_Init = () => {
  return {
    type: actions.GET_LISTOFDEFAULTREJECTIONCOMMENTS_INIT,
  };
};

const getListOfDefaultRejectionComments_Success = (response, message) => {
  return {
    type: actions.GET_LISTOFDEFAULTREJECTIONCOMMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

const getListOfDefaultRejectionComments_Fail = (message, response) => {
  return {
    type: actions.GET_LISTOFDEFAULTREJECTIONCOMMENTS_FAIL,
    message: message,
    response: response,
  };
};

const ListOfDefaultRejectionComments = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getListOfDefaultRejectionComments_Init());
    let form = new FormData();
    form.append("RequestMethod", listOfDefaultRejectionComments.RequestMethod);
    axios({
      method: "post",
      url: workflowApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(ListOfDefaultRejectionComments(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ListOfDefaultRejectinComments_01".toLowerCase()
                )
            ) {
              dispatch(
                getListOfDefaultRejectionComments_Success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ListOfDefaultRejectinComments_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                getListOfDefaultRejectionComments_Fail(
                  t("No-data-available", data)
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ListOfDefaultRejectinComments_03".toLowerCase()
                )
            ) {
              dispatch(
                getListOfDefaultRejectionComments_Fail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                getListOfDefaultRejectionComments_Fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              getListOfDefaultRejectionComments_Fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getListOfDefaultRejectionComments_Fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getListOfDefaultRejectionComments_Fail(t("Something-went-wrong"))
        );
      });
  };
};

const getPendingApprovalsCount_Init = () => {
  return {
    type: actions.GET_PENDINGAPPROVALSCOUNT_INIT,
  };
};

const getPendingApprovalsCount_Success = (response, message) => {
  return {
    type: actions.GET_PENDINGAPPROVALSCOUNT_SUCCESS,
    response: response,
    message: message,
  };
};

const getPendingApprovalsCount_Fail = (message, response) => {
  return {
    type: actions.GET_PENDINGAPPROVALSCOUNT_FAIL,
    message: message,
    response: response,
  };
};

const GetPendingApprovalsCount = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getPendingApprovalsCount_Init());
    let form = new FormData();
    form.append("RequestMethod", pendingApprovalsCount.RequestMethod);
    axios({
      method: "post",
      url: workflowApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetPendingApprovalsCount(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_PendingApprovalsCount_01".toLowerCase()
                )
            ) {
              dispatch(
                getPendingApprovalsCount_Success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_PendingApprovalsCount_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                getPendingApprovalsCount_Fail(t("No-data-available", data))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_PendingApprovalsCount_03".toLowerCase()
                )
            ) {
              dispatch(
                getPendingApprovalsCount_Fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getPendingApprovalsCount_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(getPendingApprovalsCount_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getPendingApprovalsCount_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getPendingApprovalsCount_Fail(t("Something-went-wrong")));
      });
  };
};

const getMinuteReviewStatsForOrganizerByMeetingId_Init = () => {
  return {
    type: actions.GET_MINUTEREVIEWSTATSFORORGANIZERBYMEETINGID_INIT,
  };
};

const getMinuteReviewStatsForOrganizerByMeetingId_Success = (
  response,
  message
) => {
  return {
    type: actions.GET_MINUTEREVIEWSTATSFORORGANIZERBYMEETINGID_SUCCESS,
    response: response,
    message: message,
  };
};

const getMinuteReviewStatsForOrganizerByMeetingId_Fail = (
  message,
  response
) => {
  return {
    type: actions.GET_MINUTEREVIEWSTATSFORORGANIZERBYMEETINGID_FAIL,
    message: message,
    response: response,
  };
};

const GetMinuteReviewStatsForOrganizerByMeetingId = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMinuteReviewStatsForOrganizerByMeetingId_Init());
    let form = new FormData();
    form.append("RequestMethod", pendingApprovalsCount.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: workflowApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            GetMinuteReviewStatsForOrganizerByMeetingId(Data, navigate, t)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewStatsForOrganizerByMeetingId_01".toLowerCase()
                )
            ) {
              dispatch(
                getMinuteReviewStatsForOrganizerByMeetingId_Success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewStatsForOrganizerByMeetingId_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                getMinuteReviewStatsForOrganizerByMeetingId_Fail(
                  t("Minute-review-flow-stats-not-available", data)
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewStatsForOrganizerByMeetingId_03".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                getMinuteReviewStatsForOrganizerByMeetingId_Fail(
                  t("Minute-review-flow-not-found", data)
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewStatsForOrganizerByMeetingId_04".toLowerCase()
                )
            ) {
              dispatch(
                getMinuteReviewStatsForOrganizerByMeetingId_Fail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                getMinuteReviewStatsForOrganizerByMeetingId_Fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              getMinuteReviewStatsForOrganizerByMeetingId_Fail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            getMinuteReviewStatsForOrganizerByMeetingId_Fail(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          getMinuteReviewStatsForOrganizerByMeetingId_Fail(
            t("Something-went-wrong")
          )
        );
      });
  };
};

export {
  pendingApprovalPage,
  reviewMinutesPage,
  rejectCommentModal,
  editCommentModal,
  deleteCommentModal,
  deleteCommentMeetingModal,
  pendingApprovalGraph,
  ListOfDefaultRejectionComments,
  GetPendingApprovalsCount,
  GetMinuteReviewStatsForOrganizerByMeetingId,
};
