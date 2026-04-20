/**
 * @file Download_reducer.js
 * @description Redux reducer for the `download` slice. Manages document and
 * report download requests: data-room files, user login-history reports, and
 * audit-trail exports.
 */
import * as actions from "../action_types";

/**
 * @type {object}
 * @property {boolean}     Loading                  - `true` while a download request is in progress.
 * @property {boolean}     ShowNotification         - `true` when the download success notification should show.
 * @property {boolean}     Fail                     - `true` when the download failed.
 * @property {string}      ResponseMessage          - Last API response or error message.
 * @property {Array}       downloadDocumentsList    - List of document download records.
 * @property {object|null} userLoginHistoryDownload - User login-history report download data.
 * @property {object|null} auditTrialDownload       - Audit-trail report download data.
 */
const initialState = {
  Loading: false,
  ShowNotification: false,
  Fail: false,
  ResponseMessage: "",
  downloadDocumentsList: [],
  userLoginHistoryDownload: null,
  auditTrialDownload: null,
};

/**
 * Reducer for the `download` slice.
 * Handles document and report download request lifecycle.
 *
 * @param {object} state  - Current download state.
 * @param {{ type: string, response?: *, message?: string }} action - Dispatched action.
 * @returns {object} Next state.
 */
const downloadReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_DOWNLOAD_LOADER_START:
      return { ...state, Loading: true };

    case actions.GET_DOWNLOAD_FAIL:
      return {
        ...state,
        Loading: false,
        Fail: true,
        ResponseMessage:
          action.response.responseMessage !== undefined
            ? action.response.responseMessage
            : action.response.responseResult.recordeMessage,
      };

    case actions.SET_LOADER_FALSE_DOWNLOAD:
      return { ...state, Loading: false };

    case action.ATTENDANCE_DOWNLOAD_LOADER_FAIL:
      return { ...state, Loading: false };

    case actions.SHOW:
      return { ...state, ShowNotification: true, Message: action.message };

    case actions.DOWNLOAD_DOCUMENT_FILE_SUCCESS:
      return {
        ...state,
        Loading: false,
        isSuccess: true,
        uploadDocumentsList: action.response,
        isExecuted: action.isExecuted,
        responseMessage: action.response.responseMessage,
      };

    case actions.DOWNLOAD_DOCUMENT_FILE_FAIL:
      return { ...state, Loading: false };

    case actions.DOWNLOAD_ATTENDANCE_REPORT_INIT:
      return { ...state, Loading: true };
    case actions.EXPORT_USERLOGINHISTORY_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.EXPORT_USERLOGINHISTORY_SUCCESS: {
      return {
        ...state,
        Loading: false,
        userLoginHistoryDownload: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.EXPORT_USERLOGINHISTORY_FAIL: {
      return {
        ...state,
        Loading: false,
        userLoginHistoryDownload: null,
        ResponseMessage: action.message,
      };
    }

    //Audit Trial Report
    case actions.EXPORT_AUDITTRIAL_REPORT_INIT: {
      return {
        ...state,
        Loading: true,
      };
    }
    case actions.EXPORT_AUDITTRIAL_REPORT_SUCCESS: {
      return {
        ...state,
        Loading: false,
        auditTrialDownload: action.response,
        ResponseMessage: action.message,
      };
    }
    case actions.EXPORT_AUDITTRIAL_REPORT_FAIL: {
      return {
        ...state,
        Loading: false,
        auditTrialDownload: null,
        ResponseMessage: action.message,
      };
    }
    default:
      return { ...state };
  }
};
export default downloadReducer;
