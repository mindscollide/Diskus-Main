# Video Calling — Current Implementation

This documents what the video-calling feature **actually does today**, based on reading the code (not the intended design). It covers one-to-one calls, group calls, meeting video calls, and the guest join flow. Every claim is cited to a file (and line, where practical) so it can be re-verified against the current codebase — line numbers will drift as the code changes, but the file paths and mechanism names should stay stable landmarks.

Where the code path could not be confirmed statically (would need a running app to verify), it's marked **"unclear — needs runtime verification"** rather than guessed.

> Companion doc: see the memory note `video_call_architecture_debt.md` for the known state-duplication problems (localStorage vs `MeetingContext` vs Redux) — this document describes *behavior*, that one describes the *architectural debt* behind it.

---

## 0. Architecture in one paragraph

The actual audio/video media is **not handled by this React app**. Every calling surface embeds a third-party call provider (internally called "Zoom" in code comments, though a custom-RTC fallback path also exists — see §5) inside a single `<iframe>`. The React/Redux layer's job is to: (a) call Diskus backend REST endpoints (`meetingApi`/`videoApi`) to persist call state and broadcast it to other participants, (b) receive MQTT push events describing what other participants did, and (c) `postMessage()` string commands into the iframe (`"MicOn"`, `"ScreenShare"`, `"RecordingStartMsgFromIframe"`, etc.) and listen for the iframe posting events back. State that should route through `MeetingContext` or Redux is, in large parts of this code, instead read/written directly as `localStorage` keys — see §8.

All video UI is rendered from inside `Dashboard.js` itself (mounted once at the `/Diskus/` route), not inside the routed `<Outlet>` content — this is *why* a call keeps running in the background (minimized) while you navigate the rest of the app: the call component tree is never unmounted by route navigation, only CSS-hidden.

---

## 1. One-to-one (1:1) call

**Start** — `videoPanelBodyContact.js` (`src/components/layout/talk/talk-Video/videoPanel/videoPanelBody/videoPanelBodyContact.js:151`, `otoVideoCall`) dispatches `InitiateVideoCall({RecipentIDs:[userID], CallTypeID:1, OrganizationID}, ...)` (`src/store/actions/VideoMain_actions.js:124`), a POST to the `videoApi` endpoint (`RequestMethod: "InitiateVideoCall"`). On success it sets `videoOutgoingCallFlag(true)` plus localStorage flags `activeCall`, `isCaller`, `callerID`.

**Ringing** — server MQTT-broadcasts `NEW_VIDEO_CALL_INITIATED` (`action:"Video"`) to the callee, handled in the central MQTT switchboard `src/container/dashboard/Dashboard.js:3371`. If idle, this shows the ringer UI: `src/components/layout/talk/videoCallScreen/videoCallBody/VideoMaxIncoming.js` (plays `/IncomingCall.wav` on loop, auto-times-out via the `callRingerTimeout` localStorage value — timeout auto-sends `CallStatusID:3`, "unanswered").

> Note: `src/container/videoIncoming/VideoIncoming.js` looks like it should be the ringer but is dead/stub code (no click handlers, not imported live anywhere). `VideoMaxIncoming.js` is the real one.

**Accept** — `endAndAccept()` (`VideoMaxIncoming.js:258`) dispatches `VideoCallResponse({CallStatusID:1}, ...)` (`VideoMain_actions.js:266`) → MQTT `VIDEO_CALL_ACCEPTED` to both sides (`Dashboard.js:3462`) → `activeCall=true`, `activeRoomID` set, `videoCallAccepted` dispatched.

**Decline** — `rejectCall()` (`VideoMaxIncoming.js:538`) sends `CallStatusID:2` → MQTT `VIDEO_CALL_REJECTED` (`Dashboard.js:3681`) → "declined" toast on caller side, ringer closes. `busyCall()` sends `CallStatusID:5` for the busy case.

**End** — Either side calls `LeaveCall` (`VideoMain_actions.js:676`) → MQTT `VIDEO_CALL_DISCONNECTED_CALLER`/`_RECIPIENT` (`Dashboard.js:4107`+) → resets `activeCall`/`activeRoomID` and closes the video panel on both sides.

**No answer** — server-side ringer timeout fires MQTT `VIDEO_CALL_UNANSWERED` (`Dashboard.js:3879`); for a 1:1 call this directly dispatches `unansweredOneToOneCall(true)` and closes the call.

---

## 2. Group call

