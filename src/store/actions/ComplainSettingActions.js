import * as actions from "../action_types";

import { complainceApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import axiosInstance from "../../commen/functions/axiosInstance";
import {
  AddAuthority,
  DeleteAuthority,
  GetAllAuthority,
  GetAuthorityByID,
  UpdateAuthority,
  IsAuthorityNameExists,
  IsShortCodeExists,
  GetAllAuthoritiesDropdown,
  GetAllTagsByOrganizationID,
  AddCompliance,
  AddComplianceChecklist,
  GetComplianceChecklistsByComplianceId,
  CheckComplianceTitleExists,
  ViewComplianceById,
  CheckChecklistTitleExists,
  AddTaskMappingToChecklist,
  GetComplianceChecklistsWithTasksByComplianceId,
  EditComplianceChecklist,
  SearchCompliancesByCreatorIdRM,
  ViewComplianceByMeDetailsRM,
  ViewComplianceForMeById,
  SearchComplianceForMe,
  ViewComplianceDetailsByViewTypeRM,
  GetComplianceChecklistsWithTasksByComplianceIdForMe,
  GetComplianceAndTaskStatuses,
  GetComplianceQuarterlySubmitted,
  GetUpcomingComplianceDeadline,
  GetComplianceByDashboard,
  GetComplianceTasksDashboard,
  GetComplianceReopenDashboard,
  GetComplianceQuarterlyTasksDashboard,
  EditCompliance,
  GetReportComplianceListing,
} from "../../commen/apis/Api_config";
import { showDeleteAuthorityModal } from "./ManageAuthoriyAction";
import { type } from "@testing-library/user-event/dist/cjs/utility/index.js";

const GetAllAuthorityInit = () => {
  return {
    type: actions.GET_ALL_AUTHORITY_INIT,
  };
};

const GetAllAuthoritySuccess = (response, message) => {
  return {
    type: actions.GET_ALL_AUTHORITY_SUCCESS,
    response: response,
    message: message,
  };
};

const GetAllAuthorityFail = (message) => {
  return {
    type: actions.GET_ALL_AUTHORITY_FAIL,
    message: message,
  };
};

const GetAllAuthorityAPI = (navigate, data, t) => {
  return (dispatch) => {
    dispatch(GetAllAuthorityInit());
    let form = new FormData();
    form.append("RequestMethod", GetAllAuthority.RequestMethod);
    // ✅ send complete payload as JSON string
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllAuthorityAPI(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthority_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetAllAuthoritySuccess(response.data.responseResult, ""),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthority_02".toLowerCase(),
                )
            ) {
              await dispatch(GetAllAuthorityFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthority_03".toLowerCase(),
                )
            ) {
              await dispatch(GetAllAuthorityFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(GetAllAuthorityFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(GetAllAuthorityFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(GetAllAuthorityFail(t("Something-went-wrong")));
      });
  };
};

// GetAuthorityByID
const GetAuthorityByIDInit = () => {
  return {
    type: actions.GET_AUTHORITY_BY_ID_INIT,
  };
};

const GetAuthorityByIDSuccess = (response, message) => {
  return {
    type: actions.GET_AUTHORITY_BY_ID_SUCCESS,
    response: response,
    message: message,
  };
};

const GetAuthorityByIDFail = (message) => {
  return {
    type: actions.GET_AUTHORITY_BY_ID_FAIL,
    message: message,
  };
};

const GetAuthorityByIDAPI = (
  navigate,
  data,
  t,
  setAddEditViewAuthoriyModal,
  setAuthorityViewState,
  setAuthorityId,
  viewNo,
) => {
  return (dispatch) => {
    dispatch(GetAuthorityByIDInit());
    let form = new FormData();
    form.append("RequestMethod", GetAuthorityByID.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAuthorityByIDAPI(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAuthorityByID_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetAuthorityByIDSuccess(response.data.responseResult, ""),
              );
              setAddEditViewAuthoriyModal(true);
              setAuthorityViewState(viewNo);
              setAuthorityId(data.authorityId);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAuthorityByID_02".toLowerCase(),
                )
            ) {
              await dispatch(GetAuthorityByIDFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAuthorityByID_03".toLowerCase(),
                )
            ) {
              await dispatch(GetAuthorityByIDFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(GetAuthorityByIDFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(GetAuthorityByIDFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(GetAuthorityByIDFail(t("Something-went-wrong")));
      });
  };
};

// DeleteAuthority
const DeleteAuthorityInit = () => {
  return {
    type: actions.DELETE_AUTHORITY_INIT,
  };
};

const DeleteAuthoritySuccess = (response, message) => {
  return {
    type: actions.DELETE_AUTHORITY_SUCCESS,
    response: response,
    message: message,
  };
};

const DeleteAuthorityFail = (message) => {
  return {
    type: actions.DELETE_AUTHORITY_FAIL,
    message: message,
  };
};

const DeleteAuthorityAPI = (navigate, data, t, initialData) => {
  return (dispatch) => {
    dispatch(DeleteAuthorityInit());
    let form = new FormData();
    form.append("RequestMethod", DeleteAuthority.RequestMethod);
    form.append("RequestData", JSON.stringify(data));

    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(DeleteAuthorityAPI(navigate, data, t, initialData));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_DeleteAuthority_01".toLowerCase(),
                )
            ) {
              await dispatch(
                DeleteAuthoritySuccess(
                  response.data.responseResult,
                  t("Data-deleted-successfully"),
                ),
              );
              dispatch(showDeleteAuthorityModal(false));
              dispatch(GetAllAuthorityAPI(navigate, initialData, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_DeleteAuthority_02".toLowerCase(),
                )
            ) {
              await dispatch(DeleteAuthorityFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_DeleteAuthority_03".toLowerCase(),
                )
            ) {
              await dispatch(DeleteAuthorityFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(DeleteAuthorityFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(DeleteAuthorityFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(DeleteAuthorityFail(t("Something-went-wrong")));
      });
  };
};

// UpdateAuthority
const UpdateAuthorityInit = () => {
  return {
    type: actions.UPDATE_AUTHORITY_INIT,
  };
};

const UpdateAuthoritySuccess = (response, message) => {
  return {
    type: actions.UPDATE_AUTHORITY_SUCCESS,
    response: response,
    message: message,
  };
};

const UpdateAuthorityFail = (message) => {
  return {
    type: actions.UPDATE_AUTHORITY_FAIL,
    message: message,
  };
};

const UpdateAuthorityAPI = (
  navigate,
  Data,
  t,
  setAddEditViewAuthoriyModal,
  initialData,
  setSearchPayload,
) => {
  return (dispatch) => {
    dispatch(UpdateAuthorityInit());
    let form = new FormData();
    form.append("RequestMethod", UpdateAuthority.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            UpdateAuthorityAPI(
              navigate,
              Data,
              t,
              setAddEditViewAuthoriyModal,
              initialData,
              setSearchPayload,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_UpdateAuthority_01".toLowerCase(),
                )
            ) {
              await dispatch(
                UpdateAuthoritySuccess(
                  response.data.responseResult,
                  t("Authority-updated-successfully"),
                ),
              );
              setAddEditViewAuthoriyModal(false);
              setSearchPayload((prev) => ({
                ...prev,
                sRow: 0,
                length: 10,
              }));
              let Data = {
                shortCode: initialData.shortCode,
                authorityName: initialData.authorityName,
                countryId: initialData.countryId,
                sector: initialData.sector,
                authorityTitle: initialData.authorityTitle,
                sRow: 0,
                length: 10,
              };

              dispatch(GetAllAuthorityAPI(navigate, Data, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_UpdateAuthority_02".toLowerCase(),
                )
            ) {
              await dispatch(
                UpdateAuthorityFail(
                  t("Authority-shortCode-already-exists-for-this-organization"),
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_UpdateAuthority_03".toLowerCase(),
                )
            ) {
              await dispatch(
                UpdateAuthorityFail(
                  t("Authority-name-already-exists-for-this-organization"),
                ),
              );
            }
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Compliance_ComplianceServiceManager_UpdateAuthority_05".toLowerCase(),
              )
          ) {
            await dispatch(
              UpdateAuthorityFail(
                t(
                  "Authority-record-not-found-against-the-provided-authorityId",
                ),
              ),
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Compliance_ComplianceServiceManager_UpdateAuthority_06".toLowerCase(),
              )
          ) {
            await dispatch(UpdateAuthorityFail(t("Something-went-wrong")));
          } else {
            await dispatch(UpdateAuthorityFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(UpdateAuthorityFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(UpdateAuthorityFail(t("Something-went-wrong")));
      });
  };
};

// AddAuthority
const AddAuthorityInit = () => {
  return {
    type: actions.ADD_AUTHORITY_INIT,
  };
};

const AddAuthoritySuccess = (response, message) => {
  return {
    type: actions.ADD_AUTHORITY_SUCCESS,
    response: response,
    message: message,
  };
};

const AddAuthorityFail = (message) => {
  return {
    type: actions.ADD_AUTHORITY_FAIL,
    message: message,
  };
};

const AddAuthorityAPI = (
  navigate,
  data,
  t,
  setAddEditViewAuthoriyModal,
  searchPayload,
  setSearchPayload,
) => {
  return (dispatch) => {
    dispatch(AddAuthorityInit());
    let form = new FormData();
    form.append("RequestMethod", AddAuthority.RequestMethod);
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            AddAuthorityAPI(
              navigate,
              data,
              t,
              setAddEditViewAuthoriyModal,
              searchPayload,
              setSearchPayload,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddAuthority_01".toLowerCase(),
                )
            ) {
              await dispatch(
                AddAuthoritySuccess(
                  response.data.responseResult,
                  t("Authority-created-successfully"),
                ),
              );
              setAddEditViewAuthoriyModal(false);
              let Data = {
                shortCode: searchPayload.shortCode,
                authorityName: searchPayload.authorityName,
                countryId: searchPayload.countryId,
                sector: searchPayload.sector,
                authorityTitle: searchPayload.authorityTitle,
                sRow: 0,
                length: 10,
              };
              dispatch(GetAllAuthorityAPI(navigate, Data, t));
              setSearchPayload((prev) => ({
                ...prev,
                sRow: 0,
                length: 10,
              }));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddAuthority_02".toLowerCase(),
                )
            ) {
              await dispatch(
                AddAuthorityFail(
                  t("Authority-shortCode-already-exists-for-this-organization"),
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddAuthority_03".toLowerCase(),
                )
            ) {
              await dispatch(
                AddAuthorityFail(
                  t("Authority-name-already-exists-for-this-organization"),
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddAuthority_06".toLowerCase(),
                )
            ) {
              await dispatch(AddAuthorityFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(AddAuthorityFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(AddAuthorityFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(AddAuthorityFail(t("Something-went-wrong")));
      });
  };
};

// iSsHORTcoDEeXIST

const IsShortCodeExistsInit = () => {
  return {
    type: actions.IS_SHORT_CODE_EXIST_INIT,
  };
};

const IsShortCodeExistsSuccess = (response, message) => {
  return {
    type: actions.IS_SHORT_CODE_EXIST_SUCCESS,
    response: response,
    message: message,
  };
};

const IsShortCodeExistsFail = (message) => {
  return {
    type: actions.IS_SHORT_CODE_EXIST_FAIL,
    message: message,
  };
};

const IsShortCodeExistsAPI = (
  navigate,
  value,
  t,
  setErrors,
  setIsShortCodeExist,
) => {
  return (dispatch) => {
    let Data = {
      shortCode: value,
    };
    setIsShortCodeExist(true);
    dispatch(IsShortCodeExistsInit());
    let form = new FormData();
    form.append("RequestMethod", IsShortCodeExists.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            IsShortCodeExistsAPI(
              navigate,
              value,
              t,
              setErrors,
              setIsShortCodeExist,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsShortCodeExists_01".toLowerCase(),
                )
            ) {
              // The Name Already Exist
              await dispatch(IsShortCodeExistsFail(""));
              setIsShortCodeExist(null);
              setErrors((prev) => ({
                ...prev,
                shortCode: "Short Code Already Exist",
              }));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsShortCodeExists_02".toLowerCase(),
                )
            ) {
              // The Name is Unique
              setIsShortCodeExist(false);
              await dispatch(
                IsShortCodeExistsSuccess(response.data.responseResult, ""),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsShortCodeExists_03".toLowerCase(),
                )
            ) {
              setIsShortCodeExist(null);
              await dispatch(
                IsShortCodeExistsFail(t("Provided_shortCode-is-null-or-empty")),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsShortCodeExists_04".toLowerCase(),
                )
            ) {
              setIsShortCodeExist(null);
              await dispatch(IsShortCodeExistsFail(t("Something-went-wrong")));
            }
          } else {
            setIsShortCodeExist(null);
            await dispatch(IsShortCodeExistsFail(t("Something-went-wrong")));
          }
        } else {
          setIsShortCodeExist(null);
          await dispatch(IsShortCodeExistsFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(IsShortCodeExistsFail(t("Something-went-wrong")));
      });
  };
};

// IsAuthorityNameExists
const IsAuthorityNameExistsInit = () => {
  return {
    type: actions.IS_AUTHORITY_NAME_EXIST_INIT,
  };
};

const IsAuthorityNameExistsSuccess = (response, message) => {
  return {
    type: actions.IS_AUTHORITY_NAME_EXIST_SUCCESS,
    response: response,
    message: message,
  };
};

const IsAuthorityNameExistsFail = (message) => {
  return {
    type: actions.IS_AUTHORITY_NAME_EXIST_FAIL,
    message: message,
  };
};

const IsAuthorityNameExistsAPI = (
  navigate,
  value,
  t,
  setErrors,
  setIsAuthorityExist,
) => {
  let Data = {
    authorityName: value,
  };
  setIsAuthorityExist(true);
  return (dispatch) => {
    dispatch(IsAuthorityNameExistsInit());
    let form = new FormData();
    form.append("RequestMethod", IsAuthorityNameExists.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            IsAuthorityNameExistsAPI(
              navigate,
              value,
              t,
              setErrors,
              setIsAuthorityExist,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsAuthorityNameExists_01".toLowerCase(),
                )
            ) {
              // The Name Already Exist
              await dispatch(IsAuthorityNameExistsFail(""));
              setIsAuthorityExist(null);
              setErrors((prev) => ({
                ...prev,
                name: "Authority Already Exist",
              }));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsAuthorityNameExists_02".toLowerCase(),
                )
            ) {
              // The Name is Unique
              await dispatch(
                IsAuthorityNameExistsSuccess(response.data.responseResult, ""),
              );
              setIsAuthorityExist(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsAuthorityNameExists_03".toLowerCase(),
                )
            ) {
              setIsAuthorityExist(null);

              await dispatch(
                IsAuthorityNameExistsFail(
                  t("Provided_authorityName-is-null-or-empty"),
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsAuthorityNameExists_04".toLowerCase(),
                )
            ) {
              setIsAuthorityExist(null);

              await dispatch(
                IsAuthorityNameExistsFail(t("Something-went-wrong")),
              );
            }
          } else {
            setIsAuthorityExist(null);

            await dispatch(
              IsAuthorityNameExistsFail(t("Something-went-wrong")),
            );
          }
        } else {
          setIsAuthorityExist(null);

          await dispatch(IsAuthorityNameExistsFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        setIsAuthorityExist(null);

        dispatch(AddAuthorityFail(t("Something-went-wrong")));
      });
  };
};

// AddTaskMappingToChecklist
const AddTaskMappingToChecklistInit = () => {
  return {
    type: actions.ADD_TASK_MAPPIING_TO_CHECKLIST_INIT,
  };
};

const AddTaskMappingToChecklistSuccess = (response, message) => {
  return {
    type: actions.ADD_TASK_MAPPIING_TO_CHECKLIST_SUCCESS,
    response: response,
    message: message,
  };
};

const AddTaskMappingToChecklistFail = (message) => {
  return {
    type: actions.ADD_TASK_MAPPIING_TO_CHECKLIST_FAIL,
    message: message,
  };
};

const AddTaskMappingToChecklistAPI = (
  navigate,
  Data,
  t,
  complianceId,
  // setErrors,
  // setIsAuthorityExist
) => {
  return (dispatch) => {
    dispatch(AddTaskMappingToChecklistInit());
    let form = new FormData();
    form.append("RequestMethod", AddTaskMappingToChecklist.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            AddTaskMappingToChecklistAPI(navigate, Data, t, complianceId),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddTaskToChecklist_01".toLowerCase(),
                )
            ) {
              await dispatch(
                AddTaskMappingToChecklistSuccess(
                  response.data.responseResult,
                  t("Task-mapped-successfully"),
                ),
              );
              const Data_compId = {
                complianceId: complianceId,
              };
              dispatch(
                GetComplianceChecklistsWithTasksByComplianceIdAPI(
                  navigate,
                  Data_compId,
                  t,
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddTaskToChecklist_02".toLowerCase(),
                )
            ) {
              await dispatch(AddTaskMappingToChecklistFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddTaskToChecklist_03".toLowerCase(),
                )
            ) {
              await dispatch(AddTaskMappingToChecklistFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsAuthorityNameExists_04".toLowerCase(),
                )
            ) {
              await dispatch(
                AddTaskMappingToChecklistFail(t("Something-went-wrong")),
              );
            }
          } else {
            await dispatch(
              AddTaskMappingToChecklistFail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            AddTaskMappingToChecklistFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(AddTaskMappingToChecklistFail(t("Something-went-wrong")));
      });
  };
};

// GetALAUthorityDropDown
const GetAllAuthoritiesWithoutPaginationInit = () => {
  return {
    type: actions.GET_ALL_AUTHORITIES_DROPDOWN_INIT,
  };
};

const GetAllAuthoritiesWithoutPaginationSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_AUTHORITIES_DROPDOWN_SUCCESS,
    response: response,
    message: message,
  };
};

