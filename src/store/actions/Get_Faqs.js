import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "../actions/Auth_action";
import { getFaqs } from "../../commen/apis/Api_config";
import axios from "axios";

const SetLoaderFalse = () => {
  return {
    type: actions.SET_LOADER_FALSE,
  };
};

const faqsInit = () => {
  return {
    type: actions.GET_FAQS_INIT,
  };
};
const faqsSuccess = (response, message) => {
  return {
    type: actions.GET_FAQS_SUCCESS,
    response: response,
    message: message,
  };
};
const faqsFail = (message, response) => {
  return {
    type: actions.GET_FAQS_FAIL,
    message: message,
    response: response,
  };
};

const GetUserFAQs = () => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(faqsInit());
    let form = new FormData();
    form.append("RequestMethod", getFaqs.RequestMethod);
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("Getfaqs", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
          dispatch(GetUserFAQs());
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            dispatch(faqsSuccess(response.data.responseResult));
          } else {
            dispatch(faqsFail(response.data.responseResult));
            dispatch(SetLoaderFalse());
          }
        } else {
          dispatch(faqsFail(response.data));
          dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        console.log(response.message);
        dispatch(SetLoaderFalse());
      });
  };
};

export { GetUserFAQs };
