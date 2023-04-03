import * as actions from "../action_types";
import axios from "axios";
import { getCommitteesApi } from "../../commen/apis/Api_ends_points";
import { RefreshToken } from "./Auth_action";
import {
  //   CreateCommittee,
  GetCommitteesByUserID,
  GetallOrganizationCommitteType,
  GetallOrganizationCommitteMemberRole
} from "../../commen/apis/Api_config";

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

const getAllCommitteesByUserIdActions = (t) => {
  let token = JSON.parse(localStorage.getItem("token"));
  let OrganizationID = localStorage.getItem("organizationID");
  let UserID = localStorage.getItem("userID");
  let Data = {
    UserId: parseInt(UserID),
    OrganizationID: JSON.parse(OrganizationID),
  };
  return (dispatch) => {
    dispatch(getallcommitteesbyuserid_init());
    let form = new FormData();
    form.append("RequestMethod", GetCommitteesByUserID.RequestMethod);
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
        if (response.data.responseCode === 200) {
          console.log("checking");
          if (response.data.responseResult.isExecuted === true) {
            console.log("checking");
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteesByUserID_01".toLowerCase()
                )
            ) {
              dispatch(
                getallcommitteesbyuserid_success(
                  response.data.responseResult.committees,
                  t("Data-available")
                )
              );

              console.log("checking");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteesByUserID_02".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));

              console.log("checking");
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteesByUserID_03".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteesByUserID_04".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "Committees_CommitteeServiceManager_GetCommitteesByUserID_05".toLowerCase()
                )
            ) {
              dispatch(getallcommitteebyuserid_fail(t("No-data-available")));
            }
          } else {
            dispatch(getallcommitteebyuserid_fail(t("Something-went-wrong")));
          }
        } else {
          dispatch(getallcommitteebyuserid_fail(t("Something-went-wrong")));
        }
        console.log("responseresponse", response);
      })
      .catch((response) => {
        dispatch(getallcommitteebyuserid_fail(t("Something-went-wrong")));
        console.log("responseresponse", response);
      });
  };
};

const getallcommitteebyuserid_clear = () => {
  return {
    type: actions.CLEAR_MESSAGE_RESPONSE_COMMITTEE,
  };
};

// const createcommittee_init = () => {
//   return {
//     type: actions.CREATE_COMMITTEE_INIT,
//   };
// };

// const createcommittee_success = (response, message) => {
//   return {
//     type: actions.CREATE_COMMITTEE_SUCCESS,
//     response: response,
//     message: message,
//   };
// };

// const createcommittee_fail = (message) => {
//   return {
//     type: actions.CREATE_COMMITTEE_FAIL,
//     message: message,
//   };
// };

