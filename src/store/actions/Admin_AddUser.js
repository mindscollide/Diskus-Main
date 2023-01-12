import * as actions from "../action_types";
import axios from 'axios'


const addUserInit = () => {
  return {
    type: actions.ADMIN_ADDUSER_INIT,
  };
};

const addUserSuccess = (response, message) => {
  return {
    type: actions.ADMIN_ADDUSER_SUCCESS,
    response: response,
    message: message,
  };
};

const addUserFail = (response, message) => {
  return {
    type: actions.ADMIN_ADDUSER_FAIL,
    response: response,
    message: message,
  };
};

const addUserAction = (Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {

    dispatch(addUserInit())
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: authenticationApi,
      data: form,
    })
      .then(async (response) => {
        if(response.data.responseResult.isExecuted === true) {
          dispatch(addUserSuccess(response.data.responseResult, response.data.responseResult.ResponseMessage))
        } else {
          dispatch(addUserFail())
        }
      })
      .catch((response) => {
        dispatch(addUserFail())
      });
  };
}

export {addUserAction}