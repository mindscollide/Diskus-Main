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
  locale,
  scroll,
  footer,
  prefixClassName,
  size,
}) => {
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
        footer={footer}
        locale={locale}
        prefixCls={prefixClassName}
        scroll={scroll}
        size={size}
      />
    </>
  );
};

export default CustomTable;
