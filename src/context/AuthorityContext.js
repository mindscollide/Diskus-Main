import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Create the Context
const AuthorityContext = createContext();
// Create a Provider component
export const AuthorityProvider = ({ children }) => {
  const countryNamesReducerCountryNamesData = useSelector(
    (state) => state.countryNamesReducer.CountryNamesData
  );

  const [countryNames, setCountryNames] = useState([]);

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
  const [searchCountryId, setSearchCountryId] = useState({
    label: "",
    value: 0,
  });

  const [dataAfterSearch, setDataAfterSearch] = useState(false);

  const [closeConfirmationModal, setCloseConfirmationModal] = useState(false);
  const [searchPayload, setSearchPayload] = useState({
    shortCode: "",
    authorityName: "",

    countryId: 0,
    sector: "",
    authorityTitle: "",
    sRow: 0,
    length: 10,
  });

  const [authorityId, setAuthorityId] = useState("");

  const [searchbox, setsearchbox] = useState(false);
  const [selectCountry, setSelectCountry] = useState(null);

  useEffect(() => {
    if (
      countryNamesReducerCountryNamesData !== null &&
      countryNamesReducerCountryNamesData !== undefined
    ) {
      let newCountryMapData = countryNamesReducerCountryNamesData.map(
        (data, index) => {
          return {
            ...data,
            value: data.pK_WorldCountryID,
            label: data.countryName,
          };
        }
      );
      setCountryNames(newCountryMapData);
    }
    return () => {
      setSelectCountry(null);
    };
  }, [countryNamesReducerCountryNamesData]);

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
        searchCountryId,
        setSearchCountryId,
        countryNames,
        setCountryNames,
        selectCountry,
        setSelectCountry,
        dataAfterSearch,
        setDataAfterSearch,
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
