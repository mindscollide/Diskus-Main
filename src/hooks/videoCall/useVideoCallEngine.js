import { useEffect, useState } from "react";
import { useMeetingContext } from "../../context/MeetingContext";

/**
 * Call-type-agnostic video call mechanics — the iframe surface, the
 * postMessage send helpers (mic/camera), and the receive-listener
 * scaffolding for the handful of iframe events that behave identically no
 * matter what kind of call this is. Ported from the shared
 * videoCallNormalPanel.js (~2500 lines, handles all 4 call types via
 * internal branches) so a call-type-specific component (starting with
 * OneToOneCallPanel) doesn't have to reimplement this plumbing.
 *
 * Deliberately does NOT include: participant roster, recording control
 * gating, host-transfer, presenter-view room switching, or any of the
 * meeting/group/presenter-specific postMessage handler bodies (e.g.
 * ScreenSharedMsgFromIframe's meeting/presenter forks) — those stay in the
 * call-type-specific component that composes this hook.
 */
export const useVideoCallEngine = () => {
  const { iframeRef, mic, setMic, camera, setCamera } = useMeetingContext();
  const [callerURL, setCallerURL] = useState("");

  // Re-sync mic/camera from localStorage on mount — this component tree
  // mounts fresh each time the call-type router picks it, unlike
  // videoCallNormalPanel.js (which stays mounted for the whole app session
  // and therefore only ever seeds this once). Without this, a new call
  // could inherit stale mic/camera state left over from a previous one.
  useEffect(() => {
    setMic(JSON.parse(localStorage.getItem("MicOff")));
    setCamera(JSON.parse(localStorage.getItem("VidOff")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Forces mic/camera to a muted/off state without waiting for a toggle
  // click — used by leave/end-call cleanup, mirroring leaveSuccess()'s
  // setIsMicActive(true) in the shared header.
  const resetMicCamera = () => {
    setMic(true);
    setCamera(true);
    localStorage.setItem("MicOff", true);
    localStorage.setItem("VidOff", true);
  };

  const sendToIframe = (message) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, "*");
    }
  };

  const toggleMic = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    const isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
    if (isZoomEnabled) {
      if (mic) {
        setMic(false);
        localStorage.setItem("MicOff", false);
        iframe.contentWindow.postMessage("MicOn", "*");
      } else {
        setMic(true);
        localStorage.setItem("MicOff", true);
        iframe.contentWindow.postMessage("MicOff", "*");
      }
    } else {
      iframe.contentWindow.postMessage(mic ? "MicOff" : "MicOn", "*");
      setMic(!mic);
      localStorage.setItem("MicOff", !mic);
    }
  };

  const toggleCamera = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    const isZoomEnabled = JSON.parse(localStorage.getItem("isZoomEnabled"));
    if (isZoomEnabled) {
      if (camera) {
        setCamera(false);
        localStorage.setItem("VidOff", false);
        iframe.contentWindow.postMessage("VidOn", "*");
      } else {
        setCamera(true);
        localStorage.setItem("VidOff", true);
        iframe.contentWindow.postMessage("VidOff", "*");
      }
    } else {
      iframe.contentWindow.postMessage(camera ? "VidOff" : "VidOn", "*");
      setCamera(!camera);
      localStorage.setItem("VidOff", !camera);
    }
  };

  // Clean up on unmount — the iframe session itself; call-type-specific
  // components add their own beforeunload/leave-call cleanup on top.
  useEffect(() => {
    return () => {
      sendToIframe("leaveSession");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    iframeRef,
    callerURL,
    setCallerURL,
    mic,
    camera,
    toggleMic,
    toggleCamera,
    resetMicCamera,
    sendToIframe,
  };
};

/**
 * Validates that a generated call URL actually carries a usable room
 * identifier — ported as-is from videoCallNormalPanel.js's local
 * validateRoomID, which every URL-building effect in this codebase checks
 * before accepting a newly built URL.
 */
export const validateRoomID = (input) => {
  try {
    const urlString = String(input);
    const url = new URL(urlString);
    const params = new URLSearchParams(url.search);
    if (params.get("sessionKey")) return true;
    const roomID = String(
      params.get("RoomID") || params.get("roomid"),
    ).trim();
    return /^\d+$/.test(roomID) && parseInt(roomID, 10) > 0;
  } catch {
    return false;
  }
};
