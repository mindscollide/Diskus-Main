import * as actions from "../action_types";
import axios from "axios";
import {
  dataRoomApi,
  getCommitteesApi,
} from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import {
  //   CreateCommittee,
  getCommitteesByUserID,
  getallOrganizationCommitteType,
  getallOrganizationCommitteMemberRole,
  createCommitteeRequestMethod,
  getCommitteeByIdRequestMethod,
  updateCommitteeStatusRequestMethod,
  updateCommitteeRequestMethod,
  CommitteeAndGroupMappingRequestMethod,
  saveFilesRequestMethod,
  uploadDocumentsRequestMethod,
  CreateUpdateCommitteeDatarRoomRM,
  saveCommitteeDocumentsRM,
  reteriveCommitteeDocumentsRM,
} from "../../commen/apis/Api_config";

// Upload Documents Init
const uploadDocument_init = () => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_INIT,
  };
};

// Upload Documents Success
const uploadDocument_success = (response, message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const uploadDocument_fail = (message) => {
  return {
    type: actions.UPLOAD_DOCUMENTS_DATAROOM_FAIL,
    message: message,
  };
};

// Upload Documents API
const uploadDocumentsCommitteesApi = (
  navigate,
  t,
  data,
  folderID,
  newFolder
) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return async (dispatch) => {
    dispatch(uploadDocument_init());
    let form = new FormData();
    form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
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
            uploadDocumentsCommitteesApi(navigate, t, data, folderID, newFolder)
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
              dispatch(
                uploadDocument_success(response.data.responseResult, "")
              );
              await dispatch(
                saveFilesCommitteesApi(
                  navigate,
                  t,
                  response.data.responseResult,
                  folderID,
                  newFolder
                )
              );
              // let newData = {
              //   DisplayAttachmentName: data.displayFileName,
              //   OriginalAttachmentName:
              //     response.data.responseResult.fileID.toString(),
              // };
              // newfile.push(newData);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase()
                )
            ) {
              dispatch(uploadDocument_fail(t("Failed-to-update-document")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase()
                )
            ) {
              dispatch(uploadDocument_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(uploadDocument_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(uploadDocument_fail(t("Something-went-wrong")));
        }
        // }
      })
      .catch((error) => {
        dispatch(uploadDocument_fail(t("Something-went-wrong")));
      });
  };
};

// Save Files Init
const saveFiles_init = () => {
  return {
    type: actions.SAVEFILES_DATAROOM_INIT,
  };
};
// Save Files Success
const saveFiles_success = (response, message) => {
  return {
    type: actions.SAVEFILES_DATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};
// Save Files Fail
const saveFiles_fail = (message) => {
  return {
    type: actions.SAVEFILES_DATAROOM_FAIL,
    message: message,
  };
};

// Save Files API
const saveFilesCommitteesApi = (navigate, t, data, folderID, newFolder) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: [
      {
        DisplayFileName: data.displayFileName,
        DiskusFileName: JSON.parse(data.diskusFileName),
        ShareAbleLink: data.shareAbleLink,
        FK_UserID: JSON.parse(createrID),
        FK_OrganizationID: JSON.parse(OrganizationID),
      },
    ],
    UserID: JSON.parse(createrID),
    Type: 0,
  };
  return async (dispatch) => {
    dispatch(saveFiles_init());
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
          dispatch(
            saveFilesCommitteesApi(navigate, t, data, folderID, newFolder)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase()
                )
            ) {
              newFolder.push({
                pK_FileID: response.data.responseResult.fileID,
                DisplayAttachmentName: data.displayFileName,
              });
              // pK_FileID: fileData.pK_FileID,
              // DisplayAttachmentName: fileData.displayFileName,
              await dispatch(
                saveFiles_success(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase()
                )
            ) {
              dispatch(saveFiles_fail(t("Failed-to-save-any-file")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase()
                )
            ) {
              dispatch(saveFiles_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(saveFiles_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(saveFiles_fail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(saveFiles_fail(t("Something-went-wrong")));
      });
  };
};

const getallcommitteesbyuserid_init = () => {
  return {
    type: actions.GET_ALL_COMMITTEES_BY_USERID_INIT,
  };
};

const getallcommitteesbyuserid_success = (response, message) => {
  return {
    type: actions.GET_ALL_COMMITTEES_BY_USERID_SUCCESS,
    response: response,
    message: message,
  };
};

const getallcommitteebyuserid_fail = (message) => {
  return {
    type: actions.GET_ALL_COMMITTEES_BY_USERID_FAIL,
    message: message,
  };
};

const getAllCommitteesByUserIdActions = (navigate, t, currentPage) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = localStorage.getItem("organizationID");
  let UserID = localStorage.getItem("userID");
  let Data = {
    UserId: parseInt(UserID),
    OrganizationID: JSON.parse(OrganizationID),
    Title: "",
    PageNumber: currentPage,
    Length: 8,
    Status: 0,
  };
  return async (dispatch) => {
    dispatch(getallcommitteesbyuserid_init());
    let form = new FormData();
    form.append("RequestMethod", getCommitteesByUserID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "committees");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllCommitteesByUserIdActions(navigate, t, currentPage));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_01".toLowerCase()
                )
            ) {
              dispatch(
                getallcommitteesbyuserid_success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_02".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_03".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_04".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_05".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_06".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getallcommitteebyuserid_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getallcommitteebyuserid_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getallcommitteebyuserid_fail(t("Something-went-wrong")));
      });
  };
};