const GetAllAuthoritiesWithoutPaginationFail = (message) => {
  return {
    type: actions.GET_ALL_AUTHORITIES_DROPDOWN_FAIL,
    message: message,
  };
};

const GetAllAuthoritiesWithoutPaginationAPI = (navigate, t) => {
  return (dispatch) => {
    dispatch(GetAllAuthoritiesWithoutPaginationInit());
    let form = new FormData();
    form.append("RequestMethod", GetAllAuthoritiesDropdown.RequestMethod);
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllAuthoritiesWithoutPaginationAPI(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthoritiesWithoutPagination_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetAllAuthoritiesWithoutPaginationSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthoritiesWithoutPagination_02".toLowerCase(),
                )
            ) {
              // The Name is Unique
              await dispatch(GetAllAuthoritiesWithoutPaginationFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthoritiesWithoutPagination_03".toLowerCase(),
                )
            ) {
              await dispatch(GetAllAuthoritiesWithoutPaginationFail(""));
            }
          } else {
            await dispatch(
              GetAllAuthoritiesWithoutPaginationFail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            GetAllAuthoritiesWithoutPaginationFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetAllAuthoritiesWithoutPaginationFail(t("Something-went-wrong")),
        );
      });
  };
};
// GetAllTagsByOrganizationID
const GetAllTagsByOrganizationIDInit = () => {
  return {
    type: actions.GET_ALL_TAGS_BY_ORGANIZATION_ID_INIT,
  };
};

