import axios from 'axios';
import {
    createFolderRequestMethod, getDocumentsAndFolderRequestMethod, getFolderDocumentsRequestMethod, getMyDocumentsAndFoldersRequestMethod, getSharedFilesandFolderRequestMethod, saveFilesRequestMethod, saveFolderRequestMethod, shareFilesRequestMethod, shareFolderRequestMethod, uploadDocumentsRequestMethod
} from '../../commen/apis/Api_config';
import { dataRoomApi } from '../../commen/apis/Api_ends_points';
import * as actions from '../action_types';
import { RefreshToken } from './Auth_action';


const saveFiles_init = () => {
    return {
        type: actions.SAVEFILES_DATAROOM_INIT
    }
}
const saveFiles_success = (response, message) => {
    return {
        type: actions.SAVEFILES_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
const saveFiles_fail = (message) => {
    return {
        type: actions.SAVEFILES_DATAROOM_FAIL,
        message: message
    }
}

const saveFilesApi = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {}
    return (dispatch) => {
        dispatch(saveFiles_init())
        let form = new FormData();
        form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: dataRoomApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then((response) => {
            if (response.data.responseCode === 417) {
                dispatch(RefreshToken())
            }
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })
    }
}


const uploadDocument_init = () => {
    return {
        type: actions.UPLOAD_DOCUMENTS_DATAROOM_INIT
    }
}
const uploadDocument_success = (response, message) => {
    return {
        type: actions.UPLOAD_DOCUMENTS_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
const uploadDocument_fail = (message) => {
    return {
        type: actions.UPLOAD_DOCUMENTS_DATAROOM_FAIL,
        message: message
    }
}


const uploadDocumentsApi = (data, t, setProgress, setUploadCounter, uploadCounter, setRemainingTime, remainingTime) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let startTime = Date.now();
    return (dispatch) => {
        dispatch(uploadDocument_init())
        let form = new FormData();
        form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(data));
        form.append("File", data);
        axios({
            method: "post",
            url: dataRoomApi,
            data: form,
            headers: {
                _token: token,
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                let currentTime = Date.now();
                let elapsedTime = currentTime - startTime;
                let bytesUploaded = progressEvent.loaded;
                let bytesTotal = progressEvent.total;
                let bytesRemaining = bytesTotal - bytesUploaded;
                let bytesPerSecond = bytesUploaded / (elapsedTime / 1000);
                let secondsRemaining = Math.ceil(bytesRemaining / bytesPerSecond);
                console.log("secondsRemaining elapsedTime", elapsedTime);
                console.log("secondsRemaining bytesUploaded", bytesUploaded);
                console.log("secondsRemaining bytesTotal", bytesTotal);
                console.log("secondsRemaining bytesRemaining", bytesRemaining);
                console.log("secondsRemaining bytesPerSecond", bytesPerSecond);
                console.log("secondsRemaining secondsRemaining", secondsRemaining);
                console.log("secondsRemaining percentCompleted", percentCompleted);
                // if (flag != undefined && flag != null) {
                //     setProgress(percentCompleted);
                //     setRemainingTime(remainingTime + secondsRemaining);
                // }

            },
        })
            .then((response) => {
                if (response.data.responseCode === 417) {
                    dispatch(RefreshToken())
                } else if (response.data.responseCode === 200) {
                    if (response.data.responseResult.isExecuted === true) {
                        if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomServiceManager_UploadDocuments_01".toLowerCase())) {
                            dispatch(uploadDocument_success(response.data.responseResult, t("Document-uploaded-successfully")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase())) {
                            dispatch(uploadDocument_fail(t("Failed-to-update-document")))
                        } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase())) {
                            dispatch(uploadDocument_fail(t("Something-went-wrong")))
                        }
                    } else {
                        dispatch(uploadDocument_fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(uploadDocument_fail(t("Something-went-wrong")))
                }
            }).catch((error) => {
                dispatch(uploadDocument_fail(t("Something-went-wrong")))
            })
    }
}


const saveFolder_init = () => {
    return {
        type: actions.SAVE_FOLDER_DATAROOM_INIT
    }
}
const saveFolder_success = (response, message) => {
    return {
        type: actions.SAVE_FOLDER_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
const saveFolder_fail = (message) => {
    return {
        type: actions.SAVE_FOLDER_DATAROOM_FAIL,
        message: message
    }
}


const saveFolderApi = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {}
    return (dispatch) => {
        let form = new FormData();
        form.append("RequestMethod", saveFolderRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: dataRoomApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then((response) => {
            if (response.data.responseCode === 417) {

            } else if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomServiceManager_CreateFolder_01".toLowerCase())) {

                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomServiceManager_CreateFolder_02".toLowerCase())) {

                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomServiceManager_CreateFolder_03".toLowerCase())) {

                    }
                } else {

                }
            } else {

            }
        }).catch((error) => { })
    }
}


const getMyDocuments_init = () => {
    return {
        type: actions.GETMYDOCUMENTS_DATAROOM_INIT
    }
}

