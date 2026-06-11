import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { validateEmailActionToken } from "../../store/actions/EmailAction_action";
import { EMAIL_ACTION_ROUTES } from "./emailActionRoutes";

/**
 * Landing page for email action links.
 *
 * URL formats supported:
 *   /Diskus/email_action?token=<uniqueToken>
 *   /Diskus/email_action?<uniqueToken>   (opaque query string)
 *
 * Flow:
 *   1. Extract token from URL search params or localStorage (set by
 *      private_routes.js when the user was not yet authenticated).
 *   2. Call ServiceManager.ValidateEmailActionToken with the token.
 *   3. On success: store the returned payload in the mapped localStorage key
 *      and navigate to the appropriate page.
 *   4. On error: show a message and redirect to home after a short delay.
 */
const EmailActionHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Support both ?token=VALUE and opaque ?VALUE query formats
    const token =
      searchParams.get("token") ||
      (window.location.search.length > 1
        ? window.location.search.slice(1)
        : null) ||
      localStorage.getItem("emailActionToken");

    // Always clean up, whether we use it or not
    localStorage.removeItem("emailActionToken");

    if (!token) {
      navigate("/Diskus/", { replace: true });
      return;
    }

    dispatch(
      validateEmailActionToken(
        token,
        (actionType, payload) => {
          const config = EMAIL_ACTION_ROUTES[actionType];
          if (config) {
            if (payload != null) {
              localStorage.setItem(config.key, payload);
            }
            navigate(config.route, { replace: true });
          } else {
            // Unknown action type — go home
            navigate("/Diskus/", { replace: true });
          }
        },
        (errMsg) => {
          setErrorMsg(errMsg || t("Something-went-wrong"));
          setTimeout(() => navigate("/Diskus/", { replace: true }), 2500);
        },
      ),
    );
  }, []);

  if (errorMsg) {
    return (
      <section className="spinLoaderMain">
        <p style={{ color: "#ff4d4f", marginTop: "12px", fontSize: "14px" }}>
          {errorMsg}
        </p>
      </section>
    );
  }

  return (
    <section className="spinLoaderMain">
      <Spin size="large" tip={t("Loading")} />
    </section>
  );
};

export default EmailActionHandler;
