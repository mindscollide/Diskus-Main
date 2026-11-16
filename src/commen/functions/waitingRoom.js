import { meetingApi } from "../apis/Api_ends_points";
import {
  leaveMeetingVideoWaitingRoom,
  leavePresentationWaitingRoom,
} from "../apis/Api_config";
import { isUsableVideoId } from "./videoCallIds";

const KEY = "waitingRoomState";

export const setWaitingRoomState = (state) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
};

export const clearWaitingRoomState = () => {
  try {
    sessionStorage.removeItem(KEY);
    // A pending auto-join marker must not outlive the waiting room
    sessionStorage.removeItem("presentationAutoJoin");
  } catch {}
};

// Waiting state of this tab (optionally of one type), only for the current meeting
export const getWaitingRoomState = (type) => {
  try {
    const state = JSON.parse(sessionStorage.getItem(KEY));
    if (!state || (type && state.type !== type)) return null;
    // A waiting room only exists inside the meeting it was requested for
    if (
      Number(state.meetingID) !== Number(localStorage.getItem("currentMeetingID"))
    ) {
      return null;
    }
    return state;
  } catch {
    return null;
  }
};

// Request method + body of the matching leave-waiting-room API, null if ids are missing
export const buildWaitingRoomLeaveRequest = (state) => {
  if (!state || !isUsableVideoId(state.guid)) return null;
  if (state.type === "presentation") {
    if (!isUsableVideoId(state.roomID)) return null;
    return {
      requestMethod: leavePresentationWaitingRoom.RequestMethod,
      data: {
        RoomID: String(state.roomID),
        MeetingID: Number(state.meetingID),
        UserGUID: String(state.guid),
      },
    };
  }
  return {
    requestMethod: leaveMeetingVideoWaitingRoom.RequestMethod,
    data: {
      VideoCallURL: String(localStorage.getItem("videoCallURL")),
      MeetingID: Number(state.meetingID),
      UserGUID: String(state.guid),
    },
  };
};

// Tab close / refresh: keepalive fetch survives the unload, returns true if a leave was sent
export const sendWaitingRoomLeaveOnUnload = () => {
  const request = buildWaitingRoomLeaveRequest(getWaitingRoomState());
  if (!request) return false;
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const form = new FormData();
    form.append("RequestMethod", request.requestMethod);
    form.append("RequestData", JSON.stringify(request.data));
    fetch(meetingApi, {
      method: "POST",
      headers: { _token: token },
      body: form,
      keepalive: true,
    });
    clearWaitingRoomState();
    return true;
  } catch {
    return false;
  }
};