const GetAllTagsByOrganizationIDSuccess = (response, message) => {
  return {
    type: actions.GET_ALL_TAGS_BY_ORGANIZATION_ID_SUCCESS,
    response: response,
    message: message,
  };
};

const GetAllTagsByOrganizationIDFail = (message) => {
  return {
    type: actions.GET_ALL_TAGS_BY_ORGANIZATION_ID_FAIL,
    message: message,
  };
};

const GetAllTagsByOrganizationIDAPI = (navigate, value, t) => {
  let Data = { TagsTitle: value };

  return async (dispatch) => {
    dispatch(GetAllTagsByOrganizationIDInit());

    let form = new FormData();
    form.append("RequestMethod", GetAllTagsByOrganizationID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    try {
      const response = await axiosInstance.post(complainceApi, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken(navigate, t));
        return dispatch(GetAllTagsByOrganizationIDAPI(navigate, value, t));
      }

      if (
        response.data.responseCode === 200 &&
        response.data.responseResult?.isExecuted
      ) {
        dispatch(
          GetAllTagsByOrganizationIDSuccess(response.data.responseResult, ""),
        );

        // ✅ IMPORTANT: RETURN TAGS
        return response.data.responseResult.tags || [];
      }

      dispatch(GetAllTagsByOrganizationIDFail(""));
      return [];
    } catch (error) {
      dispatch(GetAllTagsByOrganizationIDFail(t("Something-went-wrong")));
      return [];
    }
  };
};

//AddCompliance
const AddComplianceInit = () => {
  return {
    type: actions.ADD_COMPLIANCE_INIT,
  };
};

const AddComplianceSuccess = (response, message) => {
  return {
    type: actions.ADD_COMPLIANCE_SUCCESS,
    response: response,
    message: message,
  };
};

const AddComplianceFail = (message) => {
  return {
    type: actions.ADD_COMPLIANCE_FAIL,
    message: message,
  };
};

const AddComplianceAPI = (
  navigate,
  Data,
  t,
  setComplianceInfo,
  setChecklistTabs,
) => {
  return (dispatch) => {
    dispatch(AddComplianceInit());
    let form = new FormData();
    form.append("RequestMethod", AddCompliance.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            AddComplianceAPI(
              navigate,
              Data,
              t,
              setComplianceInfo,
              setChecklistTabs,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddCompliance_01".toLowerCase(),
                )
            ) {
              await dispatch(
                AddComplianceSuccess(
                  response.data.responseResult,
                  "",
                  // t("Compliance-created-successfully")
                ),
              );
              setComplianceInfo({
                complianceId: response.data.responseResult.complianceId,
                complianceName: response.data.responseResult.complianceTitle,
              });
              const Data = {
                complianceId: response.data.responseResult.complianceId,
                viewType: 1,
              };
              dispatch(
                ViewComplianceDetailsByViewTypeAPI(
                  navigate,
                  Data,
                  t,
                  0,
                  null,
                  null,
                  null,
                ),
              );
              setChecklistTabs(2);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddCompliance_02".toLowerCase(),
                )
            ) {
              // The Name is Unique
              await dispatch(AddComplianceFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllTagsByOrganizationID_03".toLowerCase(),
                )
            ) {
              await dispatch(AddComplianceFail(""));
            }
          } else {
            await dispatch(AddComplianceFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(AddComplianceFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(AddComplianceFail(t("Something-went-wrong")));
      });
  };
};

//AddCompliance
const AddComplianceChecklistInit = () => {
  return {
    type: actions.ADD_COMPLIANCE_CHECKLIST_INIT,
  };
};

const AddComplianceChecklistSuccess = (response, message) => {
  return {
    type: actions.ADD_COMPLIANCE_CHECKLIST_SUCCESS,
    response: response,
    message: message,
  };
};

const AddComplianceChecklistFail = (message) => {
  return {
    type: actions.ADD_COMPLIANCE_CHECKLIST_FAIL,
    message: message,
  };
};

const AddComplianceChecklistAPI = (
  navigate,
  Data,
  t,
  complianceInfo,
  setChecklistData,
) => {
  const complianceId = {
    complianceId: complianceInfo.complianceId,
  };
  return (dispatch) => {
    dispatch(AddComplianceChecklistInit());
    let form = new FormData();
    form.append("RequestMethod", AddComplianceChecklist.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            AddComplianceChecklistAPI(
              navigate,
              Data,
              t,
              complianceInfo,
              setChecklistData,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddComplianceChecklist_01".toLowerCase(),
                )
            ) {
              await dispatch(
                AddComplianceChecklistSuccess(
                  response.data.responseResult,
                  t("Checklist-added-successfully"),
                ),
              );
              dispatch(
                GetComplianceChecklistsByComplianceIdAPI(
                  navigate,
                  complianceId,
                  t,
                ),
              );
              setChecklistData({
                checklistTitle: "",
                checklistDescription: "",
                checklistDueDate: "",
              });
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddComplianceChecklist_02".toLowerCase(),
                )
            ) {
              // The Name is Unique
              await dispatch(AddComplianceChecklistFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddComplianceChecklist_03".toLowerCase(),
                )
            ) {
              await dispatch(AddComplianceChecklistFail(""));
            }
          } else {
            await dispatch(
              AddComplianceChecklistFail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(AddComplianceChecklistFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(AddComplianceChecklistFail(t("Something-went-wrong")));
      });
  };
};

//AddCompliance
const GetComplianceChecklistsByComplianceIdInit = () => {
  return {
    type: actions.GET_COMPLIANCE_CHECKLIST_BY_COMPLIANCE_ID_INIT,
  };
};

const GetComplianceChecklistsByComplianceIdSuccess = (response, message) => {
  return {
    type: actions.GET_COMPLIANCE_CHECKLIST_BY_COMPLIANCE_ID_SUCCESS,
    response: response,
    message: message,
  };
};

const GetComplianceChecklistsByComplianceIdFail = (message) => {
  return {
    type: actions.GET_COMPLIANCE_CHECKLIST_BY_COMPLIANCE_ID_FAIL,
    message: message,
  };
};

const GetComplianceChecklistsByComplianceIdAPI = (navigate, Data, t) => {
  return (dispatch) => {
    dispatch(GetComplianceChecklistsByComplianceIdInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      GetComplianceChecklistsByComplianceId.RequestMethod,
    );
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetComplianceChecklistsByComplianceIdAPI(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsByComplianceId_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceChecklistsByComplianceIdSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsByComplianceId_02".toLowerCase(),
                )
            ) {
              // The Name is Unique
              await dispatch(GetComplianceChecklistsByComplianceIdFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsByComplianceId_03".toLowerCase(),
                )
            ) {
              await dispatch(GetComplianceChecklistsByComplianceIdFail(""));
            }
          } else {
            await dispatch(
              GetComplianceChecklistsByComplianceIdFail(
                t("Something-went-wrong"),
              ),
            );
          }
        } else {
          await dispatch(
            GetComplianceChecklistsByComplianceIdFail(
              t("Something-went-wrong"),
            ),
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetComplianceChecklistsByComplianceIdFail(t("Something-went-wrong")),
        );
      });
  };
};

//CheckComplianceTitleExists
const CheckComplianceTitleExistsInit = () => {
  return {
    type: actions.CHECK_COMPLIANCE_TITLE_EXIST_INIT,
  };
};

const CheckComplianceTitleExistsSuccess = (response, message) => {
  return {
    type: actions.CHECK_COMPLIANCE_TITLE_EXIST_SUCCESS,
    response: response,
    message: message,
  };
};

const CheckComplianceTitleExistsFail = (message) => {
  return {
    type: actions.CHECK_COMPLIANCE_TITLE_EXIST_FAIL,
    message: message,
  };
};

