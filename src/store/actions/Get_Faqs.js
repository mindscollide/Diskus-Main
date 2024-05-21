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
const faqsFail = (message) => {
  return {
    type: actions.GET_FAQS_FAIL,
    message: message,
  };
};

const GetUserFAQs = (navigate, t) => {
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetUserFAQs(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetFAQs_01".toLowerCase()
                )
            ) {
              await dispatch(
                faqsSuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetFAQs_02".toLowerCase()
                )
            ) {
              await dispatch(faqsFail(t("No-records-found")));
              await dispatch(SetLoaderFalse());
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Settings_SettingsServiceManager_GetFAQs_03".toLowerCase()
                )
            ) {
              await dispatch(faqsFail(t("Something-went-wrong")));
              await dispatch(SetLoaderFalse());
            }
          } else {
            await dispatch(faqsFail(t("Something-went-wrong")));
            await dispatch(SetLoaderFalse());
          }
        } else {
          await dispatch(faqsFail(t("Something-went-wrong")));
          await dispatch(SetLoaderFalse());
        }
      })
      .catch((response) => {
        dispatch(faqsFail(t("Something-went-wrong")));
        dispatch(SetLoaderFalse());
      });
  };
};

export { GetUserFAQs };
