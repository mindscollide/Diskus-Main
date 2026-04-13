# API Reference

## Architecture

Diskus communicates with a set of backend **microservices**. Each service runs on a dedicated port and has its own REST API path.

All API base URLs are constructed as:
```
REACT_APP_BASE_URL + port + path
```

Example: `http://192.168.18.x:11002/Meeting`

API clients and endpoint definitions are in `src/commen/apis/`.

---

## Microservices

| Service | Port | Path | Env Variable | Description |
|---------|------|------|-------------|-------------|
| Auth | 11001 | `/ERM_Auth` | `REACT_APP_AUTH_API` | Authentication, login, registration, OTP |
| Meeting | 11002 | `/Meeting` | `REACT_APP_MEETING_API` | Meeting CRUD, attendees, agendas |
| To-Do List | 11003 | `/ToDoList` | `REACT_APP_TODO_LIST_API` | Tasks and to-do items |
| Settings | 11004 | `/Settings` | `REACT_APP_SETTING_API` | User and organization settings |
| Settings Report | 11004 | `/Report` | `REACT_APP_SETTING_DOWNLOAD_API` | Settings-related report downloads |
| Admin | 11009 | `/Admin` | `REACT_APP_ADMIN_API` | Admin operations |
| Logout Auth | 11009 | `/Auth` | `REACT_APP_LOGOUT_AUTH_API` | Logout endpoint (via Admin service) |
| Notes | 11011 | `/Notes` | `REACT_APP_NOTES_API` | Notes CRUD |
| Groups | 11012 | `/Groups` | `REACT_APP_GROUPS_API` | Group management |
| Committee | 11013 | `/Committee` | `REACT_APP_COMMITTEE_API` | Committee management |
| Talk | 11014 | `/Talk` | `REACT_APP_TALK_API` | Messaging / chat |
| Talk Images | 11014 | _(root)_ | `REACT_APP_TALK_IMAGE_API` | Image uploads for Talk |
| Talk Reports | 11014 | `/Report` | `REACT_APP_TALK_REPORT_API` | Chat report downloads |
| Resolution | 11015 | `/Resolution` | `REACT_APP_RESOLUTION_API` | Resolution management |
| Calendar | 11016 | `/Calender` | `REACT_APP_CALENDAR_API` | Calendar events and sync |
| Data Room | 11017 | `/DataRoom` | `REACT_APP_DATA_ROOM_API` | Document storage and management |
| Data Room Files | 11017 | `/Report` | `REACT_APP_DATA_ROOM_FILES_DOWNLOAD_API` | File downloads from Data Room |
| Polls | 11018 | `/Polls` | `REACT_APP_POLL_API` | Poll creation and voting |
| Video | 11019 | `/Video` | `REACT_APP_VIDEO_API` | Video meeting management |
| Excel Reports | 11020 | `/ExcelReport` | `REACT_APP_REPORT_DOWNLOAD_API` | Excel report generation |
| WorkFlow | 11021 | `/WorkFlow` | `REACT_APP_WORKFLOW_API` | Signature workflow management |
| Audit | 11023 | `/Audit` | `REACT_APP_AUDIT_API` | Audit trail logging |
| Compliance | 11024 | `/Compliance` | `REACT_APP_COMPLIANCE_API` | Compliance module |

---

## Real-time Endpoints

| Protocol | Port | Env Variable | Description |
|----------|------|-------------|-------------|
| Socket.io | 9999 | `REACT_APP_SOCKET_API` | WebSocket for real-time events |
| MQTT | 8228 | `REACT_APP_MQTT_PORT` | Live presence and push updates |

### MQTT Connection Details
```
Host:     REACT_APP_MQTT (or REACT_APP_MQTT_LIVE_URL for production)
Port:     REACT_APP_MQTT_PORT (default: 8228)
Username: REACT_APP_MQTT_User (Base64 encoded)
Password: REACT_APP_MQTT_Pass (Base64 encoded)
```

---

## API Client Configuration

All Axios instances are configured in `src/commen/apis/`. The main API config file is `src/commen/apis/Api_config.js`.

Common request headers:
- `Authorization: Bearer <token>` — JWT token from `localStorage`
- `Content-Type: application/json`

### Authentication Flow

1. User logs in → Auth service returns JWT token
2. Token stored in `localStorage` (key: `token`) and `sessionStorage`
3. User ID stored in `localStorage` (key: `userID`) and `sessionStorage`
4. All subsequent API calls include the token in the `Authorization` header
5. On session expiry, backend returns an error → `SessionExpireResponseMessage` is set in Redux → user sees error notification → redirected to login

---

## Adding a New API Call

1. Define the endpoint URL in `src/commen/apis/Api_config.js`
2. Create the action creator in `src/store/actions/<Module>Actions.js`
3. Use Redux Thunk pattern:

```js
export const fetchMyData = (params) => async (dispatch) => {
  try {
    const response = await axios.get(`${MY_SERVICE_URL}/endpoint`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    dispatch({ type: MY_ACTION_TYPE, payload: response.data });
  } catch (error) {
    // handle error
  }
};
```

4. Handle the action in the corresponding reducer in `src/store/reducers/`