const CheckComplianceTitleExistsAPI = (
  navigate,
  Data,
  t,
  setIsChecklistTitleExist,
  setErrors,
) => {
  setIsChecklistTitleExist(true);
  return (dispatch) => {
    dispatch(CheckComplianceTitleExistsInit());
    let form = new FormData();
    form.append("RequestMethod", CheckComplianceTitleExists.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            CheckComplianceTitleExistsAPI(
              navigate,
              Data,
              t,
              setIsChecklistTitleExist,
              setErrors,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_CheckComplianceTitleExists_01".toLowerCase(),
                )
            ) {
              // Title Unique
              setIsChecklistTitleExist(false);
              await dispatch(
                CheckComplianceTitleExistsSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_CheckComplianceTitleExists_02".toLowerCase(),
                )
            ) {
              // Name Already Exist

              await dispatch(CheckComplianceTitleExistsFail(""));
              setIsChecklistTitleExist(null);
              setErrors((prev) => ({
                ...prev,
                complianceTitle: t(
                  "Compliance-title-already-exists-within-this-authority",
                ),
              }));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_CheckComplianceTitleExists_03".toLowerCase(),
                )
            ) {
              setIsChecklistTitleExist(null);
              await dispatch(CheckComplianceTitleExistsFail(""));
            }
          } else {
            setIsChecklistTitleExist(null);
            await dispatch(
              CheckComplianceTitleExistsFail(t("Something-went-wrong")),
            );
          }
        } else {
          setIsChecklistTitleExist(null);
          await dispatch(
            CheckComplianceTitleExistsFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        setIsChecklistTitleExist(null);
        dispatch(CheckComplianceTitleExistsFail(t("Something-went-wrong")));
      });
  };
};

//ViewComplianceById
const ViewComplianceByIdInit = () => {
  return {
    type: actions.VIEW_COMPLIANCE_BY_ID_INIT,
  };
};

const ViewComplianceByIdSuccess = (response, message) => {
  return {
    type: actions.VIEW_COMPLIANCE_BY_ID_SUCCESS,
    response: response,
    message: message,
  };
};

const ViewComplianceByIdFail = (message) => {
  return {
    type: actions.VIEW_COMPLIANCE_BY_ID_FAIL,
    message: message,
  };
};

const ViewComplianceByIdAPI = (navigate, Data, t) => {
  return (dispatch) => {
    dispatch(ViewComplianceByIdInit());
    let form = new FormData();
    form.append("RequestMethod", ViewComplianceById.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(ViewComplianceByIdAPI(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ViewComplianceById_01".toLowerCase(),
                )
            ) {
              await dispatch(
                ViewComplianceByIdSuccess(response.data.responseResult, ""),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ViewComplianceById_02".toLowerCase(),
                )
            ) {
              // The Name is Unique
              await dispatch(ViewComplianceByIdFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ViewComplianceById_03".toLowerCase(),
                )
            ) {
              await dispatch(ViewComplianceByIdFail(""));
            }
          } else {
            await dispatch(ViewComplianceByIdFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(ViewComplianceByIdFail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(ViewComplianceByIdFail(t("Something-went-wrong")));
      });
  };
};

//CheckChecklistTitleExists
const CheckChecklistTitleExistsInit = () => {
  return {
    type: actions.CHECK_CHECKLIST_TITLE_EXISTS_INIT,
  };
};

const CheckChecklistTitleExistsSuccess = (response, message) => {
  return {
    type: actions.CHECK_CHECKLIST_TITLE_EXISTS_SUCCESS,
    response: response,
    message: message,
  };
};

const CheckChecklistTitleExistsFail = (message) => {
  return {
    type: actions.CHECK_CHECKLIST_TITLE_EXISTS_FAIL,
    message: message,
  };
};

const CheckChecklistTitleExistsAPI = (
  navigate,
  Data,
  t,
  setErrors,
  setIsChecklistTitleExist,
) => {
  return (dispatch) => {
    setIsChecklistTitleExist(true);
    dispatch(CheckChecklistTitleExistsInit());
    let form = new FormData();
    form.append("RequestMethod", CheckChecklistTitleExists.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            CheckChecklistTitleExistsAPI(
              navigate,
              Data,
              t,
              setErrors,
              setIsChecklistTitleExist,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_CheckChecklistTitleExists_01".toLowerCase(),
                )
            ) {
              // Unique
              setIsChecklistTitleExist(false);
              await dispatch(
                CheckChecklistTitleExistsSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_CheckChecklistTitleExists_02".toLowerCase(),
                )
            ) {
              // Already Exist
              setIsChecklistTitleExist(null);
              setErrors({
                checklistTitle: t(
                  "Checklist-title-already-exists-in-this-compliance",
                ),
              });
              await dispatch(CheckChecklistTitleExistsFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_CheckChecklistTitleExists_03".toLowerCase(),
                )
            ) {
              setIsChecklistTitleExist(null);
              await dispatch(CheckChecklistTitleExistsFail(""));
            }
          } else {
            setIsChecklistTitleExist(null);
            await dispatch(
              CheckChecklistTitleExistsFail(t("Something-went-wrong")),
            );
          }
        } else {
          setIsChecklistTitleExist(null);
          await dispatch(
            CheckChecklistTitleExistsFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        setIsChecklistTitleExist(null);
        dispatch(CheckChecklistTitleExistsFail(t("Something-went-wrong")));
      });
  };
};

// GetComplianceChecklistsWithTasksByComplianceId
const GetComplianceChecklistsWithTasksByComplianceIdInit = () => {
  return {
    type: actions.GET_TASK_BY_COMPLIANCE_ID_INIT,
  };
};

const GetComplianceChecklistsWithTasksByComplianceIdSuccess = (
  response,
  message,
) => {
  return {
    type: actions.GET_TASK_BY_COMPLIANCE_ID_SUCCESS,
    response: response,
    message: message,
  };
};

const GetComplianceChecklistsWithTasksByComplianceIdFail = (message) => {
  return {
    type: actions.GET_TASK_BY_COMPLIANCE_ID_FAIL,
    message: message,
  };
};

const GetComplianceChecklistsWithTasksByComplianceIdAPI = (
  navigate,
  Data,
  t,
) => {
  return (dispatch) => {
    dispatch(GetComplianceChecklistsWithTasksByComplianceIdInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      GetComplianceChecklistsWithTasksByComplianceId.RequestMethod,
    );
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            GetComplianceChecklistsWithTasksByComplianceIdAPI(
              navigate,
              Data,
              t,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsWithTasksByComplianceId_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceChecklistsWithTasksByComplianceIdSuccess(
                  response.data.responseResult,
                  t(""),
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsWithTasksByComplianceId_02".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceChecklistsWithTasksByComplianceIdFail(""),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsWithTasksByComplianceId_03".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceChecklistsWithTasksByComplianceIdFail(""),
              );
            }
          } else {
            await dispatch(
              GetComplianceChecklistsWithTasksByComplianceIdFail(
                t("Something-went-wrong"),
              ),
            );
          }
        } else {
          await dispatch(
            GetComplianceChecklistsWithTasksByComplianceIdFail(
              t("Something-went-wrong"),
            ),
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetComplianceChecklistsWithTasksByComplianceIdFail(
            t("Something-went-wrong"),
          ),
        );
      });
  };
};

//EditComplianceChecklist
const EditComplianceChecklistInit = () => {
  return {
    type: actions.EDIT_COMPLIANCE_CHECKLIST_INIT,
  };
};

const EditComplianceChecklistSuccess = (response, message) => {
  return {
    type: actions.EDIT_COMPLIANCE_CHECKLIST_SUCCESS,
    response: response,
    message: message,
  };
};

const EditComplianceChecklistFail = (message) => {
  return {
    type: actions.EDIT_COMPLIANCE_CHECKLIST_FAIL,
    message: message,
  };
};

const EditComplianceChecklistAPI = (
  navigate,
  Data,
  t,
  complianceInfo,
  setChecklistData,
  setIsEditTrue,
) => {
  const complianceId = {
    complianceId: complianceInfo.complianceId,
  };
  return (dispatch) => {
    dispatch(EditComplianceChecklistInit());
    let form = new FormData();
    form.append("RequestMethod", EditComplianceChecklist.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            EditComplianceChecklistAPI(
              navigate,
              Data,
              t,
              complianceInfo,
              setChecklistData,
              setIsEditTrue,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_EditComplianceChecklist_01".toLowerCase(),
                )
            ) {
              await dispatch(
                EditComplianceChecklistSuccess(
                  response.data.responseResult,
                  t("Checklist-updated-successfully"),
                ),
              );
              setIsEditTrue(false);
              dispatch(
                GetComplianceChecklistsByComplianceIdAPI(
                  navigate,
                  complianceId,
                  t,
                ),
              );
              setChecklistData({
                checklistTitle: "",
                checklistDescription: "",
                checklistDueDate: "",
              });
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_EditComplianceChecklist_02".toLowerCase(),
                )
            ) {
              // The Name is Unique
              await dispatch(EditComplianceChecklistFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_EditComplianceChecklist_03".toLowerCase(),
                )
            ) {
              await dispatch(EditComplianceChecklistFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_EditComplianceChecklist_04".toLowerCase(),
                )
            ) {
              await dispatch(EditComplianceChecklistFail(""));
            }
          } else {
            await dispatch(
              EditComplianceChecklistFail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            EditComplianceChecklistFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(EditComplianceChecklistFail(t("Something-went-wrong")));
      });
  };
};