**Start** — `initiateGroupCall()` (`videoPanelBodyContact.js:191`, requires `groupCallUsers.length > 1`) dispatches the same `InitiateVideoCall` action but `CallTypeID:2` with multiple `RecipentIDs`. The full invite list is persisted to `localStorage["RecipentIDsOninitiateVideoCall"]` (`VideoMain_actions.js:165-174`) — this is the authoritative "who hasn't responded yet" list.

**Independent per-participant accept/decline** — same MQTT event names as 1:1 (`VIDEO_CALL_ACCEPTED`/`REJECTED`/`UNANSWERED`), each carrying `callTypeID:2` and a `recepientID`. Each event updates `RecipentIDsOninitiateVideoCall` and `callerStatusObject` (localStorage, tracks `Ringing`/`Accepted`/`Rejected` per invitee) and re-fetches the roster via `getGroupCallParticipantsMainApi` (`Dashboard.js:3554, 3729, 3914`).

**Roster state** lives in `MeetingContext.js:229-234` (`groupVideoCallAccepted`, `groupCallParticipantList`, `unansweredCallParticipant`, `inCallParticipantsList`) and renders in `videoCallNormalHeader.js` (not `VideoNewParticipantList.js` — that component is used only for meeting-video calls, see §3).

**Does the call end when someone declines?** No. `Dashboard.js:3809-3861` gates the "close the whole call" logic behind `isCaller`, and only sets `leaveOneToOne(true)` (closing the panel) once `RecipentIDsOninitiateVideoCall.length === 0 && callerStatusObject.length === 0` — i.e. **everyone invited has responded one way or another**. A single decline/no-answer just drops that person from the roster; everyone else stays connected.

---

## 3. Meeting video call

This is architecturally the most complex of the four flows because it has to gate video access through the meeting's own status/role system, not just a call-accept.

### 3.1 Start / Join

`handleStartMeeting` (`src/container/meeting/commonComponents/useMeetingListActions.js:137`) posts `{MeetingID, StatusID: MEETING_STATUS.ACTIVE}` (= `10`, `meeting.constants.js:2`) via `UpdateMeetingStatusApi`, route `"startMeetingFromMainListing"` (advance) or `"startQuickMeetingFromMainListing"` (quick, `record.isQuickMeeting`). On success this chains into `joinMeetingApi` (`src/store/actions/NewMeeting2.actions.js:2574-2619`).

`handleJoinMeeting` (`useMeetingListActions.js:59`) dispatches `joinMeetingApi` directly, route `"JoinMeetingFromListing"`/`"JoinQuickMeetingFromListing"`.

**Important**: neither Start nor Join drops the user straight into the video iframe. Both only open the **"View Meeting" modal** (`toggleViewMeetingModal(true)` + `setViewTab("agendaViewer")`, `NewMeeting2.actions.js:3318-3326`) or, for quick meetings, `setIsQuickMeetingView(true)`. The user then has to click a separate **"Join video call"** button inside that modal (enabled only once `editorRole.status === "10"`, `ViewMeetingDetails.js:885-934`), which calls `joinMeetingCall()` (`ViewMeetingDetails.js:544-580`) — that's what actually enters the RTC/Zoom session.

`handleViewMeeting` short-circuits into `handleJoinMeeting` whenever the meeting's `status === 10` (Active) — so "View" on an already-active meeting behaves like "Join."

### 3.2 Quick meeting vs. advance meeting

| | Quick meeting | Advance/standard meeting |
|---|---|---|
| Start action route | `"startQuickMeetingFromMainListing"` | `"startMeetingFromMainListing"` |
| Join action route | `"JoinQuickMeetingFromListing"` | `"JoinMeetingFromListing"` |
| Context state touched | `setIsQuickMeetingView`/`setIsQuickMeetingUpdate` (`NewMeetingContext`) | `setVideoTalk`, `setEditorRole`, `setDownloadVideoRecordingModal` (`MeetingContext`) |
| Rendering container | `container/meeting/quickMeeting/ViewQuickMeeting/index.js` | `container/meeting/advanceMeeting/viewAdvanceMeeting/meetingDetails/ViewMeetingDetails.js` + `AgendaViewer.js` |

Both paths converge on the same underlying `videoCallNormalPanel.js` iframe once a call is actually joined — the difference is purely which top-level modal/container renders the pre-call UI, not the video engine itself.

### 3.3 Host vs. participant UI

The attendee-role label (`"Organizer"`/`"Participant"`/`"Agenda Contributor"`, from `getAttendeeRole()`, `useMeetingListActions.js:32-37`) only gates whether the "Join video call" button is *enabled* — it is **not** what selects host vs. participant video UI.

