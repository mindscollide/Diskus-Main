import * as actions from "../action_types";
import {
  toDoListApi,
  getNotesApi,
  getResolutionApi,
  dataRoomApi,
} from "../../commen/apis/Api_ends_points";
import {
  addAnnotationOnToDoAttachement,
  getAnnotationOfToDoAttachement,
  getAnnotationOfNotesAttachment,
  addAnnotationOnNotesAttachment,
  getAnnotationOfResolutionAttachment,
  addAnnotationOnResolutionAttachment,
  getAnnotationOfDataroomAttachment,
  addAnnotationOnDataroomAttachment,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";
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
  return async (dispatch) => {
    dispatch(GetAnnotationsOfToDoAttachementinit());
    let form = new FormData();
    form.append("RequestMethod", getAnnotationOfToDoAttachement.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    await axiosInstance
      .post(toDoListApi, form)

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
              let xfdfData = response.data.responseResult.annotationString;
              let attachmentBlob = response.data.responseResult.attachmentBlob;

              dispatch(
                GetAnnotationsOfToDoAttachementSuccess(
                  "",
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
              dispatch(
                GetAnnotationsOfToDoAttachementFail(t("No-record-found"))
              );
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
  return async (dispatch) => {
    dispatch(AddAnnotationsOnToDoAttachementinit());
    let form = new FormData();
    form.append("RequestMethod", addAnnotationOnToDoAttachement.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    await axiosInstance
      .post(toDoListApi, form)

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
              dispatch(
                AddAnnotationsOnToDoAttachementSuccess(t("Annotation-added"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ToDoList_ToDoListServiceManager_AddAnnotationOnToDoAttachement_02".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnToDoAttachementFail(t("Annotation-updated"))
              );
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
            } else if (
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
const ClearMessageAnnotations = () => {
  return {
    type: actions.CLEAR_RESPONSE_MESSAGE_WEBVIEWER,
  };
};
// for Get Notes Annotations
const GetAnnotationsOfNotesAttachementinit = () => {
  return {
    type: actions.GETANNOTATIONSOFNOTESATTACHEMENT_INIT,
  };
};

const GetAnnotationsOfNotesAttachementSuccess = (
  message,
  xfdfData,
  attachmentBlob
) => {
  return {
    type: actions.GETANNOTATIONSOFNOTESATTACHEMENT_SUCCESS,
    xfdfData: xfdfData,
    attachmentBlob: attachmentBlob,
    message: message,
  };
};

const GetAnnotationsOfNotesAttachementFail = (message) => {
  return {
    type: actions.GETANNOTATIONSOFNOTESATTACHEMENT_FAIL,
    message: message,
  };
};

const getAnnotationsOfNotesAttachement = (navigate, t, data) => {
  return async (dispatch) => {
    dispatch(GetAnnotationsOfNotesAttachementinit());
    let form = new FormData();
    form.append("RequestMethod", getAnnotationOfNotesAttachment.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    await axiosInstance
      .post(getNotesApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAnnotationsOfNotesAttachement(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_GetAnnotationOfNotesAttachement_01".toLowerCase()
                )
            ) {
              let xfdfData = response.data.responseResult.annotationString;
              let attachmentBlob = response.data.responseResult.attachmentBlob;

              dispatch(
                GetAnnotationsOfNotesAttachementSuccess(
                  t("Annotation-available"),
                  xfdfData,
                  attachmentBlob
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_GetAnnotationOfNotesAttachement_02".toLowerCase()
                )
            ) {
              dispatch(
                GetAnnotationsOfNotesAttachementFail(
                  t("No-annotation-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_GetAnnotationOfNotesAttachement_03".toLowerCase()
                )
            ) {
              dispatch(
                GetAnnotationsOfNotesAttachementFail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                GetAnnotationsOfNotesAttachementFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              GetAnnotationsOfNotesAttachementFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            GetAnnotationsOfNotesAttachementFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetAnnotationsOfNotesAttachementFail(t("Something-went-wrong"))
        );
      });
  };
};

// for add Annotations

const AddAnnotationsOnNotesAttachementinit = () => {
  return {
    type: actions.ADDANNOTATIONSOFNOTESATTACHEMENT_INIT,
  };
};

const AddAnnotationsOnNotesAttachementSuccess = (message) => {
  return {
    type: actions.ADDANNOTATIONSOFNOTESATTACHEMENT_SUCCESS,
    message: message,
  };
};

const AddAnnotationsOnNotesAttachementFail = (message) => {
  return {
    type: actions.ADDANNOTATIONSOFNOTESATTACHEMENT_FAIL,
    message: message,
  };
};

const addAnnotationsOnNotesAttachement = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(AddAnnotationsOnNotesAttachementinit());
    let form = new FormData();
    form.append("RequestMethod", addAnnotationOnNotesAttachment.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    await axiosInstance
      .post(getNotesApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(addAnnotationsOnNotesAttachement(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_AddAnnotationOnNotesAttachement_01".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnNotesAttachementSuccess(t("Record-inserted"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_AddAnnotationOnNotesAttachement_02".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnNotesAttachementSuccess(t("Record-updated"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_AddAnnotationOnNotesAttachement_03".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnNotesAttachementFail(t("No-record-inserted"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_AddAnnotationOnNotesAttachement_04".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnNotesAttachementFail(t("No-record-updated"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_AddAnnotationOnNotesAttachement_05".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnNotesAttachementFail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                AddAnnotationsOnNotesAttachementFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              AddAnnotationsOnNotesAttachementFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            AddAnnotationsOnNotesAttachementFail(t("Something-went-wrong"))
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

// for get resolution annotations

const GetAnnotationsOfResolutionAttachementinit = () => {
  return {
    type: actions.GETANNOTATIONSOFRESOLUTIONATTACHEMENT_INIT,
  };
};

const GetAnnotationsOfResolutionAttachementSuccess = (
  message,
  xfdfData,
  attachmentBlob
) => {
  return {
    type: actions.GETANNOTATIONSOFRESOLUTIONATTACHEMENT_SUCCESS,
    xfdfData: xfdfData,
    attachmentBlob: attachmentBlob,
    message: message,
  };
};

const GetAnnotationsOfResolutionAttachementFail = (message) => {
  return {
    type: actions.GETANNOTATIONSOFRESOLUTIONATTACHEMENT_FAIL,
    message: message,
  };
};

const getAnnotationsOfResolutionAttachement = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(GetAnnotationsOfResolutionAttachementinit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getAnnotationOfResolutionAttachment.RequestMethod
    );
    form.append("RequestData", JSON.stringify(data));
    await axiosInstance
      .post(getResolutionApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAnnotationsOfResolutionAttachement(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Resolution_ResolutionServiceManager_GetAnnotationOfResolutionAttachement_01".toLowerCase()
                )
            ) {
              let xfdfData = response.data.responseResult.annotationString;
              let attachmentBlob = response.data.responseResult.attachmentBlob;

              dispatch(
                GetAnnotationsOfResolutionAttachementSuccess(
                  t("Annotation-available"),
                  xfdfData,
                  attachmentBlob
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Resolution_ResolutionServiceManager_GetAnnotationOfResolutionAttachement_02".toLowerCase()
                )
            ) {
              dispatch(
                GetAnnotationsOfResolutionAttachementFail(
                  t("No-annotation-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Resolution_ResolutionServiceManager_GetAnnotationOfResolutionAttachement_03".toLowerCase()
                )
            ) {
              dispatch(
                GetAnnotationsOfResolutionAttachementFail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                GetAnnotationsOfResolutionAttachementFail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              GetAnnotationsOfResolutionAttachementFail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            GetAnnotationsOfResolutionAttachementFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetAnnotationsOfResolutionAttachementFail(t("Something-went-wrong"))
        );
      });
  };
};

// for add resolution annotation

const AddAnnotationsOnResolutionAttachementinit = () => {
  return {
    type: actions.ADDANNOTATIONSOFRESOLUTIONATTACHEMENT_INIT,
  };
};

const AddAnnotationsOnResolutionAttachementSuccess = (message) => {
  return {
    type: actions.ADDANNOTATIONSOFRESOLUTIONATTACHEMENT_SUCCESS,
    message: message,
  };
};

const AddAnnotationsOnResolutionAttachementFail = (message) => {
  return {
    type: actions.ADDANNOTATIONSOFRESOLUTIONATTACHEMENT_FAIL,
    message: message,
  };
};

const addAnnotationsOnResolutionAttachement = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(AddAnnotationsOnResolutionAttachementinit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      addAnnotationOnResolutionAttachment.RequestMethod
    );
    form.append("RequestData", JSON.stringify(data));

    await axiosInstance
      .post(getResolutionApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(addAnnotationsOnResolutionAttachement(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Resolution_ResolutionServiceManager_AddAnnotationOnResolutionAttachement_01".toLowerCase()
                )
            ) {
              dispatch(AddAnnotationsOnResolutionAttachementSuccess(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Resolution_ResolutionServiceManager_AddAnnotationOnResolutionAttachement_02".toLowerCase()
                )
            ) {
              dispatch(AddAnnotationsOnResolutionAttachementSuccess(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Resolution_ResolutionServiceManager_AddAnnotationOnResolutionAttachement_03".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnResolutionAttachementFail(
                  t("No-record-inserted")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Resolution_ResolutionServiceManager_AddAnnotationOnResolutionAttachement_04".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnResolutionAttachementFail(
                  t("No-record-updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Resolution_ResolutionServiceManager_AddAnnotationOnResolutionAttachement_05".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnResolutionAttachementFail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                AddAnnotationsOnResolutionAttachementFail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              AddAnnotationsOnResolutionAttachementFail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          dispatch(
            AddAnnotationsOnResolutionAttachementFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          AddAnnotationsOnResolutionAttachementFail(t("Something-went-wrong"))
        );
      });
  };
};

// for get resolution annotations

const GetAnnotationsOfDataroomAttachementinit = () => {
  return {
    type: actions.GETANNOTATIONSOFDATAROOMATTACHEMENT_INIT,
  };
};

const GetAnnotationsOfDataroomAttachementSuccess = (
  message,
  xfdfData,
  attachmentBlob,
  html
) => {
  return {
    type: actions.GETANNOTATIONSOFDATAROOMATTACHEMENT_SUCCESS,
    xfdfData: xfdfData,
    attachmentBlob: attachmentBlob,
    message: message,
    checking: html,
  };
};

const GetAnnotationsOfDataroomAttachementFail = (message) => {
  return {
    type: actions.GETANNOTATIONSOFDATAROOMATTACHEMENT_FAIL,
    message: message,
  };
};

const getAnnotationsOfDataroomAttachement = (
  navigate,
  t,
  data,
  html = false
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return async (dispatch) => {
    dispatch(GetAnnotationsOfDataroomAttachementinit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      getAnnotationOfDataroomAttachment.RequestMethod
    );
    form.append("RequestData", JSON.stringify(data));
    await axiosInstance
      .post(dataRoomApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getAnnotationsOfDataroomAttachement(navigate, t, data, html)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetAnnotationOfFilesAttachement_01".toLowerCase()
                )
            ) {
              let xfdfData = response.data.responseResult.annotationString;
              let attachmentBlob = response.data.responseResult.attachmentBlob;

              dispatch(
                GetAnnotationsOfDataroomAttachementSuccess(
                  t("Annotation-available"),
                  xfdfData,
                  attachmentBlob,
                  html
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetAnnotationOfFilesAttachement_02".toLowerCase()
                )
            ) {
              dispatch(
                GetAnnotationsOfDataroomAttachementFail(
                  t("No-annotation-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_GetAnnotationOfFilesAttachement_03".toLowerCase()
                )
            ) {
              dispatch(
                GetAnnotationsOfDataroomAttachementFail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                GetAnnotationsOfDataroomAttachementFail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              GetAnnotationsOfDataroomAttachementFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            GetAnnotationsOfDataroomAttachementFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetAnnotationsOfDataroomAttachementFail(t("Something-went-wrong"))
        );
      });
  };
};

// for add resolution annotation

const AddAnnotationsOnDataroomAttachementinit = () => {
  return {
    type: actions.ADDANNOTATIONSOFDATAROOMATTACHEMENT_INIT,
  };
};

const AddAnnotationsOnDataroomAttachementSuccess = (message) => {
  return {
    type: actions.ADDANNOTATIONSOFDATAROOMATTACHEMENT_SUCCESS,
    message: message,
  };
};

const AddAnnotationsOnDataroomAttachementFail = (message) => {
  return {
    type: actions.ADDANNOTATIONSOFDATAROOMATTACHEMENT_FAIL,
    message: message,
  };
};

const addAnnotationsOnDataroomAttachement = (navigate, t, data) => {
  return async (dispatch) => {
    dispatch(AddAnnotationsOnDataroomAttachementinit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      addAnnotationOnDataroomAttachment.RequestMethod
    );
    form.append("RequestData", JSON.stringify(data));
    await axiosInstance
    .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(addAnnotationsOnDataroomAttachement(navigate, t, data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddAnnotationOnFilesAttachement_01".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnDataroomAttachementSuccess(
                  t("File-is-saved-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddAnnotationOnFilesAttachement_02".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnDataroomAttachementSuccess(
                  t("File-is-saved-successfully")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddAnnotationOnFilesAttachement_03".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnDataroomAttachementFail(
                  t("Something-went-wrong")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddAnnotationOnFilesAttachement_04".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnDataroomAttachementFail(
                  t("Something-went-wrong")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_AddAnnotationOnFilesAttachement_05".toLowerCase()
                )
            ) {
              dispatch(
                AddAnnotationsOnDataroomAttachementFail(
                  t("Something-went-wrong")
                )
              );
            } else {
              dispatch(
                AddAnnotationsOnDataroomAttachementFail(
                  t("Something-went-wrong")
                )
              );
            }
          } else {
            dispatch(
              AddAnnotationsOnDataroomAttachementFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            AddAnnotationsOnDataroomAttachementFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          AddAnnotationsOnDataroomAttachementFail(t("Something-went-wrong"))
        );
      });
  };
};
export {
  getAnnotationsOfToDoAttachement,
  addAnnotationsOnToDoAttachement,
  GetAnnotationsOfToDoAttachementMessageCleare,
  addAnnotationsOnNotesAttachement,
  getAnnotationsOfNotesAttachement,
  getAnnotationsOfResolutionAttachement,
  addAnnotationsOnResolutionAttachement,
  addAnnotationsOnDataroomAttachement,
  getAnnotationsOfDataroomAttachement,
  ClearMessageAnnotations,
};