const clearAuthorityMessage = () => {
  return {
    type: actions.GET_CLEAREMESSAGE_AUTHORITY,
  };
};

const clearComplianceDetailsData = () => {
  return {
    type: actions.CLEAR_COMPLIANCEDETAILS_DATA,
  };
};

const initialAddEditAuthority = () => {
  return {
    type: actions.INITIAL_STATE_ADD_AUTHORITY,
  };
};

// get AuthorityInactiveStatus Data from Socket
const setInactiveStatusData = (response) => {
  return {
    type: actions.AUTHORITY_INACTIVE,
    response: response,
  };
};

// get AuthorityActiveStatus Data from Socket
const setActiveStatusData = (response) => {
  return {
    type: actions.AUTHORITY_ACTIVE,
    response: response,
  };
};
// get AuthoirtyDelete Data from Socket
const setDeleteStatusData = (response) => {
  return {
    type: actions.AUTHORITY_DELETED,
    response: response,
  };
};
// get AuthoirtyDelete Data from Socket
const setAuthorityCreatedData = (response) => {
  return {
    type: actions.AUTHORITY_CREATED,
    response: response,
  };
};

// get AuthoirtyDelete Data from Socket
const setAuthorityUpdatedData = (response) => {
  return {
    type: actions.AUTHORITY_UPDATED,
    response: response,
  };
};

// get OraganizationSettingUpdated Data from Socket
const setOrganizationSettingUpdateData = (response) => {
  return {
    type: actions.ORGANIZATION_SETTINGS_UPDATED,
    response: response,
  };
};

// get listOfComplianceByCreator Data from Socket
const listOfComplianceByCreator_init = () => {
  return {
    type: actions.LIST_OF_COMPLIANCE_BY_CREATOR_INIT,
  };
};

const listOfComplianceByCreator_success = (response, message) => {
  return {
    type: actions.LIST_OF_COMPLIANCE_BY_CREATOR_SUCCESS,
    response: response,
    message: message,
  };
};

const listOfComplianceByCreator_fail = (response) => {
  return {
    type: actions.LIST_OF_COMPLIANCE_BY_CREATOR_FAIL,
    response: response,
  };
};

const listOfComplianceByCreatorApi = (navigate, Data, t) => {
  return (dispatch) => {
    dispatch(listOfComplianceByCreator_init());
    let form = new FormData();
    form.append("RequestMethod", SearchCompliancesByCreatorIdRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(listOfComplianceByCreatorApi(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_SearchCompliancesByCreatorId_01".toLowerCase(),
                )
            ) {
              await dispatch(
                listOfComplianceByCreator_success(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_SearchCompliancesByCreatorId_02".toLowerCase(),
                )
            ) {
              // The Name is Unique
              await dispatch(listOfComplianceByCreator_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_SearchCompliancesByCreatorId_03".toLowerCase(),
                )
            ) {
              await dispatch(listOfComplianceByCreator_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_EditComplianceChecklist_04".toLowerCase(),
                )
            ) {
              await dispatch(listOfComplianceByCreator_fail(""));
            }
          } else {
            await dispatch(
              listOfComplianceByCreator_fail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            listOfComplianceByCreator_fail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(listOfComplianceByCreator_fail(t("Something-went-wrong")));
      });
  };
};

const viewComplianceByMeDetails_init = () => {
  return {
    type: actions.VIEW_COMPLIANCE_BY_ME_DETAILS_INIT,
  };
};

const viewComplianceByMeDetails_success = (response, message) => {
  return {
    type: actions.VIEW_COMPLIANCE_BY_ME_DETAILS_SUCCESS,
    response: response,
    message: message,
  };
};

const viewComplianceByMeDetails_fail = (response) => {
  return {
    type: actions.VIEW_COMPLIANCE_BY_ME_DETAILS_FAIL,
    response: response,
  };
};

// const ViewComplianceByMeDetailsAPI = (
//   navigate,
//   Data,
//   t,
//   value,
//   setComplianceAddEditViewState,
//   setCreateEditComplaince,
//   setShowViewCompliance
// ) => {
//   // Value 1 is when User Perform Edit Operation
//   // Value 2 is when User Perform View Operation
//   return (dispatch) => {
//     dispatch(viewComplianceByMeDetails_init());
//     let form = new FormData();
//     form.append("RequestMethod", ViewComplianceByMeDetailsRM.RequestMethod);
//     form.append("RequestData", JSON.stringify(Data));
//     axiosInstance
//       .post(complainceApi, form)
//       .then(async (response) => {
//         if (response.data.responseCode === 417) {
//           await dispatch(RefreshToken(navigate, t));
//           dispatch(
//             ViewComplianceByMeDetailsAPI(
//               navigate,
//               Data,
//               t,
//               value,
//               setComplianceAddEditViewState,
//               setCreateEditComplaince,
//               setShowViewCompliance
//             )
//           );
//         } else if (response.data.responseCode === 200) {
//           if (response.data.responseResult.isExecuted === true) {
//             if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Compliance_ComplianceServiceManager_ViewComplianceDetails_01".toLowerCase()
//                 )
//             ) {
//               await dispatch(
//                 viewComplianceByMeDetails_success(
//                   response.data.responseResult,
//                   ""
//                 )
//               );
//               switch (value) {
//                 case 1:
//                   setComplianceAddEditViewState(2);
//                   setCreateEditComplaince(true);
//                   setShowViewCompliance(false);
//                   break;
//                 case 2:
//                   setComplianceAddEditViewState(3);
//                   setCreateEditComplaince(false);
//                   setShowViewCompliance(true);
//                   break;
//                 default:
//                   break;
//               }
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Compliance_ComplianceServiceManager_ViewComplianceDetails_02".toLowerCase()
//                 )
//             ) {
//               // The Name is Unique
//               await dispatch(viewComplianceByMeDetails_fail(""));
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Compliance_ComplianceServiceManager_ViewComplianceDetails_03".toLowerCase()
//                 )
//             ) {
//               await dispatch(viewComplianceByMeDetails_fail(""));
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Compliance_ComplianceServiceManager_ViewComplianceDetails_04".toLowerCase()
//                 )
//             ) {
//               await dispatch(viewComplianceByMeDetails_fail(""));
//             }
//           } else {
//             await dispatch(
//               viewComplianceByMeDetails_fail(t("Something-went-wrong"))
//             );
//           }
//         } else {
//           await dispatch(
//             viewComplianceByMeDetails_fail(t("Something-went-wrong"))
//           );
//         }
//       })
//       .catch((response) => {
//         dispatch(viewComplianceByMeDetails_fail(t("Something-went-wrong")));
//       });
//   };
// };

// List of compliance for me

// View Compliance For Me

// to be replaced by
const ViewComplianceDetailsByViewTypeAPI = (
  navigate,
  Data,
  t,
  value,
  setComplianceAddEditViewState,
  setCreateEditComplaince,
  setShowViewCompliance,
) => {
  // Value 1 is when User Perform Edit Operation
  // Value 2 is when User Perform View Operation
  return (dispatch) => {
    dispatch(viewComplianceByMeDetails_init());
    let form = new FormData();
    form.append(
      "RequestMethod",
      ViewComplianceDetailsByViewTypeRM.RequestMethod,
    );
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            ViewComplianceDetailsByViewTypeAPI(
              navigate,
              Data,
              t,
              value,
              setComplianceAddEditViewState,
              setCreateEditComplaince,
              setShowViewCompliance,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ViewComplianceDetails_01".toLowerCase(),
                )
            ) {
              await dispatch(
                viewComplianceByMeDetails_success(
                  response.data.responseResult,
                  "",
                ),
              );
              switch (value) {
                case 1:
                  setComplianceAddEditViewState(2);
                  setCreateEditComplaince(true);
                  setShowViewCompliance(false);
                  break;
                case 2:
                  setComplianceAddEditViewState(3);
                  setCreateEditComplaince(false);
                  setShowViewCompliance(true);
                  break;
                default:
                  break;
              }
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ViewComplianceDetails_02".toLowerCase(),
                )
            ) {
              // The Name is Unique
              await dispatch(viewComplianceByMeDetails_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ViewComplianceDetails_03".toLowerCase(),
                )
            ) {
              await dispatch(viewComplianceByMeDetails_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ViewComplianceDetails_04".toLowerCase(),
                )
            ) {
              await dispatch(viewComplianceByMeDetails_fail(""));
            }
          } else {
            await dispatch(
              viewComplianceByMeDetails_fail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            viewComplianceByMeDetails_fail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(viewComplianceByMeDetails_fail(t("Something-went-wrong")));
      });
  };
};

