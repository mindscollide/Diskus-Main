import * as actions from "../action_types";

const initialState = {
  Loading: false,
  ResponseMessage: "",
  severity: null, // success | error | ""
  GetAllAuthorities: null,
  GetAuthorityByID: null,
  DeleteAuthority: null,
  UpdateAuthority: null,
  AddAuthority: null,
  IsShortCodeExists: null,
  IsAuthorityNameExists: null,
  listOfComplianceByCreator: null,
  ViewComplianceByMeDetails: null,
  SearchComplianceForMe: null,
  ViewComplianceForMeById: null,
  GetComplianceChecklistsWithTasksByComplianceIdForMe: null,
  GetComplianceAndTaskStatuses: null,
  EditCompliance: null,

  // MQTT
  SocketAuthorityInactive: null,
  SocketAuthorityActive: null,
  SocketAuthorityDeleted: null,
  SocketAuthorityCreated: null,
  SocketAuthorityUpdated: null,
  MqttOrganizationSettingUpdated: null,
  GetAllAuthoritiesDropdown: null,
  GetAllTagsByOrganizationID: null,
  AddCompliance: null,
  AddComplianceChecklist: null,
  GetComplianceChecklistsByComplianceId: null,
  CheckComplianceTitleExists: null,
  ViewComplianceById: null,
  CheckChecklistTitleExists: null,
  AddTaskMappingToChecklist: null,
  GetComplianceChecklistsWithTasksByComplianceId: null,
  EditComplianceChecklist: null,
  GetQuarterlySubmittedDashboard: null,
  GetUpcomingDealineComplianceDashboard: null,
  GetComplianceByDashboardData: null,
  GetComplianceTasksDashboardData: null,
  GetComplianceReopenDashboardData: null,
  GetComlianceQuarterlyTasksDashboardData: null,
  GetReportListingData: null,
};

