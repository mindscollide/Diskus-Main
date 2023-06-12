import axios from 'axios'
import { getAllVotingRequestMethod, cancelResolutionRequestMethod, updateVoteRequestMethod, closeResolutionRequestMethod, getAllVotingStatusRequestMethod, getVoteDetailsByID, getResolutionResultsDetails, getResolutionsRequestMethod, scheduleResolutionRequestMethod, getResolutionByIDRequestMethod, addUpdateResolutionRequestMethod, getVoterResolutionRequestMethod } from '../../commen/apis/Api_config'
import { getResolutionApi } from '../../commen/apis/Api_ends_points'
import * as actions from '../action_types'
import { RefreshToken } from './Auth_action'

const getAllVoting_Init = () => {
    return {
        type: actions.GET_ALL_VOTING_METHOD_INIT
    }
}
const getAllVoting_Success = (response, message) => {
    console.log(response, message, "actionaction")
    return {
        type: actions.GET_ALL_VOTING_METHOD_SUCCESS,
        response: response,
        message: message
    }
}
const getAllVoting_Fail = (message) => {
    return {
        type: actions.GET_ALL_VOTING_METHOD_FAIL,
        message: message
    }

}
const getAllVotingMethods = (navigate, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    return (dispatch) => {
        dispatch(getAllVoting_Init());
        let form = new FormData();
        form.append("RequestMethod", getAllVotingRequestMethod.RequestMethod);
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                console.log("responseresponseresponse", response)
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(getAllVotingMethods(navigate, t))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetAllVotingMethod_01".toLowerCase()) {
                            dispatch(getAllVoting_Success(response.data.responseResult.resolutionMethod, t("Data-available")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetAllVotingMethod_02".toLowerCase()) {
                            dispatch(getAllVoting_Fail("No-data-available"))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetAllVotingMethod_03".toLowerCase()) {
                            dispatch(getAllVoting_Fail("Something-went-wrong"))
                        }
                    } else {
                        dispatch(getAllVoting_Fail("Something-went-wrong"))
                    }
                } else {
                    dispatch(getAllVoting_Fail("Something-went-wrong"))
                }

            })
            .catch((response) => {
                dispatch(getAllVoting_Fail("Something-went-wrong"))
            });
    };
}
const getAllResolutionStatus_Init = () => {
    return {
        type: actions.GET_ALL_RESOLUTION_STATUS_INIT
    }
}
const getAllResolutionStatus_Success = (response, message) => {
    console.log(response, message, "actionaction111")
    return {
        type: actions.GET_ALL_RESOLUTION_STATUS_SUCCESS,
        response: response,
        message: message
    }
}
const getAllResolutionStatus_Fail = (message) => {
    return {
        type: actions.GET_ALL_RESOLUTION_STATUS_FAIL,
        message: message
    }
}
const getAllResolutionStatus = (navigate, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    return (dispatch) => {
        dispatch(getAllResolutionStatus_Init());
        let form = new FormData();
        form.append("RequestMethod", getAllVotingStatusRequestMethod.RequestMethod);
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                console.log("responseresponseresponse", response)
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(getAllResolutionStatus(navigate, t))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetAllResolutionStatus_01".toLowerCase()) {
                            dispatch(getAllResolutionStatus_Success(response.data.responseResult.resolutionStatus, t("Data-available")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetAllResolutionStatus_02".toLowerCase()) {
                            dispatch(getAllResolutionStatus_Fail("No-data-available"))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetAllResolutionStatus_03".toLowerCase()) {
                            dispatch(getAllResolutionStatus_Fail("Something-went-wrong"))
                        }
                    } else {
                        dispatch(getAllResolutionStatus_Fail("Something-went-wrong"))
                    }
                } else {
                    dispatch(getAllResolutionStatus_Fail("Something-went-wrong"))
                }

            })
            .catch((response) => {
                dispatch(getAllResolutionStatus_Fail("Something-went-wrong"))
            });
    };
}
const getResolutions_Init = () => {
    return {
        type: actions.GET_RESOLUTIONS_INIT
    }
};
const getResolutions_Success = (response, message) => {
    return {
        type: actions.GET_RESOLUTIONS_SUCCESS,
        response: response,
        message: message
    }
};
const getResolutions_Fail = (message) => {
    return {
        type: actions.GET_RESOLUTIONS_FAIL,
        message: message
    }
};
const getResolutions = (navigate, id, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let userID = JSON.parse(localStorage.getItem("userID"))
    let Data = {
        FK_UID: userID,
        ResolutionStatus: JSON.parse(id),
        Title: "",
        PageNumber: 1,
        Length: 50

    }
    return (dispatch) => {
        dispatch(getResolutions_Init());
        let form = new FormData();
        form.append("RequestMethod", getResolutionsRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                console.log("responseresponseresponse", response)
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(getResolutions(navigate, id, t))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_SearchResolutions_01".toLowerCase()) {
                            dispatch(getResolutions_Success(response.data.responseResult.resolutionTable, t("Data-available")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_SearchResolutions_02".toLowerCase()) {
                            dispatch(getResolutions_Success(response.data.responseResult.resolutionTable, t("No-data-available")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_SearchResolutions_03".toLowerCase()) {
                            dispatch(getResolutions_Fail("Something-went-wrong"))
                        }
                    } else {
                        dispatch(getResolutions_Fail("Something-went-wrong"))
                    }
                } else {
                    dispatch(getResolutions_Fail("Something-went-wrong"))
                }
            })
            .catch((response) => {
                dispatch(getResolutions_Fail("Something-went-wrong"))
            });
    };
}
const createResolution_Init = () => {
    return {
        type: actions.SCHEDULE_RESOLUTION_INIT
    }
};
const createResolution_Success = (response, message) => {
    return {
        type: actions.SCHEDULE_RESOLUTION_SUCCESS,
        response: response,
    }
};
const createResolution_Fail = (message) => {
    return {
        type: actions.SCHEDULE_RESOLUTION_FAIL,
        message: message
    }
};
const createResolution = (navigate, Data, voters, nonVoter, tasksAttachments, setNewresolution, setEditResoutionPage, t, no, circulated, setResolutionUpdateSuccessfully) => {
    console.log(Data, voters, nonVoter, tasksAttachments, setNewresolution, setEditResoutionPage, no, circulated, "checkingforcreatetatemodal")
    let token = JSON.parse(localStorage.getItem("token"));
    return (dispatch) => {
        dispatch(createResolution_Init());
        let form = new FormData();
        form.append("RequestMethod", scheduleResolutionRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(createResolution(navigate, Data, voters, nonVoter, tasksAttachments, setNewresolution, setEditResoutionPage, t, no, circulated))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_ScheduleResolution_01".toLowerCase()) {
                            await dispatch(createResolution_Success(response.data.responseResult.resolutionID))
                            dispatch(updateResolution(navigate, response.data.responseResult.resolutionID, voters, nonVoter, tasksAttachments, setNewresolution, setEditResoutionPage, t, no, circulated, setResolutionUpdateSuccessfully))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_ScheduleResolution_02".toLowerCase()) {
                            dispatch(createResolution_Fail(t("Failed-to-create-resolution")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_ScheduleResolution_03".toLowerCase()) {
                            dispatch(createResolution_Fail(t("Something-went-wrong")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_ScheduleResolution_04".toLowerCase()) {
                            dispatch(createResolution_Fail(t("Something-went-wrong")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_ScheduleResolution_05".toLowerCase()) {
                            dispatch(updateResolution(navigate, response.data.responseResult.resolutionID, voters, nonVoter, tasksAttachments, setNewresolution, setEditResoutionPage, t, no, setResolutionUpdateSuccessfully))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_ScheduleResolution_06".toLowerCase()) {
                            dispatch(createResolution_Fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(createResolution_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(createResolution_Fail(t("Something-went-wrong")))
                }
            })
            .catch((response) => {
                dispatch(createResolution_Fail(t("Something-went-wrong")))
            });
    };
}
const updateResolution_Init = () => {
    return {
        type: actions.ADD_UPDATE_DETAILS_RESOLUTION_INIT
    }
}
const updateResolution_Success = (message) => {
    return {
        type: actions.ADD_UPDATE_DETAILS_RESOLUTION_SUCCESS,
        message: message

    }
}
const updateResolution_Fail = (message) => {
    return {
        type: actions.ADD_UPDATE_DETAILS_RESOLUTION_FAIL,
        message: message
    }
}
const updateResolution = (navigate, resolutionID, voters, nonVoter, tasksAttachments, setNewresolution, setEditResoutionPage, t, no, circulated, setResolutionUpdateSuccessfully) => {
    console.log(resolutionID, voters, nonVoter, tasksAttachments, setNewresolution, setEditResoutionPage, t, no, circulated, "checkingforudpatestatemodal")
    let Data2 = {
        IsCirculate: circulated === 2 ? true : false,
        FK_ResolutionID: JSON.parse(resolutionID),
        Voters: voters,
        NonVoters: nonVoter,
        Attachments: tasksAttachments
    }
    let token = JSON.parse(localStorage.getItem("token"));
    return (dispatch) => {
        dispatch(updateResolution_Init());
        let form = new FormData();
        form.append("RequestMethod", addUpdateResolutionRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data2));
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(updateResolution(navigate, resolutionID, voters, nonVoter, tasksAttachments, setNewresolution, setEditResoutionPage, t, no, circulated))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_01".toLowerCase()) {
                            dispatch(updateResolution_Success(response.data.responseResult.resolutionID, t("Resolution-circulated-successfully")))
                            if (no === 1) {
                                setNewresolution(false)
                            } else {
                                setEditResoutionPage(false)
                            }
                            dispatch(getResolutions(navigate, 3, t))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_02".toLowerCase()) {
                            dispatch(updateResolution_Fail(t("Failed-to-update-resolution-status")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_03".toLowerCase()) {
                            dispatch(updateResolution_Success(t("Resolution-details-updated-successfully")))
                            if (no === 1) {
                                setNewresolution(false)
                            } else {
                                setEditResoutionPage(false)
                            }
                            dispatch(getResolutions(navigate, 3, t))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_04".toLowerCase()) {
                            dispatch(updateResolution_Fail(t("Please-add-at-least-one-voter")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_05".toLowerCase()) {
                            dispatch(updateResolution_Fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(updateResolution_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(updateResolution_Fail(t("Something-went-wrong")))
                }

            })
            .catch((response) => {
                dispatch(updateResolution_Fail(t("Something-went-wrong")))
            });
    };
}
const getResolutionById_Init = () => {
    return {
        type: actions.GET_RESOLUTION_BY_RESOLUTION_ID_INIT
    }
}
const getResolutionById_Success = (response, message) => {
    return {
        type: actions.GET_RESOLUTION_BY_RESOLUTION_ID_SUCCESS,
        response: response,
        message: message
    }
}
const getResolutionById_Fail = (message) => {
    return {
        type: actions.GET_RESOLUTION_BY_RESOLUTION_ID_FAIL,
        message: message
    }
}
const getResolutionbyResolutionID = (navigate, id, t, setEditResoutionPage, setViewresolution, no) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {
        ResolutionID: JSON.parse(id)
    }

    return (dispatch) => {
        dispatch(getResolutionById_Init());
        let form = new FormData();
        form.append("RequestMethod", getResolutionByIDRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(getResolutionbyResolutionID(navigate, id, t, setEditResoutionPage, setViewresolution, no))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetResolutionByID_01".toLowerCase()) {
                            dispatch(getResolutionById_Success(response.data.responseResult.resolution, t("Resolution-circulated-successfully")))
                            if (no === 1) {
                                setEditResoutionPage(true)
                            } else {
                                setViewresolution(true)
                            }
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetResolutionByID_02".toLowerCase()) {
                            dispatch(getResolutionById_Fail(t("Unable-to-fetch-data")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetResolutionByID_03".toLowerCase()) {
                            dispatch(getResolutionById_Fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(getResolutionById_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(getResolutionById_Fail(t("Something-went-wrong")))
                }
            })
            .catch((response) => {
                dispatch(getResolutionById_Fail(t("Something-went-wrong")))
            });
    };
}
const getResolutionResult_Init = () => {
    return {
        type: actions.GET_RESOLUTION_RESULTS_DETAILS_INIT
    }
}
const getResolutionResult_Success = (response, message) => {
    return {
        type: actions.GET_RESOLUTION_RESULTS_DETAILS_SUCCESS,
        response: response,
        message: message
    }
}
const getResolutionResult_Fail = (message) => {
    return {
        type: actions.GET_RESOLUTION_RESULTS_DETAILS_FAIL,
        message: message
    }
}
const getResolutionResult = (navigate, id, t, setResultresolution) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let userID = JSON.parse(localStorage.getItem("userID"))
    let Data = {
        ResolutionID: JSON.parse(id),
        UserID: userID
    }
    return (dispatch) => {
        dispatch(getResolutionResult_Init());
        let form = new FormData();
        form.append("RequestMethod", getResolutionResultsDetails.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(getResolutionResult(navigate, id, t, setResultresolution))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetResultDetails_01".toLowerCase()) {
                            dispatch(getResolutionResult_Success(response.data.responseResult, t("Data-available")))
                            setResultresolution(true)
                            localStorage.setItem("ResolutionID", id)
                            // if (no === 1) {
                            //     setEditResoutionPage(true)
                            // } else {
                            //     setViewresolution(true)
                            // }
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetResultDetails_02".toLowerCase()) {
                            dispatch(getResolutionResult_Fail(t("No-record-added")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetResultDetails_03".toLowerCase()) {
                            dispatch(getResolutionResult_Fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(getResolutionResult_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(getResolutionResult_Fail(t("Something-went-wrong")))
                }

            })
            .catch((response) => {
                dispatch(getResolutionResult_Fail(t("Something-went-wrong")))
            });
    };
}
const getVotesDetail_Init = () => {
    return {
        type: actions.GET_VOTESDETAILSBYID_INIT
    }
}
const getVotesDetail_Success = (response, message) => {
    return {
        type: actions.GET_VOTESDETAILSBYID_SUCCESS,
        response: response,
        message: message
    }
}
const getVotesDetail_Fail = (message) => {
    return {
        type: actions.GET_VOTESDETAILSBYID_FAIL,
        message: message
    }
}
const getVotesDetails = (navigate, id, t, setVoteresolution) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let userID = JSON.parse(localStorage.getItem("userID"))
    let Data = {
        ResolutionID: JSON.parse(id),
        UserID: userID
    }
    return (dispatch) => {
        dispatch(getVotesDetail_Init());
        let form = new FormData();
        form.append("RequestMethod", getVoteDetailsByID.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(getVotesDetails(navigate, id, t, setVoteresolution))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetVoteDetailsByID_01".toLowerCase()) {
                            dispatch(getVotesDetail_Success(response.data.responseResult, t("Data-available")))
                            setVoteresolution(true)
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetVoteDetailsByID_02".toLowerCase()) {
                            dispatch(getVotesDetail_Fail(t("No-data-available")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_GetVoteDetailsByID_03".toLowerCase()) {
                            dispatch(getVotesDetail_Fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(getVotesDetail_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(getVotesDetail_Fail(t("Something-went-wrong")))
                }

            })
            .catch((response) => {
                dispatch(getVotesDetail_Fail(t("Something-went-wrong")))
            });
    };
}
const cancelResolution_Init = () => {
    return {
        type: actions.CANCEL_RESOLUTION_INIT
    }
}
const cancelResolution_Success = (response, message) => {
    return {
        type: actions.CANCEL_RESOLUTION_SUCCESS,
        response: response,
        message: message
    }
}
const cancelResolution_Fail = (message) => {
    return {
        type: actions.CANCEL_RESOLUTION_FAIL,
        message: message
    }
}
const cancelResolutionApi = (navigate, id, t, setEditResoutionPage) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let userID = JSON.parse(localStorage.getItem("userID"))
    let Data = {
        ResolutionID: JSON.parse(id),
        UserID: userID
    }
    return (dispatch) => {
        dispatch(cancelResolution_Init());
        let form = new FormData();
        form.append("RequestMethod", cancelResolutionRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(cancelResolutionApi(navigate, id, t, setEditResoutionPage))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_CancelResolution_01".toLowerCase()) {
                            dispatch(cancelResolution_Success(response.data.responseResult, t("Resolution-cancelled")))
                            await setEditResoutionPage(false)
                            dispatch(getResolutions(navigate, 1, t))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_CancelResolution_02".toLowerCase()) {
                            dispatch(cancelResolution_Fail(t("Failed-to-cancel-resolution")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_CancelResolution_03".toLowerCase()) {
                            dispatch(cancelResolution_Fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(cancelResolution_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(cancelResolution_Fail(t("Something-went-wrong")))
                }

            })
            .catch((response) => {
                dispatch(cancelResolution_Fail(t("Something-went-wrong")))
            });
    };
}
const closeResolution_Init = () => {
    return {
        type: actions.CLOSE_RESOLUTION_INIT
    }
}
const closeResolution_Success = (response, message) => {
    return {
        type: actions.CLOSE_RESOLUTION_SUCCESS,
        response: response,
        message: message
    }
}
const closeResolution_Fail = (message) => {
    return {
        type: actions.CLOSE_RESOLUTION_FAIL,
        message: message
    }
}
const closeResolutionApi = (navigate, ResolutionID, ResolutionDecisionID, notes, t, setResultresolution) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let userID = JSON.parse(localStorage.getItem("userID"))
    let Data = {
        ResolutionID: JSON.parse(ResolutionID),
        ResolutionDecision: JSON.parse(ResolutionDecisionID),
        Notes: notes
    }
    return (dispatch) => {
        dispatch(closeResolution_Init());
        let form = new FormData();
        form.append("RequestMethod", closeResolutionRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(closeResolutionApi(navigate, ResolutionID, ResolutionDecisionID, notes, t, setResultresolution))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_CloseResolution_01".toLowerCase()) {
                            dispatch(closeResolution_Success(response.data.responseResult, t("Resolution-closed-successfully")))
                            dispatch(getResolutions(navigate, 3, t))
                            setResultresolution(false)
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_CloseResolution_02".toLowerCase()) {
                            dispatch(closeResolution_Fail(t("Failed-to-close-resolution")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_CloseResolution_03".toLowerCase()) {
                            dispatch(closeResolution_Fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(closeResolution_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(closeResolution_Fail(t("Something-went-wrong")))
                }
            })
            .catch((response) => {
                dispatch(closeResolution_Fail(t("Something-went-wrong")))
            });
    };
}
const updateVote_Init = () => {
    return {
        type: actions.CLOSE_RESOLUTION_INIT
    }
}
const updateVote_Success = (response, message) => {
    return {
        type: actions.CLOSE_RESOLUTION_SUCCESS,
        response: response,
        message: message
    }
}
const updateVote_Fail = (message) => {
    return {
        type: actions.CLOSE_RESOLUTION_FAIL,
        message: message
    }
}
const updateVoteApi = (navigate, Data, t, setVoteresolution) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let userID = JSON.parse(localStorage.getItem("userID"))
    return (dispatch) => {
        dispatch(updateVote_Init());
        let form = new FormData();
        form.append("RequestMethod", updateVoteRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(updateVoteApi(navigate, Data, t, setVoteresolution))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_UpdateVote_01".toLowerCase()) {
                            dispatch(updateVote_Success(response.data.responseResult, t("Record-updated-successfully")))
                            setVoteresolution(false)
                            dispatch(getVoterResolution(navigate, 3, t))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_UpdateVote_02".toLowerCase()) {
                            dispatch(updateVote_Fail(t("No-record-updated")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_UpdateVote_03".toLowerCase()) {
                            dispatch(updateVote_Fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(updateVote_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(updateVote_Fail(t("Something-went-wrong")))
                }

            })
            .catch((response) => {
                dispatch(updateVote_Fail(t("Something-went-wrong")))
            });
    };
}
const getVoterResolution_init = () => {
    return {
        type: actions.SEARCH_VOTERRESOLUTION_INIT
    }
}
const getVoterResolution_success = (response, message) => {
    return {
        type: actions.SEARCH_VOTERRESOLUTION_SUCCESS,
        response: response,
        message: message
    }
}
const getVoterResolution_fail = (message) => {
    return {
        type: actions.SEARCH_VOTERRESOLUTION_FAIL,
        message: message
    }
}
const getVoterResolution = (navigate, id, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let userID = JSON.parse(localStorage.getItem("userID"))
    let Data = {
        FK_UID: userID,
        ResolutionStatus: JSON.parse(id)
    }

    return (dispatch) => {
        dispatch(getVoterResolution_init());
        let form = new FormData();
        form.append("RequestMethod", getVoterResolutionRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(navigate, t))
                    dispatch(getVoterResolution(navigate, id, t))
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_SearchVoterResolutions_01".toLowerCase()) {
                            dispatch(getVoterResolution_success(response.data.responseResult.resolutionTable, t("Record-updated-successfully")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_SearchVoterResolutions_02".toLowerCase()) {
                            dispatch(getVoterResolution_fail(t("No-record-updated")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_SearchVoterResolutions_03".toLowerCase()) {
                            dispatch(getVoterResolution_fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(getVoterResolution_fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(getVoterResolution_fail(t("Something-went-wrong")))
                }

            })
            .catch((response) => {
                dispatch(getVoterResolution_fail(t("Something-went-wrong")))
            });
    };
}
const currentResolutionView = (response) => {
    return {
        type: actions.CURRENTRESOLUTIONSTATE,
        response: response
    }
}
const currentClosedView = (response) => {
    return {
        type: actions.RESOLUTIONCLOSEDORNOTCLOSED,
        response: response
    }
}
const clearResponseMessage = () => {
    return {
        type: actions.CLEAR_RESPONSEMESSAGE_RESOLUTION
    }
}
export { getAllVotingMethods, currentResolutionView, currentClosedView, getAllResolutionStatus, getVoterResolution, clearResponseMessage, cancelResolutionApi, closeResolutionApi, getResolutions, updateVoteApi, updateResolution, getVotesDetails, createResolution, getResolutionResult, getResolutionbyResolutionID }