// const viewComplianceForMeById_init = () => {
//   return {
//     type: actions.VIEW_COMPLIANCE_FOR_ME_BY_ID_INIT,
//   };
// };

// const viewComplianceForMeById_success = (response, message) => {
//   return {
//     type: actions.VIEW_COMPLIANCE_FOR_ME_BY_ID_SUCCESS,
//     response: response,
//     message: message,
//   };
// };

// const viewComplianceForMeById_fail = (response) => {
//   return {
//     type: actions.VIEW_COMPLIANCE_FOR_ME_BY_ID_FAIL,
//     response: response,
//   };
// };

// const viewComplianceForMeByIdAPI = (
//   navigate,
//   Data,
//   t,
//   value,
//   setComplianceAddEditViewState,
//   setCreateEditComplaince,
//   setShowViewCompliance
// ) => {
//   // Value 1 is when User Perform Edit Operation
//   // Value 2 is when User Perform View Operation
//   return (dispatch) => {
//     dispatch(viewComplianceForMeById_init());
//     let form = new FormData();
//     form.append("RequestMethod", ViewComplianceForMeById.RequestMethod);
//     form.append("RequestData", JSON.stringify(Data));
//     axiosInstance
//       .post(complainceApi, form)
//       .then(async (response) => {
//         if (response.data.responseCode === 417) {
//           await dispatch(RefreshToken(navigate, t));
//           dispatch(
//             viewComplianceForMeByIdAPI(
//               navigate,
//               Data,
//               t,
//               value,
//               setComplianceAddEditViewState,
//               setCreateEditComplaince,
//               setShowViewCompliance
//             )
//           );
//         } else if (response.data.responseCode === 200) {
//           if (response.data.responseResult.isExecuted === true) {
//             if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Compliance_ComplianceServiceManager_ViewComplianceForMeById_01".toLowerCase()
//                 )
//             ) {
//               await dispatch(
//                 viewComplianceForMeById_success(
//                   response.data.responseResult,
//                   ""
//                 )
//               );
//               switch (value) {
//                 // case 1:
//                 //   setComplianceAddEditViewState(2);
//                 //   setCreateEditComplaince(true);
//                 //   setShowViewCompliance(false);
//                 //   break;
//                 case 2:
//                   setComplianceAddEditViewState(3);
//                   setCreateEditComplaince(false);
//                   setShowViewCompliance(true);
//                   break;
//                 default:
//                   break;
//               }
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Compliance_ComplianceServiceManager_ViewComplianceForMeById_02".toLowerCase()
//                 )
//             ) {
//               // The Name is Unique
//               await dispatch(viewComplianceForMeById_fail(""));
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Compliance_ComplianceServiceManager_ViewComplianceForMeById_03".toLowerCase()
//                 )
//             ) {
//               await dispatch(viewComplianceForMeById_fail(""));
//             }
//           } else {
//             await dispatch(
//               viewComplianceForMeById_fail(t("Something-went-wrong"))
//             );
//           }
//         } else {
//           await dispatch(
//             viewComplianceForMeById_fail(t("Something-went-wrong"))
//           );
//         }
//       })
//       .catch((response) => {
//         dispatch(viewComplianceForMeById_fail(t("Something-went-wrong")));
//       });
//   };
// };

// get listOfComplianceByCreator Data from Socket
const SearchComplianceForMe_init = () => {
  return {
    type: actions.SEARCH_COMPLIANCE_FOR_ME_INIT,
  };
};

const SearchComplianceForMe_success = (response, message) => {
  return {
    type: actions.SEARCH_COMPLIANCE_FOR_ME_SUCCESS,
    response: response,
    message: message,
  };
};

const SearchComplianceForMe_fail = (response) => {
  return {
    type: actions.SEARCH_COMPLIANCE_FOR_ME_FAIL,
    response: response,
  };
};

const SearchComplianceForMeApi = (navigate, Data, t) => {
  return (dispatch) => {
    dispatch(SearchComplianceForMe_init());
    let form = new FormData();
    form.append("RequestMethod", SearchComplianceForMe.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(SearchComplianceForMeApi(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_SearchComplianceForMe_01".toLowerCase(),
                )
            ) {
              await dispatch(
                SearchComplianceForMe_success(response.data.responseResult, ""),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_SearchComplianceForMe_02".toLowerCase(),
                )
            ) {
              // The Name is Unique
              await dispatch(SearchComplianceForMe_fail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_SearchComplianceForMe_03".toLowerCase(),
                )
            ) {
              await dispatch(SearchComplianceForMe_fail(""));
            }
          } else {
            await dispatch(
              SearchComplianceForMe_fail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(SearchComplianceForMe_fail(t("Something-went-wrong")));
        }
      })
      .catch((response) => {
        dispatch(SearchComplianceForMe_fail(t("Something-went-wrong")));
      });
  };
};

// GetComplianceChecklistsWithTasksByComplianceId
const GetComplianceChecklistsWithTasksByComplianceIdForMeInit = () => {
  return {
    type: actions.GET_COMPLIANCE_TASK_BY_COMPLIANCE_ID_FOR_ME_INIT,
  };
};

const GetComplianceChecklistsWithTasksByComplianceIdForMeSuccess = (
  response,
  message,
) => {
  return {
    type: actions.GET_COMPLIANCE_TASK_BY_COMPLIANCE_ID_FOR_ME_SUCCESS,
    response: response,
    message: message,
  };
};

const GetComplianceChecklistsWithTasksByComplianceIdForMeFail = (message) => {
  return {
    type: actions.GET_COMPLIANCE_TASK_BY_COMPLIANCE_ID_FOR_ME_FAIL,
    message: message,
  };
};

const GetComplianceChecklistsWithTasksByComplianceIdForMeAPI = (
  navigate,
  Data,
  t,
) => {
  return (dispatch) => {
    dispatch(GetComplianceChecklistsWithTasksByComplianceIdForMeInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      GetComplianceChecklistsWithTasksByComplianceIdForMe.RequestMethod,
    );
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(
            GetComplianceChecklistsWithTasksByComplianceIdForMeAPI(
              navigate,
              Data,
              t,
            ),
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsWithTasksByComplianceIdForMe_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceChecklistsWithTasksByComplianceIdForMeSuccess(
                  response.data.responseResult,
                  t(""),
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsWithTasksByComplianceIdForMe_02".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceChecklistsWithTasksByComplianceIdForMeFail(""),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsWithTasksByComplianceIdForMe_03".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceChecklistsWithTasksByComplianceIdForMeFail(""),
              );
            }
          } else {
            await dispatch(
              GetComplianceChecklistsWithTasksByComplianceIdForMeFail(
                t("Something-went-wrong"),
              ),
            );
          }
        } else {
          await dispatch(
            GetComplianceChecklistsWithTasksByComplianceIdForMeFail(
              t("Something-went-wrong"),
            ),
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetComplianceChecklistsWithTasksByComplianceIdForMeFail(
            t("Something-went-wrong"),
          ),
        );
      });
  };
};
const GetComplianceAndTaskStatusesInit = () => {
  return {
    type: actions.GET_COMPLIACE_STATUS_INIT,
  };
};

const GetComplianceAndTaskStatusesSuccess = (response, message) => {
  return {
    type: actions.GET_COMPLIACE_STATUS_SUCCESS,
    response: response,
    message: message,
  };
};

const GetComplianceAndTaskStatusesFail = (message) => {
  return {
    type: actions.GET_COMPLIACE_STATUS_FAIL,
    message: message,
  };
};

const GetComplianceAndTaskStatusesAPI = (navigate, t) => {
  return (dispatch) => {
    dispatch(GetComplianceAndTaskStatusesInit());
    let form = new FormData();
    form.append("RequestMethod", GetComplianceAndTaskStatuses.RequestMethod);
    // ✅ send complete payload as JSON string
    // form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetComplianceAndTaskStatusesAPI(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceAndTaskStatuses_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceAndTaskStatusesSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceAndTaskStatuses_02".toLowerCase(),
                )
            ) {
              await dispatch(GetComplianceAndTaskStatusesFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceAndTaskStatuses_03".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceAndTaskStatusesFail(t("Something-went-wrong")),
              );
            }
          } else {
            await dispatch(
              GetComplianceAndTaskStatusesFail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            GetComplianceAndTaskStatusesFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(GetComplianceAndTaskStatusesFail(t("Something-went-wrong")));
      });
  };
};

//GET QUARTERLY SUBMITTED COMPLIANCE DASHBOARD API

const GetQuarterlySubmittedComplianceInit = () => {
  return {
    type: actions.GET_QUARTERLY_SUBMITTED_COMPLIANCES_INIT,
  };
};

const GetQuarterlySubmittedComplianceSuccess = (response, message) => {
  return {
    type: actions.GET_QUARTERLY_SUBMITTED_COMPLIANCES_SUCCESS,
    response: response,
    message: message,
  };
};

const GetQuarterlySubmittedComplianceFail = (message) => {
  return {
    type: actions.GET_QUARTERLY_SUBMITTED_COMPLIANCES_FAIL,
    message: message,
  };
};

