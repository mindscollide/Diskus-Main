import { useSelector } from "react-redux";

/**
 * Resolves "what kind of call/session is this" from the same localStorage
 * keys and Redux flags videoCallNormalHeader.js and videoCallNormalPanel.js
 * each used to re-derive independently (and had started to drift — e.g. the
 * RoomID/UID ternaries used different key names in each file). This is a
 * pure read on every call — it does not own or mutate any state, so it does
 * not replace stateful values like the panel's local `isMeetingHost` (set by
 * host-transfer); it only centralizes read-only identity derivation.
 *
 * callType: 1 = one-to-one, 2 = group, 3 = meeting video. Mirrors the
 * `callTypeID`/`CallType` localStorage values already in use; meeting video
 * is inferred from `isMeetingVideo` rather than a literal callType of 3,
 * since nothing in the codebase currently writes CallType/callTypeID as 3.
 */
export const useCallTypeContext = () => {
  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag,
  );
  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag,
  );
  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag,
  );

  const callTypeID = Number(localStorage.getItem("callTypeID"));
  const isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
  const isMeetingVideoHostCheck = JSON.parse(
    localStorage.getItem("isMeetingVideoHostCheck"),
  );
  const meetingHostInfo = JSON.parse(localStorage.getItem("meetinHostInfo"));

  const roomID = localStorage.getItem("acceptedRoomID");
  const newRoomID = localStorage.getItem("newRoomId");
  const isGuid = localStorage.getItem("isGuid");
  const participantRoomId = localStorage.getItem("participantRoomId");
  const participantUID = localStorage.getItem("participantUID");
  const callerID = Number(localStorage.getItem("callerID"));
  const callerGuid = localStorage.getItem("callerGuid");
  const recepientGuid = localStorage.getItem("receipentGuid");
  const groupCallRoomId = localStorage.getItem("groupCallRoomId");

  const isPresenter = Boolean(presenterViewFlag);
  const isPresenterHost = Boolean(presenterViewFlag && presenterViewHostFlag);
  const isPresenterJoin = Boolean(presenterViewFlag && presenterViewJoinFlag);
  const isGroup = callTypeID === 2;
  const isMeeting = Boolean(isMeetingVideo);
  const isOneToOne = !isGroup && !isMeeting;

  const callType = isMeeting ? 3 : isGroup ? 2 : 1;

  const isHost = Boolean(meetingHostInfo?.isHost);

  const roomId = isGroup
    ? groupCallRoomId
    : isPresenter && (presenterViewHostFlag || presenterViewJoinFlag)
      ? roomID
      : isMeetingVideoHostCheck
        ? newRoomID
        : participantRoomId;

  const uid = isGroup
    ? callerID !== 0
      ? callerGuid
      : recepientGuid
    : isPresenter && presenterViewJoinFlag && !presenterViewHostFlag
      ? participantUID
      : isMeetingVideoHostCheck
        ? isGuid
        : participantUID;

  return {
    callType,
    isOneToOne,
    isGroup,
    isMeetingVideo: isMeeting,
    isPresenter,
    isPresenterHost,
    isPresenterJoin,
    isHost,
    roomId,
    uid,
  };
};
