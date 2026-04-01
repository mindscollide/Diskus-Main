# Redux Store Guide

## Store Configuration

**File:** `src/store/store.js`

The store is configured with `@reduxjs/toolkit`'s `configureStore`:

```js
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ immutableCheck: false }).concat(thunk),
});
```

`immutableCheck` is disabled for performance — the codebase has some mutable patterns.

### Global Reset on Logout

The `rootReducer` wraps `AppReducer` and handles the special `SET_INITIAL_ALLSTATE` action:

```js
const rootReducer = (state, action) => {
  if (action.type === actions.SET_INITIAL_ALLSTATE) {
    state = undefined; // resets all reducers to their initial state
  }
  return AppReducer(state, action);
};
```

Dispatch `SET_INITIAL_ALLSTATE` to fully wipe Redux state on logout.

---

## Reducer Reference

| Redux Key | Reducer | Description |
|-----------|---------|-------------|
| `auth` | `authReducer` | Primary auth state (token, user info, session expiry message) |
| `Authreducer` | `AuthReducer` | Secondary auth reducer (legacy — handles some auth edge cases) |
| `toDoListReducer` | `toDoListReducer` | To-do list items |
| `uploadReducer` | `uploadReducer` | File upload state and progress |
| `settingReducer` | `settingReducer` | User/org settings |
| `fAQsReducer` | `fAQsReducer` | FAQ data |
| `meetingIdReducer` | `meetingIdReducer` | Currently active meeting ID |
| `assignees` | `assigneesReducer` | Meeting/task assignee lists |
| `calendarReducer` | `calendarReducer` | Calendar events and sync state |
| `OnBoardModal` | `OnBoardModalStates` | Onboarding modal visibility state |
| `todoStatus` | `TodoStatus` | To-do item status options |
| `downloadReducer` | `downloadReducer` | File download progress/state |
| `postAssigneeComments` | `postAssigneeComments` | Assignee comment state |
| `VideoChatReducer` | `VideoChatReducer` | Legacy video chat state |
| `videoFeatureReducer` | `videoFeatureReducer` | Video feature flags and settings |
| `VideoMainReducer` | `VideoMainReducer` | Main video meeting state |
| `videoCall` | `videoCallReducer` | Active video call state |
| `GuestVideoReducer` | `GuestVideoReducer` | Guest (unauthenticated) video call state |
| `minuteofMeetingReducer` | `minuteofMeetingReducer` | Minutes of meeting data |
| `MinutesReducer` | `MinutesReducer` | New minutes flow state |
| `MeetingAgendaReducer` | `MeetingAgendaReducer` | Meeting agenda items |
| `MeetingOrganizersReducer` | `MeetingOrganizersReducer` | Meeting organizer data |
| `NewMeetingreducer` | `NewMeetingReducer` | New meeting creation state |
| `AgendaWiseAgendaListReducer` | `AgendaWiseAgendaListReducer` | Agenda-specific agenda lists |
| `attendanceMeetingReducer` | `attendanceMeetingReducer` | Meeting attendance tracking |
| `actionMeetingReducer` | `actionMeetingReducer` | Meeting action items |
| `countryNamesReducer` | `countryNamesReducer` | Country names list (for forms) |
| `GetSubscriptionPackage` | `GetSubscriptionPackages` | Available subscription packages |
| `adminReducer` | `adminReducer` | Admin panel data |
| `roleListReducer` | `RoleListReducer` | User role definitions |
| `getTodosStatus` | `getTodosStatus` | To-do status lookup data |
| `NotesReducer` | `NotesReducer` | Notes data |
| `talkStateData` | `talkReducer` | Talk/messaging state |
| `talkFeatureStates` | `talkFeatureReducer` | Talk feature flags |
| `CommitteeReducer` | `CommitteeReducer` | Committee data |
| `GroupsReducer` | `GroupsReducer` | Groups data |
| `ResolutionReducer` | `ResolutionReducer` | Resolutions data |
| `RealtimeNotification` | `RealtimeNotificationReducer` | Real-time notification state |
| `OrganizationBillingReducer` | `OrganizationBillingReducer` | Organization billing data |
| `DataRoomReducer` | `DataRoomReducer` | Data room files and folders |
| `DataRoomFileAndFoldersDetailsReducer` | `DataRoomFileAndFoldersDetailsReducer` | Detailed file/folder metadata |
| `PollsReducer` | `PollsReducer` | Polls data |
| `LanguageReducer` | `LanguageReducer` | Current app language |
| `webViewer` | `webViewerReducer` | PDFTron WebViewer state |
| `UserReportReducer` | `UserReportReducer` | User reports data |
| `SignatureWorkFlowReducer` | `SignatureWorkFlowReducer` | E-signature workflow state |
| `UserManagementModals` | `UserManagementModals` | User management modal visibility |
| `UserMangementReducer` | `UserMangementReducer` | User management data |
| `ManageAuthorityReducer` | `ManageAuthorityReducer` | Compliance authority management |
| `ComplainceSettingReducerReducer` | `ComplainceSettingReducerReducer` | Compliance settings |

---

## Action Types

All action type constants are defined in `src/store/action_types.js`.

Key action types:

| Constant | Effect |
|----------|--------|
| `SET_INITIAL_ALLSTATE` | Resets entire Redux store (used on logout) |

---

## Actions Directory

Action creators are in `src/store/actions/`. Each file corresponds to a module:

```
actions/
├── AuthActions.js
├── MeetingActions.js
├── ToDoListActions.js
├── DataRoomActions.js
├── CommitteeActions.js
├── GroupsActions.js
├── TalkActions.js
├── ResolutionActions.js
├── PollsActions.js
├── NotesActions.js
├── AdminActions.js
├── SettingActions.js
├── UserMangementModalActions.js
└── ...
```

All async actions use **Redux Thunk** — they return functions that receive `dispatch` and `getState`.

---

## Accessing State in Components

Use the `useSelector` hook:

```jsx
import { useSelector } from 'react-redux';

// Access auth state
const { token, userID } = useSelector((state) => state.auth);

// Access meeting agenda
const agendaList = useSelector((state) => state.MeetingAgendaReducer.agendaList);
```

## Dispatching Actions

Use the `useDispatch` hook:

```jsx
import { useDispatch } from 'react-redux';
import { someAction } from '../store/actions/SomeActions';

const dispatch = useDispatch();

// Sync action
dispatch({ type: 'SOME_ACTION', payload: data });

// Thunk action
dispatch(someAction(param));
```

---

## Reducers Directory

```
store/reducers/
├── index.js                        # Re-exports all reducers
├── Auth_reducer.js
├── Meeting_reducer.js
├── ToDoList_reducer.js
├── DataRoom_reducer.js
├── Upload_reducer.js
├── Get_Faqs_reducer.js
├── GetMeetingId_reducer.js
├── Attendance_Reducer.js
├── ActionMeeting_Reducer.js
├── UserManagementModals.js
├── UserManagementReducer.js
├── ManageAuthorityReducer.js
├── ComplainSettingReducer.js
└── ...
```