const getArcheivedCommittees_init = () => {
  return {
    type: actions.ARCHEIVED_COMMITTES_INIT,
  };
};

const getArcheivedCommittees_success = (response, message) => {
  return {
    type: actions.ARCHEIVED_COMMITTES_SUCCESS,
    response: response,
    message: message,
  };
};

const getArcheivedCommittees_fail = (message) => {
  return {
    type: actions.ARCHEIVED_COMMITTES_FAIL,
    message: message,
  };
};

const getAllArcheivedCommittees = (navigate, t, currentPage) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = localStorage.getItem("organizationID");
  let UserID = localStorage.getItem("userID");
  let Data = {
    UserId: parseInt(UserID),
    OrganizationID: JSON.parse(OrganizationID),
    Title: "",
    PageNumber: currentPage,
    Length: 8,
    Status: 1,
  };
  return async (dispatch) => {
    dispatch(getArcheivedCommittees_init());
    let form = new FormData();
    form.append("RequestMethod", getCommitteesByUserID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "committees");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllArcheivedCommittees(navigate, t, currentPage));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_01".toLowerCase()
                )
            ) {
              dispatch(
                getArcheivedCommittees_success(
                  response.data.responseResult,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_02".toLowerCase()
                )
            ) {
              dispatch(getArcheivedCommittees_fail(t("No-data-available")));

              console.log("checking");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_03".toLowerCase()
                )
            ) {
              dispatch(getArcheivedCommittees_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_04".toLowerCase()
                )
            ) {
              dispatch(getArcheivedCommittees_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_05".toLowerCase()
                )
            ) {
              dispatch(getArcheivedCommittees_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_06".toLowerCase()
                )
            ) {
              dispatch(getArcheivedCommittees_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getArcheivedCommittees_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getArcheivedCommittees_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getArcheivedCommittees_fail(t("Something-went-wrong")));
      });
  };
};

const getallcommitteebyuserid_clear = () => {
  return {
    type: actions.CLEAR_MESSAGE_RESPONSE_COMMITTEE,
  };
};

const getCommitteByCommitteeID_Init = () => {
  return {
    type: actions.GET_COMMITTEE_BYCOMMITTEEID_INIT,
  };
};

const getCommitteByCommitteeID_Success = (response, message) => {
  return {
    type: actions.GET_COMMITTEE_BYCOMMITTEEID_SUCCESS,
    response: response,
    message: message,
  };
};

const getCommitteByCommitteeID_Fail = (message) => {
  return {
    type: actions.GET_COMMITTEE_BYCOMMITTEEID_FAIL,
    message: message,
  };
};

