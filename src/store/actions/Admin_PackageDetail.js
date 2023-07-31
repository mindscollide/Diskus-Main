import axios from "axios";
import { GetOrganizationSeletedPackageByOrganizationID } from "../../commen/apis/Api_config";
import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import { RefreshToken } from "./Auth_action";

const packageDetailInit = () => {
  return {
    type: actions.GETSUBSCRIBEORGANIZATIONPACKAGE_INIT,
  };
};

const packageDetailSuccess = (response, message) => {
  return {
    type: actions.GETSUBSCRIBEORGANIZATIONPACKAGE_SUCCESS,
    response: response,
    message: message,
  };
};

const packageDetailFail = (message) => {
  return {
    type: actions.GETSUBSCRIBEORGANIZATIONPACKAGE_FAIL,
    message: message,
  };
};

const getSubscribeOrganizationPackage = (navigate, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let organizationID = JSON.parse(localStorage.getItem("organizationID"));
  let data = { OrganizationID: organizationID };
  return (dispatch) => {
    dispatch(packageDetailInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      GetOrganizationSeletedPackageByOrganizationID.RequestMethod
    );
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("getSubscribeOrganizationPackage", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t))
          dispatch(getSubscribeOrganizationPackage(navigate, t))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "responseresponseresponse");
            if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetOrganizationSeletedPackageByOrganizationID_01"
            ) {
              dispatch(
                packageDetailSuccess(
                  response.data.responseResult,
                  t("Record-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetOrganizationSeletedPackageByOrganizationID_02"
            ) {
              dispatch(
                packageDetailFail(
                  t("No-records-found")
                )
              );
            } else if (
              response.data.responseResult.responseMessage ===
              "Admin_AdminServiceManager_GetOrganizationSeletedPackageByOrganizationID_03"
            ) {
              dispatch(
                packageDetailFail(
                  t("No-records-found")
                )
              );
            }
          } else {
            dispatch(
              packageDetailFail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            packageDetailFail(
              t("No-records-found")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          packageDetailFail(
            t("Something-went-wrong")
          )
        );
      });
  };
};
export { getSubscribeOrganizationPackage };
