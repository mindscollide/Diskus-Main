/**
 * @file Auth_Changes_Password.js
 * @description Redux thunk action for changing a user's password.
 * Wraps `authenticationApi` (changepassword request method).
 * Dispatches: CHANGE_PASSWORD_INIT, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAIL.
 */

import * as actions from "../action_types";
import { changepassword } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import axiosInstance from "../../commen/functions/axiosInstance";

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

/**
 * Submits a password-change request using the user's current and new credentials.
 * @param {Object} changePasswordData - Object with UserID, Email, Password, ConfirmPassword.
 * @param {Function} navigate - React Router navigate function (redirects on success).
 * @returns {Function} Redux thunk dispatching CHANGE_PASSWORD_INIT/SUCCESS/FAIL.
 */
const changePasswordFunc = (changePasswordData, navigate) => {
  let Data = {
    UserID: changePasswordData.UserID,
    Email: changePasswordData.Email,
    Password: changePasswordData.Password,
    ConfirmPassword: changePasswordData.ConfirmPassword,
    DeviceID: "1",
  };

  return (dispatch) => {
    dispatch(changepasswordinit());

    let form = new FormData();
    form.append("RequestMethod", changepassword.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(authenticationApi, form)

      .then((response) => {
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
        //
        dispatch(changepasswordfail(response.data));
      });
  };
};

export default changePasswordFunc;
