import * as actions from '../action_types'
import axios from 'axios'
import { getNotesApi } from '../../commen/apis/Api_ends_points'
import { GetNotesByUserIDAndOrganizationID, SavesNotesRequestMethod, UpdateNotesRequestMethod, GetNotesByNotesIDRequestMethod } from '../../commen/apis/Api_config'
import { RefreshToken } from './Auth_action'


const getNotes_Init = () => {
    return {
        type: actions.GET_NOTES_INIT,
    }
}

const getNotes_Success = (response, message) => {
    return {
        type: actions.GET_NOTES_SUCCESS,
        response: response,
        message: message
    }
}

const getNotes_Fail = (message) => {
    return {
        type: actions.GET_NOTES_FAIL,
        message: message
    }
}

const GetNotes = (Data, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    return (dispatch) => {
        dispatch(getNotes_Init());
        let form = new FormData();
        form.append("RequestMethod", GetNotesByUserIDAndOrganizationID.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getNotesApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(t));
                    // dispatch(GetNotes(t)); 
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_GetNotesByUserIDAndOrganizationID_01".toLowerCase())) {
                            dispatch(getNotes_Success(response.data.responseResult.getNotes, t("Data-available")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_GetNotesByUserIDAndOrganizationID_02".toLowerCase())) {
                            dispatch(getNotes_Fail(t("No-data-available")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_GetNotesByUserIDAndOrganizationID_03".toLowerCase())) {
                            dispatch(getNotes_Fail(t("Something-went-wrong")))
                        } else {
                            dispatch(getNotes_Fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(getNotes_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(getNotes_Fail(t("Something-went-wrong")))
                }
                console.log("responseresponse", response)
            })
            .catch((response) => {
                dispatch(getNotes_Fail(t("Something-went-wrong")))
            });
    };
}

const saveNotes_Init = () => {
    return {
        type: actions.ADD_NOTES_INIT,
    }
}

const saveNotes_Success = (response, message) => {
    return {
        type: actions.ADD_NOTES_SUCCESS,
        response: response,
        message: message
    }
}

const saveNotes_Fail = (message) => {
    return {
        type: actions.ADD_NOTES_FAIL,
        message: message
    }
}

const SaveNotesAPI = (Data, t, setAddNewModal) => {
    console.log("DataDataData", Data)
    let token = JSON.parse(localStorage.getItem("token"));
    let createrID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID")
    let getNotesAPI = { UserID: parseInt(createrID), OrganizationID: JSON.parse(OrganizationID) }
    return (dispatch) => {
        dispatch(saveNotes_Init());
        let form = new FormData();
        form.append("RequestMethod", SavesNotesRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getNotesApi,
            data: form,
            headers: {
                _token: token,
            },
        })
            .then(async (response) => {
                console.log("checking")
                if (response.data.responseCode === 417) {
                    await dispatch(RefreshToken(t));
                    // dispatch(GetNotes(t)); 
                } else if (response.data.responseCode === 200) {
                    console.log("checking")
                    if (response.data.responseResult.isExecuted === true) {
                        console.log("checking")
                        if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_SaveNotes_01".toLowerCase())) {
                            dispatch(saveNotes_Success(response.data.responseResult.getNotes, t("Notes-saved-successfully")))
                            dispatch(GetNotes(getNotesAPI, t))
                            setAddNewModal(false)
                            console.log("checking")
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_SaveNotes_02".toLowerCase())) {
                            dispatch(saveNotes_Success(response.data.responseResult.getNotes, t("Notes-saved-successfully-with-attachments")))
                            dispatch(GetNotes(getNotesAPI, t))
                            setAddNewModal(false)
                            console.log("checking")
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_SaveNotes_03".toLowerCase())) {
                            dispatch(saveNotes_Fail(t("Failed-to-save-notes")))
                        } else {
                            dispatch(saveNotes_Fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(saveNotes_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(saveNotes_Fail(t("Something-went-wrong")))
                }
                console.log("responseresponse", response)
            })
            .catch((response) => {
                dispatch(saveNotes_Fail(t("Something-went-wrong")))
                console.log("responseresponse", response)
            });
    };
}
const UpdateNotes_Init = () => {
    return {
        type: actions.UPDATE_NOTES_INIT,
    }
}

const UpdateNotes_Success = (response, message) => {
    return {
        type: actions.UPDATE_NOTES_SUCCESS,
        response: response,
        message: message
    }
}

const UpdateNotes_Fail = (message) => {
    return {
        type: actions.UPDATE_NOTES_FAIL,
        message: message
    }
}

const UpdateNotesAPI = (data, t, setIsUpdateNote,setIsDeleteNote,setUpdateNotes) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let createrID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID")
    let getNotesAPI = { UserID: parseInt(createrID), OrganizationID: JSON.parse(OrganizationID) }
    return (dispatch) => {
        dispatch(UpdateNotes_Init());
        let form = new FormData();
        form.append("RequestMethod", UpdateNotesRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(data));
        axios({
            method: "post",
            url: getNotesApi,
            data: form,
            headers: {
                _token: token,
            },
        })
        .then(async (response) => {
            if (response.data.responseCode === 417) {
                await dispatch(RefreshToken(t));
                // dispatch(GetNotes(t)); 
            } else if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage.toLowerCase().includes("NNotes_NotesServiceManager_UpdateNotes_01".toLowerCase())) {
                        dispatch(UpdateNotes_Success(response.data.responseResult.getNotes, t("Data-available")))
                        dispatch(GetNotes(getNotesAPI, t))
                        setIsUpdateNote(false)
                        setUpdateNotes(false)
                        setIsDeleteNote(false)
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_UpdateNotes_02".toLowerCase())) {
                        dispatch(UpdateNotes_Success(t("No-data-available")))
                        dispatch(GetNotes(getNotesAPI, t))
                        setIsUpdateNote(false)
                        setUpdateNotes(false)
                        setIsDeleteNote(false)
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_UpdateNotes_03".toLowerCase())) {
                        dispatch(UpdateNotes_Fail(t("Something-went-wrong")))
                    } else if(response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_UpdateNotes_04".toLowerCase())) {
                        dispatch(UpdateNotes_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(UpdateNotes_Fail(t("Something-went-wrong")))
                }
            } else {
                dispatch(UpdateNotes_Fail(t("Something-went-wrong")))
            }
            console.log("responseresponse", response)
        })
            .catch((response) => {
                console.log("responseresponse", response)
                dispatch(UpdateNotes_Fail(t("Something-went-wrong")))
            });
    };
}
const GetNotesById_Init = () => {
    return {
        type: actions.GET_NOTES_BY_NOTESID_INIT,
    }
}

const GetNotesById_Success = (response, message) => {
    console.log("NotesReducerNotesReducer", response)
    return {
        type: actions.GET_NOTES_BY_NOTESID_SUCCESS,
        response: response,
        message: message
    }
}

const GetNotesById_Fail = (message) => {
    return {
        type: actions.GET_NOTES_BY_NOTESID_FAIL,
        message: message
    }
}

const GetNotesByIdAPI = (NotesID, t, setViewModalShow, setUpdateModalShow, no) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {
        NotesID: JSON.parse(NotesID)
    }
    let createrID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID")
    let getNotesAPI = { UserID: parseInt(createrID), OrganizationID: JSON.parse(OrganizationID) }
    return (dispatch) => {
        dispatch(GetNotesById_Init());
        let form = new FormData();
        form.append("RequestMethod", GetNotesByNotesIDRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: getNotesApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then(async (response) => {
            console.log("responseresponse", response)
            if (response.data.responseCode === 417) {
                await dispatch(RefreshToken(t));
                // dispatch(GetNotes(t)); 
            } else if (response.data.responseCode === 200) {
                console.log("responseresponse", response)
                if (response.data.responseResult.isExecuted === true) {
                    console.log("responseresponse", response)
                    if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_GetNotesByNotesID_01".toLowerCase())) {
                        dispatch(GetNotesById_Success(response.data.responseResult.getNotes, t("Data-available")))
                        // await dispatch(GetNotes(getNotesAPI, t))
                        if (no === 1) {
                            await setViewModalShow(true)
                            await setUpdateModalShow(false)
                        } else {
                            await setUpdateModalShow(true)
                            await setViewModalShow(false)
                        }
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_GetNotesByNotesID_02".toLowerCase())) {
                        dispatch(GetNotesById_Fail(t("No-data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_GetNotesByNotesID_03".toLowerCase())) {
                        dispatch(GetNotesById_Fail(t("Something-went-wrong")))
                    } else {
                        dispatch(GetNotesById_Fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(GetNotesById_Fail(t("Something-went-wrong")))
                }
            } else {
                dispatch(GetNotesById_Fail(t("Something-went-wrong")))
            }
            console.log("responseresponse", response)
        })
            .catch((response) => {
                console.log("responseresponse", response)
                dispatch(GetNotesById_Fail(t("Something-went-wrong")))
            });
    };
}
export { GetNotes, SaveNotesAPI, UpdateNotesAPI, GetNotesByIdAPI }