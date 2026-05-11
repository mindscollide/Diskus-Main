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
  deleteSignatureDocument: null,
  getAllSignatoriesStatusWise: null,
  updateActorBundleStatus: null,
  getDashboardPendingApprovalData: null,
  getSignatureFileAnnotationResponse: null,
  addUpdateSignatureFileAnnotationResponse: null,
  validateEncryptedStringMinuteReviewData: null,
  workflowsignaturedocumentbyme: null,
  workflowsignaturedocument: null,
  workflowSignaturedocumentStatusChange: null,
  workflowsignaturedocumentActionByMe: null,
  signatureDocumentStatusChangeForSignees: null,
  validateEncryptedStringSignatureDataResponse: null,
  addedAsMinuteReviwerMqttPayload: null,
};

const SignatureWorkflowReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SIGNATURE_DOCUMENT_STATUS_CHANGE_FOR_SIGNEES: {
      return {
        ...state,
        signatureDocumentStatusChangeForSignees: null,
      };
    }
    case actions.SIGNATURE_DOCUMENT_STATUS_CHANGE: {
      return {
        ...state,
        workflowSignaturedocumentStatusChange: action.response,
      };
    }
    case actions.SIGNATURE_DOCUMENT_ACTION_BY_ME: {
      return {
        ...state,
        workflowsignaturedocumentActionByMe: action.response,
      };
    }
    case actions.WORKFLOW_SIGNATURE_DOCUMENT_RECEIVED_BY_ME: {
      return {
        ...state,
        workflowsignaturedocumentbyme: action.response,
      };
    }
    case actions.WORKFLOW_SIGNATURE_DOCUMENT_RECEIVED: {
      return {
        ...state,
        workflowsignaturedocument: action.response,
      };
    }
    case actions.CREATESIGNATUREFLOW_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.CREATESIGNATUREFLOW_SUCCESS: {
      
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
        Loading: action.loader,
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
        Loading: action.loader,
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
    case actions.DELETE_SIGNATURE_DOCUMENT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.DELETE_SIGNATURE_DOCUMENT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        deleteSignatureDocument: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.DELETE_SIGNATURE_DOCUMENT_FAIL: {
      return {
        ...state,
        Loading: false,
        deleteSignatureDocument: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETALLSIGNATORIESSTATUS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETALLSIGNATORIESSTATUS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getAllSignatoriesStatusWise: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETALLSIGNATORIESSTATUS_FAIL: {
      return {
        ...state,
        Loading: false,
        getAllSignatoriesStatusWise: null,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATEACTORBUNDLESTATUS_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.UPDATEACTORBUNDLESTATUS_SUCCESS: {
      return {
        ...state,
        Loading: false,
        updateActorBundleStatus: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.UPDATEACTORBUNDLESTATUS_FAIL: {
      return {
        ...state,
        Loading: false,
        updateActorBundleStatus: null,
        ResponseMessage: action.message,
      };
    }
    case actions.GETDASHBOARDPENDINGAPPROVALDATA_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETDASHBOARDPENDINGAPPROVALDATA_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getDashboardPendingApprovalData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETDASHBOARDPENDINGAPPROVALDATA_FAIL: {
      return {
        ...state,
        Loading: false,
        getDashboardPendingApprovalData: null,
        ResponseMessage: action.message,
      };
    }

    case actions.GETSIGNATUREFILEANNOTATION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.GETSIGNATUREFILEANNOTATION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        getSignatureFileAnnotationResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.GETSIGNATUREFILEANNOTATION_FAIL: {
      return {
        ...state,
        Loading: false,
        getSignatureFileAnnotationResponse: null,
        ResponseMessage: action.message,
      };
    }
    case actions.ADDUPDATESIGNATUREFILEANNOTATION_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.ADDUPDATESIGNATUREFILEANNOTATION_SUCCESS: {
      return {
        ...state,
        Loading: false,
        addUpdateSignatureFileAnnotationResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.ADDUPDATESIGNATUREFILEANNOTATION_FAIL: {
      return {
        ...state,
        Loading: false,
        addUpdateSignatureFileAnnotationResponse: null,
        ResponseMessage: action.message,
      };
    }

    case actions.CLEAR_RESPONSEMESSAGE_WORKFLOWREDUCER: {
      return {
        ...state,
        ResponseMessage: "",
      };
    }
    case actions.VALIDATE_ENCRYPTED_MINUTES_ADD_REVIEWER_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VALIDATE_ENCRYPTED_MINUTES_ADD_REVIEWER_SUCCESS: {
      return {
        ...state,
        Loading: false,
        validateEncryptedStringMinuteReviewData: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.VALIDATE_ENCRYPTED_MINUTES_ADD_REVIEWER_FAIL: {
      return {
        ...state,
        Loading: false,
        validateEncryptedStringMinuteReviewData: null,
        ResponseMessage: action.message,
      };
    }
    case actions.VALIDATE_ENCRYPTED_MINUTES_ADD_REVIEWER_CLEAR: {
      return {
        ...state,
        validateEncryptedStringMinuteReviewData: null,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_SIGNATURE_DATA_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_SIGNATURE_DATA_SUCCESS: {
      
      return {
        ...state,
        Loading: false,
        validateEncryptedStringSignatureDataResponse: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_SIGNATURE_DATA_FAIL: {
      return {
        ...state,
        Loading: false,
        validateEncryptedStringSignatureDataResponse: null,

        ResponseMessage: action.message,
      };
    }
    case actions.VALIDATE_ENCRYPTED_STRING_SIGNATURE_DATA_CLEAR: {
      return {
        ...state,
        Loading: false,
        validateEncryptedStringSignatureDataResponse: null,
        ResponseMessage: "",
      };
    }

    case actions.COUNT_FOR_ADDED_AS_MINUTE_REVIWER: {
      return {
        ...state,
        addedAsMinuteReviwerMqttPayload: action.response,
      };
    }

    case actions.CLEAR_MINUTE_REVIEWER_MQTT: {
      return {
        ...state,
        addedAsMinuteReviwerMqttPayload: [],
      };
    }

    default:
      return { ...state };
  }
};

export default SignatureWorkflowReducer;
