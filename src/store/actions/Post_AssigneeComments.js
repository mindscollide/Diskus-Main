import * as actions from "../action_types";
import { postComment } from "../../commen/apis/Api_config";
import { toDoListApi } from "../../commen/apis/Api_ends_points";
import axios from "axios";
import { RefreshToken } from "./Auth_action";

const HideNotificationTodoComment = () => {
  return {
    type: actions.HIDE,
  };
};

const SetLoaderFalse = () => {
  return {
    type: actions.SET_LOADER_FALSE,
  };
};

const postCommentsInit = () => {
  return {
    type: actions.POST_ASSIGNEEECOMMENTS_INIT,
  };
};

const postCommentsSuccess = (response, message) => {
  return {
    type: actions.POST_ASSIGNEEECOMMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

const postCommentFail = (message) => {
  return {
    type: actions.POST_ASSIGNEEECOMMENTS_FAIL,
    message: message,
  };
};
const postAssgineeComment = (data, t) => {
  console.log("datadatadata", data);
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    // dispatch(postCommentsInit());
    let form = new FormData();
    form.append("RequestMethod", postComment.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("responseresponseresponse", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(t));
          dispatch(postCommentsInit());
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            let userID = localStorage.getItem("userID");
            console.log("userIDuserIDuserIDuserID", userID);
            await dispatch(
              postCommentsSuccess(
                response.data.responseResult,
                response.data.responseMessage
              )
            );
          } else {
            dispatch(postCommentFail(response.data.responseMessage));
            dispatch(SetLoaderFalse());
          }
        } else {
          dispatch(postCommentFail(response.data.responseMessage));
          dispatch(SetLoaderFalse());
        }
      })
      .catch(() => {
        dispatch(SetLoaderFalse());
      });
  };
};
const postComments = (response) => {
  return {
    type: actions.POST_COMMENTS,
    response: response,
  };
};
export { postAssgineeComment, HideNotificationTodoComment, postComments };
