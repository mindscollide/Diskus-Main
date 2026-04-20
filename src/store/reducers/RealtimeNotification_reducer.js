/**
 * @file RealtimeNotification_reducer.js
 * @description Redux reducer for the `realtimeNotification` slice. Stores
 * recent-activity data pushed via MQTT for display in the notification feed.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {Array} RealTImeNotificationRecentActivity - Recent-activity entries received via MQTT.
 */
const initialState = {
  RealTImeNotificationRecentActivity: [],
};

/**
 * Reducer for the `realtimeNotification` slice.
 * Stores recent-activity items arriving over MQTT for the notification panel.
 *
 * @param {object} state  - Current realtimeNotification state.
 * @param {{ type: string, response?: * }} action - Dispatched action.
 * @returns {object} Next state.
 */
const RealtimeNotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.RECENT_ACTIVITYDATA_MQTT:
      return {
        ...state,
        RealTImeNotificationRecentActivity: action.response,
      };
    default:
      return { ...state };
  }
};

export default RealtimeNotificationReducer;
