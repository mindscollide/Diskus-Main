import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  GetAllVotingMethods: null,
  GetAllResolutionStatus: null,
  GetResolutions: null,
  ScheduleResolution: null,
  UpdateResolution: null,
  getResolutionbyID: null,
  getResolutionResult: null,
  getVoteDetailsByID: null,
  closeResolutionResponse: null,
  updateVoteResponse: null,
  cancelResolutionResponse: null,
  UpdateResolutionByResolutionID: null,
  searchVoterResolution: null,
  currentResolutionView: 1,
  resoultionClosed: 1,
  createResolutionModal: false,
  updateResolutionModal: false,
  viewResolutionModal: false,
  mqttResolutionCreated: null,
  mqttResolutionCancelled: null,
  mqttResolutionClosed: null,
  UploadDocuments: null,
  SaveDocumentsIDs: [],
  updateResolutionDataroom: 0,
  saveResolutionDocuments: null,
  resultResolutionFlag: false,
  voteResolutionFlag: false,
  viewAttachmentFlag: false,
  emailEncryptedStringValidate: null,
  getAllCommitteesAndGroups: null,
};
const ResolutionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.UPLOAD_RESOLUTION_DOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPLOAD_RESOLUTION_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: true,
        UploadDocuments: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPLOAD_RESOLUTION_DOCUMENTS_FAIL: {
      return {
        ...state,
        Loading: false,
        UploadDocuments: null,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_RESOLUTION_DOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVE_RESOLUTION_DOCUMENTS_SUCCESS: {
      // let copyData = [...state.SaveDocumentsIDs];
      // copyData.push(action.response);
      return {
        ...state,
        Loading: false,
        SaveDocumentsIDs: [...state.SaveDocumentsIDs, action.response],
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_RESOLUTION_DOCUMENTS_FAIL: {
      return {
        ...state,
        Loading: false,
        SaveDocumentsIDs: [],
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATERESOLUTIONDATAROOMMAP_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATERESOLUTIONDATAROOMMAP_SUCCESS: {
      return {
        ...state,
        Loading: false,
        updateResolutionDataroom: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATERESOLUTIONDATAROOMMAP_FAIL: {
      return {
        ...state,
        Loading: false,
        updateResolutionDataroom: 0,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVERESOLUTIONDOCUMENTS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVERESOLUTIONDOCUMENTS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        saveResolutionDocuments: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVERESOLUTIONDOCUMENTS_FAIL: {
      return {
        ...state,
        Loading: false,
        saveResolutionDocuments: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CANCELLED_RESOLUTION_MQTT: {
      return {
        ...state,
        mqttResolutionCancelled: action.response,
      };
    }
    case actions.NEW_RESOLUTION_CREATED_MQTT: {
      return {
        ...state,
        mqttResolutionCreated: action.response,
      };
    }
    case actions.CLOSED_RESOLUTION_MQTT: {
      return {
        ...state,
        mqttResolutionClosed: action.response,
      };
    }
    case actions.CURRENTRESOLUTIONSTATE: {
      return {
        ...state,
        currentResolutionView: action.response,
      };
    }
    case actions.RESOLUTIONCLOSEDORNOTCLOSED: {
      return {
        ...state,
        resoultionClosed: action.response,
      };
    }
    case actions.GET_ALL_VOTING_METHOD_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ALL_VOTING_METHOD_SUCCESS: {
      return {
        ...state,
        Loading: action.loader,
        ResponseMessage: action.message,
        GetAllVotingMethods: action.response,
      };
    }
    case actions.GET_ALL_VOTING_METHOD_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        GetAllVotingMethods: null,
      };
    }
    case actions.GET_ALL_RESOLUTION_STATUS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ALL_RESOLUTION_STATUS_SUCCESS: {
      return {
        ...state,
        Loading: action.loader,
        GetAllResolutionStatus: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ALL_RESOLUTION_STATUS_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        GetAllResolutionStatus: null,
      };
    }
    case actions.GET_RESOLUTIONS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_RESOLUTIONS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        GetResolutions: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_RESOLUTIONS_FAIL: {
      return {
        ...state,
        Loading: false,
        GetResolutions: null,
        ResponseMessage: action.message,
      };
    }
    case actions.SCHEDULE_RESOLUTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SCHEDULE_RESOLUTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        ScheduleResolution: action.response,
      };
    }
    case actions.SCHEDULE_RESOLUTION_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        ScheduleResolution: null,
      };
    }
    case actions.ADD_UPDATE_DETAILS_RESOLUTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADD_UPDATE_DETAILS_RESOLUTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        UpdateResolution: action.response,
      };
    }
    case actions.ADD_UPDATE_DETAILS_RESOLUTION_FAIL: {
      return {
        ...state,
        Loading: false,
        ResponseMessage: action.message,
        UpdateResolution: null,
      };
    }
    case actions.GET_VOTESDETAILSBYID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_VOTESDETAILSBYID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getVoteDetailsByID: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_VOTESDETAILSBYID_FAIL: {
      return {
        ...state,
        Loading: false,
        getVoteDetailsByID: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_RESOLUTION_RESULTS_DETAILS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_RESOLUTION_RESULTS_DETAILS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getResolutionResult: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_RESOLUTION_RESULTS_DETAILS_FAIL: {
      return {
        ...state,
        Loading: false,
        getResolutionResult: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GET_RESOLUTION_BY_RESOLUTION_ID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_RESOLUTION_BY_RESOLUTION_ID_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getResolutionbyID: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_RESOLUTION_BY_RESOLUTION_ID_FAIL: {
      return {
        ...state,
        Loading: false,
        getResolutionbyID: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CANCEL_RESOLUTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CANCEL_RESOLUTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        cancelResolutionResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CANCEL_RESOLUTION_FAIL: {
      return {
        ...state,
        Loading: false,
        cancelResolutionResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CLOSE_RESOLUTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CLOSE_RESOLUTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        closeResolutionResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CLOSE_RESOLUTION_FAIL: {
      return {
        ...state,
        Loading: false,
        closeResolutionResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATE_VOTE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATE_VOTE_SUCCESS: {
      return {
        ...state,
        Loading: false,
        updateVoteResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATE_VOTE_FAIL: {
      return {
        ...state,
        Loading: false,
        updateVoteResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CLEAR_RESPONSEMESSAGE_RESOLUTION: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }
    case actions.SEARCH_VOTERRESOLUTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SEARCH_VOTERRESOLUTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        searchVoterResolution: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SEARCH_VOTERRESOLUTION_FAIL: {
      return {
        ...state,
        Loading: false,
        searchVoterResolution: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATE_RESOLUTION_MODAL: {
      return {
        ...state,
        createResolutionModal: action.payload,
      };
    }
    case actions.UPDATE_RESOLUTION_MODAL: {
      return {
        ...state,
        updateResolutionModal: action.payload,
      };
    }
    case actions.VIEW_RESOLUTION_MODAL: {
      return {
        ...state,
        viewResolutionModal: action.payload,
      };
    }

    case actions.RESULT_RESOLUTION_FLAG: {
      return {
        ...state,
        resultResolutionFlag: action.payload,
      };
    }
    case actions.VOTE_RESOLUTION_FLAG: {
      return {
        ...state,
        voteResolutionFlag: action.payload,
      };
    }
    case actions.VIEW_ATTACHMENT_FLAG: {
      return {
        ...state,
        viewAttachmentFlag: action.payload,
      };
    }
    case actions.VALIDATEENCRYPTEDSTRINGRESOLUTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VALIDATEENCRYPTEDSTRINGRESOLUTION_SUCCESS: {
      return {
        ...state,
        Loading: true,
        emailEncryptedStringValidate: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.VALIDATEENCRYPTEDSTRINGRESOLUTION_FAIL: {
      return {
        ...state,
        Loading: true,
        emailEncryptedStringValidate: null,
        ResponseMessage: action.message,
      };
    }
    case actions.RESOLUTION_EMAIL_ROUTE: {
      return {
        ...state,
        resolutionRouteID: action.response,
      };
    }
    case actions.GETGROUPSANDCOMMITTEESFORRESOLUTION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETGROUPSANDCOMMITTEESFORRESOLUTION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllCommitteesAndGroups: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETGROUPSANDCOMMITTEESFORRESOLUTION_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllCommitteesAndGroups: null,
        ResponseMessage: action.message,
      };
    }
    default: {
      return { ...state };
    }
  }
};
export default ResolutionReducer;
