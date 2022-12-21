import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { getUserSettings } from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import axios from "axios";

const settingInit = () => {
  return {
    type: actions.GETSETTING_INIT,
  };
};
const settingSuccess = (response) => {
  return {
    type: actions.GETSETTING_SUCCESS,
    response: response,
  };
};
const settingFail = (response) => {
  return {
    type: actions.GETSETTING_FAIL,
    response: response,
  };
};
const setRecentActivity = (response) => {
  return {
    type: actions.SETRECENTACTIVITYNOTIFICATION,
    response: response,
  };
};
const getUserSetting = (userID) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let userSettingData = {
    UserID: userID,
  };
  return (dispatch) => {
    dispatch(settingInit());
    let form = new FormData();
    form.append("RequestMethod", getUserSettings.RequestMethod);
    form.append("RequestData", JSON.stringify(userSettingData));
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
          await dispatch(RefreshToken());
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(settingSuccess(response.data.responseResult));
          } else {
            dispatch(settingFail(response.data.responseMessage));
          }
        } else {
          dispatch(settingFail(response.data.responseMessage));
        }
      })
      .catch((response) => {
        dispatch(settingFail(response.data.responseMessage));
      });
  };
};

export { getUserSetting, setRecentActivity };
