import * as actions from "../action_types";
import axios from "axios";
import { getNotesApi } from "../../commen/apis/Api_ends_points";
import {
  GetNotesByUserIDAndOrganizationID,
  SavesNotesRequestMethod,
  UpdateNotesRequestMethod,
  GetNotesByNotesIDRequestMethod,
  deleteNotes,
  searchNoteRequetMethod
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";

const getNotes_Init = () => {
  return {
    type: actions.GET_NOTES_INIT,
  };
};
const getNotes_Success = (response, message) => {
  return {
    type: actions.GET_NOTES_SUCCESS,
    response: response,
    message: message,
  };
};
const getNotes_Fail = (message, response) => {
  return {
    type: actions.GET_NOTES_FAIL,
    message: message,
    response: response
  };
};
const GetNotes = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getNotes_Init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      searchNoteRequetMethod.RequestMethod
    );
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getNotesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetNotes(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_SearchNotes_01".toLowerCase()
                )
            ) {
              dispatch(
                getNotes_Success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_SearchNotes_02".toLowerCase()
                )
            ) {
              let data = []
              dispatch(getNotes_Fail(t("No-data-available", data)));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_SearchNotes_03".toLowerCase()
                )
            ) {
              dispatch(getNotes_Fail(t("Something-went-wrong")));
            } else {
              dispatch(getNotes_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getNotes_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getNotes_Fail(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(getNotes_Fail(t("Something-went-wrong")));
      });
  };
};
const saveNotes_Init = () => {
  return {
    type: actions.ADD_NOTES_INIT,
  };
};
const saveNotes_Success = (response, message) => {
  return {
    type: actions.ADD_NOTES_SUCCESS,
    response: response,
    message: message,
  };
};
const saveNotes_Fail = (message) => {
  return {
    type: actions.ADD_NOTES_FAIL,
    message: message,
  };
};
const SaveNotesAPI = (navigate, Data, t, setAddNewModal) => {
  console.log("DataDataData", Data);
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let getNotesAPI = {
    UserID: parseInt(createrID),
    OrganizationID: JSON.parse(OrganizationID),
  };
  return (dispatch) => {
    dispatch(saveNotes_Init());
    let form = new FormData();
    form.append("RequestMethod", SavesNotesRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getNotesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("checking");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SaveNotesAPI(navigate, Data, t, setAddNewModal));
        } else if (response.data.responseCode === 200) {
          console.log("checking");
          if (response.data.responseResult.isExecuted === true) {
            console.log("checking");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_SaveNotes_01".toLowerCase()
                )
            ) {
              dispatch(
                saveNotes_Success(
                  response.data.responseResult.getNotes,
                  t("Notes-saved-successfully")
                )
              );
              dispatch(GetNotes(navigate, getNotesAPI, t));
              setAddNewModal(false);
              console.log("checking");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_SaveNotes_02".toLowerCase()
                )
            ) {
              dispatch(
                saveNotes_Success(
                  response.data.responseResult.getNotes,
                  t("Notes-saved-successfully-with-attachments")
                )
              );
              dispatch(GetNotes(navigate, getNotesAPI, t));
              setAddNewModal(false);
              console.log("checking");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_SaveNotes_03".toLowerCase()
                )
            ) {
              dispatch(saveNotes_Fail(t("Failed-to-save-notes")));
            } else {
              dispatch(saveNotes_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveNotes_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveNotes_Fail(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(saveNotes_Fail(t("Something-went-wrong")));
        console.log("responseresponse", response);
      });
  };
};
const UpdateNotes_Init = () => {
  return {
    type: actions.UPDATE_NOTES_INIT,
  };
};
const UpdateNotes_Success = (response, message) => {
  return {
    type: actions.UPDATE_NOTES_SUCCESS,
    response: response,
    message: message,
  };
};
const UpdateNotes_Fail = (message) => {
  return {
    type: actions.UPDATE_NOTES_FAIL,
    message: message,
  };
};
const UpdateNotesAPI = (
  navigate,
  data,
  t,
  setIsUpdateNote,
  setIsDeleteNote,
  setUpdateNotes
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let getNotesAPI = {
    UserID: parseInt(createrID),
    OrganizationID: JSON.parse(OrganizationID),
  };
  return (dispatch) => {
    dispatch(UpdateNotes_Init());
    let form = new FormData();
    form.append("RequestMethod", UpdateNotesRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axios({
      method: "post",
      url: getNotesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(UpdateNotesAPI(
            navigate,
            data,
            t,
            setIsUpdateNote,
            setIsDeleteNote,
            setUpdateNotes
          ))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_UpdateNotes_01".toLowerCase()
                )
            ) {
              dispatch(
                UpdateNotes_Success(
                  response.data.responseResult.getNotes,
                  t("Notes-updated-successfully")
                )
              );
              dispatch(GetNotes(navigate, getNotesAPI, t));
              setIsUpdateNote(false);
              setUpdateNotes(false);
              setIsDeleteNote(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_UpdateNotes_02".toLowerCase()
                )
            ) {
              dispatch(
                UpdateNotes_Success(
                  response.data.responseResult.getNotes,
                  t("Notes-updated-successfully-with-attachments")
                )
              );
              dispatch(GetNotes(navigate, getNotesAPI, t));
              setIsUpdateNote(false);
              setUpdateNotes(false);
              setIsDeleteNote(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_UpdateNotes_03".toLowerCase()
                )
            ) {
              dispatch(UpdateNotes_Fail(t("Failed-to-update-notes")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_UpdateNotes_04".toLowerCase()
                )
            ) {
              dispatch(UpdateNotes_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(UpdateNotes_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(UpdateNotes_Fail(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        console.log("responseresponse", response);
        dispatch(UpdateNotes_Fail(t("Something-went-wrong")));
      });
  };
};
const GetNotesById_Init = () => {
  return {
    type: actions.GET_NOTES_BY_NOTESID_INIT,
  };
};
const GetNotesById_Success = (response, message) => {
  console.log("NotesReducerNotesReducer", response);
  return {
    type: actions.GET_NOTES_BY_NOTESID_SUCCESS,
    response: response,
    message: message,
  };
};
const GetNotesById_Fail = (message) => {
  return {
    type: actions.GET_NOTES_BY_NOTESID_FAIL,
    message: message,
  };
};
const GetNotesByIdAPI = (
  navigate,
  NotesID,
  t,
  setViewModalShow,
  setUpdateModalShow,
  setUpdateNotesModalHomePage,
  no
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    NotesID: JSON.parse(NotesID),
  };
  console.log(Data, "navigatenavigatenavigatenavigate")
  return (dispatch) => {
    dispatch(GetNotesById_Init());
    let form = new FormData();
    form.append("RequestMethod", GetNotesByNotesIDRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getNotesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log("responseresponse", response);
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetNotesByIdAPI(
            navigate,
            NotesID,
            t,
            setViewModalShow,
            setUpdateModalShow,
            setUpdateNotesModalHomePage,
            no
          ))
        } else if (response.data.responseCode === 200) {
          console.log("responseresponse", response);
          if (response.data.responseResult.isExecuted === true) {
            console.log("responseresponse", response);
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_GetNotesByNotesID_01".toLowerCase()
                )
            ) {
              dispatch(
                GetNotesById_Success(
                  response.data.responseResult.getNotes,
                  t("Data-available")
                )
              );
              // await dispatch(GetNotes(getNotesAPI, t))
              if (no === 1) {
                await setViewModalShow(true);
                await setUpdateModalShow(false);
                await setUpdateNotesModalHomePage(false);
              } else if (no === 3) {
                await setUpdateNotesModalHomePage(true);
                await setUpdateModalShow(false);
                await setViewModalShow(false);
              } else {
                await setUpdateNotesModalHomePage(false);
                await setUpdateModalShow(true);
                await setViewModalShow(false);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_GetNotesByNotesID_02".toLowerCase()
                )
            ) {
              dispatch(GetNotesById_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_GetNotesByNotesID_03".toLowerCase()
                )
            ) {
              dispatch(GetNotesById_Fail(t("Something-went-wrong")));
            } else {
              dispatch(GetNotesById_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(GetNotesById_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(GetNotesById_Fail(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        console.log("responseresponse", response);
        dispatch(GetNotesById_Fail(t("Something-went-wrong")));
      });
  };
};
const deleteNotes_Init = () => {
  return {
    type: actions.DELETE_NOTE_INIT
  }
}
const deleteNotes_Success = (response, message) => {
  return {
    type: actions.DELETE_NOTE_SUCCESS,
    response: response,
    message: message
  }
}
const deleteNotes_Fail = (message) => {
  return {
    type: actions.DELETE_NOTE_FAIL,
    message: message
  }
}
const deleteNotesApi = (navigate, ID, t, setUpdateNotes) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let deleteNotData = {
    PK_NotesID: JSON.parse(ID)
  }
  let Data = {
    UserID: JSON.parse(createrID),
    OrganizationID: JSON.parse(OrganizationID),
  };
  return (dispatch) => {
    dispatch(deleteNotes_Init());
    let form = new FormData();
    form.append("RequestMethod", deleteNotes.RequestMethod);
    form.append("RequestData", JSON.stringify(deleteNotData));
    axios({
      method: "post",
      url: getNotesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(deleteNotesApi(
            navigate, ID, t, setUpdateNotes
          ))
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_DeleteNotes_01".toLowerCase())) {
              await dispatch(deleteNotes_Success(response.data.responseResult, t("Notes-deleted-successfully")))
              dispatch(GetNotes(navigate, Data, t))
              setUpdateNotes(false)
            } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_DeleteNotes_02".toLowerCase())) {
              dispatch(deleteNotes_Fail(t("Failed-to-delete-notes")))
            } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Notes_NotesServiceManager_DeleteNotes_03".toLowerCase())) {
              dispatch(deleteNotes_Fail(t("Something-went-wrong")))
            }
          } else {
            dispatch(deleteNotes_Fail(t("Something-went-wrong")))
          }
        } else {
          dispatch(deleteNotes_Fail(t("Something-went-wrong")))
        }
      })
      .catch((response) => {
        dispatch(deleteNotes_Fail(t("Something-went-wrong")))
      });
  };
}
const ClearNotesResponseMessage = () => {
  return {
    type: actions.CLEAR_NOTES_RESPONSEMESSAGE,
  };
};
export {
  GetNotes,
  SaveNotesAPI,
  UpdateNotesAPI,
  GetNotesByIdAPI,
  deleteNotesApi,
  ClearNotesResponseMessage,
  getNotes_Init,
};
