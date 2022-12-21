import * as actions from "../action_types";
import { forgetpassword } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const forgotPasswordInit = () => {
  return {
    type: actions.FORGOT_PASSWORD_INIT,
  };
};

const forgotPasswordSuccess = (response, message) => {
  return {
    type: actions.FORGOT_PASSWORD_SUCCESS,
    response: response,
  };
};

const forgotPasswordFail = (response, message) => {
  return {
    type: actions.FORGOT_PASSWORD_FAIL,
    response: response,
  };
};

const changePasswordRequest = (email, navigate) => {
  console.log(email);
  var min = 10000;
  var max = 90000;
  var id = min + Math.random() * (max - min);
  let Data = {
    Email: email,
    DeviceID: id.toString(),
    Device: "browser",
  };
  console.log(Data);
  return (dispatch) => {
    dispatch(forgotPasswordInit());
    let form = new FormData();
    form.append("RequestMethod", forgetpassword.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        console.log("changePasswordRequest", response);
        if (response.data.responseResult.isExecuted === true) {
          localStorage.setItem("Email", response.data.responseResult.email);
          localStorage.setItem("UserID", response.data.responseResult.userID);
          dispatch(
            forgotPasswordSuccess(
              response.data.responseResult,
              response.data.responseMessage
            )
          );
          navigate("/verification");
        } else {
          dispatch(forgotPasswordFail(response.data.responseResult));
        }
      })
      .catch((response) => {
        dispatch(forgotPasswordFail(response));
        //   dispatch(SomeThingWentWrong(response));
      });
  };
};

export default changePasswordRequest;
