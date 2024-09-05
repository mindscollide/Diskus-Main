import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import {
  listOfDefaultRejectionComments,
  pendingApprovalsCount,
  getMinuteReviewStatsForOrganizerByMeetingId,
  getAllOrganizationUsersForReview,
  getMinutesForReviewerByMeetingId,
  getMinuteReviewPendingApprovalsStatsByReviewerId,
  getMinuteReviewPendingApprovalsByReviewerId,
  saveMinutesReviewFlow,
  getPendingApprovalStatusesForMinuteReview,
  acceptRejectMinuteReview,
  resendUpdatedMinuteForReview,
  getMinuteVersionHistoryWithComments,
  getMinuteReviewFlowByMeetingId,
  updateCommentForRejectedMinute,
  getMinuteReviewDetailsForOrganizerByMinuteId,
  deleteMinuteReviewByReviewer,
  PublishMeetingMinutesRM,
  GetAllPublishedMeetingMinutesRM,
  publishMeetingMinutes,
  getDataForResendMinuteReview,
  getMinuteAndSignatureApprovalThisWeekRM,
  getStatsForPublishingMinutesByWorkFlowId,
} from "../../commen/apis/Api_config";
import { meetingApi, workflowApi } from "../../commen/apis/Api_ends_points";
import {
  AllDocumentsForAgendaWiseMinutesApiFunc,
  DocumentsOfMeetingGenralMinutesApiFunc,
  GetAllAgendaWiseMinutesApiFunc,
  GetAllGeneralMinutesApiFunc,
} from "./NewMeetingActions";

// Pendin Approval Page Route
const pendingApprovalPage = (response) => {
  return {
    type: actions.PENDING_APPROVAL_PAGE,
    response: response,
  };
};

// Review Minutes Page Route
const reviewMinutesPage = (response) => {
  return {
    type: actions.REVIEW_MINUTES_PAGE,
    response: response,
  };
};

// reject comment modal
const rejectCommentModal = (response) => {
  return {
    type: actions.REJECT_COMMENT_MODAL,
    response: response,
  };
};

// Edit Comment Modal
const editCommentModal = (response) => {
  return {
    type: actions.EDIT_COMMENT_MODAL,
    response: response,
  };
};

//Delete Comment Modal
const deleteCommentModal = (response) => {
  return {
    type: actions.DELETE_COMMENT_MODAL,
    response: response,
  };
};

//Delete Comment Modal
const acceptCommentModal = (response) => {
  return {
    type: actions.ACCEPT_COMMENT_MODAL,
    response: response,
  };
};

//Delete Comment Modal
const deleteCommentModalGeneral = (response) => {
  return {
    type: actions.DELETE_COMMENT_GENERAL_MODAL,
    response: response,
  };
};

//Delete Comment Modal
const deleteCommentModalAgenda = (response) => {
  return {
    type: actions.DELETE_COMMENT_AGENDA_MODAL,
    response: response,
  };
};

// Delete Comment Meeting Modal
const deleteCommentMeetingModal = (response) => {
  return {
    type: actions.DELETE_COMMENT_MEETING_MODAL,
    response: response,
  };
};

//Pending Approval graph data
const pendingApprovalGraph = (response) => {
  return {
    type: actions.PENDING_APPROVAL_GRAPH_DATA,
    response: response,
  };
};

//Current User Profile Picture
const currentUserPicture = (response) => {
  return {
    type: actions.CURRENT_USER_PICTURE,
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

//ListOfDefaultRejectionComments
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
                  ""
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

// GetPendingApprovalsCount
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
                  ""
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

//GetMinuteReviewStatsForOrganizerByMeetingId
const GetMinuteReviewStatsForOrganizerByMeetingId = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMinuteReviewStatsForOrganizerByMeetingId_Init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getMinuteReviewStatsForOrganizerByMeetingId.RequestMethod
    );
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
                  ""
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

const getAllOrganizationUsersForReview_Init = () => {
  return {
    type: actions.GET_ALLORGANIZATIONUSERSFORREVIEW_INIT,
  };
};

const getAllOrganizationUsersForReview_Success = (response, message) => {
  return {
    type: actions.GET_ALLORGANIZATIONUSERSFORREVIEW_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllOrganizationUsersForReview_Fail = (message, response) => {
  return {
    type: actions.GET_ALLORGANIZATIONUSERSFORREVIEW_FAIL,
    message: message,
    response: response,
  };
};

//GetAllOrganizationUsersForReview
const GetAllOrganizationUsersForReview = (navigate, t, setAllReviewers) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getAllOrganizationUsersForReview_Init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getAllOrganizationUsersForReview.RequestMethod
    );
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
            GetAllOrganizationUsersForReview(navigate, t, setAllReviewers)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllOrganizationUsersForReview_01".toLowerCase()
                )
            ) {
              setAllReviewers(response.data.responseResult.organizationUsers);
              dispatch(
                getAllOrganizationUsersForReview_Success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllOrganizationUsersForReview_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                getAllOrganizationUsersForReview_Fail(
                  t("No-data-available", data)
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetAllOrganizationUsersForReview_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllOrganizationUsersForReview_Fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAllOrganizationUsersForReview_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getAllOrganizationUsersForReview_Fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getAllOrganizationUsersForReview_Fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getAllOrganizationUsersForReview_Fail(t("Something-went-wrong"))
        );
      });
  };
};

