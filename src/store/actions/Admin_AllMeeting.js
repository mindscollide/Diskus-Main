import { AllMeetingOrganization, deleteOrganizationMeeting, OrganizationMeetingStatus } from "../../commen/apis/Api_config";
import * as actions from "../action_types";
import axios from "axios"
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";

const allMeetingInit = () => {
  return {
    type: actions.ADMIN_ALLMEETING_INIT,

  };
};

const allMeetingSuccess = (response, message) => {
  return {
    type: actions.ADMIN_ALLMEETING_SUCCESS,
    response: response,
    message: message,
  };
};

const allMeetingFail = (response, message) => {
  return {
    type: actions.ADMIN_ALLMEETING_FAIL,
    response: response,
    message: message,
  };
};

const OrganizationMeetings = (navigate, t) => {
  let userID = localStorage.getItem("userID");
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationId = localStorage.getItem("organizationID")
  let data = { OrganizationID: parseInt(organizationId), RequestingUserID: parseInt(userID) }

  return (dispatch) => {
    dispatch(allMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", AllMeetingOrganization.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
        } else if (response.data.responseResult.isExecuted === true) {
          if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_AllOrganizationMeetings_01") {
            await dispatch(allMeetingSuccess(response.data.responseResult.meetings, t("You-are-not-an-admin-Please-contact-support")))
          } else if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_AllOrganizationMeetings_02") {
            await dispatch(allMeetingSuccess(response.data.responseResult.meetings, t("Data-Available")))
          } else if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_AllOrganizationMeetings_03") {
            await dispatch(allMeetingSuccess(response.data.responseResult.meetings, t("No-Data-available-against-this-Organization")))
          } else if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_AllOrganizationMeetings_04") {
            await dispatch(allMeetingSuccess(response.data.responseResult.meetings, t("No-Data-available-against-this-Organization")))
          }
        } else {

        }
      })
      .catch((response) => {
        dispatch(allMeetingFail(response.data.responseResult.responseMessage))
      });
  };
}

const updateOrganizationMeetingInit = () => {
  return {
    type: actions.UPDATEORGANIZTIONMEETING_INIT
  }
}
const updateOrganizationMeetingSuccess = (response, message) => {
  return {
    type: actions.UPDATEORGANIZTIONMEETING_SUCCESS,
    response: response,
    message: message
  }
}
const updateOrganizationMeetingFail = (message) => {
  return {
    type: actions.UPDATEORGANIZTIONMEETING_FAIL,
    message: message
  }
}
const updateOrganizationMeeting = () => {
  let userID = localStorage.getItem("userID");
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationId = localStorage.getItem("organizationID")

  let data = {
    OrganizationID: parseInt(organizationId),
    RequestingUserID: parseInt(userID),
    MeetingID: 901,
    MeetingStatusID: 1
  }
  return (async (dispatch) => {
    dispatch(updateOrganizationMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", OrganizationMeetingStatus.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then((response) => {

      })
      .catch((response) => {
      });
  })
}

const deleteOrganizationMeetingInit = () => {
  return {
    type: actions.DELETEORGANIZATIONMEETING_INIT
  }
}
const deleteOrganizationMeetingSuccess = (response, message) => {
  return {
    type: actions.DELETEORGANIZATIONMEETING_SUCCESS,
    response: response,
    message: message
  }
}
const deleteOrganizationMeetingFail = (message) => {
  return {
    type: actions.DELETEORGANIZATIONMEETING_FAIL,
    message: message
  }
}
const deleteOrganiationMessage = (meetingID, MeetingStatusID, t) => {
  console.log(meetingID, MeetingStatusID, "datadatadata")
  let userID = localStorage.getItem("userID");
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationId = localStorage.getItem("organizationID")
  let data = {
    OrganizationID: parseInt(organizationId),
    RequestingUserID: parseInt(userID),
    MeetingID: parseInt(meetingID),
    MeetingStatusID: parseInt(MeetingStatusID)
  }
  return (dispatch) => {
    dispatch(deleteOrganizationMeetingInit());
    let form = new FormData();
    form.append("RequestMethod", deleteOrganizationMeeting.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response)
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
        } else if (response.data.responseResult.isExecuted === true) {
          if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_DeleteOrganizationMeeting_01") {
            dispatch(deleteOrganizationMeetingFail(t("You-are-not-an-admin-Please-contact-support")))
          } else if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_DeleteOrganizationMeeting_02") {
            dispatch(deleteOrganizationMeetingSuccess(response.data.responseResult, t("Meeting-Deleted-Successfully")))
            dispatch(OrganizationMeetings())
          } else if (response.data.responseResult.responseMessage === "Admin_AdminServiceManager_DeleteOrganizationMeeting_03") {
            dispatch(deleteOrganizationMeetingFail(t("Meeting-not-Deleted-Successfully")))
          }

        }
      })
      .catch((response) => {
        console.log(response)
      });
  };
}
export { deleteOrganiationMessage, OrganizationMeetings, updateOrganizationMeeting };