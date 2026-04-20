/**
 * @file AuthContext.js
 * @description Manages authentication-related functionality for the application.
 * Handles the sign-out flow including Redux state reset, localStorage/sessionStorage
 * cleanup, and preservation of "remember me" preferences across sessions.
 *
 * Exposed values:
 * - `signOut` {Function} - Clears session data and redirects the user to the login page
 *   while preserving any "remember email/password" settings if applicable.
 *
 * Consumed by components that need to trigger a sign-out action, such as the
 * navigation bar, user profile menu, and session-timeout handlers.
 */

import React, { createContext, useContext } from "react";
import { initaialStateFun } from "../store/actions/Auth_Sign_Out";
import { useDispatch } from "react-redux";
import { LoginFlowRoutes } from "../store/actions/UserManagementActions";

// Create the Context
export const AuthContext = createContext();

/**
 * AuthProvider component that supplies authentication utilities (e.g. signOut)
 * to the component tree via AuthContext.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the context.
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const signOut = () => {
    dispatch(initaialStateFun());
    window.location.href = "/";
    let RememberEmailLocal = JSON.parse(localStorage.getItem("rememberEmail"));
    let RememberPasswordLocal = JSON.parse(
      localStorage.getItem("remeberPassword")
    );
    let reLang = localStorage.getItem("i18nextLng");
    if (RememberEmailLocal === true && RememberPasswordLocal === true) {
      let RememberEmailLocalValue = localStorage.getItem("rememberEmailValue");

      let RememberPasswordLocalValue = localStorage.getItem(
        "rememberPasswordValue"
      );

      localStorage.clear();
      sessionStorage.clear()

      if (reLang !== undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      localStorage.setItem("remeberPassword", RememberPasswordLocal);
      localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
      localStorage.setItem("rememberEmail", RememberEmailLocal);
      localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
    } else if (RememberEmailLocal === true) {
      let RememberEmailLocalValue = localStorage.getItem("rememberEmailValue");

      localStorage.clear();
      sessionStorage.clear()
      if (reLang !== undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      localStorage.setItem("rememberEmail", RememberEmailLocal);
      localStorage.setItem("rememberEmailValue", RememberEmailLocalValue);
    } else if (RememberPasswordLocal === true) {
      let RememberPasswordLocalValue = localStorage.getItem(
        "rememberPasswordValue"
      );

      localStorage.clear();
      sessionStorage.clear()
      if (reLang !== undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      localStorage.setItem("remeberPassword", RememberPasswordLocal);
      localStorage.setItem("rememberPasswordValue", RememberPasswordLocalValue);
    } else {
      localStorage.clear();
      if (reLang !== undefined && reLang != null) {
        localStorage.setItem("i18nextLng", reLang);
      }
      localStorage.setItem("rememberEmail", false);
      localStorage.setItem("rememberEmailValue", "");
      localStorage.setItem("remeberPassword", false);
      localStorage.setItem("rememberPasswordValue", "");
    }
    localStorage.setItem("LoginFlowPageRoute", 1);
    dispatch(LoginFlowRoutes(1));
  };
  return (
    <AuthContext.Provider value={{ signOut }}>{children}</AuthContext.Provider>
  );
};

/**
 * Custom hook to consume AuthContext.
 * Must be used within an {@link AuthProvider}.
 *
 * @returns {{ signOut: Function }} The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useCommitteeContext must be used within a CommittteeProvider"
    );
  }

  return context;
};
