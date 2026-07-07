import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  errorSeverity: null,
  AllLanguagesData: [],
  SetLanguageData: [],
};

const LanguageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ALL_LANGUAGES_INITIAL: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_ALL_LANGUAGES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        AllLanguagesData: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }

    case actions.GET_ALL_LANGUAGES_FAIL: {
      return {
        ...state,
        Loading: false,
        AllLanguagesData: [],
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }

    case actions.SET_SELECTED_LANGUAGE_INITIAL: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SET_SELECTED_LANGUAGE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }

    case actions.SET_SELECTED_LANGUAGE_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }

    case actions.GET_SELECTED_LANGUAGE_INITIAL: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.GET_SELECTED_LANGUAGE_SUCCESS: {
      return {
        ...state,
        Loading: action.loader,
        SetLanguageData: action.response,
        ResponseMessage: action.message,
        errorSeverity: "success",
      };
    }

    case actions.GET_SELECTED_LANGUAGE_FAIL: {
      return {
        ...state,
        Loading: false,
        SetLanguageData: [],
        ResponseMessage: action.message,
        errorSeverity: "error",
      };
    }

    default:
      return { ...state };
  }
};

export default LanguageReducer;
