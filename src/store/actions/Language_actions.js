import * as actions from '../action_types'
import axios from 'axios'
import { RefreshToken } from './Auth_action'
import {
  getSystemSupportedLanguage,
  getLastSelectedLanguage,
  setLastSelectedLanguage,
} from '../../commen/apis/Api_config'
import { getAdminURLs } from '../../commen/apis/Api_ends_points'

const getAllLanguagesInitial = () => {
  return {
    type: actions.GET_ALL_LANGUAGES_INITIAL,
  }
}

const getAllLanguagesSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_LANGUAGES_SUCCESS,
    response: response,
    message: message,
  }
}

const getAllLanguagesFail = (message) => {
  return {
    type: actions.GET_ALL_LANGUAGES_FAIL,
    message: message,
  }
}

const getAllLanguages = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(getAllLanguagesInitial())
    let form = new FormData()
    form.append('RequestMethod', getSystemSupportedLanguage.RequestMethod)
    axios({
      method: 'post',
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('getAllLanguages', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(getAllLanguages(navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Admin_AdminServiceManager_GetSystemSupportedLanguage_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                getAllLanguagesSuccess(
                  response.data.responseResult.systemSupportedLanguages,
                  t('Record-found'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Admin_AdminServiceManager_GetSystemSupportedLanguage_02'.toLowerCase(),
                )
            ) {
              await dispatch(getAllLanguagesFail(t('No-records-found')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Admin_AdminServiceManager_GetSystemSupportedLanguage_03'.toLowerCase(),
                )
            ) {
              await dispatch(getAllLanguagesFail(t('Something-went-wrong')))
            }
          } else {
            await dispatch(getAllLanguagesFail(t('Something-went-wrong')))
          }
        } else {
          await dispatch(getAllLanguagesFail(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(getAllLanguagesFail(t('Something-went-wrong')))
      })
  }
}

const setLastSelectedLanguageInitial = () => {
  return {
    type: actions.SET_SELECTED_LANGUAGE_INITIAL,
  }
}

const setLastSelectedLanguageSuccess = (message) => {
  return {
    type: actions.SET_SELECTED_LANGUAGE_SUCCESS,
    message: message,
  }
}

const setLastSelectedLanguageFail = (message) => {
  return {
    type: actions.SET_SELECTED_LANGUAGE_FAIL,
    message: message,
  }
}

const changeNewLanguage = (data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(setLastSelectedLanguageInitial())
    let form = new FormData()
    form.append('RequestMethod', setLastSelectedLanguage.RequestMethod)
    form.append('RequestData', JSON.stringify(data))
    axios({
      method: 'post',
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('changeNewLanguage', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(changeNewLanguage(data, navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Admin_AdminServiceManager_SetLastSelectedLanguage_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                setLastSelectedLanguageSuccess(t('Record-Updated')),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Admin_AdminServiceManager_SetLastSelectedLanguage_02'.toLowerCase(),
                )
            ) {
              await dispatch(setLastSelectedLanguageFail(t('Record-Not-Saved')))
            }
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Admin_AdminServiceManager_SetLastSelectedLanguage_03'.toLowerCase(),
                )
            ) {
              await dispatch(setLastSelectedLanguageSuccess(t('Record-Saved')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Admin_AdminServiceManager_SetLastSelectedLanguage_04'.toLowerCase(),
                )
            ) {
              await dispatch(
                setLastSelectedLanguageFail(t('Something-went-wrong')),
              )
            }
          } else {
            await dispatch(
              setLastSelectedLanguageFail(t('Something-went-wrong')),
            )
          }
        } else {
          await dispatch(setLastSelectedLanguageFail(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(setLastSelectedLanguageFail(t('Something-went-wrong')))
      })
  }
}

const getSelectedLanguageInitial = () => {
  return {
    type: actions.GET_SELECTED_LANGUAGE_INITIAL,
  }
}

const getSelectedLanguageSuccess = (response, message) => {
  return {
    type: actions.GET_SELECTED_LANGUAGE_SUCCESS,
    response: response,
    message: message,
  }
}

const getSelectedLanguageFail = (message) => {
  return {
    type: actions.GET_SELECTED_LANGUAGE_FAIL,
    message: message,
  }
}

const getSelectedLanguage = (data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(getSelectedLanguageInitial())
    let form = new FormData()
    form.append('RequestMethod', getLastSelectedLanguage.RequestMethod)
    form.append('RequestData', JSON.stringify(data))
    axios({
      method: 'post',
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log('getSelectedLanguage', response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(getSelectedLanguage(data, navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Admin_AdminServiceManager_GetLastSelectedLanguage_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                getSelectedLanguageSuccess(
                  response.data.responseResult.userSelectedLanguage,
                  t('Record-found'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Admin_AdminServiceManager_GetLastSelectedLanguage_02'.toLowerCase(),
                )
            ) {
              await dispatch(getSelectedLanguageFail(t('No-records-found')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Admin_AdminServiceManager_GetLastSelectedLanguage_03'.toLowerCase(),
                )
            ) {
              await dispatch(getSelectedLanguageFail(t('Something-went-wrong')))
            }
          } else {
            await dispatch(getSelectedLanguageFail(t('Something-went-wrong')))
          }
        } else {
          await dispatch(getSelectedLanguageFail(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(getSelectedLanguageFail(t('Something-went-wrong')))
      })
  }
}

export { getAllLanguages, changeNewLanguage, getSelectedLanguage }
