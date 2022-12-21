import * as actions from "../action_types";
import { changepassword } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";

const changepasswordinit = () => {
  return {
    type: actions.CHANGE_PASSWORD_INIT,
  };
};

const changepasswordsuccess = (message, response) => {
  return {
    type: actions.CHANGE_PASSWORD_SUCCESS,
    message: message,
    response: response,
  };
};

const changepasswordfail = (message, response) => {
  return {
    type: actions.CHANGE_PASSWORD_FAIL,
    message: message,
    response: response,
  };
};

const changePasswordFunc = (changePasswordData, navigate) => {
  console.log(changePasswordData);
  let Data = {
    UserID: changePasswordData.UserID,
    Email: changePasswordData.Email,
    Password: changePasswordData.Password,
    ConfirmPassword: changePasswordData.ConfirmPassword,
    DeviceID: "browser",
  };
  console.log("changePasswordFunc in", Data);

  return (dispatch) => {
    dispatch(changepasswordinit());
    console.log("changePasswordFunc in 1", Data);
    let form = new FormData();
    form.append("RequestMethod", changepassword.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        console.log("changePasswordFunc", response);
        if (response.data.responseResult.isExecuted === true) {
          dispatch(
            changepasswordsuccess(
              response.data.responseResult,
              response.data.responseMessage
            )
          );
          navigate("/updatePasswordSuccess");
        } else {
          dispatch(changepasswordfail(response.data.responseResult));
        }
      })
      .catch((response) => {
        // console.log("error", error);
        dispatch(changepasswordfail(response.data));
      });
  };
};

export default changePasswordFunc;
