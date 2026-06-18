import { useState, useEffect, useRef, useCallback } from "react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Notification from "./index";
import { CLEAR_RESPONSE_MESSAGE } from "../../../store/action_types";

/**
 * useSnackbar
 *
 * Bundles snackbar state, auto-watching of Redux ResponseMessage fields,
 * and the Notification JSX into a single hook.
 *
 * @param {Array} watchConfigs - Optional list of reducer fields to watch.
 *   Each entry:
 *   {
 *     selector:         (state) => state.SomeReducer.ResponseMessage,   // required
 *     severity:         "success" | "error" | "warning" | "info",       // optional, default "success"
 *     severitySelector: (state) => state.SomeReducer.errorSeverity,     // optional, overrides severity
 *   }
 *
 * @returns {[notify, SnackBar]}
 *   notify(message, severity?) — manually trigger a toast
 *   SnackBar                   — JSX element to place anywhere in the return
 *
 * @example — watch reducer messages automatically
 *   const [notify, SnackBar] = useSnackbar([
 *     { selector: (state) => state.MeetingAgendaReducer.ResponseMessage },
 *     { selector: (state) => state.MinutesReducer.ResponseMessage, severity: "error" },
 *     {
 *       selector:         (state) => state.DataRoomReducer.ResponseMessage,
 *       severitySelector: (state) => state.DataRoomReducer.errorSeverity,
 *     },
 *   ]);
 *
 * @example — manual only (no watchConfigs)
 *   const [notify, SnackBar] = useSnackbar();
 *   notify("Saved!", "success");
 */

const ignoredMessages = new Set(
  [
    "no record found",
    "no records found",
    "record found",
    "record updated",
    "no record updated",
    "success",
    "data available",
    "record save",
    "no data available",
    "record saved",
  ].map((m) => m.toLowerCase().trim()),
);

const useSnackbar = (watchConfigs = []) => {
  const dispatch = useDispatch();

  const [snackState, setSnackState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const show = useCallback((message, severity = "success") => {
    if (!message) return;

    setSnackState({ open: true, message, severity });

    setTimeout(() => {
      setSnackState((prev) => ({ ...prev, open: false }));
    }, 3000);
  }, []);

  const { messageKey, values } = useSelector(
    (state) => {
      const values = watchConfigs.map((cfg) => ({
        message: cfg.selector(state) || "",
        severity: cfg.severitySelector
          ? cfg.severitySelector(state) || "success"
          : cfg.severity || "success",
      }));

      const messageKey = values
        .map((v) => `${v.message}:${v.severity}`)
        .join("||");

      return { messageKey, values };
    },
    (a, b) => a.messageKey === b.messageKey,
  );

  // Tracks the last-shown "message:severity" key PER watched config (by index).
  // Unlike a Map keyed by message text (which persisted forever and blocked any
  // repeat of the same message), these entries are reset to "" once
  // CLEAR_RESPONSE_MESSAGE empties the reducer — so the SAME message
  // (e.g. "Committee Updated") can be shown again on a repeat action.
  const prevRef = useRef([]);

  useEffect(() => {
    let didShow = false;
    const shownThisRun = new Set();

    values.forEach(({ message, severity }, i) => {
      const normalized = message?.toLowerCase().trim();
      const currentKey = message ? `${normalized}:${severity}` : "";

      if (
        message &&
        !ignoredMessages.has(normalized) &&
        currentKey !== prevRef.current[i] &&
        !shownThisRun.has(currentKey)
      ) {
        show(message, severity);
        shownThisRun.add(currentKey);
        didShow = true;
      }

      // Always sync to the current value (including "" after a clear) so the
      // next identical message is treated as new and shows again.
      prevRef.current[i] = currentKey;
    });

    if (didShow) {
      dispatch({ type: CLEAR_RESPONSE_MESSAGE });
    }
  }, [messageKey, dispatch, show, values]);

  const SnackBar = <Notification open={snackState} setOpen={setSnackState} />;

  return [show, SnackBar];
};

export default useSnackbar;