The actual host/participant branch is driven by a server-returned boolean, `response.data.responseResult.isMeetingVideoHost`, persisted to `localStorage.isMeetingVideoHostCheck` at join time (`NewMeeting2.actions.js:3226-3229`). `joinMeetingCall()` reads this: falsy → participant lobby (`maxParticipantVideoCallPanel(true)`); truthy → host path (`getParticipantMeetingJoinMainApi(..., {isHost:true})`).

**Which component actually renders, in practice**: several purpose-built host/participant components (`MaxHostVideoCallComponent`, `NormalHostVideoCallComponent`, `NormalParticipantVideoComponent`) exist under `src/container/meeting/commonComponents/meetingVideoCall/` but their trigger Redux actions are **never dispatched with `true` anywhere in the codebase** — confirmed by grep. In the reachable path, both host and participant land in the same generic `maximizeVideoPanelFlag(true)` branch of `videoCallNormalPanel.js` — the identical shared panel used for 1:1/group calls. The one meeting-specific component that *is* reachable is `maxParticipantVideoCallComponent.js` — a pre-join lobby screen with a local webcam/mic preview, shown while waiting for host approval.

**Host-only controls** live in the shared roster panel, not in the meeting-specific components: `VideoNewParticipantList.js` shows a "Mute All / Unmute All" button and per-participant "Remove," both gated on `usersData.isHost`.

### 3.4 Denied / Ended / Removed

All three are MQTT-driven, handled centrally in `Dashboard.js`'s message switchboard — no polling:

- **Denied entry**: `MEETING_VIDEO_JOIN_REQUEST_REJECTED` → `globalNavigatorVideoStream(1)` (`Dashboard.js:1810-1847`) → `maxParticipantVideoCallComponent.js` watches for this and shows `MaxParticipantVideoDeniedComponent`.
- **Removed by host mid-call**: `REMOVED_FROM_MEETING` (`Dashboard.js:1637-1739`). Custom-RTC path: `maxParticipantVideoRemoved(true)` → `MaxParticipantVideoRemovedComponent` (offers Close / "Request to rejoin"). Zoom path: `setParticipantRemovedFromVideobyHost(true)` instead, which posts `"leaveSession"` into the iframe directly rather than showing a distinct screen.
- **Meeting ended by host**: `meetingIdReducer.MeetingStatusEnded` (populated from an MQTT/socket handler, `GetMeetingId_reducer.js:78`). `Dashboard.js:8264-8286` only resets the minimize/maximize flags for the affected user — **there is no dedicated "meeting ended" screen shown to participants.** `maxParticipantVideoEndComponent.js` exists but is never imported anywhere and is internally broken (references undefined `RemoveImage`/`Button`/`onClickCloseModal`) — treat "meeting ended" as having no working participant-facing UI today; **unclear — needs runtime verification** whether the provider's own iframe shows something instead.

### 3.5 "View Minutes" during a call

`handleClickViewMinutes` (`useMeetingListActions.js:196`) sets `setViewTab("minutes")`, which switches a tab inside the already-open **View Meeting modal** to a static/post-hoc minutes document — this is unrelated to the live call. A separate component that looks like it was meant to be a *live* in-call minutes panel, `videoCallNormalMinutesMeeting.js`, contains only hardcoded placeholder text and its trigger flag is never dispatched — it's unreachable placeholder UI, not a working feature.

### 3.6 NonMeetingVideoModal

`src/container/meeting/advanceMeeting/viewAdvanceMeeting/nonMeetingVideoModal/NonMeetingVideoModal.js` is a conflict guard: if the user already has an active non-meeting video session (1:1 call, group call, or presenter view — tracked via `sessionStorage.NonMeetingVideoCall`/`localStorage.activeCall`) and tries to join a meeting video call, this modal interrupts to force an explicit choice rather than letting two overlapping sessions bleed into each other. It also fires the other direction (an incoming call arriving while already in a meeting video).

### 3.7 How meeting-video relates to plain 1:1/group calls

Meeting-video is **not** an architecturally separate engine. `meetingVideoCall/*` components are early-return overrides inserted at the top of `videoCallNormalPanel.js`'s render, and are pre-join/denied/removed **lobby and error screens** (they reimplement their own local camera preview via raw `getUserMedia`, they don't wrap `videoCallNormalHeader.js`). Once a join actually succeeds, host and participant both fall through to the exact same shared `videoCallNormalPanel.js`/iframe used by 1:1 and group calls.

