import * as actions from "../action_types";
import { settingApi } from "../../commen/apis/Api_ends_points";
import { updateUserProfileSetting } from "../../commen/apis/Api_config";
import { RefreshToken } from "../actions/Auth_action";
import axios from "axios";
import { getUserSetting } from "../actions/GetUserSetting";

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

const updateUserProfile = (userProfileData) => {
  let currentUserID = localStorage.getItem("userID");
  console.log(userProfileData);
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
    console.log("UserProfile", Data);
    axios({
      method: "post",
      url: settingApi,
      data: form,
      headers: {
        _token: token,
      },
    })
      .then(async (response) => {
        console.log(
          "update user profile setting",
          response.data.responseResult.responseMessage
        );
        if (response.data.responseCode === 417) {
          await dispatch(RefreshToken());
        } else if (response.data.responseCode === 200) {
          if (response.data.responseResult.isExecuted === true) {
            await dispatch(
              updateuserprofilesuccess(
                response.data.responseResult.responseMessage,
                response.data.responseResult
              )
            );
            await dispatch(getUserSetting(JSON.parse(currentUserID)));
          } else {
            dispatch(updateuserprofilefail());
          }
        } else {
          dispatch(updateuserprofilefail(response.data.responseMessage));
        }
      })
      .catch((response) => {
        dispatch(updateuserprofilefail(response.data.responseMessage));
        console.log("catch response", response);
      });
  };
};

export default updateUserProfile;
