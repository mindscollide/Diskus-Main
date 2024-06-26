import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  createSignatureResponse: null,
  saveWorkFlowResponse: null,
  getWorkfFlowByFileId: null,
  addUpdateFieldValue: null,
  saveSignatureOocument: null,
  getAllFieldsByWorkflowID: null,
  sendDocumentResponse: null,
  getDataroomAnnotation: null,
  addAnnotationFilesAttachment: null,
  getAllSignatureDocumentsforCreator: null,
  getAllPendingForApprovalStats: null,
  listOfPendingForApprovalSignatures: null,
  getAllPendingApprovalStatuses: null,
  declineReason: null,
};

const SignatureWorkflowReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.CREATESIGNATUREFLOW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CREATESIGNATUREFLOW_SUCCESS: {
      console.log(
        { action },
        "CREATESIGNATUREFLOW_SUCCESSCREATESIGNATUREFLOW_SUCCESS"
      );
      return {
        ...state,
        Loading: false,
        createSignatureResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.CREATESIGNATUREFLOW_FAIL: {
      return {
        ...state,
        Loading: false,
        createSignatureResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_WORKFLOW_INT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVE_WORKFLOW_SUCCESS: {
      return {
        ...state,
        Loading: action.loading,
        saveWorkFlowResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_WORKFLOW_FAIL: {
      return {
        ...state,
        Loading: false,
        saveWorkFlowResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETWORKFLOWBYFILEID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETWORKFLOWBYFILEID_SUCCESS: {
      return {
        ...state,
        Loading: action.loading,
        getWorkfFlowByFileId: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETWORKFLOWBYFILEID_FAIL: {
      return {
        ...state,
        Loading: false,
        getWorkfFlowByFileId: null,
        ResponseMessage: action.message,
      };
    }
    case actions.ADD_UPDATE_FIELD_VALUE_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADD_UPDATE_FIELD_VALUE_SUCCESS: {
      return {
        ...state,
        Loading: action.loading,
        addUpdateFieldValue: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.ADD_UPDATE_FIELD_VALUE_FAIL: {
      return {
        ...state,
        Loading: false,
        addUpdateFieldValue: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_SIGNATURE_DOCUMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SAVE_SIGNATURE_DOCUMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        saveSignatureOocument: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SAVE_SIGNATURE_DOCUMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        saveSignatureOocument: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ALL_FIELDS_BY_WORKDFLOW_ID_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ALL_FIELDS_BY_WORKDFLOW_ID_SUCCESS: {
      return {
        ...state,
        Loading: action.loading,
        getAllFieldsByWorkflowID: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ALL_FIELDS_BY_WORKDFLOW_ID_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllFieldsByWorkflowID: null,
        ResponseMessage: action.message,
      };
    }
    case actions.SEND_DOCUMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.SEND_DOCUMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        sendDocumentResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.SEND_DOCUMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        sendDocumentResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ANNOTATION_FILE_SIGNATUREFLOW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GET_ANNOTATION_FILE_SIGNATUREFLOW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getDataroomAnnotation: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GET_ANNOTATION_FILE_SIGNATUREFLOW_FAIL: {
      return {
        ...state,
        Loading: false,
        getDataroomAnnotation: null,
        ResponseMessage: action.message,
      };
    }
    case actions.ADD_ANNOTATION_FILE_SIGNATUREFLOW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADD_ANNOTATION_FILE_SIGNATUREFLOW_SUCCESS: {
      return {
        ...state,
        Loading: action.loading,
        addAnnotationFilesAttachment: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.ADD_ANNOTATION_FILE_SIGNATUREFLOW_FAIL: {
      return {
        ...state,
        Loading: false,
        addAnnotationFilesAttachment: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETALLSIGNATUREFLOWDOCUMENTSFORCREATOR_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETALLSIGNATUREFLOWDOCUMENTSFORCREATOR_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllSignatureDocumentsforCreator: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETALLSIGNATUREFLOWDOCUMENTSFORCREATOR_ISFAIL: {
      return {
        ...state,
        Loading: false,
        getAllSignatureDocumentsforCreator: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETALLPENDINGAPPROVALSIGNATURES_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETALLPENDINGAPPROVALSIGNATURES_SUCCESS: {
      return {
        ...state,
        Loading: false,
        listOfPendingForApprovalSignatures: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETALLPENDINGAPPROVALSIGNATURES_FAIL: {
      return {
        ...state,
        Loading: false,
        listOfPendingForApprovalSignatures: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GETALLPENDINGAPPROVALSTATS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETALLPENDINGAPPROVALSTATS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllPendingForApprovalStats: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETALLPENDINGAPPROVALSTATS_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllPendingForApprovalStats: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETPENDINGAPPROVALSTATUSFORSIGNATUREFLOW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETPENDINGAPPROVALSTATUSFORSIGNATUREFLOW_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllPendingApprovalStatuses: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETPENDINGAPPROVALSTATUSFORSIGNATUREFLOW_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllPendingApprovalStatuses: null,
        ResponseMessage: action.message,
      };
    }
    case actions.DECLINE_REASON_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DECLINE_REASON_SUCCESS: {
      return {
        ...state,
        Loading: false,
        declineReason: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DECLINE_REASON_FAIL: {
      return {
        ...state,
        Loading: false,
        declineReason: null,
        ResponseMessage: action.message,
      };
    }
    case actions.CLEAR_RESPONSEMESSAGE_WORKFLOWREDUCER: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }

    default:
      return { ...state };
  }
};

export default SignatureWorkflowReducer;
