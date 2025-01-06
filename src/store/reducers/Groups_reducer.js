import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  getAllGroupsResponse: [],
  getGroupByGroupIdResponse: null,
  createGroupResponse: null,
  getOrganizationGroupRoles: null,
  getOrganizationGroupTypes: null,
  updateGroupResponse: null,
  UpdateGroupStatusResponse: null,
  realtimeGroupCreateResponse: null,
  realtimeGroupStatus: null,
  getAllGroups: null,
  ArcheivedGroups: null,
  getAllLoading: false,
  FolderID: 0,
  groupDocuments: null,
  uploadGroupDocuments: null,
  saveUploadGroupDocuments: null,
  createGroupPageFlag: false,
  updateGroupPageFlag: false,
  viewGroupPageFlag: false,
  removeGroupMember: null,
  viewGroupsList: null,
  viewGroupDetailLink: null,
};

const GroupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_GROUP_DETAILS_LINK_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_GROUP_DETAILS_LINK_SUCCESS: {
      return {
        ...state,
        Loading: false,
        viewGroupDetailLink: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_GROUP_DETAILS_LINK_FAIL: {
      return {
        ...state,
        Loading: false,
        viewGroupDetailLink: null,
        ResponseMessage: action.message,
      };
    }

    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_GROUP_LIST_LINK_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_GROUP_LIST_LINK_SUCCESS: {
      return {
        ...state,
        Loading: false,
        viewGroupsList: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_VIEW_GROUP_LIST_LINK_FAIL: {
      return {
        ...state,
        Loading: false,
        viewGroupsList: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_GROUPS_BYUSERID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GROUP_LOADER_STATE: {
      return {
        ...state,
        getAllLoading: action.response,
      };
    }
    case actions.GET_GROUPS_BYUSERID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllGroupsResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_GROUPS_BYUSERID_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        getAllGroupsResponse: [],
      };
    }
    case actions.GET_GROUPS_BYGROUPID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_GROUPS_BYGROUPID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getGroupByGroupIdResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_GROUPS_BYGROUPID_FAIL: {
      return {
        ...state,
        Loading: false,
        getGroupByGroupIdResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATE_GROUP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CREATE_GROUP_SUCCESS: {
      return {
        ...state,
        Loading: false,
        createGroupResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATE_GROUP_FAIL: {
      return {
        ...state,
        Loading: false,
        createGroupResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_GROUP_MEMBERS_ROLES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_GROUP_MEMBERS_ROLES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getOrganizationGroupRoles: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_GROUP_MEMBERS_ROLES_FAIL: {
      return {
        ...state,
        Loading: false,
        getOrganizationGroupRoles: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CLEAR_RESPONSE_MESSAGE_GROUPS: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }
    case actions.GET_GROUP_ORGANIZATION_TYPE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_GROUP_ORGANIZATION_TYPE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getOrganizationGroupTypes: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_GROUP_ORGANIZATION_TYPE_FAIL: {
      return {
        ...state,
        Loading: false,
        getOrganizationGroupTypes: null,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATE_GROUP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATE_GROUP_SUCCESSS: {
      return {
        ...state,
        Loading: false,
        updateGroupResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATE_GROUP_FAIL: {
      return {
        ...state,
        Loading: false,
        updateGroupResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATE_GROUP_STATUS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATE_GROUP_STATUS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        UpdateGroupStatusResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATE_GROUP_STATUS_FAIL: {
      return {
        ...state,
        Loading: false,
        UpdateGroupStatusResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.REALTIME_GROUPS_RESPONSE: {
      return {
        ...state,
        realtimeGroupCreateResponse: action.response,
      };
    }
    case actions.REALTIME_GROUPS_STATUS_RESPONSE: {
      return {
        ...state,
        realtimeGroupStatus: action.response,
      };
    }
    case actions.GET_ALL_ORGANIZATION_GROUPS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ALL_ORGANIZATION_GROUPS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllGroups: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ALL_ORGANIZATION_GROUPS_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllGroups: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CLEAR_MESSAGE_RESPONSE_COMMITTEE: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: "",
      };
    }
    case actions.ARCHEIVED_GROUPS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ARCHEIVED_GROUPS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ArcheivedGroups: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.ARCHEIVED_GROUPS_FAIL: {
      return {
        ...state,
        Loading: false,
        ArcheivedGroups: null,
        ResponseMessage: action.message,
      };
    }

    case actions.CREAT_UPDATE_GROUP_ROADMAP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.CREAT_UPDATE_GROUP_ROADMAP_SUCCESS: {
      return {
        ...state,
        Loading: false,
        FolderID: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.CREAT_UPDATE_GROUP_ROADMAP_FAILED: {
      return {
        ...state,
        // Loading: false,
        FolderID: 0,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_GROUPS_DOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SAVE_GROUPS_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_GROUPS_DOCUMENTS_FAILED: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
      };
    }

    case actions.RETREIVE_GROUP_DOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.RETREIVE_GROUP_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        groupDocuments: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.RETREIVE_GROUP_DOCUMENTS_FAILED: {
      return {
        ...state,
        Loading: false,
        groupDocuments: null,
        ResponseMessage: action.message,
      };
    }
    case actions.UPLOAD_GROUPS_DOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPLOAD_GROUPS_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: true,
        uploadGroupDocuments: action.respose,
        ResponseMessage: action.message,
      };
    }
    case actions.UPLOAD_GROUPS_DOCUMENTS_FAIL: {
      return {
        ...state,
        Loading: false,
        uploadGroupDocuments: null,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_GROUP_FILES_DOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVE_GROUP_FILES_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: true,
        saveUploadGroupDocuments: action.respose,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_GROUP_FILES_DOCUMENTS_FAIL: {
      return {
        ...state,
        Loading: false,
        saveUploadGroupDocuments: null,
        ResponseMessage: action.message,
      };
    }

    case actions.CREATE_GROUP_PAGE_FLAG: {
      return {
        ...state,
        createGroupPageFlag: action.response,
      };
    }

    case actions.UPDATE_GROUP_PAGE_FLAG: {
      return {
        ...state,
        updateGroupPageFlag: action.response,
      };
    }

    case actions.VIEW_GROUP_PAGE_FLAG: {
      return {
        ...state,
        viewGroupPageFlag: action.response,
      };
    }
    case actions.REMOVE_GROUP_MEMBER: {
      return {
        ...state,
        removeGroupMember: action.response,
      };
    }
    default:
      return { ...state };
  }
};

export default GroupsReducer;