const getCommitteesbyCommitteeId = (
  navigate,
  Data,
  t,
  setViewGroupPage,
  setUpdateComponentpage,
  CommitteeStatusID,
  setArchivedCommittee
) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getCommitteByCommitteeID_Init());
    let form = new FormData();
    form.append("RequestMethod", getCommitteeByIdRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(
          "getAllCommitteesByUserIdActionsgetAllCommitteesByUserIdActions",
          response
        );
        console.log("checking");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            getCommitteesbyCommitteeId(
              navigate,
              Data,
              t,
              setViewGroupPage,
              setUpdateComponentpage,
              CommitteeStatusID,
              setArchivedCommittee
            )
          );
        } else if (response.data.responseCode === 200) {
          console.log("checking");
          if (response.data.responseResult.isExecuted === true) {
            console.log("checking");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_01".toLowerCase()
                )
            ) {
              dispatch(
                getCommitteByCommitteeID_Success(
                  response.data.responseResult.committee,
                  t("Data-available")
                )
              );
              let newData = {
                CommitteeID: Number(Data.CommitteeID),
              };
              await dispatch(
                reteriveCommitteeDocumentsApi(navigate, t, newData)
              );
              if (CommitteeStatusID === 1) {
                setViewGroupPage(true);
                setUpdateComponentpage(false);
              } else if (CommitteeStatusID === 2) {
                setUpdateComponentpage(false);
                setArchivedCommittee(false);
                setViewGroupPage(true);
              } else if (CommitteeStatusID === 3) {
                setUpdateComponentpage(true);
                setViewGroupPage(false);
              }
              console.log("checking");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_02".toLowerCase()
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_03".toLowerCase()
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_04".toLowerCase()
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_05".toLowerCase()
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(t("No-data-available")));
            }
          } else {
            dispatch(getCommitteByCommitteeID_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getCommitteByCommitteeID_Fail(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(getCommitteByCommitteeID_Fail(t("Something-went-wrong")));
        console.log("responseresponse", response);
      });
  };
};

const createcommittee_init = () => {
  return {
    type: actions.CREATE_COMMITTEE_INIT,
  };
};

const createcommittee_success = (response, committeeID, message) => {
  return {
    type: actions.CREATE_COMMITTEE_SUCCESS,
    response: response,
    committeeID: committeeID,
    message: message,
  };
};

const createcommittee_fail = (message) => {
  return {
    type: actions.CREATE_COMMITTEE_FAIL,
    message: message,
  };
};

const createcommittee = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(createcommittee_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", createCommitteeRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(createcommittee(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_01".toLowerCase()
                )
            ) {
              await dispatch(
                createcommittee_success(
                  response.data.responseResult,
                  response.data.responseResult.committeeID,
                  t("Data-available")
                )
              );
              let newData = {
                CommitteeID: response.data.responseResult.committeeID,
                CommitteeTitle: Data.CommitteeDetails.CommitteesTitle,
                IsUpdateFlow: false,
                CommitteeMembers: Data.CommitteeMembers.map(
                  (data) => data.FK_UID
                ),
              };
              dispatch(createUpdateCommitteeApi(navigate, t, newData));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_02".toLowerCase()
                )
            ) {
              dispatch(createcommittee_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_03".toLowerCase()
                )
            ) {
              dispatch(createcommittee_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_04".toLowerCase()
                )
            ) {
              dispatch(createcommittee_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_05".toLowerCase()
                )
            ) {
              dispatch(createcommittee_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_06".toLowerCase()
                )
            ) {
              dispatch(createcommittee_fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(createcommittee_fail(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(createcommittee_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(createcommittee_fail(t("Something-went-wrong")));
      });
  };
};

const getCommitteeTypes_Init = () => {
  return {
    type: actions.GET_ALL_COMMITTEE_TYPES_INIT,
  };
};

const getCommitteeTypes_Success = (response, message) => {
  return {
    type: actions.GET_ALL_COMMITTEE_TYPES_SUCCESS,
    response: response,
    message: message,
  };
};

const getCommitteeTypes_Fail = (message) => {
  return {
    type: actions.GET_ALL_COMMITTEE_TYPES_FAIL,
    message: message,
  };
};

const getCommitteeTypes = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getCommitteeTypes_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getallOrganizationCommitteType.RequestMethod);
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getCommitteeTypes(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteType_01".toLowerCase()
                )
            ) {
              await dispatch(
                getCommitteeTypes_Success(
                  response.data.responseResult.committeeTypes,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteType_02".toLowerCase()
                )
            ) {
              dispatch(getCommitteeTypes_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteType_03".toLowerCase()
                )
            ) {
              dispatch(getCommitteeTypes_Fail(t("No-data-available")));
            } else {
              console.log(response, "response");
              dispatch(getCommitteeTypes_Fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(getCommitteeTypes_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(getCommitteeTypes_Fail(t("Something-went-wrong")));
      });
  };
};

const getCommitteeMembersRole_Init = () => {
  return {
    type: actions.GET_COMMITTEE_MEMBERS_ROLES_INIT,
  };
};