const getMinutesForReviewerByMeetingId_Init = () => {
  return {
    type: actions.GET_MINUTESFORREVIEWERBYMEETINGID_INIT,
  };
};

const getMinutesForReviewerByMeetingId_Success = (response, message) => {
  return {
    type: actions.GET_MINUTESFORREVIEWERBYMEETINGID_SUCCESS,
    response: response,
    message: message,
  };
};

const getMinutesForReviewerByMeetingId_Fail = (message, response) => {
  return {
    type: actions.GET_MINUTESFORREVIEWERBYMEETINGID_FAIL,
    message: message,
    response: response,
  };
};

//GetMinutesForReviewerByMeetingId
const GetMinutesForReviewerByMeetingId = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMinutesForReviewerByMeetingId_Init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getMinutesForReviewerByMeetingId.RequestMethod
    );
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
          dispatch(GetMinutesForReviewerByMeetingId(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinutesForReviewerByMeetingId_01".toLowerCase()
                )
            ) {
              dispatch(
                getMinutesForReviewerByMeetingId_Success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinutesForReviewerByMeetingId_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                getMinutesForReviewerByMeetingId_Fail(
                  t("No-data-available", data)
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinutesForReviewerByMeetingId_03".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                getMinutesForReviewerByMeetingId_Fail(
                  t("Minute-review-flow-not-found"),
                  data
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinutesForReviewerByMeetingId_04".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                getMinutesForReviewerByMeetingId_Fail(
                  t("User-has-not-been-assigned-any-minutes-to-review"),
                  data
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinutesForReviewerByMeetingId_05".toLowerCase()
                )
            ) {
              dispatch(
                getMinutesForReviewerByMeetingId_Fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getMinutesForReviewerByMeetingId_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getMinutesForReviewerByMeetingId_Fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getMinutesForReviewerByMeetingId_Fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getMinutesForReviewerByMeetingId_Fail(t("Something-went-wrong"))
        );
      });
  };
};

const getMinuteReviewPendingApprovalsStatsByReviewerId_Init = () => {
  return {
    type: actions.GET_MINUTEREVIEWPENDINGAPPROVALSSTATSBYREVIEWERID_INIT,
  };
};

const getMinuteReviewPendingApprovalsStatsByReviewerId_Success = (
  response,
  message
) => {
  return {
    type: actions.GET_MINUTEREVIEWPENDINGAPPROVALSSTATSBYREVIEWERID_SUCCESS,
    response: response,
    message: message,
  };
};

const getMinuteReviewPendingApprovalsStatsByReviewerId_Fail = (
  message,
  response
) => {
  return {
    type: actions.GET_MINUTEREVIEWPENDINGAPPROVALSSTATSBYREVIEWERID_FAIL,
    message: message,
    response: response,
  };
};

//GetMinuteReviewPendingApprovalsStatsByReviewerId
const GetMinuteReviewPendingApprovalsStatsByReviewerId = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMinuteReviewPendingApprovalsStatsByReviewerId_Init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getMinuteReviewPendingApprovalsStatsByReviewerId.RequestMethod
    );
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
            GetMinuteReviewPendingApprovalsStatsByReviewerId(navigate, t)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewPendingApprovalsStatsByReviewerId_01".toLowerCase()
                )
            ) {
              dispatch(
                getMinuteReviewPendingApprovalsStatsByReviewerId_Success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewPendingApprovalsStatsByReviewerId_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                getMinuteReviewPendingApprovalsStatsByReviewerId_Fail(
                  t("No-data-available", data)
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewPendingApprovalsStatsByReviewerId_03".toLowerCase()
                )
            ) {
              dispatch(
                getMinuteReviewPendingApprovalsStatsByReviewerId_Fail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                getMinuteReviewPendingApprovalsStatsByReviewerId_Fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              getMinuteReviewPendingApprovalsStatsByReviewerId_Fail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            getMinuteReviewPendingApprovalsStatsByReviewerId_Fail(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          getMinuteReviewPendingApprovalsStatsByReviewerId_Fail(
            t("Something-went-wrong")
          )
        );
      });
  };
};

const getMinuteReviewPendingApprovalsByReviewerId_Init = () => {
  return {
    type: actions.GET_MINUTEREVIEWPENDINGAPPROVALSBYREVIEWERID_INIT,
  };
};

const getMinuteReviewPendingApprovalsByReviewerId_Success = (
  response,
  message
) => {
  return {
    type: actions.GET_MINUTEREVIEWPENDINGAPPROVALSBYREVIEWERID_SUCCESS,
    response: response,
    message: message,
  };
};

const getMinuteReviewPendingApprovalsByReviewerId_Fail = (
  message,
  response
) => {
  return {
    type: actions.GET_MINUTEREVIEWPENDINGAPPROVALSBYREVIEWERID_FAIL,
    message: message,
    response: response,
  };
};

