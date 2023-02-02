import {
  AllMeetingOrganization,
  deleteOrganizationMeeting,
  getMeetingStatus,
  OrganizationMeetingStatus,
} from "../../commen/apis/Api_config";
import * as actions from "../action_types";
import axios from "axios";
import { getAdminURLs, meetingApi } from "../../commen/apis/Api_ends_points";
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
  let organizationId = localStorage.getItem("organizationID");
  let data = {
    OrganizationID: parseInt(organizationId),
    RequestingUserID: parseInt(userID),
  };

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
          dispatch(OrganizationMeetings(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AllOrganizationMeetings_01".toLowerCase()
                )
            ) {
              await dispatch(
                allMeetingSuccess(
                  response.data.responseResult.meetings,
                  t("You-are-not-an-admin-Please-contact-support")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AllOrganizationMeetings_02".toLowerCase()
                )
            ) {
              await dispatch(
                allMeetingSuccess(
                  response.data.responseResult.meetings,
                  t("Data-Available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AllOrganizationMeetings_03".toLowerCase()
                )
            ) {
              await dispatch(
                allMeetingSuccess(
                  response.data.responseResult.meetings,
                  t("No-Data-available-against-this-Organization")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_AllOrganizationMeetings_04".toLowerCase()
                )
            ) {
              await dispatch(
                allMeetingSuccess(
                  response.data.responseResult.meetings,
                  t("No-Data-available-against-this-Organization")
                )
              );
            }
          } else {
            console.log("something");
            dispatch(allMeetingFail(t("something-went-worng")));
          }
        } else {
          console.log("something");

          dispatch(allMeetingFail(t("something-went-worng")));
        }
      })
      .catch((response) => {
        console.log("something");

        dispatch(allMeetingFail(t("something-went-worng")));
      });
  };
};

const updateOrganizationMeetingInit = () => {
  return {
    type: actions.UPDATEORGANIZTIONMEETING_INIT,
  };
};

const updateOrganizationMeetingSuccess = (response, message) => {
  return {
    type: actions.UPDATEORGANIZTIONMEETING_SUCCESS,
    response: response,
    message: message,
  };
};

const updateOrganizationMeetingFail = (message) => {
  return {
    type: actions.UPDATEORGANIZTIONMEETING_FAIL,
    message: message,
  };
};

const updateOrganizationMeeting = (MeetingID, MeetingStatusID, t, navigate) => {
  let userID = localStorage.getItem("userID");
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationId = localStorage.getItem("organizationID");

  let data = {
    OrganizationID: parseInt(organizationId),
    RequestingUserID: parseInt(userID),
    MeetingID: MeetingID,
    MeetingStatusID: MeetingStatusID,
  };
  console.log(data, MeetingID, MeetingStatusID, "meetingudpateData");
  return async (dispatch) => {
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
      .then(async (response) => {
        console.log(response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_OrganizationMeetingStatusUpdate_01".toLowerCase()
              )
          ) {
            dispatch(
              updateOrganizationMeetingFail(
                t("You-are-not-an-admin-Please-contact-support")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_OrganizationMeetingStatusUpdate_02".toLowerCase()
              )
          ) {
            dispatch(
              updateOrganizationMeetingSuccess(
                response.data.responseResult,
                t("Meeting-Updated")
              )
            );
            dispatch(OrganizationMeetings(navigate, t));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_OrganizationMeetingStatusUpdate_03".toLowerCase()
              )
          ) {
            dispatch(
              updateOrganizationMeetingFail(t("Failed-to-update-Meeting"))
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_OrganizationMeetingStatusUpdate_04".toLowerCase()
              )
          ) {
            dispatch(
              updateOrganizationMeetingFail(t("Failed-to-update-Meeting"))
            );
          }
        } else {
          dispatch(
            updateOrganizationMeetingFail(t("Failed-to-update-Meeting"))
          );
        }
      })
      .catch((response) => {
        dispatch(updateOrganizationMeetingFail(t("Failed-to-update-Meeting")));
      });
  };
};

const deleteOrganizationMeetingInit = () => {
  return {
    type: actions.DELETEORGANIZATIONMEETING_INIT,
  };
};

const deleteOrganizationMeetingSuccess = (response, message) => {
  return {
    type: actions.DELETEORGANIZATIONMEETING_SUCCESS,
    response: response,
    message: message,
  };
};

const deleteOrganizationMeetingFail = (message) => {
  return {
    type: actions.DELETEORGANIZATIONMEETING_FAIL,
    message: message,
  };
};

const deleteOrganiationMessage = (meetingID, MeetingStatusID, t, navigate) => {
  console.log(meetingID, MeetingStatusID, "datadatadata");
  let userID = localStorage.getItem("userID");
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationId = localStorage.getItem("organizationID");
  let data = {
    OrganizationID: parseInt(organizationId),
    RequestingUserID: parseInt(userID),
    MeetingID: parseInt(meetingID),
    MeetingStatusID: parseInt(MeetingStatusID),
  };
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
        console.log(response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_DeleteOrganizationMeeting_01".toLowerCase()
              )
          ) {
            dispatch(
              deleteOrganizationMeetingFail(
                t("You-are-not-an-admin-Please-contact-support")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_DeleteOrganizationMeeting_02".toLowerCase()
              )
          ) {
            dispatch(
              deleteOrganizationMeetingSuccess(
                response.data.responseResult,
                t("Meeting-Deleted-Successfully")
              )
            );
            dispatch(OrganizationMeetings(navigate, t));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_DeleteOrganizationMeeting_03".toLowerCase()
              )
          ) {
            dispatch(
              deleteOrganizationMeetingFail(
                t("Meeting-not-Deleted-Successfully")
              )
            );
          }
        }
      })
      .catch((response) => {
        console.log(response);
      });
  };
};

const getMeetingStatusInit = () => {
  return {
    type: actions.ADMIN_MEETINGSTATUS_INIT,
  };
};

const getMeetingStatusSuccess = (response, message) => {
  return {
    type: actions.ADMIN_MEETINGSTATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const getMeetingStatusFail = (message) => {
  return {
    type: actions.ADMIN_MEETINGSTATUS_FAIL,
    message: message,
  };
};

const GetMeetingStatus = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(getMeetingStatusInit());
    let form = new FormData();
    form.append("RequestMethod", getMeetingStatus.RequestMethod);
    axios({
      method: "post",
      url: meetingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(GetMeetingStatus(t));
        } else if (response.data.responseResult.isExecuted === true) {
          if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_GetMeetingStatus_01".toLowerCase()
              )
          ) {
            await dispatch(
              getMeetingStatusSuccess(
                response.data.responseResult.meetingStatus,
                t("Record-found")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_GetMeetingStatus_02".toLowerCase()
              )
          ) {
            await dispatch(getMeetingStatusFail(t("No-records-found")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Meeting_MeetingServiceManager_GetMeetingStatus_03".toLowerCase()
              )
          ) {
            await dispatch(getMeetingStatusFail(t("something-went-worng")));
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Admin_AdminServiceManager_AllOrganizationMeetings_04".toLowerCase()
              )
          ) {
            await dispatch(getMeetingStatusFail(t("something-went-worng")));
          }
        } else {
        }
      })
      .catch((response) => {
        dispatch(getMeetingStatusFail(t("something-went-worng")));
      });
  };
};
export {
  deleteOrganiationMessage,
  OrganizationMeetings,
  updateOrganizationMeeting,
  GetMeetingStatus,
};
