import { authenticationApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import axios from "axios";
import { getSubscriptionDetailRequestMethod } from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";

const getSubscriptionDetailInit = () => {
  return {
    type: actions.GETSUBSCRIPTIONPACAKGES_INIT,
  };
};
const getSubscriptionDetailSuccess = (response, message) => {
  console.log(response, message, " responseSuccess");
  return {
    type: actions.GETSUBSCRIPTIONPACAKGES_SUCCESS,
    response: response,
    message: message,
  };
};

const getSubscriptionDetailFail = (message) => {
  return {
    type: actions.GETSUBSCRIPTIONPACAKGES_FAIL,
    message: message,
  };
};
const cleareMessageSubsPac = () => {
  return {
    type: actions.CLEARE_MESSAGE_SUBSPACK,
  };
};

const getSubscriptionDetails = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getSubscriptionDetailInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getSubscriptionDetailRequestMethod.RequestMethod
    );
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "responseresponse");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(getSubscriptionDetails(navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetSubscriptionPackages_01".toLowerCase()
                )
            ) {
              dispatch(
                getSubscriptionDetailSuccess(
                  response.data.responseResult.subscriptionPackages,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetSubscriptionPackages_02".toLowerCase()
                )
            ) {
              dispatch(getSubscriptionDetailFail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetSubscriptionPackages_03".toLowerCase()
                )
            ) {
              dispatch(getSubscriptionDetailFail(t("No-data-available")));
            }
          } else {
            dispatch(getSubscriptionDetailFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getSubscriptionDetailFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "responseresponse");
        dispatch(getSubscriptionDetailFail(t("Something-went-wrong")));
      });
  };
};

export { getSubscriptionDetails, cleareMessageSubsPac };
