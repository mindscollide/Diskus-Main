import * as actions from "../action_types";
import { postComment } from "../../commen/apis/Api_config";
import { toDoListApi } from "../../commen/apis/Api_ends_points";

import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";

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
const postAssgineeComment = (navigate, data, t) => {
  return (dispatch) => {
    let form = new FormData();
    form.append("RequestMethod", postComment.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance.post(toDoListApi,form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(postAssgineeComment(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_CreateComment_01".toLowerCase()
                )
            ) {
              await dispatch(
                postCommentsSuccess(
                  response.data.responseResult,
                  t("Comment-added-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_CreateComment_02".toLowerCase()
                )
            ) {
              dispatch(postCommentFail("Comment-not-added-successfully"));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_CreateComment_03".toLowerCase()
                )
            ) {
              dispatch(postCommentFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(postCommentFail(t("Something-went-wrong")));
            dispatch(SetLoaderFalse());
          }
        } else {
          dispatch(postCommentFail(t("Something-went-wrong")));
          dispatch(SetLoaderFalse());
        }
      })
      .catch(() => {
        dispatch(SetLoaderFalse());
        dispatch(postCommentFail(t("Something-went-wrong")));
      });
  };
};
const postComments = (response) => {
  return {
    type: actions.POST_COMMENTS,
    response: response,
  };
};
const emptyCommentState = () => {
  return {
    type: actions.EMPTYCOMMENTSFROMMQTT,
  };
};
const deleteCommentsMQTT = (response) => {
  console.log(
    response,
    "postAssigneeCommentspostAssigneeCommentspostAssigneeComments121212"
  );
  return {
    type: actions.DELETE_COMMENTS,
    response: response,
  };
};
export {
  postAssgineeComment,
  HideNotificationTodoComment,
  postComments,
  deleteCommentsMQTT,
  emptyCommentState,
};
