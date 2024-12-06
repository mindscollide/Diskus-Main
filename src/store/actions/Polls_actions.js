import axios from "axios";
import {
  savePollsRequestMethod,
  getAllCommittesandGroupsforPolls,
  searcPollsRequestMethod,
  castVote,
  getPollByPollID,
  updatePolls,
  viewvotes,
  deltePolls,
  getPollbyCommitteeIdRM,
  getPollByGroupIDApi,
  setGroupPollsApi,
  setCommitteePollsRM,
  getTaskGroupIDApi,
  setGroupTaskApi,
  getTaskByCommitteeIDApi,
  setCommitteeTaskApi,
  deleteMeetingPollsRM,
  deleteGroupPollsRM,
  deleteCommitteePollRM,
  ValidateEmailRelatedStringPolls,
} from "../../commen/apis/Api_config";
import {
  emailRouteID,
  showunsavedEditPollsMeetings,
} from "./NewMeetingActions";
import { pollApi, toDoListApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";

import {
  GetAllPollsByMeetingIdApiFunc,
  SetMeetingPollsApiFunc,
} from "./NewMeetingActions";

const clearPollsMesseges = () => {
  return {
    type: actions.CLEAR_POLLS_MESSAGES,
  };
};

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

const notifyPollingSocket = (response) => {
  return {
    type: actions.ALL_POLLINGS_SOCKET,
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
              dispatch(searchPolls_success(response.data.responseResult, ""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SearchPolls_02".toLowerCase()
                )
            ) {
              dispatch(searchPolls_fail(t("No-records-found")));
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
            dispatch(searchPolls_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(searchPolls_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
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
              let Data = {
                UserID: parseInt(createrID),
                OrganizationID: parseInt(OrganizationID),
                CreatorName: "",
                PollTitle: "",
                PageNumber: 1,
                Length: 50,
              };
              dispatch(searchPollsApi(navigate, t, Data));
              dispatch(setDeltePollModal(false));
              if (data.PollStatusID === 4) {
                dispatch(
                  deltePollsSuccess(
                    response.data.responseResult,
                    t("Poll-deleted-successfully")
                  )
                );
              } else {
                dispatch(
                  deltePollsSuccess(
                    response.data.responseResult,
                    t("Poll-status-updated-successfully")
                  )
                );
              }
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
            dispatch(deltePollsFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(deltePollsFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
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
const SavePollsApi = (navigate, Data, t, value, currentMeeting) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(savePolls_init());
    // Check if the browser is online
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
              if (value === 1) {
                let userID = localStorage.getItem("userID");
                let organizationID = localStorage.getItem("organizationID");
                let data = {
                  UserID: parseInt(userID),
                  OrganizationID: parseInt(organizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                await dispatch(searchPollsApi(navigate, t, data));
                dispatch(setCreatePollModal(false));
              } else if (value === 2) {
                let Data = {
                  MeetingID: currentMeeting,
                  PollID: response.data.responseResult.pollID,
                };
                await dispatch(
                  SetMeetingPollsApiFunc(Data, navigate, t, currentMeeting)
                );
              } else if (value === 3) {
                let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
                let Data = {
                  CommitteeID: Number(ViewCommitteeID),
                  PollID: Number(response.data.responseResult.pollID),
                };
                await dispatch(setCommitteePollsApi(navigate, t, Data));
              } else if (value === 4) {
                let ViewGroupID = localStorage.getItem("ViewGroupID");

                let Data = {
                  GroupID: Number(ViewGroupID),
                  PollID: response.data.responseResult.pollID,
                };
                await dispatch(setGroupPollsMainApi(navigate, t, Data));

                // dispatch(getPollsByGroupMainApi(navigate, t, newData));
              }
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

const castVoteApi = (
  navigate,
  data,
  t,
  check,
  setvotePolls,
  currnetMeeting
) => {
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
        dispatch(
          castVoteApi(navigate, data, t, check, setvotePolls, currnetMeeting)
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_CastVote_01".toLowerCase())
          ) {
            await dispatch(
              castVoteSuccess(
                response.data.responseResult,
                t("Your-vote-is-submitted-successfully")
              )
            );
            if (check) {
              if (check === 1) {
                //  Polls from Committees
                setvotePolls(false);
                let organizationID = localStorage.getItem("organizationID");
                let CommitteeID = localStorage.getItem("ViewCommitteeID");
                let Data = {
                  CommitteeID: Number(CommitteeID),
                  OrganizationID: Number(organizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                dispatch(GetPollsByCommitteeIDapi(navigate, t, Data));
              } else if (check === 2) {
                setvotePolls(false);
                let organizationID = localStorage.getItem("organizationID");
                let ViewGroupID = localStorage.getItem("ViewGroupID");

                let Data = {
                  GroupID: Number(ViewGroupID),
                  OrganizationID: Number(organizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                dispatch(getPollsByGroupMainApi(navigate, t, Data));
              } else if (check === 3) {
                setvotePolls(false);
                let OrganizationID = localStorage.getItem("organizationID");

                let Data = {
                  MeetingID: Number(currnetMeeting),
                  OrganizationID: Number(OrganizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                dispatch(GetAllPollsByMeetingIdApiFunc(Data, navigate, t));
              }
            } else {
              let organizationID = localStorage.getItem("organizationID");
              let userID = localStorage.getItem("userID");
              let data = {
                UserID: parseInt(userID),
                OrganizationID: parseInt(organizationID),
                CreatorName: "",
                PollTitle: "",
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
            }
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
          } else if (
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
          } else if (
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
          } else {
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

const getPollsByPollIdApi = (navigate, data, check, t, setEditPolls) => {
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
            dispatch(emailRouteID(0));

            if (parseInt(check) === 1) {
              await dispatch(setviewpollModal(false));
              await dispatch(setCreatePollModal(false));
              await dispatch(setviewpollProgressModal(false));
              await dispatch(viewVotesDetailsModal(false));
              await dispatch(setVotePollModal(false));
              await dispatch(globalFlag(true));
              await dispatch(setEditpollModal(true));
            } else if (parseInt(check) === 2) {
              await dispatch(setviewpollModal(false));
              await dispatch(setCreatePollModal(false));
              await dispatch(setviewpollProgressModal(false));
              await dispatch(globalFlag(false));
              await dispatch(viewVotesDetailsModal(false));
              await dispatch(setVotePollModal(false));
              await dispatch(getAllCommitteesandGroups(navigate, t, false));
              await dispatch(setEditpollModal(true));
            } else if (parseInt(check) === 3) {
              await dispatch(setEditpollModal(false));
              await dispatch(setCreatePollModal(false));
              await dispatch(setviewpollModal(false));
              await dispatch(viewVotesDetailsModal(true));
              await dispatch(globalFlag(false));
              await dispatch(setVotePollModal(false));
              await dispatch(setviewpollProgressModal(false));
            } else if (parseInt(check) === 4) {
              await dispatch(setEditpollModal(false));
              await dispatch(setCreatePollModal(false));
              await dispatch(setviewpollProgressModal(false));
              await dispatch(globalFlag(false));
              await dispatch(viewVotesDetailsModal(false));
              await dispatch(setVotePollModal(false));
              await dispatch(setviewpollModal(true));
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
              getAllPollsByPollsIDSuccess(response.data.responseResult, "")
            );
            if (typeof setEditPolls === "function") {
              setEditPolls(true);
            }

            dispatch(showunsavedEditPollsMeetings(false));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_02".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("No-records-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_03".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("No-records-found")));
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

const viewVotesApi = (navigate, data, t, check, setviewVotes) => {
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
            if (check) {
              if (Number(check) === 1) {
                setviewVotes(true);
                await dispatch(
                  viewVotesSuccess(response.data.responseResult.voteDetails, "")
                );
              }
            } else {
              await dispatch(setEditpollModal(false));
              await dispatch(setCreatePollModal(false));
              await dispatch(setviewpollModal(false));
              await dispatch(globalFlag(false));
              await dispatch(setviewpollProgressModal(false));
              await dispatch(
                viewVotesSuccess(response.data.responseResult.voteDetails, "")
              );

              await dispatch(viewVotesDetailsModal(true));
            }
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_ViewVotes_02".toLowerCase())
          ) {
            dispatch(viewVoteFailed(t("No-records-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes("Polls_PollsServiceManager_ViewVotes_03".toLowerCase())
          ) {
            dispatch(viewVoteFailed(t("No-records-found")));
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
const getAllcommittesandGroups_success = (response, message, flag) => {
  return {
    type: actions.GETALLCOMMITESANDGROUPSFORPOLLS_SUCCESS,
    response: response,
    message: message,
    loader: flag,
  };
};
const getAllcommittesandGroups_fail = (message) => {
  return {
    type: actions.GETALLCOMMITESANDGROUPSFORPOLLS_FAIL,
    message: message,
  };
};
const getAllCommitteesandGroups = (navigate, t, flag) => {
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
          dispatch(getAllCommitteesandGroups(navigate, t, flag));
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
                  "",
                  flag
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_02".toLowerCase()
                )
            ) {
              dispatch(getAllcommittesandGroups_fail(t("No-records-found")));
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

const updatePollsApi = (
  navigate,
  Data,
  t,
  value,
  setEditPolls,
  currentMeeting
) => {
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
          dispatch(
            updatePollsApi(
              navigate,
              Data,
              t,
              value,
              setEditPolls,
              currentMeeting
            )
          );
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
              if (typeof setEditPolls === "function") {
                setEditPolls(false);
              }
              if (value === 2) {
                let OrganizationID = localStorage.getItem("organizationID");
                let Data1 = {
                  MeetingID: currentMeeting,
                  OrganizationID: Number(OrganizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                dispatch(GetAllPollsByMeetingIdApiFunc(Data1, navigate, t));
              } else if (value === 3) {
                let OrganizationID = localStorage.getItem("organizationID");
                let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

                let newData = {
                  CommitteeID: Number(ViewCommitteeID),
                  OrganizationID: Number(OrganizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                dispatch(GetPollsByCommitteeIDapi(navigate, t, newData));
              } else if (value === 4) {
                let OrganizationID = localStorage.getItem("organizationID");
                let ViewGroupID = localStorage.getItem("ViewGroupID");

                let newData = {
                  GroupID: Number(ViewGroupID),
                  OrganizationID: Number(OrganizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                dispatch(getPollsByGroupMainApi(navigate, t, newData));
              } else {
                let userID = localStorage.getItem("userID");
                let organizationID = localStorage.getItem("organizationID");
                let data = {
                  UserID: parseInt(userID),
                  OrganizationID: parseInt(organizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                await dispatch(searchPollsApi(navigate, t, data));
              }

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
              if (typeof setEditPolls === "function") {
                setEditPolls(false);
              }
              dispatch(setEditpollModal(false));

              if (value === 2) {
                let OrganizationID = localStorage.getItem("organizationID");
                let Data1 = {
                  MeetingID: currentMeeting,
                  OrganizationID: Number(OrganizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                dispatch(GetAllPollsByMeetingIdApiFunc(Data1, navigate, t));
              } else if (value === 3) {
                let OrganizationID = localStorage.getItem("organizationID");
                let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

                let newData = {
                  CommitteeID: Number(ViewCommitteeID),
                  OrganizationID: Number(OrganizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                dispatch(GetPollsByCommitteeIDapi(navigate, t, newData));
              } else if (value === 4) {
                let OrganizationID = localStorage.getItem("organizationID");
                let ViewGroupID = localStorage.getItem("ViewGroupID");

                let newData = {
                  GroupID: Number(ViewGroupID),
                  OrganizationID: Number(OrganizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                dispatch(getPollsByGroupMainApi(navigate, t, newData));
              } else {
                let userID = localStorage.getItem("userID");
                let organizationID = localStorage.getItem("organizationID");
                let data = {
                  UserID: parseInt(userID),
                  OrganizationID: parseInt(organizationID),
                  CreatorName: "",
                  PollTitle: "",
                  PageNumber: 1,
                  Length: 50,
                };
                await dispatch(searchPollsApi(navigate, t, data));
              }
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

const searchPollsByCommitteeID_init = () => {
  return {
    type: actions.GETPOLLSBYCOMMITEEID_INIT,
  };
};
const searchPollsByCommitteeID_success = (response, message) => {
  return {
    type: actions.GETPOLLSBYCOMMITEEID_SUCCESS,
    response: response,
    message: message,
  };
};
const searchPollsByCommitteeID_fail = (message) => {
  return {
    type: actions.GETPOLLSBYCOMMITEEID_FAIL,
    message: message,
  };
};
// search Polls
const GetPollsByCommitteeIDapi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(searchPollsByCommitteeID_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", getPollbyCommitteeIdRM.RequestMethod);
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
          dispatch(searchPollsApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetPollsByComitteeID_01".toLowerCase()
                )
            ) {
              dispatch(
                searchPollsByCommitteeID_success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetPollsByComitteeID_02".toLowerCase()
                )
            ) {
              dispatch(searchPollsByCommitteeID_fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetPollsByComitteeID_03".toLowerCase()
                )
            ) {
              dispatch(
                searchPollsByCommitteeID_fail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                searchPollsByCommitteeID_fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(searchPollsByCommitteeID_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(searchPollsByCommitteeID_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(searchPollsByCommitteeID_fail(t("Something-went-wrong")));
      });
  };
};

const getPollsByGroupInit = () => {
  return {
    type: actions.GET_POLLS_BY_GROUPID_INIT,
  };
};

const getPollsByGroupSuccess = (response, message) => {
  return {
    type: actions.GET_POLLS_BY_GROUPID_SUCCESS,
    response: response,
    message: message,
  };
};

const getPollsByGroupFail = (message) => {
  return {
    type: actions.GET_POLLS_BY_GROUPID_FAIL,
    message: message,
  };
};

const getPollsByGroupMainApi = (
  navigate,
  t,
  Data,
  check,
  setEditPoll,
  setViewPoll
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getPollsByGroupInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getPollByGroupIDApi.RequestMethod);
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
          dispatch(getPollsByGroupMainApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetPollsByGroupID_01".toLowerCase()
                )
            ) {
              dispatch(
                getPollsByGroupSuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetPollsByGroupID_02".toLowerCase()
                )
            ) {
              dispatch(getPollsByGroupFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_GetPollsByGroupID_03".toLowerCase()
                )
            ) {
              dispatch(getPollsByGroupFail(t("Something-went-wrong")));
            } else {
              dispatch(getPollsByGroupFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getPollsByGroupFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getPollsByGroupFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getPollsByGroupFail(t("Something-went-wrong")));
      });
  };
};

const setGroupInit = () => {
  return {
    type: actions.SET_GROUP_POLLS_INIT,
  };
};

const setGroupSuccess = (response, message) => {
  return {
    type: actions.SET_GROUP_POLLS_SUCCESS,
    response: response,
    message: message,
  };
};

const setGroupFail = (message) => {
  return {
    type: actions.SET_GROUP_POLLS_FAIL,
    message: message,
  };
};

const setGroupPollsMainApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(setGroupInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", setGroupPollsApi.RequestMethod);
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
          dispatch(setGroupPollsMainApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SetGroupPolls_01".toLowerCase()
                )
            ) {
              dispatch(setGroupSuccess(response.data.responseResult, ""));
              let OrganizationID = localStorage.getItem("organizationID");
              let ViewGroupID = localStorage.getItem("ViewGroupID");

              let newData = {
                GroupID: Number(ViewGroupID),
                OrganizationID: Number(OrganizationID),
                CreatorName: "",
                PollTitle: "",
                PageNumber: 1,
                Length: 50,
              };
              dispatch(getPollsByGroupMainApi(navigate, t, newData));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SetGroupPolls_02".toLowerCase()
                )
            ) {
              dispatch(setGroupFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SetGroupPolls_03".toLowerCase()
                )
            ) {
              dispatch(setGroupFail(t("Something-went-wrong")));
            } else {
              dispatch(setGroupFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(setGroupFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(setGroupFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(setGroupFail(t("Something-went-wrong")));
      });
  };
};

const setCommitteePolls_init = () => {
  return {
    type: actions.SETCOMMITTEEPOLL_INIT,
  };
};
const setCommitteePolls_success = (response, message) => {
  return {
    type: actions.SETCOMMITTEEPOLL_SUCCESS,
    response: response,
    message: message,
  };
};
const setCommitteePolls_fail = (message) => {
  return {
    type: actions.SETCOMMITTEEPOLL_FAIL,
    message: message,
  };
};

const setCommitteePollsApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(setCommitteePolls_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", setCommitteePollsRM.RequestMethod);
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
          dispatch(searchPollsApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SetCommitteePolls_01".toLowerCase()
                )
            ) {
              dispatch(
                setCommitteePolls_success(
                  response.data.responseResult,
                  t("Record-save")
                )
              );
              let OrganizationID = localStorage.getItem("organizationID");
              let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

              let newData = {
                CommitteeID: Number(ViewCommitteeID),
                OrganizationID: Number(OrganizationID),
                CreatorName: "",
                PollTitle: "",
                PageNumber: 1,
                Length: 50,
              };
              dispatch(GetPollsByCommitteeIDapi(navigate, t, newData));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SetCommitteePolls_02".toLowerCase()
                )
            ) {
              dispatch(setCommitteePolls_fail(t("No-records-save")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_SetCommitteePolls_03".toLowerCase()
                )
            ) {
              dispatch(setCommitteePolls_fail(t("Something-went-wrong")));
            } else {
              dispatch(setCommitteePolls_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(setCommitteePolls_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(setCommitteePolls_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(setCommitteePolls_fail(t("Something-went-wrong")));
      });
  };
};

// FOR GET GROUP BY TASK IN POLLS
const getTaskGroupIdInit = () => {
  return {
    type: actions.GET_TASK_BY_GROUPID_INIT,
  };
};

const getTaskGroupIdSuccess = (response, message) => {
  return {
    type: actions.GET_TASK_BY_GROUPID_SUCCESS,
    response: response,
    message: message,
  };
};

const getTaskGroupIdFail = (message) => {
  return {
    type: actions.GET_TASK_BY_GROUPID_FAIL,
    message: message,
  };
};

const getTasksByGroupIDApi = (navigate, t, newData) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getTaskGroupIdInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(newData));
    form.append("RequestMethod", getTaskGroupIDApi.RequestMethod);
    axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getTasksByGroupIDApi(navigate, t, newData));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetTasksByGroupID_01".toLowerCase()
                )
            ) {
              dispatch(getTaskGroupIdSuccess(response.data.responseResult, ""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetTasksByGroupID_02".toLowerCase()
                )
            ) {
              dispatch(getTaskGroupIdFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetTasksByGroupID_03".toLowerCase()
                )
            ) {
              dispatch(getTaskGroupIdFail(t("Something-went-wrong")));
            } else {
              dispatch(getTaskGroupIdFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getTaskGroupIdFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getTaskGroupIdFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getTaskGroupIdFail(t("Something-went-wrong")));
      });
  };
};

// FOR SET GROUP BY TASK IN POLLS
const setTaskGroupInit = () => {
  return {
    type: actions.SET_TASK_GROUP_INIT,
  };
};

const setTaskGroupSuccess = (response, message) => {
  return {
    type: actions.SET_TASK_GROUP_SUCCESS,
    response: response,
    message: message,
  };
};

const setTaskGroupFail = (message) => {
  return {
    type: actions.SET_TASK_GROUP_FAIL,
    message: message,
  };
};

const setTasksByGroupApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(setTaskGroupInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", setGroupTaskApi.RequestMethod);
    axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(setTasksByGroupApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SetGroupTasks_01".toLowerCase()
                )
            ) {
              dispatch(setTaskGroupSuccess(response.data.responseResult, ""));
              let ViewGroupID = localStorage.getItem("ViewGroupID");

              let Data = {
                GroupID: Number(ViewGroupID),
              };
              dispatch(getTasksByGroupIDApi(navigate, t, Data));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SetGroupTasks_02".toLowerCase()
                )
            ) {
              dispatch(setTaskGroupFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SetGroupTasks_03".toLowerCase()
                )
            ) {
              dispatch(setTaskGroupFail(t("Something-went-wrong")));
            } else {
              dispatch(setTaskGroupFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(setTaskGroupFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(setTaskGroupFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(setTaskGroupFail(t("Something-went-wrong")));
      });
  };
};

// FOR GET GROUP BY TASK IN POLLS
const getTaskCommitteeIdInit = () => {
  return {
    type: actions.GET_TASK_BY_COMMITTEE_INIT,
  };
};

const getTaskCommitteeIdSuccess = (response, message) => {
  return {
    type: actions.GET_TASK_BY_COMMITTEE_SUCCESS,
    response: response,
    message: message,
  };
};

const getTaskCommitteeIdFail = (message) => {
  return {
    type: actions.GET_TASK_BY_COMMITTEE_FAIL,
    message: message,
  };
};

const getTaskCommitteeIDApi = (navigate, t, newData) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getTaskCommitteeIdInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(newData));
    form.append("RequestMethod", getTaskByCommitteeIDApi.RequestMethod);
    axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getTaskCommitteeIDApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetTasksByCommitteeID_01".toLowerCase()
                )
            ) {
              dispatch(
                getTaskCommitteeIdSuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetTasksByCommitteeID_02".toLowerCase()
                )
            ) {
              dispatch(getTaskCommitteeIdFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetTasksByCommitteeID_03".toLowerCase()
                )
            ) {
              dispatch(getTaskCommitteeIdFail(t("Something-went-wrong")));
            } else {
              dispatch(getTaskCommitteeIdFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getTaskCommitteeIdFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getTaskCommitteeIdFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getTaskCommitteeIdFail(t("Something-went-wrong")));
      });
  };
};

// FOR SET GROUP BY TASK IN POLLS
const setTaskCommitteeInit = () => {
  return {
    type: actions.SET_TASK_COMMITTEE_INIT,
  };
};

const setTaskCommitteeSuccess = (response, message) => {
  return {
    type: actions.SET_TASK_COMMITTEE_SUCCESS,
    response: response,
    message: message,
  };
};

const setTaskCommitteeFail = (message) => {
  return {
    type: actions.SET_TASK_COMMITTEE_FAIL,
    message: message,
  };
};

const setTasksByCommitteeApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(setTaskCommitteeInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", setCommitteeTaskApi.RequestMethod);
    axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(setTasksByCommitteeApi(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SetCommitteeTasks_01".toLowerCase()
                )
            ) {
              dispatch(
                setTaskCommitteeSuccess(response.data.responseResult, "")
              );
              let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

              let Data = {
                CommitteeID: Number(ViewCommitteeID),
              };
              dispatch(getTaskCommitteeIDApi(navigate, t, Data));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SetCommitteeTasks_02".toLowerCase()
                )
            ) {
              dispatch(setTaskCommitteeFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_SetCommitteeTasks_03".toLowerCase()
                )
            ) {
              dispatch(setTaskCommitteeFail(t("Something-went-wrong")));
            } else {
              dispatch(setTaskCommitteeFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(setTaskCommitteeFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(setTaskCommitteeFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(setTaskCommitteeFail(t("Something-went-wrong")));
      });
  };
};

// Delete Committees Polls
const deleteCommitteePoll_init = () => {
  return {
    type: actions.DELETECOMMITTEEPOLLS_INIT,
  };
};

const deleteCommitteePoll_success = (response, message) => {
  return {
    type: actions.DELETECOMMITTEEPOLLS_SUCCESS,
    response: response,
    message: message,
  };
};

const deleteCommitteePoll_fail = (message) => {
  return {
    type: actions.DELETECOMMITTEEPOLLS_FAIL,
    message: message,
  };
};

const deleteCommitteePollApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(deleteCommitteePoll_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", deleteCommitteePollRM.RequestMethod);
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
          dispatch(deleteCommitteePollApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_DeleteCommitteePolls_01".toLowerCase()
                )
            ) {
              dispatch(
                deleteCommitteePoll_success(
                  response.data.responseResult,
                  t("Record-deleted")
                )
              );
              let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

              let OrganizationID = localStorage.getItem("organizationID");
              let Data = {
                CommitteeID: Number(ViewCommitteeID),
                OrganizationID: Number(OrganizationID),
                CreatorName: "",
                PollTitle: "",
                PageNumber: 1,
                Length: 50,
              };
              dispatch(GetPollsByCommitteeIDapi(navigate, t, Data));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_DeleteCommitteePolls_02".toLowerCase()
                )
            ) {
              dispatch(deleteCommitteePoll_fail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_DeleteCommitteePolls_03".toLowerCase()
                )
            ) {
              dispatch(deleteCommitteePoll_fail(t("Something-went-wrong")));
            } else {
              dispatch(deleteCommitteePoll_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(deleteCommitteePoll_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(deleteCommitteePoll_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(deleteCommitteePoll_fail(t("Something-went-wrong")));
      });
  };
};

// Delete Group Polls
const deleteGroupPoll_init = () => {
  return {
    type: actions.DELETEMEETINGPOLLS_INIT,
  };
};
const deleteGroupPoll_success = (response, message) => {
  return {
    type: actions.DELETEGROUPPOLLS_SUCCESS,
    response: response,
    message: message,
  };
};
const deleteGroupPoll_fail = (message) => {
  return {
    type: actions.DELETEGROUPPOLLS_FAIL,
    message: message,
  };
};
const deleteGroupPollApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(deleteGroupPoll_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", deleteGroupPollsRM.RequestMethod);
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
          dispatch(deleteGroupPollApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_DeleteGroupPolls_01".toLowerCase()
                )
            ) {
              dispatch(
                deleteGroupPoll_success(
                  response.data.responseResult,
                  t("Record-deleted")
                )
              );
              let OrganizationID = localStorage.getItem("organizationID");
              let ViewGroupID = localStorage.getItem("ViewGroupID");
              let Data = {
                GroupID: Number(ViewGroupID),
                OrganizationID: Number(OrganizationID),
                CreatorName: "",
                PollTitle: "",
                PageNumber: 1,
                Length: 50,
              };
              dispatch(getPollsByGroupMainApi(navigate, t, Data));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_DeleteGroupPolls_02".toLowerCase()
                )
            ) {
              dispatch(deleteGroupPoll_fail(t("No-records-deleted")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_DeleteGroupPolls_03".toLowerCase()
                )
            ) {
              dispatch(deleteGroupPoll_fail(t("Something-went-wrong")));
            } else {
              dispatch(deleteGroupPoll_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(deleteGroupPoll_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(deleteGroupPoll_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(deleteGroupPoll_fail(t("Something-went-wrong")));
      });
  };
};

// Delete Meeting Polls
const deleteMeetingPoll_init = () => {
  return {
    type: actions.DELETEMEETINGPOLLS_INIT,
  };
};
const deleteMeetingPoll_success = (response, message) => {
  return {
    type: actions.DELETEMEETINGPOLLS_SUCCESS,
    response: response,
    message: message,
  };
};
const deleteMeetingPoll_fail = (message) => {
  return {
    type: actions.DELETEMEETINGPOLLS_FAIL,
    message: message,
  };
};
const deleteMeetingPollApi = (navigate, t, data, currentMeeting) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(deleteMeetingPoll_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", deleteMeetingPollsRM.RequestMethod);
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
          dispatch(deleteMeetingPollApi(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_DeleteMeetingPolls_01".toLowerCase()
                )
            ) {
              dispatch(
                deleteMeetingPoll_success(
                  response.data.responseResult,
                  t("Record-deleted")
                )
              );
              let OrganizationID = localStorage.getItem("organizationID");

              let Data = {
                MeetingID: currentMeeting,
                OrganizationID: Number(OrganizationID),
                CreatorName: "",
                PollTitle: "",
                PageNumber: 1,
                Length: 50,
              };
              dispatch(GetAllPollsByMeetingIdApiFunc(Data, navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_DeleteMeetingPolls_02".toLowerCase()
                )
            ) {
              dispatch(deleteMeetingPoll_fail(t("No-records-deleted")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_DeleteMeetingPolls_03".toLowerCase()
                )
            ) {
              dispatch(deleteMeetingPoll_fail(t("Something-went-wrong")));
            } else {
              dispatch(deleteMeetingPoll_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(deleteMeetingPoll_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(deleteMeetingPoll_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(deleteMeetingPoll_fail(t("Something-went-wrong")));
      });
  };
};

const getPollsByPollIdforCommitteeApi = (
  navigate,
  data,
  check,
  t,
  setEditPolls,
  setvotePolls,
  setUnPublished,
  setViewPublishedPoll
) => {
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
        dispatch(
          getPollsByPollIdforCommitteeApi(
            navigate,
            data,
            check,
            t,
            setEditPolls,
            setvotePolls,
            setUnPublished,
            setViewPublishedPoll
          )
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_01".toLowerCase()
              )
          ) {
            if (Number(check) === 1) {
              // for Edit Poll Modal
              setEditPolls(true);
            } else if (Number(check) === 2) {
              setvotePolls(true);
            } else if (Number(check) === 3) {
              setUnPublished(true);
            } else if (Number(check) === 4) {
              setViewPublishedPoll(true);
            }
            await dispatch(
              getAllPollsByPollsIDSuccess(response.data.responseResult, "")
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_02".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("No-records-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_03".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("No-records-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_04".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("Someting-went-wrong")));
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
const getPollByPollIdforGroups = (
  navigate,
  data,
  check,
  t,
  setEditPolls,
  setvotePolls,
  setUnPublished,
  setViewPublishedPoll
) => {
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
        dispatch(
          getPollByPollIdforGroups(
            navigate,
            data,
            check,
            t,
            setEditPolls,
            setvotePolls,
            setUnPublished,
            setViewPublishedPoll
          )
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_01".toLowerCase()
              )
          ) {
            if (Number(check) === 1) {
              // for Edit Poll Modal
              setEditPolls(true);
            } else if (Number(check) === 2) {
              setvotePolls(true);
            } else if (Number(check) === 3) {
              setUnPublished(true);
            } else if (Number(check) === 4) {
              setViewPublishedPoll(true);
            }
            await dispatch(
              getAllPollsByPollsIDSuccess(response.data.responseResult, "")
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_02".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("No-records-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_03".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("No-records-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_04".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("Someting-went-wrong")));
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
const getPollByPollIdforMeeting = (
  navigate,
  data,
  check,
  t,
  setEditPolls,
  setvotePolls,
  setUnPublished,
  setViewPublishedPoll
) => {
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
        dispatch(
          getPollByPollIdforMeeting(
            navigate,
            data,
            check,
            t,
            setEditPolls,
            setvotePolls,
            setUnPublished,
            setViewPublishedPoll
          )
        );
      } else if (response.data.responseCode === 200) {
        if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_01".toLowerCase()
              )
          ) {
            if (Number(check) === 1) {
              // for Edit Poll Modal
              setEditPolls(true);
            } else if (Number(check) === 2) {
              setvotePolls(true);
            } else if (Number(check) === 3) {
              setUnPublished(true);
            } else if (Number(check) === 4) {
              setViewPublishedPoll(true);
            }
            await dispatch(
              getAllPollsByPollsIDSuccess(response.data.responseResult, "")
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_02".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("No-records-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_03".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("No-records-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Polls_PollsServiceManager_GetPollByPollID_04".toLowerCase()
              )
          ) {
            dispatch(getAllPollsByPollsIDFailed(t("Someting-went-wrong")));
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
const createPollGroupsMQTT = (response) => {
  return { type: actions.POLL_CREATE_GROUP, response: response };
};
const createPollCommitteesMQTT = (response) => {
  return { type: actions.POLL_CREATE_COMMITTEE, response: response };
};
const createPollMeetingMQTT = (response) => {
  return { type: actions.POLL_CREATE_ADVANCED_MEETING, response: response };
};
const deletePollsMQTT = (response) => {
  console.log(response, "responseresponseresponse");
  return { type: actions.DELETE_POLLS_MQTT, deleteData: response };
};
const validateStringPoll_init = () => {
  return {
    type: actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_POLLS_INIT,
  };
};
const validateStringPoll_success = (response, message) => {
  return {
    type: actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_POLLS_SUCCESS,
    response: response,
    message: message,
  };
};
const validateStringPoll_fail = (message) => {
  return {
    type: actions.VALIDATE_ENCRYPTEDSTRING_EMAIL_RELATED_POLLS_FAIL,
    message: message,
  };
};
const validateStringPollApi = (emailString, navigate, t, RouteNo, dispatch) => {
  return new Promise((resolve, reject) => {
    let Data = {
      EncryptedString: emailString,
    };
    let token = JSON.parse(localStorage.getItem("token"));

    dispatch(validateStringPoll_init());

    let form = new FormData();
    form.append("RequestMethod", ValidateEmailRelatedStringPolls.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

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
          // Retry the API call
          resolve(
            dispatch(
              validateStringPollApi(emailString, navigate, t, RouteNo, dispatch)
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_ValidateEncryptedStringPollRelatedEmailData_01".toLowerCase()
                )
            ) {
              await dispatch(
                validateStringPoll_success(
                  response.data.responseResult?.data,
                  t("Successfully")
                )
              );
              dispatch(emailRouteID(RouteNo));
              resolve(response.data.responseResult.data);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_ValidateEncryptedStringPollRelatedEmailData_02".toLowerCase()
                )
            ) {
              dispatch(validateStringPoll_fail(t("Unsuccessful")));
              reject("Unsuccessful");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Polls_PollsServiceManager_ValidateEncryptedStringPollRelatedEmailData_03".toLowerCase()
                )
            ) {
              dispatch(validateStringPoll_fail(t("Something-went-wrong")));
              reject("Something-went-wrong");
            }
          } else {
            dispatch(validateStringPoll_fail(t("Something-went-wrong")));
            reject("Something-went-wrong");
          }
        } else {
          dispatch(validateStringPoll_fail(t("Something-went-wrong")));
          reject("Something-went-wrong");
        }
      })
      .catch((error) => {
        dispatch(validateStringPoll_fail("Something-went-wrong"));
        reject(error);
      });
  });
};
export {
  validateStringPollApi,
  deletePollsMQTT,
  createPollGroupsMQTT,
  createPollCommitteesMQTT,
  createPollMeetingMQTT,
  deleteGroupPollApi,
  deleteMeetingPollApi,
  deleteCommitteePollApi,
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
  notifyPollingSocket,
  getPollsByGroupMainApi,
  setGroupPollsMainApi,
  GetPollsByCommitteeIDapi,
  getTasksByGroupIDApi,
  setTasksByGroupApi,
  getTaskCommitteeIDApi,
  setTasksByCommitteeApi,
  getPollsByPollIdforCommitteeApi,
  clearPollsMesseges,
  getPollByPollIdforGroups,
  getPollByPollIdforMeeting,
};
