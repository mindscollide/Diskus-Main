import axios from 'axios'
import { getCommitteeByIdRequestMethod, getCommitteeGroupsRequestMethod } from '../../commen/apis/Api_config'
import { committeeApi } from '../../commen/apis/Api_ends_points'
import * as actions from '../action_types'
import { RefreshToken } from './Auth_action'


const clearMessagesGroupCommittee = () => {
    return {
        type: actions.CLEAR_MESSAGE_RESPONSE_COMMITTEE
    }
}
const getCommitteeGroup_Init = () => {
    return {
        type: actions.GET_COMMITTEE_BYUSERID_INIT
    }
}

const getCommitteeGroup_Success = (response, message) => {
    return {
        type: actions.GET_COMMITTEE_BYUSERID_SUCCESS,
        response: response,
        message: message
    }
}

const getCommitteeGroup_Fail = (message) => {
    return {
        type: actions.GET_COMMITTEE_BYUSERID_FAIL,
        message: message
    }
}

const getCommitteeGroups = (t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let createrID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = { UserId: JSON.parse(createrID), OrganizationID: JSON.parse(OrganizationID) }
    return ((dispatch) => {
        dispatch(getCommitteeGroup_Init());
        let form = new FormData();
        form.append("RequestData", JSON.stringify(Data));
        form.append("RequestMethod", getCommitteeGroupsRequestMethod.RequestMethod);
        axios({
            method: "post",
            url: committeeApi,
            data: form,
            headers: {
                _token: token
            }
        }).then(async (response) => {
            console.log(response, "response")
            if (response.data.responseCode === 417) {
                await dispatch(RefreshToken(t));
                await dispatch(getCommitteeGroups(t))
            } else if (response.data.responseCode === 200) {
                console.log(response, "response")
                if (response.data.responseResult.isExecuted === true) {
                    console.log(response, "response")
                    if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetCommitteesByUserID_01".toLowerCase())) {
                        dispatch(getCommitteeGroup_Success(response.data.responseResult.committees, t("Data-available")))
                        console.log(response, "response")
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetCommitteesByUserID_02".toLowerCase())) {
                        dispatch(getCommitteeGroup_Fail(t("No-data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetCommitteesByUserID_03".toLowerCase())) {
                        dispatch(getCommitteeGroup_Fail(t("No-data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetCommitteesByUserID_04".toLowerCase())) {
                        dispatch(getCommitteeGroup_Fail(t("No-data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetCommitteesByUserID_05".toLowerCase())) {
                        dispatch(getCommitteeGroup_Fail(t("No-data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetCommitteesByUserID_06".toLowerCase())) {
                        dispatch(getCommitteeGroup_Fail(t("Something-went-wrong")))
                        console.log(response, "response")
                    }
                } else {
                    console.log(response, "response")
                    dispatch(getCommitteeGroup_Fail(t("Something-went-wrong")))
                }
            } else {
                console.log(response, "response")
                dispatch(getCommitteeGroup_Fail(t("Something-went-wrong")))
            }
        }).catch((response) => {
            console.log(response, "response")
            dispatch(getCommitteeGroup_Fail(t("Something-went-wrong")))
        })
    })
}
const getbyCommitteeID_Init = () => {
    return {
        type: actions.GET_COMMITTEE_BYCOMMITTEEID_INIT
    }
}
const getbyCommitteeID_Success = (response, message) => {
    return {
        type: actions.GET_COMMITTEE_BYCOMMITTEEID_SUCCESS,
        response: response,
        message: message
    }
}
const getbyCommitteeID_Fail = (message) => {
    return {
        type: actions.GET_COMMITTEE_BYCOMMITTEEID_FAIL,
        message: message
    }
}
const getbyCommitteeID = (committeeID, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = { CommitteeID: JSON.parse(committeeID), OrganizationID: JSON.parse(OrganizationID) }
    return ((dispatch) => {
        dispatch(getbyCommitteeID_Init());
        let form = new FormData();
        form.append("RequestData", JSON.stringify(Data));
        form.append("RequestMethod", getCommitteeByIdRequestMethod.RequestMethod);
        axios({
            method: "post",
            url: committeeApi,
            data: form,
            headers: {
                _token: token
            }
        }).then(async (response) => {
            console.log(response, "response")
            if (response.data.responseCode === 417) {
                await dispatch(RefreshToken(t));
                await dispatch(getbyCommitteeID(t))
            } else if (response.data.responseCode === 200) {
                console.log(response, "response")
                if (response.data.responseResult.isExecuted === true) {
                    console.log(response, "response")
                    if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_01".toLowerCase())) {
                        dispatch(getbyCommitteeID_Success(response.data.responseResult.committee, t("Data-available")))
                        console.log(response, "response")
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_02".toLowerCase())) {
                        dispatch(getbyCommitteeID_Fail(t("No-data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_03".toLowerCase())) {
                        dispatch(getbyCommitteeID_Fail(t("No-data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_04".toLowerCase())) {
                        dispatch(getbyCommitteeID_Fail(t("No-data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_05".toLowerCase())) {
                        dispatch(getbyCommitteeID_Fail(t("No-data-available")))
                    }
                } else {
                    console.log(response, "response")
                    dispatch(getbyCommitteeID_Fail(t("Something-went-wrong")))
                }
            } else {
                console.log(response, "response")
                dispatch(getbyCommitteeID_Fail(t("Something-went-wrong")))
            }
        }).catch((response) => {
            console.log(response, "response")
            dispatch(getbyCommitteeID_Fail(t("Something-went-wrong")))
        })
    })
}
export { getCommitteeGroups, clearMessagesGroupCommittee, getbyCommitteeID }