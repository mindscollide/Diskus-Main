import axios from 'axios';
import { createFolderRequestMethod, getAllDocumentsAndFolderRequestMethod, getFolderDocumentsRequestMethod, getMyDocumentsRequestMethod, getSharedFilesandFolderRequestMethod, saveFilesRequestMethod, saveFolderRequestMethod, shareFilesRequestMethod, shareFolderRequestMethod, uploadDocumentsRequestMethod } from '../../commen/apis/Api_config';
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


const uploadDocumentsApi = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {}
    return (dispatch) => {
        let form = new FormData();
        form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
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

                    }else if (response.data.responseResult.responseMessage.toLowerCase().includes("DataRoom_DataRoomServiceManager_CreateFolder_03".toLowerCase())) {

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


const getMyDocumentsApi = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {}
    return (dispatch) => {
        let form = new FormData();
        form.append("RequestMethod", getMyDocumentsRequestMethod.RequestMethod);
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

const getFolderDocumentsApi = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {}
    return (dispatch) => {
        let form = new FormData();
        form.append("RequestMethod", getFolderDocumentsRequestMethod.RequestMethod);
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

const createFolderApi = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {}
    return (dispatch) => {
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
        }).then((response) => {
            if (response.data.responseCode === 417) {

            }
        }).catch((error) => { })
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


const getAllDocumentsAndFolderApi = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {}
    return (dispatch) => {
        let form = new FormData();
        form.append("RequestMethod", getAllDocumentsAndFolderRequestMethod.RequestMethod);
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

const getSharedFilesandFolderApi = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = {}
    return (dispatch) => {
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

            }
        }).catch((error) => { })
    }
}

export { saveFilesApi, getSharedFilesandFolderApi, getMyDocumentsApi, getFolderDocumentsApi, shareFoldersApi, saveFolderApi, shareFilesApi, getAllDocumentsAndFolderApi, createFolderApi, uploadDocumentsApi }