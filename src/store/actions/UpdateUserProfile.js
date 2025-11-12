import * as actions from "../action_types";
import {
  settingApi,
  authenticationApi,
} from "../../commen/apis/Api_ends_points";

import {
  updateUserProfileSetting,
  updateProfilePictureRM,
} from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import axios from "axios";
import { getUserDetails, getUserSetting } from "../actions/GetUserSetting";
import axiosInstance from "../../commen/functions/axiosInstance";

const updateuserprofileinit = () => {
  return {
    type: actions.UPDATEUSERPROFILE_INIT,
  };
};
const updateuserprofilesuccess = (message, response) => {
  return {
    type: actions.UPDATEUSERPROFILE_SUCCESS,
    response: response,
    message: message,
  };
};
const updateuserprofilefail = (message, response) => {
  return {
    type: actions.UPDATEUSERPROFILE_FAIL,
    message: message,
    response: response,
  };
};

const updateUserProfile = (navigate, userProfileData, t) => {
  let currentUserID = localStorage.getItem("userID");

  let token = JSON.parse(localStorage.getItem("token"));
  let Data = {
    UserProfile: {
      PK_UID: userProfileData.PK_UID,
      Name: userProfileData.Name,
      Designation: userProfileData.Designation,
      ProfilePicture: userProfileData.ProfilePicture,
      Organization: userProfileData.Organization,
      CountryCode: userProfileData.CountryCode,
      EmailAddress: userProfileData.EmailAddress,
      Password: userProfileData.Password,
      MobileNumber: userProfileData.MobileNumber,
    },
  };

  return (dispatch) => {
    dispatch(updateuserprofileinit());
    let form = new FormData();
    form.append("RequestMethod", updateUserProfileSetting.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));

    axiosInstance
    .post(settingApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateUserProfile(navigate, userProfileData, t));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              updateuserprofilesuccess(
                response.data.responseResult.responseMessage,
                response.data.responseResult
              )
            );
            await dispatch(
              getUserSetting(navigate, JSON.parse(currentUserID), false)
            );
          } else {
            dispatch(updateuserprofilefail());
          }
        } else {
          dispatch(updateuserprofilefail(response.data.responseMessage));
        }
      })
      .catch((response) => {
        dispatch(updateuserprofilefail(response.data.responseMessage));
      });
  };
};

const updateUserPicture_init = () => {
  return {
    type: actions.UPDATE_PROFILE_PICTURE_INIT,
  };
};
const updateUserPicture_success = (response, message) => {
  return {
    type: actions.UPDATE_PROFILE_PICTURE_SUCCESS,
    response: response,
    message: message,
  };
};
const updateUserPicture_fail = (message) => {
  return {
    type: actions.UPDATE_PROFILE_PICTURE_FAIL,
    message: message,
  };
};

const updateUserProfilePicture = (navigate, t, fileName, base64) => {
  let currentUserID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let Data = {
    FK_UserID: Number(currentUserID),
    FK_OrganizationID: Number(OrganizationID),
    Base64Img: base64,
    FileName: fileName,
  };

  return (dispatch) => {
    dispatch(updateUserPicture_init());
    let form = new FormData();
    form.append("RequestMethod", updateProfilePictureRM.RequestMethod);
    form.append("RequestData", JSON.stringify(Data));
    axiosInstance.post(authenticationApi, form)
      .then(async (response) => {
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken(navigate, t));
          dispatch(updateUserProfilePicture(navigate, t, fileName, base64));
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UpdateProfilePicture_01".toLowerCase()
                )
            ) {
              dispatch(
                updateUserPicture_success(
                  response.data.responseResult,
                  t("Profile-picture-updated")
                )
              );
              dispatch(
                getUserDetails(navigate, currentUserID, t, OrganizationID)
              );
              dispatch(getUserSetting(navigate, t, false));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UpdateProfilePicture_02".toLowerCase()
                )
            ) {
              dispatch(
                updateUserPicture_fail(t("Failed-to-update-profile-picture"))
              );
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UpdateProfilePicture_03".toLowerCase()
                )
            ) {
              dispatch(updateUserPicture_fail(t("Base64-string-is-required")));
            } else if (
              response.data.responseResult.responseMessage
                .toLowerCase()
                .includes(
                  "ERM_AuthService_SignUpManager_UpdateProfilePicture_04".toLowerCase()
                )
            ) {
              dispatch(updateUserPicture_fail(t("Something-went-wrong")));
            } else {
              dispatch(updateUserPicture_fail(t("Something-went-wrong")));
            }
          }
        }
      })
      .catch(() => {
        dispatch(updateUserPicture_fail(t("Something-went-wrong")));
      });
  };
};
export { updateUserProfile, updateUserProfilePicture };
