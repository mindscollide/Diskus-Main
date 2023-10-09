import * as actions from '../action_types'
import axios from 'axios'
import { RefreshToken } from './Auth_action'
import {
  getAllGroupsUsersAndCommitteesByOrganizaitonID,
  saveMeetingOrganizers,
} from '../../commen/apis/Api_config'
import { meetingApi } from '../../commen/apis/Api_ends_points'

const getAllCommitteesUsersandGroups_init = () => {
  return {
    type: actions.GETALLCOMMITTEESUSERSANDGROUPS_INIT,
  }
}
const getAllCommitteesUsersandGroups_success = (response, message) => {
  return {
    type: actions.GETALLCOMMITTEESUSERSANDGROUPS_SUCCESS,
    response: response,
    message: message,
  }
}
const getAllCommitteesUsersandGroups_fail = (message) => {
  return {
    type: actions.GETALLCOMMITTEESUSERSANDGROUPS_FAIL,
    message: message,
  }
}
const GetAllCommitteesUsersandGroups = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(getAllCommitteesUsersandGroups_init())
    let form = new FormData()
    form.append('RequestData', JSON.stringify(Data))
    form.append(
      'RequestMethod',
      getAllGroupsUsersAndCommitteesByOrganizaitonID.RequestMethod,
    )
    axios({
      method: 'post',
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(GetAllCommitteesUsersandGroups(Data, navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_01'.toLowerCase(),
                )
            ) {
              dispatch(
                getAllCommitteesUsersandGroups_success(
                  response.data.responseResult,
                  t('Record-found'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_02'.toLowerCase(),
                )
            ) {
              dispatch(
                getAllCommitteesUsersandGroups_fail(t('No-records-found')),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_GetAllGroupsAndCommitteesByOrganizaitonID_03'.toLowerCase(),
                )
            ) {
              dispatch(
                getAllCommitteesUsersandGroups_fail(t('Something-went-wrong')),
              )
            } else {
              dispatch(
                getAllCommitteesUsersandGroups_fail(t('Something-went-wrong')),
              )
            }
          } else {
            dispatch(
              getAllCommitteesUsersandGroups_fail(t('Something-went-wrong')),
            )
          }
        } else {
          dispatch(
            getAllCommitteesUsersandGroups_fail(t('Something-went-wrong')),
          )
        }
      })
      .catch((response) => {
        dispatch(getAllCommitteesUsersandGroups_fail(t('Something-went-wrong')))
      })
  }
}

const meetingOrganizers = (response) => {
  return {
    type: actions.GET_MEETING_ORGANIZERS,
    response: response,
  }
}

const selectedMeetingOrganizers = (response) => {
  return {
    type: actions.SELECTED_MEETING_ORGANIZERS,
    response: response,
  }
}

// save meeting organizers Init
const saveMeetingOrganizers_init = () => {
  return {
    type: actions.SAVE_MEETINGORGANIZERS_INIT,
  }
}

// save meeting organizers success
const saveMeetingOrganizers_success = (response, message) => {
  return {
    type: actions.SAVE_MEETINGORGANIZERS_SUCCESS,
    response: response,
    message: message,
  }
}

// save meeting organizers fail
const saveMeetingOrganizers_fail = (message) => {
  return {
    type: actions.SAVE_MEETINGORGANIZERS_FAIL,
    message: message,
  }
}

// Save Meeting Organizers Api
const SaveMeetingOrganizers = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return async (dispatch) => {
    dispatch(saveMeetingOrganizers_init())
    let form = new FormData()
    form.append('RequestData', JSON.stringify(Data))
    form.append('RequestMethod', saveMeetingOrganizers.RequestMethod)
    await axios({
      method: 'post',
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(SaveMeetingOrganizers(navigate, Data, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_SaveMeetingOrganizers_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                saveMeetingOrganizers_success(
                  response.data.responseResult,
                  t('Organizers-saved-successfully'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_SaveMeetingOrganizers_02'.toLowerCase(),
                )
            ) {
              dispatch(
                saveMeetingOrganizers_fail(
                  t('Organizers-not-saved-successfully'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_SaveMeetingOrganizers_03'.toLowerCase(),
                )
            ) {
              dispatch(saveMeetingOrganizers_fail(t('Something-went-wrong')))
            } else {
              dispatch(saveMeetingOrganizers_fail(t('Something-went-wrong')))
            }
          } else {
            dispatch(saveMeetingOrganizers_fail(t('Something-went-wrong')))
          }
        } else {
          dispatch(saveMeetingOrganizers_fail(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(saveMeetingOrganizers_fail(t('Something-went-wrong')))
      })
  }
}

const clearResponseMessage = (message) => {
  return {
    type: actions.CLEAR_RESPONSEMESSAGE_MO,
    message: message,
  }
}

export {
  GetAllCommitteesUsersandGroups,
  meetingOrganizers,
  selectedMeetingOrganizers,
  SaveMeetingOrganizers,
  clearResponseMessage,
}
