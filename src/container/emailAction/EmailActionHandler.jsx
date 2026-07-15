import React, { useEffect, useState } from "react";
import {
  replace,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { getHomeRoute } from "../../commen/functions/utils";
import { validateStringEmailApi } from "../../store/actions/NewMeetingActions";

/**
 * Landing page for email action links.
 *
 * URL formats supported:
 *   /Diskus/Redirect?<actionKey>_action=<encryptedToken>   (e.g. ?viewMeeting_action=...)
 *   /Diskus/Redirect?token=<encryptedToken>
 *   /Diskus/Redirect?<encryptedToken>   (opaque query string)
 *
 * Flow:
 *   1. Extract the token from URL search params (or localStorage, set by
 *      private_routes.js when the user was not yet authenticated).
 *   2. Call ServiceManager.ValidateEmailActionToken with the token.
 *   3. On success: look up the returned actionType in EMAIL_ACTION_ROUTES,
 *      store the payload under the mapped localStorage key, and navigate.
 *   4. On error: show a message and redirect to home after a short delay.
 */

const EmailActionHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    const validateToken = async () => {
      const token = location.search || localStorage.getItem("emailActionToken");

      if (!token) {
        setErrorMsg(t("Invalid or missing action link."));
        setTimeout(() => navigate(getHomeRoute()), 2000);
        return;
      }

      const index = token.indexOf("=");
      const key = token.slice(0, index).replace(/^\?/, "");
      const value = token.slice(index + 1);
      // 1 is Quick Meeting, 2 is Board Meeting, 3 is Committee Meeting and 4 is Group Meeting
      switch (key) {
        case "viewMeeting_action": {
          const response = await validateStringEmailApi(
            value,
            navigate,
            t,
            1,
            dispatch,
          );
          if (response.standardMeetingType === 2) {
            navigate("/Diskus/Meeting", {
              state: {
                key: "viewMeeting_action",
                value: response,
              },
              replace: true,
            });
            localStorage.removeItem("emailActionToken");
            return;
          }
          if (response.standardMeetingType === 3) {
            navigate("/Diskus/Committee", {
              state: {
                key: "committee_viewMeeting_action",
                value: response,
              },
              replace: true,
            });
            localStorage.removeItem("emailActionToken");
            return;
          }

          if (response.standardMeetingType === 4) {
            navigate("/Diskus/Groups", {
              state: {
                key: "group_viewMeeting_action",
                value: response,
              },
              replace: true,
            });
            localStorage.removeItem("emailActionToken");
            return;
          }
          break;
        }

        case "meetingAction": {
          // Your logic here
          break;
        }

        default: {
          setErrorMsg(t("Invalid or missing action link."));
          break;
        }
      }

      console.log({ key, value }, "locationlocationlocation");
    };

    validateToken();
  }, [dispatch, location.search, navigate, t]);
  if (errorMsg) {
    return (
      <section className='spinLoaderMain'>
        <p style={{ color: "#ff4d4f", marginTop: "12px", fontSize: "14px" }}>
          {errorMsg}
        </p>
      </section>
    );
  }

  return (
    <section className='spinLoaderMain'>
      <Spin size='large' tip={t("Loading")} />
    </section>
  );
};

export default EmailActionHandler;