//Get Minute REviewPendingApprovalByReviewerID
const GetMinuteReviewPendingApprovalsByReviewerId = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMinuteReviewPendingApprovalsByReviewerId_Init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getMinuteReviewPendingApprovalsByReviewerId.RequestMethod
    );
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
            GetMinuteReviewPendingApprovalsByReviewerId(Data, navigate, t)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewPendingApprovalsByReviewerId_01".toLowerCase()
                )
            ) {
              dispatch(
                getMinuteReviewPendingApprovalsByReviewerId_Success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewPendingApprovalsByReviewerId_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                getMinuteReviewPendingApprovalsByReviewerId_Fail(
                  t("No-data-available", data)
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewPendingApprovalsByReviewerId_03".toLowerCase()
                )
            ) {
              dispatch(
                getMinuteReviewPendingApprovalsByReviewerId_Fail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                getMinuteReviewPendingApprovalsByReviewerId_Fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              getMinuteReviewPendingApprovalsByReviewerId_Fail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            getMinuteReviewPendingApprovalsByReviewerId_Fail(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          getMinuteReviewPendingApprovalsByReviewerId_Fail(
            t("Something-went-wrong")
          )
        );
      });
  };
};

//Current Minutes To Review (Reducer Data)
const currentMeetingMinutesToReview = (response) => {
  return {
    type: actions.CURRENT_MEETING_MINUTE_REVIEW,
    response: response,
  };
};

const saveMinutesReviewFlow_Init = () => {
  return {
    type: actions.SAVE_MINUTESREVIEWFLOW_INIT,
  };
};

const saveMinutesReviewFlow_Success = (response, message) => {
  return {
    type: actions.SAVE_MINUTESREVIEWFLOW_SUCCESS,
    response: response,
    message: message,
  };
};

const saveMinutesReviewFlow_Fail = (message, response) => {
  return {
    type: actions.SAVE_MINUTESREVIEWFLOW_FAIL,
    message: message,
    response: response,
  };
};

