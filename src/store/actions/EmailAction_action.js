import axiosInstance from "../../commen/functions/axiosInstance";
import { meetingApi } from "../../commen/apis/Api_ends_points";
import { validateEmailActionTokenRM } from "../../commen/apis/Api_config";
import { RefreshToken } from "./Auth_action";

export const validateEmailActionToken = (token, onSuccess, onError) => {
  return async (dispatch) => {
    try {
      const form = new FormData();
      form.append("RequestMethod", validateEmailActionTokenRM.RequestMethod);
      form.append("RequestData", JSON.stringify({ Token: token }));

      const response = await axiosInstance.post(meetingApi, form);

      if (response.data.responseCode === 417) {
        await dispatch(RefreshToken());
        dispatch(validateEmailActionToken(token, onSuccess, onError));
        return;
      }

      if (
        response.data.responseCode === 200 &&
        response.data.responseResult?.isExecuted === true
      ) {
        const { actionType, payload } = response.data.responseResult;
        onSuccess(actionType, payload);
      } else {
        onError(
          response.data.responseResult?.responseMessage ||
            "Invalid or expired link.",
        );
      }
    } catch {
      onError("Something went wrong. Please try again.");
    }
  };
};
