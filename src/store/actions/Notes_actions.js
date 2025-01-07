import * as actions from "../action_types";
import axios from "axios";
import { dataRoomApi, getNotesApi } from "../../commen/apis/Api_ends_points";
import {
  SavesNotesRequestMethod,
  UpdateNotesRequestMethod,
  GetNotesByNotesIDRequestMethod,
  deleteNotes,
  searchNoteRequetMethod,
  CreateUpdateNotesDataRoomMap,
  SaveNotesDocument,
  RetrieveNotesDocument,
  saveFilesRequestMethod,
  uploadDocumentsRequestMethod,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";
import { isFunction } from "../../commen/functions/utils";

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
    response: response,
  };
};
const GetNotes = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getNotes_Init());
    let form = new FormData();
    form.append("RequestMethod", searchNoteRequetMethod.RequestMethod);
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
              dispatch(getNotes_Success(response.data.responseResult, ""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_SearchNotes_02".toLowerCase()
                )
            ) {
              let data = [];
              dispatch(getNotes_Fail("", data));
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
const SaveNotesAPI = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SaveNotesAPI(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
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
              localStorage.setItem(
                "notesID",
                response.data.responseResult.notesID
              );
              //Create Update Notes Data Room Map
              let CreateUpdateDataRoomData = {
                NotesID: Number(response.data.responseResult.notesID),
                NoteTitle: response.data.responseResult.notesTitle,
                IsUpdateFlow: false,
              };
              dispatch(
                CreateUpdateNotesDataRoomMapAPI(
                  navigate,
                  CreateUpdateDataRoomData,
                  t
                )
              );
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
      })
      .catch((response) => {
        dispatch(saveNotes_Fail(t("Something-went-wrong")));
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
  let notesPage = parseInt(localStorage.getItem("notesPage"));
  let notesPagesize = parseInt(localStorage.getItem("notesPageSize"));

  let searchData = {
    UserID: parseInt(createrID),
    OrganizationID: JSON.parse(OrganizationID),
    Title: "",
    PageNumber: notesPage,
    Length: notesPagesize,
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
          dispatch(
            UpdateNotesAPI(
              navigate,
              data,
              t,
              setIsUpdateNote,
              setIsDeleteNote,
              setUpdateNotes
            )
          );
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
              dispatch(GetNotes(navigate, searchData, t));
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
              dispatch(GetNotes(navigate, searchData, t));
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
      })
      .catch((response) => {
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
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            GetNotesByIdAPI(
              navigate,
              NotesID,
              t,
              setViewModalShow,
              setUpdateModalShow,
              setUpdateNotesModalHomePage,
              no
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_GetNotesByNotesID_01".toLowerCase()
                )
            ) {
              console.log(
                response.data.responseResult.getNotes,
                "Notes_NotesServiceManager_GetNotesByNotesID_01"
              );
              dispatch(
                GetNotesById_Success(response.data.responseResult.getNotes, "")
              );
              // await dispatch(GetNotes(getNotesAPI, t))
              if (no === 1) {
                (await isFunction(setViewModalShow)) && setViewModalShow(true);
                (await isFunction(setUpdateModalShow)) &&
                  setUpdateModalShow(false);
                (await isFunction(setUpdateNotesModalHomePage)) &&
                  setUpdateNotesModalHomePage(false);
              } else if (no === 3) {
                (await isFunction(setUpdateNotesModalHomePage)) &&
                  setUpdateNotesModalHomePage(true);
                (await isFunction(setUpdateModalShow)) &&
                  setUpdateModalShow(false);
                (await isFunction(setViewModalShow)) && setViewModalShow(false);
              } else {
                (await isFunction(setUpdateNotesModalHomePage)) &&
                  setUpdateNotesModalHomePage(false);
                (await isFunction(setUpdateModalShow)) &&
                  setUpdateModalShow(true);
                (await isFunction(setViewModalShow)) && setViewModalShow(false);
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_GetNotesByNotesID_02".toLowerCase()
                )
            ) {
              dispatch(GetNotesById_Fail(""));
              console.log("Notes_NotesServiceManager_GetNotesByNotesID_01");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_GetNotesByNotesID_03".toLowerCase()
                )
            ) {
              console.log("Notes_NotesServiceManager_GetNotesByNotesID_01");
              dispatch(GetNotesById_Fail(t("Something-went-wrong")));
            } else {
              console.log("Notes_NotesServiceManager_GetNotesByNotesID_01");
              dispatch(GetNotesById_Fail(t("Something-went-wrong")));
            }
          } else {
            console.log("Notes_NotesServiceManager_GetNotesByNotesID_01");
            dispatch(GetNotesById_Fail(t("Something-went-wrong")));
          }
        } else {
          console.log("Notes_NotesServiceManager_GetNotesByNotesID_01");
          dispatch(GetNotesById_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "Notes_NotesServiceManager_GetNotesByNotesID_01");
        dispatch(GetNotesById_Fail(t("Something-went-wrong")));
      });
  };
};
const deleteNotes_Init = () => {
  return {
    type: actions.DELETE_NOTE_INIT,
  };
};
const deleteNotes_Success = (response, message) => {
  return {
    type: actions.DELETE_NOTE_SUCCESS,
    response: response,
    message: message,
  };
};
const deleteNotes_Fail = (message) => {
  return {
    type: actions.DELETE_NOTE_FAIL,
    message: message,
  };
};
const deleteNotesApi = (navigate, ID, t, setUpdateNotes) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let notesPage = parseInt(localStorage.getItem("notesPage"));
  let notesPagesize = parseInt(localStorage.getItem("notesPageSize"));
  let deleteNotData = {
    PK_NotesID: JSON.parse(ID),
  };
  let searchData = {
    UserID: parseInt(createrID),
    OrganizationID: JSON.parse(OrganizationID),
    Title: "",
    PageNumber: notesPage,
    Length: notesPagesize,
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
          dispatch(deleteNotesApi(navigate, ID, t, setUpdateNotes));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_DeleteNotes_01".toLowerCase()
                )
            ) {
              await dispatch(
                deleteNotes_Success(
                  response.data.responseResult,
                  t("Notes-deleted-successfully")
                )
              );
              dispatch(GetNotes(navigate, searchData, t));
              setUpdateNotes(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_DeleteNotes_02".toLowerCase()
                )
            ) {
              dispatch(deleteNotes_Fail(t("Failed-to-delete-notes")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Notes_NotesServiceManager_DeleteNotes_03".toLowerCase()
                )
            ) {
              dispatch(deleteNotes_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(deleteNotes_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(deleteNotes_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(deleteNotes_Fail(t("Something-went-wrong")));
      });
  };
};
const ClearNotesResponseMessage = () => {
  return {
    type: actions.CLEAR_NOTES_RESPONSEMESSAGE,
  };
};

//Create Update Data Room Map API

const CreateUpadateNotesDataRoomMapInit = () => {
  return {
    type: actions.CREATE_UPDATE_NOTES_DATAROOM_MAP_INIT,
  };
};

const CreateUpadateNotesDataRoomMapSuccess = (response, message) => {
  return {
    type: actions.CREATE_UPDATE_NOTES_DATAROOM_MAP_SUCCESS,
    response: response,
    message: message,
  };
};

const CreateUpadateNotesDataRoomMapFail = (message) => {
  return {
    type: actions.CREATE_UPDATE_NOTES_DATAROOM_MAP_FAIL,
    message: message,
  };
};

const CreateUpdateNotesDataRoomMapAPI = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(CreateUpadateNotesDataRoomMapInit());
    let form = new FormData();
    form.append("RequestMethod", CreateUpdateNotesDataRoomMap.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(CreateUpdateNotesDataRoomMapAPI(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateNotesDataRoomMap_01".toLowerCase()
                )
            ) {
              dispatch(
                CreateUpadateNotesDataRoomMapSuccess(
                  response.data.responseResult.folderID,
                  t("Folder-mapped-with-dataroom")
                )
              );
              console.log(
                response.data.responseResult.folderID,
                "fileForSendfileForSend"
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateNotesDataRoomMap_02".toLowerCase()
                )
            ) {
              dispatch(
                CreateUpadateNotesDataRoomMapFail(t("Unable-to-save-folder"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateNotesDataRoomMap_03".toLowerCase()
                )
            ) {
              dispatch(
                CreateUpadateNotesDataRoomMapSuccess(
                  response.data.responseResult.folderID,
                  t("Updated")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateNotesDataRoomMap_04".toLowerCase()
                )
            ) {
              dispatch(
                CreateUpadateNotesDataRoomMapFail(t("Unable-to-update-folder"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateNotesDataRoomMap_05".toLowerCase()
                )
            ) {
              dispatch(
                CreateUpadateNotesDataRoomMapSuccess(
                  response.data.responseResult,
                  t("New-mapping-created")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_CreateUpdateNotesDataRoomMap_06".toLowerCase()
                )
            ) {
              dispatch(
                CreateUpadateNotesDataRoomMapFail(
                  t("Failed-to-create-new-mapping")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_CreateUpdateNotesDataRoomMap_07".toLowerCase()
                )
            ) {
              dispatch(
                CreateUpadateNotesDataRoomMapFail(t("Something-went-wrong"))
              );
            } else {
              dispatch(
                CreateUpadateNotesDataRoomMapFail(t("Something-went-wrong"))
              );
            }
          } else {
            dispatch(
              CreateUpadateNotesDataRoomMapFail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            CreateUpadateNotesDataRoomMapFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(CreateUpadateNotesDataRoomMapFail(t("Something-went-wrong")));
      });
  };
};

// Save Notes Document API
const SaveNotesDocumentInit = () => {
  return {
    type: actions.SAVE_NOTES_DOCUMENT_INIT,
  };
};

const SaveNotesDocumentSuccess = (response, message) => {
  return {
    type: actions.SAVE_NOTES_DOCUMENT_SUCCESS,
    response: response,
    message: message,
  };
};

const SaveNotesDocumentFail = (message) => {
  return {
    type: actions.SAVE_NOTES_DOCUMENT_FAILED,
    message: message,
  };
};

const SaveNotesDocumentAPI = (navigate, Data, t, setAddNotes) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let UserID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  return (dispatch) => {
    dispatch(SaveNotesDocumentInit());
    let form = new FormData();
    form.append("RequestMethod", SaveNotesDocument.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SaveNotesDocumentAPI(navigate, Data, t, setAddNotes));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveNotesDocuments_01".toLowerCase()
                )
            ) {
              dispatch(
                SaveNotesDocumentSuccess(
                  response.data.responseResult,
                  t("List-updated-successfully")
                )
              );
              setAddNotes(false);
              let Data = {
                UserID: parseInt(UserID),
                OrganizationID: JSON.parse(OrganizationID),
                Title: "",
                isDocument: false,
                isSpreadSheet: false,
                isPresentation: false,
                isForms: false,
                isImages: false,
                isPDF: false,
                isVideos: false,
                isAudios: false,
                isSites: false,
                CreatedDate: "",
                PageNumber: 1,
                Length: 50,
              };
              dispatch(GetNotes(navigate, Data, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_SaveNotesDocuments_02".toLowerCase()
                )
            ) {
              dispatch(SaveNotesDocumentFail(t("Something-went-wrong")));
            } else {
              dispatch(SaveNotesDocumentFail(t("Something-went-wrong")));
            }
          } else {
            dispatch(SaveNotesDocumentFail(t("Something-went-wrong")));
          }
        } else {
          dispatch(SaveNotesDocumentFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(SaveNotesDocumentFail(t("Something-went-wrong")));
      });
  };
};

//Retrieve Notes Document
const RetrieveNotesDocumentInit = () => {
  return {
    type: actions.RETRIEVE_NOTES_DOCUMENT_INIT,
  };
};

const RetrieveNotesDocumentSuccess = (response, message) => {
  return {
    type: actions.RETRIEVE_NOTES_DOCUMENT_SUCCESS,
    response: response,
    message: message,
  };
};

const RetrieveNotesDocumentFailed = (message) => {
  return {
    type: actions.RETRIEVE_NOTES_DOCUMENT_FAILED,
    message: message,
  };
};

const RetrieveNotesDocumentAPI = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(RetrieveNotesDocumentInit());
    let form = new FormData();
    form.append("RequestMethod", RetrieveNotesDocument.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(RetrieveNotesDocumentAPI(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveNotesDocuments_01".toLowerCase()
                )
            ) {
              dispatch(
                RetrieveNotesDocumentSuccess(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveNotesDocuments_02".toLowerCase()
                )
            ) {
              dispatch(RetrieveNotesDocumentFailed(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomManager_ReteriveNotesDocuments_03".toLowerCase()
                )
            ) {
              dispatch(RetrieveNotesDocumentFailed(t("Something-went-wrong")));
            } else {
              dispatch(RetrieveNotesDocumentFailed(t("Something-went-wrong")));
            }
          } else {
            dispatch(RetrieveNotesDocumentFailed(t("Something-went-wrong")));
          }
        } else {
          dispatch(RetrieveNotesDocumentFailed(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(RetrieveNotesDocumentFailed(t("Something-went-wrong")));
      });
  };
};

// Save Files Notes just like Save Files Groups

// Save Files Init
const saveFilesNotes_init = () => {
  return {
    type: actions.SAVE_FILES_NOTES_INIT,
  };
};

// Save Files Success
const saveFilesNotes_success = (response, message) => {
  return {
    type: actions.SAVE_FILES_NOTES_SUCCESS,
    response: response,
    message: message,
  };
};

// Save Files Fail
const saveFilesNotes_fail = (message) => {
  return {
    type: actions.SAVE_FILES_NOTES_FALSE,
    message: message,
  };
};

// Save Files API for Resolution
const saveFilesNotesApi = (navigate, t, data, folderID, newFolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: data,
    UserID: JSON.parse(creatorID),
    Type: 0,
  };
  return async (dispatch) => {
    dispatch(saveFilesNotes_init());
    let form = new FormData();
    form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(saveFilesNotesApi(navigate, t, data, folderID, newFolder));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase()
                )
            ) {
              console.log(response.data.responseResult, "consoleconsole");
              try {
                let fileIds = response.data.responseResult.fileID;
                console.log(fileIds, "newFileID");
                fileIds.map((newFileID, index) => {
                  console.log(newFileID, "newFileID");

                  return newFolder.push({ pK_FileID: newFileID.pK_FileID });
                });
              } catch (error) {
                console.log(error, "newFileID");
              }
              await dispatch(
                saveFilesNotes_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
                )
            ) {
              dispatch(saveFilesNotes_fail(t("Failed-to-save-any-file")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
                )
            ) {
              dispatch(saveFilesNotes_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveFilesNotes_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveFilesNotes_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(saveFilesNotes_fail(t("Something-went-wrong")));
      });
  };
};