const GetQuarterlySubmittedComplianceAPI = (navigate, Data, t) => {
  return (dispatch) => {
    dispatch(GetQuarterlySubmittedComplianceInit());
    let form = new FormData();
    form.append("RequestMethod", GetComplianceQuarterlySubmitted.RequestMethod);
    // ✅ send complete payload as JSON string
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetQuarterlySubmittedComplianceAPI(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_QuarterlySubmittedCompliances_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetQuarterlySubmittedComplianceSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_QuarterlySubmittedCompliances_02".toLowerCase(),
                )
            ) {
              await dispatch(GetQuarterlySubmittedComplianceFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_QuarterlySubmittedCompliances_03".toLowerCase(),
                )
            ) {
              await dispatch(
                GetQuarterlySubmittedComplianceFail(t("Something-went-wrong")),
              );
            }
          } else {
            await dispatch(
              GetQuarterlySubmittedComplianceFail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            GetQuarterlySubmittedComplianceFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetQuarterlySubmittedComplianceFail(t("Something-went-wrong")),
        );
      });
  };
};

//GET Compliance Dashboard Upcoming Deadline API
const GetComplianceUpcomingDeadlineInit = () => {
  return {
    type: actions.GET_UPCOMING_COMPLIANCES_DEADLINE_INIT,
  };
};

const GetComplianceUpcomingDeadlineSuccess = (response, message) => {
  return {
    type: actions.GET_UPCOMING_COMPLIANCES_DEADLINE_SUCCESS,
    response: response,
    message: message,
  };
};

const GetComplianceUpcomingDeadlineFail = (message) => {
  return {
    type: actions.GET_UPCOMING_COMPLIANCES_DEADLINE_FAIL,
    message: message,
  };
};

const GetComplianceUpcomingDeadlineAPI = (navigate, Data, t) => {
  return (dispatch) => {
    dispatch(GetComplianceUpcomingDeadlineInit());
    let form = new FormData();
    form.append("RequestMethod", GetUpcomingComplianceDeadline.RequestMethod);
    // ✅ send complete payload as JSON string
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetComplianceUpcomingDeadlineAPI(navigate, Data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_UpcomingCompliancesDeadline_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceUpcomingDeadlineSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_UpcomingCompliancesDeadline_02".toLowerCase(),
                )
            ) {
              await dispatch(GetComplianceUpcomingDeadlineFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_UpcomingCompliancesDeadline_03".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceUpcomingDeadlineFail(t("Something-went-wrong")),
              );
            }
          } else {
            await dispatch(
              GetComplianceUpcomingDeadlineFail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            GetComplianceUpcomingDeadlineFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(GetComplianceUpcomingDeadlineFail(t("Something-went-wrong")));
      });
  };
};

//GET Compliance BY Dashboard API
const GetComplianceByDashboardInit = () => {
  return {
    type: actions.GET_COMPLIANCE_BY_DASHBOARD_INIT,
  };
};

const GetComplianceByDashboardSuccess = (response, message) => {
  return {
    type: actions.GET_COMPLIANCE_BY_DASHBOARD_SUCCESS,
    response: response,
    message: message,
  };
};

const GetComplianceByDashboardFail = (message) => {
  return {
    type: actions.GET_COMPLIANCE_BY_DASHBOARD_FAIL,
    message: message,
  };
};

const GetComplianceByDashboardAPI = (navigate, data, t) => {
  return (dispatch) => {
    dispatch(GetComplianceByDashboardInit());
    let form = new FormData();
    form.append("RequestMethod", GetComplianceByDashboard.RequestMethod);
    // ✅ send complete payload as JSON string
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetComplianceByDashboardAPI(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ComplianceByForDashboard_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceByDashboardSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ComplianceByForDashboard_02".toLowerCase(),
                )
            ) {
              await dispatch(GetComplianceByDashboardFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ComplianceByForDashboard_03".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceByDashboardFail(t("Something-went-wrong")),
              );
            }
          } else {
            await dispatch(
              GetComplianceByDashboardFail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            GetComplianceByDashboardFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(GetComplianceByDashboardFail(t("Something-went-wrong")));
      });
  };
};

//GET Compliance Tasks Dashboard API
const GetComplianceTasksDashboardInit = () => {
  return {
    type: actions.GET_COMPLIANCE_TASKS_DASHBOARD_INIT,
  };
};

const GetComplianceTasksDashboardSuccess = (response, message) => {
  return {
    type: actions.GET_COMPLIANCE_TASKS_DASHBOARD_SUCCESS,
    response: response,
    message: message,
  };
};

const GetComplianceTasksDashboardFail = (message) => {
  return {
    type: actions.GET_COMPLIANCE_TASKS_DASHBOARD_FAIL,
    message: message,
  };
};

const GetComplianceTasksDashboardAPI = (navigate, data, t) => {
  return (dispatch) => {
    dispatch(GetComplianceTasksDashboardInit());
    let form = new FormData();
    form.append("RequestMethod", GetComplianceTasksDashboard.RequestMethod);
    // ✅ send complete payload as JSON string
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetComplianceTasksDashboardAPI(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_TasksDashboard_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceTasksDashboardSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_TasksDashboard_02".toLowerCase(),
                )
            ) {
              await dispatch(GetComplianceTasksDashboardFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_TasksDashboard_03".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceTasksDashboardFail(t("Something-went-wrong")),
              );
            }
          } else {
            await dispatch(
              GetComplianceTasksDashboardFail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            GetComplianceTasksDashboardFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(GetComplianceTasksDashboardFail(t("Something-went-wrong")));
      });
  };
};

//GET Compliance Reopen Dashboard API
const GetComplianceReopenDashboardInit = () => {
  return {
    type: actions.GET_COMPLIANCE_REOPEN_DASHBOARD_INIT,
  };
};

const GetComplianceReopenDashboardSuccess = (response, message) => {
  return {
    type: actions.GET_COMPLIANCE_REOPEN_DASHBOARD_SUCCESS,
    response: response,
    message: message,
  };
};

const GetComplianceReopenDashboardFail = (message) => {
  return {
    type: actions.GET_COMPLIANCE_REOPEN_DASHBOARD_FAIL,
    message: message,
  };
};

const GetComplianceReopenDashboardAPI = (navigate, data, t) => {
  return (dispatch) => {
    dispatch(GetComplianceReopenDashboardInit());
    let form = new FormData();
    form.append("RequestMethod", GetComplianceReopenDashboard.RequestMethod);
    // ✅ send complete payload as JSON string
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetComplianceReopenDashboardAPI(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ReopenedCompliancesForDashboard_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceReopenDashboardSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ReopenedCompliancesForDashboard_02".toLowerCase(),
                )
            ) {
              await dispatch(GetComplianceReopenDashboardFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_ReopenedCompliancesForDashboard_03".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceReopenDashboardFail(t("Something-went-wrong")),
              );
            }
          } else {
            await dispatch(
              GetComplianceReopenDashboardFail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            GetComplianceReopenDashboardFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(GetComplianceReopenDashboardFail(t("Something-went-wrong")));
      });
  };
};

//GET Compliance Quarterly Tasks Dashboard API
const GetComplianceQuarterlyTasksDashboardInit = () => {
  return {
    type: actions.GET_COMPLIANCE_QUARTERLY_TASK_DASHBOARD_INIT,
  };
};

const GetComplianceQuarterlyTasksDashboardSuccess = (response, message) => {
  return {
    type: actions.GET_COMPLIANCE_QUARTERLY_TASK_DASHBOARD_SUCCESS,
    response: response,
    message: message,
  };
};

const GetComplianceQuarterlyTasksDashboardFail = (message) => {
  return {
    type: actions.GET_COMPLIANCE_QUARTERLY_TASK_DASHBOARD_FAIL,
    message: message,
  };
};

const GetComplianceQuarterlyTasksDashboardAPI = (navigate, t) => {
  return (dispatch) => {
    dispatch(GetComplianceQuarterlyTasksDashboardInit());
    let form = new FormData();
    form.append(
      "RequestMethod",
      GetComplianceQuarterlyTasksDashboard.RequestMethod,
    );
    // ✅ send complete payload as JSON string
    // form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetComplianceQuarterlyTasksDashboardAPI(navigate, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_QuarterlyComplianceTasksSummary_01".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceQuarterlyTasksDashboardSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_QuarterlyComplianceTasksSummary_02".toLowerCase(),
                )
            ) {
              await dispatch(GetComplianceQuarterlyTasksDashboardFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_QuarterlyComplianceTasksSummary_03".toLowerCase(),
                )
            ) {
              await dispatch(
                GetComplianceQuarterlyTasksDashboardFail(
                  t("Something-went-wrong"),
                ),
              );
            }
          } else {
            await dispatch(
              GetComplianceQuarterlyTasksDashboardFail(
                t("Something-went-wrong"),
              ),
            );
          }
        } else {
          await dispatch(
            GetComplianceQuarterlyTasksDashboardFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetComplianceQuarterlyTasksDashboardFail(t("Something-went-wrong")),
        );
      });
  };
};

