import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import * as actions from "../action_types";

import { deleteOrganizationAPI } from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";

const deleteOrganizationInit = () => {
  return {
    type: actions.DELETE_ORGANIZATION_INIT,
  };
};
const deleteOrganizationSuccess = (response, message) => {
  return {
    type: actions.DELETE_ORGANIZATION_SUCCESS,
    response: response,
    message: message,
  };
};
const deleteOrganizationfail = (message) => {
  return {
    type: actions.DELETE_ORGANIZATION_FAIL,
    message: message,
  };
};
const deleteOrganizationAction = (
  navigate,
  Data,
  t,
  setDeleteSuccesModal,
  setDeleteModal,
  setDeleteConfirmModal
) => {
  
  return (dispatch) => {
    dispatch(deleteOrganizationInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", deleteOrganizationAPI.RequestMethod);
    axiosInstance.post(getAdminURLs,form)
  
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            deleteOrganizationAction(
              navigate,
              Data,
              t,
              setDeleteSuccesModal,
              setDeleteModal,
              setDeleteConfirmModal
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_DeleteOrganization_01".toLowerCase()
                )
            ) {
              dispatch(
                deleteOrganizationfail(
                  t("You-are-not-an-admin-please-contact-support")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_DeleteOrganization_02".toLowerCase()
                )
            ) {
              dispatch(
                deleteOrganizationSuccess(
                  response.data.responseResult,
                  t("Organization-deleted-successfully")
                )
              );

              localStorage.removeItem("deleteContent");
              setDeleteConfirmModal(false);
              navigate("/");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_DeleteOrganization_03".toLowerCase()
                )
            ) {
              dispatch(t("Failed-to-delete-organization-user"));
              setDeleteConfirmModal(true);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Admin_AdminServiceManager_DeleteOrganization_04".toLowerCase()
                )
            ) {
              dispatch(t("Something-went-wrong"));
            }
          } else {
            dispatch(deleteOrganizationfail(t("Something-went-wrong")));
          }
        } else {
          dispatch(deleteOrganizationfail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(deleteOrganizationfail(t("Something-went-wrong")));
      });
  };
};

export default deleteOrganizationAction;
