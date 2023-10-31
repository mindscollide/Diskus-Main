import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";

import { getGroupsApi } from "../../commen/apis/Api_ends_points";
import {
  getGroupsByUserIdRequestMethod,
  getAllOrganizationGroups,
  getGroupsByGroupIdRequestMethod,
  creategroupRequestMethod,
  updateGroupStatusRequestMethod,
  getAllOrganizationGroupRoles,
  getAllOrganizationGroupTypes,
  updateGroupRequestMethod,
  CreateUpdateGroupDataRoadMap,
} from "../../commen/apis/Api_config";
import axios from "axios";
import { Data } from "emoji-mart";

const clearMessagesGroup = () => {
  return {
    type: actions.CLEAR_MESSAGE_RESPONSE_COMMITTEE,
  };
};
const getGroup_Init = () => {
  return {
    type: actions.GET_GROUPS_BYUSERID_INIT,
  };
};

const getGroup_Success = (response, message) => {
  return {
    type: actions.GET_GROUPS_BYUSERID_SUCCESS,
    response: response,
    message: message,
  };
};

const getGroup_Fail = (message) => {
  return {
    type: actions.GET_GROUPS_BYUSERID_FAIL,
    message: message,
  };
};

const getGroups = (navigate, t, currentPage) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  // let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"))
  let Data = {
    UserID: JSON.parse(createrID),
    OrganizationID: JSON.parse(OrganizationID),
    Title: "",
    PageNumber: currentPage,
    Length: 8,
    Status: 0,
  };

  return (dispatch) => {
    dispatch(groupLoader(true));
    // dispatch(getArchivedGroups_init())
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getGroupsByUserIdRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getGroupsApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          await dispatch(getGroups(navigate, t, currentPage));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_01".toLowerCase()
                )
            ) {
              dispatch(groupLoader(false));
              // if (id === 1) {
              //   dispatch(getArchivedGroups_success(
              //     response.data.responseResult,
              //     t("Data-available")))
              // } else {
              dispatch(
                getGroup_Success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
              // }
              console.log(response, "response");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_02".toLowerCase()
                )
            ) {
              dispatch(getGroup_Fail(t("No-data-available")));
              dispatch(groupLoader(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_03".toLowerCase()
                )
            ) {
              dispatch(getGroup_Fail(t("No-data-available")));
              dispatch(groupLoader(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_04".toLowerCase()
                )
            ) {
              dispatch(getGroup_Fail(t("No-data-available")));
              dispatch(groupLoader(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_05".toLowerCase()
                )
            ) {
              dispatch(getGroup_Fail(t("No-data-available")));
              dispatch(groupLoader(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_06".toLowerCase()
                )
            ) {
              dispatch(getGroup_Fail(t("Something-went-wrong")));
              dispatch(groupLoader(false));
              console.log(response, "response");
            }
          } else {
            console.log(response, "response");
            dispatch(getGroup_Fail(t("Something-went-wrong")));
            dispatch(groupLoader(false));
          }
        } else {
          console.log(response, "response");
          dispatch(getGroup_Fail(t("Something-went-wrong")));
          dispatch(groupLoader(false));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(getGroup_Fail(t("Something-went-wrong")));
        dispatch(groupLoader(false));
      });
  };
};

const groupLoader = (action) => {
  console.log(action, "groupLoadergroupLoadergroupLoader");
  return {
    type: actions.GROUP_LOADER_STATE,
    response: action,
  };
};
const getArchivedGroups_init = () => {
  return {
    type: actions.ARCHEIVED_GROUPS_INIT,
  };
};
const getArchivedGroups_success = (response, message) => {
  return {
    type: actions.ARCHEIVED_GROUPS_SUCCESS,
    response: response,
    message: message,
  };
};
const getArchivedGroups_fail = (message) => {
  return {
    type: actions.ARCHEIVED_GROUPS_FAIL,
    message: message,
  };
};

