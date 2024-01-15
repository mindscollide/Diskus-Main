import * as actions from "../action_types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RefreshToken } from "./Auth_action";
import {
  settingApi,
  meetingApi,
  reportDownload,
} from "../../commen/apis/Api_ends_points";
import {
  downloadDocument,
  downloadAttendanceReport,
} from "../../commen/apis/Api_config";
import Helper from "../../commen/functions/history_logout";

const ShowNotification = (message) => {
  return {
    type: actions.SHOW,
    message: message,
  };
};

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

const SetAttendanceLoaderFail = () => {
  return {
    type: actions.ATTENDANCE_DOWNLOAD_LOADER_FAIL,
  };
};

const downloadDocumentSuccess = (response) => {
  return {
    type: actions.DOWNLOAD_DOCUMENT_FILE_SUCCESS,
    response: response,
  };
};

const downloadDocumentFail = (response) => {
  return {
    type: actions.DOWNLOAD_DOCUMENT_FILE_FAIL,
    response: response,
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
  } else {
  }
  return (dispatch) => {
    dispatch(DownloadLoaderStart());
    axios({
      method: "post",
      url: settingApi,
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

// const download Report Attendance Init
const attendanceDownloadInit = () => {
  return {
    type: actions.DOWNLOAD_ATTENDANCE_REPORT_INIT,
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

export { DownloadFile, downloadAttendanceReportApi };
