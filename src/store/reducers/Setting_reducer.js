import * as actions from "../action_types";

const initialState = {
  UserProfileData: null,
  ResponseMessage: "",
  ResponseCode: "",
  Loading: true,
  Spinner: false,
  NotificationData: [],
  RecentActivityData: [],
  SocketRecentActivityData: [],
  CountryCodes: null,
  CountryCodeResponse: "",
  TimeZone: null,
  TimeZoneResponse: "",
  UpdateResponseMessage: "",
  UpdateResponse: "",
  UpdateSuccessfull: false,
  GetOrganizationLevelSettingResponse: null,
  GetOrganizationLevelSettingResponseMessage: "",
  UpdateOrganizationLevelSettingResponse: null,
  UpdateOrganizationLevelSettingResponseMessage: "",
  UpdateUserSettingResponse: null,
  UpdateUserSettingResponseMessage: "",
};

const settingReducer = (state = initialState, action) => {
  console.log("setting reducer 2", state);
  switch (action.type) {
    case actions.GETSETTING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETSETTING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        UserProfileData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETSETTING_FAIL: {
      console.log("settingFail", action);
      return {
        ...state,
        Loading: false,
        UserProfileData: null,
      };
    }
    case actions.UPDATEUSERPROFILE_INIT: {
      return {
        ...state,
        Loading: true,
        UpdateSuccessfull: false,
      };
    }
    case actions.UPDATEUSERPROFILE_SUCCESS: {
      console.log("update user profile success action", action);
      return {
        ...state,
        // Loading: false,
        UpdateSuccessfull: true,
        UpdateResponseMessage: action.message,
      };
    }

    case actions.UPDATEUSERPROFILE_FAIL: {
      return {
        ...state,
        Loading: false,
        UpdateSuccessfull: true,
        UpdateResponseMessage: action.message,
      };
    }
    case actions.UPDATEUSERNOTIFICATION_INIT: {
      return {
        ...state,
        Loading: true,
        UpdateSuccessfull: false,
      };
    }
    case actions.UPDATEUSERNOTIFICATION_SUCCESS: {
      console.log("update user notification success state", state);
      console.log("update user notification success action", action);
      return {
        ...state,
        // Loading: false,
        UpdateSuccessfull: true,
        UpdateResponseMessage: action.message,
      };
    }
    case actions.UPDATEUSERNOTIFICATION_FAIL: {
      return {
        ...state,
        Loading: false,
        UpdateSuccessfull: true,
        UpdateResponseMessage: action.message,
      };
    }
    case actions.UPDATEUSERGENERALSETTING_INIT: {
      return {
        ...state,
        Loading: true,
        UpdateSuccessfull: false,
      };
    }
    case actions.UPDATEUSERGENERALSETTING_SUCCESS: {
      console.log("update user General Setting success action", action);
      console.log("update user General Setting success state", state);
      return {
        ...state,
        // Loading: false,
        UpdateSuccessfull: true,
        UpdateResponseMessage: action.message,
      };
    }
    case actions.UPDATEUSERGENERALSETTING_FAIL: {
      return {
        ...state,
        Loading: false,
        UpdateSuccessfull: true,
        UpdateResponseMessage: action.message,
      };
    }
    case actions.GETUSERNOTIFICATION_INIT: {
      return {
        ...state,
        // Loading: true,
        Spinner: true,
      };
    }
    case actions.GETUSERNOTIFICATION_SUCCESS: {
      let newNotificationData =
        action.response.notification !== null &&
        action.response.notification.map((notification, index) => {
          return { ...notification, key: index };
        });
      let newRNotificationData =
        newNotificationData !== null &&
        newNotificationData.map((notification, index) => {
          console.log("newNotificationDataas", notification);
          let newrdata = {
            creationDateTime: notification.creationDateTime,
            notificationTypes: notification.notificationTypes,
          };
          return { ...newrdata, key: index };
        });
      console.log("newNotificationData", newRNotificationData);
      return {
        ...state,
        Spinner: false,
        NotificationData: newNotificationData,
        RecentActivityData: newRNotificationData,
        ResponseMessage: action.message,
      };
    }
    case actions.SETRECENTACTIVITYNOTIFICATION: {
      console.log("recentActivityData", action.response);
      return {
        ...state,
        Spinner: false,
        SocketRecentActivityData: action.response,
      };
    }
    case actions.GETUSERNOTIFICATION_FAIL: {
      return {
        ...state,
        // Loading: false,
        Spinner: false,
        NotificationData: [],
        RecentActivityData: [],
        ResponseMessage: "",
      };
    }
    case actions.GET_TIMEZONE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_TIMEZONE_SUCCESS: {
      return {
        ...state,
        // Loading: false,
        TimeZone: action.response,
        TimeZoneResponse: action.message,
      };
    }
    case actions.GET_TIMEZONE_FAIL: {
      return {
        ...state,
        Loading: false,
        TimeZoneResponse: action.message,
      };
    }
    case actions.GET_COUNTRYCODE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_COUNTRYCODE_SUCCESS: {
      console.log("country code success", action);
      return {
        ...state,
        // Loading: false,
        CountryCodeResponse: action.message,
        CountryCodes: action.response,
      };
    }
    case actions.GET_COUNTRYCODE_FAIL: {
      return {
        ...state,
        Loading: false,
        CountryCodeResponse: action.message,
      };
    }

    case actions.HIDE:
      return {
        ...state,
        ResponseMessage: "",
        CountryCodeResponse: "",
        UpdateResponseMessage: "",
      };
    case actions.GETORGANIZATIONLEVELSETTING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETORGANIZATIONLEVELSETTING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetOrganizationLevelSettingResponse: action.response,
        GetOrganizationLevelSettingResponseMessage: action.message,
      };
    }
    case actions.GETORGANIZATIONLEVELSETTING_FAIL: {
      return {
        ...state,
        Loading: false,
        GetOrganizationLevelSettingResponse: null,
        GetOrganizationLevelSettingResponseMessage: action.message,
      };
    }
    case actions.UPDATEORGANIZATIONLEVELSETTING_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATEORGANIZATIONLEVELSETTING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        // UpdateOrganizationLevelSettingResponse: action.response,
        UpdateOrganizationLevelSettingResponse: action.message,
      };
    }
    case actions.UPDATEORGANIZATIONLEVELSETTING_FAIL: {
      return {
        ...state,
        Loading: false,
        UpdateOrganizationLevelSettingResponse: null,
        UpdateOrganizationLevelSettingResponseMessage: action.message,
      };
    }
    case actions.UDPATEUSERSETTING_INIT: {
      return {
        ...state,
        Loading: true,
        UpdateUserSettingResponse: "",
        UpdateUserSettingResponseMessage: "",
      };
    }
    case actions.UDPATEUSERSETTING_SUCCESS: {
      return {
        ...state,
        Loading: false,
        UpdateUserSettingResponse: action.response,
        UpdateUserSettingResponseMessage: action.message,
      };
    }
    case actions.UDPATEUSERSETTING_FAIL: {
      return {
        ...state,
        Loading: false,
        UpdateUserSettingResponse: null,
        UpdateUserSettingResponseMessage: action.message,
      };
    }
    default:
      return {
        ...state,
      };
  }
};
export default settingReducer;
