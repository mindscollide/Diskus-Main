import axios from "axios";
import * as actions from "../action_types";
import { searchPaymentHistoryRequestMethod } from "../../commen/apis/Api_config";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";

const searchPaymentHistory_init = () => {
  return {
    type: actions.SEARCH_PAYMENT_HISTORY_INIT,
  };
};
const searchPaymentHistory_success = (response, message) => {
  return {
    type: actions.SEARCH_PAYMENT_HISTORY_SUCCESS,
    response: response,
    message: message,
  };
};
const searchPaymentHistory_fail = (message) => {
  return {
    type: actions.SEARCH_PAYMENT_HISTORY_FAIL,
    message: message,
  };
};

const searchPaymentHistoryApi = (
  navigate,
  searchData,
  t,
  setPaymentHistoryModal,
  no
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
  let Data = {
    OrganizationID: OrganizationID,
    InvoiceNo: searchData.InvoiceNo,
    InvoiceStartDate: searchData.InvoiceStartDate,
    InvoiceEndDate: searchData.InvoiceEndDate,
    PaymentStartDate: searchData.PaymentStartDate,
    PaymentEndDate: searchData.PaymentEndDate,
    PaymentID: searchData.PaymentID,
    IsLateSurcharge: searchData.IsLateSurcharge,
  };
  return (dispatch) => {
    dispatch(searchPaymentHistory_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      searchPaymentHistoryRequestMethod.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            searchPaymentHistoryApi(
              navigate,
              searchData,
              t,
              setPaymentHistoryModal
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_InvoicesAndPaymentHistory_01".toLowerCase()
                )
            ) {
              dispatch(
                searchPaymentHistory_success(
                  response.data.responseResult,
                  ""
                )
              );
              if (no === 1) {
                setPaymentHistoryModal(false);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_InvoicesAndPaymentHistory_02".toLowerCase()
                )
            ) {
              dispatch(searchPaymentHistory_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_InvoicesAndPaymentHistory_03".toLowerCase()
                )
            ) {
              dispatch(searchPaymentHistory_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(searchPaymentHistory_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(searchPaymentHistory_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(searchPaymentHistory_fail(t("Something-went-wrong")));
      });
  };
};

export default searchPaymentHistoryApi;
