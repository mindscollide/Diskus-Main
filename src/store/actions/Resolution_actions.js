import axios from 'axios'
import { getAllVotingRequestMethod, getAllVotingStatusRequestMethod, getResolutionsRequestMethod, scheduleResolutionRequestMethod, addUpdateResolutionRequestMethod } from '../../commen/apis/Api_config'
import { getResolutionApi } from '../../commen/apis/Api_ends_points'
import * as actions from '../action_types'

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
const getAllVotingMethods = (t) => {
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
            .then((response) => {
                console.log("responseresponseresponse", response)
                if (response.data.responseCode === 200) {
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
const getAllResolutionStatus = (t) => {
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
            .then((response) => {
                console.log("responseresponseresponse", response)
                if (response.data.responseCode === 200) {
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
const getResolutions = (id, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let userID = JSON.parse(localStorage.getItem("userID"))
    let Data = {
        FK_UID: userID,
        ResolutionStatus: JSON.parse(id)
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
            .then((response) => {
                console.log("responseresponseresponse", response)
                if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_SearchResolutions_01".toLowerCase()) {
                            dispatch(getResolutions_Success(response.data.responseResult.resolutionTable, t("Data-available")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_SearchResolutions_02".toLowerCase()) {
                            dispatch(getResolutions_Fail("No-data-available"))
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
        message: message
    }
};
const createResolution_Fail = (message) => {
    return {
        type: actions.SCHEDULE_RESOLUTION_FAIL,
        message: message
    }
};
const createResolution = (Data,t) => {
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
            .then((response) => {
                if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_ScheduleResolution_01".toLowerCase()) {
                            dispatch(createResolution_Success(response.data.responseResult.resolutionID, t("Resolution-added-successfully")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_ScheduleResolution_02".toLowerCase()) {
                            dispatch(createResolution_Fail(t("Failed-to-create-resolution")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_ScheduleResolution_03".toLowerCase()) {
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
const updateResolution_Success = (response, message) => {
    return {
        type: actions.ADD_UPDATE_DETAILS_RESOLUTION_SUCCESS,
        response: response,
        message: message

    }
}
const updateResolution_Fail = (message) => {
    return {
        type: actions.ADD_UPDATE_DETAILS_RESOLUTION_FAIL,
        message: message
    }
}
const updateResolution = (Data,t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    return (dispatch) => {
        dispatch(updateResolution_Init());
        let form = new FormData();
        form.append("RequestMethod", addUpdateResolutionRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getResolutionApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then((response) => {
                if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_01".toLowerCase()) {
                            dispatch(updateResolution_Success(response.data.responseResult.resolutionID, t("Resolution-circulated-successfully")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_02".toLowerCase()) {
                            dispatch(updateResolution_Fail(t("Failed-to-update-resolution-status")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase() === "Resolution_ResolutionServiceManager_AddUpdateResolutionDetails_03".toLowerCase()) {
                            dispatch(updateResolution_Success(t("Resolution-details-updated-successfully")))
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

export { getAllVotingMethods, getAllResolutionStatus, getResolutions, updateResolution, createResolution }