//SaveMinutesReviewFlow
const SaveMinutesReviewFlow = (Data, navigate, t, setAddReviewers) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(saveMinutesReviewFlow_Init());
    let form = new FormData();
    form.append("RequestMethod", saveMinutesReviewFlow.RequestMethod);
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
          dispatch(SaveMinutesReviewFlow(Data, navigate, t, setAddReviewers));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveMinutesReviewFlow_01".toLowerCase()
                )
            ) {
              dispatch(
                saveMinutesReviewFlow_Success(
                  response.data.responseResult,
                  t("Minutes-review-flow-inserted-successfully")
                )
              );
              let Data2 = {
                isAgenda: false,
                MeetingID: Data.MeetingID,
              };
              let Data3 = {
                isAgenda: true,
                MeetingID: Data.MeetingID,
              };
              let reviewFlowData = {
                MeetingID: Data.MeetingID,
              };
              dispatch(
                GetMinuteReviewStatsForOrganizerByMeetingId(Data2, navigate, t)
              );
              dispatch(
                GetMinuteReviewStatsForOrganizerByMeetingId(Data3, navigate, t)
              );
              dispatch(
                GetMinuteReviewFlowByMeetingId(reviewFlowData, navigate, t)
              );

              setAddReviewers(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveMinutesReviewFlow_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(saveMinutesReviewFlow_Fail(t("Insertion-failed", data)));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveMinutesReviewFlow_03".toLowerCase()
                )
            ) {
              dispatch(saveMinutesReviewFlow_Fail(t("Flow-not-found-to-edit")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveMinutesReviewFlow_04".toLowerCase()
                )
            ) {
              dispatch(
                saveMinutesReviewFlow_Success(
                  response.data.responseResult,
                  t("Minutes-review-flow-edited-successfully")
                )
              );
              let Data2 = {
                isAgenda: false,
                MeetingID: Data.MeetingID,
              };
              let Data3 = {
                isAgenda: true,
                MeetingID: Data.MeetingID,
              };
              dispatch(
                GetMinuteReviewStatsForOrganizerByMeetingId(Data2, navigate, t)
              );
              dispatch(
                GetMinuteReviewStatsForOrganizerByMeetingId(Data3, navigate, t)
              );
              setAddReviewers(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveMinutesReviewFlow_05".toLowerCase()
                )
            ) {
              dispatch(saveMinutesReviewFlow_Fail(t("Invalid-data-provided")));
              setAddReviewers(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveMinutesReviewFlow_06".toLowerCase()
                )
            ) {
              dispatch(saveMinutesReviewFlow_Fail(t("Something-went-wrong")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveMinutesReviewFlow_07".toLowerCase()
                )
            ) {
              dispatch(
                saveMinutesReviewFlow_Fail(t("Flow-deleted-successfully"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveMinutesReviewFlow_08".toLowerCase()
                )
            ) {
              dispatch(
                saveMinutesReviewFlow_Fail(t("Error-while-saving-flow"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_SaveMinutesReviewFlow_09".toLowerCase()
                )
            ) {
              dispatch(saveMinutesReviewFlow_Fail(t("Deadline-not-provided")));
            } else {
              dispatch(saveMinutesReviewFlow_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveMinutesReviewFlow_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveMinutesReviewFlow_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(saveMinutesReviewFlow_Fail(t("Something-went-wrong")));
      });
  };
};

const GetMinuteVersionHistorywithComments_init = () => {
  return {
    type: actions.GETMINUTEVERSIONHISTORYWITHCOMMENTS_INIT,
  };
};
const GetMinuteVersionHistorywithComments_success = (response, message) => {
  return {
    type: actions.GETMINUTEVERSIONHISTORYWITHCOMMENTS_SUCCESS,
    response: response,
    message: message,
  };
};
const GetMinuteVersionHistorywithComments_fail = (message) => {
  return {
    type: actions.GETMINUTEVERSIONHISTORYWITHCOMMENTS_FAIL,
    message,
  };
};

const GetMinutesVersionHistoryWithCommentsApi = (
  Data,
  navigate,
  t,
  setShowVersionHistory
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(GetMinuteVersionHistorywithComments_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getMinuteVersionHistoryWithComments.RequestMethod
    );
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
            GetMinutesVersionHistoryWithCommentsApi(
              Data,
              navigate,
              t,
              setShowVersionHistory
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteVersionHistoryWithComments_01".toLowerCase()
                )
            ) {
              dispatch(
                GetMinuteVersionHistorywithComments_success(
                  response.data.responseResult,
                  ""
                )
              );
              setShowVersionHistory(true);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteVersionHistoryWithComments_02".toLowerCase()
                )
            ) {
              dispatch(
                GetMinuteVersionHistorywithComments_fail(
                  t("No-version-history-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteVersionHistoryWithComments_03".toLowerCase()
                )
            ) {
              dispatch(
                GetMinuteVersionHistorywithComments_fail(
                  t("Minute-review-flow-not-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteVersionHistoryWithComments_04".toLowerCase()
                )
            ) {
              dispatch(
                GetMinuteVersionHistorywithComments_fail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                GetMinuteVersionHistorywithComments_fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              GetMinuteVersionHistorywithComments_fail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            GetMinuteVersionHistorywithComments_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetMinuteVersionHistorywithComments_fail(t("Something-went-wrong"))
        );
      });
  };
};

const GetMinuteReviewDetailsByOrganizerByMinuteId_init = () => {
  return {
    type: actions.GETMINUTEREVIEWDETAILSFORORGANIZATIONBYMINUTEID_INIT,
  };
};
const GetMinuteReviewDetailsByOrganizerByMinuteId_success = (
  response,
  message
) => {
  return {
    type: actions.GETMINUTEREVIEWDETAILSFORORGANIZATIONBYMINUTEID_SUCCESS,
    response: response,
    message: message,
  };
};
const GetMinuteReviewDetailsByOrganizerByMinuteId_fail = (message) => {
  return {
    type: actions.GETMINUTEREVIEWDETAILSFORORGANIZATIONBYMINUTEID_FAIL,
    message: message,
  };
};

const GetMinuteReviewDetailsByOrganizerByMinuteId_Api = (
  Data,
  navigate,
  t,
  setShowRevisionHistory
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(GetMinuteReviewDetailsByOrganizerByMinuteId_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getMinuteReviewDetailsForOrganizerByMinuteId.RequestMethod
    );
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
            GetMinuteReviewDetailsByOrganizerByMinuteId_Api(
              Data,
              navigate,
              t,
              setShowRevisionHistory
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewDetailsForOrganizerByMinuteId_01".toLowerCase()
                )
            ) {
              dispatch(
                GetMinuteReviewDetailsByOrganizerByMinuteId_success(
                  response.data.responseResult,
                  ""
                )
              );
              setShowRevisionHistory(true);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewDetailsForOrganizerByMinuteId_02".toLowerCase()
                )
            ) {
              dispatch(GetMinuteReviewDetailsByOrganizerByMinuteId_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewDetailsForOrganizerByMinuteId_03".toLowerCase()
                )
            ) {
              dispatch(
                GetMinuteReviewDetailsByOrganizerByMinuteId_fail(
                  t("Minute-review-flow-not-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteReviewDetailsForOrganizerByMinuteId_04".toLowerCase()
                )
            ) {
              dispatch(
                GetMinuteReviewDetailsByOrganizerByMinuteId_fail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                GetMinuteReviewDetailsByOrganizerByMinuteId_fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              GetMinuteReviewDetailsByOrganizerByMinuteId_fail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            GetMinuteReviewDetailsByOrganizerByMinuteId_fail(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetMinuteReviewDetailsByOrganizerByMinuteId_fail(
            t("Something-went-wrong")
          )
        );
      });
  };
};

//Delete Minute Data
const DeleteMinuteReducer = (response) => {
  return {
    type: actions.DELETE_MINUTE_DATA,
    response: response,
  };
};

//Minute to Edit
const EditSingleMinute = (response) => {
  return {
    type: actions.EDIT_MINUTE_DATA,
    response: response,
  };
};

//Update Minute Flag
const UpdateMinuteFlag = (response) => {
  return {
    type: actions.UPDATE_MINUTE_FLAG,
    response: response,
  };
};

const getMinuteReviewFlowByMeetingId_Init = () => {
  return {
    type: actions.GET_MINUTEREVIEWFLOWBYMEETINGID_INIT,
  };
};

const getMinuteReviewFlowByMeetingId_Success = (response, message) => {
  console.log("GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId");
  try {
    console.log("GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId");
    return {
      type: actions.GET_MINUTEREVIEWFLOWBYMEETINGID_SUCCESS,
      response: response,
      message: message,
    };
  } catch (error) {
    console.log(
      "GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId",
      error
    );
  }
};

const getMinuteReviewFlowByMeetingId_Fail = (message, response) => {
  return {
    type: actions.GET_MINUTEREVIEWFLOWBYMEETINGID_FAIL,
    message: message,
    response: response,
  };
};

//GetMinuteReviewFlowByMeetingId
const GetMinuteReviewFlowByMeetingId = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getMinuteReviewFlowByMeetingId_Init());
    let form = new FormData();
    form.append("RequestMethod", getMinuteReviewFlowByMeetingId.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    try {
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
            dispatch(GetMinuteReviewFlowByMeetingId(Data, navigate, t));
          } else if (response.data.responseCode === 200) {
            if (response.data.responseResult.isExecuted === true) {
              if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_GetMinuteReviewFlowByMeetingId_01".toLowerCase()
                  )
              ) {
                console.log(
                  "GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId",
                  response
                );
                try {
                  dispatch(
                    getMinuteReviewFlowByMeetingId_Success(
                      response.data.responseResult,
                      ""
                    )
                  );
                } catch (error) {
                  console.log(
                    "GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId",
                    error
                  );
                }
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_GetMinuteReviewFlowByMeetingId_02".toLowerCase()
                  )
              ) {
                console.log(
                  "GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId",
                  response
                );
                let data = [];
                dispatch(
                  getMinuteReviewFlowByMeetingId_Fail(
                    t("No-data-available", data)
                  )
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_GetMinuteReviewFlowByMeetingId_03".toLowerCase()
                  )
              ) {
                console.log(
                  "GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId",
                  response
                );
                let data = [];
                dispatch(
                  getMinuteReviewFlowByMeetingId_Fail(
                    t("Minute-review-flow-not-found"),
                    data
                  )
                );
              } else if (
                response.data.responseResult.responseMessage
                  .toLowerCase()
                  .includes(
                    "WorkFlow_WorkFlowServiceManager_GetMinuteReviewFlowByMeetingId_04".toLowerCase()
                  )
              ) {
                console.log(
                  "GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId",
                  response
                );
                dispatch(
                  getMinuteReviewFlowByMeetingId_Fail(t("Something-went-wrong"))
                );
              } else {
                console.log(
                  "GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId",
                  response
                );
                dispatch(
                  getMinuteReviewFlowByMeetingId_Fail(t("Something-went-wrong"))
                );
              }
            } else {
              console.log(
                "GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId",
                response
              );
              dispatch(
                getMinuteReviewFlowByMeetingId_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            console.log(
              "GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId",
              response
            );
            dispatch(
              getMinuteReviewFlowByMeetingId_Fail(t("Something-went-wrong"))
            );
          }
        })
        .catch((response) => {
          console.log(
            "GetMinuteReviewFlowByMeetingIdGetMinuteReviewFlowByMeetingId",
            response
          );
          dispatch(
            getMinuteReviewFlowByMeetingId_Fail(t("Something-went-wrong"))
          );
        });
    } catch (error) {
      console.log("GetMinuteReviewFlowByMeetingId", error);
    }
  };
};

