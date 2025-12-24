import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  severity: null, // success | error | ""
  GetAllAuthorities: null,
  GetAuthorityByID: null,
  DeleteAuthority: null,
  UpdateAuthority: null,
  AddAuthority: null,
  IsShortCodeExists: null,
  IsAuthorityNameExists: null,

  // MQTT
  SocketAuthorityInactive: null,
  SocketAuthorityActive: null,
  SocketAuthorityDeleted: null,
  SocketAuthorityCreated: null,
  SocketAuthorityUpdated: null,
};

const ComplainceSettingReducerReducer = (state = initialState, action) => {
  switch (action.type) {
    // ================= GET ALL AUTHORITY =================
    case actions.GET_ALL_AUTHORITY_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.GET_ALL_AUTHORITY_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetAllAuthorities: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_ALL_AUTHORITY_FAIL:
      return {
        ...state,
        Loading: false,
        GetAllAuthorities: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ================= INITIAL RESET =================
    case actions.INITIAL_STATE_ADD_AUTHORITY:
      return {
        ...state,
        GetAuthorityByID: null,
        severity: null,
      };

    // ================= GET AUTHORITY BY ID =================
    case actions.GET_AUTHORITY_BY_ID_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.GET_AUTHORITY_BY_ID_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetAuthorityByID: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_AUTHORITY_BY_ID_FAIL:
      return {
        ...state,
        Loading: false,
        GetAuthorityByID: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ================= DELETE AUTHORITY =================
    case actions.DELETE_AUTHORITY_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.DELETE_AUTHORITY_SUCCESS:
      return {
        ...state,
        Loading: false,
        DeleteAuthority: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.DELETE_AUTHORITY_FAIL:
      return {
        ...state,
        Loading: false,
        DeleteAuthority: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ================= UPDATE AUTHORITY =================
    case actions.UPDATE_AUTHORITY_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.UPDATE_AUTHORITY_SUCCESS:
      return {
        ...state,
        Loading: false,
        UpdateAuthority: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.UPDATE_AUTHORITY_FAIL:
      return {
        ...state,
        Loading: false,
        UpdateAuthority: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ================= ADD AUTHORITY =================
    case actions.ADD_AUTHORITY_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.ADD_AUTHORITY_SUCCESS:
      return {
        ...state,
        Loading: false,
        AddAuthority: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.ADD_AUTHORITY_FAIL:
      return {
        ...state,
        Loading: false,
        AddAuthority: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ================= IsShortCodeExists =================
    case actions.IS_SHORT_CODE_EXIST_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.IS_SHORT_CODE_EXIST_SUCCESS:
      return {
        ...state,
        Loading: false,
        IsShortCodeExists: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.IS_SHORT_CODE_EXIST_FAIL:
      return {
        ...state,
        Loading: false,
        IsShortCodeExists: null,
        ResponseMessage: action.message,
        severity: "error",
      };
    // ================= IsAuthorityNameExists =================
    case actions.IS_AUTHORITY_NAME_EXIST_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.IS_AUTHORITY_NAME_EXIST_SUCCESS:
      return {
        ...state,
        Loading: false,
        IsAuthorityNameExists: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.IS_AUTHORITY_NAME_EXIST_FAIL:
      return {
        ...state,
        Loading: false,
        IsAuthorityNameExists: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    //MQTT Work
    case actions.AUTHORITY_INACTIVE:
      return {
        ...state,
        SocketAuthorityInactive: action.response,
        ResponseMessage: action.message,
      };

    case actions.AUTHORITY_ACTIVE:
      return {
        ...state,
        SocketAuthorityInactive: action.response,
        ResponseMessage: action.message,
      };
    case actions.AUTHORITY_DELETED:
      return {
        ...state,
        SocketAuthorityDeleted: action.response,
        ResponseMessage: action.message,
      };
    case actions.AUTHORITY_CREATED:
      return {
        ...state,
        SocketAuthorityCreated: action.response,
        ResponseMessage: action.message,
      };

    // AUTHORITY_UPDATED
    case actions.AUTHORITY_UPDATED:
      return {
        ...state,
        SocketAuthorityUpdated: action.response,
        ResponseMessage: action.message,
      };

    case actions.GET_CLEAREMESSAGE_AUTHORITY:
      return {
        ...state,
        ResponseMessage: "",
        severity: null,
      };
    // ================= DEFAULT =================
    default:
      return state;
  }
};

export default ComplainceSettingReducerReducer;
