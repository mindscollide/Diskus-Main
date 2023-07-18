import axios from "axios";
import { savePollsRequestMethod, getAllCommittesandGroupsforPolls, searcPollsRequestMethod } from "../../commen/apis/Api_config";
import { pollApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";

// search Poll Init
const searchPolls_init = () => {
    return {
        type: actions.SEARCH_POLLS_INIT
    }
}

// search Poll Success
const searchPolls_success = (response, message) => {
    return {
        type: actions.SEARCH_POLLS_SUCCESS,
        response: response,
        message: message
    }
}

// search Poll Fail
const searchPolls_fail = (message) => {
    return {
        type: actions.SEARCH_POLLS_FAIL,
        message: message
    }
}

// search Polls 
const searchPollsApi = (navigate, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let createrID = parseInt(localStorage.getItem("userID"));
    let OrganizationID = parseInt(localStorage.getItem("organizationID"));
    let Data = {
        UserID: createrID,
        OrganizationID: OrganizationID,
        CreatorName: "",
        PageNumber: 1,
        Length: 50
    }
    return (dispatch) => {
        dispatch(searchPolls_init())
        let form = new FormData();
        form.append("RequestData", JSON.stringify(Data));
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
                    dispatch(searchPollsApi(navigate, t))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_SearchPolls_01'.toLowerCase())) {
                            dispatch(searchPolls_success(response.data.responseResult, t("Record-found")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_SearchPolls_02'.toLowerCase())) {
                            dispatch(searchPolls_fail(t("No-record-found")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_SearchPolls_03'.toLowerCase())) {
                            dispatch(searchPolls_fail(t("Something-went-wrong")))
                        } else {
                            dispatch(searchPolls_fail(t("Something-went-wrong")))
                        }
                    } else {
                        console.log(response, "response");
                        dispatch(searchPolls_fail(t("Something-went-wrong")))
                    }
                } else {
                    console.log(response, "response");
                    dispatch(searchPolls_fail(t("Something-went-wrong")))
                }
            })
            .catch((response) => {
                console.log(response, "response");
                dispatch(searchPolls_fail(t("Something-went-wrong")))
            });
    };
}

// save poll Init
const savePolls_init = () => {
    return {
        type: actions.SEARCH_POLLS_INIT
    }
}

// save poll success
const savePolls_success = (response, message) => {
    return {
        type: actions.SEARCH_POLLS_SUCCESS,
        response: response,
        message: message

    }
}

// save poll fail
const savePolls_fail = (message) => {
    return {
        type: actions.SEARCH_POLLS_FAIL,
        message: message
    }
}

// Save polls Api
const SavePollsApi = (navigate, Data, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    return (dispatch) => {
        dispatch(savePolls_init())
        let form = new FormData();
        form.append("RequestData", JSON.stringify(Data));
        form.append("RequestMethod", savePollsRequestMethod.RequestMethod);
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
                    dispatch(SavePollsApi(navigate, Data, t))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_SavePoll_01'.toLowerCase())) {
                            dispatch(savePolls_success(response.data.responseResult, t("Poll-created")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_SavePoll_02'.toLowerCase())) {
                            dispatch(savePolls_fail(t("Poll-not-created")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_SavePoll_03'.toLowerCase())) {
                            dispatch(savePolls_fail(t("Poll-not-created")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_SavePoll_04'.toLowerCase())) {
                            dispatch(savePolls_fail(t("Poll-not-created")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_SavePoll_05'.toLowerCase())) {
                            dispatch(savePolls_fail(t("Participant-list-of-consists-of-duplicate-members")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_SavePoll_06'.toLowerCase())) {
                            dispatch(savePolls_fail(t("There-must-be-at-least-two-poll-options")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_SavePoll_07'.toLowerCase())) {
                            dispatch(savePolls_fail(t("Something-went-wrong")))
                        } else {
                            dispatch(savePolls_fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(savePolls_fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(savePolls_fail(t("Something-went-wrong")))
                }
            })
            .catch((response) => {
                dispatch(savePolls_fail(t("Something-went-wrong")))
            });
    };
}


const getAllcommittesandGroups_init = () => {
    return {
        type: actions.GETALLCOMMITESANDGROUPSFORPOLLS_INIT
    }
}
const getAllcommittesandGroups_success = (response, message) => {
    return {
        type: actions.GETALLCOMMITESANDGROUPSFORPOLLS_SUCCESS,
        response: response,
        message: message
    }
}
const getAllcommittesandGroups_fail = (message) => {
    return {
        type: actions.GETALLCOMMITESANDGROUPSFORPOLLS_FAIL,
        message: message
    }
}
const getAllCommitteesandGroups = (navigate, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let OrganizationID = parseInt(localStorage.getItem("organizationID"));
    let Data = {
        OrganizationID: OrganizationID
    }
    return (dispatch) => {
        dispatch(getAllcommittesandGroups_init())
        let form = new FormData();
        form.append("RequestData", JSON.stringify(Data));
        form.append("RequestMethod", getAllCommittesandGroupsforPolls.RequestMethod);
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
                    dispatch(getAllCommitteesandGroups(navigate, t))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_01'.toLowerCase())) {
                            dispatch(getAllcommittesandGroups_success(response.data.responseResult, t("Record-found")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_02'.toLowerCase())) {
                            dispatch(getAllcommittesandGroups_fail(t("No-record-found")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes('Polls_PollsServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_03'.toLowerCase())) {
                            dispatch(getAllcommittesandGroups_fail(t("Something-went-wrong")))
                        } else {
                            dispatch(getAllcommittesandGroups_fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(getAllcommittesandGroups_fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(getAllcommittesandGroups_fail(t("Something-went-wrong")))
                }
            })
            .catch((response) => {
                dispatch(getAllcommittesandGroups_fail(t("Something-went-wrong")))
            });
    };
}
export { searchPollsApi, SavePollsApi, getAllCommitteesandGroups }