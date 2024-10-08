import * as actions from "../action_types";

const initialState = {
  RealTImeNotificationRecentActivity: [],
};

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
