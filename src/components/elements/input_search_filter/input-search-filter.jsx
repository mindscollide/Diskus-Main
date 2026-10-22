import "./input-search-filter.css";
import TextField from "./../input_field/Input_field";

/**
 * @component InputSearchFilter
 * @description A composite search-with-dropdown component used throughout the application
 * for filtering lists (e.g. assignees, shared-folder members). It combines a text input
 * (via the shared TextField element) with a conditionally rendered dropdown panel that
 * displays filtered results provided by the parent via `filteredDataHandler`.
 *
 * The dropdown panel is hidden when `onclickFlag` is true, allowing the parent to
 * programmatically collapse the suggestions (e.g. after a selection is made).
 * The `flag` prop switches the dropdown CSS class to accommodate different layout
 * contexts: flag === 1 applies the "dropdown-assignee_sharefolder" class (wider panel
 * used inside the share-folder flow), otherwise "dropdown-assignee" is used.
 *
 * @param {boolean}        [onclickFlag]         - When true, the dropdown results panel
 *                                                 is hidden entirely.
 * @param {React.ReactNode} [filteredDataHandler] - Pre-rendered list of filtered results
 *                                                 to display in the dropdown panel.
 * @param {string}         [value]               - Controlled value of the search text input.
 * @param {Function}       [change]              - onChange handler for the search text input.
 * @param {boolean}        [disable]             - When true, the text input is disabled.
 * @param {string}         [applyClass]          - CSS Module key forwarded to the TextField.
 * @param {string}         [placeholder]         - Placeholder text for the search input.
 * @param {string}         [labelclass]          - CSS class for the TextField label element.
 * @param {number}         [flag]                - Layout flag: 1 uses the share-folder dropdown
 *                                                 class; any other value uses the default class.
 *
 * @example
 * <InputSearchFilter
 *   value={searchText}
 *   change={(e) => setSearchText(e.target.value)}
 *   filteredDataHandler={<AssigneeList items={results} />}
 *   onclickFlag={dropdownClosed}
 *   placeholder="Search members..."
 * />
 */
const InputSearchFilter = ({
  onclickFlag,
  filteredDataHandler,
  value,
  change,
  disable,
  applyClass,
  placeholder,
  labelclass,
  flag,
}) => {
  return (
    <div className="search-container-assignee">
      <div className="search-inner-textfield">
        <TextField
          type="text"
          width={"100%"}
          labelclass={labelclass}
          value={value}
          change={change}
          placeholder={placeholder}
          disable={disable}
          applyClass={applyClass}
        />
      </div>
      {onclickFlag !== true ? (
        <div
          className={
            flag === 1 ? "dropdown-assignee_sharefolder" : "dropdown-assignee"
          }
        >
          {filteredDataHandler}
        </div>
      ) : null}
    </div>
  );
};

export default InputSearchFilter;