---

## 4. Guest join flow (unauthenticated, link-based)

**Entry** — route `/GuestVideoCall` (`routes.js:142`) → `GuestVideoCall.js` extracts an encrypted token from the URL and calls `validateEncryptGuestVideoMainApi`. Success shows the pre-join lobby, `GuestJoinVideo.js` (name entry + camera/mic preview).

**Join** — `onJoinNowButton` (`GuestJoinVideo.js:193`) calls `joinGuestVideoMainApi({MeetingId, RoomID, GuestName, IsMuted, HideVideo, HostEmail})`. Success opens a **completely separate MQTT connection** scoped to a server-issued `guestGuid` (`mqttConnectionGuestUser`, isolated from the authenticated-user MQTT connection) and puts the guest in the host's waiting room. All guest session state lives in `sessionStorage` — it never touches the authenticated user's Redux auth state.

**Host admits/rejects** — host calls `admitRejectAttendeeMainApi`, which MQTT-notifies the guest: `MEETING_VIDEO_JOIN_REQUEST_APPROVED`(`isAccepted:true/false`), handled in `GuestVideoCall.js`'s own message handler. Approved → active call screen (`GuestVideoScreen`/`GuestVideoHeader`). Rejected → static "Entry denied" screen (`GuestVideoReject.js`).

**Removed by host** — MQTT `REMOVED_FROM_MEETING` → `GuestRemoveByHost.js` ("You've been removed," with a "Request to rejoin" button that sends the guest back to the lobby screen — it doesn't re-call any join API itself).

**Meeting/call ended** — MQTT `HOST_END_VIDEO_CALL_MEETING` → `GuestVideoEnded.js` (static, no interactive elements). `MEETING_VIDEO_END_FOR_GUEST` separately triggers a `guestLeaveMeetingVideoApi` cleanup call.

Screen routing is centralized in `GuestVideoReducer.guestVideoNavigationData` (1=lobby, 2=active call, 3=rejected, 4=ended, 5=removed), switched on inside `GuestVideoCall.js`.

---

## 5. Video call URL / room generation

`src/commen/functions/urlVideoCalls.js`:
- `generateURLCaller(baseURL, callerFullName, roomID, UserGuid)` — if `localStorage.isZoomEnabled`, builds `userName/sessionKey/userGuid/isHideCamera/isMute` query params; else builds `{UserName, Type:"Call", RoomID}` (custom RTC).
- `generateURLParticipant(...)` — same split, `Type:"Join"` in the custom-RTC branch. In the Zoom branch, if `localStorage.presenterViewvideoURL` is already set, it **short-circuits and returns that cached URL directly** instead of building a fresh one — this is how presenter-view sessions reuse a different room (see §6.6).

Both are called from `videoCallNormalPanel.js` to compute `callerURL`, which becomes the `src` of a single `<iframe ref={iframeRef}>` — the actual call surface for every flow (1:1, group, meeting). The URL is purely an iframe `src`, never a redirect.

---

## 6. Shared in-call features (apply across all call types)

### 6.1 Mic / camera mute-unmute

State lives in **local `useState` inside `videoCallNormalPanel.js`**, seeded from `localStorage.MicOff`/`VidOff` on mount — `MeetingContext.mic`/`camera` exist but are dead state, never read or set anywhere else. Toggle handlers `disableMicFunction`/`disableVideoFunction` flip state, write back to localStorage, and `postMessage("MicOn"/"MicOff"/"VidOn"/"VidOff")` into the iframe.

**Host-forced mute** (`actionOnMicByHost`/`actionOnCameraByHost` in `MeetingContext`) are declared but never referenced anywhere else — dead code. The real host-mute mechanism runs through Redux instead: `muteUnmuteByHost`/`muteUnmuteAllByHost` (`VideoNewParticipantList.js:455-522`) dispatch `muteUnMuteParticipantMainApi`, a REST call. **Unclear — needs runtime verification**: exactly how the target participant's own mic is silenced in real time; no MQTT subscription enforcing the mute on the target's client was found in this pass, so it's plausible the provider (Zoom-side) enforces it directly rather than this app's Redux state.

### 6.2 Screen share

`handleScreenShareButton` (`videoCallNormalHeader.js:1816-1857`) just `postMessage("ScreenShare")` into the iframe — the capture prompt is the provider's. "Who is sharing" tracked via Redux `globallyScreenShare` + localStorage `isSharedSceenEnable`/`isScreenShareEnabled`. **Only one sharer at a time is enforced client-side**: once `globallyScreenShare` is true for anyone, everyone else's share button becomes inert. `handleBeforeUnload` fires a `keepalive` fetch to stop the share server-side if the closing tab was the active sharer. Layout rearrangement on share happens inside the third-party iframe, not in Diskus code.

### 6.3 Recording

Pure `postMessage` protocol — no explicit "start recording" REST call. Handlers in `videoCallNormalPanel.js` update the four `MeetingContext` booleans (`startRecordingState`/`pauseRecordingState`/`resumeRecordingState`/`stopRecordingState`) optimistically and `postMessage("RecordingStartMsgFromIframe"`/etc.). **Host-only, and disabled while presenting**: every handler is gated behind `isMeeting && isMeetingVideo && isMeetingVideoHostChecker && !presenterViewJoinFlag && !presenterViewHostFlag`. The panel also listens for the iframe echoing the same events back, which is what drives the recording badge for participants who didn't click start. No Diskus backend "save recording" call fires here — separate components (`Recording.js`, `MeetingRecording.js`, `DownloadOptionsModal.js`) handle browsing/downloading after the fact, implying the provider persists recordings server-side.