const MeetingPublishedMinutes_init = () => {
  return {
    type: actions.PUBLISHEDMEETINGMINUTES_INIT,
  };
};

const MeetingPublishedMinutes_success = (response, message) => {
  return {
    type: actions.PUBLISHEDMEETINGMINUTES_SUCCESS,
    reponse: response,
    message: message,
  };
};
const MeetingPublishedMinutes_fail = (message) => {
  return {
    type: actions.PUBLISHEDMEETINGMINUTES_FAIL,
    message: message,
  };
};

const MeetingPublishedMinutesApi = (
  Data,
  navigate,
  t,
  setApprovalModal,
  setPublishAnywayModal
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(MeetingPublishedMinutes_init());
    let form = new FormData();
    form.append("RequestMethod", PublishMeetingMinutesRM.RequestMethod);
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
            MeetingPublishedMinutesApi(
              Data,
              navigate,
              t,
              setApprovalModal,
              setPublishAnywayModal
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_PublishMeetingMinutes_01".toLowerCase()
                )
            ) {
              dispatch(
                MeetingPublishedMinutes_success(
                  response.data.responseResult,
                  t("Published-successful")
                )
              );
              setApprovalModal(false);
              setPublishAnywayModal(false);
              localStorage.setItem("isMinutePublished", true);
              dispatch(GetPublishedMeetingMinutesApi(Data, navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_PublishMeetingMinutes_02".toLowerCase()
                )
            ) {
              dispatch(
                MeetingPublishedMinutes_fail(t("Published-Unsuccessful"))
              );
              setApprovalModal(false);
              setPublishAnywayModal(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_PublishMeetingMinutes_03".toLowerCase()
                )
            ) {
              setApprovalModal(false);
              setPublishAnywayModal(false);
              dispatch(MeetingPublishedMinutes_fail(t("Something-went-wrong")));
            } else {
              dispatch(MeetingPublishedMinutes_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(MeetingPublishedMinutes_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(MeetingPublishedMinutes_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(MeetingPublishedMinutes_fail(t("Something-went-wrong")));
        console.log("MeetingPublishedMinutesApi", response);
      });
  };
};

const GetPublishedMeetingMinutes_init = () => {
  return {
    type: actions.GETPUBLISHEDMEETINGMINUTES_INIT,
  };
};
const GetPublishedMeetingMinutes_success = (response, message) => {
  return {
    type: actions.GETPUBLISHEDMEETINGMINUTES_SUCCESS,
    response: response,
    message: message,
  };
};

const GetPublishedMeetingMinutes_fail = (message) => {
  return {
    type: actions.GETPUBLISHEDMEETINGMINUTES_FAIL,
    message: message,
  };
};

const GetPublishedMeetingMinutesApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(GetPublishedMeetingMinutes_init());
    let form = new FormData();
    form.append("RequestMethod", GetAllPublishedMeetingMinutesRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetPublishedMeetingMinutesApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllPublishedMinutes_01".toLowerCase()
                )
            ) {
              dispatch(
                GetPublishedMeetingMinutes_success(
                  response.data.responseResult,
                  t("Record-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllPublishedMinutes_02".toLowerCase()
                )
            ) {
              dispatch(
                GetPublishedMeetingMinutes_fail(t("No-record-available"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetAllPublishedMinutes_03".toLowerCase()
                )
            ) {
              dispatch(
                GetPublishedMeetingMinutes_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                GetPublishedMeetingMinutes_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              GetPublishedMeetingMinutes_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(GetPublishedMeetingMinutes_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(GetPublishedMeetingMinutes_fail(t("Something-went-wrong")));
      });
  };
};

const CleareMessegeMinutes = () => {
  return {
    type: actions.CLEAR_MINUTES_MESSAGES,
  };
};

//Accept Reject Minutes
const acceptRejectMinuteReview_Init = () => {
  return {
    type: actions.ACCEPT_REJECT_MINUTESREVIEW_INIT,
  };
};

const acceptRejectMinuteReview_Success = (response, message) => {
  return {
    type: actions.ACCEPT_REJECT_MINUTESREVIEW_SUCCESS,
    response: response,
    message: message,
  };
};

const acceptRejectMinuteReview_Fail = (message, response) => {
  return {
    type: actions.ACCEPT_REJECT_MINUTESREVIEW_FAIL,
    message: message,
    response: response,
  };
};

//AcceptRejectMinuteReview
const AcceptRejectMinuteReview = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(acceptRejectMinuteReview_Init());
    let form = new FormData();
    form.append("RequestMethod", acceptRejectMinuteReview.RequestMethod);
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
          dispatch(AcceptRejectMinuteReview(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_AcceptRejectMinuteReview_01".toLowerCase()
                )
            ) {
              dispatch(
                acceptRejectMinuteReview_Success(
                  response.data.responseResult,
                  t("Minute-review-saved-successfully")
                )
              );
              dispatch(reviewMinutesPage(false));
              dispatch(pendingApprovalPage(true));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_AcceptRejectMinuteReview_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(acceptRejectMinuteReview_Fail(t("Invalid-data", data)));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_AcceptRejectMinuteReview_03".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                acceptRejectMinuteReview_Fail(
                  t("Minute-review-not-saved", data)
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_AcceptRejectMinuteReview_04".toLowerCase()
                )
            ) {
              dispatch(
                acceptRejectMinuteReview_Fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                acceptRejectMinuteReview_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(acceptRejectMinuteReview_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(acceptRejectMinuteReview_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(acceptRejectMinuteReview_Fail(t("Something-went-wrong")));
      });
  };
};

const RejectMinute = (response) => {
  return {
    type: actions.REJECT_MINUTE,
    response: response,
  };
};

const publishMeetingMinutes_Init = () => {
  return {
    type: actions.PUBLISH_MEETINGMINUTES_INIT,
  };
};

const publishMeetingMinutes_Success = (response, message) => {
  return {
    type: actions.PUBLISH_MEETINGMINUTES_SUCCESS,
    response: response,
    message: message,
  };
};

const publishMeetingMinutes_Fail = (message, response) => {
  return {
    type: actions.PUBLISH_MEETINGMINUTES_FAIL,
    message: message,
    response: response,
  };
};

//publishMeetingMinutes
const PublishMeetingMinutes = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(publishMeetingMinutes_Init());
    let form = new FormData();
    form.append("RequestMethod", publishMeetingMinutes.RequestMethod);
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
          dispatch(PublishMeetingMinutes(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_PublishMeetingMinutes_01".toLowerCase()
                )
            ) {
              let data = { MeetingID: Data.MeetingID };
              dispatch(
                publishMeetingMinutes_Success(
                  response.data.responseResult,
                  t("Publish-successful")
                )
              );
              dispatch(GetPublishedMeetingMinutesApi(data, navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_PublishMeetingMinutes_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                publishMeetingMinutes_Fail(t("Publish-unsuccessful", data))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_PublishMeetingMinutes_03".toLowerCase()
                )
            ) {
              dispatch(publishMeetingMinutes_Fail(t("Something-went-wrong")));
            } else {
              dispatch(publishMeetingMinutes_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(publishMeetingMinutes_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(publishMeetingMinutes_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(publishMeetingMinutes_Fail(t("Something-went-wrong")));
      });
  };
};

const getDataForResendMinuteReview_Init = () => {
  return {
    type: actions.GET_DATAFORRESENDMINUTEREVIEW_INIT,
  };
};

const getDataForResendMinuteReview_Success = (response, message) => {
  return {
    type: actions.GET_DATAFORRESENDMINUTEREVIEW_SUCCESS,
    response: response,
    message: message,
  };
};

const getDataForResendMinuteReview_Fail = (message, response) => {
  return {
    type: actions.GET_DATAFORRESENDMINUTEREVIEW_FAIL,
    message: message,
    response: response,
  };
};

//GetDataForResendMinuteReview
const GetDataForResendMinuteReview = (Data, navigate, t, setEditMinute) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getDataForResendMinuteReview_Init());
    let form = new FormData();
    form.append("RequestMethod", getDataForResendMinuteReview.RequestMethod);
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
            GetDataForResendMinuteReview(Data, navigate, t, setEditMinute)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetActionableBundleForMinute_01".toLowerCase()
                )
            ) {
              dispatch(
                getDataForResendMinuteReview_Success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
              setEditMinute(true);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetActionableBundleForMinute_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                getDataForResendMinuteReview_Fail(
                  t("No-review-flow-in-this-meeting", data)
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetActionableBundleForMinute_03".toLowerCase()
                )
            ) {
              dispatch(
                getDataForResendMinuteReview_Fail(
                  t("This-minute-has-not-been-sent-for-review")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetActionableBundleForMinute_04".toLowerCase()
                )
            ) {
              dispatch(
                getDataForResendMinuteReview_Fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getDataForResendMinuteReview_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getDataForResendMinuteReview_Fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getDataForResendMinuteReview_Fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(getDataForResendMinuteReview_Fail(t("Something-went-wrong")));
      });
  };
};