const getCommitteeMembersRole_Success = (response, message) => {
  return {
    type: actions.GET_COMMITTEE_MEMBERS_ROLES_SUCCESS,
    response: response,
    message: message,
  };
};

const getCommitteeMembersRole_Fail = (message) => {
  return {
    type: actions.GET_COMMITTEE_MEMBERS_ROLES_FAIL,
    message: message,
  };
};

const getCommitteeMembersRole = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  return (dispatch) => {
    dispatch(getCommitteeMembersRole_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      getallOrganizationCommitteMemberRole.RequestMethod
    );
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getCommitteeMembersRole(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_01".toLowerCase()
                )
            ) {
              await dispatch(
                getCommitteeMembersRole_Success(
                  response.data.responseResult.committeeMemberRoles,
                  t("Data-available")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_02".toLowerCase()
                )
            ) {
              dispatch(getCommitteeMembersRole_Fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_03".toLowerCase()
                )
            ) {
              dispatch(getCommitteeMembersRole_Fail(t("No-data-available")));
            } else {
              console.log(response, "response");
              dispatch(getCommitteeMembersRole_Fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(getCommitteeMembersRole_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(getCommitteeMembersRole_Fail(t("Something-went-wrong")));
      });
  };
};

const updateCommitteeStatus_Init = () => {
  return {
    type: actions.UPDATE_COMMITTEE_STATUS_INIT,
  };
};

const updateCommitteeStatus_Success = (response, message) => {
  return {
    type: actions.UPDATE_COMMITTEE_STATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const updateCommitteeStatus_Fail = (message) => {
  return {
    type: actions.UPDATE_COMMITTEE_STATUS_FAIL,
    message: message,
  };
};

const committeeStatusUpdate = (navigate, Data, t, setIsActive) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("CocurrentPage"));

  return (dispatch) => {
    dispatch(updateCommitteeStatus_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      updateCommitteeStatusRequestMethod.RequestMethod
    );
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(committeeStatusUpdate(navigate, Data, t, setIsActive));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommitteeStatus_01".toLowerCase()
                )
            ) {
              await dispatch(
                updateCommitteeStatus_Success(
                  response.data.responseResult.committeeMemberRoles,
                  t("Record-updated-successfully")
                )
              );
              setIsActive(false);
              dispatch(
                getAllCommitteesByUserIdActions(navigate, t, currentPage)
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommitteeStatus_02".toLowerCase()
                )
            ) {
              dispatch(updateCommitteeStatus_Fail(t("No-record-updated")));
            } else {
              console.log(response, "response");
              dispatch(updateCommitteeStatus_Fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(updateCommitteeStatus_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(updateCommitteeStatus_Fail(t("Something-went-wrong")));
      });
  };
};

const updatecommittee_Init = () => {
  return {
    type: actions.UPDATE_COMMITTEE_INIT,
  };
};

const updateCommittee_Success = (response, message) => {
  return {
    type: actions.UPDATE_COMMITTEE_SUCCESS,
    response: response,
    message: message,
  };
};

const updateCommittee_Fail = (message) => {
  return {
    type: actions.UPDATE_COMMITTEE_FAIL,
    message: message,
  };
};

const updateCommittee = (navigate, Data, t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  // let currentPage = JSON.parse(localStorage.getItem("CocurrentPage"));
  return (dispatch) => {
    dispatch(updatecommittee_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", updateCommitteeRequestMethod.RequestMethod);
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateCommittee(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_01".toLowerCase()
                )
            ) {
              await dispatch(
                updateCommittee_Success(
                  response.data.responseResult,
                  t("Committee-update")
                )
              );
              let newData = {
                CommitteeID: Data.CommitteeDetails.PK_CMID,
                CommitteeTitle: Data.CommitteeDetails.CommitteesTitle,
                IsUpdateFlow: true,
                CommitteeMembers: Data.CommitteeMembers.map(
                  (data) => data.FK_UID
                ),
              };
              dispatch(createUpdateCommitteeApi(navigate, t, newData));
              // await setUpdateComponentpage(false);
              // await dispatch(
              // getAllCommitteesByUserIdActions(navigate, t, currentPage)
              // );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_02".toLowerCase()
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_03".toLowerCase()
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_04".toLowerCase()
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_05".toLowerCase()
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_06".toLowerCase()
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else {
              console.log(response, "response");
              dispatch(updateCommittee_Fail(t("Something-went-wrong")));
            }
          } else {
            console.log(response, "response");
            dispatch(updateCommittee_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
        console.log(response, "response");
        dispatch(updateCommittee_Fail(t("Something-went-wrong")));
      });
  };
};

