import React, { useState } from "react";
import { Dropdown, Menu } from "antd";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/elements";
import Tick from "../../../assets/images/Tick-Icon.png";
import {
  POLL_STATUS_VALUES,
  getPollStatusFilters,
} from "../../../components/elements/pollStatus/pollStatusFilters";

// Status filter (chevron + Published / UnPublished / Expired menu with Reset / Ok) of
// the polls tables of Polling, Group and Committee.
//  - allRows: every row, before filtering
//  - setRows: setter of the rows the table shows
//  - resetClassName / okClassName: classes of the two buttons (they live in the CSS
//    module of each screen)
// Returns the column props to spread into the Status column:
//   { ...statusFilterProps, title, dataIndex, ... }
const usePollStatusFilter = ({
  allRows,
  setRows,
  resetClassName,
  okClassName,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState(POLL_STATUS_VALUES);
  const filters = getPollStatusFilters(t);

  const handleMenuClick = (filterValue) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)],
    );
  };

  const handleApplyFilter = () => {
    setRows(
      allRows.filter((item) =>
        selectedValues.includes(item.pollStatus.status.toString()),
      ),
    );
    setVisible(false);
  };

  const resetFilter = () => {
    setSelectedValues(POLL_STATUS_VALUES);
    setRows(allRows);
    setVisible(false);
  };

  const menu = (
    <Menu>
      {filters.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => handleMenuClick(filter.value)}
          className='d-flex align-items-center justify-content-between'>
          <div className='Polls_Menu_items'>
            <span
              className={
                filter.value === "Published"
                  ? "userstatus-signal-PublishedPolls_Menu"
                  : filter.value === "UnPublished"
                    ? "userstatus-signal-Unpublished_Menu"
                    : "userstatus-signal-disabled_Menu"
              }></span>
            <span className='menu-text'>{filter.text}</span>
            {selectedValues.includes(filter.value) && (
              <span className='checkmark'>
                <img src={Tick} alt='' />
              </span>
            )}
          </div>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex align-items-center justify-content-between p-2'>
        <Button
          text={"Reset"}
          className={resetClassName}
          onClick={resetFilter}
        />
        <Button
          text={t("Ok")}
          disableBtn={selectedValues.length === 0}
          className={okClassName}
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );

  return {
    filterResetToDefaultFilteredValue: true,
    filterIcon: () => (
      <ChevronDown
        className='ChevronPolls'
        onClick={() => setVisible((prevVisible) => !prevVisible)}
      />
    ),
    filterDropdown: () => (
      <Dropdown
        overlay={menu}
        open={visible}
        onOpenChange={(open) => setVisible(open)}>
        <div />
      </Dropdown>
    ),
  };
};

export default usePollStatusFilter;
