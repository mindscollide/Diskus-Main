import axios from 'axios'
import {
  FolderisExistRequestMethod,
  createFolderRequestMethod,
  getDocumentsAndFolderRequestMethod,
  saveFilesRequestMethod,
  uploadDocumentsRequestMethod,
} from '../../commen/apis/Api_config'

import { dataRoomApi } from '../../commen/apis/Api_ends_points'
import * as actions from '../action_types'
import { RefreshToken } from './Auth_action'

import {
  getDocumentsAndFolderApi,
  getFolderDocumentsApi,
} from './DataRoom_actions'

// Folder Exist init
const FolderisExist_init = () => {
  return {
    type: actions.FOLDERISEXIST_INIT,
  }
}

// Folder Exist success
const FolderisExist_success = (message) => {
  return {
    type: actions.FOLDERISEXIST_SUCCESS,
    message: message,
  }
}

// Folder Exist fail
const FolderisExist_fail = (message) => {
  return {
    type: actions.FOLDERISEXIST_FAIL,
    message: message,
  }
}

// Folder Exist API
const FolderisExist2 = (
  navigate,
  folderName,
  t,
  file,
  setProgress,
  setRemainingTime,
  remainingTime,
  setShowbarupload,
  setTasksAttachments,
  setAddfolder,
) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let createrID = localStorage.getItem('userID')
  let folderID = JSON.parse(localStorage.getItem('folderID'))
  let Data = {
    UserID: JSON.parse(createrID),
    ParentFolderID: folderID !== null ? folderID : 0,
    FolderName: folderName,
  }
  return (dispatch) => {
    dispatch(FolderisExist_init())
    let form = new FormData()
    form.append('RequestMethod', FolderisExistRequestMethod.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(FolderisExist2(navigate, folderName, t, setAddfolder))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_FolderExist_01'.toLowerCase(),
                )
            ) {
              dispatch(FolderisExist_fail(t('Folder-already-exist')))
              setAddfolder(true)
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_FolderExist_02'.toLowerCase(),
                )
            ) {
              await dispatch(FolderisExist_fail(t('Folder-name-is-required')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_FolderExist_03'.toLowerCase(),
                )
            ) {
              await dispatch(
                FolderisExist_fail(t('No-folder-exist-against-this-name')),
              )
              dispatch(createFolderApi(navigate, folderName, t))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_FolderExist_04'.toLowerCase(),
                )
            ) {
              dispatch(FolderisExist_fail(t('Something-went-wrong')))
            }
          } else {
            dispatch(FolderisExist_fail(t('Something-went-wrong')))
          }
        } else {
          dispatch(FolderisExist_fail(t('Something-went-wrong')))
        }
      })
      .catch(() => {
        dispatch(FolderisExist_fail(t('Something-went-wrong')))
      })
  }
}

// Create Folder Init
const createFolder_init = () => {
  return {
    type: actions.CREATE_FOLDER_DATAROOM_INIT,
  }
}

// Create Folder Success
const createFolder_success = (response, message) => {
  return {
    type: actions.CREATE_FOLDER_DATAROOM_SUCCESS,
    response: response,
    message: message,
  }
}

// Create Folder Fail
const createFolder_fail = (message) => {
  return {
    type: actions.CREATE_FOLDER_DATAROOM_FAIL,
    message: message,
  }
}

// Create Folder API
const createFolderApi = (navigate, folder, t, setAddfolder) => {
  let createrID = localStorage.getItem('userID')
  let OrganizationID = localStorage.getItem('organizationID')
  let token = JSON.parse(localStorage.getItem('token'))
  let folderID = JSON.parse(localStorage.getItem('folderID'))
  let Data = {
    FolderName: folder,
    UserID: parseInt(createrID),
    OrganizationID: parseInt(OrganizationID),
    ParentFolderID: folderID !== null ? folderID : 0,
  }
  return (dispatch) => {
    dispatch(createFolder_init())
    let form = new FormData()
    form.append('RequestMethod', createFolderRequestMethod.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(createFolderApi(navigate, folder, t, setAddfolder))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_CreateFolder_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                createFolder_success(
                  response.data.responseResult,
                  t('Folder-created-successfully'),
                ),
              )
              // if (folderID !== null) {
              //     dispatch(getFolderDocumentsApi(navigate, folderID, t))
              // } else {
              //     dispatch(getDocumentsAndFolderApi(navigate, 3, t))
              // }
              setAddfolder(false)
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_CreateFolder_02'.toLowerCase(),
                )
            ) {
              dispatch(createFolder_fail(t('Failed-to-create-folder')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_CreateFolder_03'.toLowerCase(),
                )
            ) {
              dispatch(createFolder_fail(t('Something-went-wrong')))
            }
          } else {
            dispatch(createFolder_fail(t('Something-went-wrong')))
          }
        } else {
          dispatch(createFolder_fail(t('Something-went-wrong')))
        }
      })
      .catch((error) => {
        dispatch(createFolder_fail(t('Something-went-wrong')))
      })
  }
}

// Upload Documents Init
const uploadDocument_init = () => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_INIT,
  }
}

// Upload Documents Success
const uploadDocument_success = (response, message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_SUCCESS,
    response: response,
    message: message,
  }
}

// Upload Documents Fail
const uploadDocument_fail = (message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_FAIL,
    message: message,
  }
}

