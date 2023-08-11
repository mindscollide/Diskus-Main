import { applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  authReducer,
  toDoListReducer,
  settingReducer,
  TodoStatus,
  postAssigneeComments,
  VideoChatReducer,
  minuteofMeetingReducer,
  adminReducer,
  countryNamesReducer,
  GetSubscriptionPackages,
  AuthReducer,
  getTodosStatus,
  NotesReducer,
  videoCallReducer,
  talkReducer,
  talkFeatureReducer,
  CommitteeReducer,
  GroupsReducer,
  ResolutionReducer,
  RealtimeNotificationReducer,
  OrganizationBillingReducer,
  DataRoomReducer,
  PollsReducer,
} from './reducers'
import * as actions from './action_types'
import { configureStore } from '@reduxjs/toolkit'
import uploadReducer from './reducers/Upload_reducer'
import fAQsReducer from './reducers/Get_Faqs_reducer'
import meetingIdReducer from './reducers/GetMeetingId_reducer'
import { assigneesReducer } from './reducers'
import { calendarReducer } from './reducers'
import { OnBoardModalStates } from './reducers'
import { RoleListReducer } from './reducers'

import downloadReducer from './reducers/Download_reducer'

const AppReducer = combineReducers({
  auth: authReducer,
  toDoListReducer: toDoListReducer,
  uploadReducer: uploadReducer,
  settingReducer: settingReducer,
  fAQsReducer: fAQsReducer,
  meetingIdReducer: meetingIdReducer,
  assignees: assigneesReducer,
  calendarReducer: calendarReducer,
  OnBoardModal: OnBoardModalStates,
  todoStatus: TodoStatus,
  downloadReducer: downloadReducer,
  postAssigneeComments: postAssigneeComments,
  VideoChatReducer: VideoChatReducer,
  minuteofMeetingReducer: minuteofMeetingReducer,
  countryNamesReducer: countryNamesReducer,
  GetSubscriptionPackage: GetSubscriptionPackages,
  // Auth2 Reducer
  Authreducer: AuthReducer,
  //admin reducers
  adminReducer: adminReducer,
  roleListReducer: RoleListReducer,
  getTodosStatus: getTodosStatus,
  NotesReducer: NotesReducer,
  videoCall: videoCallReducer,
  talkStateData: talkReducer,
  talkFeatureStates: talkFeatureReducer,
  CommitteeReducer: CommitteeReducer,
  GroupsReducer: GroupsReducer,
  ResolutionReducer: ResolutionReducer,
  RealtimeNotification: RealtimeNotificationReducer,
  OrganizationBillingReducer: OrganizationBillingReducer,
  DataRoomReducer: DataRoomReducer,
  PollsReducer: PollsReducer,
})
const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === actions.SIGN_OUT) {
    state = undefined
  }
  return AppReducer(state, action)
}
const store = configureStore(
  { reducer: rootReducer },
  composeWithDevTools(applyMiddleware(thunk)),
)
export default store
