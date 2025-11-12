import { authenticationApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import axios from "axios";
import { getSubscriptionDetailRequestMethod } from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";

const getSubscriptionDetailInit = () => {
  return {
    type: actions.GETSUBSCRIPTIONPACAKGES_INIT,
  };
};
const getSubscriptionDetailSuccess = (response, message) => {
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
  return (dispatch) => {
    dispatch(getSubscriptionDetailInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getSubscriptionDetailRequestMethod.RequestMethod
    );
    axiosInstance.post(authenticationApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getSubscriptionDetails(navigate, t));
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
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetSubscriptionPackages_02".toLowerCase()
                )
            ) {
              dispatch(getSubscriptionDetailFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_GetSubscriptionPackages_03".toLowerCase()
                )
            ) {
              dispatch(getSubscriptionDetailFail(""));
            }
          } else {
            dispatch(getSubscriptionDetailFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getSubscriptionDetailFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getSubscriptionDetailFail(t("Something-went-wrong")));
      });
  };
};

export { getSubscriptionDetails, cleareMessageSubsPac };
