import * as actions from "../action_types";

import {
  dataRoomApi,
  getCommitteesApi,
  meetingApi,
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
  ValidateEncryptedStringViewCommitteeListLinkRM,
  ValidateEncryptedStringViewCommitteeDetailLinkRM,
  setMeetingbyCommitteeIDRM,
  getMeetingbyCommitteeIDRM,
} from "../../commen/apis/Api_config";
import { GetAllUserChats } from "./Talk_action";
import { isFunction } from "../../commen/functions/utils";
import { AccessDeniedPolls } from "./Polls_actions";
import axiosInstance from "../../commen/functions/axiosInstance";
import { setCreateEditTab } from "./ModalStates_actions";
import { getAllUnpublishedMeetingData } from "../../hooks/meetingResponse/response";

// Upload Documents Init
const uploadDocument_init = () => {
  return {
    type: actions.UPLOAD_COMMITTEESS_DOCUMENTS_INIT,
  };
};

// Upload Documents Success
const uploadDocument_success = (response, message) => {
  return {
    type: actions.UPLOAD_COMMITTEESS_DOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};

// Upload Documents Fail
const uploadDocument_fail = (message) => {
  return {
    type: actions.UPLOAD_COMMITTEESS_DOCUMENTS_FAIL,
    message: message,
  };
};

// Upload Documents API
const uploadDocumentsCommitteesApi = (
  navigate,
  t,
  data,
  folderID,
  // newFolder,
  newfile,
) => {
  let creatorID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  return async (dispatch) => {
    dispatch(uploadDocument_init());
    let form = new FormData();
    form.append("RequestMethod", uploadDocumentsRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    form.append("File", data);
    await axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            uploadDocumentsCommitteesApi(
              navigate,
              t,
              data,
              folderID,
              // newFolder,
              newfile,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_01".toLowerCase(),
                )
            ) {
              newfile.push({
                DisplayFileName: response.data.responseResult.displayFileName,
                DiskusFileNameString:
                  response.data.responseResult.diskusFileName,
                ShareAbleLink: response.data.responseResult.shareAbleLink,
                FK_UserID: JSON.parse(creatorID),
                FK_OrganizationID: JSON.parse(organizationID),
                FileSize: Number(response.data.responseResult.fileSizeOnDisk),
                FileSizeOnDisk: Number(response.data.responseResult.fileSize),
              });

              dispatch(
                uploadDocument_success(response.data.responseResult, ""),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_02".toLowerCase(),
                )
            ) {
              dispatch(uploadDocument_fail(t("Failed-to-update-document")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_UploadDocuments_03".toLowerCase(),
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
    type: actions.SAVE_COMMITTEE_FILES_DOCUMENTS_INIT,
  };
};
// Save Files Success
const saveFiles_success = (response, message) => {
  return {
    type: actions.SAVE_COMMITTEE_FILES_DOCUMENTS_SUCCESS,
    response: response,
    message: message,
  };
};
// Save Files Fail
const saveFiles_fail = (message) => {
  return {
    type: actions.SAVE_COMMITTEE_FILES_DOCUMENTS_FAIL,
    message: message,
  };
};

// Save Files API
const saveFilesCommitteesApi = (navigate, t, data, folderID, newFolder) => {
  let createrID = localStorage.getItem("userID");
  let Data = {
    FolderID: folderID !== null ? folderID : 0,
    Files: data,
    UserID: JSON.parse(createrID),
    Type: 0,
  };
  return async (dispatch) => {
    dispatch(saveFiles_init());
    let form = new FormData();
    form.append("RequestMethod", saveFilesRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    await axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            saveFilesCommitteesApi(navigate, t, data, folderID, newFolder),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_01".toLowerCase(),
                )
            ) {
              try {
                let fileIds = response.data.responseResult.fileID;

                fileIds.map((newFileID, index) => {
                  return newFolder.push({
                    pK_FileID: newFileID.pK_FileID,
                    displayFileName: newFileID.displayFileName,
                  });
                });
              } catch (error) {}

              await dispatch(
                saveFiles_success(
                  response.data.responseResult,
                  t("File-successfully-uploaded"),
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_02".toLowerCase(),
                )
            ) {
              dispatch(saveFiles_fail(t("Failed-to-save-any-file")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "DataRoom_DataRoomServiceManager_SaveFiles_03".toLowerCase(),
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
    axiosInstance
      .post(getCommitteesApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllCommitteesByUserIdActions(navigate, t, currentPage));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_01".toLowerCase(),
                )
            ) {
              dispatch(
                getallcommitteesbyuserid_success(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_02".toLowerCase(),
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_03".toLowerCase(),
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_04".toLowerCase(),
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_05".toLowerCase(),
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_06".toLowerCase(),
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
    axiosInstance
      .post(getCommitteesApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getAllArcheivedCommittees(navigate, t, currentPage));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_01".toLowerCase(),
                )
            ) {
              dispatch(
                getArcheivedCommittees_success(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_02".toLowerCase(),
                )
            ) {
              dispatch(getArcheivedCommittees_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_03".toLowerCase(),
                )
            ) {
              dispatch(getArcheivedCommittees_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_04".toLowerCase(),
                )
            ) {
              dispatch(getArcheivedCommittees_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_05".toLowerCase(),
                )
            ) {
              dispatch(getArcheivedCommittees_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_SearchCommittees_06".toLowerCase(),
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
  setArchivedCommittee,
  flag,
) => {
  return (dispatch) => {
    dispatch(getCommitteByCommitteeID_Init());
    let form = new FormData();
    form.append("RequestMethod", getCommitteeByIdRequestMethod.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(getCommitteesApi, form)

      .then(async (response) => {
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
              setArchivedCommittee,
              flag,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_01".toLowerCase(),
                )
            ) {
              dispatch(
                getCommitteByCommitteeID_Success(
                  response.data.responseResult.committee,
                  "",
                ),
              );
              try {
                let newData = {
                  CommitteeID: Number(Data.CommitteeID),
                };
                await dispatch(
                  reteriveCommitteeDocumentsApi(navigate, t, newData),
                );
                if (CommitteeStatusID === 1) {
                  setViewGroupPage(true);
                  setUpdateComponentpage(false);
                  dispatch(viewCommitteePageFlag(true));
                  dispatch(updateCommitteePageFlag(false));
                } else if (CommitteeStatusID === 2) {
                  setUpdateComponentpage(false);
                  setArchivedCommittee(false);
                  setViewGroupPage(true);
                  dispatch(viewCommitteePageFlag(true));
                  dispatch(updateCommitteePageFlag(false));
                } else if (CommitteeStatusID === 3) {
                  setUpdateComponentpage(true);
                  setViewGroupPage(false);
                  dispatch(viewCommitteePageFlag(false));
                  dispatch(updateCommitteePageFlag(true));
                }

                if (flag === 1) {
                  (await isFunction(setViewGroupPage)) &&
                    setViewGroupPage(true);
                  dispatch(viewCommitteePageFlag(true));
                }
              } catch (error) {}
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_02".toLowerCase(),
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_03".toLowerCase(),
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_04".toLowerCase(),
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_05".toLowerCase(),
                )
            ) {
              dispatch(getCommitteByCommitteeID_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteeByCommitteeID_06".toLowerCase(),
                )
            ) {
              dispatch(AccessDeniedPolls(true));
              dispatch(getCommitteByCommitteeID_Fail(""));
            }
          } else {
            dispatch(getCommitteByCommitteeID_Fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getCommitteByCommitteeID_Fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getCommitteByCommitteeID_Fail(t("Something-went-wrong")));
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
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");

  return (dispatch) => {
    dispatch(createcommittee_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", createCommitteeRequestMethod.RequestMethod);
    axiosInstance
      .post(getCommitteesApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(createcommittee(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_01".toLowerCase(),
                )
            ) {
              await dispatch(
                createcommittee_success(
                  response.data.responseResult,
                  response.data.responseResult.committeeID,
                  "",
                ),
              );
              let newData = {
                CommitteeID: response.data.responseResult.committeeID,
                CommitteeTitle: Data.CommitteeDetails.CommitteesTitle,
                IsUpdateFlow: false,
                CommitteeMembers: Data.CommitteeMembers.map(
                  (data) => data.FK_UID,
                ),
              };
              dispatch(createUpdateCommitteeApi(navigate, t, newData));
              dispatch(GetAllUserChats(navigate, createrID, OrganizationID, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_02".toLowerCase(),
                )
            ) {
              dispatch(createcommittee_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_03".toLowerCase(),
                )
            ) {
              dispatch(createcommittee_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_04".toLowerCase(),
                )
            ) {
              dispatch(createcommittee_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_05".toLowerCase(),
                )
            ) {
              dispatch(createcommittee_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_CreateNewcommittee_06".toLowerCase(),
                )
            ) {
              dispatch(createcommittee_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(createcommittee_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(createcommittee_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
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
  return (dispatch) => {
    dispatch(getCommitteeTypes_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getallOrganizationCommitteType.RequestMethod);
    axiosInstance
      .post(getCommitteesApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getCommitteeTypes(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteType_01".toLowerCase(),
                )
            ) {
              await dispatch(
                getCommitteeTypes_Success(
                  response.data.responseResult.committeeTypes,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteType_02".toLowerCase(),
                )
            ) {
              dispatch(getCommitteeTypes_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteType_03".toLowerCase(),
                )
            ) {
              dispatch(getCommitteeTypes_Fail(""));
            } else {
              dispatch(getCommitteeTypes_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getCommitteeTypes_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
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
  return (dispatch) => {
    dispatch(getCommitteeMembersRole_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      getallOrganizationCommitteMemberRole.RequestMethod,
    );
    axiosInstance
      .post(getCommitteesApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getCommitteeMembersRole(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_01".toLowerCase(),
                )
            ) {
              await dispatch(
                getCommitteeMembersRole_Success(
                  response.data.responseResult.committeeMemberRoles,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_02".toLowerCase(),
                )
            ) {
              dispatch(getCommitteeMembersRole_Fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_03".toLowerCase(),
                )
            ) {
              dispatch(getCommitteeMembersRole_Fail(""));
            } else {
              dispatch(getCommitteeMembersRole_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(getCommitteeMembersRole_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
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
  let currentPage = JSON.parse(localStorage.getItem("CocurrentPage"));

  return (dispatch) => {
    dispatch(updateCommitteeStatus_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      updateCommitteeStatusRequestMethod.RequestMethod,
    );
    axiosInstance
      .post(getCommitteesApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(committeeStatusUpdate(navigate, Data, t, setIsActive));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommitteeStatus_01".toLowerCase(),
                )
            ) {
              await dispatch(
                updateCommitteeStatus_Success(response.data.responseResult, ""),
              );
              setIsActive(false);
              dispatch(
                getAllCommitteesByUserIdActions(navigate, t, currentPage),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommitteeStatus_02".toLowerCase(),
                )
            ) {
              dispatch(updateCommitteeStatus_Fail(t("No-record-updated")));
            } else {
              dispatch(updateCommitteeStatus_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(updateCommitteeStatus_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
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
  // let currentPage = JSON.parse(localStorage.getItem("CocurrentPage"));
  return (dispatch) => {
    dispatch(updatecommittee_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", updateCommitteeRequestMethod.RequestMethod);
    axiosInstance
      .post(getCommitteesApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateCommittee(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_01".toLowerCase(),
                )
            ) {
              await dispatch(
                updateCommittee_Success(
                  response.data.responseResult,
                  t("Committee-update"),
                ),
              );
              let newData = {
                CommitteeID: Data.CommitteeDetails.PK_CMID,
                CommitteeTitle: Data.CommitteeDetails.CommitteesTitle,
                IsUpdateFlow: true,
                CommitteeMembers: Data.CommitteeMembers.map(
                  (data) => data.FK_UID,
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
                  "Committees_CommitteeServiceManager_UpdateCommittee_02".toLowerCase(),
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_03".toLowerCase(),
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_04".toLowerCase(),
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_05".toLowerCase(),
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_UpdateCommittee_06".toLowerCase(),
                )
            ) {
              dispatch(updateCommittee_Fail(t("No-committee-update")));
            } else {
              dispatch(updateCommittee_Fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(updateCommittee_Fail(t("Something-went-wrong")));
          }
        }
      })
      .catch((response) => {
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
  let currentPage = JSON.parse(localStorage.getItem("CocurrentPage"));

  return (dispatch) => {
    dispatch(assignGroup_Init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append(
      "RequestMethod",
      CommitteeAndGroupMappingRequestMethod.RequestMethod,
    );
    axiosInstance
      .post(getCommitteesApi, form)

      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(assignGroups(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage.toLowerCase() ===
              "Committees_CommitteeServiceManager_CommitteeAndGroupMapping_01".toLowerCase()
            ) {
              await dispatch(assignGroup_Success(""));
              dispatch(
                getAllCommitteesByUserIdActions(navigate, t, currentPage),
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
          } else {
            dispatch(assignGroup_Failt(t("Something-went-wrong")));
          }
        } else {
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
  return (dispatch) => {
    dispatch(createUpdateCommitteeDocuments_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append(
      "RequestMethod",
      CreateUpdateCommitteeDatarRoomRM.RequestMethod,
    );
    axiosInstance
      .post(dataRoomApi, form)

      .then(async (response) => {
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
                "",
              ),
            );
            localStorage.setItem("CommitteeID", data.CommitteeID);
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_02".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_fail(
                t("Failed-to-save-or-map-folder"),
              ),
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_03".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_success(
                response.data.responseResult.folderID,
                "",
              ),
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_04".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_fail(t("Unable-to-update-folder")),
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_05".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_success(
                response.data.responseResult.folderID,
                "",
              ),
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_06".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_fail(
                t("Failed-to-created-new-mapping"),
              ),
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomServiceManager_CreateUpdateCommiteeDataRoomMap_07".toLowerCase()
          ) {
            dispatch(
              createUpdateCommitteeDocuments_fail(t("Something-went-wrong")),
            );
          } else {
            dispatch(
              createUpdateCommitteeDocuments_fail(t("Something-went-wrong")),
            );
          }
        } else {
          dispatch(
            createUpdateCommitteeDocuments_fail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(
          createUpdateCommitteeDocuments_fail(t("Something-went-wrong")),
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
  let currentPage = JSON.parse(localStorage.getItem("CocurrentPage"));

  return (dispatch) => {
    dispatch(saveCommitteeDocuments_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", saveCommitteeDocumentsRM.RequestMethod);
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
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
                t("Update-successfully"),
              ),
            );
            dispatch(createUpdateCommitteeDocuments_fail(""));
            if (typeof setCreategrouppage === "function") {
              await setCreategrouppage(false);
              await dispatch(
                getAllCommitteesByUserIdActions(navigate, t, currentPage),
              );
            }
            if (typeof setCreategrouppage === "number") {
              if (setCreategrouppage === 1) {
                // localStorage.removeItem("ViewCommitteeID");
                // dispatch(viewCommitteePageFlag(false));
              }
            }
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
  return (dispatch) => {
    dispatch(reteriveCommitteeDocuments_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(data));
    form.append("RequestMethod", reteriveCommitteeDocumentsRM.RequestMethod);
    axiosInstance
      .post(dataRoomApi, form)
      .then(async (response) => {
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
                "",
              ),
            );
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomManager_ReteriveCommitteeDocuments_02".toLowerCase()
          ) {
            dispatch(reteriveCommitteeDocuments_fail(""));
          } else if (
            response.data.responseResult.responseMessage.toLowerCase() ===
            "DataRoom_DataRoomManager_ReteriveCommitteeDocuments_03".toLowerCase()
          ) {
            dispatch(
              reteriveCommitteeDocuments_fail(t("Something-went-wrong")),
            );
          } else {
            dispatch(
              reteriveCommitteeDocuments_fail(t("Something-went-wrong")),
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

//Create Committee Page
const createCommitteePageFlag = (response) => {
  return {
    type: actions.CREATE_COMMITTEE_PAGE_FLAG,
    response: response,
  };
};

//Update Committee Page
const updateCommitteePageFlag = (response) => {
  return {
    type: actions.UPDATE_COMMITTEE_PAGE_FLAG,
    response: response,
  };
};

//View Committee Page
const viewCommitteePageFlag = (response) => {
  return {
    type: actions.VIEW_COMMITTEE_PAGE_FLAG,
    response: response,
  };
};

const removeCommitteeMemberMQTT = (response) => {
  return {
    type: actions.REMOVE_COMMITTEE_MEMBER,
    response: response,
  };
};
// List Committees
const validateEncryptedStringViewCommitteeListLink_Init = () => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_COMMITTEE_LIST_LINK_INIT,
});

const validateEncryptedStringViewCommitteeListLink_Success = (
  response,
  message,
) => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_COMMITTEE_LIST_LINK_SUCCESS,
  response,
  message,
});

const validateEncryptedStringViewCommitteeListLink_Fail = (message) => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_COMMITTEE_LIST_LINK_FAIL,
  message,
});
const validateEncryptedStringViewCommitteeListLinkApi = (
  encryptedString,
  navigate,
  t,
) => {
  return async (dispatch) => {
    try {
      let data = { EncryptedString: encryptedString };

      dispatch(validateEncryptedStringViewCommitteeListLink_Init());

      let form = new FormData();
      form.append(
        "RequestMethod",
        ValidateEncryptedStringViewCommitteeListLinkRM.RequestMethod,
      );
      form.append("RequestData", JSON.stringify(data));

      let response = await axiosInstance.post(getCommitteesApi, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(
          validateEncryptedStringViewCommitteeListLinkApi(
            encryptedString,
            navigate,
            t,
          ),
        );
      }

      if (response.data.responseCode === 200) {
        const responseResult = response.data.responseResult;

        if (responseResult.isExecuted) {
          const message = responseResult.responseMessage.toLowerCase();

          if (
            message.includes(
              "Committee_CommitteeServiceManager_ValidateEncryptedStringViewCommitteeListLink_01".toLowerCase(),
            )
          ) {
            dispatch(
              validateEncryptedStringViewCommitteeListLink_Success(
                responseResult.data,
                t("Successfully"),
              ),
            );
            return {
              response: responseResult.data,
              responseCode: 1,
              isExecuted: true,
            };
          } else if (
            message.includes(
              "Committee_CommitteeServiceManager_ValidateEncryptedStringViewCommitteeListLink_02".toLowerCase(),
            )
          ) {
            dispatch(
              validateEncryptedStringViewCommitteeListLink_Fail(
                t("Something-went-wrong"),
              ),
            );
            return {
              isExecuted: false,
              responseCode: 2,
            };
          } else if (
            message.includes(
              "Committee_CommitteeServiceManager_ValidateEncryptedStringViewCommitteeListLink_03".toLowerCase(),
            )
          ) {
            dispatch(
              validateEncryptedStringViewCommitteeListLink_Fail(
                t("Invalid-request-data"),
              ),
            );
            return {
              isExecuted: false,
              responseCode: 3,
            };
          } else if (
            message.includes(
              "Committee_CommitteeServiceManager_ValidateEncryptedStringViewCommitteeListLink_04".toLowerCase(),
            )
          ) {
            dispatch(
              validateEncryptedStringViewCommitteeListLink_Fail(
                t("Someting-went-wrong"),
              ),
            );
            return {
              isExecuted: false,
              responseCode: 4,
            };
          } else {
            dispatch(
              validateEncryptedStringViewCommitteeListLink_Fail(
                t("Unsuccessful"),
              ),
            );
            return {
              isExecuted: false,
              responseCode: 5,
            };
          }
        } else {
          dispatch(
            validateEncryptedStringViewCommitteeListLink_Fail(
              t("Something-went-wrong"),
            ),
          );
          return {
            isExecuted: false,
            responseCode: 5,
          };
        }
      } else {
        dispatch(
          validateEncryptedStringViewCommitteeListLink_Fail(
            t("Something-went-wrong"),
          ),
        );
        return {
          isExecuted: false,
          responseCode: 5,
        };
      }
    } catch (error) {
      dispatch(
        validateEncryptedStringViewCommitteeListLink_Fail(
          t("Something-went-wrong"),
        ),
      );
      return {
        isExecuted: false,
        responseCode: 0,
      };
    }
  };
};

// Details Committees Email Routes
const validateEncryptedStringViewCommitteeDetailLink_Init = () => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_COMMITTEE_LIST_LINK_INIT,
});

const validateEncryptedStringViewCommitteeDetailLink_Success = (
  response,
  message,
) => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_COMMITTEE_LIST_LINK_SUCCESS,
  response,
  message,
});

const validateEncryptedStringViewCommitteeDetailLink_Fail = (message) => ({
  type: actions.VALIDATE_ENCRYPTED_STRING_VIEW_COMMITTEE_LIST_LINK_FAIL,
  message,
});
const validateEncryptedStringViewCommitteeDetailLinkApi = (
  encryptedString,
  navigate,
  t,
) => {
  return async (dispatch) => {
    try {
      let data = { EncryptedString: encryptedString };

      dispatch(validateEncryptedStringViewCommitteeDetailLink_Init());

      let form = new FormData();
      form.append(
        "RequestMethod",
        ValidateEncryptedStringViewCommitteeDetailLinkRM.RequestMethod,
      );
      form.append("RequestData", JSON.stringify(data));

      let response = await axiosInstance.post(getCommitteesApi, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(
          validateEncryptedStringViewCommitteeDetailLinkApi(
            encryptedString,
            navigate,
            t,
          ),
        );
      }

      if (response.data.responseCode === 200) {
        const responseResult = response.data.responseResult;

        if (responseResult.isExecuted) {
          const message = responseResult.responseMessage.toLowerCase();

          if (
            message.includes(
              "Committee_CommitteeServiceManager_ValidateEncryptedStringViewCommitteeDetailsLink_01".toLowerCase(),
            )
          ) {
            dispatch(
              validateEncryptedStringViewCommitteeDetailLink_Success(
                responseResult.data,
                t("Successfully"),
              ),
            );
            return {
              response: responseResult.data,
              responseCode: 1,
              isExecuted: true,
            };
          } else if (
            message.includes(
              "Committee_CommitteeServiceManager_ValidateEncryptedStringViewCommitteeDetailsLink_02".toLowerCase(),
            )
          ) {
            dispatch(validateEncryptedStringViewCommitteeDetailLink_Fail(""));
            return {
              isExecuted: false,
              responseCode: 2,
            };
          } else if (
            message.includes(
              "Committee_CommitteeServiceManager_ValidateEncryptedStringViewCommitteeDetailsLink_03".toLowerCase(),
            )
          ) {
            dispatch(
              validateEncryptedStringViewCommitteeDetailLink_Fail(
                t("Invalid-request-data"),
              ),
            );
            return {
              isExecuted: false,
              responseCode: 3,
            };
          } else if (
            message.includes(
              "Committee_CommitteeServiceManager_ValidateEncryptedStringViewCommitteeDetailsLink_04".toLowerCase(),
            )
          ) {
            dispatch(
              validateEncryptedStringViewCommitteeDetailLink_Fail(
                t("Someting-went-wrong"),
              ),
            );
            return {
              isExecuted: false,
              responseCode: 4,
            };
          } else {
            dispatch(
              validateEncryptedStringViewCommitteeDetailLink_Fail(
                t("Someting-went-wrong"),
              ),
            );
            return {
              isExecuted: false,
              responseCode: 5,
            };
          }
        } else {
          dispatch(
            validateEncryptedStringViewCommitteeDetailLink_Fail(
              t("Something-went-wrong"),
            ),
          );
          return {
            isExecuted: false,
            responseCode: 5,
          };
        }
      } else {
        dispatch(
          validateEncryptedStringViewCommitteeDetailLink_Fail(
            t("Something-went-wrong"),
          ),
        );
        return {
          isExecuted: false,
          responseCode: 5,
        };
      }
    } catch (error) {
      dispatch(
        validateEncryptedStringViewCommitteeDetailLink_Fail(
          t("Something-went-wrong"),
        ),
      );
      return {
        isExecuted: false,
        responseCode: 0,
      };
    }
  };
};

// Set Meeting by Group ID

const getMeetingByCommitteeID_init = () => {
  return {
    type: actions.GETMEETINGBYCOMMITTEEID_INIT,
  };
};
const getMeetingByCommitteeID_success = (response, message) => {
  return {
    type: actions.GETMEETINGBYCOMMITTEEID_SUCCESS,
    response: response,
    message: message,
  };
};
const getMeetingByCommitteeID_fail = (message) => {
  return {
    type: actions.GETMEETINGBYCOMMITTEEID_FAIL,
    message: message,
  };
};
const getMeetingByCommitteeIdApi = (navigate, t, Data) => {
  return (dispatch) => {
    dispatch(getMeetingByCommitteeID_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", getMeetingbyCommitteeIDRM.RequestMethod);
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(getMeetingByCommitteeIdApi(navigate, t, Data));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByCommitteeID_01".toLowerCase(),
                )
            ) {
              let getMeetingData = await getAllUnpublishedMeetingData(
                response.data.responseResult.meetings,
                1,
              );
              let newMeetingData = {
                meetingStartedMinuteAgo:
                  response.data.responseResult.meetingStartedMinuteAgo,
                meetings: getMeetingData,
                pageNumbers: response.data.responseResult.pageNumbers,
                totalRecords: response.data.responseResult.totalRecords,
              };
              dispatch(getMeetingByCommitteeID_success(newMeetingData, ""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByCommitteeID_02".toLowerCase(),
                )
            ) {
              dispatch(getMeetingByCommitteeID_fail(t("No-record-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_GetMeetingsByCommitteeID_03".toLowerCase(),
                )
            ) {
              dispatch(getMeetingByCommitteeID_fail(t("Something-went-wrong")));
            } else {
              dispatch(getMeetingByCommitteeID_fail(t("Something-went-wrong")));
            }
          } else {
          }
        } else {
          dispatch(getMeetingByCommitteeID_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(getMeetingByCommitteeID_fail(t("Something-went-wrong")));
      });
  };
};

// set Meeting by Committee ID
const setMeetingbyCommitteeID_init = () => {
  return {
    type: actions.SETMEETINGBYCOMMITTEEID_INIT,
  };
};
const setMeetingbyCommitteeID_success = (response, message) => {
  return {
    type: actions.SETMEETINGBYCOMMITTEEID_SUCCESS,
    response: response,
    message: message,
  };
};
const setMeetingbyCommitteeID_fail = (message) => {
  return {
    type: actions.SETMEETINGBYCOMMITTEEID_FAIL,
    message: message,
  };
};
const setMeetingbyCommitteeIdApi = (navigate, t, Data, routePath, object) => {
  return (dispatch) => {
    dispatch(setMeetingbyCommitteeID_init());
    let form = new FormData();
    form.append("RequestData", JSON.stringify(Data));
    form.append("RequestMethod", setMeetingbyCommitteeIDRM.RequestMethod);
    axiosInstance
      .post(meetingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            setMeetingbyCommitteeIdApi(navigate, t, Data, routePath, object),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetCommitteeMeetings_01".toLowerCase(),
                )
            ) {
              dispatch(
                setMeetingbyCommitteeID_success(
                  response.data.responseResult,
                  "",
                ),
              );
              switch (routePath) {
                case "fromCommitteeAdvanceMeeting":
                  dispatch(setCreateEditTab("organizers"));
                  break;

                default:
                  // dispatch(
                  //   getMeetingByCommitteeIdApi(navigate, t, {
                  //     CommitteeID: Number(
                  //       localStorage.getItem("ViewCommitteeID"),
                  //     ),
                  //     Date: "",
                  //     Title: "",
                  //     HostName: "",
                  //     UserID: Number(localStorage.getItem("userID")),
                  //     PageNumber: 1,
                  //     Length: 30,
                  //     PublishedMeetings:
                  //       localStorage.getItem("MeetingCurrentView") &&
                  //       Number(localStorage.getItem("MeetingCurrentView")) === 1
                  //         ? true
                  //         : false,
                  //     ProposedMeetings:
                  //       localStorage.getItem("MeetingCurrentView") &&
                  //       Number(localStorage.getItem("MeetingCurrentView")) === 2
                  //         ? true
                  //         : false,
                  //   }),
                  // );
                  break;
              }
              // let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
              // let currentUserId = localStorage.getItem("userID");

              // let searchData = {
              //   CommitteeID: Number(ViewCommitteeID),
              //   Date: "",
              //   Title: "",
              //   HostName: "",
              //   UserID: Number(currentUserId),
              //   PageNumber: 1,
              //   Length: 30,
              //   PublishedMeetings:
              //     localStorage.getItem("MeetingCurrentView") &&
              //     Number(localStorage.getItem("MeetingCurrentView")) === 1
              //       ? true
              //       : false,
              //   ProposedMeetings:
              //     localStorage.getItem("MeetingCurrentView") &&
              //     Number(localStorage.getItem("MeetingCurrentView")) === 2
              //       ? true
              //       : false,
              // };
              // dispatch(getMeetingByCommitteeIdApi(navigate, t, searchData));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetCommitteeMeetings_02".toLowerCase(),
                )
            ) {
              dispatch(setMeetingbyCommitteeID_fail(t("No-record-save")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Meeting_MeetingServiceManager_SetCommitteeMeetings_03".toLowerCase(),
                )
            ) {
              dispatch(setMeetingbyCommitteeID_fail(t("Something-went-wrong")));
            } else {
              dispatch(setMeetingbyCommitteeID_fail(t("Something-went-wrong")));
            }
          } else {
            dispatch(setMeetingbyCommitteeID_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(setMeetingbyCommitteeID_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(setMeetingbyCommitteeID_fail(t("Something-went-wrong")));
      });
  };
};

// View Committee Details
export const viewCommitteeDetails = (data) => {
  return {
    type: actions.VIEW_COMMITTEE_DETAILS,
    payload: data,
  };
};

export const resetViewCommitteeDetails = () => {
  return {
    type: actions.RESET_VIEW_COMMITTEE_DETAILS,
  };
};

export {
  setMeetingbyCommitteeIdApi,
  getMeetingByCommitteeIdApi,
  validateEncryptedStringViewCommitteeDetailLinkApi,
  validateEncryptedStringViewCommitteeListLinkApi,
  removeCommitteeMemberMQTT,
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
  createCommitteePageFlag,
  updateCommitteePageFlag,
  viewCommitteePageFlag,
};
