import React, { createContext, useContext, useState } from "react";

// Create the Context
const AuthorityContext = createContext();
// Create a Provider component
export const AuthorityProvider = ({ children }) => {
  const [shortCodeSort, setShortCodeSort] = useState(null);
  const [authorityNameSort, setAuthoritySort] = useState(null);
  const [countrySort, setCountrySort] = useState(null);
  const [sectorSort, setSectorSort] = useState(null);
  const [authorityViewState, setAuthorityViewState] = useState(1);
  const [statusOptions, setStatusOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchPayload, setSearchPayload] = useState({
    shortCode: "",
    authorityName: "",
    country: "",
    sector: "",
    authorityTitle: "",
  });

  const [searchbox, setsearchbox] = useState(false);

  return (
    <AuthorityContext.Provider
      value={{
        authorityViewState,
        setAuthorityViewState,
        searchPayload,
        setSearchPayload,
        searchbox,
        setsearchbox,
        shortCodeSort,
        setShortCodeSort,
        authorityNameSort,
        setAuthoritySort,
        countrySort,
        setCountrySort,
        sectorSort,
        setSectorSort,
        statusOptions,
        setStatusOptions,
        visible,
        setVisible,
      }}
    >
      {children}
    </AuthorityContext.Provider>
  );
};

// Custom Hook to consume the context
export const useAuthorityContext = () => {
  const context = useContext(AuthorityContext);

  if (!context) {
    throw new Error(
      "useAuthorityContext must be used within a AuthorityProvider"
    );
  }

  return context;
};
