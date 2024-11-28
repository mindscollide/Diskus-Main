import * as actions from "../action_types";

const initialState = {
  Loading: false,
  FullLoader: false,
  ResponseMessage: "",
  VideoCallUsersData: [],
  InitiateVideoCallData: [],
  VideoCallResponseData: [],
  VideoRecipentData: {},
  InitiateVideoCallDataMQTT: [],
  VideoCallAcceptedData: [],
  RecentCallsData: [],
  CallRequestReceivedData: [],
  CallRequestReceivedMQTTData: {},
  MissedCallCountData: {},
  MissedCallCountMqttData: {},
  ScrollBehavior: false,
  LeaveCallResponse: {},
  GroupCallRecipientsData: [],
  LeaveVideoIntimationMessegeGlobalState: false,
};

const VideoMainReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ALL_VIDEOCALL_USERS_INITIAL: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_VIDEOCALL_USERS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        VideoCallUsersData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_VIDEOCALL_USERS_FAIL: {
      return {
        ...state,
        Loading: false,
        VideoCallUsersData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.INITIATE_VIDEO_CALL_INITIAL: {
      return {
        ...state,
        FullLoader: true,
      };
    }

    case actions.INITIATE_VIDEO_CALL_SUCCESS: {
      localStorage.setItem("initiateCallRoomID", action.response.roomID);
      return {
        ...state,
        FullLoader: false,
        InitiateVideoCallData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.INITIATE_VIDEO_CALL_FAIL: {
      return {
        ...state,
        FullLoader: false,
        InitiateVideoCallData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.INCOMING_VIDEO_CALL_MQTT: {
      return {
        ...state,
        InitiateVideoCallDataMQTT: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.VIDEO_CALL_RESPONSE_INITIAL: {
      return {
        ...state,
        Loading: false,
      };
    }

    case actions.VIDEO_CALL_RESPONSE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        VideoCallResponseData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.VIDEO_CALL_RESPONSE_FAIL: {
      return {
        ...state,
        Loading: false,
        VideoCallResponseData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.GET_VIDEO_RECIPENT_DATA: {
      return {
        ...state,
        VideoRecipentData: action.response,
      };
    }

    case actions.INCOMING_VIDEO_CALL_ACCEPTED_MQTT: {
      localStorage.setItem("acceptedRecipientID", action.response.recepientID);
      localStorage.setItem("acceptedRoomID", action.response.roomID);
      localStorage.setItem("activeRoomID", action.response.roomID);

      return {
        ...state,
        VideoCallAcceptedData: action.response,
      };
    }

    case actions.GET_ALL_RECENTCALLS_INITIAL: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_RECENTCALLS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        RecentCallsData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_ALL_RECENTCALLS_FAIL: {
      return {
        ...state,
        Loading: false,
        RecentCallsData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.CALL_REQUEST_RECEIVED_INITIAL: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.CALL_REQUEST_RECEIVED_SUCCESS: {
      return {
        ...state,
        Loading: false,
        CallRequestReceivedData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.CALL_REQUEST_RECEIVED_FAIL: {
      return {
        ...state,
        Loading: false,
        CallRequestReceivedData: [],
        ResponseMessage: action.message,
      };
    }

    case actions.CALL_REQUEST_RECEIVED_MQTT: {
      return {
        ...state,
        Loading: false,
        CallRequestReceivedMQTTData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MISSED_CALL_COUNT_INITIAL: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_MISSED_CALL_COUNT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        MissedCallCountData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_MISSED_CALL_COUNT_FAIL: {
      return {
        ...state,
        Loading: false,
        CallRequestReceivedData: {},
        ResponseMessage: action.message,
      };
    }
    case actions.SCROLL_BEHAVIOR_SPINNER: {
      return {
        ...state,
        ScrollBehavior: action.response,
      };
    }

    case actions.LEAVE_CALL_ACTION: {
      return {
        ...state,
        LeaveCallResponse: action.message,
      };
    }

    case actions.MISSED_CALL_COUNT_MQTT: {
      return {
        ...state,
        MissedCallCountMqttData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.GROUP_CALL_RECIPIENTS: {
      return {
        ...state,
        GroupCallRecipientsData: action.response,
      };
    }

    case actions.INTIMATION_MESSEGE_LEAVE_MEETING_VIDEO: {
      return {
        ...state,
        LeaveVideoIntimationMessegeGlobalState: action.response,
      };
    }

    default:
      return { ...state };
  }
};

export default VideoMainReducer;
