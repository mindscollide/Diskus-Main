import React from "react";
import { Select } from "antd";
import styles from "./Filter-Bar.module.css";
const { Option } = Select;

/**
 * @component FilterBar
 * @description A searchable select dropdown used as a filter control in list and table
 * views across the application. Built on Ant Design's Select component, it renders a
 * custom list-icon as the dropdown suffix and applies case-insensitive client-side
 * filtering so users can type to narrow down the available options.
 *
 * Each entry in `Options` requires `value` (the internal key submitted on change) and
 * `title` (the human-readable label displayed in the list). The component is safe
 * against a null/undefined `Options` prop — no items are rendered in that case.
 *
 * @param {Function}                    change        - Callback invoked with the selected
 *                                                      option's `value` when the user makes
 *                                                      a selection.
 * @param {Array<{value: *, title: string}>} [Options] - Array of option objects to populate
 *                                                      the dropdown menu.
 * @param {string}                      [placeholder] - Placeholder text shown when no option
 *                                                      is selected.
 * @param {*}                           [defaultValue]- Pre-selected value rendered on first mount.
 *
 * @example
 * <FilterBar
 *   Options={[{ value: "all", title: "All" }, { value: "active", title: "Active" }]}
 *   placeholder="Filter by status"
 *   change={(val) => setStatusFilter(val)}
 * />
 */
const FilterBar = ({ change, Options, placeholder, defaultValue }) => {
  return (
    <>
      <Select
        onChange={(value) => change(value)}
        suffixIcon={<i className="icon-list icon-size-one Iconstyle"></i>}
        className={styles["FieldStyle"]}
        placeholder={placeholder}
        defaultValue={defaultValue}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {Options
          ? Options.map((item, index) => {
              return (
                <Option key={index} value={item.value}>
                  {item.title}
                </Option>
              );
            })
          : null}
      </Select>
    </>
  );
};

export default FilterBar;