//EditComplianceChecklist
const EditComplianceInit = () => {
  return {
    type: actions.EDIT_COMPLIANCE_INIT,
  };
};

const EditComplianceSuccess = (response, message) => {
  return {
    type: actions.EDIT_COMPLIANCE_SUCCESS,
    response: response,
    message: message,
  };
};

const EditComplianceFail = (message) => {
  return {
    type: actions.EDIT_COMPLIANCE_FAIL,
    message: message,
  };
};

const EditComplianceAPI = (navigate, Data, t, setChecklistTabs) => {
  return (dispatch) => {
    dispatch(EditComplianceInit());

    let form = new FormData();
    form.append("RequestMethod", EditCompliance.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(EditComplianceAPI(navigate, Data, t, setChecklistTabs));
        } else if (response.data.responseCode === 200) {
          const message =
            response.data.responseResult?.responseMessage?.toLowerCase() || "";

          if (response.data.responseResult.isExecuted === true) {
            if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_01",
              )
            ) {
              await dispatch(
                EditComplianceSuccess(response.data.responseResult, ""),
              );
              setChecklistTabs(2);
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_02",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("Compliance-ID-is-required")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_03",
              )
            ) {
              await dispatch(EditComplianceFail(t("ModifiedBy-isrequired.")));
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_04",
              )
            ) {
              await dispatch(EditComplianceFail(t("Invalid-ModifiedBy")));
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_05",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("Compliance-Title-is-required")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_06",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("Compliance-Title-cannot-exceed-100-characters"),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_07",
              )
            ) {
              await dispatch(EditComplianceFail(t("Description-is-required")));
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_08",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("Description-cannot-exceed-500-characters"),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_09",
              )
            ) {
              await dispatch(EditComplianceFail(t("Authority-is-required")));
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_10",
              )
            ) {
              await dispatch(EditComplianceFail(t("Organization-is-required")));
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_11",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("Compliance-record-not-found")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_12",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("Only-the-compliance-creator-can-edit")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_13",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("Invalid-or-inactive-Authority")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_14",
              )
            ) {
              await dispatch(EditComplianceFail(t("Invalid-OrganizationID")));
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_15",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  " Criticality must be 1 (High), 2 (Medium), or 3 (Low).",
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_16",
              )
            ) {
              await dispatch(EditComplianceFail(t("Due-Date-is-required")));
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_17",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("Due-Date-must-be-a-future-date")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_18",
              )
            ) {
              await dispatch(EditComplianceFail(t("Status-is-required")));
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_19",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("Invalid-Compliance-Status")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_20",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("Reason-required-to-move-On-Hold")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_21",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("Compliance-Title-already-exists-for-this-Authority"),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_22",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("You-can-add-up-to-5-tags-only")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_23",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("Each-tag-cannot-exceed-25-characters")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_24",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("Status-change-not-allowed")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_25",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("Cancelled-compliance-cannot-be-changed")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_26",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  "Not Started can be changed to In Progress only when at least one checklist and one task exist.",
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_27",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  "Not Started can be changed to On Hold only when at least one checklist and one task exist.",
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_28",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t(
                    "Not Started can only be changed to In Progress (when checklist exists) or On Hold (when no checklist exists).",
                  ),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_29",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("In Progress cannot be changed back to Not Started."),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_30",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("In Progress cannot be changed to Reopened."),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_31",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t(
                    "In Progress can only be changed to Submitted for Approval, On Hold, or Cancelled.",
                  ),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_32",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("Reopened cannot be changed to Not Started"),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_33",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("Reopened cannot be changed to In Progress"),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_34",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("Reopened cannot be changed to Completed directly."),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_35",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t(
                    "Reopened can only be changed to Submitted for Approval, On Hold, or Cancelled.",
                  ),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_36",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("On Hold cannot be changed to Not Started."),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_37",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("On Hold cannot be changed to Submitted for Approval."),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_38",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("On Hold cannot be changed to Completed."),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_39",
              )
            ) {
              await dispatch(
                EditComplianceFail(t("On Hold cannot be changed to Reopened.")),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_40",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("On Hold can only be changed to In Progress or Cancelled"),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_41",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("Submitted for Approval cannot be changed to Not Started."),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_42",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("Submitted for Approval cannot be changed to In Progress."),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_43",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("Submitted for Approval cannot be changed to Cancelled."),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_44",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t(
                    "Submitted for Approval can only be changed to Completed, Reopened, or On Hold.",
                  ),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_45",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("Completed can only be changed to Reopened."),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_46",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t(
                    "You cannot move from Not Started until at least one checklist and one task exist.",
                  ),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_47",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t(
                    "Some checklist items are still pending. Do you want to continue submitting for approval?",
                  ),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_48",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t(
                    "This Compliance cannot be marked as Completed because some tasks are still not completed",
                  ),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_49",
              )
            ) {
              await dispatch(
                EditComplianceFail(
                  t("Compliance update failed or record not found."),
                ),
              );
            } else if (
              message.includes(
                "compliance_complianceservicemanager_editcompliance_50",
              )
            ) {
              await dispatch(EditComplianceFail(t("Something-went-wrong")));
            } else {
              await dispatch(EditComplianceFail(t("Something-went-wrong")));
            }
          } else {
            await dispatch(EditComplianceFail(t("Something-went-wrong")));
          }
        } else {
          await dispatch(EditComplianceFail(t("Something-went-wrong")));
        }
      })
      .catch(() => {
        dispatch(EditComplianceFail(t("Something-went-wrong")));
      });
  };
};

//API For Report Compliance Listing
const ComplianceReportListingInit = () => {
  return {
    type: actions.COMPLIANCE_REPORT_LISTING_INIT,
  };
};

const ComplianceReportListingSuccess = (response, message) => {
  return {
    type: actions.COMPLIANCE_REPORT_LISTING_SUCCESS,
    response: response,
    message: message,
  };
};

const ComplianceReportListingFail = (message) => {
  return {
    type: actions.COMPLIANCE_REPORT_LISTING_FAIL,
    message: message,
  };
};

const ComplianceReportListingAPI = (navigate, data, t) => {
  return (dispatch) => {
    dispatch(ComplianceReportListingInit());
    let form = new FormData();
    form.append("RequestMethod", GetReportComplianceListing.RequestMethod);
    // ✅ send complete payload as JSON string
    form.append("RequestData", JSON.stringify(data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(ComplianceReportListingAPI(navigate, data, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetReportsListing_01".toLowerCase(),
                )
            ) {
              await dispatch(
                ComplianceReportListingSuccess(
                  response.data.responseResult,
                  "",
                ),
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetReportsListing_02".toLowerCase(),
                )
            ) {
              await dispatch(ComplianceReportListingFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetReportsListing_03".toLowerCase(),
                )
            ) {
              await dispatch(
                ComplianceReportListingFail(t("Something-went-wrong")),
              );
            }
          } else {
            await dispatch(
              ComplianceReportListingFail(t("Something-went-wrong")),
            );
          }
        } else {
          await dispatch(
            ComplianceReportListingFail(t("Something-went-wrong")),
          );
        }
      })
      .catch((response) => {
        dispatch(ComplianceReportListingFail(t("Something-went-wrong")));
      });
  };
};

export {
  clearAuthorityMessage,
  initialAddEditAuthority,
  GetAllAuthorityAPI,
  GetAuthorityByIDAPI,
  DeleteAuthorityAPI,
  UpdateAuthorityAPI,
  AddAuthorityAPI,
  IsAuthorityNameExistsAPI,
  IsShortCodeExistsAPI,
  setInactiveStatusData,
  setActiveStatusData,
  setDeleteStatusData,
  setAuthorityCreatedData,
  setAuthorityUpdatedData,
  setOrganizationSettingUpdateData,
  GetAllAuthoritiesWithoutPaginationAPI,
  GetAllTagsByOrganizationIDAPI,
  AddComplianceAPI,
  AddComplianceChecklistAPI,
  GetComplianceChecklistsByComplianceIdAPI,
  CheckComplianceTitleExistsAPI,
  ViewComplianceByIdAPI,
  CheckChecklistTitleExistsAPI,
  AddTaskMappingToChecklistAPI,
  GetComplianceChecklistsWithTasksByComplianceIdAPI,
  EditComplianceChecklistAPI,
  listOfComplianceByCreatorApi,
  // ViewComplianceByMeDetailsAPI,
  clearComplianceDetailsData,
  // viewComplianceForMeByIdAPI,
  SearchComplianceForMeApi,
  ViewComplianceDetailsByViewTypeAPI,
  GetComplianceChecklistsWithTasksByComplianceIdForMeAPI,
  GetComplianceAndTaskStatusesAPI,
  GetQuarterlySubmittedComplianceAPI,
  GetComplianceUpcomingDeadlineAPI,
  GetComplianceByDashboardAPI,
  GetComplianceTasksDashboardAPI,
  GetComplianceReopenDashboardAPI,
  GetComplianceQuarterlyTasksDashboardAPI,
  EditComplianceAPI,
  ComplianceReportListingAPI,
};
