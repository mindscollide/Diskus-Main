import axios from "axios";
import {
  savePollsRequestMethod,
  getAllCommittesandGroupsforPolls,
  searcPollsRequestMethod,
  castVote,
  getAllPollStatus,
  getPollByPollID,
  updatePolls,
  viewvotes,
  deltePolls,
} from "../../commen/apis/Api_config";
import { pollApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";
import { message } from "antd";

// search Poll Init
const searchPolls_init = () => {
  return {
    type: actions.SEARCH_POLLS_INIT,
  };
};

// search Poll Success
const searchPolls_success = (response, message) => {
  return {
    type: actions.SEARCH_POLLS_SUCCESS,
    response: response,
    message: message,
  };
};

// search Poll Fail
const searchPolls_fail = (message) => {
  return {
    type: actions.SEARCH_POLLS_FAIL,
    message: message,
  };
};

const setCreatePollModal = (response) => {
  return {
    type: actions.CREATE_POOL_MODAL,
    response: response,
  };
};

const setEditpollModal = (response) => {
  return {
    type: actions.EDIT_POLL_MODAL,
    response: response,
  };
};

const setviewpollModal = (response) => {
  return {
    type: actions.VIEW_POLL_MODAL,
    response: response,
  };
};

const setviewpollProgressModal = (response) => {
  return {
    type: actions.VIEW_POLL_PROGRESS,
    response: response,
  };
};

const viewVotesDetailsModal = (response) => {
  return {
    type: actions.VIEW_VOTES_DETAILS,
    response: response,
  };
};

const setVotePollModal = (response) => {
  return {
    type: actions.VOTE_POLL_MODAL,
    response: response,
  };
};

const setDeltePollModal = (response) => {
  return {
    type: actions.DELETE_POLL_MODAL,
    response: response,
  };
};

const globalFlag = (response) => {
  return {
    type: actions.GLOBAL_FLAG,
    response: response,
  };
};

const LoaderState = () => {
  return {
    type: actions.LOADDER_STATE,
  };
};

// search Polls
const searchPollsApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = parseInt(localStorage.getItem("userID"));
  let OrganizationID = parseInt(localStorage.getItem("organizationID"));

  return (dispatch) => {
    dispatch(searchPolls_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", searcPollsRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: pollApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(searchPollsApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SearchPolls_01".toLowerCase()
                )
            ) {
              dispatch(
                searchPolls_success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SearchPolls_02".toLowerCase()
                )
            ) {
              dispatch(searchPolls_fail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SearchPolls_03".toLowerCase()
                )
            ) {
              dispatch(searchPolls_fail(t("Something-went-wrong")));
            } else {
              dispatch(searchPolls_fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(searchPolls_fail(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(searchPolls_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(searchPolls_fail(t("Something-went-wrong")));
      });
  };
};

//Delete Polls

const deltePollsInit = () => {
  return {
    type: actions.DELETE_POLL_INIT,
  };
};

const deltePollsSuccess = (response, message) => {
  return {
    type: actions.DELETE_POLL_SUCCESS,
    response: response,
    message: message,
  };
};

const deltePollsFailed = (message) => {
  return {
    type: actions.DELETE_POLL_FAILED,
    message: message,
  };
};

//Delete polls APi

const UpdatePollStatusByPollIdApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = parseInt(localStorage.getItem("userID"));
  let OrganizationID = parseInt(localStorage.getItem("organizationID"));
  return (dispatch) => {
    dispatch(deltePollsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", deltePolls.RequestMethod);
    axios({
      method: "post",
      url: pollApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(UpdatePollStatusByPollIdApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_UpdatePollStatusByPollId_01".toLowerCase()
                )
            ) {
              dispatch(
                deltePollsSuccess(
                  response.data.responseResult,
                  t("Poll Status Updated Successfully")
                )
              );
              let Data = {
                UserID: parseInt(createrID),
                OrganizationID: parseInt(OrganizationID),
                CreatorName: "",
                PageNumber: 1,
                Length: 50,
              };
              dispatch(setDeltePollModal(false));
              dispatch(searchPollsApi(navigate, t, Data));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_UpdatePollStatusByPollId_02".toLowerCase()
                )
            ) {
              dispatch(setDeltePollModal(false));
              dispatch(deltePollsFailed(t("Poll Status Not Updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_UpdatePollStatusByPollId_03".toLowerCase()
                )
            ) {
              dispatch(deltePollsFailed(t("Something-went-wrong")));
            } else {
              dispatch(deltePollsFailed(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(deltePollsFailed(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(deltePollsFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(deltePollsFailed(t("Something-went-wrong")));
      });
  };
};

// save poll Init
const savePolls_init = () => {
  return {
    type: actions.SEARCH_POLLS_INIT,
  };
};

// save poll success
const savePolls_success = (response, message) => {
  return {
    type: actions.SEARCH_POLLS_SUCCESS,
    response: response,
    message: message,
  };
};

// save poll fail
const savePolls_fail = (message) => {
  return {
    type: actions.SEARCH_POLLS_FAIL,
    message: message,
  };
};

// Save polls Api
const SavePollsApi = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(savePolls_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", savePollsRequestMethod.RequestMethod);
    await axios({
      method: "post",
      url: pollApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SavePollsApi(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("Polls_PollsServiceManager_SavePoll_01".toLowerCase())
            ) {
              await dispatch(
                savePolls_success(
                  response.data.responseResult,
                  t("Poll-created")
                )
              );
              let userID = localStorage.getItem("userID");
              let organizationID = localStorage.getItem("organizationID");
              let data = {
                UserID: parseInt(userID),
                OrganizationID: parseInt(organizationID),
                CreatorName: "",
                PageNumber: 1,
                Length: 50,
              };
              await dispatch(searchPollsApi(navigate, t, data));
              dispatch(setCreatePollModal(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("Polls_PollsServiceManager_SavePoll_02".toLowerCase())
            ) {
              dispatch(savePolls_fail(t("Poll-not-created")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("Polls_PollsServiceManager_SavePoll_03".toLowerCase())
            ) {
              dispatch(savePolls_fail(t("Poll-not-created")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("Polls_PollsServiceManager_SavePoll_04".toLowerCase())
            ) {
              dispatch(savePolls_fail(t("Poll-not-created")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("Polls_PollsServiceManager_SavePoll_05".toLowerCase())
            ) {
              dispatch(
                savePolls_fail(
                  t("Participant-list-of-consists-of-duplicate-members")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("Polls_PollsServiceManager_SavePoll_06".toLowerCase())
            ) {
              dispatch(
                savePolls_fail(t("There-must-be-at-least-two-poll-options"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes("Polls_PollsServiceManager_SavePoll_07".toLowerCase())
            ) {
              dispatch(savePolls_fail(t("Something-went-wrong")));
            } else {
              dispatch(savePolls_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(savePolls_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(savePolls_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(savePolls_fail(t("Something-went-wrong")));
      });
  };
};

const castVoteInit = () => {
  return {
    type: actions.CAST_VOTE_INIT,
  };
};

const castVoteSuccess = (action, message) => {
  return {
    type: actions.CAST_VOTE_SUCCESS,
    action: action,
    message: message,
  };
};

const castVoteFailed = (message) => {
  return {
    type: actions.CAST_VOTE_FAIL,
    message: message,
  };
};

const castVoteApi = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(castVoteInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", castVote.RequestMethod);
    await axios({
      method: "post",
      url: pollApi,
      data: form,
      headers: {
        _token: token,
      },
    }).then(async (response) => {
      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        dispatch(castVoteApi(navigate, data, t));
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_CastVote_01".toLowerCase())
          ) {
            await dispatch(
              castVoteSuccess(response.data.responseResult, t("Vote-casted"))
            );
            let organizationID = localStorage.getItem("organizationID");
            let userID = localStorage.getItem("userID");
            let data = {
              UserID: parseInt(userID),
              OrganizationID: parseInt(organizationID),
              CreatorName: "",
              PageNumber: 1,
              Length: 50,
            };
            dispatch(setEditpollModal(false));
            dispatch(setCreatePollModal(false));
            dispatch(setviewpollProgressModal(false));
            dispatch(globalFlag(false));
            dispatch(viewVotesDetailsModal(false));
            dispatch(setviewpollModal(false));
            dispatch(setVotePollModal(false));
            dispatch(searchPollsApi(navigate, t, data));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_CastVote_02".toLowerCase())
          ) {
            dispatch(castVoteFailed(t("No-vote-casted")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_CastVote_03".toLowerCase())
          ) {
            dispatch(castVoteFailed(t("Please-choose-a-suitable-option")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_CastVote_04".toLowerCase())
          ) {
            dispatch(
              castVoteFailed(t("You-are-only-allowed-to-select-one-answer"))
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_CastVote_05".toLowerCase())
          ) {
            dispatch(castVoteFailed(t("Exception-Some-thing-went-wrong")));
          }else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_CastVote_06".toLowerCase())
          ) {
            dispatch(castVoteFailed(t("The-poll-is-not-published")));
            dispatch(setEditpollModal(false));
            dispatch(setCreatePollModal(false));
            dispatch(setviewpollProgressModal(false));
            dispatch(globalFlag(false));
            dispatch(viewVotesDetailsModal(false));
            dispatch(setviewpollModal(false));
            dispatch(setVotePollModal(false));
          }else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_CastVote_07".toLowerCase())
          ) {
            dispatch(castVoteFailed(t("The-poll-due-date-has-been-passed")));
            dispatch(setEditpollModal(false));
            dispatch(setCreatePollModal(false));
            dispatch(setviewpollProgressModal(false));
            dispatch(globalFlag(false));
            dispatch(viewVotesDetailsModal(false));
            dispatch(setviewpollModal(false));
            dispatch(setVotePollModal(false));
          }else {
            dispatch(castVoteFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(castVoteFailed(t("Something-went-wrong")));
        }
      } else {
        dispatch(castVoteFailed(t("Something-went-wrong")));
      }
    });
  };
};

const getAllPollsStatusInit = () => {
  return {
    type: actions.GET_ALL_POLL_STATUS_INIT,
  };
};

const getAllPollsStatusSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_POLL_STATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllPollsStatusFailed = (message) => {
  return {
    type: actions.GET_ALL_POLL_STATUS_FAILED,
    message: message,
  };
};

const getAllPollsStatusApi = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(getAllPollsStatusInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", getAllPollStatus.RequestMethod);
    await axios({
      method: "post",
      url: pollApi,
      data: form,
      headers: {
        _token: token,
      },
    }).then(async (response) => {
      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        dispatch(getAllPollsStatusApi(navigate, data, t));
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetAllPollStatus_01".toLowerCase()
              )
          ) {
            await dispatch(
              getAllPollsStatusSuccess(
                response.data.responseResult,
                t("Record-found")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetAllPollStatus_02".toLowerCase()
              )
          ) {
            dispatch(getAllPollsStatusFailed(t("No-record-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetAllPollStatus_03".toLowerCase()
              )
          ) {
            dispatch(getAllPollsStatusFailed(t("Exception")));
          }
        } else {
          dispatch(getAllPollsStatusFailed(t("Something-went-wrong")));
        }
      } else {
        dispatch(getAllPollsStatusFailed(t("Something-went-wrong")));
      }
    });
  };
};

const getAllPollsByPollsIDInit = () => {
  return {
    type: actions.GET_POLLS_BY_POLLID_INIT,
  };
};

const getAllPollsByPollsIDSuccess = (response, message) => {
  return {
    type: actions.GET_POLLS_BY_POLLID_SUCCESS,
    response: response,
    message: message,
  };
};

const getAllPollsByPollsIDFailed = (message) => {
  return {
    type: actions.GET_POLLS_BY_POLLID_FAILED,
    message: message,
  };
};

const getPollsByPollIdApi = (navigate, data, check, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(getAllPollsByPollsIDInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", getPollByPollID.RequestMethod);
    await axios({
      method: "post",
      url: pollApi,
      data: form,
      headers: {
        _token: token,
      },
    }).then(async (response) => {
      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        dispatch(getPollsByPollIdApi(navigate, data, check, t));
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_01".toLowerCase()
              )
          ) {
            if (parseInt(check) === 1) {
              await dispatch(setviewpollModal(false));
              await dispatch(setCreatePollModal(false));
              await dispatch(setviewpollProgressModal(false));
              await dispatch(viewVotesDetailsModal(false));
              await dispatch(setVotePollModal(false));
              await dispatch(globalFlag(true));
              await dispatch(setEditpollModal(true));
              console.log("handleEditpollModal", check);
            } else if (parseInt(check) === 2) {
              await dispatch(setviewpollModal(false));
              await dispatch(setCreatePollModal(false));
              await dispatch(setviewpollProgressModal(false));
              await dispatch(globalFlag(false));
              await dispatch(viewVotesDetailsModal(false));
              await dispatch(setVotePollModal(false));
              await dispatch(setEditpollModal(true));
              console.log("handleEditpollModal", check);
            } else if (parseInt(check) === 3) {
              await dispatch(setEditpollModal(false));
              await dispatch(setCreatePollModal(false));
              await dispatch(setviewpollModal(false));
              await dispatch(viewVotesDetailsModal(false));
              await dispatch(globalFlag(false));
              await dispatch(setVotePollModal(false));
              await dispatch(setviewpollProgressModal(true));
              console.log("handleEditpollModal", check);
            } else if (parseInt(check) === 4) {
              await dispatch(setEditpollModal(false));
              await dispatch(setCreatePollModal(false));
              await dispatch(setviewpollProgressModal(false));
              await dispatch(globalFlag(false));
              await dispatch(viewVotesDetailsModal(false));
              await dispatch(setVotePollModal(false));
              await dispatch(setviewpollModal(true));
              console.log("handleEditpollModal", check);
            } else if (parseInt(check) === 5) {
              await dispatch(setEditpollModal(false));
              await dispatch(setCreatePollModal(false));
              await dispatch(setviewpollProgressModal(false));
              await dispatch(globalFlag(false));
              await dispatch(viewVotesDetailsModal(false));
              await dispatch(setviewpollModal(false));
              await dispatch(setVotePollModal(true));
            }
            await dispatch(
              getAllPollsByPollsIDSuccess(
                response.data.responseResult,
                t("Record-found")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_02".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("No-record-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_03".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("No-record-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_04".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("Exception")));
          }
        } else {
          dispatch(getAllPollsByPollsIDFailed(t("Something-went-wrong")));
        }
      } else {
        dispatch(getAllPollsByPollsIDFailed(t("Something-went-wrong")));
      }
    });
  };
};

const viewVotesInit = () => {
  return {
    type: actions.VIEW_VOTES_INIT,
  };
};

const viewVotesSuccess = (response, message) => {
  console.log("handleClosed", response);
  console.log("handleClosed", message);

  return {
    type: actions.VIEW_VOTES_SUCCESS,
    response: response,
    message: message,
  };
};

const viewVoteFailed = (message) => {
  return {
    type: actions.VIEW_VOTES_FAILED,
    message: message,
  };
};

const viewVotesApi = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(viewVotesInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", viewvotes.RequestMethod);
    await axios({
      method: "post",
      url: pollApi,
      data: form,
      headers: {
        _token: token,
      },
    }).then(async (response) => {
      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        dispatch(viewVotesApi(navigate, data, t));
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_ViewVotes_01".toLowerCase())
          ) {
            await dispatch(setEditpollModal(false));
            await dispatch(setCreatePollModal(false));
            await dispatch(setviewpollModal(false));
            await dispatch(globalFlag(false));
            await dispatch(setviewpollProgressModal(false));
            await dispatch(
              viewVotesSuccess(
                response.data.responseResult.voteDetails,
                t("Record-found")
              )
            );
            console.log("handleClosed", response.data.responseResult);

            await dispatch(viewVotesDetailsModal(true));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_ViewVotes_02".toLowerCase())
          ) {
            dispatch(viewVoteFailed(t("No-record-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_ViewVotes_03".toLowerCase())
          ) {
            dispatch(viewVoteFailed(t("No-record-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_ViewVotes_04".toLowerCase())
          ) {
            dispatch(viewVoteFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(viewVoteFailed(t("Something-went-wrong")));
        }
      } else {
        dispatch(viewVoteFailed(t("Something-went-wrong")));
      }
    });
  };
};

const getAllcommittesandGroups_init = () => {
  return {
    type: actions.GETALLCOMMITESANDGROUPSFORPOLLS_INIT,
  };
};
const getAllcommittesandGroups_success = (response, message) => {
  return {
    type: actions.GETALLCOMMITESANDGROUPSFORPOLLS_SUCCESS,
    response: response,
    message: message,
  };
};
const getAllcommittesandGroups_fail = (message) => {
  return {
    type: actions.GETALLCOMMITESANDGROUPSFORPOLLS_FAIL,
    message: message,
  };
};
const getAllCommitteesandGroups = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = parseInt(localStorage.getItem("organizationID"));
  let Data = {
    OrganizationID: OrganizationID,
  };
  return (dispatch) => {
    dispatch(getAllcommittesandGroups_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      getAllCommittesandGroupsforPolls.RequestMethod
    );
    axios({
      method: "post",
      url: pollApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllCommitteesandGroups(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_01".toLowerCase()
                )
            ) {
              dispatch(
                getAllcommittesandGroups_success(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_02".toLowerCase()
                )
            ) {
              dispatch(getAllcommittesandGroups_fail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_03".toLowerCase()
                )
            ) {
              dispatch(
                getAllcommittesandGroups_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                getAllcommittesandGroups_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(getAllcommittesandGroups_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getAllcommittesandGroups_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllcommittesandGroups_fail(t("Something-went-wrong")));
      });
  };
};

const updatePollsInit = () => {
  return {
    type: actions.UPDATE_POLLS_INIT,
  };
};

const updatePollsSuccess = (response, message) => {
  return {
    type: actions.UPDATE_POLLS_SUCCESS,
    response: response,
    message: message,
  };
};

const updatePollsFailed = (message) => {
  return {
    type: actions.UPDATE_POLLS_FAILED,
    message: message,
  };
};

const updatePollsApi = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(updatePollsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", updatePolls.RequestMethod);
    await axios({
      method: "post",
      url: pollApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updatePollsApi(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_UpdatePoll_01".toLowerCase()
                )
            ) {
              await dispatch(
                updatePollsSuccess(
                  response.data.responseResult,
                  t("Polls-due-date-update-successFully")
                )
              );
              let userID = localStorage.getItem("userID");
              let organizationID = localStorage.getItem("organizationID");
              let data = {
                UserID: parseInt(userID),
                OrganizationID: parseInt(organizationID),
                CreatorName: "",
                PageNumber: 1,
                Length: 50,
              };
              await dispatch(searchPollsApi(navigate, t, data));
              dispatch(setEditpollModal(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_UpdatePoll_02".toLowerCase()
                )
            ) {
              dispatch(updatePollsFailed(t("Poll-not-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_UpdatePoll_03".toLowerCase()
                )
            ) {
              dispatch(
                updatePollsSuccess(
                  response.data.responseResult,
                  t("Poll-details-updated")
                )
              );
              let userID = localStorage.getItem("userID");
              let organizationID = localStorage.getItem("organizationID");
              let data = {
                UserID: parseInt(userID),
                OrganizationID: parseInt(organizationID),
                CreatorName: "",
                PageNumber: 1,
                Length: 50,
              };
              await dispatch(searchPollsApi(navigate, t, data));
              dispatch(setEditpollModal(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_UpdatePoll_04".toLowerCase()
                )
            ) {
              dispatch(
                updatePollsFailed(t("There-must-be-atleast-two-Poll-options"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_UpdatePoll_05".toLowerCase()
                )
            ) {
              dispatch(
                updatePollsFailed(
                  t("Participant-list-consists-of-duplicate-members")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_UpdatePoll_06".toLowerCase()
                )
            ) {
              dispatch(updatePollsFailed(t("Exception")));
            } else {
              dispatch(updatePollsFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(updatePollsFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(updatePollsFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(updatePollsFailed(t("Something-went-wrong")));
      });
  };
};

export {
  searchPollsApi,
  SavePollsApi,
  getAllCommitteesandGroups,
  setCreatePollModal,
  LoaderState,
  setEditpollModal,
  globalFlag,
  castVoteApi,
  getPollsByPollIdApi,
  updatePollsApi,
  setviewpollModal,
  setVotePollModal,
  setviewpollProgressModal,
  viewVotesDetailsModal,
  viewVotesApi,
  setDeltePollModal,
  UpdatePollStatusByPollIdApi,
};
