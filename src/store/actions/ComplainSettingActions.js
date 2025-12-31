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
} from "../../commen/apis/Api_config";
import { showDeleteAuthorityModal } from "./ManageAuthoriyAction";

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
                  "Compliance_ComplianceServiceManager_GetAllAuthority_01".toLowerCase()
                )
            ) {
              await dispatch(
                GetAllAuthoritySuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthority_02".toLowerCase()
                )
            ) {
              await dispatch(GetAllAuthorityFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthority_03".toLowerCase()
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
  viewNo
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
                  "Compliance_ComplianceServiceManager_GetAuthorityByID_01".toLowerCase()
                )
            ) {
              await dispatch(
                GetAuthorityByIDSuccess(response.data.responseResult, "")
              );
              setAddEditViewAuthoriyModal(true);
              setAuthorityViewState(viewNo);
              setAuthorityId(data.authorityId);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAuthorityByID_02".toLowerCase()
                )
            ) {
              await dispatch(GetAuthorityByIDFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAuthorityByID_03".toLowerCase()
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
                  "Compliance_ComplianceServiceManager_DeleteAuthority_01".toLowerCase()
                )
            ) {
              await dispatch(
                DeleteAuthoritySuccess(
                  response.data.responseResult,
                  t("Data-deleted-successfully")
                )
              );
              dispatch(showDeleteAuthorityModal(false));
              dispatch(GetAllAuthorityAPI(navigate, initialData, t));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_DeleteAuthority_02".toLowerCase()
                )
            ) {
              await dispatch(DeleteAuthorityFail(t("No-records-found")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_DeleteAuthority_03".toLowerCase()
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
  setSearchPayload
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
              setSearchPayload
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_UpdateAuthority_01".toLowerCase()
                )
            ) {
              await dispatch(
                UpdateAuthoritySuccess(
                  response.data.responseResult,
                  t("Authority-updated-successfully")
                )
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
                  "Compliance_ComplianceServiceManager_UpdateAuthority_02".toLowerCase()
                )
            ) {
              await dispatch(
                UpdateAuthorityFail(
                  t("Authority-shortCode-already-exists-for-this-organization")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_UpdateAuthority_03".toLowerCase()
                )
            ) {
              await dispatch(
                UpdateAuthorityFail(
                  t("Authority-name-already-exists-for-this-organization")
                )
              );
            }
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Compliance_ComplianceServiceManager_UpdateAuthority_05".toLowerCase()
              )
          ) {
            await dispatch(
              UpdateAuthorityFail(
                t("Authority-record-not-found-against-the-provided-authorityId")
              )
            );
          } else if (
            response.data.responseResult.responseMessage
              .toLowerCase()
              .includes(
                "Compliance_ComplianceServiceManager_UpdateAuthority_06".toLowerCase()
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
  setSearchPayload
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
              setSearchPayload
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddAuthority_01".toLowerCase()
                )
            ) {
              await dispatch(
                AddAuthoritySuccess(
                  response.data.responseResult,
                  t("Authority-created-successfully")
                )
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
                  "Compliance_ComplianceServiceManager_AddAuthority_02".toLowerCase()
                )
            ) {
              await dispatch(
                AddAuthorityFail(
                  t("Authority-shortCode-already-exists-for-this-organization")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddAuthority_03".toLowerCase()
                )
            ) {
              await dispatch(
                AddAuthorityFail(
                  t("Authority-name-already-exists-for-this-organization")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddAuthority_06".toLowerCase()
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
  setIsShortCodeExist
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
              setIsShortCodeExist
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsShortCodeExists_01".toLowerCase()
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
                  "Compliance_ComplianceServiceManager_IsShortCodeExists_02".toLowerCase()
                )
            ) {
              // The Name is Unique
              setIsShortCodeExist(false);
              await dispatch(
                IsShortCodeExistsSuccess(response.data.responseResult, "")
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsShortCodeExists_03".toLowerCase()
                )
            ) {
              setIsShortCodeExist(null);
              await dispatch(
                IsShortCodeExistsFail(t("Provided_shortCode-is-null-or-empty"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsShortCodeExists_04".toLowerCase()
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
  setIsAuthorityExist
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
              setIsAuthorityExist
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsAuthorityNameExists_01".toLowerCase()
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
                  "Compliance_ComplianceServiceManager_IsAuthorityNameExists_02".toLowerCase()
                )
            ) {
              // The Name is Unique
              await dispatch(
                IsAuthorityNameExistsSuccess(response.data.responseResult, "")
              );
              setIsAuthorityExist(false);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsAuthorityNameExists_03".toLowerCase()
                )
            ) {
              setIsAuthorityExist(null);

              await dispatch(
                IsAuthorityNameExistsFail(
                  t("Provided_authorityName-is-null-or-empty")
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_IsAuthorityNameExists_04".toLowerCase()
                )
            ) {
              setIsAuthorityExist(null);

              await dispatch(
                IsAuthorityNameExistsFail(t("Something-went-wrong"))
              );
            }
          } else {
            setIsAuthorityExist(null);

            await dispatch(
              IsAuthorityNameExistsFail(t("Something-went-wrong"))
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
                  "Compliance_ComplianceServiceManager_GetAllAuthoritiesWithoutPagination_01".toLowerCase()
                )
            ) {
              await dispatch(
                GetAllAuthoritiesWithoutPaginationSuccess(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthoritiesWithoutPagination_02".toLowerCase()
                )
            ) {
              // The Name is Unique
              await dispatch(GetAllAuthoritiesWithoutPaginationFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllAuthoritiesWithoutPagination_03".toLowerCase()
                )
            ) {
              await dispatch(GetAllAuthoritiesWithoutPaginationFail(""));
            }
          } else {
            await dispatch(
              GetAllAuthoritiesWithoutPaginationFail(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            GetAllAuthoritiesWithoutPaginationFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetAllAuthoritiesWithoutPaginationFail(t("Something-went-wrong"))
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
  let Data = {
    TagsTitle: value,
  };

  return (dispatch) => {
    dispatch(GetAllTagsByOrganizationIDInit());
    let form = new FormData();
    form.append("RequestMethod", GetAllTagsByOrganizationID.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance
      .post(complainceApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(GetAllTagsByOrganizationIDAPI(navigate, value, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllTagsByOrganizationID_01".toLowerCase()
                )
            ) {
              await dispatch(
                GetAllTagsByOrganizationIDSuccess(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllTagsByOrganizationID_02".toLowerCase()
                )
            ) {
              // The Name is Unique
              await dispatch(GetAllTagsByOrganizationIDFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllTagsByOrganizationID_03".toLowerCase()
                )
            ) {
              await dispatch(GetAllTagsByOrganizationIDFail(""));
            }
          } else {
            await dispatch(
              GetAllTagsByOrganizationIDFail(t("Something-went-wrong"))
            );
          }
        } else {
          await dispatch(
            GetAllTagsByOrganizationIDFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(GetAllTagsByOrganizationIDFail(t("Something-went-wrong")));
      });
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
  setChecklistTabs
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
              setChecklistTabs
            )
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddCompliance_01".toLowerCase()
                )
            ) {
              await dispatch(
                AddComplianceSuccess(
                  response.data.responseResult,
                  t("Compliance-created-successfully")
                )
              );
              setComplianceInfo({
                complianceId: response.data.responseResult.complianceId,
                complianceName: response.data.responseResult.complianceTitle,
              });
              setChecklistTabs(2);
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddCompliance_02".toLowerCase()
                )
            ) {
              // The Name is Unique
              await dispatch(AddComplianceFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetAllTagsByOrganizationID_03".toLowerCase()
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

const AddComplianceChecklistAPI = (navigate, Data, t, complianceInfo) => {
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
            AddComplianceChecklistAPI(navigate, Data, t, complianceInfo)
          );
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddComplianceChecklist_01".toLowerCase()
                )
            ) {
              await dispatch(
                AddComplianceChecklistSuccess(
                  response.data.responseResult,
                  t("Checklist-created-successfully")
                )
              );
              dispatch(
                GetComplianceChecklistsByComplianceIdAPI(
                  navigate,
                  complianceId,
                  t
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddComplianceChecklist_02".toLowerCase()
                )
            ) {
              // The Name is Unique
              await dispatch(AddComplianceChecklistFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_AddComplianceChecklist_03".toLowerCase()
                )
            ) {
              await dispatch(AddComplianceChecklistFail(""));
            }
          } else {
            await dispatch(
              AddComplianceChecklistFail(t("Something-went-wrong"))
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
      GetComplianceChecklistsByComplianceId.RequestMethod
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
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsByComplianceId_01".toLowerCase()
                )
            ) {
              await dispatch(
                GetComplianceChecklistsByComplianceIdSuccess(
                  response.data.responseResult,
                  ""
                )
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsByComplianceId_02".toLowerCase()
                )
            ) {
              // The Name is Unique
              await dispatch(GetComplianceChecklistsByComplianceIdFail(""));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Compliance_ComplianceServiceManager_GetComplianceChecklistsByComplianceId_03".toLowerCase()
                )
            ) {
              await dispatch(GetComplianceChecklistsByComplianceIdFail(""));
            }
          } else {
            await dispatch(
              GetComplianceChecklistsByComplianceIdFail(
                t("Something-went-wrong")
              )
            );
          }
        } else {
          await dispatch(
            GetComplianceChecklistsByComplianceIdFail(t("Something-went-wrong"))
          );
        }
      })
      .catch((response) => {
        dispatch(
          GetComplianceChecklistsByComplianceIdFail(t("Something-went-wrong"))
        );
      });
  };
};
const clearAuthorityMessage = () => {
  return {
    type: actions.GET_CLEAREMESSAGE_AUTHORITY,
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
};
