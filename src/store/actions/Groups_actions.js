import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";

import { dataRoomApi, getGroupsApi } from "../../commen/apis/Api_ends_points";
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
  uploadDocumentsRequestMethod,
  saveFilesRequestMethod,
  SaveTheGroupsDocuments,
  RetrieveGroupDocuments,
} from "../../commen/apis/Api_config";
import { GetAllUserChats } from "./Talk_action";
import axios from "axios";

const clearMessagesGroup = () => {
  return {
    type: actions.CLEAR_MESSAGE_RESPONSE_COMMITTEE,
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          await dispatch(getGroups(navigate, t, currentPage));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_01".toLowerCase()
                )
            ) {
              dispatch(groupLoader(false));

              dispatch(getGroup_Success(response.data.responseResult, ""));
              // }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_02".toLowerCase()
                )
            ) {
              dispatch(getGroup_Fail(""));
              dispatch(groupLoader(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_03".toLowerCase()
                )
            ) {
              dispatch(getGroup_Fail(""));
              dispatch(groupLoader(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_04".toLowerCase()
                )
            ) {
              dispatch(getGroup_Fail(""));
              dispatch(groupLoader(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_05".toLowerCase()
                )
            ) {
              dispatch(getGroup_Fail(""));
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
            }
          } else {
            dispatch(getGroup_Fail(t("Something-went-wrong")));
            dispatch(groupLoader(false));
          }
        } else {
          dispatch(getGroup_Fail(t("Something-went-wrong")));
          dispatch(groupLoader(false));
        }
      })
      .catch((response) => {
        dispatch(getGroup_Fail(t("Something-went-wrong")));
        dispatch(groupLoader(false));
      });
  };
};

