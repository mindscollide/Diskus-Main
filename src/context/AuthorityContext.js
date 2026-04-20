/**
 * @file AuthorityContext.js
 * @description Manages state for the Authority (regulatory authority) management feature.
 * Handles listing, searching, sorting, filtering, and add/edit/view modal state for
 * regulatory authorities. Country name data is sourced from the Redux store and
 * transformed into select-compatible options.
 *
 * Exposed values (selected highlights):
 * - `addEditViewAuthoriyModal` {boolean} - Whether the add/edit/view authority modal is open.
 * - `authorityViewState` {number} - Current view mode (0 = list, 1 = add, 2 = edit, 3 = view).
 * - `searchPayload` {object} - Current search/filter criteria for the authority list.
 * - `authorityNameSort`, `shortCodeSort`, `countrySort`, `sectorSort` - Active sort directions.
 * - `statusFilter` {string[]} - Active status filters (e.g. ["Active", "Inactive"]).
 * - `countryNames` {Array} - Country options mapped for use in select inputs.
 * - `authorityId` {string} - ID of the authority currently being edited or viewed.
 * - `closeConfirmationModal` {boolean} - Whether the unsaved-changes confirmation modal is open.
 *
 * Consumed by authority listing tables, the add/edit/view authority form, and
 * search/filter controls within the compliance settings area.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Create the Context
const AuthorityContext = createContext();

/**
 * AuthorityProvider component that supplies authority management state and
 * search/filter controls to the component tree via AuthorityContext.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the context.
 * @returns {JSX.Element}
 */
export const AuthorityProvider = ({ children }) => {
  const countryNamesReducerCountryNamesData = useSelector(
    (state) => state.countryNamesReducer.CountryNamesData
  );

  const [countryNames, setCountryNames] = useState([]);

  const [addEditViewAuthoriyModal, setAddEditViewAuthoriyModal] =
    useState(false);
  const [authorityNameSort, setAuthorityNameSort] = useState("ascend");
  const [shortCodeSort, setShortCodeSort] = useState(null);
  const [countrySort, setCountrySort] = useState(null);
  const [sectorSort, setSectorSort] = useState(null);
  const [authorityViewState, setAuthorityViewState] = useState(0);
  const [statusOptions, setStatusOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState(["Active", "Inactive"]);
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

/**
 * Custom hook to consume AuthorityContext.
 * Must be used within an {@link AuthorityProvider}.
 *
 * @returns {object} The authority management context value.
 * @throws {Error} If used outside of an AuthorityProvider.
 */
export const useAuthorityContext = () => {
  const context = useContext(AuthorityContext);

  if (!context) {
    throw new Error(
      "useAuthorityContext must be used within a AuthorityProvider"
    );
  }

  return context;
};
