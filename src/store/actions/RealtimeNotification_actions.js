/**
 * @file RealtimeNotification_actions.js
 * @description Lightweight Redux action for pushing real-time MQTT activity data
 * into the notification store.
 * Dispatches: RECENT_ACTIVITYDATA_MQTT.
 */
import * as actions from "../action_types";

const realtimeNotificationRecent = (response) => {
  return {
    type: actions.RECENT_ACTIVITYDATA_MQTT,
    response: response,
  };
};

export { realtimeNotificationRecent };
