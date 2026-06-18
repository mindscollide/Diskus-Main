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

const ignoredMessages = new Set([
  "no record found",
  "no records found",
  "record found",
  "record updated",
  "no record updated",
  "success",
  "data available",
  "Record save",
  "No Data available",
  "Successful",
]);

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

  // Select all watched message/severity pairs from the Redux store.
  // The custom equality function prevents re-renders when the message strings
  // haven't changed (avoids new-array-reference churn on every render).
  const { messageKey, values } = useSelector(
    (state) => {
      const values = watchConfigs.map((cfg) => ({
        message: cfg.selector(state) || "",
        severity: cfg.severitySelector
          ? cfg.severitySelector(state) || "success"
          : cfg.severity || "success",
      }));
      return { messageKey: values.map((v) => v.message).join("||"), values };
    },
    (a, b) => a.messageKey === b.messageKey,
  );

  const prevRef = useRef([]);

  useEffect(() => {
    // Fire the snackbar only when a message transitions from empty → non-empty
    // (avoids re-firing the same message on unrelated re-renders)
    let didShow = false;
    values.forEach(({ message, severity }, i) => {
      const prevMessage = prevRef.current[i]?.message.toLowerCase() ?? "";

      if (
        message &&
        message !== prevMessage &&
        !ignoredMessages.has(message.trim().toLowerCase())
      ) {
        show(message, severity);
        didShow = true;
      }
    });
    prevRef.current = values;

    // Clear all ResponseMessage / errorSeverity fields in the store once
    // the message has been consumed so it doesn't re-trigger on re-renders.
    if (didShow) {
      dispatch({ type: CLEAR_RESPONSE_MESSAGE });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageKey]);

  const SnackBar = <Notification open={snackState} setOpen={setSnackState} />;

  return [show, SnackBar];
};

export default useSnackbar;
