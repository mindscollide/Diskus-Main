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
const deleteOrganizationAction = (t) => {
    return (dispatch) => {
        dispatch(deleteOrganizationInit());
        let form = new FormData();
        form.append("RequestData", JSON.stringify(data));
        form.append("RequestMethod", deleteOrganizationAPI.RequestMethod);
        axios({
          method: "post",
          url: getAdminURLs,
          data: form,
        })
          .then((response) => {
            if (response.data.responseCode === 417) {
                dispatch(RefreshToken(props))
              } else if(response.data.respoonseResult.isExecuted === true) {
                if(response.data.respoonseResult.responseMessage.toLowerCase().includes("Admin_AdminServiceManager_DeleteOrganization_01".toLowerCase())) {

                } else if(response.data.respoonseResult.responseMessage.toLowerCase().includes("Admin_AdminServiceManager_DeleteOrganization_02".toLowerCase())) {
                    dispatch(deleteOrganizationSuccess(response.data.respoonseResult , t("")))
                } else if(response.data.respoonseResult.responseMessage.toLowerCase().includes("Admin_AdminServiceManager_DeleteOrganization_03".toLowerCase())) {

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