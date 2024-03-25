import { SaveOrganizationAndPakageSelection } from "../../commen/apis/Api_config";
import { authenticationApi } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";
import axios from "axios";

const createOrganizationAndPakageSelectionInit = () => {
  return {
    type: actions.SAVE_ORGANIZATIONAND_SELECTEDPAKGE_USERMANAGEMENT_INIT,
  };
};

const createOrganizationAndPakageSelectionSuccess = (response, message) => {
  return {
    type: actions.SAVE_ORGANIZATIONAND_SELECTEDPAKGE_USERMANAGEMENT_SUCCESS,
    response: response,
    message: message,
  };
};

const createOrganizationAndPakageSelectionFailed = (message) => {
  return {
    type: actions.SAVE_ORGANIZATIONAND_SELECTEDPAKGE_USERMANAGEMENT_FAIL,
    message: message,
  };
};

const signUpOrganizationAndPakageSelection = (data, navigate, t) => {
  return (dispatch) => {
    dispatch(createOrganizationAndPakageSelectionInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append(
      "RequestMethod",
      SaveOrganizationAndPakageSelection.RequestMethod
    );
    axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then((response) => {
        if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_01".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationAndPakageSelectionSuccess(
                  response.data.responseResult,
                  t("Organization-and-admin-created-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_02".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationAndPakageSelectionSuccess(
                  response.data.responseResult,
                  t(
                    "Organization-and-admin-created-successfully-but-failed-to-send-OTP"
                  )
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_03".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationAndPakageSelectionFailed(
                  t("Email-already-exists")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_04".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationAndPakageSelectionFailed(
                  t("Organization-name-already-taken")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_SaveOrganizationsAndSelectedPackage_05".toLowerCase()
                )
            ) {
              dispatch(
                createOrganizationAndPakageSelectionFailed(
                  t("Failed-to-save-organization")
                )
              );
            } else {
              dispatch(
                createOrganizationAndPakageSelectionFailed(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              createOrganizationAndPakageSelectionFailed(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            createOrganizationAndPakageSelectionFailed(
              t("Something-went-wrong")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(
          createOrganizationAndPakageSelectionFailed(t("Something-went-wrong"))
        );
      });
  };
};

export { signUpOrganizationAndPakageSelection };
