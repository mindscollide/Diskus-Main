import * as actions from '../action_types'
import axios from 'axios'
import { RefreshToken } from './Auth_action'
import {
  getAllGroupsUsersAndCommitteesByOrganizaitonID,
  saveMeetingOrganizers,
  meetingStatusUpdate,
  getAllMeetingOrganizers,
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

// save meeting organizers Init
const updateOrganizerMeetingStatus_init = () => {
  return {
    type: actions.UPDATE_ORGANIZERSMEETING_INIT,
  }
}

// save meeting organizers success
const updateOrganizerMeetingStatus_success = (response, message) => {
  return {
    type: actions.UPDATE_ORGANIZERSMEETING_SUCCESS,
    response: response,
    message: message,
  }
}

// save meeting organizers fail
const updateOrganizerMeetingStatus_fail = (message) => {
  return {
    type: actions.UPDATE_ORGANIZERSMEETING_FAIL,
    message: message,
  }
}

// Save Meeting Organizers Api
const UpdateOrganizersMeeting = (navigate, Data, t, setSceduleMeeting) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return async (dispatch) => {
    dispatch(updateOrganizerMeetingStatus_init())
    let form = new FormData()
    form.append('RequestData', JSON.stringify(Data))
    form.append('RequestMethod', meetingStatusUpdate.RequestMethod)
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
          dispatch(
            UpdateOrganizersMeeting(navigate, Data, t, setSceduleMeeting),
          )
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_MeetingStatusUpdate_01'.toLowerCase(),
                )
            ) {
              await dispatch(
                updateOrganizerMeetingStatus_success(
                  response.data.responseResult,
                  t('Record-updated'),
                ),
              )
              setSceduleMeeting(false)
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_MeetingStatusUpdate_02'.toLowerCase(),
                )
            ) {
              dispatch(
                updateOrganizerMeetingStatus_fail(t('Record-not-updated')),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_MeetingStatusUpdate_03'.toLowerCase(),
                )
            ) {
              dispatch(
                updateOrganizerMeetingStatus_fail(t('Something-went-wrong')),
              )
            } else {
              dispatch(
                updateOrganizerMeetingStatus_fail(t('Something-went-wrong')),
              )
            }
          } else {
            dispatch(
              updateOrganizerMeetingStatus_fail(t('Something-went-wrong')),
            )
          }
        } else {
          dispatch(updateOrganizerMeetingStatus_fail(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(updateOrganizerMeetingStatus_fail(t('Something-went-wrong')))
      })
  }
}

const clearResponseMessage = (message) => {
  return {
    type: actions.CLEAR_RESPONSEMESSAGE_MO,
    message: message,
  }
}

const getAllMeetingOrganizers_init = () => {
  return {
    type: actions.GETALLMEETINGORGANIZERS_INIT,
  }
}
const getAllMeetingOrganizers_success = (response, message) => {
  return {
    type: actions.GETALLMEETINGORGANIZERS_SUCCESS,
    response: response,
    message: message,
  }
}
const getAllMeetingOrganizers_fail = (message) => {
  return {
    type: actions.GETALLMEETINGORGANIZERS_FAIL,
    message: message,
  }
}
const GetAllMeetingOrganizers = (Data, navigate, t) => {
  let token = JSON.parse(localStorage.getItem('token'))
  return (dispatch) => {
    dispatch(getAllMeetingOrganizers_init())
    let form = new FormData()
    form.append('RequestData', JSON.stringify(Data))
    form.append('RequestMethod', getAllMeetingOrganizers.RequestMethod)
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
          dispatch(GetAllMeetingOrganizers(Data, navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_GetAllMeetingOrganizers_01'.toLowerCase(),
                )
            ) {
              dispatch(
                getAllMeetingOrganizers_success(
                  response.data.responseResult,
                  t('Record-found'),
                ),
              )
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_GetAllMeetingOrganizers_02'.toLowerCase(),
                )
            ) {
              dispatch(getAllMeetingOrganizers_fail(t('No-records-found')))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  'Meeting_MeetingServiceManager_GetAllMeetingOrganizers_03'.toLowerCase(),
                )
            ) {
              dispatch(getAllMeetingOrganizers_fail(t('Something-went-wrong')))
            } else {
              dispatch(getAllMeetingOrganizers_fail(t('Something-went-wrong')))
            }
          } else {
            dispatch(getAllMeetingOrganizers_fail(t('Something-went-wrong')))
          }
        } else {
          dispatch(getAllMeetingOrganizers_fail(t('Something-went-wrong')))
        }
      })
      .catch((response) => {
        dispatch(getAllMeetingOrganizers_fail(t('Something-went-wrong')))
      })
  }
}

export {
  GetAllCommitteesUsersandGroups,
  meetingOrganizers,
  selectedMeetingOrganizers,
  SaveMeetingOrganizers,
  clearResponseMessage,
  UpdateOrganizersMeeting,
  GetAllMeetingOrganizers,
}