const groupLoader = (action) => {
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
                getArchivedGroups_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_02".toLowerCase()
                )
            ) {
              dispatch(getArchivedGroups_fail(""));
              // dispatch(groupLoader(false))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_03".toLowerCase()
                )
            ) {
              dispatch(getArchivedGroups_fail(""));
              // dispatch(groupLoader(false))
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_04".toLowerCase()
                )
            ) {
              dispatch(getArchivedGroups_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_SearchGroups_05".toLowerCase()
                )
            ) {
              dispatch(getArchivedGroups_fail(""));
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
            dispatch(getArchivedGroups_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getArchivedGroups_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
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
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    GroupID: Number(GroupId),
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
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetGroupByGroupID_01".toLowerCase()
                )
            ) {
              dispatch(
                getbyGroupID_Success(response.data.responseResult.group, "")
              );
              let newData = {
                GroupID: Number(GroupId),
              };
              dispatch(RetriveDocumentsGroupsApiFunc(navigate, newData, t));
              if (no === 1) {
                setViewGroupPage(true);
                setUpdateComponentpage(false);
              } else if (no === 2) {
                setArchivedGroups(false);
                setViewGroupPage(true);
                setUpdateComponentpage(false);
              } else if (no === 3) {
                dispatch(updateGroupPageFlag(true));

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
              dispatch(getbyGroupID_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetGroupByGroupID_03".toLowerCase()
                )
            ) {
              dispatch(getbyGroupID_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetGroupByGroupID_04".toLowerCase()
                )
            ) {
              dispatch(getbyGroupID_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetGroupByGroupID_05".toLowerCase()
                )
            ) {
              dispatch(getbyGroupID_Fail(""));
            }
          } else {
            dispatch(getbyGroupID_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getbyGroupID_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
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
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(createGroup(navigate, Data, t, setCreategrouppage));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_CreateNewGroup_01".toLowerCase()
                )
            ) {
              await dispatch(
                createGroup_Success(response.data.responseResult, "")
              );
              localStorage.setItem(
                "groupID",
                response.data.responseResult.groupID
              );
              let newData = {
                GroupID: response.data.responseResult.groupID,
                GroupTitle: Data.GroupDetails.title,
                IsUpdateFlow: false,
                GroupMembers: Data.GroupMembers.map(
                  (data, index) => data.FK_UID
                ),
              };

              dispatch(CreateUpdateDataRoadMapApiFunc(navigate, newData, t));
              dispatch(GetAllUserChats(navigate, createrID, OrganizationID, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_CreateNewGroup_02".toLowerCase()
                )
            ) {
              dispatch(createGroup_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_CreateNewGroup_03".toLowerCase()
                )
            ) {
              dispatch(createGroup_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_CreateNewGroup_04".toLowerCase()
                )
            ) {
              dispatch(createGroup_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_CreateNewGroup_05".toLowerCase()
                )
            ) {
              dispatch(createGroup_Fail(""));
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
            dispatch(createGroup_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(createGroup_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getGroupMembersRoles(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
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
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetAllOrganizationGroupRoles_02".toLowerCase()
                )
            ) {
              dispatch(getOrganiationGroupRoles_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetAllOrganizationGroupRoles_03".toLowerCase()
                )
            ) {
              dispatch(getOrganiationGroupRoles_Fail(""));
            } else {
              dispatch(
                getOrganiationGroupRoles_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(getOrganiationGroupRoles_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getOrganizationGroupTypes(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
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
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetAllOrgainzationGroupTypes_02".toLowerCase()
                )
            ) {
              dispatch(getOrganizationGroupTypes_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GetAllOrgainzationGroupTypes_03".toLowerCase()
                )
            ) {
              dispatch(getOrganizationGroupTypes_Fail(""));
            } else {
              dispatch(
                getOrganizationGroupTypes_Fail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(getOrganizationGroupTypes_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateGroup(navigate, Data, t, setViewUpdateGroup));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
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
                  t("Updated-successfully")
                )
              );

              let newData = {
                GroupID: Data.GroupDetails.PK_GRID,
                GroupTitle: Data.GroupDetails.title,
                IsUpdateFlow: true,
                GroupMembers: Data.GroupMembers.map(
                  (data, index) => data.FK_UID
                ),
              };

              dispatch(CreateUpdateDataRoadMapApiFunc(navigate, newData, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_UpdateGroup_02".toLowerCase()
                )
            ) {
              dispatch(updateGroup_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_UpdateGroup_03".toLowerCase()
                )
            ) {
              dispatch(updateGroup_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_UpdateGroup_04".toLowerCase()
                )
            ) {
              dispatch(updateGroup_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_UpdateGroup_05".toLowerCase()
                )
            ) {
              dispatch(updateGroup_Fail(""));
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
            dispatch(updateGroup_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(updateGroup_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateGroupStatus(navigate, Data, t, setModalStatusChange));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Groups_GroupServiceManager_GroupStatusUpdate_01".toLowerCase()
                )
            ) {
              await dispatch(
                updateGroupStatus_Success(response.data.responseResult, "")
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
            dispatch(updateGroupStatus_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(updateGroupStatus_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllGroups(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Groups_GroupServiceManager_GetAllOrganizationGroups_01".toLowerCase()
            ) {
              dispatch(
                getAllGroups_Success(response.data.responseResult.groups, "")
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
          } else {
            dispatch(getAllGroups_Fail(t("Something-went-wrong")));
          }
        } else {
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
    type: actions.CREAT_UPDATE_GROUP_ROADMAP_INIT,
  };
};

const methodCreateUpdateDataRoadMapSuccess = (response, message) => {
  return {
    type: actions.CREAT_UPDATE_GROUP_ROADMAP_SUCCESS,
    response: response,
    message: message,
  };
};

const methodCreateUpdateDataRoadMapFailed = (message) => {
  return {
    type: actions.CREAT_UPDATE_GROUP_ROADMAP_FAILED,
    message: message,
  };
};

const CreateUpdateDataRoadMapApiFunc = (navigate, Data, t) => {
  console.log(
    { Data },
    "CreateUpdateDataRoadMapApiFuncCreateUpdateDataRoadMapApiFunc"
  );
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(methodCreateUpdateDataRoadMapInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", CreateUpdateGroupDataRoadMap.RequestMethod);
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(CreateUpdateDataRoadMapApiFunc(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateGroupDataRoomMap_01".toLowerCase()
                )
            ) {
              await dispatch(
                methodCreateUpdateDataRoadMapSuccess(
                  response.data.responseResult.folderID,
                  ""
                )
              );
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
                  response.data.responseResult.folderID,
                  ""
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
                  response.data.responseResult.folderID,
                  ""
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
            dispatch(
              methodCreateUpdateDataRoadMapFailed(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            methodCreateUpdateDataRoadMapFailed(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          methodCreateUpdateDataRoadMapFailed(t("Something-went-wrong"))
        );
      });
  };
};

// Upload Documents Init
const uploadDocument_init = () => {
  return {
    type: actions.UPLOAD_GROUPS_DOCUMENTS_INIT,
  };
};

// Upload Documents Success
const uploadDocument_success = (response, message) => {
  return {
    type: actions.UPLOAD_GROUPS_DOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const uploadDocument_fail = (message) => {
  return {
    type: actions.UPLOAD_GROUPS_DOCUMENTS_FAIL,
    message: message,
  };
};

// Upload Documents API for Resolution
const uploadDocumentsGroupsApi = (
  navigate,
  t,
  data,
  folderID,
  // newFolder,
  newfile
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  return async (dispatch) => {
    dispatch(uploadDocument_init());
    let form = new FormData();
    form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
    form.append("File", data);
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            uploadDocumentsGroupsApi(
              navigate,
              t,
              data,
              folderID,
              // newFolder,
              newfile
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_01".toLowerCase()
                )
            ) {
              newfile.push({
                DisplayFileName: response.data.responseResult.displayFileName,
                DiskusFileNameString:
                  response.data.responseResult.diskusFileName,
                ShareAbleLink: response.data.responseResult.shareAbleLink,
                FK_UserID: JSON.parse(creatorID),
                FK_OrganizationID: JSON.parse(organizationID),
                FileSize: Number(response.data.responseResult.fileSizeOnDisk),
                fileSizeOnDisk: Number(response.data.responseResult.fileSize),
              });
              await dispatch(
                uploadDocument_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase()
                )
            ) {
              dispatch(uploadDocument_fail(t("Failed-to-update-document")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
                )
            ) {
              dispatch(uploadDocument_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(uploadDocument_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(uploadDocument_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(uploadDocument_fail(t("Something-went-wrong")));
      });
  };
};

// Save Files Init
const saveFiles_init = () => {
  return {
    type: actions.SAVE_GROUP_FILES_DOCUMENTS_INIT,
  };
};

// Save Files Success
const saveFiles_success = (response, message) => {
  return {
    type: actions.SAVE_GROUP_FILES_DOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

// Save Files Fail
const saveFiles_fail = (message) => {
  return {
    type: actions.SAVE_GROUP_FILES_DOCUMENTS_FAIL,
    message: message,
  };
};

// Save Files API for Resolution
const saveFilesGroupsApi = (navigate, t, data, folderID, newFolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: data,
    UserID: JSON.parse(creatorID),
    Type: 0,
  };
  return async (dispatch) => {
    dispatch(saveFiles_init());
    let form = new FormData();
    form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(saveFilesGroupsApi(navigate, t, data, folderID, newFolder));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase()
                )
            ) {
              console.log(response.data.responseResult, "consoleconsole");
              try {
                let fileIds = response.data.responseResult.fileID;
                console.log(fileIds, "newFileID");
                fileIds.map((newFileID, index) => {
                  console.log(newFileID, "newFileID");

                  return newFolder.push({ pK_FileID: newFileID.pK_FileID });
                });
              } catch (error) {
                console.log(error, "newFileID");
              }
              await dispatch(
                saveFiles_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
                )
            ) {
              dispatch(saveFiles_fail(t("Failed-to-save-any-file")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
                )
            ) {
              dispatch(saveFiles_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveFiles_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveFiles_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(saveFiles_fail(t("Something-went-wrong")));
      });
  };
};

//Save Groups Documents

const showSaveGroupDocsInit = () => {
  return {
    type: actions.SAVE_GROUPS_DOCUMENTS_INIT,
  };
};

const showSaveGroupDocsSuccess = (response, message) => {
  return {
    type: actions.SAVE_GROUPS_DOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

const showSaveGroupDocsFailed = (message) => {
  return {
    type: actions.SAVE_GROUPS_DOCUMENTS_SUCCESS,
    message: message,
  };
};

//SAVE GROUPS DOCUMENTS API

const SaveGroupsDocumentsApiFunc = (
  navigate,
  Data,
  t,
  setCreategrouppage,
  setViewGroupPage
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage =
    localStorage.getItem("groupsCurrent") !== null
      ? Number(localStorage.getItem("groupsCurrent"))
      : 1;
  return (dispatch) => {
    dispatch(showSaveGroupDocsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", SaveTheGroupsDocuments.RequestMethod);
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            SaveGroupsDocumentsApiFunc(
              navigate,
              Data,
              t,
              setCreategrouppage,
              setViewGroupPage
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveGroupsDocuments_01".toLowerCase()
                )
            ) {
              await dispatch(
                showSaveGroupDocsSuccess(response.data.responseResult, "")
              );
              localStorage.removeItem("groupID");
              dispatch(methodCreateUpdateDataRoadMapFailed(""));
              dispatch(getGroups(navigate, t, currentPage));
              try {
                setCreategrouppage(false);
                setViewGroupPage(false);
              } catch (error) {}
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveGroupsDocuments_02".toLowerCase()
                )
            ) {
              dispatch(showSaveGroupDocsFailed(t("Something-went-wrong")));
              dispatch(methodCreateUpdateDataRoadMapFailed(""));
              localStorage.removeItem("groupID");
              dispatch(getGroups(navigate, t, currentPage));
            }
          } else {
            dispatch(showSaveGroupDocsFailed(t("Something-went-wrong")));
            dispatch(methodCreateUpdateDataRoadMapFailed(""));
            localStorage.removeItem("groupID");
            dispatch(getGroups(navigate, t, currentPage));
          }
        } else {
          dispatch(showSaveGroupDocsFailed(t("Something-went-wrong")));
          dispatch(methodCreateUpdateDataRoadMapFailed(""));
          localStorage.removeItem("groupID");
          dispatch(getGroups(navigate, t, currentPage));
        }
      })
      .catch((response) => {
        dispatch(showSaveGroupDocsFailed(t("Something-went-wrong")));
        dispatch(methodCreateUpdateDataRoadMapFailed(""));
      });
  };
};

//Retrive Document APi

const showRetriveDocumentsInit = () => {
  return {
    type: actions.RETREIVE_GROUP_DOCUMENTS_INIT,
  };
};

const showRetriveDocumentsSuccess = (response, message) => {
  return {
    type: actions.RETREIVE_GROUP_DOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

const showRetriveDocumentsFailed = (message) => {
  return {
    type: actions.RETREIVE_GROUP_DOCUMENTS_FAILED,
    message: message,
  };
};

const RetriveDocumentsGroupsApiFunc = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(showRetriveDocumentsInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", RetrieveGroupDocuments.RequestMethod);
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(RetriveDocumentsGroupsApiFunc(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveGroupDocuments_01".toLowerCase()
                )
            ) {
              await dispatch(
                showRetriveDocumentsSuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveGroupDocuments_02".toLowerCase()
                )
            ) {
              dispatch(showRetriveDocumentsFailed(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveGroupDocuments_03".toLowerCase()
                )
            ) {
              dispatch(showRetriveDocumentsFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(showRetriveDocumentsFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(showRetriveDocumentsFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(showRetriveDocumentsFailed(t("Something-went-wrong")));
      });
  };
};

//Create Group Page
const createGroupPageFlag = (response) => {
  return {
    type: actions.CREATE_GROUP_PAGE_FLAG,
    response: response,
  };
};

//Update Group Page
const updateGroupPageFlag = (response) => {
  return {
    type: actions.UPDATE_GROUP_PAGE_FLAG,
    response: response,
  };
};

//View Group Page
const viewGroupPageFlag = (response) => {
  return {
    type: actions.VIEW_GROUP_PAGE_FLAG,
    response: response,
  };
};

const removeGroupMemberMQTT = (response) => {
  return {
    type: actions.REMOVE_GROUP_MEMBER,
    response: response,
  };
};

export {
  removeGroupMemberMQTT,
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
  uploadDocumentsGroupsApi,
  saveFilesGroupsApi,
  SaveGroupsDocumentsApiFunc,
  RetriveDocumentsGroupsApiFunc,
  createGroupPageFlag,
  updateGroupPageFlag,
  viewGroupPageFlag,
};
