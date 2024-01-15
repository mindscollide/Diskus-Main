import { signuprequest } from "../../commen/apis/Api_config";
import * as actions from "../action_types";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import { Navigate } from "react-router-dom";

const signupInit = (response, message) => {
  return {
    type: actions.SIGN_UP_INIT,
    response: response,
    message: message,
  };
};
const signUpSuccess = (response, message) => {
  return {
    type: actions.SIGN_UP_SUCCESS,
    response: response,
    message: message,
  };
};
const signUpFail = (response, message) => {
  return {
    type: actions.SIGN_UP_FAIL,
    response: response,
    message: message,
  };
};

const signUp = (UserData, navigate, t) => {
  let Data = {
    Name: UserData.name.content,
    Designation: UserData.designation.content,
    ProfilePicture: "",
    Organization: UserData.organization.content,
    Email: UserData.email.content,
    Password: UserData.password.content,
    PersonalNumber: UserData.phoneNumber.content,
    CountryCode: UserData.countryCode.content,
    RoleID: 1,
  };

  return (dispatch) => {
    dispatch(signupInit());
    let form = new FormData();
    form.append("RequestMethod", signuprequest.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then(async (response) => {
        if (response.data.responseResult.isExecuted === true) {
          await dispatch(
            signUpSuccess(
              response.data.responseResult,
              response.data.responseResult.responseMessage
            )
          );
          localStorage.setItem("Email", JSON.stringify(Data.Email));
          //   dispatch(clearestateBackbutton);
          navigate("/verificationSignUp/");
          // <Navigate to="/verificationSignUp/" replace={true} />;
        } else {
          if (
            response.data.responseResult.responseMessage ===
            "ERM_AuthService_SignUpManager_SignUp_04"
          ) {
            await dispatch(
              signUpFail(response.data.responseResult, t("Email-already-exist"))
            );
          }
        }
      })
      .catch((response) => {});
  };
};

export { signUp };
