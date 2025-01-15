import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  SaveNotesResponse: null,
  GetAllNotesResponse: null,
  UpdateNotesResponse: null,
  GetAllAttachments: null,
  GetNotesByNotesId: null,
  deleteNoteResponse: null,
  createUpdateNotesDataRoomMapData: null,
  saveNotesDocumentData: null,
  retrieveNotesDocumentData: null,
  saveFilesNotes: null,
  uploadDocumentNotes: null,
  deleteNotesDocument: null,
};
const NotesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_NOTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADD_NOTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        SaveNotesResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.ADD_NOTES_FAIL: {
      return {
        ...state,
        Loading: false,
        SaveNotesResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_NOTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_NOTES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetAllNotesResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_NOTES_FAIL: {
      return {
        ...state,
        Loading: false,
        GetAllNotesResponse: [],
        ResponseMessage: action.message,
      };
    }
    case actions.GET_NOTES_BY_NOTESID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_NOTES_BY_NOTESID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetNotesByNotesId: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_NOTES_BY_NOTESID_FAIL: {
      return {
        ...state,
        Loading: false,
        GetNotesByNotesId: null,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATE_NOTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATE_NOTES_SUCCESS: {
      return {
        ...state,
        UpdateNotesResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATE_NOTES_FAIL: {
      return {
        ...state,
        UpdateNotesResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CLEAR_NOTES_RESPONSEMESSAGE: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }
    case actions.DELETE_NOTE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETE_NOTE_SUCCESS: {
      return {
        ...state,
        Loading: true,
        ResponseMessage: action.message,
        deleteNoteResponse: action.response,
      };
    }
    case actions.DELETE_NOTE_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        deleteNoteResponse: null,
      };
    }

    //Create Update Notes DataRoom Map Reducer Work

    case actions.CREATE_UPDATE_NOTES_DATAROOM_MAP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.CREATE_UPDATE_NOTES_DATAROOM_MAP_SUCCESS: {
      return {
        ...state,
        Loading: true,
        createUpdateNotesDataRoomMapData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.CREATE_UPDATE_NOTES_DATAROOM_MAP_FAIL: {
      return {
        ...state,
        Loading: false,
        createUpdateNotesDataRoomMapData: null,
        ResponseMessage: action.message,
      };
    }

    //Save Notes Document

    case actions.SAVE_NOTES_DOCUMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SAVE_NOTES_DOCUMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        saveNotesDocumentData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_NOTES_DOCUMENT_FAILED: {
      return {
        ...state,
        Loading: true,
        saveNotesDocumentData: null,
        ResponseMessage: action.message,
      };
    }

    //Retrive Notes Document

    case actions.RETRIEVE_NOTES_DOCUMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.RETRIEVE_NOTES_DOCUMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        retrieveNotesDocumentData: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.RETRIEVE_NOTES_DOCUMENT_FAILED: {
      return {
        ...state,
        Loading: false,
        retrieveNotesDocumentData: null,
        ResponseMessage: action.message,
      };
    }

    //Save Files Notes Just like Save Files Groups
    case actions.SAVE_FILES_NOTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.SAVE_FILES_NOTES_SUCCESS: {
      return {
        ...state,
        Loading: true,
        saveFilesNotes: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.SAVE_FILES_NOTES_FALSE: {
      return {
        ...state,
        Loading: false,
        saveFilesNotes: null,
        ResponseMessage: action.message,
      };
    }

    //Upload Document Notes

    case actions.UPLOAD_DOCUMENT_NOTES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.UPLOAD_DOCUMENT_NOTES_SUCCESS: {
      return {
        ...state,
        Loading: true,
        uploadDocumentNotes: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.UPLOAD_DOCUMENT_NOTES_FAILED: {
      return {
        ...state,
        Loading: true,
        uploadDocumentNotes: null,
        ResponseMessage: action.message,
      };
    }

    // Delete Notes Documents

    case actions.DELETE_NOTES_DOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }

    case actions.DELETE_NOTES_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        deleteNotesDocument: action.response,
        ResponseMessage: action.message,
      };
    }

    case actions.DELETE_NOTES_DOCUMENTS_FAIL: {
      return {
        ...state,
        Loading: false,
        deleteNotesDocument: null,
        ResponseMessage: action.message,
      };
    }

    default:
      return {
        ...state,
      };
  }
};

export default NotesReducer;
