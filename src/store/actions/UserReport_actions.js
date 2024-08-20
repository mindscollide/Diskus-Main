import { UserLoginHistoryRM } from "../../commen/apis/Api_config";
import * as actions from "../action_types";
import axios from "axios";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";

const userLoginHistory_Init = (loader) => {
  return {
    type: actions.GET_USER_LOGIN_HISTORY_INIT,
    loader: loader,
  };
};
const userLoginHistory_Success = (response, message) => {
  console.log(response, message, "GET_USER_LOGIN_HISTORY_SUCCESS");
  return {
    type: actions.GET_USER_LOGIN_HISTORY_SUCCESS,
    response: response,
    message: message,
  };
};
const userLoginHistory_Fail = (message) => {
  return {
    type: actions.GET_USER_LOGIN_HISTORY_FAIL,
    message: message,
  };
};

const userLoginHistory_Api = (navigate, t, Data, loader) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(userLoginHistory_Init(loader));
    let form = new FormData();
    form.append("RequestMethod", UserLoginHistoryRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(userLoginHistory_Api(navigate, t, Data, loader));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetUserLoginHistory_01".toLowerCase()
                )
            ) {
              dispatch(
                userLoginHistory_Success(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetUserLoginHistory_02".toLowerCase()
                )
            ) {
              dispatch(userLoginHistory_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetUserLoginHistory_03".toLowerCase()
                )
            ) {
              dispatch(userLoginHistory_Fail(t("Something-went-wrong")));
            } else {
              dispatch(userLoginHistory_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(userLoginHistory_Fail(t("No-data-available")));
          }
        } else {
          dispatch(userLoginHistory_Fail(t("No-data-available")));
        }
      })
      .catch((response) => {
        dispatch(userLoginHistory_Fail(t("No-data-available")));
      });
  };
};

export { userLoginHistory_Api };