const getArcheivedGroups = (navigate, t, currentPage) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  // let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"))
  let Data = {
    UserID: JSON.parse(createrID),
    OrganizationID: JSON.parse(OrganizationID),
    Title: "",
    PageNumber: currentPage,
    Length: 8,
    Status: 1,
  };

  return (dispatch) => {
    dispatch(getArchivedGroups_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getGroupsByUserIdRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getGroupsApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          await dispatch(getArcheivedGroups(navigate, t, currentPage));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_01".toLowerCase()
                )
            ) {
              dispatch(
                getArchivedGroups_success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_02".toLowerCase()
                )
            ) {
              dispatch(getArchivedGroups_fail(t("No-data-available")));
              // dispatch(groupLoader(false))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_03".toLowerCase()
                )
            ) {
              dispatch(getArchivedGroups_fail(t("No-data-available")));
              // dispatch(groupLoader(false))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_04".toLowerCase()
                )
            ) {
              dispatch(getArchivedGroups_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_05".toLowerCase()
                )
            ) {
              dispatch(getArchivedGroups_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_06".toLowerCase()
                )
            ) {
              dispatch(getArchivedGroups_fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(getArchivedGroups_fail(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(getArchivedGroups_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(getArchivedGroups_fail(t("Something-went-wrong")));
      });
  };
};

const getbyGroupID_Init = () => {
  return {
    type: actions.GET_GROUPS_BYGROUPID_INIT,
  };
};
const getbyGroupID_Success = (response, message) => {
  return {
    type: actions.GET_GROUPS_BYGROUPID_SUCCESS,
    response: response,
    message: message,
  };
};
const getbyGroupID_Fail = (message) => {
  return {
    type: actions.GET_GROUPS_BYGROUPID_FAIL,
    message: message,
  };
};
const getbyGroupID = (
  navigate,
  GroupId,
  t,
  setViewGroupPage,
  setUpdateComponentpage,
  no,
  setArchivedGroups
) => {
  console.log(no, "getbyGroupIDgetbyGroupIDgetbyGroupIDgetbyGroupID");
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    GroupID: JSON.parse(GroupId),
    OrganizationID: JSON.parse(OrganizationID),
  };
  return (dispatch) => {
    dispatch(getbyGroupID_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getGroupsByGroupIdRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getGroupsApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          await dispatch(
            getbyGroupID(
              navigate,
              GroupId,
              t,
              setViewGroupPage,
              setUpdateComponentpage,
              no,
              setArchivedGroups
            )
          );
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetGroupByGroupID_01".toLowerCase()
                )
            ) {
              dispatch(
                getbyGroupID_Success(
                  response.data.responseResult.group,
                  t("Data-available")
                )
              );
              console.log(response, "response12123123");
              if (no === 1) {
                setViewGroupPage(true);
                setUpdateComponentpage(false);
              } else if (no === 2) {
                setArchivedGroups(false);
                setViewGroupPage(true);
                setUpdateComponentpage(false);
              } else if (no === 3) {
                setUpdateComponentpage(true);
                setViewGroupPage(false);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetGroupByGroupID_02".toLowerCase()
                )
            ) {
              dispatch(getbyGroupID_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetGroupByGroupID_03".toLowerCase()
                )
            ) {
              dispatch(getbyGroupID_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetGroupByGroupID_04".toLowerCase()
                )
            ) {
              dispatch(getbyGroupID_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetGroupByGroupID_05".toLowerCase()
                )
            ) {
              dispatch(getbyGroupID_Fail(t("No-data-available")));
            }
          } else {
            console.log(response, "response");
            dispatch(getbyGroupID_Fail(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(getbyGroupID_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(getbyGroupID_Fail(t("Something-went-wrong")));
      });
  };
};

