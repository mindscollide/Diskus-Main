import axios from 'axios'
import { getAllVotingRequestMethod, getAllVotingStatusRequestMethod, getResolutionsRequestMethod } from '../../commen/apis/Api_config'
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
export { getAllVotingMethods, getAllResolutionStatus, getResolutions }