### 6.4 Raise hand

`raiseUnRaiseForParticipant(flag)` (`videoCallNormalHeader.js:1765-1774`) dispatches `raiseUnRaisedHandMainApi({RoomID, UID, IsHandRaised})` — a real backend call, no local optimistic toggle. `handRaiseCounter` is derived reactively from the synced roster every time it changes, not incremented directly. **No automatic timeout** — it only clears when the user explicitly lowers their hand, a host-transfer force-lowers it, the participant leaves, or on tab close (`beforeunload` resets the counter to 0).

### 6.5 Host transfer

`makeHostOnClick(usersData)` (`VideoNewParticipantList.js:395-437`): lowers the current host's own raised hand if needed, `postMessage`s a Zoom-side host-transfer event, then dispatches `transferMeetingHostMainApi` (the real backend call). Receiving side: an MQTT-driven Redux flag (`makeParticipantAsHost`) is watched in `videoCallNormalPanel.js`, and if the current user is the new host it rewrites a batch of localStorage keys (`hostUrl`, `newRoomId`, `meetinHostInfo`, `isGuid`, **`isMeetingVideoHostCheck=true`**, `isHost=true`) and removes the stale participant-role keys. `MeetingContext.isMeetingHostFlag` is not set anywhere in this flow — `localStorage.isMeetingVideoHostCheck` is the actual "am I host" source of truth used throughout the call UI, not the context field.

### 6.6 Presenter view

Not a screen-share overlay — a **separate, dedicated video room**. `openPresenterViewMainApi` calls the backend, stores the returned `videoURL` into `localStorage.presenterViewvideoURL`. `generateURLParticipant` (see §5) returns that URL directly instead of building a normal join URL, so the iframe loads an entirely different session for presenter view. An MQTT-driven action (`presenterViewGlobalState`) carries `presenterMeetingId`/`presenterViewFlag`/`presenterViewHostFlag`/`presenterViewJoinFlag` to all participants so everyone learns when a presentation starts/stops. Entering/leaving is modeled as "leave the presenter room, then (re)join the regular room" — several dedicated `MeetingContext` fields sequence that transition (`leavePresenterViewToJoinOneToOne`, `leaveMeetingVideoForOneToOneOrGroup`, `joiningOneToOneAfterLeavingPresenterView`).

### 6.7 Minimize / Maximize / Normal view

Redux flags `NormalizeVideoFlag`/`MaximizeVideoFlag`/`MinimizeVideoFlag` (in `videoFeatureReducer`) drive this. `videoCallMain.js` is the orchestrator: it renders the **same** `videoCallNormalPanel.js` for both Normalize and Maximize states, just toggling a CSS class — the imported `videoCallMaximizePanel.js` is never actually rendered from here (it may be used by a different entry point; not confirmed). `VideoCallMinimizeHeader` shows/hides the same way for the minimize flag.

**Minimizing keeps the call connected in the background**: the whole video component tree renders inside `Dashboard.js` itself, and `Dashboard` is mounted once at the parent `/Diskus/` route with all other pages rendering as nested `<Outlet>` children — so the call component is never unmounted by route navigation, only CSS-hidden, confirming the call/iframe genuinely persists while you browse elsewhere with it minimized.

### 6.8 Leave vs. End call

