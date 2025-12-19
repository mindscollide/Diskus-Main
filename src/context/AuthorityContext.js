import React, { createContext, useContext, useState } from "react";

// Create the Context
const AuthorityContext = createContext();
// Create a Provider component
export const AuthorityProvider = ({ children }) => {
  const [addEditViewAuthoriyModal, setAddEditViewAuthoriyModal] =
    useState(false);
  const [shortCodeSort, setShortCodeSort] = useState("ascend");
  const [authorityNameSort, setAuthorityNameSort] = useState(null);
  const [countrySort, setCountrySort] = useState(null);
  const [sectorSort, setSectorSort] = useState(null);
  const [authorityViewState, setAuthorityViewState] = useState(0);
  const [statusOptions, setStatusOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);

  const [closeConfirmationModal, setCloseConfirmationModal] = useState(false);
  const [searchPayload, setSearchPayload] = useState({
    shortCode: "",
    authorityName: "",
    country: "",
    sector: "",
    authorityTitle: "",
    sRow: 0,
    length: 100,
  });

  const [authorityId, setAuthorityId] = useState("");

  const [searchbox, setsearchbox] = useState(false);

  return (
    <AuthorityContext.Provider
      value={{
        setAddEditViewAuthoriyModal,
        addEditViewAuthoriyModal,
        authorityViewState,
        setAuthorityViewState,
        searchPayload,
        setSearchPayload,
        searchbox,
        setsearchbox,
        shortCodeSort,
        setShortCodeSort,
        authorityNameSort,
        setAuthorityNameSort,
        countrySort,
        setCountrySort,
        sectorSort,
        setSectorSort,
        statusOptions,
        setStatusOptions,
        visible,
        setVisible,
        authorityId,
        setAuthorityId,
        closeConfirmationModal,
        setCloseConfirmationModal,
        statusFilter,
        setStatusFilter,
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
