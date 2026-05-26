import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ShowNotification: false,
  Fail: false,
  ResponseMessage: "",
  errorSeverity: null,
  AllFAQsData: [],
};

const fAQsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_LOADER_FALSE:
      return { ...state, Loading: false };

    case actions.SHOW:
      return { ...state, ShowNotification: true, Message: action.message };

    case actions.GET_FAQS_INIT:
      return { ...state, Loading: true };

    case actions.GET_FAQS_SUCCESS:
      let GetAllFAQsArray = action.response.listOfFAQs.map((item, index) => {
        return { ...item, key: index };
      });

      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        AllFAQsData: GetAllFAQsArray,
        ShowNotification: true,
        errorSeverity: "success",
      };

    case actions.GET_FAQS_FAIL:
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        AllFAQsData: [],
        ShowNotification: true,
        errorSeverity: "error",
      };

    default:
      return { ...state };
  }
};

export default fAQsReducer;
