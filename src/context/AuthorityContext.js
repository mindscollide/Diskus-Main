import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

/**
 * @context AuthorityContext
 * @description Provides state management for the Authority (regulatory body) module,
 * including the add/edit/view modal flow, column sort orders, status and country
 * filters, a paginated search payload, and a country names lookup list populated
 * from the Redux store.
 *
 * @provides {boolean}  addEditViewAuthoriyModal  - Whether the authority add/edit/view modal is open
 * @provides {number}   authorityViewState        - Current modal mode (0 = add, 1 = edit, 2 = view)
 * @provides {Object}   searchPayload             - Paginated search/filter payload sent to the API
 * @provides {boolean}  searchbox                 - Whether the search input bar is visible
 * @provides {string|null} authorityNameSort      - Sort direction for the authority-name column ("ascend" | "descend" | null)
 * @provides {string|null} shortCodeSort          - Sort direction for the short-code column
 * @provides {string|null} countrySort            - Sort direction for the country column
 * @provides {string|null} sectorSort             - Sort direction for the sector column
 * @provides {Array}    statusOptions             - Available status dropdown options
 * @provides {boolean}  visible                   - Whether the status filter popover is visible
 * @provides {string}   authorityId               - ID of the authority currently selected for edit/view
 * @provides {boolean}  closeConfirmationModal    - Whether the discard-changes confirmation modal is open
 * @provides {Array<string>} statusFilter         - Active status filter values (default: ["Active", "Inactive"])
 * @provides {Object}   searchCountryId           - Selected country filter option ({ label, value })
 * @provides {Array}    countryNames              - Country name options mapped from Redux (value = pK_WorldCountryID, label = countryName)
 * @provides {Object|null} selectCountry          - Currently selected country object in the filter
 * @provides {boolean}  dataAfterSearch           - Whether the table is showing post-search results
 *
 * Usage:
 *   import { useAuthorityContext } from '../context/AuthorityContext';
 *   const { addEditViewAuthoriyModal, setAddEditViewAuthoriyModal } = useAuthorityContext();
 */

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
 * @hook useAuthorityContext
 * @description Consumes AuthorityContext and returns all authority UI state values
 *   and setters. Throws an error if called outside of AuthorityProvider.
 * @returns {Object} All authority state values and setter functions from AuthorityProvider
 */
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