const createGroup_Init = () => {
  return {
    type: actions.CREATE_GROUP_INIT,
  };
};
const createGroup_Success = (response, message) => {
  return {
    type: actions.CREATE_GROUP_SUCCESS,
    response: response,
    message: message,
  };
};
const createGroup_Fail = (message) => {
  return {
    type: actions.CREATE_GROUP_FAIL,
    message: message,
  };
};
const createGroup = (navigate, Data, t, setCreategrouppage) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(createGroup_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", creategroupRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getGroupsApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(createGroup(navigate, Data, t, setCreategrouppage));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_CreateNewGroup_01".toLowerCase()
                )
            ) {
              await dispatch(
                createGroup_Success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
              let newData = {
                GroupID: response.data.responseResult.groupID,
                GroupTitle: Data.GroupDetails.title,
                IsUpdateFlow: false,
                GroupMembers: Data.GroupMembers.map(
                  (data, index) => data.FK_UID
                ),
              };
              console.log({ newData }, "CreateUpdateDataRoadMapApiFunc");
              dispatch(CreateUpdateDataRoadMapApiFunc(navigate, newData, t));
              // dispatch(getGroups(navigate, t, currentPage));
              // setCreategrouppage(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_CreateNewGroup_02".toLowerCase()
                )
            ) {
              dispatch(createGroup_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_CreateNewGroup_03".toLowerCase()
                )
            ) {
              dispatch(createGroup_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_CreateNewGroup_04".toLowerCase()
                )
            ) {
              dispatch(createGroup_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_CreateNewGroup_05".toLowerCase()
                )
            ) {
              dispatch(createGroup_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_CreateNewGroup_06".toLowerCase()
                )
            ) {
              dispatch(createGroup_Fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(createGroup_Fail(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(createGroup_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(createGroup_Fail(t("Something-went-wrong")));
      });
  };
};

const getOrganiationGroupRoles_Init = () => {
  return {
    type: actions.GET_GROUP_MEMBERS_ROLES_INIT,
  };
};
const getOrganiationGroupRoles_Success = (response, message) => {
  return {
    type: actions.GET_GROUP_MEMBERS_ROLES_SUCCESS,
    response: response,
    message: message,
  };
};
const getOrganiationGroupRoles_Fail = (message) => {
  return {
    type: actions.GET_GROUP_MEMBERS_ROLES_FAIL,
    message: message,
  };
};

const getGroupMembersRoles = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getOrganiationGroupRoles_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllOrganizationGroupRoles.RequestMethod);
    axios({
      method: "post",
      url: getGroupsApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getGroupMembersRoles(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetAllOrganizationGroupRoles_01".toLowerCase()
                )
            ) {
              await dispatch(
                getOrganiationGroupRoles_Success(
                  response.data.responseResult.groupRoles,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetAllOrganizationGroupRoles_02".toLowerCase()
                )
            ) {
              dispatch(getOrganiationGroupRoles_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetAllOrganizationGroupRoles_03".toLowerCase()
                )
            ) {
              dispatch(getOrganiationGroupRoles_Fail(t("No-data-available")));
            } else {
              console.log(response, "response");
              dispatch(
                getOrganiationGroupRoles_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            console.log(response, "response");
            dispatch(getOrganiationGroupRoles_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(getOrganiationGroupRoles_Fail(t("Something-went-wrong")));
      });
  };
};

const getOrganizationGroupTypes_Init = () => {
  return {
    type: actions.GET_GROUP_ORGANIZATION_TYPE_INIT,
  };
};
const getOrganizationGroupTypes_Success = (response, message) => {
  return {
    type: actions.GET_GROUP_ORGANIZATION_TYPE_SUCCESS,
    response: response,
    message: message,
  };
};
const getOrganizationGroupTypes_Fail = (message) => {
  return {
    type: actions.GET_GROUP_ORGANIZATION_TYPE_FAIL,
    message: message,
  };
};
const getOrganizationGroupTypes = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getOrganizationGroupTypes_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllOrganizationGroupTypes.RequestMethod);
    axios({
      method: "post",
      url: getGroupsApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getOrganizationGroupTypes(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetAllOrgainzationGroupTypes_01".toLowerCase()
                )
            ) {
              await dispatch(
                getOrganizationGroupTypes_Success(
                  response.data.responseResult.groupTypes,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetAllOrgainzationGroupTypes_02".toLowerCase()
                )
            ) {
              dispatch(getOrganizationGroupTypes_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetAllOrgainzationGroupTypes_03".toLowerCase()
                )
            ) {
              dispatch(getOrganizationGroupTypes_Fail(t("No-data-available")));
            } else {
              console.log(response, "response");
              dispatch(
                getOrganizationGroupTypes_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            console.log(response, "response");
            dispatch(getOrganizationGroupTypes_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(getOrganizationGroupTypes_Fail(t("Something-went-wrong")));
      });
  };
};

const updateGroup_Init = () => {
  return {
    type: actions.UPDATE_GROUP_INIT,
  };
};
const updateGroup_Succes = (response, message) => {
  return {
    type: actions.UPDATE_GROUP_SUCCESSS,
    response: response,
    message: message,
  };
};
const updateGroup_Fail = (message) => {
  return {
    type: actions.UPDATE_GROUP_FAIL,
    message: message,
  };
};
const updateGroup = (navigate, Data, t, setViewUpdateGroup) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(updateGroup_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", updateGroupRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getGroupsApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateGroup(navigate, Data, t, setViewUpdateGroup));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_UpdateGroup_01".toLowerCase()
                )
            ) {
              await dispatch(
                updateGroup_Succes(
                  response.data.responseResult,
                  t("Group-updated")
                )
              );
              dispatch(getGroups(navigate, t, currentPage));
              setViewUpdateGroup(false);
              console.log("Group-updated");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_UpdateGroup_02".toLowerCase()
                )
            ) {
              dispatch(updateGroup_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_UpdateGroup_03".toLowerCase()
                )
            ) {
              dispatch(updateGroup_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_UpdateGroup_04".toLowerCase()
                )
            ) {
              dispatch(updateGroup_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_UpdateGroup_05".toLowerCase()
                )
            ) {
              dispatch(updateGroup_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_UpdateGroup_06".toLowerCase()
                )
            ) {
              dispatch(updateGroup_Fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(updateGroup_Fail(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(updateGroup_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(updateGroup_Fail(t("Something-went-wrong")));
      });
  };
};

const updateGroupStatus_Init = () => {
  return {
    type: actions.UPDATE_GROUP_STATUS_INIT,
  };
};
const updateGroupStatus_Success = (response, message) => {
  return {
    type: actions.UPDATE_GROUP_STATUS_SUCCESS,
    response: response,
    message: message,
  };
};
const updateGroupStatus_Fail = (message) => {
  return {
    type: actions.UPDATE_GROUP_STATUS_FAIL,
    message: message,
  };
};
const updateGroupStatus = (navigate, Data, t, setModalStatusChange) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(updateGroupStatus_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", updateGroupStatusRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getGroupsApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateGroupStatus(navigate, Data, t, setModalStatusChange));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GroupStatusUpdate_01".toLowerCase()
                )
            ) {
              await dispatch(
                updateGroupStatus_Success(
                  response.data.responseResult,
                  t("Group-status-update")
                )
              );
              dispatch(getGroups(navigate, t, currentPage));
              setModalStatusChange(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GroupStatusUpdate_02".toLowerCase()
                )
            ) {
              dispatch(updateGroupStatus_Fail(t("Group-status-not-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GroupStatusUpdate_03".toLowerCase()
                )
            ) {
              dispatch(updateGroupStatus_Fail(t("Group-status-not-update")));
            }
          } else {
            console.log(response, "response");
            dispatch(updateGroupStatus_Fail(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(updateGroupStatus_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(updateGroupStatus_Fail(t("Something-went-wrong")));
      });
  };
};
const realtimeGroupResponse = (response) => {
  return {
    type: actions.REALTIME_GROUPS_RESPONSE,
    response: response,
  };
};
const realtimeGroupStatusResponse = (response) => {
  console.log("realtimeGroupStatusResponse", response);
  return {
    type: actions.REALTIME_GROUPS_STATUS_RESPONSE,
    response: response,
  };
};

const getAllGroups_Init = () => {
  return {
    type: actions.GET_ALL_ORGANIZATION_GROUPS_INIT,
  };
};
const getAllGroups_Success = (response, message) => {
  console.log("GET_ALL_ORGANIZATION_GROUPS_SUCCESS", response, message);
  return {
    type: actions.GET_ALL_ORGANIZATION_GROUPS_SUCCESS,
    response: response,
    message: message,
  };
};
const getAllGroups_Fail = (message) => {
  return {
    type: actions.GET_ALL_ORGANIZATION_GROUPS_FAIL,
    message: message,
  };
};
const getAllGroups = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = { OrganizationID: JSON.parse(OrganizationID) };
  return (dispatch) => {
    dispatch(getAllGroups_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getAllOrganizationGroups.RequestMethod);
    axios({
      method: "post",
      url: getGroupsApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllGroups(navigate, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Groups_GroupServiceManager_GetAllOrganizationGroups_01".toLowerCase()
            ) {
              dispatch(
                getAllGroups_Success(
                  response.data.responseResult.groups,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Groups_GroupServiceManager_GetAllOrganizationGroups_02".toLowerCase()
            ) {
              dispatch(getAllGroups_Fail(t("Data-not-available")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Groups_GroupServiceManager_GetAllOrganizationGroups_03".toLowerCase()
            ) {
              dispatch(getAllGroups_Fail(t("Something-went-wrong")));
            }
            console.log(response, "response");
          } else {
            console.log(response, "response");
            dispatch(getAllGroups_Fail(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(getAllGroups_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getAllGroups_Fail(t("Something-went-wrong")));
      });
  };
};

//Group Data RoadMap
const methodCreateUpdateDataRoadMapInit = () => {
  return {
    types: actions.CREAT_UPDATE_GROUP_ROADMAP_INIT,
  };
};

const methodCreateUpdateDataRoadMapSuccess = (response, message) => {
  return {
    types: actions.CREAT_UPDATE_GROUP_ROADMAP_SUCCESS,
    response: response,
    message: message,
  };
};

const methodCreateUpdateDataRoadMapFailed = (message) => {
  return {
    types: actions.CREAT_UPDATE_GROUP_ROADMAP_SUCCESS,
    message: message,
  };
};

const CreateUpdateDataRoadMapApiFunc = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("groupsCurrent"));
  return (dispatch) => {
    dispatch(methodCreateUpdateDataRoadMapInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", CreateUpdateGroupDataRoadMap.RequestMethod);
    axios({
      method: "post",
      url: getGroupsApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(CreateUpdateDataRoadMapApiFunc(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateGroupDataRoomMap_01".toLowerCase()
                )
            ) {
              await dispatch(
                methodCreateUpdateDataRoadMapSuccess(
                  response.data.responseResult,
                  t(" Folder-mapped-with-data-room")
                )
              );
              dispatch(getGroups(navigate, t, currentPage));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateGroupDataRoomMap_02".toLowerCase()
                )
            ) {
              dispatch(
                methodCreateUpdateDataRoadMapFailed(
                  t("Failed-to-save-or-map-folder")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateGroupDataRoomMap_03".toLowerCase()
                )
            ) {
              await dispatch(
                methodCreateUpdateDataRoadMapSuccess(
                  response.data.responseResult,
                  t(" Folder-mapped-with-data-room")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateGroupDataRoomMap_04".toLowerCase()
                )
            ) {
              dispatch(
                methodCreateUpdateDataRoadMapFailed(
                  t("Unable-to-update-folder")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateGroupDataRoomMap_05".toLowerCase()
                )
            ) {
              await dispatch(
                methodCreateUpdateDataRoadMapSuccess(
                  response.data.responseResult,
                  t("New-mapping-created.")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateGroupDataRoomMap_06".toLowerCase()
                )
            ) {
              dispatch(
                methodCreateUpdateDataRoadMapFailed(
                  t("Failed-to-create-new-mapping")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateGroupDataRoomMap_07".toLowerCase()
                )
            ) {
              dispatch(
                methodCreateUpdateDataRoadMapFailed(t("Something-went-wrong"))
              );
            }
          } else {
            console.log(response, "response");
            dispatch(
              methodCreateUpdateDataRoadMapFailed(t("Something-went-wrong"))
            );
          }
        } else {
          console.log(response, "response");
          dispatch(
            methodCreateUpdateDataRoadMapFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(
          methodCreateUpdateDataRoadMapFailed(t("Something-went-wrong"))
        );
      });
  };
};

export {
  getGroups,
  getAllGroups,
  realtimeGroupResponse,
  realtimeGroupStatusResponse,
  clearMessagesGroup,
  getbyGroupID,
  createGroup,
  getGroupMembersRoles,
  getOrganizationGroupTypes,
  updateGroup,
  updateGroupStatus,
  groupLoader,
  getArcheivedGroups,
  CreateUpdateDataRoadMapApiFunc,
};