const ComplainceSettingReducerReducer = (state = initialState, action) => {
  switch (action.type) {
    // ================= GET ALL AUTHORITY =================
    case actions.GET_ALL_AUTHORITY_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.GET_ALL_AUTHORITY_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetAllAuthorities: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_ALL_AUTHORITY_FAIL:
      return {
        ...state,
        Loading: false,
        GetAllAuthorities: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ================= INITIAL RESET =================
    case actions.INITIAL_STATE_ADD_AUTHORITY:
      return {
        ...state,
        GetAuthorityByID: null,
        severity: null,
      };

    // ================= GET AUTHORITY BY ID =================
    case actions.GET_AUTHORITY_BY_ID_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.GET_AUTHORITY_BY_ID_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetAuthorityByID: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_AUTHORITY_BY_ID_FAIL:
      return {
        ...state,
        Loading: false,
        GetAuthorityByID: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ================= DELETE AUTHORITY =================
    case actions.DELETE_AUTHORITY_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.DELETE_AUTHORITY_SUCCESS:
      return {
        ...state,
        Loading: false,
        DeleteAuthority: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.DELETE_AUTHORITY_FAIL:
      return {
        ...state,
        Loading: false,
        DeleteAuthority: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ================= UPDATE AUTHORITY =================
    case actions.UPDATE_AUTHORITY_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.UPDATE_AUTHORITY_SUCCESS:
      return {
        ...state,
        Loading: false,
        UpdateAuthority: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.UPDATE_AUTHORITY_FAIL:
      return {
        ...state,
        Loading: false,
        UpdateAuthority: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ================= ADD AUTHORITY =================
    case actions.ADD_AUTHORITY_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.ADD_AUTHORITY_SUCCESS:
      return {
        ...state,
        Loading: false,
        AddAuthority: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.ADD_AUTHORITY_FAIL:
      return {
        ...state,
        Loading: false,
        AddAuthority: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ================= IsShortCodeExists =================
    case actions.IS_SHORT_CODE_EXIST_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.IS_SHORT_CODE_EXIST_SUCCESS:
      return {
        ...state,
        Loading: false,
        IsShortCodeExists: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.IS_SHORT_CODE_EXIST_FAIL:
      return {
        ...state,
        Loading: false,
        IsShortCodeExists: null,
        ResponseMessage: action.message,
        severity: "error",
      };
    // ================= IsAuthorityNameExists =================
    case actions.IS_AUTHORITY_NAME_EXIST_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.IS_AUTHORITY_NAME_EXIST_SUCCESS:
      return {
        ...state,
        Loading: false,
        IsAuthorityNameExists: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.IS_AUTHORITY_NAME_EXIST_FAIL:
      return {
        ...state,
        Loading: false,
        IsAuthorityNameExists: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // GetAllAuthoritiesDropDown
    case actions.GET_ALL_AUTHORITIES_DROPDOWN_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.GET_ALL_AUTHORITIES_DROPDOWN_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetAllAuthoritiesDropdown: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_ALL_AUTHORITIES_DROPDOWN_FAIL:
      return {
        ...state,
        Loading: false,
        GetAllAuthoritiesDropdown: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // GetAllTagsByOrganizationID
    case actions.GET_ALL_TAGS_BY_ORGANIZATION_ID_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.GET_ALL_TAGS_BY_ORGANIZATION_ID_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetAllTagsByOrganizationID: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_ALL_TAGS_BY_ORGANIZATION_ID_FAIL:
      return {
        ...state,
        Loading: false,
        GetAllTagsByOrganizationID: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // AddCompliance
    case actions.ADD_COMPLIANCE_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.ADD_COMPLIANCE_SUCCESS:
      return {
        ...state,
        Loading: false,
        AddCompliance: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.ADD_COMPLIANCE_FAIL:
      return {
        ...state,
        Loading: false,
        AddCompliance: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // AddComplianceChecklist
    case actions.ADD_COMPLIANCE_CHECKLIST_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.ADD_COMPLIANCE_CHECKLIST_SUCCESS:
      return {
        ...state,
        Loading: false,
        AddComplianceChecklist: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.ADD_COMPLIANCE_CHECKLIST_FAIL:
      return {
        ...state,
        Loading: false,
        AddComplianceChecklist: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // GetComplianceChecklistsByComplianceId
    case actions.GET_COMPLIANCE_CHECKLIST_BY_COMPLIANCE_ID_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.GET_COMPLIANCE_CHECKLIST_BY_COMPLIANCE_ID_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetComplianceChecklistsByComplianceId: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_COMPLIANCE_CHECKLIST_BY_COMPLIANCE_ID_FAIL:
      return {
        ...state,
        Loading: false,
        GetComplianceChecklistsByComplianceId: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // CheckComplianceTitleExists
    case actions.CHECK_COMPLIANCE_TITLE_EXIST_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.CHECK_COMPLIANCE_TITLE_EXIST_SUCCESS:
      return {
        ...state,
        Loading: false,
        CheckComplianceTitleExists: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.CHECK_COMPLIANCE_TITLE_EXIST_FAIL:
      return {
        ...state,
        Loading: false,
        CheckComplianceTitleExists: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ViewComplianceById
    case actions.VIEW_COMPLIANCE_BY_ID_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.VIEW_COMPLIANCE_BY_ID_SUCCESS:
      return {
        ...state,
        Loading: false,
        ViewComplianceById: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.VIEW_COMPLIANCE_BY_ID_FAIL:
      return {
        ...state,
        Loading: false,
        ViewComplianceById: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // CheckChecklistTitleExists
    case actions.CHECK_CHECKLIST_TITLE_EXISTS_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.CHECK_CHECKLIST_TITLE_EXISTS_SUCCESS:
      return {
        ...state,
        Loading: false,
        CheckChecklistTitleExists: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.CHECK_CHECKLIST_TITLE_EXISTS_FAIL:
      return {
        ...state,
        Loading: false,
        CheckChecklistTitleExists: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // AddTaskMappingToChecklist
    case actions.ADD_TASK_MAPPIING_TO_CHECKLIST_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.ADD_TASK_MAPPIING_TO_CHECKLIST_SUCCESS:
      return {
        ...state,
        Loading: false,
        AddTaskMappingToChecklist: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.ADD_TASK_MAPPIING_TO_CHECKLIST_FAIL:
      return {
        ...state,
        Loading: false,
        AddTaskMappingToChecklist: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // GetComplianceChecklistsWithTasksByComplianceId
    case actions.GET_TASK_BY_COMPLIANCE_ID_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.GET_TASK_BY_COMPLIANCE_ID_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetComplianceChecklistsWithTasksByComplianceId: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_TASK_BY_COMPLIANCE_ID_FAIL:
      return {
        ...state,
        Loading: false,
        GetComplianceChecklistsWithTasksByComplianceId: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // EditComplianceChecklist
    case actions.EDIT_COMPLIANCE_CHECKLIST_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.EDIT_COMPLIANCE_CHECKLIST_SUCCESS:
      return {
        ...state,
        Loading: false,
        EditComplianceChecklist: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.EDIT_COMPLIANCE_CHECKLIST_FAIL:
      return {
        ...state,
        Loading: false,
        EditComplianceChecklist: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // GetComplianceChecklistsWithTasksByComplianceId
    case actions.GET_COMPLIANCE_TASK_BY_COMPLIANCE_ID_FOR_ME_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.GET_COMPLIANCE_TASK_BY_COMPLIANCE_ID_FOR_ME_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetComplianceChecklistsWithTasksByComplianceIdForMe: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_COMPLIANCE_TASK_BY_COMPLIANCE_ID_FOR_ME_FAIL:
      return {
        ...state,
        Loading: false,
        GetComplianceChecklistsWithTasksByComplianceIdForMe: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    //MQTT for Authority Work
    case actions.AUTHORITY_INACTIVE:
      return {
        ...state,
        SocketAuthorityInactive: action.response,
        ResponseMessage: action.message,
      };

    case actions.AUTHORITY_ACTIVE:
      return {
        ...state,
        SocketAuthorityInactive: action.response,
        ResponseMessage: action.message,
      };
    case actions.AUTHORITY_DELETED:
      return {
        ...state,
        SocketAuthorityDeleted: action.response,
        ResponseMessage: action.message,
      };
    case actions.AUTHORITY_CREATED:
      return {
        ...state,
        SocketAuthorityCreated: action.response,
        ResponseMessage: action.message,
      };

    // AUTHORITY_UPDATED
    case actions.AUTHORITY_UPDATED:
      return {
        ...state,
        SocketAuthorityUpdated: action.response,
        ResponseMessage: action.message,
      };

    // Settings updated
    case actions.ORGANIZATION_SETTINGS_UPDATED:
      return {
        ...state,
        MqttOrganizationSettingUpdated: action.response,
        ResponseMessage: action.message,
      };

    case actions.GET_CLEAREMESSAGE_AUTHORITY:
      return {
        ...state,
        ResponseMessage: "",
        severity: null,
      };

    case actions.CLEAR_COMPLIANCEDETAILS_DATA:
      return {
        ...state,
        GetComplianceChecklistsWithTasksByComplianceId: null,
        GetComplianceChecklistsByComplianceId: null,
        ViewComplianceByMeDetails: null,
      };

    case actions.LIST_OF_COMPLIANCE_BY_CREATOR_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.LIST_OF_COMPLIANCE_BY_CREATOR_SUCCESS:
      return {
        ...state,
        Loading: false,
        listOfComplianceByCreator: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.LIST_OF_COMPLIANCE_BY_CREATOR_FAIL:
      return {
        ...state,
        Loading: false,
        listOfComplianceByCreator: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    case actions.VIEW_COMPLIANCE_BY_ME_DETAILS_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.VIEW_COMPLIANCE_BY_ME_DETAILS_SUCCESS:
      return {
        ...state,
        Loading: false,
        ViewComplianceByMeDetails: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.VIEW_COMPLIANCE_BY_ME_DETAILS_FAIL:
      return {
        ...state,
        Loading: false,
        ViewComplianceByMeDetails: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    case actions.SEARCH_COMPLIANCE_FOR_ME_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.SEARCH_COMPLIANCE_FOR_ME_SUCCESS:
      return {
        ...state,
        Loading: false,
        SearchComplianceForMe: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.SEARCH_COMPLIANCE_FOR_ME_FAIL:
      return {
        ...state,
        Loading: false,
        SearchComplianceForMe: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    case actions.VIEW_COMPLIANCE_FOR_ME_BY_ID_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.VIEW_COMPLIANCE_FOR_ME_BY_ID_SUCCESS:
      return {
        ...state,
        Loading: false,
        ViewComplianceForMeById: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.VIEW_COMPLIANCE_FOR_ME_BY_ID_FAIL:
      return {
        ...state,
        Loading: false,
        ViewComplianceForMeById: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    case actions.GET_COMPLIACE_STATUS_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.GET_COMPLIACE_STATUS_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetComplianceAndTaskStatuses: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_COMPLIACE_STATUS_FAIL:
      return {
        ...state,
        Loading: false,
        GetComplianceAndTaskStatuses: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // Get Quarterly Submitted Compliance Dashboard

    case actions.GET_QUARTERLY_SUBMITTED_COMPLIANCES_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.GET_QUARTERLY_SUBMITTED_COMPLIANCES_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetQuarterlySubmittedDashboard: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_QUARTERLY_SUBMITTED_COMPLIANCES_FAIL:
      return {
        ...state,
        Loading: false,
        GetQuarterlySubmittedDashboard: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    //GET Compliance Dashboard Upcoming Deadline API

    case actions.GET_UPCOMING_COMPLIANCES_DEADLINE_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.GET_UPCOMING_COMPLIANCES_DEADLINE_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetUpcomingDealineComplianceDashboard: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_UPCOMING_COMPLIANCES_DEADLINE_FAIL:
      return {
        ...state,
        Loading: false,
        GetUpcomingDealineComplianceDashboard: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    //GET Compliance By Dashboard API

    case actions.GET_COMPLIANCE_BY_DASHBOARD_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.GET_COMPLIANCE_BY_DASHBOARD_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetComplianceByDashboardData: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_COMPLIANCE_BY_DASHBOARD_FAIL:
      return {
        ...state,
        Loading: false,
        GetComplianceByDashboardData: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    //GET Compliance Tasks Dashboard API
    case actions.GET_COMPLIANCE_TASKS_DASHBOARD_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.GET_COMPLIANCE_TASKS_DASHBOARD_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetComplianceTasksDashboardData: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_COMPLIANCE_TASKS_DASHBOARD_FAIL:
      return {
        ...state,
        Loading: false,
        GetComplianceTasksDashboardData: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    //GET Compliance Reopen Dashboard API
    case actions.GET_COMPLIANCE_REOPEN_DASHBOARD_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.GET_COMPLIANCE_REOPEN_DASHBOARD_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetComplianceReopenDashboardData: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_COMPLIANCE_REOPEN_DASHBOARD_FAIL:
      return {
        ...state,
        Loading: false,
        GetComplianceReopenDashboardData: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    //GET Compliance Quarterly Tasks Dashboard API
    case actions.GET_COMPLIANCE_QUARTERLY_TASK_DASHBOARD_INIT:
      return {
        ...state,
        Loading: true,
        severity: null,
      };

    case actions.GET_COMPLIANCE_QUARTERLY_TASK_DASHBOARD_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetComlianceQuarterlyTasksDashboardData: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.GET_COMPLIANCE_QUARTERLY_TASK_DASHBOARD_FAIL:
      return {
        ...state,
        Loading: false,
        GetComlianceQuarterlyTasksDashboardData: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    //Reducer
    // EditCompliance
    case actions.EDIT_COMPLIANCE_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.EDIT_COMPLIANCE_SUCCESS:
      return {
        ...state,
        Loading: false,
        EditCompliance: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.EDIT_COMPLIANCE_FAIL:
      return {
        ...state,
        Loading: false,
        EditCompliance: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    //API For Report Compliance Listing
    case actions.COMPLIANCE_REPORT_LISTING_INIT:
      return {
        ...state,
        Loading: false,
        severity: null,
      };

    case actions.COMPLIANCE_REPORT_LISTING_SUCCESS:
      return {
        ...state,
        Loading: false,
        GetReportListingData: action.response,
        ResponseMessage: action.message,
        severity: "success",
      };

    case actions.COMPLIANCE_REPORT_LISTING_FAIL:
      return {
        ...state,
        Loading: false,
        GetReportListingData: null,
        ResponseMessage: action.message,
        severity: "error",
      };

    // ================= DEFAULT =================
    default:
      return state;
  }
};

export default ComplainceSettingReducerReducer;
