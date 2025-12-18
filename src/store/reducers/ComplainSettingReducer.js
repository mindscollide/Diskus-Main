import * as actions from "../action_types";
const initialState = {
  Loading: false,
  ResponseMessage: "",
  GetAllAuthorities: null,
  GetAuthorityByID: null,
  DeleteAuthority: null,
  UpdateAuthority: null,
  AddAuthority: null,
};

const ComplainceSettingReducerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ALL_AUTHORITY_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ALL_AUTHORITY_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetAllAuthorities: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ALL_AUTHORITY_FAIL: {
      return {
        ...state,
        Loading: false,
        GetAllAuthorities: null,
        ResponseMessage: action.message,
      };
    }

    // GET Authority by ID
    case actions.GET_AUTHORITY_BY_ID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_AUTHORITY_BY_ID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetAuthorityByID: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_AUTHORITY_BY_ID_FAIL: {
      return {
        ...state,
        Loading: false,
        GetAuthorityByID: null,
        ResponseMessage: action.message,
      };
    }

    // DeleteAuthority
    case actions.DELETE_AUTHORITY_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETE_AUTHORITY_SUCCESS: {
      return {
        ...state,
        Loading: false,
        DeleteAuthority: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETE_AUTHORITY_FAIL: {
      return {
        ...state,
        Loading: false,
        DeleteAuthority: null,
        ResponseMessage: action.message,
      };
    }

    // UpdateAuthority
    case actions.UPDATE_AUTHORITY_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATE_AUTHORITY_SUCCESS: {
      return {
        ...state,
        Loading: false,
        UpdateAuthority: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATE_AUTHORITY_FAIL: {
      return {
        ...state,
        Loading: false,
        UpdateAuthority: null,
        ResponseMessage: action.message,
      };
    }

    // AddAuthority
    case actions.ADD_AUTHORITY_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADD_AUTHORITY_SUCCESS: {
      return {
        ...state,
        Loading: false,
        AddAuthority: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.ADD_AUTHORITY_FAIL: {
      return {
        ...state,
        Loading: false,
        AddAuthority: null,
        ResponseMessage: action.message,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default ComplainceSettingReducerReducer;
