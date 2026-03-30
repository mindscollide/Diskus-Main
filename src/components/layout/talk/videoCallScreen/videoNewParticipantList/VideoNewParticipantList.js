/**
 * VideoNewParticipantList.jsx
 * ============================
 * Sidebar panel shown during a video call, presenter session, or group call.
 * Renders three sections:
 *   1. Host / Presenter row (always visible, non-interactive)
 *   2. Participant list — with per-row mic / camera status icons and a
 *      context-menu for host actions (mute, hide video, remove, make host)
 *   3. Waiting-room queue — shown only to the meeting host; allows
 *      admitting or denying participants who are waiting to join
 *
 * View modes (driven by Redux flags)
 * ────────────────────────────────────
 * presenterViewFlag + presenterViewHostFlag  → Presenter host seeing participants
 * presenterViewFlag + presenterViewJoinFlag  → Joined presenter seeing participants
 * isMeetingVideoHostCheck                    → Regular meeting host
 * default                                   → Regular participant (limited actions)
 *
 * Mute-All / Unmute-All visibility rule
 * ──────────────────────────────────────
 * The button is only shown when there are at LEAST 2 other participants
 * (excluding the current user). With only 1 other participant, the
 * per-row mute icon already covers the use-case, so "mute all" is redundant
 * and hidden.
 *
 * TODO
 * ─────
 * - Replace inline localStorage reads with a shared session-context hook
 *   so values don't need to be re-parsed on every render.
 * - Add error boundaries around the iframe postMessage call.
 */

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Col, Row, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "./VideoNewParticipantList.module.css";
import { Button, TextField } from "../../../../elements";
import { MeetingContext } from "../../../../../context/MeetingContext";

// ── Actions ──────────────────────────────────────────────────────────────────
import {
  hideUnHideParticipantGuestMainApi,
  muteUnMuteParticipantMainApi,
  participantAcceptandReject,
  participantWaitingListBox,
  presenterLeaveParticipant,
  presenterNewParticipantJoin,
  updatedParticipantListForPresenter,
} from "../../../../../store/actions/VideoFeature_actions";
import {
  admitRejectAttendeeMainApi,
  raiseUnRaisedHandMainApi,
  removeParticipantMeetingMainApi,
  transferMeetingHostMainApi,
} from "../../../../../store/actions/Guest_Video";

// ── Assets ───────────────────────────────────────────────────────────────────
import CrossIcon from "../../../../../assets/images/VideoCall/Cross_icon_videoCallParticipantWaiting.png";
import UserImage from "../../../../../assets/images/user.png";
import Menu from "./../../talk-Video/video-images/Menu.png";
import GoldenHandRaised from "./../../talk-Video/video-images/GoldenHandRaised.png";
import MenuRaiseHand from "./../../talk-Video/video-images/Menu-RaiseHand.png";
import VideoDisable from "./../../talk-Video/video-images/Video Disabled Purple.svg";
import VideoOn from "./../../talk-Video/video-images/Video Enabled Purple.svg";
import MicDisabled from "../../talk-Video/video-images/MicOffDisabled.png";
import MicOnEnabled from "../../talk-Video/video-images/MicOnEnabled.png";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads a boolean-encoded JSON value from localStorage.
 * Returns `null` safely if the key is missing.
 */
const getStoredBool = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

/**
 * Derives the effective RoomID string for API calls depending on the
 * current view mode. Centralised here to avoid repeating the same
 * ternary chain across every handler.
 *
 * @param {object} flags - View mode booleans from Redux / localStorage
 * @returns {string} The room ID to send with API requests
 */
