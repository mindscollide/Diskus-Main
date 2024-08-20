import { getCountryNames } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import axios from "axios";
import { setLoader } from "./Auth2_actions";
import { RefreshToken } from "./Auth_action";

const getCountryNamesInit = () => {
  return {
    type: actions.COUNTRYNAMES_INIT,
  };
};

const getCountryNameSuccess = (response, message) => {
  return {
    type: actions.COUNTRYNAMES_SUCCESS,
    response: response,
    message: message,
  };
};

const getCountryNameFail = (message) => {
  return {
    type: actions.COUNTRYNAMES_FAIL,
    message: message,
  };
};

const getCountryNamesAction = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(getCountryNamesInit());
    let form = new FormData();
    form.append("RequestMethod", getCountryNames.RequestMethod);
    await axios({
      method: "post",
      url: authenticationApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          dispatch(RefreshToken(navigate, t));
          await dispatch(getCountryNamesAction(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetWorldCountries_01".toLowerCase()
                )
            ) {
              await dispatch(
                getCountryNameSuccess(
                  response.data.responseResult.worldCountries,
                  ""
                )
              );

              dispatch(setLoader(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetWorldCountries_02".toLowerCase()
                )
            ) {
              dispatch(getCountryNameFail("Something-went-wrong"));
              dispatch(setLoader(false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetWorldCountries_03".toLowerCase()
                )
            ) {
              dispatch(getCountryNameFail(""));
              dispatch(setLoader(false));
            } else {
              dispatch(getCountryNameFail("Something-went-wrong"));
              dispatch(setLoader(false));
            }
          } else {
            dispatch(getCountryNameFail("Something-went-wrong"));
            dispatch(setLoader(false));
          }
        }
      })
      .catch((response) => {
        dispatch(getCountryNameFail("Something-went-wrong"));
        dispatch(setLoader(false));
      });
  };
};

export { getCountryNamesAction };