// const createcommittee = (Data, t) => {
//   let token = JSON.parse(localStorage.getItem("token"));
//   return (dispatch) => {
//     dispatch(createcommittee_init());
//     let form = new FormData();
//     form.append("RequestData", JSON.stringify(Data));
//     form.append("RequestMethod", CreateCommittee.RequestMethod);
//     axios({
//       method: "post",
//       url: getCommitteesApi,
//       data: form,
//       headers: {
//         _token: token,
//       },
//     })
//       .then(async (response) => {
//         console.log(response, "response");
//         if (response.data.responseCode === 417) {
//           await dispatch(RefreshToken(t));
//           await dispatch(createcommittee_success(Data, t));
//         } else if (response.data.responseCode === 200) {
//           console.log(response, "response");
//           if (response.data.responseResult.isExecuted === true) {
//             console.log(response, "response");
//             if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Committees_CommitteeServiceManager_CreateNewcommittee_01".toLowerCase()
//                 )
//             ) {
//               await dispatch(
//                 createcommittee_success(
//                   response.data.responseResult,
//                   t("Data-available")
//                 )
//               );
//               dispatch(getAllCommitteesByUserIdActions(t));
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Committees_CommitteeServiceManager_CreateNewcommittee_02".toLowerCase()
//                 )
//             ) {
//               dispatch(createcommittee_fail(t("No-data-available")));
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Committees_CommitteeServiceManager_CreateNewcommittee_03".toLowerCase()
//                 )
//             ) {
//               dispatch(createcommittee_fail(t("No-data-available")));
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Committees_CommitteeServiceManager_CreateNewcommittee_04".toLowerCase()
//                 )
//             ) {
//               dispatch(createcommittee_fail(t("No-data-available")));
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Committees_CommitteeServiceManager_CreateNewcommittee_05".toLowerCase()
//                 )
//             ) {
//               dispatch(createcommittee_fail(t("No-data-available")));
//             } else if (
//               response.data.responseResult.responseMessage
//                 .toLowerCase()
//                 .includes(
//                   "Committees_CommitteeServiceManager_CreateNewcommittee_06".toLowerCase()
//                 )
//             ) {
//               dispatch(createcommittee_fail(t("Something-went-wrong")));
//             }
//           } else {
//             console.log(response, "response");
//             dispatch(createcommittee_fail(t("Something-went-wrong")));
//           }
//         } else {
//           console.log(response, "response");
//           dispatch(createcommittee_fail(t("Something-went-wrong")));
//         }
//       })
//       .catch((response) => {
//         console.log(response, "response");
//         dispatch(createcommittee_fail(t("Something-went-wrong")));
//       });
//   };
// };
const getCommitteeTypes_Init = () => {
  return {
    type: actions.GET_ALL_COMMITTEE_TYPES_INIT
  }
}
const getCommitteeTypes_Success = (response, message) => {
  return {
    type: actions.GET_ALL_COMMITTEE_TYPES_SUCCESS,
    response: response,
    message: message

  }
}
const getCommitteeTypes_Fail = (message) => { 
  return {
    type: actions.GET_ALL_COMMITTEE_TYPES_FAIL,
    message: message
  }
}
const getCommitteeTypes = (Data,t) => { 
  let token = JSON.parse(localStorage.getItem("token"));
  return ((dispatch) => {
      dispatch(getCommitteeTypes_Init());
      let form = new FormData();
      form.append("RequestData", JSON.stringify(Data));
      form.append("RequestMethod", GetallOrganizationCommitteType.RequestMethod);
      axios({
          method: "post",
          url: getCommitteesApi,
          data: form,
          headers: {
              _token: token
          }
      }).then(async (response) => {
          console.log(response, "response")
          if (response.data.responseCode === 417) {
              await dispatch(RefreshToken(t));
          } else if (response.data.responseCode === 200) {
              console.log(response, "response")
              if (response.data.responseResult.isExecuted === true) {
                  console.log(response, "response")
                  if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetallOrganizationCommitteType_01".toLowerCase())) {
                      await dispatch(getCommitteeTypes_Success(response.data.responseResult.committeeTypes, t("Data-available")))
                  } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetallOrganizationCommitteType_02".toLowerCase())) {
                      dispatch(getCommitteeTypes_Fail(t("No-data-available")))
                  } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetallOrganizationCommitteType_03".toLowerCase())) {
                      dispatch(getCommitteeTypes_Fail(t("No-data-available")))

                  } else {
                      console.log(response, "response")
                      dispatch(getCommitteeTypes_Fail(t("Something-went-wrong")))
                  }
              } else {
                  console.log(response, "response")
                  dispatch(getCommitteeTypes_Fail(t("Something-went-wrong")))
              }
          }
      }).catch((response) => {
          console.log(response, "response")
          dispatch(getCommitteeTypes_Fail(t("Something-went-wrong")))
      })
  })
}

const getCommitteeMembersRole_Init = () => {
  return {
    type: actions.GET_COMMITTEE_MEMBERS_ROLES_INIT
  }
}
const getCommitteeMembersRole_Success = (response, message) => {
  return {
    type: actions.GET_COMMITTEE_MEMBERS_ROLES_SUCCESS,
    response: response,
    message: message

  }
}
const getCommitteeMembersRole_Fail = (message) => { 
  return {
    type: actions.GET_COMMITTEE_MEMBERS_ROLES_FAIL,
    message: message
  }
}
const getCommitteeMembersRole = (Data,t) => { 
  let token = JSON.parse(localStorage.getItem("token"));
  return ((dispatch) => {
      dispatch(getCommitteeMembersRole_Init());
      let form = new FormData();
      form.append("RequestData", JSON.stringify(Data));
      form.append("RequestMethod", GetallOrganizationCommitteMemberRole.RequestMethod);
      axios({
          method: "post",
          url: getCommitteesApi,
          data: form,
          headers: {
              _token: token
          }
      }).then(async (response) => {
          console.log(response, "response")
          if (response.data.responseCode === 417) {
              await dispatch(RefreshToken(t));
          } else if (response.data.responseCode === 200) {
              console.log(response, "response")
              if (response.data.responseResult.isExecuted === true) {
                  console.log(response, "response")
                  if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_01".toLowerCase())) {
                      await dispatch(getCommitteeMembersRole_Success(response.data.responseResult.groupTypes, t("Data-available")))
                  } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_02".toLowerCase())) {
                      dispatch(getCommitteeMembersRole_Fail(t("No-data-available")))
                  } else if (response.data.responseResult.responseMessage.toLowerCase().includes("Committees_CommitteeServiceManager_GetallOrganizationCommitteMemberRole_03".toLowerCase())) {
                      dispatch(getCommitteeMembersRole_Fail(t("No-data-available")))

                  } else {
                      console.log(response, "response")
                      dispatch(getCommitteeMembersRole_Fail(t("Something-went-wrong")))
                  }
              } else {
                  console.log(response, "response")
                  dispatch(getCommitteeMembersRole_Fail(t("Something-went-wrong")))
              }
          }
      }).catch((response) => {
          console.log(response, "response")
          dispatch(getCommitteeMembersRole_Fail(t("Something-went-wrong")))
      })
  })
}
export {
  getAllCommitteesByUserIdActions,
  getallcommitteebyuserid_clear,
  getCommitteeTypes,
  getCommitteeMembersRole
  //   createcommittee,
};