**There is no separate "End meeting for everyone" action distinct from leaving**, as far as the client UI goes. `LeaveVideoIntimationModal.js` is actually a *navigation guard* ("are you sure you want to leave this page while in a call"), not a leave/end confirmation. The real leave confirmation is `NewEndMeetingModal.js`, whose copy is the same ("Are you sure you want to leave the meeting") for both host and non-host — the only difference is an `IsHost` flag sent along with the `LeaveMeetingVideo` API call. Whether a host leaving forces everyone else out is presumably a backend/MQTT decision (flags `leaveMeetingOnEndStatusMqtt`/`leaveMeetingVideoOnEndStatusMqtt` exist and are consumed elsewhere to force-close other clients) — **unclear — needs runtime verification** exactly what a non-host participant sees when the host leaves.

### 6.9 "Already in a call" handling

This is a **cross-tab guard**, not a same-tab "you're already on a call, join anyway?" prompt. `Dashboard.js:8339-8343`: if `localStorage.activeCall` is true (some tab in this browser is on a 1:1/group call) but *this* tab's own `sessionStorage` flag isn't set, the user is redirected to the dedicated route `/AlreadyInGroupAndOtoCall`, which shows a static warning with **no options to join anyway or switch calls** — effectively "close this tab." (The close button's `onClick` prop doesn't appear to be wired through correctly — worth a closer look if this page is actually reachable by users.)

### 6.10 Chat panel during a call

The dedicated in-call chat component (`videoCallNormalChat.js`) is a **fully static placeholder** (hardcoded title, no working input/send handlers) and its render call site is commented out — it's unreachable dead code. The header's chat icon instead opens/reuses the **main Talk 1:1 chat** (`activeChat`/`GetOTOUserMessages` dispatch, same as the standalone Talk module) — there is no call-specific chat, just a shortcut into the regular messaging UI.

### 6.11 Board deck

Neither "board deck" file relates to a live in-call document viewer. `VideoMeetingBoardDeck.js` is a **standalone route** (`/Diskus/video`) reached via an emailed link that plays back an **MP4 recording** of a past meeting — unrelated to an active call. The `MeetingContext.boardDeckMeetingID/Title` fields feed a completely different, unrelated feature: the pre/post-meeting document-pack sharing modals used from the publish screens (email/data-room sharing of board documents). There is no in-call document viewer found anywhere in this pass.

---

## 7. Known dead / vestigial code (consolidated)

Worth knowing about before touching this module, since some of it looks live but isn't reachable:

| Item | Where | Status |
|---|---|---|
| `VideoIncoming.js` | `container/videoIncoming/` | Dead — `VideoMaxIncoming.js` is the real ringer |
| `MeetingContext.actionOnMicByHost`/`actionOnCameraByHost` | `context/MeetingContext.js` | Declared, never read/written elsewhere |
| `MeetingContext.isMeetingHostFlag` | `context/MeetingContext.js` | Never set in the host-transfer flow — `localStorage.isMeetingVideoHostCheck` is the real source of truth |
| `MeetingContext.mic`/`camera` | `context/MeetingContext.js` | Dead — actual mute state is local `useState` in `videoCallNormalPanel.js` seeded from `localStorage.MicOff/VidOff` |
| `videoCallNormalChat.js` | `videoCallScreen/videoCallPanels/` | Static placeholder, render site commented out |
| `videoCallNormalMinutesMeeting.js` | `videoCallScreen/videoCallPanels/` | Hardcoded placeholder text, trigger flag never dispatched with `true` |
| `MaxHostVideoCallComponent`, `NormalHostVideoCallComponent`, `NormalParticipantVideoComponent` | `meeting/commonComponents/meetingVideoCall/` | Trigger Redux actions never dispatched with `true` — unreachable in the current code path |
| `maxParticipantVideoEndComponent.js` | `meeting/commonComponents/meetingVideoCall/` | Never imported anywhere; also internally broken (references undefined `RemoveImage`/`Button`/`onClickCloseModal`) |
| `videoCallMaximizePanel.js` import in `videoCallMain.js` | `videoCallScreen/videoCallMain.js` | Imported but never rendered from this file (maximize reuses the normal panel via a CSS class) |

---

## 8. Note on state duplication

Almost every field described above that "lives in `MeetingContext`" has a parallel, independently-read/written `localStorage` key, and in several cases (mic/camera, host-check) the localStorage/local-state copy is the one actually driving behavior while the context field is dead. See the memory note `video_call_architecture_debt.md` for the full inventory and the recommended incremental-cleanup approach — this document is the behavioral map that cleanup work should be checked against.