const resendUpdatedMinuteForReview_Init = () => {
  return {
    type: actions.RESEND_UPDATEDMINUTEFORREVIEW_INIT,
  };
};

const resendUpdatedMinuteForReview_Success = (response, message) => {
  return {
    type: actions.RESEND_UPDATEDMINUTEFORREVIEW_SUCCESS,
    response: response,
    message: message,
  };
};

const resendUpdatedMinuteForReview_Fail = (message, response) => {
  return {
    type: actions.RESEND_UPDATEDMINUTEFORREVIEW_FAIL,
    message: message,
    response: response,
  };
};

//ResendUpdatedMinuteForReview
const ResendUpdatedMinuteForReview = (
  Data,
  navigate,
  t,
  setEditMinute,
  setConfirmationEdit,
  setResendMinuteForReview,
  setShowRevisionHistory,
  isAgenda
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(resendUpdatedMinuteForReview_Init());
    let form = new FormData();
    form.append("RequestMethod", resendUpdatedMinuteForReview.RequestMethod);
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
          dispatch(ResendUpdatedMinuteForReview(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ResendUpdatedMinuteForReview_01".toLowerCase()
                )
            ) {
              dispatch(
                resendUpdatedMinuteForReview_Success(
                  response.data.responseResult,
                  t("Successful")
                )
              );
              setEditMinute(false);
              setConfirmationEdit(false);
              setResendMinuteForReview(false);
              if (isAgenda === true) {
                setShowRevisionHistory(false);
                let newData = {
                  MeetingID: Data.MeetingID,
                };
                dispatch(
                  GetAllAgendaWiseMinutesApiFunc(
                    navigate,
                    newData,
                    t,
                    Data.MeetingID,
                    false,
                    false,
                    false
                  )
                );
              } else {
                let newData = {
                  MeetingID: Data.MeetingID,
                };
                setShowRevisionHistory(false);
                dispatch(
                  GetAllGeneralMinutesApiFunc(
                    navigate,
                    t,
                    newData,
                    Data.MeetingID
                  )
                );
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ResendUpdatedMinuteForReview_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(
                resendUpdatedMinuteForReview_Fail(t("Invalid-data", data))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ResendUpdatedMinuteForReview_03".toLowerCase()
                )
            ) {
              dispatch(
                resendUpdatedMinuteForReview_Fail(
                  t("Minute-review-flow-not-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ResendUpdatedMinuteForReview_04".toLowerCase()
                )
            ) {
              dispatch(resendUpdatedMinuteForReview_Fail(t("Unsuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ResendUpdatedMinuteForReview_05".toLowerCase()
                )
            ) {
              dispatch(
                resendUpdatedMinuteForReview_Fail(t("Something-went-wrong"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_ResendUpdatedMinuteForReview_06".toLowerCase()
                )
            ) {
              dispatch(
                resendUpdatedMinuteForReview_Fail(
                  t("Deadline-cannot-be-in-past")
                )
              );
            } else {
              dispatch(
                resendUpdatedMinuteForReview_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              resendUpdatedMinuteForReview_Fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            resendUpdatedMinuteForReview_Fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(resendUpdatedMinuteForReview_Fail(t("Something-went-wrong")));
      });
  };
};

const getPendingApprovalStatsThisWeek_Init = () => {
  return {
    type: actions.GETMINUTESANDSIGNATUREAPPROVALTHISWEEK_INIT,
  };
};

const getPendingApprovalStatsThisWeek_Success = (response, message) => {
  return {
    type: actions.GETMINUTESANDSIGNATUREAPPROVALTHISWEEK_SUCCESS,
    response: response,
    message: message,
  };
};

const getPendingApprovalStatsThisWeek_Fail = (message, response) => {
  return {
    type: actions.GETMINUTESANDSIGNATUREAPPROVALTHISWEEK_FAIL,
    message: message,
    response: response,
  };
};

//ResendUpdatedMinuteForReview
const getPendingApprovalStatsThisWeekApi = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getPendingApprovalStatsThisWeek_Init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getMinuteAndSignatureApprovalThisWeekRM.RequestMethod
    );
    // form.append("RequestData", JSON.stringify(Data));
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
          dispatch(getPendingApprovalStatsThisWeekApi(Data, navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteAndSignatureApprovalsThisWeek_01".toLowerCase()
                )
            ) {
              dispatch(
                getPendingApprovalStatsThisWeek_Success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteAndSignatureApprovalsThisWeek_02".toLowerCase()
                )
            ) {
              dispatch(getPendingApprovalStatsThisWeek_Fail(t("")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetMinuteAndSignatureApprovalsThisWeek_03".toLowerCase()
                )
            ) {
              dispatch(
                getPendingApprovalStatsThisWeek_Fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getPendingApprovalStatsThisWeek_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              getPendingApprovalStatsThisWeek_Fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            getPendingApprovalStatsThisWeek_Fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          getPendingApprovalStatsThisWeek_Fail(t("Something-went-wrong"))
        );
      });
  };
};

const getStatsForPublishingMinutesByWorkFlowId_Init = () => {
  return {
    type: actions.GET_STATSFORPUBLISHINGMINUTESBYWORKFLOWID_INIT,
  };
};

const getStatsForPublishingMinutesByWorkFlowId_Success = (
  response,
  message
) => {
  return {
    type: actions.GET_STATSFORPUBLISHINGMINUTESBYWORKFLOWID_SUCCESS,
    response: response,
    message: message,
  };
};

const getStatsForPublishingMinutesByWorkFlowId_Fail = (message, response) => {
  return {
    type: actions.GET_STATSFORPUBLISHINGMINUTESBYWORKFLOWID_FAIL,
    message: message,
    response: response,
  };
};

//GetStatsForPublishingMinutesByWorkFlowId
const GetStatsForPublishingMinutesByWorkFlowId = (
  Data,
  navigate,
  t,
  setApprovalModal,
  setPublishAnywayModal
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getStatsForPublishingMinutesByWorkFlowId_Init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getStatsForPublishingMinutesByWorkFlowId.RequestMethod
    );
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
            GetStatsForPublishingMinutesByWorkFlowId(
              Data,
              navigate,
              t,
              setApprovalModal,
              setPublishAnywayModal
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetStatsForPublishingMinutesByWorkFlowId_01".toLowerCase()
                )
            ) {
              dispatch(
                getStatsForPublishingMinutesByWorkFlowId_Success(
                  response.data.responseResult,
                  ""
                )
              );
              setApprovalModal(true);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetStatsForPublishingMinutesByWorkFlowId_02".toLowerCase()
                )
            ) {
              dispatch(getStatsForPublishingMinutesByWorkFlowId_Fail(t("")));
              setPublishAnywayModal(true);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "WorkFlow_WorkFlowServiceManager_GetStatsForPublishingMinutesByWorkFlowId_03".toLowerCase()
                )
            ) {
              dispatch(
                getStatsForPublishingMinutesByWorkFlowId_Fail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                getStatsForPublishingMinutesByWorkFlowId_Fail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              getStatsForPublishingMinutesByWorkFlowId_Fail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            getStatsForPublishingMinutesByWorkFlowId_Fail(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          getStatsForPublishingMinutesByWorkFlowId_Fail(
            t("Something-went-wrong")
          )
        );
      });
  };
};

