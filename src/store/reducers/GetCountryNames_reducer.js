import * as actions from "../action_types";

const initialState = {
  Loading: false,
  CountryNamesData: [],
  ResponseMessage: "",
};

const countryNamesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.COUNTRYNAMES_INIT:
      return {
        ...state,
        Loading: true,
      };
    case actions.COUNTRYNAMES_SUCCESS:
      return {
        ...state,
        Loading: false,
        CountryNamesData: action.response,
        ResponseMessage: action.message,
      };
    case actions.COUNTRYNAMES_FAIL:
      return {
        ...state,
        Loading: false,
        CountryNamesData: [],
        ResponseMessage: action.message,
      };
    default:
      return { ...state };
  }
};
export default countryNamesReducer;
