import React from "react";
import { Table, Typography } from "antd";
import "./Table.css";
const CustomTable = ({
  column,
  rows,
  className,
  pagination,
  loading,
  id,
  labelTitle,
  expandable,
  onChange,
  locale
}) => {
  console.log("CustomTable", className);

  return (
    <>
      <h4 className="labelTitle">{labelTitle}</h4>
      <Table
        rowClassName={id}
        // rowSelection={rowSelection}
        columns={column}
        dataSource={rows}
        className={className}
        loading={loading}
        onChange={onChange}
        // bordered
        pagination={pagination}
        expandable={expandable}
        locale={locale}
        // scroll={scroll}
      />
    </>
  );
};

export default CustomTable;
