import * as actions from "../action_types";
import axios from "axios";
import { getCommitteesApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import {
  //   CreateCommittee,
  getCommitteesByUserID,
  getallOrganizationCommitteType,
  getallOrganizationCommitteMemberRole,
  createCommitteeRequestMethod,
  getCommitteeByIdRequestMethod,
  updateCommitteeStatusRequestMethod,
  updateCommitteeRequestMethod,
  CommitteeAndGroupMappingRequestMethod,
} from "../../commen/apis/Api_config";

const getallcommitteesbyuserid_init = () => {
  return {
    type: actions.GET_ALL_COMMITTEES_BY_USERID_INIT,
  };
};

const getallcommitteesbyuserid_success = (response, message) => {
  return {
    type: actions.GET_ALL_COMMITTEES_BY_USERID_SUCCESS,
    response: response,
    message: message,
  };
};

const getallcommitteebyuserid_fail = (message) => {
  return {
    type: actions.GET_ALL_COMMITTEES_BY_USERID_FAIL,
    message: message,
  };
};

const getAllCommitteesByUserIdActions = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = localStorage.getItem("organizationID");
  let UserID = localStorage.getItem("userID");
  let Data = {
    UserId: parseInt(UserID),
    OrganizationID: JSON.parse(OrganizationID),
  };
  return (dispatch) => {
    dispatch(getallcommitteesbyuserid_init());
    let form = new FormData();
    form.append("RequestMethod", getCommitteesByUserID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllCommitteesByUserIdActions(navigate, t));
        } else if (response.data.responseCode === 200) {
          console.log("checking");
          if (response.data.responseResult.isExecuted === true) {
            console.log("checking");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteesByUserID_01".toLowerCase()
                )
            ) {
              dispatch(
                getallcommitteesbyuserid_success(
                  response.data.responseResult.committees,
                  t("Data-available")
                )
              );

              console.log("checking");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteesByUserID_02".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));

              console.log("checking");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteesByUserID_03".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteesByUserID_04".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteesByUserID_05".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));
            }
          } else {
            dispatch(getallcommitteebyuserid_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getallcommitteebyuserid_fail(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(getallcommitteebyuserid_fail(t("Something-went-wrong")));
        console.log("responseresponse", response);
      });
  };
};

const getallcommitteebyuserid_clear = () => {
  return {
    type: actions.CLEAR_MESSAGE_RESPONSE_COMMITTEE,
  };
};

const getCommitteByCommitteeID_Init = () => {
  return {
    type: actions.GET_COMMITTEE_BYCOMMITTEEID_INIT,
  };
};
const getCommitteByCommitteeID_Success = (response, message) => {
  return {
    type: actions.GET_COMMITTEE_BYCOMMITTEEID_SUCCESS,
    response: response,
    message: message,
  };
};
const getCommitteByCommitteeID_Fail = (message) => {
  return {
    type: actions.GET_COMMITTEE_BYCOMMITTEEID_FAIL,
    message: message,
  };
};

const getCommitteesbyCommitteeId = (
  navigate,
  Data,
  t,
  setViewGroupPage,
  setUpdateComponentpage,
  CommitteeStatusID,
  setArchivedCommittee
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getCommitteByCommitteeID_Init());
    let form = new FormData();
    form.append("RequestMethod", getCommitteeByIdRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(
          "getAllCommitteesByUserIdActionsgetAllCommitteesByUserIdActions",
          response
        );
        console.log("checking");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getCommitteesbyCommitteeId(
              navigate,
              Data,
              t,
              setViewGroupPage,
              setUpdateComponentpage,
              CommitteeStatusID,
              setArchivedCommittee
            )
          );
        } else if (response.data.responseCode === 200) {
          console.log("checking");
          if (response.data.responseResult.isExecuted === true) {
            console.log("checking");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_01".toLowerCase()
                )
            ) {
              dispatch(
                getCommitteByCommitteeID_Success(
                  response.data.responseResult.committee,
                  t("Data-available")
                )
              );
              if (CommitteeStatusID === 1) {
                setViewGroupPage(true);
                setUpdateComponentpage(false);
              } else if (CommitteeStatusID === 2) {
                setUpdateComponentpage(false);
                setArchivedCommittee(false);
                setViewGroupPage(true);
              } else if (CommitteeStatusID === 3) {
                setUpdateComponentpage(true);
                setViewGroupPage(false);
              }
              console.log("checking");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_02".toLowerCase()
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_03".toLowerCase()
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_04".toLowerCase()
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_05".toLowerCase()
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(t("No-data-available")));
            }
          } else {
            dispatch(getCommitteByCommitteeID_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getCommitteByCommitteeID_Fail(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(getCommitteByCommitteeID_Fail(t("Something-went-wrong")));
        console.log("responseresponse", response);
      });
  };
};
const createcommittee_init = () => {
  return {
    type: actions.CREATE_COMMITTEE_INIT,
  };
};

