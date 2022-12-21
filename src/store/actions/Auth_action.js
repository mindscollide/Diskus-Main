import * as actions from "../action_types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authenticationRefreshToken } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import { signOut } from "./Auth_Sign_Out";

// Refresh Token
const refreshtokenFail = (response, message) => {
  console.log("RefreshToken", response, message);
  return {
    type: actions.REFRESH_TOKEN_FAIL,
    response: response,
    message: message,
  };
};

const refreshtokenSuccess = (response, message) => {
  return {
    type: actions.REFRESH_TOKEN_SUCCESS,
    response: response,
    message: message,
  };
};

const RefreshToken = (props) => {
  const navigate = useNavigate();
  console.log("RefreshToken", props);
  let Token = JSON.parse(localStorage.getItem("token"));
  let RefreshToken = JSON.parse(localStorage.getItem("RefreshToken"));
  console.log("RefreshToken", Token, RefreshToken);
  let Data = {
    Token: Token,
    RefreshToken: RefreshToken,
  };
  console.log("RefreshToken", Data);
  return async (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", authenticationRefreshToken.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then(async (response) => {
        console.log("RefreshToken", response);
        if (response.data.responseCode === 200) {
          await dispatch(
            refreshtokenSuccess(
              response.data.responseResult,
              "Refresh Token Update Successfully"
            )
          );
        } else {
          console.log("RefreshToken", response);
          let message2 = "Your Session has expired. Please login again";
          dispatch(signOut(navigate, message2));
          await dispatch(
            refreshtokenFail(
              response.data.responseResult,
              "Your Session has expired. Please login again."
            )
          );
        }
      })
      .catch((response) => {
        // dispatch(SomeThingWentWrong(response));
      });
  };
};

// Clearing states on click of Button
const clearState = (history) => {
  return {
    type: actions.CLEAR_STATE_BACK,
  };
};

const HideNotificationAuth = () => {
  return {
    type: actions.HIDE,
  };
};

export { RefreshToken, clearState, HideNotificationAuth };
