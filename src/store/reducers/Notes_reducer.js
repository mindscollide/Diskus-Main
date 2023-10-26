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
      console.log(action, "responseresponse");
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
        Loading: false,
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
    default:
      return {
        ...state,
      };
  }
};

export default NotesReducer;