const createcommittee_success = (response, message) => {
  return {
    type: actions.CREATE_COMMITTEE_SUCCESS,
    response: response,
    message: message,
  };
};

const createcommittee_fail = (message) => {
  return {
    type: actions.CREATE_COMMITTEE_FAIL,
    message: message,
  };
};

const createcommittee = (navigate, Data, t, setCreategrouppage) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(createcommittee_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", createCommitteeRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(createcommittee(navigate, Data, t, setCreategrouppage));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_01".toLowerCase()
                )
            ) {
              await dispatch(
                createcommittee_success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
              await setCreategrouppage(false);
              await dispatch(getAllCommitteesByUserIdActions(navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_02".toLowerCase()
                )
            ) {
              dispatch(createcommittee_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_03".toLowerCase()
                )
            ) {
              dispatch(createcommittee_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_04".toLowerCase()
                )
            ) {
              dispatch(createcommittee_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_05".toLowerCase()
                )
            ) {
              dispatch(createcommittee_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_06".toLowerCase()
                )
            ) {
              dispatch(createcommittee_fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(createcommittee_fail(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(createcommittee_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(createcommittee_fail(t("Something-went-wrong")));
      });
  };
};

const getCommitteeTypes_Init = () => {
  return {
    type: actions.GET_ALL_COMMITTEE_TYPES_INIT,
  };
};
const getCommitteeTypes_Success = (response, message) => {
  return {
    type: actions.GET_ALL_COMMITTEE_TYPES_SUCCESS,
    response: response,
    message: message,
  };
};
const getCommitteeTypes_Fail = (message) => {
  return {
    type: actions.GET_ALL_COMMITTEE_TYPES_FAIL,
    message: message,
  };
};
const getCommitteeTypes = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getCommitteeTypes_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getallOrganizationCommitteType.RequestMethod);
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getCommitteeTypes(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteType_01".toLowerCase()
                )
            ) {
              await dispatch(
                getCommitteeTypes_Success(
                  response.data.responseResult.committeeTypes,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteType_02".toLowerCase()
                )
            ) {
              dispatch(getCommitteeTypes_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteType_03".toLowerCase()
                )
            ) {
              dispatch(getCommitteeTypes_Fail(t("No-data-available")));
            } else {
              console.log(response, "response");
              dispatch(getCommitteeTypes_Fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(getCommitteeTypes_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(getCommitteeTypes_Fail(t("Something-went-wrong")));
      });
  };
};

const getCommitteeMembersRole_Init = () => {
  return {
    type: actions.GET_COMMITTEE_MEMBERS_ROLES_INIT,
  };
};
const getCommitteeMembersRole_Success = (response, message) => {
  return {
    type: actions.GET_COMMITTEE_MEMBERS_ROLES_SUCCESS,
    response: response,
    message: message,
  };
};
const getCommitteeMembersRole_Fail = (message) => {
  return {
    type: actions.GET_COMMITTEE_MEMBERS_ROLES_FAIL,
    message: message,
  };
};
const getCommitteeMembersRole = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getCommitteeMembersRole_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      getallOrganizationCommitteMemberRole.RequestMethod
    );
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getCommitteeMembersRole(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_01".toLowerCase()
                )
            ) {
              await dispatch(
                getCommitteeMembersRole_Success(
                  response.data.responseResult.committeeMemberRoles,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_02".toLowerCase()
                )
            ) {
              dispatch(getCommitteeMembersRole_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_03".toLowerCase()
                )
            ) {
              dispatch(getCommitteeMembersRole_Fail(t("No-data-available")));
            } else {
              console.log(response, "response");
              dispatch(getCommitteeMembersRole_Fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(getCommitteeMembersRole_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(getCommitteeMembersRole_Fail(t("Something-went-wrong")));
      });
  };
};
const updateCommitteeStatus_Init = () => {
  return {
    type: actions.UPDATE_COMMITTEE_STATUS_INIT,
  };
};
const updateCommitteeStatus_Success = (response, message) => {
  return {
    type: actions.UPDATE_COMMITTEE_STATUS_SUCCESS,
    response: response,
    message: message,
  };
};
const updateCommitteeStatus_Fail = (message) => {
  return {
    type: actions.UPDATE_COMMITTEE_STATUS_FAIL,
    message: message,
  };
};
const committeeStatusUpdate = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(updateCommitteeStatus_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      updateCommitteeStatusRequestMethod.RequestMethod
    );
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(committeeStatusUpdate(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommitteeStatus_01".toLowerCase()
                )
            ) {
              await dispatch(
                updateCommitteeStatus_Success(
                  response.data.responseResult.committeeMemberRoles,
                  t("Record-updated")
                )
              );
              dispatch(getAllCommitteesByUserIdActions(navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommitteeStatus_02".toLowerCase()
                )
            ) {
              dispatch(updateCommitteeStatus_Fail(t("No-record-updated")));
            } else {
              console.log(response, "response");
              dispatch(updateCommitteeStatus_Fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(updateCommitteeStatus_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(updateCommitteeStatus_Fail(t("Something-went-wrong")));
      });
  };
};
const updatecommittee_Init = () => {
  return {
    type: actions.UPDATE_COMMITTEE_INIT,
  };
};
const updateCommittee_Success = (response, message) => {
  return {
    type: actions.UPDATE_COMMITTEE_SUCCESS,
    response: response,
    message: message,
  };
};
const updateCommittee_Fail = (message) => {
  return {
    type: actions.UPDATE_COMMITTEE_FAIL,
    message: message,
  };
};
const updateCommittee = (navigate, Data, t, setUpdateComponentpage) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(updatecommittee_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", updateCommitteeRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateCommittee(navigate, Data, t, setUpdateComponentpage));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_01".toLowerCase()
                )
            ) {
              await dispatch(
                updateCommittee_Success(
                  response.data.responseResult,
                  t("Committee-update")
                )
              );
              await setUpdateComponentpage(false);
              await dispatch(getAllCommitteesByUserIdActions(navigate, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_02".toLowerCase()
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_03".toLowerCase()
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_04".toLowerCase()
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_05".toLowerCase()
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_06".toLowerCase()
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else {
              console.log(response, "response");
              dispatch(updateCommittee_Fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(updateCommittee_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(updateCommittee_Fail(t("Something-went-wrong")));
      });
  };
};

const realtimeCommitteeResponse = (response) => {
  return {
    type: actions.REALTIME_COMMITTEES_RESPONSE,
    response: response,
  };
};
const realtimeCommitteeStatusResponse = (response) => {
  return {
    type: actions.REALTIME_COMMITTEES_STATUS_RESPONSE,
    response: response,
  };
};
const assignGroup_Init = () => {
  return {
    type: actions.COMMITTEE_GROUP_MAPPING_INIT,
  };
};
const assignGroup_Success = (message) => {
  return {
    type: actions.COMMITTEE_GROUP_MAPPING_SUCCESS,
    message: message,
  };
};
const assignGroup_Failt = (message) => {
  return {
    type: actions.COMMITTEE_GROUP_MAPPING_FAIL,
    message: message,
  };
};
const assignGroups = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(assignGroup_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      CommitteeAndGroupMappingRequestMethod.RequestMethod
    );
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(assignGroups(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Committees_CommitteeServiceManager_CommitteeAndGroupMapping_01".toLowerCase()
            ) {
              dispatch(assignGroup_Success(t("Record-save")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Committees_CommitteeServiceManager_CommitteeAndGroupMapping_02".toLowerCase()
            ) {
              dispatch(assignGroup_Failt(t("No-record-save")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Committees_CommitteeServiceManager_CommitteeAndGroupMapping_03".toLowerCase()
            ) {
              dispatch(assignGroup_Failt(t("Something-went-wrong")));
            }
            console.log(response, "response");
          } else {
            console.log(response, "response");
            dispatch(assignGroup_Failt(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(assignGroup_Failt(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(assignGroup_Failt(t("Something-went-wrong")));
      });
  };
};
export {
  getAllCommitteesByUserIdActions,
  getallcommitteebyuserid_clear,
  getCommitteeTypes,
  getCommitteeMembersRole,
  createcommittee,
  getCommitteesbyCommitteeId,
  committeeStatusUpdate,
  updateCommittee,
  realtimeCommitteeResponse,
  realtimeCommitteeStatusResponse,
  assignGroups,
};
