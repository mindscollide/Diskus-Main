import React from "react";
import { Select } from "antd";
import styles from "./Filter-Bar.module.css";
const { Option } = Select;

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
