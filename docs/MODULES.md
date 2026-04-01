# Feature Modules

Each module lives in `src/container/<ModuleName>/`. All user-facing modules are nested under the `/Diskus/` route and protected by `PrivateRoutes`. Admin modules are under `/Admin/` and protected by `PrivateAdminRoute`.

---

## User Modules

### Dashboard
- **Route:** `/Diskus/` or `/Diskus/home`
- **Container:** `container/NewDashboardLayout/NewDashobard.js`
- **Description:** Main landing page after login. Displays a summary of the user's meetings, tasks, notifications, and recent activity.

---

### Meetings
- **Route:** `/Diskus/Meeting`
- **Container:** `container/pages/meeting/MeetingTwo.js`
- **Context:** `NewMeetingContext` (scoped to this route)
- **Sub-routes:**
  - `/Diskus/Meeting/Useravailabilityformeeting` — RSVP page for meeting invitees
- **Description:** Full meeting lifecycle — create, schedule, invite attendees, set agendas, and manage RSVPs. Integrates with the calendar module.

---

### Minutes
- **Route:** `/Diskus/Minutes`
- **Container:** `container/MinutesNewFlow/Main.js`
- **Description:** Multi-step workflow for creating and managing meeting minutes. Linked to specific meetings and their agendas.

---

### Video Conference
- **Route:** `/Diskus/video`
- **Container:** `container/VideoMeetingBoardDeck/VideoMeetingBoardDeck.js`
- **Route Guard:** `PrivateVideoMeeting` (separate from the standard private route guard)
- **Description:** Full-featured WebRTC video conferencing. Supports screen sharing, participant management, and board deck presentations.
- **Related:**
  - `/GuestVideoCall` — unauthenticated guest video call entry point
  - `/AlreadyInGroupAndOtoCall` — shown when user is already in a call

---

### Calendar
- **Route:** `/Diskus/calendar`
- **Container:** `container/calendarpage/CalendarPage.js`
- **Description:** Calendar view of all meetings and events. Supports external calendar sync (Microsoft, Google) via OAuth flows in `container/CalenderSyncLoginOutPages/`.

---

### To-Do List
- **Route:** `/Diskus/todolist`
- **Container:** `container/pages/todolist/Todolist.js`
- **Redux:** `toDoListReducer`, `TodoStatus`, `getTodosStatus`
- **Description:** Personal task management. Tasks can be assigned to users, have due dates, and be filtered by status.

---

### Notes
- **Route:** `/Diskus/notes`
- **Container:** `container/notes/Notes.js`
- **Context:** `NotesContext`
- **Description:** Collaborative notes tied to meetings or standalone. Supports rich text editing via React Quill.

---

### Groups
- **Route:** `/Diskus/groups`
- **Container:** `container/Groups/Groups.js`
- **Context:** `GroupsContext`
- **Redux:** `GroupsReducer`
- **Description:** Create and manage user groups. Groups can be assigned to meetings, committees, and used for Talk messaging.

---

### Committees
- **Route:** `/Diskus/committee`
- **Container:** `container/Committee/Committee.js`
- **Context:** `CommitteeContext`
- **Redux:** `CommitteeReducer`
- **Description:** Create and manage organizational committees. Committees have members, agendas, and can hold their own meetings.

---

### Resolutions
- **Route:** `/Diskus/resolution`
- **Container:** `container/Resolution/Resolution.js`
- **Context:** `ResolutionContext`
- **Redux:** `ResolutionReducer`
- **Description:** Track and manage resolutions arising from meetings or committee decisions. Supports approval workflows and status tracking.

---

### Data Room
- **Route:** `/Diskus/dataroom`
- **Container:** `container/DataRoom/DataRoom.js`
- **Context:** `DataroomContext`
- **Redux:** `DataRoomReducer`, `DataRoomFileAndFoldersDetailsReducer`, `SignatureWorkFlowReducer`
- **Sub-routes (nested under `/Diskus/`):**
  - `signatureviewer` — PDFTron-based signature viewer
  - `signeddocument` — View pending signatures
  - `viewSignDocument` — View a fully signed document
  - `documentViewer` — Generic document viewer
  - `meetingDocumentViewer` — Document viewer within meeting context