const realtimeCommitteeResponse = (response) => {
  return {
    type: actions.REALTIME_COMMITTEES_RESPONSE,
    response: response,
  };
};

const realtimeCommitteeStatusResponse = (response) => {
  return {
    type: actions.REALTIME_COMMITTEES_STATUS_RESPONSE,
    response: response,
  };
};

const assignGroup_Init = () => {
  return {
    type: actions.COMMITTEE_GROUP_MAPPING_INIT,
  };
};

const assignGroup_Success = (message) => {
  return {
    type: actions.COMMITTEE_GROUP_MAPPING_SUCCESS,
    message: message,
  };
};
const assignGroup_Failt = (message) => {
  return {
    type: actions.COMMITTEE_GROUP_MAPPING_FAIL,
    message: message,
  };
};

const assignGroups = (navigate, Data, t, setMarketingTeam) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("CocurrentPage"));

  return (dispatch) => {
    dispatch(assignGroup_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      CommitteeAndGroupMappingRequestMethod.RequestMethod
    );
    axios({
      method: "post",
      url: getCommitteesApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(assignGroups(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          console.log(response, "response");
          if (response.data.responseResult.isExecuted === true) {
            console.log(response, "response");
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Committees_CommitteeServiceManager_CommitteeAndGroupMapping_01".toLowerCase()
            ) {
              await dispatch(assignGroup_Success(t("Record-save")));
              dispatch(
                getAllCommitteesByUserIdActions(navigate, t, currentPage)
              );
              setMarketingTeam(false);
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Committees_CommitteeServiceManager_CommitteeAndGroupMapping_02".toLowerCase()
            ) {
              dispatch(assignGroup_Failt(t("No-record-save")));
            } else if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Committees_CommitteeServiceManager_CommitteeAndGroupMapping_03".toLowerCase()
            ) {
              dispatch(assignGroup_Failt(t("Something-went-wrong")));
            }
            console.log(response, "response");
          } else {
            console.log(response, "response");
            dispatch(assignGroup_Failt(t("Something-went-wrong")));
          }
        } else {
          console.log(response, "response");
          dispatch(assignGroup_Failt(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(assignGroup_Failt(t("Something-went-wrong")));
      });
  };
};

const createUpdateCommitteeDocuments_init = () => {
  return {
    type: actions.CREATEUPDATECOMMITTEEDATAROOM_INIT,
  };
};

const createUpdateCommitteeDocuments_success = (response, message) => {
  return {
    type: actions.CREATEUPDATECOMMITTEEDATAROOM_SUCCESS,
    response: response,
    message: message,
  };
};

const createUpdateCommitteeDocuments_fail = (message) => {
  return {
    type: actions.CREATEUPDATECOMMITTEEDATAROOM_FAIL,
    message: message,
  };
};

// Create and Update Committees Api
const createUpdateCommitteeApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(createUpdateCommitteeDocuments_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append(
      "RequestMethod",
      CreateUpdateCommitteeDatarRoomRM.RequestMethod
    );
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(createUpdateCommitteeApi(navigate, t, data));
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_01".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_success(
                response.data.responseResult.folderID,
                t("Folder-mapped-with-data-room")
              )
            );
            localStorage.setItem("CommitteeID", data.CommitteeID);
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_02".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_fail(
                t("Failed-to-save-or-map-folder")
              )
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_03".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_success(
                response.data.responseResult.folderID,
                t("Update-successfullly")
              )
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_04".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_fail(t("Unable-to-update-folder"))
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_05".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_success(
                response.data.responseResult.folderID,
                t("New-mapped-created")
              )
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_06".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_fail(
                t("Failed-to-created-new-mapping")
              )
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_07".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_fail(t("Something-went-wrong"))
            );
          } else {
            dispatch(
              createUpdateCommitteeDocuments_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(
            createUpdateCommitteeDocuments_fail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          createUpdateCommitteeDocuments_fail(t("Something-went-wrong"))
        );
      });
  };
};

const saveCommitteeDocuments_init = () => {
  return {
    type: actions.SAVECOMMMITTEEDOCUMENTS_INIT,
  };
};

