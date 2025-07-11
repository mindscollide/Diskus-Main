import React, { createContext, useContext } from "react";
import { initaialStateFun } from "../store/actions/Auth_Sign_Out";
import { useDispatch } from "react-redux";
import { LoginFlowRoutes } from "../store/actions/UserManagementActions";

// Create the Context
export const AuthContext = createContext();

// Create a Provider component
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

// Custom Hook to consume the context
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useCommitteeContext must be used within a CommittteeProvider"
    );
  }

  return context;
};