const getMyDocuments_success = (response, message) => {
    return {
        type: actions.GETMYDOCUMENTS_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}

const getMyDocuments_fail = (message) => {
    return {
        type: actions.GETMYDOCUMENTS_DATAROOM_FAIL,
        message: message
    }
}


const getMyDocumentsApi = (t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let createrID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
        UserID: JSON.parse(createrID),
        OrganizationID: JSON.parse(OrganizationID)
    }
    return (dispatch) => {
        dispatch(getMyDocuments_init())
        let form = new FormData();
        form.append("RequestMethod", getDocumentsAndFolderRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: dataRoomApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then((response) => {
            console.log(response, "getMyDocumentsApi")
            if (response.data.responseCode === 417) {
                dispatch(RefreshToken())
            } else if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomManager_GetMyDocuments_01".toLowerCase())) {
                        dispatch(getMyDocuments_success(response.data.responseResult, t("Data-avaiable")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomManager_GetMyDocuments_02".toLowerCase())) {
                        dispatch(getMyDocuments_fail(t("No-data-avaiable")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomManager_GetMyDocuments_03".toLowerCase())) {
                        dispatch(getMyDocuments_fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(getMyDocuments_fail(t("Something-went-wrong")))
                }
            } else {
                dispatch(getMyDocuments_fail(t("Something-went-wrong")))
            }
        }).catch((error) => {
            dispatch(getMyDocuments_fail(t("Something-went-wrong")))
        })
    }
}

const getFolerDocuments_init = () => {
    return {
        type: actions.GET_FOLDER_DOCUMENTS_DATAROOM_INIT
    }
}

const getFolerDocuments_success = (response, message) => {
    return {
        type: actions.GET_FOLDER_DOCUMENTS_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}

const getFolerDocuments_fail = (message) => {
    return {
        type: actions.GET_FOLDER_DOCUMENTS_DATAROOM_FAIL,
        message: message
    }
}

const getFolderDocumentsApi = (FolderId, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = { FolderID: JSON.parse(FolderId) }
    return (dispatch) => {
        dispatch(getFolerDocuments_init())
        let form = new FormData();
        form.append("RequestMethod", getDocumentsAndFolderRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: dataRoomApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then((response) => {
            if (response.data.responseCode === 417) {
                dispatch(RefreshToken())
            } else if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomManager_GetFolderDocuments_01".toLowerCase())) {
                        dispatch(getFolerDocuments_success(response.data.responseResult, t("Data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomManager_GetFolderDocuments_02".toLowerCase())) {
                        dispatch(getFolerDocuments_fail(t("No-record-found")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomManager_GetFolderDocuments_03".toLowerCase())) {
                        dispatch(getFolerDocuments_fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(getFolerDocuments_fail(t("Something-went-wrong")))
                }
            } else {
                dispatch(getFolerDocuments_fail(t("Something-went-wrong")))
            }
        }).catch((error) => {
            dispatch(getFolerDocuments_fail(t("Something-went-wrong")))
        })
    }
}


const createFolder_init = () => {
    return {
        type: actions.CREATE_FOLDER_DATAROOM_INIT
    }
}

const createFolder_success = (response, message) => {
    return {
        type: actions.CREATE_FOLDER_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}

const createFolder_fail = (message) => {
    return {
        type: actions.CREATE_FOLDER_DATAROOM_FAIL,
        message: message
    }
}

const createFolderApi = (folder, parentFolderID, t, setAddfolder) => {
    let createrID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {
        FolderName: folder,
        UserID: parseInt(createrID),
        OrganizationID: parseInt(OrganizationID),
        ParentFolderID: parentFolderID
    }
    return (dispatch) => {
        dispatch(createFolder_init())
        let form = new FormData();
        form.append("RequestMethod", createFolderRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: dataRoomApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then(async (response) => {
            if (response.data.responseCode === 417) {
                dispatch(RefreshToken())
            } else if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomServiceManager_CreateFolder_01".toLowerCase())) {
                        await dispatch(createFolder_success(response.data.responseResult, t("Folder-created-successfully")))
                        dispatch(getAllDocumentsAndFolderApi(3, t))
                        setAddfolder(false)
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomServiceManager_CreateFolder_02".toLowerCase())) {
                        dispatch(createFolder_fail(t("Failed-to-create-folder")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomServiceManager_CreateFolder_03".toLowerCase())) {
                        dispatch(createFolder_fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(createFolder_fail(t("Something-went-wrong")))
                }
            } else {
                dispatch(createFolder_fail(t("Something-went-wrong")))
            }
        }).catch((error) => {
            dispatch(createFolder_fail(t("Something-went-wrong")))
        })
    }
}

const getAllDocumentsAndFolders_init = () => {
    return {
        type: actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_INIT
    }
}
const getAllDocumentsAndFolders_success = (response, message) => {
    return {
        type: actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
const getAllDocumentsAndFolders_fail = (message) => {
    return {
        type: actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_FAIL,
        message: message
    }
}

const getAllDocumentsAndFolderApi = (statusID, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let createrID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
        UserID: parseInt(createrID),
        OrganizationID: parseInt(OrganizationID),
        StatusID: parseInt(statusID)
    }
    return (dispatch) => {
        dispatch(getAllDocumentsAndFolders_init())
        let form = new FormData();
        form.append("RequestMethod", getDocumentsAndFolderRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: dataRoomApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then((response) => {
            if (response.data.responseCode === 417) {
                dispatch(RefreshToken())
            } else if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage.toLowerCase() === ("DataRoom_DataRoomManager_GetDocumentsAndFolders_01".toLowerCase())) {
                        dispatch(getAllDocumentsAndFolders_success(response.data.responseResult, t("Data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase() === ("DataRoom_DataRoomManager_GetDocumentsAndFolders_02".toLowerCase())) {
                        dispatch(getAllDocumentsAndFolders_fail(t("No-record-found")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase() === ("DataRoom_DataRoomManager_GetDocumentsAndFolders_03".toLowerCase())) {
                        dispatch(getAllDocumentsAndFolders_fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(getAllDocumentsAndFolders_fail(t("Something-went-wrong")))
                }
            } else {
                dispatch(getAllDocumentsAndFolders_fail(t("Something-went-wrong")))
            }
        }).catch((error) => {
            dispatch(getAllDocumentsAndFolders_fail(t("Something-went-wrong")))
        })
    }
}

const shareFiles_init = () => {
    return {
        type: actions.SHAREFILES_DATAROOM_INIT
    }
}
const shareFiles_success = (response, message) => {
    return {
        type: actions.SHAREFILES_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
const shareFiles_fail = (message) => {
    return {
        type: actions.SHAREFILES_DATAROOM_FAIL,
        message: message
    }
}

const shareFilesApi = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {}
    return (dispatch) => {
        let form = new FormData();
        form.append("RequestMethod", shareFilesRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: dataRoomApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then((response) => {
            if (response.data.responseCode === 417) {

            }
        }).catch((error) => { })
    }
}

const shareFolders_init = () => {
    return {
        type: actions.SHAREFOLDERS_DATAROOM_INIT
    }
}
const shareFolders_success = (response, message) => {
    return {
        type: actions.SHAREFILES_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
const shareFolders_fail = (message) => {
    return {
        type: actions.SHAREFOLDERS_DATAROOM_FAIL,
        message: message
    }
}

const shareFoldersApi = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {}
    return (dispatch) => {
        let form = new FormData();
        form.append("RequestMethod", shareFolderRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: dataRoomApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then((response) => {
            if (response.data.responseCode === 417) {

            }
        }).catch((error) => { })
    }
}


const getSharedFilesandFolder_init = () => {
    return {
        type: actions.GET_ALLSHAREDFILESANDFOLDER_DATAROOM_INIT
    }
}
const getSharedFilesandFolder_success = (response, message) => {
    return {
        type: actions.GET_ALLSHAREDFILESANDFOLDER_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
const getSharedFilesandFolder_fail = (message) => {
    return {
        type: actions.GET_ALLSHAREDFILESANDFOLDER_DATAROOM_FAIL,
        message: message
    }
}

const getSharedFilesandFolderApi = (t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {}
    return (dispatch) => {
        dispatch(getSharedFilesandFolder_init())
        let form = new FormData();
        form.append("RequestMethod", getSharedFilesandFolderRequestMethod.RequestMethod);
        form.append("RequestData", JSON.stringify(Data));
        axios({
            method: "post",
            url: dataRoomApi,
            data: form,
            headers: {
                _token: token,
            },
        }).then((response) => {
            if (response.data.responseCode === 417) {

            } else if (response.data.responseCode === 200) {
                if (response.data.responseResult.isExecuted === true) {
                    if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomManager_GetSharedFilesAndFolders_01".toLowerCase())) {
                        dispatch(getSharedFilesandFolder_success(response.data.responseResult, t("Data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomManager_GetSharedFilesAndFolders_02".toLowerCase())) {
                        dispatch(getSharedFilesandFolder_fail(t("No-data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomManager_GetSharedFilesAndFolders_03".toLowerCase())) {
                        dispatch(getSharedFilesandFolder_fail(t("No-data-available")))
                    }
                } else {
                    dispatch(getSharedFilesandFolder_fail(t("No-data-available")))
                }
            } else {
                dispatch(getSharedFilesandFolder_fail(t("No-data-available")))
            }
        }).catch((error) => {
            dispatch(getSharedFilesandFolder_fail(t("No-data-available")))
        })
    }
}

export { saveFilesApi, getSharedFilesandFolderApi, getMyDocumentsApi, getFolderDocumentsApi, shareFoldersApi, saveFolderApi, shareFilesApi, getAllDocumentsAndFolderApi, createFolderApi, uploadDocumentsApi }