const resolveRoomID = ({
  presenterViewFlag,
  presenterViewHostFlag,
  presenterViewJoinFlag,
  isMeetingVideoHostCheck,
  acceptedRoomID,
  newRoomID,
  participantRoomId,
}) => {
  if (presenterViewFlag && (presenterViewHostFlag || presenterViewJoinFlag)) {
    return acceptedRoomID;
  }
  return isMeetingVideoHostCheck ? newRoomID : participantRoomId;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const VideoNewParticipantList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // ── Context ────────────────────────────────────────────────────────────────
  // Only iframeRef is consumed from context; the recording/screen-share
  // setters are managed by sibling components and not needed here.
  const { iframeRef } = useContext(MeetingContext);

  // ── Session constants — read once on mount ─────────────────────────────────
  // FIX: original code read localStorage on every render (top-level let declarations
  // inside the component body). Moved to useMemo with [] deps so they are
  // parsed exactly once and held as stable references.
  const session = useMemo(() => {
    const isMeetingVideoHostCheck = getStoredBool("isMeetingVideoHostCheck");
    const isZoomEnabled = getStoredBool("isZoomEnabled");
    const meetinHostInfo = getStoredBool("meetinHostInfo") ?? {};

    return {
      roomID: localStorage.getItem("newRoomId"), // meeting room
      acceptedRoomID: localStorage.getItem("acceptedRoomID"), // presenter accepted room
      participantRoomId: localStorage.getItem("participantRoomId"),
      currentMeetingID: Number(localStorage.getItem("currentMeetingID")),
      isMeetingVideoHostCheck,
      isZoomEnabled,
      meetinHostInfo,
      participantUID: localStorage.getItem("participantUID"),
      isGuid: localStorage.getItem("isGuid"),
      hostName: localStorage.getItem("name"),
      presenterHostUserID: Number(localStorage.getItem("userID")),
    };
  }, []); // stable for the lifetime of the component

  // ── Redux selectors ────────────────────────────────────────────────────────
  const getAllParticipantMain = useSelector(
    (s) => s.videoFeatureReducer.getAllParticipantMain,
  );
  const waitingParticipants = useSelector(
    (s) => s.videoFeatureReducer.waitingParticipantsList,
  );
  const NormalizeVideoFlag = useSelector(
    (s) => s.videoFeatureReducer.NormalizeVideoFlag,
  );
  const presenterViewHostFlag = useSelector(
    (s) => s.videoFeatureReducer.presenterViewHostFlag,
  );
  const presenterViewJoinFlag = useSelector(
    (s) => s.videoFeatureReducer.presenterViewJoinFlag,
  );
  const presenterViewFlag = useSelector(
    (s) => s.videoFeatureReducer.presenterViewFlag,
  );
  const newJoinPresenterParticipant = useSelector(
    (s) => s.videoFeatureReducer.newJoinPresenterParticipant,
  );
  const leavePresenterParticipant = useSelector(
    (s) => s.videoFeatureReducer.leavePresenterParticipant,
  );
  const disableBeforeJoinZoom = useSelector(
    (s) => s.videoFeatureReducer.disableBeforeJoinZoom,
  );
  const raisedUnRaisedParticipant = useSelector(
    (s) => s.videoFeatureReducer.raisedUnRaisedParticipant,
  );

  // ── Derived room/uid values ────────────────────────────────────────────────
  /**
   * The effective room ID and UID for this client in the current view mode.
   * Kept as a memoised object so handlers can reference stable values.
   */
  const roomContext = useMemo(
    () => ({
      RoomID: resolveRoomID({
        presenterViewFlag,
        presenterViewHostFlag,
        presenterViewJoinFlag,
        isMeetingVideoHostCheck: session.isMeetingVideoHostCheck,
        acceptedRoomID: session.acceptedRoomID,
        newRoomID: session.roomID,
        participantRoomId: session.participantRoomId,
      }),
      UID: session.isMeetingVideoHostCheck
        ? session.isGuid
        : session.participantUID,
    }),
    [presenterViewFlag, presenterViewHostFlag, presenterViewJoinFlag, session],
  );

  // ── Local state ────────────────────────────────────────────────────────────
  /** Displayed participant rows; filtered by the search input */
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  /** De-duplicated waiting-room entries */
  const [filteredWaitingParticipants, setFilteredWaitingParticipants] =
    useState([]);
  const [searchValue, setSearchValue] = useState("");
  /**
   * true  → at least one non-self participant is muted → button shows "Unmute All"
   * false → all non-self participants are unmuted      → button shows "Mute All"
   */
  const [isForAll, setIsForAll] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECT: Sync participant list from Redux
  // FIX: original used Object.keys(array).length which is always > 0 for
  // arrays; replaced with Array.isArray + length check.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (Array.isArray(getAllParticipantMain) && getAllParticipantMain.length) {
      setFilteredParticipants(getAllParticipantMain);
    } else {
      setFilteredParticipants([]);
    }
    // Reset search whenever the underlying list changes
    setSearchValue("");
  }, [getAllParticipantMain]);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECT: Remove a participant who left (presenter view only)
  // FIX: original read `filteredParticipants` from the outer closure which
  // could be stale. Using the functional updater form ensures we always
  // operate on the latest state.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (
      !leavePresenterParticipant ||
      !Object.keys(leavePresenterParticipant).length ||
      !presenterViewFlag ||
      !presenterViewHostFlag
    )
      return;

    setFilteredParticipants((prev) =>
      prev.filter((p) => p.guid !== leavePresenterParticipant.uid),
    );
    dispatch(presenterLeaveParticipant([]));
  }, [
    leavePresenterParticipant,
    presenterViewFlag,
    presenterViewHostFlag,
    dispatch,
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECT: Add / replace a participant who just joined (presenter view only)
  // FIX: original used [...filteredParticipants] which captured a stale
  // closure. Using the functional updater form instead.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (
      !newJoinPresenterParticipant ||
      !Object.keys(newJoinPresenterParticipant).length ||
      !presenterViewFlag ||
      !presenterViewHostFlag
    )
      return;

    setFilteredParticipants((prev) => {
      // Remove stale entry for the same user (reconnect / tab-switch scenario)
      const withoutStale = prev.filter(
        (p) =>
          p.userID !== newJoinPresenterParticipant.userID &&
          p.guid !== newJoinPresenterParticipant.guid,
      );
      const updated = [...withoutStale, newJoinPresenterParticipant];
      // Keep Redux in sync so other selectors that depend on this list are accurate
      dispatch(updatedParticipantListForPresenter(updated));
      return updated;
    });

    dispatch(presenterNewParticipantJoin([]));
  }, [
    newJoinPresenterParticipant,
    presenterViewFlag,
    presenterViewHostFlag,
    dispatch,
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECT: De-duplicate the waiting-room list
  // Waiting participants can arrive via multiple socket events for the same
  // person. A Map keyed on `meetingID_userID` keeps only the first arrival.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!waitingParticipants?.length) {
      setFilteredWaitingParticipants([]);
      return;
    }

    const map = new Map();
    waitingParticipants.forEach((item) => {
      const key = `${item.meetingID}_${item.userID}`;
      if (!map.has(key)) map.set(key, item);
    });

    setFilteredWaitingParticipants(Array.from(map.values()));
  }, [waitingParticipants]);

  // ─────────────────────────────────────────────────────────────────────────
  // DERIVED: Mute-All button visibility and label
  //
  // Business rule (SRS):
  //   The "Mute All / Unmute All" button is shown ONLY when there are at
  //   least 2 participants EXCLUDING the current host/presenter. With fewer
  //   than 2 others the per-row icon is sufficient and the bulk button
  //   adds no value.
  //
  // Why useMemo instead of a useEffect+state pair:
  //   Both `nonSelfCount` and `shouldMuteAll` are pure derivations of
  //   existing state. Computing them inline avoids a second render cycle
  //   that the original useEffect/setIsForAll pattern caused.
  // ─────────────────────────────────────────────────────────────────────────
  const { nonSelfParticipants, showMuteAllButton, shouldMuteAll } =
    useMemo(() => {
      const nonSelf = filteredParticipants.filter((p) => {
        // In presenter-host view, exclude the presenter themselves by userID
        if (presenterViewFlag && presenterViewHostFlag) {
          return p.userID !== session.presenterHostUserID;
        }
        // In regular host view, exclude host-flagged participants
        return !p.isHost;
      });

      // At least one non-self participant is muted → show "Unmute All"
      const anyMuted = nonSelf.some((p) => p.mute === true);

      return {
        nonSelfParticipants: nonSelf,
        // Only render the button when there are 2+ non-self participants
        showMuteAllButton: nonSelf.length > 1,
        shouldMuteAll: anyMuted,
      };
    }, [
      filteredParticipants,
      presenterViewFlag,
      presenterViewHostFlag,
      session.presenterHostUserID,
    ]);

  // Keep isForAll state in sync with the derived value so existing
  // handler logic that reads `isForAll` still works correctly
  useEffect(() => {
    setIsForAll(shouldMuteAll);
  }, [shouldMuteAll]);

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // Wrapped in useCallback to give stable references to the memoised list
  // ─────────────────────────────────────────────────────────────────────────

  /** Filter visible rows by the typed search string (client-side only) */
  const handleChangeSearchParticipant = useCallback(
    (e) => {
      const { value } = e.target;
      setSearchValue(value);
      const lower = value.toLowerCase();
      setFilteredParticipants(
        getAllParticipantMain.filter((p) =>
          p.name.toLowerCase().includes(lower),
        ),
      );
    },
    [getAllParticipantMain],
  );

  /**
   * Transfer host role to another participant.
   * If the current user has their hand raised it is lowered first (protocol
   * requirement), then a HostTransferEvent is posted to the Zoom iframe before
   * the API call so the iframe UI updates atomically with the server state.
   */
  const makeHostOnClick = useCallback(
    async (usersData) => {
      // Lower raised hand before transferring host
      if (
        raisedUnRaisedParticipant &&
        (!session.isZoomEnabled || !disableBeforeJoinZoom)
      ) {
        await dispatch(
          raiseUnRaisedHandMainApi(navigate, t, {
            RoomID: String(roomContext.RoomID),
            UID: String(roomContext.UID),
            IsHandRaised: false,
          }),
        );
      }

      // Notify Zoom iframe of the host transfer (Zoom-specific path only)
      if (session.isZoomEnabled) {
        const iframe = iframeRef.current;
        if (iframe?.contentWindow) {
          setTimeout(() => {
            iframe.contentWindow.postMessage(
              `HostTransferEvent_#_${usersData.guid}`,
              "*",
            );
          }, 1000);
        }
      }

      dispatch(
        transferMeetingHostMainApi(
          navigate,
          t,
          {
            RoomID: String(session.roomID),
            UID: usersData.guid,
            UserID: usersData.userID,
            MeetingID: session.currentMeetingID,
          },
          1,
        ),
      );
    },
    [
      dispatch,
      navigate,
      t,
      raisedUnRaisedParticipant,
      disableBeforeJoinZoom,
      session,
      roomContext,
      iframeRef,
    ],
  );

  /**
   * Mute or unmute a single participant.
   * Optimistically updates the local list so the icon flips immediately
   * without waiting for the socket echo.
   */
  const muteUnmuteByHost = useCallback(
    (usersData, flag) => {
      if (!usersData) return;

      // Optimistic local update — avoids a visible lag on the icon
      setFilteredParticipants((prev) =>
        prev.map((p) => (p.guid === usersData.guid ? { ...p, mute: flag } : p)),
      );

      // Only dispatch if this is a presenter context OR the target is not the host
      const isPresenterContext =
        presenterViewFlag && (presenterViewHostFlag || presenterViewJoinFlag);
      if (isPresenterContext || !usersData.isHost) {
        dispatch(
          muteUnMuteParticipantMainApi(navigate, t, {
            RoomID: roomContext.RoomID,
            IsMuted: flag,
            isForAll: false,
            MuteUnMuteList: [{ UID: usersData.guid }],
            MeetingID: session.currentMeetingID,
          }),
        );
      }
    },
    [
      dispatch,
      navigate,
      t,
      roomContext,
      session.currentMeetingID,
      presenterViewFlag,
      presenterViewHostFlag,
      presenterViewJoinFlag,
    ],
  );

  /**
   * Mute or unmute all non-self participants at once.
   * Excludes the current user from the UID list so they never accidentally
   * mute themselves via this action.
   *
   * FIX: original had 6+ repeated console.logs and re-read localStorage
   * inside the function. Now uses the memoised `nonSelfParticipants` list
   * and `roomContext` derived above.
   */
  const muteUnmuteAllByHost = useCallback(
    (currentlyMuted) => {
      const allUids = nonSelfParticipants.map((p) => ({ UID: p.guid }));

      // Resolve RoomID for the "mute all" context (presenter path uses acceptedRoomID)
      const RoomID = presenterViewFlag
        ? session.acceptedRoomID || session.roomID
        : session.isMeetingVideoHostCheck
          ? session.roomID
          : session.participantRoomId;

      dispatch(
        muteUnMuteParticipantMainApi(navigate, t, {
          RoomID,
          IsMuted: !currentlyMuted, // toggle
          isForAll: true,
          MuteUnMuteList: allUids,
          MeetingID: session.currentMeetingID,
        }),
      );
    },
    [dispatch, navigate, t, nonSelfParticipants, presenterViewFlag, session],
  );

  /**
   * Show or hide a participant's camera feed.
   * Optimistically patches `hideCamera` on the local row.
   */
  const hideUnHideVideoParticipantByHost = useCallback(
    (usersData, flag) => {
      // Optimistic local update
      setFilteredParticipants((prev) =>
        prev.map((p) =>
          p.guid === usersData.guid ? { ...p, hideCamera: flag } : p,
        ),
      );

      dispatch(
        hideUnHideParticipantGuestMainApi(navigate, t, {
          RoomID: roomContext.RoomID,
          HideVideo: flag,
          UIDList: [usersData.guid],
          MeetingID: session.currentMeetingID,
        }),
      );
    },
    [dispatch, navigate, t, roomContext, session.currentMeetingID],
  );

  /**
   * Remove a participant from the meeting entirely.
   * Optimistically removes their row before the API call completes.
   */
  const removeParticipantMeetingOnClick = useCallback(
    (usersData) => {
      setFilteredParticipants((prev) =>
        prev.filter((p) => p.guid !== usersData.guid),
      );
      dispatch(
        removeParticipantMeetingMainApi(navigate, t, {
          RoomID: String(session.roomID),
          UID: usersData.guid,
          Name: usersData.name,
          MeetingID: session.currentMeetingID,
        }),
      );
    },
    [dispatch, navigate, t, session.roomID, session.currentMeetingID],
  );

  /**
   * Admit or deny all participants currently in the waiting room at once.
   * flag === 1 → admit all, flag === 2 → deny all.
   */
  const handleClickAllAcceptAndReject = useCallback(
    (flag) => {
      // Waiting-room bulk actions are not available in presenter view
      if (presenterViewFlag || !filteredWaitingParticipants.length) return;

      dispatch(
        admitRejectAttendeeMainApi(
          {
            MeetingId: filteredWaitingParticipants[0]?.meetingID,
            RoomId: String(session.roomID),
            IsRequestAccepted: flag === 1,
            AttendeeResponseList: filteredWaitingParticipants.map((p) => ({
              IsGuest: p.isGuest,
              UID: p.guid,
              UserID: p.userID,
            })),
          },
          navigate,
          t,
          true,
          filteredParticipants,
        ),
      );

      // Remove all from the local waiting list immediately
      dispatch(
        participantAcceptandReject(
          filteredWaitingParticipants.map((p) => ({
            meetingID: p.meetingID,
            userID: p.userID,
          })),
        ),
      );
    },
    [
      dispatch,
      navigate,
      t,
      presenterViewFlag,
      filteredWaitingParticipants,
      filteredParticipants,
      session.roomID,
    ],
  );

  /**
   * Admit or deny a single waiting participant.
   * flag === 1 → admit, flag === 2 → deny.
   * In both cases the participant is removed from the waiting list.
   */
  const handleClickAcceptAndReject = useCallback(
    (participantInfo, flag) => {
      dispatch(
        admitRejectAttendeeMainApi(
          {
            MeetingId: session.currentMeetingID,
            RoomId: String(session.roomID),
            IsRequestAccepted: flag === 1,
            AttendeeResponseList: [
              {
                IsGuest: participantInfo.isGuest,
                UID: participantInfo.guid,
                UserID: participantInfo.userID,
              },
            ],
          },
          navigate,
          t,
          false,
          filteredParticipants,
        ),
      );

      dispatch(
        participantAcceptandReject([
          {
            meetingID: participantInfo.meetingID,
            userID: participantInfo.userID,
          },
        ]),
      );
    },
    [
      dispatch,
      navigate,
      t,
      session.currentMeetingID,
      session.roomID,
      filteredParticipants,
    ],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // DERIVED: container class for the outer section element
  // ─────────────────────────────────────────────────────────────────────────
  const sectionClass = useMemo(() => {
    if (presenterViewFlag)
      return styles["Waiting-New-Participant-List-For-Presenter"];
    if (NormalizeVideoFlag) return styles["WaitingParticipantBoxNorm"];
    if (filteredWaitingParticipants.length === 0)
      return styles["Waiting-New-Participant-List-when-no-participantwaiting"];
    return styles["Waiting-New-Participant-List"];
  }, [
    presenterViewFlag,
    NormalizeVideoFlag,
    filteredWaitingParticipants.length,
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // Extracted to avoid duplicating the mic / camera icon ternary chains
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Returns the correct camera icon for a participant row.
   * Self (host / presenter) reads from localStorage because their own
   * camera state is tracked locally, not in the participant list.
   */
  const renderCameraIcon = useCallback(
    (usersData) => {
      const isSelfHostRow =
        (!presenterViewHostFlag &&
          !presenterViewJoinFlag &&
          usersData.isHost) ||
        (presenterViewHostFlag &&
          session.presenterHostUserID === usersData.userID);

      const isWebCamEnabled = getStoredBool("isWebCamEnabled");
      const cameraOff = isSelfHostRow ? isWebCamEnabled : usersData.hideCamera;

      return cameraOff ? (
        <img
          draggable="false"
          src={VideoDisable}
          width="18px"
          height="18px"
          alt="Video Disabled"
          className="handraised-participant"
        />
      ) : (
        <img
          draggable="false"
          src={VideoOn}
          width="18px"
          height="18px"
          alt="Video On"
          className="handraised-participant"
        />
      );
    },
    [presenterViewHostFlag, presenterViewJoinFlag, session.presenterHostUserID],
  );

  /**
   * Returns the correct microphone icon for a participant row.
   * Same self-vs-others logic as renderCameraIcon.
   */
  const renderMicIcon = useCallback(
    (usersData) => {
      const isSelfHostRow =
        (!presenterViewHostFlag &&
          !presenterViewJoinFlag &&
          usersData.isHost) ||
        (presenterViewHostFlag &&
          session.presenterHostUserID === usersData.userID);

      const isMicEnabled = getStoredBool("isMicEnabled");
      const micOff = isSelfHostRow ? isMicEnabled : usersData.mute;

      return micOff ? (
        <img
          draggable="false"
          src={MicDisabled}
          width="19px"
          height="19px"
          alt="Microphone Disabled"
        />
      ) : (
        <img
          draggable="false"
          src={MicOnEnabled}
          width="15px"
          height="19px"
          alt="Microphone Enabled"
        />
      );
    },
    [presenterViewHostFlag, presenterViewJoinFlag, session.presenterHostUserID],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section className={sectionClass}>
      {/* ── Header: title + close button ── */}
      <Row>
        <Col sm={12} className="d-flex justify-content-between">
          <span className={styles["Waiting-New-Participant-List_box_title"]}>
            {t("People")}
          </span>
          <img
            draggable="false"
            src={CrossIcon}
            onClick={() => dispatch(participantWaitingListBox(false))}
            style={{ display: "block", objectFit: "cover", cursor: "pointer" }}
            alt="Close participant panel"
          />
        </Col>
      </Row>

      {/* ── Search field ── */}
      <Row>
        <Col sm={12}>
          <TextField
            placeholder="Search"
            applyClass="waitingParticipantsSearchField"
            change={handleChangeSearchParticipant}
            value={searchValue}
          />
        </Col>
      </Row>

      {/* ── Host / Presenter label row ── */}
      <Col sm={12}>
        <div className={styles["Waiting-New-Participant-hosttab"]}>
          <p className={styles["Waiting-New-Participant-Hosts-Title"]}>
            {presenterViewFlag && presenterViewHostFlag
              ? t("Presenter")
              : t("Host")}
          </p>
        </div>
      </Col>

      {/* ── Host / Presenter name ── */}
      <Col sm={12}>
        <div className={styles["Waiting-New-Participant-HostNameList"]}>
          <p className={styles["Waiting-New-Participant-HostsList-Name"]}>
            {session.hostName}
          </p>
        </div>
      </Col>

      {/* ── Participants header + conditional Mute All / Unmute All button ──
           Business rule: button is hidden when there are fewer than 2 non-self
           participants. With only one other person the individual row mic
           toggle is sufficient and the bulk button adds no value.
      ── */}
      <Col sm={12}>
        <div className={styles["Waiting-New-Participant-hosttab"]}>
          <Row>
            <Col sm={6} className="d-flex justify-content-start">
              <p className={styles["Waiting-New-Participant-Hosts-Title"]}>
                {t("Participants")}
              </p>
            </Col>
            <Col sm={6} className="d-flex justify-content-end">
              {showMuteAllButton && (
                <Button
                  text={isForAll ? t("Unmute-all") : t("Mute-all")}
                  className={styles["Waiting-New-Participant-muteAll"]}
                  onClick={() => muteUnmuteAllByHost(isForAll)}
                />
              )}
            </Col>
          </Row>
        </div>
      </Col>

      {/* ── Participant rows ── */}
      <Col sm={12}>
        <div
          className={
            filteredWaitingParticipants.length === 0
              ? styles["Waiting-New-ParticipantNameList-when-nowaiting-data"]
              : styles["Waiting-New-ParticipantNameList"]
          }
        >
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((usersData) => {
              /**
               * isSelfHost: the current meeting user is a host AND this row
               * represents them. We hide action controls for this row because
               * hosts cannot act on themselves.
               */
              const isSelfHost =
                usersData.isHost && session.meetinHostInfo?.isHost;

              /** true when this row represents a different user from the current host */
              const isTargetUser =
                session.presenterHostUserID !== usersData.userID;

              const canMute = !usersData.mute;
              const canHideVideo = !usersData.hideCamera;

              /**
               * Whether the three-dot dropdown should render for this row.
               * In presenter view: only show for non-self participants.
               * In regular host view: hide for the host row (they can't act on themselves).
               */
              const canShowDropdown = presenterViewFlag
                ? isTargetUser
                : !usersData.isHost;

              return (
                <Row className="hostBorder m-0" key={usersData.guid}>
                  {/* Left column: name + raise-hand + camera icon */}
                  <Col
                    className="p-0 d-flex align-items-center mt-1"
                    lg={8}
                    md={8}
                    sm={12}
                  >
                    {!isSelfHost && (
                      <>
                        <p className="participant-name">{usersData.name}</p>

                        {/* "(Presenter)" or "(Host)" label */}
                        {presenterViewFlag &&
                          presenterViewHostFlag &&
                          session.presenterHostUserID === usersData.userID && (
                            <p className={styles["Host-name"]}>
                              <span className={styles["Host-title-name"]}>
                                {t("(Presenter)")}
                              </span>
                            </p>
                          )}
                        {presenterViewFlag &&
                          !presenterViewJoinFlag &&
                          usersData.isHost &&
                          session.presenterHostUserID !== usersData.userID && (
                            <p className={styles["Host-name"]}>
                              <span className={styles["Host-title-name"]}>
                                {t("(Host)")}
                              </span>
                            </p>
                          )}

                        {/* Raised-hand icon */}
                        {((presenterViewHostFlag && presenterViewFlag) ||
                          session.meetinHostInfo?.isHost) &&
                        usersData.raiseHand ? (
                          <img
                            draggable="false"
                            src={GoldenHandRaised}
                            alt="Hand raised"
                            width="22px"
                            height="22px"
                            className="handraised-participant"
                          />
                        ) : (
                          /* MenuRaiseHand placeholder — shown unless the row is
                             the current presenter themselves */
                          !(
                            presenterViewFlag &&
                            presenterViewHostFlag &&
                            session.presenterHostUserID === usersData.userID
                          ) && (
                            <img
                              draggable="false"
                              src={MenuRaiseHand}
                              alt=""
                              className="handraised-participant"
                            />
                          )
                        )}

                        {/* Camera status icon */}
                        {renderCameraIcon(usersData)}
                      </>
                    )}
                  </Col>

                  {/* Right column: mic icon + action dropdown */}
                  <Col
                    className="d-flex justify-content-end align-items-baseline gap-2 p-0 right-col-icons"
                    lg={4}
                    md={4}
                    sm={12}
                  >
                    {!isSelfHost && renderMicIcon(usersData)}

                    {/* Action dropdown — presenter view */}
                    {presenterViewFlag && isTargetUser && (
                      <Dropdown>
                        <Dropdown.Toggle className="participant-toggle">
                          <img draggable="false" src={Menu} alt="Actions" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {/* Status-only block when both mic and video are already disabled */}
                          {usersData.mute && usersData.hideCamera && (
                            <div className="presenter-status-text px-3 py-2">
                              <span className="status-muted d-block">
                                {t("Mic Disabled")}
                              </span>
                              <span className="status-hidden d-block">
                                {t("Video Hidden")}
                              </span>
                            </div>
                          )}
                          {canMute && (
                            <Dropdown.Item
                              className="participant-dropdown-item"
                              onClick={() => muteUnmuteByHost(usersData, true)}
                            >
                              {t("Mute")}
                            </Dropdown.Item>
                          )}
                          {canHideVideo && (
                            <Dropdown.Item
                              className="participant-dropdown-item"
                              onClick={() =>
                                hideUnHideVideoParticipantByHost(
                                  usersData,
                                  true,
                                )
                              }
                            >
                              {t("Hide-video")}
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}

                    {/* Action dropdown — regular host view */}
                    {!presenterViewFlag && canShowDropdown && (
                      <Dropdown>
                        <Dropdown.Toggle className="participant-toggle">
                          <img draggable="false" src={Menu} alt="Actions" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {/* Make Host — only for non-guest participants */}
                          {!usersData.isGuest && (
                            <Dropdown.Item
                              className="participant-dropdown-item"
                              onClick={() => makeHostOnClick(usersData)}
                            >
                              {t("Make-host")}
                            </Dropdown.Item>
                          )}
                          {/* Remove — only for non-host participants */}
                          {!usersData.isHost && (
                            <Dropdown.Item
                              className="participant-dropdown-item"
                              onClick={() =>
                                removeParticipantMeetingOnClick(usersData)
                              }
                            >
                              {t("Remove")}
                            </Dropdown.Item>
                          )}
                          {canMute && (
                            <Dropdown.Item
                              className="participant-dropdown-item"
                              onClick={() => muteUnmuteByHost(usersData, true)}
                            >
                              {t("Mute")}
                            </Dropdown.Item>
                          )}
                          {canHideVideo && (
                            <Dropdown.Item
                              className="participant-dropdown-item"
                              onClick={() =>
                                hideUnHideVideoParticipantByHost(
                                  usersData,
                                  true,
                                )
                              }
                            >
                              {t("Hide-video")}
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </Col>
                </Row>
              );
            })
          ) : (
            <Row>
              <Col className="d-flex justify-content-center align-items-center">
                <p>{t("No-participant")}</p>
              </Col>
            </Row>
          )}
        </div>
      </Col>

      {/* ── Waiting-room section — host-only, hidden in presenter view ── */}
      {!presenterViewFlag &&
        !presenterViewHostFlag &&
        filteredWaitingParticipants.length > 0 && (
          <>
            <Col sm={12}>
              <div className={styles["Waiting-New-Participant-hosttab"]}>
                <p className={styles["Waiting-New-Participant-Hosts-Title"]}>
                  {t("Waiting-for-entry")}
                </p>
              </div>
            </Col>

            <Col sm={12}>
              <div
                className={
                  NormalizeVideoFlag
                    ? styles["AcceptAndDeniedManual_Nor"]
                    : styles["AcceptAndDeniedManual"]
                }
              >
                {/* Bulk admit / deny */}
                <Row className="mb-3">
                  <Col sm={6}>
                    <Button
                      className={styles["Waiting-New-Participant-denyAllBtn"]}
                      text={t("Deny-all")}
                      onClick={() => handleClickAllAcceptAndReject(2)}
                    />
                  </Col>
                  <Col sm={6}>
                    <Button
                      className={styles["Waiting-New-Participant-AcceptAllBtn"]}
                      text={t("Allow-all")}
                      onClick={() => handleClickAllAcceptAndReject(1)}
                    />
                  </Col>
                </Row>

                {/* Per-participant admit / deny rows */}
                {filteredWaitingParticipants.map((data) => (
                  <Row className="mb-2" key={data.guid}>
                    <Col sm={5} className="d-flex align-items-center gap-2">
                      <img
                        draggable="false"
                        src={UserImage}
                        className={styles["participantImage"]}
                        alt=""
                      />
                      <span className={styles["participant_name"]}>
                        {data.name}
                      </span>
                    </Col>
                    <Col sm={7} className="d-flex align-items-center gap-2">
                      <Button
                        className={
                          styles["Waiting-New-Participant-denyAllBtn-small"]
                        }
                        text={t("Deny")}
                        onClick={() => handleClickAcceptAndReject(data, 2)}
                      />
                      <Button
                        className={
                          styles["Waiting-New-Participant-AcceptAllBtn-small"]
                        }
                        text={t("Allow")}
                        onClick={() => handleClickAcceptAndReject(data, 1)}
                      />
                    </Col>
                  </Row>
                ))}
              </div>
            </Col>
          </>
        )}
    </section>
  );
};

export default VideoNewParticipantList;
