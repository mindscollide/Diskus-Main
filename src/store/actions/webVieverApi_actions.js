import * as actions from "../action_types";
import { toDoListApi } from "../../commen/apis/Api_ends_points";
import {
  addAnnotationOnToDoAttachement,
  getAnnotationOfToDoAttachement,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import axios from "axios";
// for get annotations
const GetAnnotationsOfToDoAttachementinit = () => {
  return {
    type: actions.GETANNOTATIONSOFTODOATTACHEMENT_INIT,
  };
};

const GetAnnotationsOfToDoAttachementSuccess = (
  message,
  xfdfData,
  attachmentBlob
) => {
  console.log("blobToUint8Array", xfdfData, attachmentBlob);
  return {
    type: actions.GETANNOTATIONSOFTODOATTACHEMENT_SUCCESS,
    xfdfData: xfdfData,
    attachmentBlob: attachmentBlob,
    message: message,
  };
};

const GetAnnotationsOfToDoAttachementFail = (message) => {
  return {
    type: actions.GETANNOTATIONSOFTODOATTACHEMENT_FAIL,
    message: message,
  };
};

const getAnnotationsOfToDoAttachement = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(GetAnnotationsOfToDoAttachementinit());
    let form = new FormData();
    form.append("RequestMethod", getAnnotationOfToDoAttachement.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    await axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAnnotationsOfToDoAttachement(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetAnnotationOfToDoAttachement_01".toLowerCase()
                )
            ) {
              console.log("blobToUint8Array", response.data.responseResult);
              let xfdfData = response.data.responseResult.annotationString;
              let attachmentBlob = response.data.responseResult.attachmentBlob;
              console.log("blobToUint8Array", xfdfData, attachmentBlob);
              dispatch(
                GetAnnotationsOfToDoAttachementSuccess(
                  t("Successful"),
                  xfdfData,
                  attachmentBlob
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetAnnotationOfToDoAttachement_02".toLowerCase()
                )
            ) {
              dispatch(GetAnnotationsOfToDoAttachementFail(t("UnSuccessful")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_GetAnnotationOfToDoAttachement_03".toLowerCase()
                )
            ) {
              dispatch(
                GetAnnotationsOfToDoAttachementFail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                GetAnnotationsOfToDoAttachementFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              GetAnnotationsOfToDoAttachementFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            GetAnnotationsOfToDoAttachementFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetAnnotationsOfToDoAttachementFail(t("Something-went-wrong"))
        );
      });
  };
};

// for add annotations
const AddAnnotationsOnToDoAttachementinit = () => {
  return {
    type: actions.ADDANNOTATIONSONTODOATTACHEMENT_INIT,
  };
};

const AddAnnotationsOnToDoAttachementSuccess = (message) => {
  return {
    type: actions.ADDANNOTATIONSONTODOATTACHEMENT_SUCCESS,
    message: message,
  };
};

const AddAnnotationsOnToDoAttachementFail = (message) => {
  return {
    type: actions.ADDANNOTATIONSONTODOATTACHEMENT_FAIL,
    message: message,
  };
};

const addAnnotationsOnToDoAttachement = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(AddAnnotationsOnToDoAttachementinit());
    let form = new FormData();
    form.append("RequestMethod", addAnnotationOnToDoAttachement.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    await axios({
      method: "post",
      url: toDoListApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(addAnnotationsOnToDoAttachement(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_AddAnnotationOnToDoAttachement_01".toLowerCase()
                )
            ) {
              dispatch(AddAnnotationsOnToDoAttachementSuccess(t("Annotation-added")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_AddAnnotationOnToDoAttachement_02".toLowerCase()
                )
            ) {
              dispatch(AddAnnotationsOnToDoAttachementFail(t("Annotation-updated")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_AddAnnotationOnToDoAttachement_03".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnToDoAttachementFail(t("No-record-inserted"))
              );
            }else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_AddAnnotationOnToDoAttachement_04".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnToDoAttachementFail(t("No-record-updated"))
              );
            } else {
              dispatch(
                AddAnnotationsOnToDoAttachementFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              AddAnnotationsOnToDoAttachementFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            AddAnnotationsOnToDoAttachementFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          AddAnnotationsOnToDoAttachementFail(t("Something-went-wrong"))
        );
      });
  };
};
const GetAnnotationsOfToDoAttachementMessageCleare = () => {
  return {
    type: actions.GETANNOTATIONSOFTODOATTACHEMENT_MESSAGE_CLEARE,
  };
};
export {
  getAnnotationsOfToDoAttachement,
  addAnnotationsOnToDoAttachement,
  GetAnnotationsOfToDoAttachementMessageCleare,
};
