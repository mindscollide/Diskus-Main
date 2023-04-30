import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ShowNotification: false,
  Fail: false,
  Spinner: false,
  ResponseMessage: "",
  AllMeetingIdData: [],
  TotalMeetingCountThisWeek: 0,
  TotalNumberOfUpcommingMeetingsInWeek: 0,
  MeetingTableData: false,
  UpcomingEventsData: [],
  allMeetingsSocketData: [],
  MeetingStatusSocket: [],
  searchRecordFound: false,

};

//Get meetingreducer

const meetingIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_LOADER_TRUE:
      return { ...state, Loading: true };

    case actions.SET_LOADER_FALSE:
      return { ...state, Loading: false };

    case actions.SET_SPINNER_TRUE:
      return { ...state, Spinner: true };

    case actions.SET_SPINNER_FALSE:
      return { ...state, Spinner: false };

    case actions.SHOW:
      return {
        ...state,
        ShowNotification: true,
        ResponseMessage: action.message,
      };

    case actions.GET_MEETINGUSERID_INIT:
      return {
        ...state,
        Loading: true,
        searchRecordFound: false,
        MeetingTableData: true,
        AllMeetingIdData: [],
      };

    case actions.ALL_MEETINGS_SOCKET: {
      console.log("allMeetingsSocket", action.response);
      // let GetAllMeetingSocketIdArray = action.response.map((item, index) => {
      //   return { ...item, key: index };
      // });
      return {
        ...state,
        allMeetingsSocketData: action.response,
      };
    }

    // STATUS SOCKET
    case actions.MEETING_STATUS_SOCKET: {
      return {
        ...state,
        MeetingStatusSocket: action.response,
      };
    }

    case actions.GET_MEETINGUSERID_SUCCESS:
      let GetAllMeetinIdArray = action.response.map((item, index) => {
        return { ...item, key: index };
      });
      return {
        ...state,
        searchRecordFound: false,
        Loading: false,
        MeetingTableData: false,
        ResponseMessage: action.message,
        AllMeetingIdData: GetAllMeetinIdArray,
        ShowNotification: true,
      };

    case actions.GET_MEETINGUSERID_FAIL:
      return {
        ...state,
        AllMeetingIdData: [],
        Loading: false,
        MeetingTableData: false,
        ResponseMessage: action.message,
        // ResponseMessage:
        //   action.response.responseMessage !== undefined
        //     ? action.response.responseMessage
        //     : action.response.responseMessage,
        ShowNotification: true,
        searchRecordFound: false,
      };

    case actions.GET_MEETINGCOUNT_SUCCESS:
      return {
        ...state,
        // Loading: false,
        Spinner: false,
        ResponseMessage: action.message,
        TotalMeetingCountThisWeek:
          action.response.totalNumberOfMeetingsThisWeek,
        TotalNumberOfUpcommingMeetingsInWeek:
          action.response.totalNumberOfUpcommingMeetingsInWeek,
        ShowNotification: true,
      };
    case actions.RECENT_MEETINGCOUNTER:
      return {
        ...state,
        TotalMeetingCountThisWeek:
          action.response.totalNumberOfMeetingsThisWeek,
        TotalNumberOfUpcommingMeetingsInWeek:
          action.response.totalNumberOfUpcommingMeetingsInWeek,
      }
    case actions.GET_MEETINGCOUNT_FAIL:
      return {
        ...state,
        // Loading: false,
        Spinner: false,
        TotalMeetingCountThisWeek: 0,
        TotalNumberOfUpcommingMeetingsInWeek: 0,
        ResponseMessage: action.message,
        // action.response.responseMessage !== undefined
        //   ? action.response.responseMessage
        //   : action.response.responseMessage,
        ShowNotification: true,
      };

    case actions.GET_UPCOMINGEVENTS_SUCCESS:
      console.log("GET_UPCOMINGEVENTS_SUCCESS", action);
      let GetUpcomingEventsArray = action.response.upcomingEvents.map(
        (item, index) => {
          return { ...item, key: index };
        }
      );
      console.log("GET_UPCOMINGEVENTS_SUCCESS", GetUpcomingEventsArray);

      return {
        ...state,
        Spinner: false,
        MeetingTableData: false,
        // ResponseMessage: action.response.responseMessage,
        UpcomingEventsData: GetUpcomingEventsArray,
        ShowNotification: true,
      };

    case actions.GET_UPCOMINGEVENTS_FAIL:
      return {
        ...state,
        Spinner: false,
        // ResponseMessage:
        //   action.response.responseMessage !== undefined
        //     ? action.response.responseMessage
        //     : action.response.responseMessage,
        ShowNotification: true,
        UpcomingEventsData: [],
      };
    case actions.MEETINGID_RESPONSE_MESSAGE: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }
    case actions.SEARCH_MEETING_RESPONSE: {
      return {
        ...state,
        searchRecordFound: true,
      };
    }
    case actions.UPCOMINGEVENTS_MQTT: {
      console.log("NEW_UPCOMING123",action.response)
      let newEvent = [...state.UpcomingEventsData]
      if (Object.keys(state.UpcomingEventsData).length > 0) {
        if (Object.keys(action.response).length > 0) {
          newEvent.unshift(action.response)
        }
      }
      console.log("NEW_UPCOMING123",newEvent)

      return {
        ...state,
        UpcomingEventsData: newEvent
      }
    }
    case actions.HIDE: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }

    default:
      return { ...state };
  }
};

export default meetingIdReducer;
