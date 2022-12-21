import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { updateUserGeneralSetting } from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import axios from "axios";
import { getUserSetting } from "../actions/GetUserSetting";
const updateUserGeneralSettinginit = () => {
  return {
    type: actions.UPDATEUSERGENERALSETTING_INIT,
  };
};
const updateUserGeneralSettingsuccess = (message, response) => {
  return {
    type: actions.UPDATEUSERGENERALSETTING_SUCCESS,
    response: response,
    message: message,
  };
};
const updateUserGeneralSettingfail = (message, response) => {
  return {
    type: actions.UPDATEUSERGENERALSETTING_FAIL,
    message: message,
    response: response,
  };
};
const updateUserGeneralSettingFunc = (userGeneralSettingData) => {
  console.log("userGeneralSettingData", userGeneralSettingData);
  let token = JSON.parse(localStorage.getItem("token"));
  let currentUserID = localStorage.getItem("UserID");
  let Data = {
    UserGeneralSettings: {
      PK_UGSID: userGeneralSettingData.PK_UGSID,
      FK_TZID: userGeneralSettingData.FK_TZID,
      FK_CCID: userGeneralSettingData.FK_CCID,
      IsSynchronizeDocument: userGeneralSettingData.IsSynchronizeDocument,
      AutomaticallyMeetingEndTime: JSON.parse(
        userGeneralSettingData.AutomaticallyMeetingEndTime
      ),
      FK_UID: userGeneralSettingData.FK_UID,
    },
  };
  return (dispatch) => {
    dispatch(updateUserGeneralSettinginit());
    let form = new FormData();
    form.append("RequestMethod", updateUserGeneralSetting.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("update general user response", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              updateUserGeneralSettingsuccess(
                response.data.responseResult.responseMessage,
                response.data.responseResult
              )
            );
            await dispatch(getUserSetting(JSON.parse(currentUserID)));
          } else {
            dispatch(updateUserGeneralSettingfail());
          }
        } else {
          dispatch(updateUserGeneralSettingfail(response.data.responseMessage));
        }
      })
      .catch((response) => {
        dispatch(updateUserGeneralSettingfail(response.data.responseMessage));
        console.log("catch response", response);
      });
  };
};

export default updateUserGeneralSettingFunc;
