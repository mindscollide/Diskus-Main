import { getAdminURLs } from "../../commen/apis/Api_ends_points";
import * as actions from '../action_types'
import axios from "axios";
import { deleteOrganizationAPI } from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";



const deleteOrganizationInit = () => {
  return {
    type: actions.DELETE_ORGANIZATION_INIT
  }
}
const deleteOrganizationSuccess = (response, message) => {
  return {
    type: actions.DELETE_ORGANIZATION_SUCCESS,
    response: response,
    message: message
  }
}
const deleteOrganizationfail = (message) => {
  return {
    type: actions.DELETE_ORGANIZATION_FAIL,
    message: message
  }
}
const deleteOrganizationAction = (Data, t, setDeleteSuccesModal, setDeleteModal, setDeleteConfirmModal, navigate) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(deleteOrganizationInit());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", deleteOrganizationAPI.RequestMethod);
    axios({
      method: "post",
      url: getAdminURLs,
      data: form,
      headers: {
        _token: token
      }
    })
      .then((response) => {
        console.log("asdasdasd", response)
        if (response.data.responseCode === 417) {
          console.log("asdasdasd", response)
          // dispatch(RefreshToken(props))
        } else if (response.data.responseCode === 200) {
          console.log("asdasdasd", response)
          if (response.data.responseResult.isExecuted === true) {
            console.log("asdasdasd", response)
            if (response.data.responseResult.responseMessage.toLowerCase().includes("Admin_AdminServiceManager_DeleteOrganization_01".toLowerCase())) {
              dispatch(deleteOrganizationfail(t("You-are-not-an-admin-please-contact-support")))
            } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Admin_AdminServiceManager_DeleteOrganization_02".toLowerCase())) {
              dispatch(deleteOrganizationSuccess(response.data.responseResult, t("Organization-deleted-successfully")))
              console.log("asdasdasd", response)
              localStorage.removeItem("deleteContent")
              setDeleteConfirmModal(false)
              navigate("/")
            } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Admin_AdminServiceManager_DeleteOrganization_03".toLowerCase())) {
              dispatch(t("Failed-to-delete-organization-user"))
              setDeleteConfirmModal(true)
            } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Admin_AdminServiceManager_DeleteOrganization_04".toLowerCase())) {
              dispatch(t("Something-went-wrong"))
            }
          } else {
            dispatch(deleteOrganizationfail(t("Something-went-wrong")))
          }
        } else {
          dispatch(deleteOrganizationfail(t("Something-went-wrong")))
        }
      })
      .catch((response) => {
        dispatch(deleteOrganizationfail(t("Something-went-wrong")))
      });
  };
}


export default deleteOrganizationAction