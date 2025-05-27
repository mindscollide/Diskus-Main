import * as actions from "../action_types";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import {
  reportDownload,
  settingDownloadApi,
} from "../../commen/apis/Api_ends_points";
import {
  downloadDocument,
  downloadAttendanceReport,
  LoginHistoryReportExporttoExcel,
  AuditTrialReportExporttoExcel,
} from "../../commen/apis/Api_config";

const DownloadLoaderStart = () => {
  return {
    type: actions.GET_DOWNLOAD_LOADER_START,
  };
};

const downloadFail = (response) => {
  return {
    type: actions.GET_DOWNLOAD_FAIL,
    response: response,
  };
};

const SetLoaderFalseDownload = () => {
  return {
    type: actions.SET_LOADER_FALSE_DOWNLOAD,
  };
};

// DownloadFile
const DownloadFile = (navigate, data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let form = new FormData();
  form.append("RequestMethod", downloadDocument.RequestMethod);
  form.append("RequestData", JSON.stringify(data));
  var ext = data.OriginalFileName.split(".").pop();
  let contentType;
  if (ext === "doc") {
    contentType = "application/msword";
  } else if (ext === "docx") {
    contentType =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  } else if (ext === "xls") {
    contentType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (ext === "xlsx") {
    contentType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (ext === "pdf") {
    contentType = "application/pdf";
  } else if (ext === "png") {
    contentType = "image/png";
  } else if (ext === "txt") {
    contentType = "text/plain";
  } else if (ext === "jpg") {
    contentType = "image/jpeg";
  } else if (ext === "jpeg") {
    contentType = "image/jpeg";
  }
  return (dispatch) => {
    dispatch(DownloadLoaderStart());
    axios({
      method: "post",
      url: settingDownloadApi,
      data: form,
      headers: {
        _token: token,
        "Content-Disposition": "attachment; filename=template." + ext,
        // "Content-Type":
        //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Type": contentType,
      },
      responseType: "blob",
    })
      .then(async (response) => {
        if (response.status === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DownloadFile(navigate, data, t));
        } else if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", data.DisplayFileName);
          document.body.appendChild(link);
          link.click();

          dispatch(SetLoaderFalseDownload(false));
        }
      })
      .catch((response) => {
        dispatch(downloadFail(response));
      });
  };
};

// const download Report Attendance main API
const downloadAttendanceReportApi = (navigate, t, downloadData) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let form = new FormData();
  form.append("RequestMethod", downloadAttendanceReport.RequestMethod);
  form.append("RequestData", JSON.stringify(downloadData));
  return async (dispatch) => {
    await dispatch(DownloadLoaderStart());
    axios({
      method: "post",
      url: reportDownload,
      data: form,
      headers: {
        _token: token,
        "Content-Disposition": "attachment; filename=template.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      responseType: "arraybuffer",
    })
      .then(async (response) => {
        if (response.status === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(downloadAttendanceReportApi(navigate, t, downloadData));
        } else if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "download-Attendance-Report.xlsx");
          document.body.appendChild(link);
          link.click();
          dispatch(SetLoaderFalseDownload(false));
        }
      })
      .catch((response) => {
        dispatch(downloadFail(response));
      });
  };
};

const downlooadUserloginHistory_init = () => {
  return {
    type: actions.EXPORT_USERLOGINHISTORY_INIT,
  };
};
const downlooadUserloginHistory_success = (response, message) => {
  return {
    type: actions.EXPORT_USERLOGINHISTORY_SUCCESS,
    response: response,
    message: message,
  };
};
const downlooadUserloginHistory_fail = (message) => {
  return {
    type: actions.EXPORT_USERLOGINHISTORY_FAIL,
    message: message,
  };
};
const downlooadUserloginHistoryApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let form = new FormData();
  form.append("RequestMethod", LoginHistoryReportExporttoExcel.RequestMethod);
  form.append("RequestData", JSON.stringify(Data));
  return async (dispatch) => {
    await dispatch(downlooadUserloginHistory_init());
    axios({
      method: "post",
      url: reportDownload,
      data: form,
      headers: {
        _token: token,
        "Content-Disposition": "attachment; filename=template.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      responseType: "arraybuffer",
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(downlooadUserloginHistoryApi(navigate, t, Data));
        } else if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Login History Report.xlsx");
          document.body.appendChild(link);
          link.click();
          dispatch(
            downlooadUserloginHistory_success(
              response.data.responseResult,
              t("Download-successffuly")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(downlooadUserloginHistory_fail(response));
      });
  };
};

// Audit Trial Report Downoload

const downloadAuditTrialReport_init = () => {
  return {
    type: actions.EXPORT_AUDITTRIAL_REPORT_INIT,
  };
};
const downloadAuditTrialReport_success = (response, message) => {
  return {
    type: actions.EXPORT_AUDITTRIAL_REPORT_SUCCESS,
    response: response,
    message: message,
  };
};
const downloadAuditTrialReport_fail = (message) => {
  return {
    type: actions.EXPORT_AUDITTRIAL_REPORT_FAIL,
    message: message,
  };
};
const downloadAuditTrialReportApi = (navigate, t, Data) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let form = new FormData();
  form.append("RequestMethod", AuditTrialReportExporttoExcel.RequestMethod);
  form.append("RequestData", JSON.stringify(Data));
  return async (dispatch) => {
    await dispatch(downloadAuditTrialReport_init());
    axios({
      method: "post",
      url: reportDownload,
      data: form,
      headers: {
        _token: token,
        "Content-Disposition": "attachment; filename=template.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      responseType: "arraybuffer",
    })
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(downloadAuditTrialReportApi(navigate, t, Data));
        } else if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Audit Trial Report.xlsx");
          document.body.appendChild(link);
          link.click();
          dispatch(
            downloadAuditTrialReport_success(
              response.data.responseResult,
              t("Download-successffuly")
            )
          );
        }
      })
      .catch((response) => {
        dispatch(downloadAuditTrialReport_fail(response));
      });
  };
};

export {
  DownloadFile,
  downloadAttendanceReportApi,
  downlooadUserloginHistoryApi,
  downloadAuditTrialReportApi,
};