// Upload Documents API
const uploadDocumentsApi = (
  navigate,
  file,
  t,
  setProgress,
  setRemainingTime,
  remainingTime,
  setShowbarupload,
  setTasksAttachments,
) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let startTime = Date.now()
  return (dispatch) => {
    // dispatch(uploadDocument_init())
    setProgress(0)
    setShowbarupload(true)
    let form = new FormData()
    form.append('RequestMethod', uploadDocumentsRequestMethod.RequestMethod)
    form.append('RequestData', JSON.stringify(file))
    form.append('File', file)
    axios({
      method: 'post',
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
      onUploadProgress: (progressEvent) => {
        setTasksAttachments((prev) => {
          return { ...prev, [file.uid]: file }
        })
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        )
        let currentTime = Date.now()
        let elapsedTime = currentTime - startTime
        let bytesUploaded = progressEvent.loaded
        let bytesTotal = progressEvent.total
        let bytesRemaining = bytesTotal - bytesUploaded
        let bytesPerSecond = bytesUploaded / (elapsedTime / 1000)
        let secondsRemaining = Math.ceil(bytesRemaining / bytesPerSecond)
        console.log('secondsRemaining elapsedTime', elapsedTime)
        console.log('secondsRemaining bytesUploaded', bytesUploaded)
        console.log('secondsRemaining bytesTotal', bytesTotal)
        console.log('secondsRemaining bytesRemaining', bytesRemaining)
        console.log('secondsRemaining bytesPerSecond', bytesPerSecond)
        console.log('secondsRemaining secondsRemaining', secondsRemaining)
        console.log('secondsRemaining percentCompleted', percentCompleted)
        setProgress(percentCompleted)
        setRemainingTime(remainingTime + secondsRemaining)
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(
            uploadDocumentsApi(
              navigate,
              file,
              t,
              setProgress,
              setRemainingTime,
              remainingTime,
              setShowbarupload,
            ),
          )
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_UploadDocuments_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                uploadDocument_success(
                  response.data.responseResult,
                  t('Document-uploaded-successfully'),
                ),
              )
              await dispatch(
                saveFilesApi(
                  navigate,
                  response.data.responseResult,
                  t,
                  setShowbarupload,
                  setTasksAttachments,
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_UploadDocuments_02'.toLowerCase(),
                )
            ) {
              dispatch(uploadDocument_fail(t('Failed-to-update-document')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_UploadDocuments_03'.toLowerCase(),
                )
            ) {
              dispatch(uploadDocument_fail(t('Something-went-wrong')))
            }
          } else {
            dispatch(uploadDocument_fail(t('Something-went-wrong')))
          }
        } else {
          dispatch(uploadDocument_fail(t('Something-went-wrong')))
        }
      })
      .catch((error) => {
        dispatch(uploadDocument_fail(t('Something-went-wrong')))
      })
  }
}

// Save Files Init
const saveFiles_init = () => {
  return {
    type: actions.SAVEFILES_DATAROOM_INIT,
  }
}
// Save Files Success
const saveFiles_success = (response, message) => {
  return {
    type: actions.SAVEFILES_DATAROOM_SUCCESS,
    response: response,
    message: message,
  }
}
// Save Files Fail
const saveFiles_fail = (message) => {
  return {
    type: actions.SAVEFILES_DATAROOM_FAIL,
    message: message,
  }
}

// Save Files API
const saveFilesApi = (
  navigate,
  data,
  t,
  setShowbarupload,
  setTasksAttachments,
) => {
  let token = JSON.parse(localStorage.getItem('token'))
  let createrID = localStorage.getItem('userID')
  let OrganizationID = localStorage.getItem('organizationID')
  let folderID = JSON.parse(localStorage.getItem('folderID'))
  console.log(folderID, 'folderIDfolderIDfolderID')
  let Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: [
      {
        DisplayFileName: data.displayFileName,
        DiskusFileName: JSON.parse(data.diskusFileName),
        ShareAbleLink: data.shareAbleLink,
        FK_UserID: JSON.parse(createrID),
        FK_OrganizationID: JSON.parse(OrganizationID),
      },
    ],
  }
  return (dispatch) => {
    // dispatch(saveFiles_init())
    let form = new FormData()
    form.append('RequestMethod', saveFilesRequestMethod.RequestMethod)
    form.append('RequestData', JSON.stringify(Data))
    axios({
      method: 'post',
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t))
          dispatch(saveFilesApi(navigate, data, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_SaveFiles_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                saveFiles_success(
                  response.data.responseMessage,
                  t('Files-saved-successfully'),
                ),
              )
              setShowbarupload(false)
              setTasksAttachments([])
              if (folderID !== null) {
                dispatch(getFolderDocumentsApi(navigate, folderID, t))
              } else {
                dispatch(getDocumentsAndFolderApi(navigate, 1, t))
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_SaveFiles_02'.toLowerCase(),
                )
            ) {
              dispatch(saveFiles_fail(t('Failed-to-save-any-file')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'DataRoom_DataRoomServiceManager_SaveFiles_03'.toLowerCase(),
                )
            ) {
              dispatch(saveFiles_fail(t('Something-went-wrong')))
            }
          } else {
            dispatch(saveFiles_fail(t('Something-went-wrong')))
          }
        } else {
          dispatch(saveFiles_fail(t('Something-went-wrong')))
        }
        console.log(response)
      })
      .catch(() => {
        dispatch(saveFiles_fail(t('Something-went-wrong')))
      })
  }
}

export { saveFilesApi, createFolderApi, uploadDocumentsApi, FolderisExist2 }
