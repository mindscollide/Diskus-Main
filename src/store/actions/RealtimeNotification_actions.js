import * as actions from "../action_types";

const realtimeNotificationRecent = (response) => {
  return {
    type: actions.RECENT_ACTIVITYDATA_MQTT,
    response: response,
  };
};

export { realtimeNotificationRecent };
