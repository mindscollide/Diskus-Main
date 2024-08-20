import axios from "axios";
import { paymentMethodsRequestMethod } from "../../commen/apis/Api_config";
import * as actions from "../action_types";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";

const getPaymentMethod_init = () => {
  return {
    type: actions.GET_PAYMENT_METHODS_INIT,
  };
};
const getPaymentMethod_success = (response, message) => {
  return {
    type: actions.GET_PAYMENT_METHODS_SUCCESS,
    response: response,
    message: message,
  };
};
const getPaymentMethod_fail = (message) => {
  return {
    type: actions.GET_PAYMENT_METHODS_FAIL,
    message: message,
  };
};
const getPaymentMethodApi = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(getPaymentMethod_init());
    let form = new FormData();
    form.append("RequestMethod", paymentMethodsRequestMethod.RequestMethod);
    await axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then((response) => {
        if (response.data.responseCode === 417) {
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetPaymentMethods_01".toLowerCase()
                )
            ) {
              dispatch(
                getPaymentMethod_success(
                  response.data.responseResult.paymentMethod,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetPaymentMethods_02".toLowerCase()
                )
            ) {
              dispatch(getPaymentMethod_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_GetPaymentMethods_03".toLowerCase()
                )
            ) {
              dispatch(getPaymentMethod_fail(t("Something-went-wrong")));
            } else {
              dispatch(getPaymentMethod_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getPaymentMethod_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getPaymentMethod_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(getPaymentMethod_fail(t("Something-went-wrong")));
      });
  };
};
export default getPaymentMethodApi;