const saveCommitteeDocuments_success = (response, message) => {
  return {
    type: actions.SAVECOMMMITTEEDOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

const saveCommitteeDocuments_fail = (message) => {
  return {
    type: actions.SAVECOMMMITTEEDOCUMENTS_FAIL,
    message: message,
  };
};

// Save Committee Documents
const saveCommitteeDocumentsApi = (navigate, t, data, setCreategrouppage) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let currentPage = JSON.parse(localStorage.getItem("CocurrentPage"));

  return (dispatch) => {
    dispatch(saveCommitteeDocuments_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", saveCommitteeDocumentsRM.RequestMethod);
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(saveCommitteeDocumentsApi(navigate, t, data));
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomManager_SaveCommitteeDocuments_01".toLowerCase()
          ) {
            dispatch(
              saveCommitteeDocuments_success(
                response.data.responseResult,
                t("Update-successfully")
              )
            );
            await setCreategrouppage(false);
            await dispatch(
              getAllCommitteesByUserIdActions(navigate, t, currentPage)
            );
            dispatch(createUpdateCommitteeDocuments_fail(""));
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomManager_SaveCommitteeDocuments_02".toLowerCase()
          ) {
            dispatch(saveCommitteeDocuments_fail(t("Something-went-wrong")));
            dispatch(createUpdateCommitteeDocuments_fail(""));
          } else {
            dispatch(saveCommitteeDocuments_fail(t("Something-went-wrong")));
            dispatch(createUpdateCommitteeDocuments_fail(""));
          }
        } else {
          dispatch(saveCommitteeDocuments_fail(t("Something-went-wrong")));
          dispatch(createUpdateCommitteeDocuments_fail(""));
        }
      })
      .catch((response) => {
        dispatch(saveCommitteeDocuments_fail(t("Something-went-wrong")));
        dispatch(createUpdateCommitteeDocuments_fail(""));
      });
  };
};
const reteriveCommitteeDocuments_init = () => {
  return {
    type: actions.RETERIVECOMMITTEEDOCUMENTS_INIT,
  };
};

const reteriveCommitteeDocuments_success = (response, message) => {
  return {
    type: actions.RETERIVECOMMITTEEDOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

const reteriveCommitteeDocuments_fail = (message) => {
  return {
    type: actions.RETERIVECOMMITTEEDOCUMENTS_FAIL,
    message: message,
  };
};
// Reterive Committee Documents
const reteriveCommitteeDocumentsApi = (navigate, t, data) => {
  let token = JSON.parse(localStorage.getItem("token"));

  return (dispatch) => {
    dispatch(reteriveCommitteeDocuments_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", reteriveCommitteeDocumentsRM.RequestMethod);
    axios({
      method: "post",
      url: dataRoomApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(response, "response");
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(reteriveCommitteeDocumentsApi(navigate, t, data));
        } else if (
          response.data.responseCode === 200 &&
          response.data.responseResult.isExecuted === true
        ) {
          if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomManager_ReteriveCommitteeDocuments_01".toLowerCase()
          ) {
            dispatch(
              reteriveCommitteeDocuments_success(
                response.data.responseResult,
                t("Data-available")
              )
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomManager_ReteriveCommitteeDocuments_02".toLowerCase()
          ) {
            dispatch(reteriveCommitteeDocuments_fail(t("No-data-available")));
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomManager_ReteriveCommitteeDocuments_03".toLowerCase()
          ) {
            dispatch(
              reteriveCommitteeDocuments_fail(t("Something-went-wrong"))
            );
          } else {
            dispatch(
              reteriveCommitteeDocuments_fail(t("Something-went-wrong"))
            );
          }
        } else {
          dispatch(reteriveCommitteeDocuments_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(reteriveCommitteeDocuments_fail(t("Something-went-wrong")));
      });
  };
};

const viewDetailsCommitteeID = (id) => {
  return {
    type: actions.COMMITTEEID_VIEWDETAILS,
    payload: id,
  };
};

export {
  viewDetailsCommitteeID,
  saveCommitteeDocumentsApi,
  reteriveCommitteeDocumentsApi,
  createUpdateCommitteeApi,
  uploadDocumentsCommitteesApi,
  saveFilesCommitteesApi,
  getAllCommitteesByUserIdActions,
  getallcommitteebyuserid_clear,
  getCommitteeTypes,
  getCommitteeMembersRole,
  createcommittee,
  getCommitteesbyCommitteeId,
  committeeStatusUpdate,
  updateCommittee,
  realtimeCommitteeResponse,
  realtimeCommitteeStatusResponse,
  assignGroups,
  getAllArcheivedCommittees,
};