- **Description:** Secure document storage with folder hierarchy. Integrates PDFTron WebViewer for in-browser document viewing and e-signature workflows.

---

### Polling
- **Route:** `/Diskus/polling`
- **Container:** `container/Polling/Polling.js`
- **Context:** `PollsContext`
- **Redux:** `PollsReducer`
- **Description:** Create and conduct polls within meetings or standalone. Supports multiple choice, yes/no, and custom question types.

---

### Compliance
- **Route:** `/Diskus/compliance`
- **Container:** `container/ComplianceUser/index.jsx`
- **Context:** `ComplianceContext`
- **Redux:** `ComplainceSettingReducerReducer`
- **Feature Flag:** `REACT_APP_COMPLIANCE_MODULE=TRUE`
- **Description:** Compliance management for users. Works in conjunction with admin-level compliance settings.

---

### Settings
- **Route:** `/Diskus/setting`
- **Container:** `container/setting/UserLevelSettings/UserSettings.js`
- **Redux:** `settingReducer`
- **Description:** User profile settings — name, avatar, notification preferences, password change, language selection.

---

### Talk (Messaging)
- **Not a page route** — rendered as a persistent sidebar/overlay
- **Container:** `components/layout/talk/`
- **Context:** `TalkContext`
- **Redux:** `talkReducer`, `talkFeatureReducer`
- **Description:** Real-time in-app messaging. Supports 1-on-1 and group chats. Backed by Socket.io. Also includes a video call feature within the chat.

---

## Admin Modules

All admin modules are under `/Admin/` and require admin-level authentication.

### Admin Home
- **Route:** `/Admin/`
- **Container:** `container/Admin/Main/AdminHome.js`
- **Description:** Admin dashboard. Default route shows either `ManageUsers` or `PayOutstanding` depending on the user's verification state.

---

### Manage Users
- **Routes:** `/Admin/ManageUsers`, `/Admin/AddUsers`, `/Admin/AddUsersUsermanagement`
- **Description:** User provisioning — list all users, add new users, configure user-level permissions.

---

### Subscriptions & Billing
- **Routes:** `/Admin/PackageDetail`, `/Admin/UpgradePackage`, `/Admin/CancelSub`, `/Admin/PaymentHistory`, `/Admin/PayOutstanding`, `/Admin/Summary`
- **Description:** Manage organization subscription packages, payment history, billing info, upgrades, and cancellations.

---

### User Management (UM) System
- **Routes:** `/Admin/PakageDetailsUserManagement`, `/Admin/subscriptionDetailsUserManagement`, `/Admin/downgradeSubscription`, `/Admin/CancelSubscriptionUserManagement`, `/Admin/PackageDetailsUserManagement`
- **Description:** Extended user management system with its own subscription flow — separate from the legacy admin subscription routes.

---

### Reports & Audit
- **Routes:** `/Admin/loginreport`, `/Admin/AuditTrial`
- **Description:** Login reports and full audit trail logs.

---

### Compliance Admin
- **Routes:** `/Admin/manageAuthority`, `/Admin/generalSetting`
- **Context:** `AuthorityContext` (scoped to these routes)
- **Description:** Configure compliance authorities and general compliance settings for the organization.

---

### Customer & Organization Management
- **Routes:** `/Admin/CustomerInformation`, `/Admin/deleteorganization`, `/Admin/deleteorganizationUserMangement`
- **Description:** Manage organization-level customer information and handle organization deletion.

---

## Authentication & Onboarding (Public Routes)

| Route | Container | Description |
|-------|-----------|-------------|
| `/` | `UserManagementProcess` | Login entry point |
| `/Signup` | `SignupProcessUserManagement` | Signup flow |
| `/onboard` | `OnBoard` | Post-signup onboarding |
| `/forgotpasswordVerification` | `ForgotPasswordVerification` | Password reset via OTP |
| `/updatepassword` | `UpdatePasswordSuccessfully` | Password update confirmation |
| `/updatePasswordSuccess` | `PasswordUpdateMessage` | Password update success message |
| `/PakageDetailsUserManagement` | `PakageDetailsUserManagement` | Package selection during signup |
| `/PaymentFormUserManagement` | `BillingMethodUsermanagement` | Billing info during signup |
| `/404` | `NotFound` | 404 page |
