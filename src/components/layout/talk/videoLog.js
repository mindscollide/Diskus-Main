/**
 * Video-calling error log.
 *
 * Every video error goes to `console.error` with one fixed prefix, so a tester
 * can type `[VideoLog]` into the DevTools console filter and see only these.
 * The Zoom iframe app logs with the same prefix ("[Zoom]" instead of
 * "[Diskus]"), and Chrome shows the iframe's console in the same place, so one
 * filter covers both apps.
 *
 * `console.error` is used because it is the one level disableConsole.js keeps
 * in production builds. This file lives under components/layout/talk, which
 * remove-consoles.js skips, so the logging survives that script too.
 */
const PREFIX = "[VideoLog]";

export const logVideoError = (source, message, details) => {
  try {
    console.error(
      `${PREFIX} ${new Date().toISOString()} [Diskus] [${source}] ${message}`,
      details ?? "",
    );
  } catch {
    // Logging must never break the call flow.
  }
};

// Backend methods that belong to 1:1/group calls, meeting video, presenter
// view and guest video. Their failures are logged by the axios interceptor.
const VIDEO_REQUEST_METHODS = new Set([
  "ServiceManager.AdmitRejectAttendee",
  "ServiceManager.AdmitRejectPresentationAttendee",
  "ServiceManager.CallRequestReceived",
  "ServiceManager.DownloadCallRecording",
  "ServiceManager.GetGroupCallParticipants",
  "ServiceManager.GetMeetingGuestVideoURL",
  "ServiceManager.GetMeetingVideoURL",
  "ServiceManager.GetMeetingVideoURLNew",
  "ServiceManager.GetPresentationParticipants",
  "ServiceManager.GetUserMissedCallCount",
  "ServiceManager.GetUserRecetCalls",
  "ServiceManager.GetVideoCallParticipants",
  "ServiceManager.GetVideoCallParticipantsAndWaitingList",
  "ServiceManager.GetVideoCallStatus",
  "ServiceManager.GuestLeaveMeetingVideo",
  "ServiceManager.HideUnHideParticpantVideo",
  "ServiceManager.HideUnHideVideo",
  "ServiceManager.InitiateVideoCall",
  "ServiceManager.IsSharedScreen",
  "ServiceManager.JoinGuestVideo",
  "ServiceManager.JoinMeetingVideoRequest",
  "ServiceManager.JoinPresentationRequest",
  "ServiceManager.JoinPresenterView",
  "ServiceManager.LeaveCall",
  "ServiceManager.LeaveMeetingVideo",
  "ServiceManager.LeavePresenterView",
  "ServiceManager.MuteUnMuteParticpant",
  "ServiceManager.MuteUnMuteSelf",
  "ServiceManager.OpenPresenterView",
  "ServiceManager.RaiseUnRaiseHand",
  "ServiceManager.RemoveParticipantFromMeeting",
  "ServiceManager.RemoveParticipantFromPresentation",
  "ServiceManager.StartPresenterView",
  "ServiceManager.StopPresenterView",
  "ServiceManager.TransferMeetingHost",
  "ServiceManager.ValidateEncryptedStringGuestVideoLink",
  "ServiceManager.VideoCallResponse",
]);

// Result codes that a successful (200, isExecuted) response can still carry to
// mean the action failed. Only codes documented as failures are listed; most
// methods signal failure through responseCode/isExecuted, caught generically.
const FAILURE_MESSAGE_SUFFIXES = {
  "ServiceManager.JoinMeetingVideoRequest": ["_03", "_04", "_05"],
  "ServiceManager.StartPresenterView": ["_03"],
};

const getRequestMethod = (config) => {
  const data = config?.data;
  if (data instanceof FormData) return data.get("RequestMethod");
  if (typeof data === "string") {
    try {
      return JSON.parse(data)?.RequestMethod;
    } catch {
      return undefined;
    }
  }
  return data?.RequestMethod;
};

const getRequestData = (config) => {
  const data = config?.data;
  return data instanceof FormData ? data.get("RequestData") : undefined;
};

/**
 * Called from the axios interceptors for every response. Logs it if it is a
 * video request that failed. `error` is set for network/HTTP failures.
 */
export const logVideoApiResponse = (config, body, error) => {
  try {
    const method = getRequestMethod(config);
    if (!method || !VIDEO_REQUEST_METHODS.has(method)) return;
    const request = getRequestData(config);

    if (error) {
      logVideoError("API", `${method} request failed: ${error.message}`, {
        status: error.response?.status,
        response: body,
        request,
      });
      return;
    }

    const code = Number(body?.responseCode);
    // 417 = expired token; every thunk refreshes it and retries on its own.
    if (code === 417) return;
    const result = body?.responseResult;
    const message = result?.responseMessage || "";
    const knownFailure = (FAILURE_MESSAGE_SUFFIXES[method] || []).some((suffix) =>
      message.endsWith(suffix),
    );
    if (code !== 200 || result?.isExecuted === false || knownFailure) {
      logVideoError(
        "API",
        `${method} failed: responseCode ${body?.responseCode}${message ? `, ${message}` : ""}`,
        { response: body, request },
      );
    }
  } catch {
    // Logging must never break the call flow.
  }
};