export {
  getPendingApprovalStatsThisWeekApi,
  GetPublishedMeetingMinutesApi,
  MeetingPublishedMinutesApi,
  DeleteMinuteReducer,
  pendingApprovalPage,
  reviewMinutesPage,
  rejectCommentModal,
  editCommentModal,
  deleteCommentModal,
  deleteCommentModalGeneral,
  deleteCommentModalAgenda,
  deleteCommentMeetingModal,
  pendingApprovalGraph,
  ListOfDefaultRejectionComments,
  GetPendingApprovalsCount,
  GetMinuteReviewStatsForOrganizerByMeetingId,
  GetAllOrganizationUsersForReview,
  GetMinutesForReviewerByMeetingId,
  GetMinuteReviewPendingApprovalsStatsByReviewerId,
  GetMinuteReviewPendingApprovalsByReviewerId,
  currentMeetingMinutesToReview,
  SaveMinutesReviewFlow,
  EditSingleMinute,
  UpdateMinuteFlag,
  GetMinutesVersionHistoryWithCommentsApi,
  GetMinuteReviewDetailsByOrganizerByMinuteId_Api,
  GetMinuteReviewFlowByMeetingId,
  CleareMessegeMinutes,
  acceptCommentModal,
  AcceptRejectMinuteReview,
  RejectMinute,
  currentUserPicture,
  PublishMeetingMinutes,
  GetDataForResendMinuteReview,
  ResendUpdatedMinuteForReview,
  GetStatsForPublishingMinutesByWorkFlowId,
};
