import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ShowNotification: false,
  Fail: false,
  ResponseMessage: "",
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
      console.log("GET_FAQS_SUCCESS", action);
      let GetAllFAQsArray = action.response.listOfFAQs.map((item, index) => {
        return { ...item, key: index };
      });
      console.log("GET_FAQS_SUCCESS", GetAllFAQsArray);

      return {
        ...state,
        Loading: false,
        ResponseMessage: action.response.responseMessage,
        AllFAQsData: GetAllFAQsArray,
        ShowNotification: true,
      };

    case actions.GET_FAQS_FAIL:
      return {
        ...state,
        Loading: false,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseMessage,
        AllFAQsData: action.response.listOfFAQs,
        ShowNotification: true,
      };

    default:
      return { ...state };
  }
};

export default fAQsReducer;