// upload Document Notes
const uploadDocumentNotes_init = () => {
  return {
    type: actions.UPLOAD_DOCUMENT_NOTES_INIT,
  };
};

const uploadDocumentNotes_success = (response, message) => {
  return {
    type: actions.UPLOAD_DOCUMENT_NOTES_SUCCESS,
    response: response,
    message: message,
  };
};

const uploadDocumentNotes_fail = (message) => {
  return {
    type: actions.UPLOAD_DOCUMENT_NOTES_FAILED,
    message: message,
  };
};

const uploadDocumentsNotesApi = (
  navigate,
  t,
  data,
  folderID,
  // newFolder,
  newfile
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let creatorID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  return async (dispatch) => {
    dispatch(uploadDocumentNotes_init());
    let form = new FormData();
    form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
    form.append("File", data);
    await axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            uploadDocumentsNotesApi(
              navigate,
              t,
              data,
              folderID,
              // newFolder,
              newfile
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_01".toLowerCase()
                )
            ) {
              newfile.push({
                DisplayFileName: response.data.responseResult.displayFileName,
                DiskusFileNameString:
                  response.data.responseResult.diskusFileName,
                ShareAbleLink: response.data.responseResult.shareAbleLink,
                FK_UserID: JSON.parse(creatorID),
                FK_OrganizationID: JSON.parse(organizationID),
                FileSize: Number(response.data.responseResult.fileSizeOnDisk),
                fileSizeOnDisk: Number(response.data.responseResult.fileSize),
              });
              await dispatch(
                uploadDocumentNotes_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase()
                )
            ) {
              dispatch(
                uploadDocumentNotes_fail(t("Failed-to-update-document"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
                )
            ) {
              dispatch(uploadDocumentNotes_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(uploadDocumentNotes_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(uploadDocumentNotes_fail(t("Something-went-wrong")));
        }
      })
      .catch((error) => {
        dispatch(uploadDocumentNotes_fail(t("Something-went-wrong")));
      });
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
  GetNotesById_Init,
  CreateUpdateNotesDataRoomMapAPI,
  SaveNotesDocumentAPI,
  RetrieveNotesDocumentAPI,
  saveFilesNotesApi,
  uploadDocumentsNotesApi,
};
