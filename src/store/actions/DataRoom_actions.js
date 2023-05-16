import axios from 'axios';
import {
    FileisExistRequestMethod, FolderisExistRequestMethod, deleteFileRequestMethod, createFolderRequestMethod, getDocumentsAndFolderRequestMethod, getFolderDocumentsRequestMethod, getMyDocumentsAndFoldersRequestMethod, saveFilesRequestMethod, saveFolderRequestMethod, shareFilesRequestMethod, shareFolderRequestMethod, uploadDocumentsRequestMethod
} from '../../commen/apis/Api_config';
import { dataRoomApi } from '../../commen/apis/Api_ends_points';
import * as actions from '../action_types';
import { RefreshToken } from './Auth_action';

// Save Files Init
const saveFiles_init = () => {
    return {
        type: actions.SAVEFILES_DATAROOM_INIT
    }
}
// Save Files Success
const saveFiles_success = (response, message) => {
    return {
        type: actions.SAVEFILES_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
// Save Files Fail
const saveFiles_fail = (message) => {
    return {
        type: actions.SAVEFILES_DATAROOM_FAIL,
        message: message
    }
}

// Save Files API
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

// Upload Documents Init
const uploadDocument_init = () => {
    return {
        type: actions.UPLOAD_DOCUMENTS_DATAROOM_INIT
    }
}
// Upload Documents Success
const uploadDocument_success = (response, message) => {
    return {
        type: actions.UPLOAD_DOCUMENTS_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
// Upload Documents Fail
const uploadDocument_fail = (message) => {
    return {
        type: actions.UPLOAD_DOCUMENTS_DATAROOM_FAIL,
        message: message
    }
}

// Upload Documents API
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
            // onUploadProgress: (progressEvent) => {
            //     const percentCompleted = Math.round(
            //         (progressEvent.loaded * 100) / progressEvent.total
            //     );
            //     let currentTime = Date.now();
            //     let elapsedTime = currentTime - startTime;
            //     let bytesUploaded = progressEvent.loaded;
            //     let bytesTotal = progressEvent.total;
            //     let bytesRemaining = bytesTotal - bytesUploaded;
            //     let bytesPerSecond = bytesUploaded / (elapsedTime / 1000);
            //     let secondsRemaining = Math.ceil(bytesRemaining / bytesPerSecond);
            //     console.log("secondsRemaining elapsedTime", elapsedTime);
            //     console.log("secondsRemaining bytesUploaded", bytesUploaded);
            //     console.log("secondsRemaining bytesTotal", bytesTotal);
            //     console.log("secondsRemaining bytesRemaining", bytesRemaining);
            //     console.log("secondsRemaining bytesPerSecond", bytesPerSecond);
            //     console.log("secondsRemaining secondsRemaining", secondsRemaining);
            //     console.log("secondsRemaining percentCompleted", percentCompleted);
            //     // if (flag != undefined && flag != null) {
            //     //     setProgress(percentCompleted);
            //     //     setRemainingTime(remainingTime + secondsRemaining);
            //     // }

            // },
        })
            .then((response) => {
                if (response.data.responseCode === 417) {
                    dispatch(RefreshToken(t))
                    dispatch(uploadDocumentsApi(data, t, setProgress, setUploadCounter, uploadCounter, setRemainingTime, remainingTime))
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

// Save Folder Init
const saveFolder_init = () => {
    return {
        type: actions.SAVE_FOLDER_DATAROOM_INIT
    }
}
// Save Folder Success
const saveFolder_success = (response, message) => {
    return {
        type: actions.SAVE_FOLDER_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
// Save Folder Fail
const saveFolder_fail = (message) => {
    return {
        type: actions.SAVE_FOLDER_DATAROOM_FAIL,
        message: message
    }
}

// Save Folder API
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

// Get Folder Documents Init
const getFolerDocuments_init = () => {
    return {
        type: actions.GET_FOLDER_DOCUMENTS_DATAROOM_INIT
    }
}
// Get Folder Documents Success
const getFolerDocuments_success = (response, message) => {
    return {
        type: actions.GET_FOLDER_DOCUMENTS_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
// Get Folder Documents Fail
const getFolerDocuments_fail = (message) => {
    return {
        type: actions.GET_FOLDER_DOCUMENTS_DATAROOM_FAIL,
        message: message
    }
}
// Get Folder Documents Api
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

// Create Folder Init
const createFolder_init = () => {
    return {
        type: actions.CREATE_FOLDER_DATAROOM_INIT
    }
}
// Create Folder Success
const createFolder_success = (response, message) => {
    return {
        type: actions.CREATE_FOLDER_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
// Create Folder Fail
const createFolder_fail = (message) => {
    return {
        type: actions.CREATE_FOLDER_DATAROOM_FAIL,
        message: message
    }
}
// Create Folder API
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
                        dispatch(getDocumentsAndFolderApi(3, t))
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

// Get Documents and Folders Init
const getDocumentsAndFolders_init = () => {
    return {
        type: actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_INIT
    }
}
// Get Documents and Folders Success
const getDocumentsAndFolders_success = (response, message) => {
    return {
        type: actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
// Get Documents and Folders Fail
const getDocumentsAndFolders_fail = (message) => {
    return {
        type: actions.GETALLDOCUMENTSANDFOLDER_DATAROOM_FAIL,
        message: message
    }
}
// Get Documents And Folder API
const getDocumentsAndFolderApi = (statusID, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let createrID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID");
    let Data = {
        UserID: parseInt(createrID),
        OrganizationID: parseInt(OrganizationID),
        StatusID: parseInt(statusID)
    }
    // let Data = {
    //     UserID: 722,
    //     OrganizationID: 270,
    //     StatusID: parseInt(statusID)
    // }
    return (dispatch) => {
        dispatch(getDocumentsAndFolders_init())
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
                    if (response.data.responseResult.responseMessage.toLowerCase() === "DataRoom_DataRoomManager_GetDocumentsAndFolders_01".toLowerCase()) {
                        dispatch(getDocumentsAndFolders_success(response.data.responseResult.data, t("Data-available")))
                    } else if (response.data.responseResult.responseMessage.toLowerCase() === "DataRoom_DataRoomManager_GetDocumentsAndFolders_02".toLowerCase()) {
                        dispatch(getDocumentsAndFolders_fail(t("No-record-found")))
                        console.log("checking1212")
                    } else if (response.data.responseResult.responseMessage.toLowerCase() === "DataRoom_DataRoomManager_GetDocumentsAndFolders_03".toLowerCase()) {
                        dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")))
                    }
                } else {
                    dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")))
                }
            } else {
                dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")))
            }
        }).catch((error) => {
            dispatch(getDocumentsAndFolders_fail(t("Something-went-wrong")))
        })
    }
}

// Share Files Init
const shareFiles_init = () => {
    return {
        type: actions.SHAREFILES_DATAROOM_INIT
    }
}
// Share Files Success
const shareFiles_success = (response, message) => {
    return {
        type: actions.SHAREFILES_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
// Share Files Fail
const shareFiles_fail = (message) => {
    return {
        type: actions.SHAREFILES_DATAROOM_FAIL,
        message: message
    }
}

// Share Files Api
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

// Share Folders Init
const shareFolders_init = () => {
    return {
        type: actions.SHAREFOLDERS_DATAROOM_INIT
    }
}
// Share Folders Success
const shareFolders_success = (response, message) => {
    return {
        type: actions.SHAREFILES_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}
// Share Folders Fail
const shareFolders_fail = (message) => {
    return {
        type: actions.SHAREFOLDERS_DATAROOM_FAIL,
        message: message
    }
}
// Share Folders Api
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


// Delete file init
const deleteFileDataroom_init = () => {
    return {
        type: actions.DELETEFILE_DATAROOM_INIT
    }
}

// Delete file success
const deleteFileDataroom_success = (response, message) => {
    return {
        type: actions.DELETEFILE_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}

// Delete file fail
const deleteFileDataroom_fail = (message) => {
    return {
        type: actions.DELETEFILE_DATAROOM_FAIL,
        message: message
    }
}

// Delete file API
const deleteFileDataroom = () => {
    let token = JSON.parse(localStorage.getItem("token"));
    let Data = { File: [] }
    return (dispatch) => {
        let form = new FormData();
        form.append("RequestMethod", deleteFileRequestMethod.RequestMethod);
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

// File Exist init
const FileisExist_init = () => {
    return {
        type: actions.DELETEFILE_DATAROOM_INIT
    }
}

// File Exist success
const FileisExist_success = (response, message) => {
    return {
        type: actions.DELETEFILE_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}

// File Exist fail
const FileisExist_fail = (message) => {
    return {
        type: actions.DELETEFILE_DATAROOM_FAIL,
        message: message
    }
}

// File Exist API
const FileisExist = (FileName) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let createrID = localStorage.getItem("userID");
    let Data = {
        UserID: JSON.parse(createrID),
        ParentFolderID: 0,
        FileName: FileName
    }
    return (dispatch) => {
        let form = new FormData();
        form.append("RequestMethod", FileisExistRequestMethod.RequestMethod);
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

// Folder Exist init
const FolderisExist_init = () => {
    return {
        type: actions.DELETEFILE_DATAROOM_INIT
    }
}

// Folder Exist success
const FolderisExist_success = (response, message) => {
    return {
        type: actions.DELETEFILE_DATAROOM_SUCCESS,
        response: response,
        message: message
    }
}

// Folder Exist fail
const FolderisExist_fail = (message) => {
    return {
        type: actions.DELETEFILE_DATAROOM_FAIL,
        message: message
    }
}

// Folder Exist API
const FolderisExist = (FolderName, t) => {
    let token = JSON.parse(localStorage.getItem("token"));
    let createrID = localStorage.getItem("userID");
    let Data = {
        UserID: JSON.parse(createrID),
        ParentFolderID: 0,
        FolderName: FolderName
    }
    return (dispatch) => {
        let form = new FormData();
        form.append("RequestMethod", FolderisExistRequestMethod.RequestMethod);
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

const clearDataResponseMessage = () => {
    return {
        type: actions.CLEARE_MESSAGE
    }
}
export { saveFilesApi, getDocumentsAndFolderApi, deleteFileDataroom, clearDataResponseMessage, getFolderDocumentsApi, shareFoldersApi, saveFolderApi, shareFilesApi, createFolderApi, uploadDocumentsApi }