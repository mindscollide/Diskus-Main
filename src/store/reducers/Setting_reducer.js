import * as actions from "../action_types";

const initialState = {
  UserProfileData: null,
  ResponseMessage: "",
  ResponseCode: "",
  Loading: false,
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
  GetUserDetailsResponse: null,
  GetUserDetailsResponseMessege: "",
  UpdateUserProfileResponse: null,
  UpdateUserProfileResponseMessege: "",
  recentActivityDataFromMQTT: [],
  microsoftToken: null,
  microsftRevokeToken: null,
  diskusWebNotificationData: null,
  diskusNotificationMarkAsRead: null,
  realTimeNotificationCountGlobalData: null,
  realTimeIsReadFlag: false,
};

const settingReducer = (state = initialState, action) => {
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
        Loading: action.loader ? action.loader : false,
        UserProfileData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETSETTING_FAIL: {
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
          let newrdata = {
            creationDateTime: notification.creationDateTime,
            notificationTypes: notification.notificationTypes,
          };
          return { ...newrdata, key: index };
        });

      return {
        ...state,
        Spinner: false,
        NotificationData: newNotificationData,
        RecentActivityData: newRNotificationData,
        ResponseMessage: action.message,
      };
    }
    case actions.SET_RECENT_ACTIVITY_NOTIFICATION: {
      return {
        ...state,
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
        ResponseMessage: action.message,
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
    case actions.GET_USERS_DETAILS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_USERS_DETAILS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetUserDetailsResponse: action.response,
        GetUserDetailsResponseMessege: action.message,
      };
    }

    case actions.GET_USERS_DETAILS_FAIL: {
      return {
        ...state,
        Loading: false,
        GetUserDetailsResponse: null,
        GetUserDetailsResponseMessege: action.message,
      };
    }

    case actions.UPDATE_USER_PROFILE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.UPDATE_USER_PROFILE_SUCCESS: {
      return {
        ...state,
        // Loading:false,
        UpdateUserProfileResponse: action.response,
        UpdateUserProfileResponseMessege: action.message,
      };
    }

    case actions.UPDATE_USER_PROFILE_FAIL: {
      return {
        ...state,
        Loading: false,
        UpdateUserProfileResponse: null,
        UpdateUserProfileResponseMessege: action.message,
      };
    }
    case actions.UDPATEUSERSETTING_MESSAGE_CLEARE: {
      return {
        ...state,
        UpdateUserSettingResponseMessage: "",
        ResponseMessage: "",
        UpdateOrganizationLevelSettingResponseMessage: "",
        GetOrganizationLevelSettingResponseMessage: "",
        UpdateResponseMessage: "",
        GetUserDetailsResponseMessege: "",
        UpdateUserProfileResponseMessege: "",
      };
    }
    case actions.RECENT_ACTIVITYDATA_MQTT: {
      return {
        ...state,
        recentActivityDataFromMQTT: [],
      };
    }
    case actions.GOOGLEVALIDTOKEN_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GOOGLEVALIDTOKEN_SUCCESS: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GOOGLEVALIDTOKEN_FAIL: {
      return {
        ...state,
        Loading: true,
        message: action.message,
      };
    }
    case actions.REVOKETOKEN_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.REVOKETOKEN_SUCCESS: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.REVOKETOKEN_FAIL: {
      return {
        ...state,
        Loading: true,
        message: action.message,
      };
    }

    case actions.MICROSOFT_VALIDATE_TOKEN_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.MICROSOFT_VALIDATE_TOKEN_SUCCESS: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.MICROSOFT_VALIDATE_TOKEN_FAIL: {
      return {
        ...state,
        Loading: true,
        message: action.message,
      };
    }
    case actions.REVOKE_TOKEN_MICROSOFT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.REVOKE_TOKEN_MICROSOFT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        microsftRevokeToken: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.REVOKE_TOKEN_MICROSOFT_FAIL: {
      return {
        ...state,
        Loading: false,
        microsftRevokeToken: action.response,
        ResponseMessage: action.message,
      };
    }

    //Diskus Web Notifications
    case actions.DISKUS_WEB_NOTIFICATION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DISKUS_WEB_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        diskusWebNotificationData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DISKUS_WEB_NOTIFICATION_FAIL: {
      return {
        ...state,
        Loading: false,
        diskusWebNotificationData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.DISKUS_WEB_NOTIFICATION_MARKASREAD_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.DISKUS_WEB_NOTIFICATION_MARKASREAD_SUCCESS: {
      return {
        ...state,
        Loading: false,
        diskusNotificationMarkAsRead: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.DISKUS_WEB_NOTIFICATION_MARKASREAD_FAIL: {
      return {
        ...state,
        Loading: false,
        diskusNotificationMarkAsRead: null,
        ResponseMessage: action.message,
      };
    }

    case actions.REAL_TIME_UNREAD_NOTIFICATION_COUNT: {
      return {
        ...state,
        realTimeNotificationCountGlobalData: action.response,
      };
    }

    default:
      return {
        ...state,
      };
  }
};
export default settingReducer;
